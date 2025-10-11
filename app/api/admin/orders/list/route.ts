import { NextResponse } from "next/server";
import { getRecentOrders } from "@/lib/db-orders";

export async function GET() {
  try {
    const orders = await getRecentOrders(100); // Get last 100 orders
    
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
