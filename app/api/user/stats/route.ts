import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user stats
    const stats = await sql`
      SELECT 
        COUNT(DISTINCT l.id) as licenses,
        COUNT(DISTINCT CASE WHEN l.status = 'active' THEN l.id END) as active_licenses,
        COUNT(DISTINCT CASE WHEN l.status = 'active' AND l.expires_at IS NOT NULL 
          AND l.expires_at < NOW() + INTERVAL '30 days' THEN l.id END) as expiring_licenses,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END), 0) as total_spent
      FROM users u
      LEFT JOIN licenses l ON u.id = l.user_id
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.id = ${userId}
      GROUP BY u.id
    `;

    return NextResponse.json({
      success: true,
      stats: {
        licenses: parseInt(stats.rows[0]?.licenses || "0"),
        activeLicenses: parseInt(stats.rows[0]?.active_licenses || "0"),
        expiringLicenses: parseInt(stats.rows[0]?.expiring_licenses || "0"),
        totalOrders: parseInt(stats.rows[0]?.total_orders || "0"),
        totalSpent: parseInt(stats.rows[0]?.total_spent || "0"),
      },
    });
  } catch (error: any) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
