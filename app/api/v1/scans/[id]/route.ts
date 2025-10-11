/**
 * Public API v1: Get Scan Details
 * GET /api/v1/scans/{id}
 * 
 * Requires: Enterprise plan with API key
 * Rate limit: 1000 requests per 24 hours
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-key-manager';
import { checkRateLimit, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limiter';
import { sql } from '@/lib/db-neon';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header. Use: Bearer YOUR_API_KEY' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7);

    // Validate API key
    const validation = await validateApiKey(apiKey);
    
    if (!validation || !validation.valid) {
      return NextResponse.json(
        { error: 'Invalid or expired API key' },
        { status: 401 }
      );
    }

    if (validation.plan !== 'ENTERPRISE') {
      return NextResponse.json(
        { error: 'API access is only available for Enterprise plan' },
        { status: 403 }
      );
    }

    // Rate limiting
    const rateLimit = checkRateLimit(
      `api:${validation.userId}`,
      RATE_LIMITS.ENTERPRISE
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: rateLimit.retryAfter,
        },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit),
        }
      );
    }

    const { id } = await context.params;
    const scanId = id;

    // Get scan with ownership verification
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
        { 
          status: 404,
          headers: getRateLimitHeaders(rateLimit),
        }
      );
    }

    const scan = scans[0];

    // Verify ownership
    if (scan.user_id !== validation.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You do not own this scan' },
        { 
          status: 403,
          headers: getRateLimitHeaders(rateLimit),
        }
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

    return NextResponse.json(
      {
        id: scan.id,
        websiteUrl: scan.website_url,
        scannedAt: scan.scanned_at,
        riskScore: scan.risk_score,
        wordpress: scan.core_data,
        plugins: scan.plugins_data || [],
        themes: scan.themes_data || [],
        vulnerabilities: {
          total: findings.length,
          critical: findings.filter((f: any) => f.severity === 'CRITICAL').length,
          high: findings.filter((f: any) => f.severity === 'HIGH').length,
          medium: findings.filter((f: any) => f.severity === 'MEDIUM').length,
          low: findings.filter((f: any) => f.severity === 'LOW').length,
          details: findings.map((f: any) => ({
            severity: f.severity,
            title: f.title,
            description: f.description,
            affectedItem: f.affected_item,
            affectedVersion: f.affected_version,
            fixedIn: f.fixed_in,
            cveId: f.cve_id,
            cvssScore: f.cvss_score,
          })),
        },
      },
      {
        headers: getRateLimitHeaders(rateLimit),
      }
    );

  } catch (error) {
    console.error('API scan details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
