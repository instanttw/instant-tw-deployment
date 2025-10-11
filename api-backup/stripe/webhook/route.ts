import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Stripe webhook handler - to be implemented
  return NextResponse.json({ received: true }, { status: 200 });
}
