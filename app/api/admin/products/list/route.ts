import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    // Get all products with tier count
    const { rows } = await sql`
      SELECT 
        p.*,
        COUNT(pt.id) as tier_count
      FROM products p
      LEFT JOIN pricing_tiers pt ON p.id = pt.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;

    return NextResponse.json({
      success: true,
      products: rows,
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
