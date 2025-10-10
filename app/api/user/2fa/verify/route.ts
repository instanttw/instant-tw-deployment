import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";

let authenticator: any;
async function getAuthenticator() {
  if (!authenticator) {
    const mod = await import("otplib");
    authenticator = mod.authenticator;
  }
  return authenticator;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token, secret } = await req.json();
    if (!token || !secret) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const auth = await getAuthenticator();
    const valid = auth.check(String(token), String(secret));
    if (!valid) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    await sql`
      UPDATE users
      SET two_factor_enabled = TRUE,
          two_factor_secret = ${String(secret)},
          updated_at = NOW()
      WHERE id = ${session.user.id}
    `;

    return NextResponse.json({ message: "2FA enabled" }, { status: 200 });
  } catch (error) {
    console.error("❌ 2FA verify error:", error);
    return NextResponse.json({ error: "Failed to verify 2FA" }, { status: 500 });
  }
}
