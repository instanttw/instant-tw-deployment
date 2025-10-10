import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { compare, hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const userRes = await sql`
      SELECT id, password_hash
      FROM users
      WHERE id = ${session.user.id}
      LIMIT 1
    `;

    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dbUser = userRes.rows[0] as { id: string; password_hash: string | null };
    if (!dbUser.password_hash) {
      return NextResponse.json({ error: "No local password set for this account" }, { status: 400 });
    }

    const valid = await compare(oldPassword, dbUser.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Old password is incorrect" }, { status: 400 });
    }

    const newHash = await hash(newPassword, 10);
    await sql`
      UPDATE users
      SET password_hash = ${newHash}, updated_at = NOW()
      WHERE id = ${dbUser.id}
    `;

    return NextResponse.json({ message: "Password updated" }, { status: 200 });
  } catch (error) {
    console.error("❌ Change password error:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
