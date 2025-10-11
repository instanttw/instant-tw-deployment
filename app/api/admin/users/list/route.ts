import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    // Get all users with order stats
    const { rows } = await sql`
      SELECT 
        u.*,
        COUNT(DISTINCT o.id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id AND o.status = 'completed'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;

    return NextResponse.json({
      success: true,
      users: rows,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
