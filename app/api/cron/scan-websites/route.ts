/**
 * API Route: Automated Website Scanning Cron Job
 * Runs daily at 2 AM UTC to scan websites based on plan frequency
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db-neon';
import { scanWordPressSite } from '@/lib/wordpress-scanner';
import { checkVulnerabilities } from '@/lib/vulnerability-checker';
import { sendVulnerabilityAlert } from '@/lib/email-service';
import { sendSlackVulnerabilityAlert } from '@/lib/slack-notifier';

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    console.error('CRON_SECRET not configured');
    return false;
  }
  
  return authHeader === `Bearer ${cronSecret}`;
}

// Get websites that need scanning based on their schedule
async function getWebsitesDueForScan() {
  const now = new Date();
  
  const websites = await sql`
    SELECT 
      w.id,
      w.url,
      w.user_id,
      w.scan_frequency,
      w.last_scanned_at,
      w.next_scan_at,
      u.plan,
      u.email,
      u.name
    FROM wp_scan_websites w
    JOIN wp_scan_users u ON w.user_id = u.id
    WHERE 
      w.is_active = true
      AND u.subscription_status = 'active'
      AND (
        w.next_scan_at IS NULL 
        OR w.next_scan_at <= ${now.toISOString()}
      )
    ORDER BY w.next_scan_at ASC NULLS FIRST
    LIMIT 100
  `;
  
  return websites;
}

// Calculate next scan time based on scan frequency
function calculateNextScanTime(frequency: string): Date {
  const now = new Date();
  
  switch (frequency) {
    case 'WEEKLY':
      now.setDate(now.getDate() + 7);
      break;
    case 'DAILY':
      now.setDate(now.getDate() + 1);
      break;
    case 'REALTIME':
      // For realtime, scan every 6 hours
      now.setHours(now.getHours() + 6);
      break;
    default:
      // Manual scans don't have next_scan_at
      return now;
  }
  
  return now;
}

// Scan a single website and save results
async function scanAndSaveWebsite(website: any) {
  try {
    console.log(`Scanning ${website.url}...`);
    
    // Run WordPress scan
    const scanResult = await scanWordPressSite(website.url);
    
    if (!scanResult.isWordPress) {
      console.log(`Skipping ${website.url} - Not a WordPress site`);
      return { success: false, reason: 'not_wordpress' };
    }
    
    // Check vulnerabilities
    const vulnerabilities = await checkVulnerabilities({
      core: scanResult.core,
      plugins: scanResult.plugins,
      themes: scanResult.themes,
    });
    
    // Calculate risk score
    const riskScore = calculateRiskScore(vulnerabilities);
    
    // Save scan to database
    const scanRecord = await sql`
      INSERT INTO wp_scan_scans (
        website_id,
        scanned_at,
        risk_score,
        core_data,
        plugins_data,
        themes_data,
        vulnerabilities_data
      ) VALUES (
        ${website.id},
        CURRENT_TIMESTAMP,
        ${riskScore},
        ${JSON.stringify(scanResult.core)}::jsonb,
        ${JSON.stringify(scanResult.plugins)}::jsonb,
        ${JSON.stringify(scanResult.themes)}::jsonb,
        ${JSON.stringify(vulnerabilities)}::jsonb
      )
      RETURNING id
    `;
    
    const scanId = scanRecord[0].id;
    
    // Save individual findings
    const allVulnerabilities = [
      ...vulnerabilities.core,
      ...Object.values(vulnerabilities.plugins).flat(),
      ...Object.values(vulnerabilities.themes).flat(),
    ];
    
    for (const vuln of allVulnerabilities) {
      await sql`
        INSERT INTO wp_scan_findings (
          scan_id,
          type,
          severity,
          title,
          description,
          cve_id,
          cvss_score,
          affected_item,
          affected_version,
          fixed_in,
          status
        ) VALUES (
          ${scanId},
          'VULNERABILITY',
          ${vuln.severity}::severity_type,
          ${vuln.title},
          ${vuln.description},
          ${vuln.cve_id || null},
          ${vuln.cvss_score || null},
          ${vuln.vuln_type || 'unknown'},
          ${vuln.affected_versions || null},
          ${vuln.fixed_in || null},
          'OPEN'
        )
      `;
    }
    
    // Update website's last scan time and schedule next scan
    const nextScanAt = calculateNextScanTime(website.scan_frequency);
    await sql`
      UPDATE wp_scan_websites
      SET 
        last_scanned_at = CURRENT_TIMESTAMP,
        next_scan_at = ${nextScanAt.toISOString()},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${website.id}
    `;
    
    console.log(`✅ Scanned ${website.url} - Risk: ${riskScore}, Vulnerabilities: ${allVulnerabilities.length}`);
    
    // Send notifications if vulnerabilities found
    if (allVulnerabilities.length > 0) {
      const criticalCount = allVulnerabilities.filter(v => v.severity === 'CRITICAL').length;
      const highCount = allVulnerabilities.filter(v => v.severity === 'HIGH').length;
      const dashboardUrl = `${process.env.NEXTAUTH_URL || 'https://wp.instant.tw'}/dashboard/wp-scan/scan/${scanId}`;
      
      // Send email alert
      if (website.email) {
        try {
          await sendVulnerabilityAlert({
            userName: website.name || website.email,
            websiteUrl: website.url,
            vulnerabilityCount: allVulnerabilities.length,
            criticalCount,
            highCount,
            riskScore,
            scanId,
            dashboardUrl,
            vulnerabilities: allVulnerabilities.map(v => ({
              severity: v.severity,
              title: v.title,
              affectedItem: v.vuln_type || 'unknown',
              cveId: v.cve_id,
            })),
          });
          
          console.log(`📧 Sent alert email to ${website.email}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${website.email}:`, emailError);
          // Don't fail the scan if email fails
        }
      }
      
      // Send Slack alert if configured
      try {
        const settings = await sql`
          SELECT settings FROM wp_scan_user_settings
          WHERE user_id = ${website.user_id}
          LIMIT 1
        `;
        
        if (settings.length > 0 && settings[0].settings?.notifications?.slack && 
            settings[0].settings?.notifications?.slackWebhookUrl) {
          
          await sendSlackVulnerabilityAlert(
            settings[0].settings.notifications.slackWebhookUrl,
            {
              websiteUrl: website.url,
              vulnerabilityCount: allVulnerabilities.length,
              criticalCount,
              highCount,
              riskScore,
              dashboardUrl,
            }
          );
          
          console.log(`💬 Sent Slack alert for ${website.url}`);
        }
      } catch (slackError) {
        console.error(`Failed to send Slack alert:`, slackError);
        // Don't fail the scan if Slack fails
      }
    }
    
    return {
      success: true,
      scanId,
      riskScore,
      vulnerabilityCount: allVulnerabilities.length,
      newVulnerabilities: allVulnerabilities.length, // TODO: Compare with previous scan
    };
    
  } catch (error) {
    console.error(`❌ Error scanning ${website.url}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Calculate risk score based on vulnerabilities
function calculateRiskScore(vulnerabilities: any): number {
  const severityWeights = {
    CRITICAL: 40,
    HIGH: 20,
    MEDIUM: 10,
    LOW: 5,
  };
  
  let score = 0;
  
  const allVulns = [
    ...vulnerabilities.core,
    ...Object.values(vulnerabilities.plugins).flat(),
    ...Object.values(vulnerabilities.themes).flat(),
  ];
  
  for (const vuln of allVulns) {
    score += severityWeights[vuln.severity as keyof typeof severityWeights] || 0;
  }
  
  return Math.min(100, score);
}

// Main cron handler
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    if (!verifyCronSecret(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('🕐 Starting scheduled website scans...');
    const startTime = Date.now();
    
    // Get websites due for scanning
    const websites = await getWebsitesDueForScan();
    
    if (websites.length === 0) {
      console.log('No websites due for scanning');
      return NextResponse.json({
        message: 'No websites due for scanning',
        scanned: 0,
        duration: Date.now() - startTime,
      });
    }
    
    console.log(`Found ${websites.length} websites to scan`);
    
    // Scan all websites (with rate limiting)
    const results = [];
    
    for (const website of websites) {
      const result = await scanAndSaveWebsite(website);
      results.push({
        url: website.url,
        ...result,
      });
      
      // Rate limiting: wait 2 seconds between scans
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Calculate statistics
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const totalVulnerabilities = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + (r.vulnerabilityCount || 0), 0);
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Scan complete: ${successful} successful, ${failed} failed, ${totalVulnerabilities} total vulnerabilities found`);
    console.log(`Duration: ${(duration / 1000).toFixed(2)}s`);
    
    return NextResponse.json({
      message: 'Scan complete',
      scanned: websites.length,
      successful,
      failed,
      totalVulnerabilities,
      duration,
      results: results.map(r => ({
        url: r.url,
        success: r.success,
        vulnerabilityCount: r.vulnerabilityCount,
      })),
    });
    
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        error: 'Cron job failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
