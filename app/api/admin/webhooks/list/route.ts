import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    // Get recent webhook events
    const { rows } = await sql`
      SELECT *
      FROM webhook_events
      ORDER BY received_at DESC
      LIMIT 200
    `;

    return NextResponse.json({
      success: true,
      events: rows,
    });
  } catch (error: any) {
    console.error("Error fetching webhook events:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
