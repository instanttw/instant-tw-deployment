/**
 * API Route: Save WordPress Scan
 * Saves scan results to database for authenticated users
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createScan, createFinding, createWebsite, getWebsitesByUserId, canUserAddWebsite, updateWebsiteLastScan } from '@/lib/db-wpscan';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to save scans' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userPlan = session.user.plan || 'FREE';

    // Free users cannot save scans
    if (userPlan === 'FREE') {
      return NextResponse.json(
        { 
          error: 'Upgrade Required',
          message: 'Free users cannot save scans. Upgrade to Pro to save your scan history.',
          requiresUpgrade: true
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { url, scanData } = body;

    if (!url || !scanData) {
      return NextResponse.json(
        { error: 'Missing required fields: url and scanData' },
        { status: 400 }
      );
    }

    // Extract domain from URL
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Check if user has website monitoring limits
    const websites = await getWebsitesByUserId(userId);
    let website = websites.find(w => w.url === url);

    if (!website) {
      // Check if user can add more websites
      const canAdd = await canUserAddWebsite(userId);
      if (!canAdd) {
        return NextResponse.json(
          { 
            error: 'Website Limit Reached',
            message: 'You have reached your website limit. Upgrade your plan to monitor more websites.',
            requiresUpgrade: true
          },
          { status: 403 }
        );
      }

      // Create new website entry
      website = await createWebsite({
        user_id: userId,
        url: url,
        name: domain,
        scan_frequency: 'MANUAL',
      });
    }

    // Create scan record
    const createdScan = await createScan({
      website_id: website.id,
      user_id: userId,
      scan_duration_ms: scanData.scan_duration_ms,
      risk_score: scanData.risk_score,
      total_vulnerabilities: scanData.total_vulnerabilities,
      critical_count: scanData.severity_breakdown.critical || 0,
      high_count: scanData.severity_breakdown.high || 0,
      medium_count: scanData.severity_breakdown.medium || 0,
      low_count: scanData.severity_breakdown.low || 0,
      detection_confidence: scanData.detection_confidence,
      core_data: scanData.core,
      plugins_data: scanData.plugins,
      themes_data: scanData.themes,
      security_data: scanData.security,
      status: 'completed',
    });
    const scanId = createdScan.id;

    // Create vulnerability findings
    const findings = [];

    // Core vulnerabilities
    if (scanData.core.vulnerabilities > 0 && scanData.core.status === 'vulnerable') {
      findings.push({
        id: uuidv4(),
        scan_id: scanId,
        website_id: website.id,
        type: 'VULNERABILITY' as const,
        severity: 'HIGH' as const,
        title: `WordPress Core ${scanData.core.version} has known vulnerabilities`,
        description: `Your WordPress version ${scanData.core.version} is outdated. Latest version: ${scanData.core.latest_version}`,
        component_type: 'CORE' as const,
        component_slug: 'wordpress',
        component_name: 'WordPress Core',
        affected_version: scanData.core.version,
        fixed_in: scanData.core.latest_version,
        status: 'OPEN' as const,
      });
    }

    // Plugin vulnerabilities
    scanData.plugins.forEach((plugin: any) => {
      if (plugin.vulnerabilities > 0 || plugin.status === 'vulnerable') {
        findings.push({
          id: uuidv4(),
          scan_id: scanId,
          website_id: website.id,
          type: 'VULNERABILITY' as const,
          severity: plugin.vulnerabilities > 0 ? 'HIGH' as const : 'MEDIUM' as const,
          title: `${plugin.name} has known vulnerabilities`,
          description: `Plugin "${plugin.name}" version ${plugin.version} is outdated or vulnerable.${plugin.latest_version ? ` Latest version: ${plugin.latest_version}` : ''}`,
          component_type: 'PLUGIN' as const,
          component_slug: plugin.slug,
          component_name: plugin.name,
          affected_version: plugin.version,
          fixed_in: plugin.latest_version,
          status: 'OPEN' as const,
        });
      }
    });

    // Theme vulnerabilities
    scanData.themes.forEach((theme: any) => {
      if (theme.vulnerabilities > 0 || theme.status === 'vulnerable') {
        findings.push({
          id: uuidv4(),
          scan_id: scanId,
          website_id: website.id,
          type: 'VULNERABILITY' as const,
          severity: 'MEDIUM' as const,
          title: `${theme.name} theme has issues`,
          description: `Theme "${theme.name}" version ${theme.version} may have vulnerabilities.${theme.latest_version ? ` Latest version: ${theme.latest_version}` : ''}`,
          component_type: 'THEME' as const,
          component_slug: theme.slug,
          component_name: theme.name,
          affected_version: theme.version,
          fixed_in: theme.latest_version,
          status: 'OPEN' as const,
        });
      }
    });

    // Save all findings
    for (const finding of findings) {
      await createFinding(finding);
    }

    // Update website last scan
    await updateWebsiteLastScan(website.id);

    return NextResponse.json({
      success: true,
      scan: {
        id: scanId,
        url: url,
        scanned_at: createdScan.scanned_at,
        risk_score: scanData.risk_score,
        total_vulnerabilities: scanData.total_vulnerabilities,
        findings_count: findings.length,
      },
      message: 'Scan saved successfully',
    });

  } catch (error) {
    console.error('Error saving scan:', error);
    return NextResponse.json(
      { error: 'Failed to save scan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
