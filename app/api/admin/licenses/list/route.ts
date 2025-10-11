import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    // Get all licenses with order info
    const { rows } = await sql`
      SELECT 
        l.*,
        o.order_number,
        o.customer_email
      FROM licenses l
      LEFT JOIN orders o ON l.order_id = o.id
      ORDER BY l.created_at DESC
      LIMIT 200
    `;

    return NextResponse.json({
      success: true,
      licenses: rows,
    });
  } catch (error: any) {
    console.error("Error fetching licenses:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
