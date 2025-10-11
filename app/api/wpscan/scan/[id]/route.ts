/**
 * API Route: Get Scan Details
 * Fetches detailed scan information and findings
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db-neon';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { id: scanId } = await context.params;

    // Get scan details
    const scanQuery = await sql`
      SELECT 
        s.*,
        w.url as website_url,
        w.name as website_name
      FROM wp_scan_scans s
      JOIN wp_scan_websites w ON s.website_id = w.id
      WHERE s.id = ${scanId} AND s.user_id = ${userId}
    `;

    if (scanQuery.length === 0) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      );
    }

    const scan = scanQuery[0];

    // Get findings for this scan
    const findings = await sql`
      SELECT *
      FROM wp_scan_findings
      WHERE scan_id = ${scanId}
      ORDER BY 
        CASE severity
          WHEN 'CRITICAL' THEN 1
          WHEN 'HIGH' THEN 2
          WHEN 'MEDIUM' THEN 3
          WHEN 'LOW' THEN 4
        END,
        created_at DESC
    `;

    return NextResponse.json({
      scan,
      findings,
    });

  } catch (error) {
    console.error('Error fetching scan details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan details', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
