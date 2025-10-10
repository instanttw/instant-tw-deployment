import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Lazy import otplib to avoid issues during edge/runtime
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
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auth = await getAuthenticator();
    const secret = auth.generateSecret();
    const issuer = "Instant";
    const label = `${issuer}:${session.user.email}`;
    const otpauthUrl = auth.keyuri(session.user.email, issuer, secret);

    return NextResponse.json({ secret, label, otpauthUrl }, { status: 200 });
  } catch (error) {
    console.error("❌ 2FA setup error:", error);
    return NextResponse.json({ error: "Failed to create 2FA secret" }, { status: 500 });
  }
}
