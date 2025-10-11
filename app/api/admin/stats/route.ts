/**
 * Admin API - Statistics
 * Returns sales and platform statistics
 */

import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth-options';
import { getSalesStats } from '@/lib/db-orders';

export async function GET(request: Request) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Get stats
    const stats = await getSalesStats(days);

    return NextResponse.json({
      success: true,
      stats,
      period_days: days,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
