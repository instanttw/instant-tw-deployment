/**
 * API Route: Export Scan Report as PDF
 * Generates a PDF report for a saved scan
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db-neon';
import { generateScanReport } from '@/lib/pdf-generator';
import { PLAN_LIMITS } from '@/lib/db-wpscan';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }
    
    const { id: scanId } = await context.params;
    
    // Get user from database
    const users = await sql`
      SELECT id, plan FROM wp_scan_users
      WHERE email = ${session.user.email}
      LIMIT 1
    `;
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const user = users[0];
    
    // Check if user's plan allows PDF exports
    const planLimits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS];
    
    if (!planLimits.downloadReports) {
      return NextResponse.json(
        { error: 'PDF reports are not available on your plan. Upgrade to Pro or higher.' },
        { status: 403 }
      );
    }
    
    // Get scan data
    const scans = await sql`
      SELECT 
        s.id,
        s.scanned_at,
        s.risk_score,
        s.core_data,
        s.plugins_data,
        s.themes_data,
        s.vulnerabilities_data,
        w.url as website_url,
        w.user_id
      FROM wp_scan_scans s
      JOIN wp_scan_websites w ON s.website_id = w.id
      WHERE s.id = ${scanId}
      LIMIT 1
    `;
    
    if (scans.length === 0) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      );
    }
    
    const scan = scans[0];
    
    // Verify ownership
    if (scan.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You do not own this scan' },
        { status: 403 }
      );
    }
    
    // Get findings
    const findings = await sql`
      SELECT 
        severity,
        title,
        description,
        affected_item,
        affected_version,
        fixed_in,
        cve_id,
        cvss_score
      FROM wp_scan_findings
      WHERE scan_id = ${scanId}
      ORDER BY 
        CASE severity
          WHEN 'CRITICAL' THEN 1
          WHEN 'HIGH' THEN 2
          WHEN 'MEDIUM' THEN 3
          WHEN 'LOW' THEN 4
          ELSE 5
        END
    `;
    
    // Prepare scan data for PDF generation
    const scanData = {
      id: scan.id,
      websiteUrl: scan.website_url,
      scannedAt: scan.scanned_at,
      riskScore: scan.risk_score,
      core: scan.core_data,
      plugins: scan.plugins_data || [],
      themes: scan.themes_data || [],
      findings: findings.map((f: any) => ({
        severity: f.severity,
        title: f.title,
        description: f.description,
        affectedItem: f.affected_item,
        affectedVersion: f.affected_version,
        fixedIn: f.fixed_in,
        cveId: f.cve_id,
        cvssScore: f.cvss_score,
      })),
    };
    
    // Check for white-label settings (Agency+ plans)
    const whiteLabelOptions = planLimits.whiteLabel ? await getWhiteLabelSettings(user.id) : undefined;
    
    // Generate PDF
    const pdfBuffer = await generateScanReport(scanData, {
      includeDetails: true,
      includeCVSS: planLimits.showCVSSScores,
      whiteLabel: whiteLabelOptions,
    });
    
    // Return PDF as download
    const filename = `wp-scan-${scan.website_url.replace(/[^a-z0-9]/gi, '-')}-${new Date(scan.scanned_at).toISOString().split('T')[0]}.pdf`;
    
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF report',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Get white-label settings for Agency+ users
 */
async function getWhiteLabelSettings(userId: string) {
  const settings = await sql`
    SELECT settings FROM wp_scan_user_settings
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  
  if (settings.length === 0) {
    return undefined;
  }
  
  const userSettings = settings[0].settings;
  
  if (!userSettings.whiteLabel) {
    return undefined;
  }
  
  return {
    companyName: userSettings.whiteLabel.companyName,
    companyLogo: userSettings.whiteLabel.companyLogo,
    hideInstantBranding: userSettings.whiteLabel.hideInstantBranding || false,
    primaryColor: userSettings.whiteLabel.primaryColor || '#667eea',
  };
}
