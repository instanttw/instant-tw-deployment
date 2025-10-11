/**
 * Public API v1: Scan WordPress Website
 * POST /api/v1/scan
 * 
 * Requires: Enterprise plan with API key
 * Rate limit: 1000 requests per 24 hours
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-key-manager';
import { checkRateLimit, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limiter';
import { scanWordPressSite } from '@/lib/wordpress-scanner';
import { checkVulnerabilities } from '@/lib/vulnerability-checker';
import { sql } from '@/lib/db-neon';

export async function POST(request: NextRequest) {
  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header. Use: Bearer YOUR_API_KEY' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7); // Remove 'Bearer '

    // Validate API key
    const validation = await validateApiKey(apiKey);
    
    if (!validation || !validation.valid) {
      return NextResponse.json(
        { error: 'Invalid or expired API key' },
        { status: 401 }
      );
    }

    // Check if user has Enterprise plan
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

    // Parse request body
    const body = await request.json();
    const { url, saveToDatabase = false } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { 
          status: 400,
          headers: getRateLimitHeaders(rateLimit),
        }
      );
    }

    // Perform scan
    const scanResult = await scanWordPressSite(url);

    if (!scanResult.isWordPress) {
      return NextResponse.json(
        { 
          error: 'Not a WordPress website',
          url,
        },
        { 
          status: 400,
          headers: getRateLimitHeaders(rateLimit),
        }
      );
    }

    // Check vulnerabilities
    const vulnerabilities = await checkVulnerabilities({
      core: scanResult.core,
      plugins: scanResult.plugins,
      themes: scanResult.themes,
    });

    // Calculate risk score
    const riskScore = calculateRiskScore(vulnerabilities);

    // Prepare response
    const response: any = {
      url,
      scannedAt: new Date().toISOString(),
      riskScore,
      wordpress: {
        version: scanResult.core.version,
        latestVersion: scanResult.core.latestVersion,
        isOutdated: scanResult.core.isOutdated,
      },
      plugins: scanResult.plugins.map(p => ({
        name: p.name,
        slug: p.slug,
        version: p.version,
        latestVersion: p.latestVersion,
        isOutdated: p.isOutdated,
        vulnerabilities: (vulnerabilities.plugins && vulnerabilities.plugins[p.slug]) || [],
      })),
      themes: scanResult.themes.map(t => ({
        name: t.name,
        slug: t.slug,
        version: t.version,
        latestVersion: t.latestVersion,
        isOutdated: t.isOutdated,
        vulnerabilities: (vulnerabilities.themes && vulnerabilities.themes[t.slug]) || [],
      })),
      vulnerabilities: {
        total: countTotalVulnerabilities(vulnerabilities),
        critical: countBySeverity(vulnerabilities, 'CRITICAL'),
        high: countBySeverity(vulnerabilities, 'HIGH'),
        medium: countBySeverity(vulnerabilities, 'MEDIUM'),
        low: countBySeverity(vulnerabilities, 'LOW'),
        details: getAllVulnerabilities(vulnerabilities),
      },
    };

    // Optionally save to database
    if (saveToDatabase && validation.userId) {
      // Find or create website
      let website = await sql`
        SELECT id FROM wp_scan_websites
        WHERE url = ${url} AND user_id = ${validation.userId}
        LIMIT 1
      `;

      let websiteId;
      if (website.length === 0) {
        const newWebsite = await sql`
          INSERT INTO wp_scan_websites (url, user_id, scan_frequency)
          VALUES (${url}, ${validation.userId}, 'MANUAL')
          RETURNING id
        `;
        websiteId = newWebsite[0].id;
      } else {
        websiteId = website[0].id;
      }

      // Save scan
      const scan = await sql`
        INSERT INTO wp_scan_scans (
          website_id,
          risk_score,
          core_data,
          plugins_data,
          themes_data,
          vulnerabilities_data
        ) VALUES (
          ${websiteId},
          ${riskScore},
          ${JSON.stringify(scanResult.core)}::jsonb,
          ${JSON.stringify(scanResult.plugins)}::jsonb,
          ${JSON.stringify(scanResult.themes)}::jsonb,
          ${JSON.stringify(vulnerabilities)}::jsonb
        )
        RETURNING id
      `;

      response.scanId = scan[0].id;
    }

    // Log API usage
    await sql`
      INSERT INTO wp_scan_audit_log (user_id, action, details)
      VALUES (
        ${validation.userId},
        'api:scan',
        ${JSON.stringify({ url, riskScore })}::jsonb
      )
    `;

    return NextResponse.json(response, {
      headers: getRateLimitHeaders(rateLimit),
    });

  } catch (error) {
    console.error('API scan error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateRiskScore(vulnerabilities: any): number {
  const severityWeights = { CRITICAL: 40, HIGH: 20, MEDIUM: 10, LOW: 5 };
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

function countTotalVulnerabilities(vulnerabilities: any): number {
  return [
    ...vulnerabilities.core,
    ...Object.values(vulnerabilities.plugins).flat(),
    ...Object.values(vulnerabilities.themes).flat(),
  ].length;
}

function countBySeverity(vulnerabilities: any, severity: string): number {
  const allVulns = [
    ...vulnerabilities.core,
    ...Object.values(vulnerabilities.plugins).flat(),
    ...Object.values(vulnerabilities.themes).flat(),
  ];
  
  return allVulns.filter((v: any) => v.severity === severity).length;
}

function getAllVulnerabilities(vulnerabilities: any): any[] {
  return [
    ...vulnerabilities.core,
    ...Object.values(vulnerabilities.plugins).flat(),
    ...Object.values(vulnerabilities.themes).flat(),
  ];
}
