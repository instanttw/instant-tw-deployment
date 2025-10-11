/**
 * Public API v1: List Websites
 * GET /api/v1/websites
 * 
 * Requires: Enterprise plan with API key
 * Rate limit: 1000 requests per 24 hours
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-key-manager';
import { checkRateLimit, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limiter';
import { sql } from '@/lib/db-neon';

export async function GET(request: NextRequest) {
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

    // Get websites
    const websites = await sql`
      SELECT 
        w.id,
        w.url,
        w.scan_frequency,
        w.last_scanned_at,
        w.next_scan_at,
        w.is_active,
        w.created_at,
        (
          SELECT risk_score
          FROM wp_scan_scans s
          WHERE s.website_id = w.id
          ORDER BY s.scanned_at DESC
          LIMIT 1
        ) as latest_risk_score,
        (
          SELECT COUNT(*)::int
          FROM wp_scan_scans s
          WHERE s.website_id = w.id
        ) as total_scans
      FROM wp_scan_websites w
      WHERE w.user_id = ${validation.userId}
      ORDER BY w.created_at DESC
    `;

    return NextResponse.json(
      {
        total: websites.length,
        websites: websites.map((w: any) => ({
          id: w.id,
          url: w.url,
          scanFrequency: w.scan_frequency,
          lastScannedAt: w.last_scanned_at,
          nextScanAt: w.next_scan_at,
          isActive: w.is_active,
          latestRiskScore: w.latest_risk_score,
          totalScans: w.total_scans,
          createdAt: w.created_at,
        })),
      },
      {
        headers: getRateLimitHeaders(rateLimit),
      }
    );

  } catch (error) {
    console.error('API websites list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
