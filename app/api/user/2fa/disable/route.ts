import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await sql`
      UPDATE users
      SET two_factor_enabled = FALSE,
          two_factor_secret = NULL,
          updated_at = NOW()
      WHERE id = ${session.user.id}
    `;

    return NextResponse.json({ message: "2FA disabled" }, { status: 200 });
  } catch (error) {
    console.error("❌ 2FA disable error:", error);
    return NextResponse.json({ error: "Failed to disable 2FA" }, { status: 500 });
  }
}
