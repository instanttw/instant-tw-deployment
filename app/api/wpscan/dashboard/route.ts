/**
 * API Route: WP Scan Dashboard Data
 * Fetches user's websites, scans, and statistics
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWebsitesByUserId, getScansByWebsiteId, getUserStats } from '@/lib/db-wpscan';
import { sql } from '@/lib/db-neon';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user's websites
    const websites = await getWebsitesByUserId(userId);

    // Get recent scans (last 10)
    const recentScansQuery = await sql`
      SELECT 
        s.id,
        s.website_id,
        w.url as website_url,
        w.name as website_name,
        s.scanned_at,
        s.risk_score,
        s.total_vulnerabilities,
        s.critical_count,
        s.high_count,
        s.medium_count,
        s.low_count,
        s.detection_confidence,
        s.status
      FROM wp_scan_scans s
      JOIN wp_scan_websites w ON s.website_id = w.id
      WHERE s.user_id = ${userId}
      ORDER BY s.scanned_at DESC
      LIMIT 10
    `;

    // Get statistics
    const statsQuery = await sql`
      SELECT 
        COUNT(DISTINCT w.id) as total_websites,
        COUNT(DISTINCT w.id) FILTER (WHERE w.is_active = true) as active_websites,
        COUNT(s.id) as total_scans,
        COALESCE(AVG(s.risk_score)::INTEGER, 0) as avg_risk_score
      FROM wp_scan_websites w
      LEFT JOIN wp_scan_scans s ON w.id = s.website_id
      WHERE w.user_id = ${userId}
    `;

    const stats = {
      totalWebsites: Number(statsQuery[0]?.total_websites || 0),
      activeWebsites: Number(statsQuery[0]?.active_websites || 0),
      totalScans: Number(statsQuery[0]?.total_scans || 0),
      avgRiskScore: Number(statsQuery[0]?.avg_risk_score || 0),
    };

    // Add latest scan info to websites
    const websitesWithScans = await Promise.all(
      websites.map(async (website) => {
        const latestScan = await sql`
          SELECT risk_score, total_vulnerabilities
          FROM wp_scan_scans
          WHERE website_id = ${website.id}
          ORDER BY scanned_at DESC
          LIMIT 1
        `;

        return {
          ...website,
          latest_risk_score: latestScan[0]?.risk_score || null,
          latest_vulnerabilities: latestScan[0]?.total_vulnerabilities || null,
        };
      })
    );

    return NextResponse.json({
      websites: websitesWithScans,
      recentScans: recentScansQuery,
      stats,
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
