import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_notification_emails (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL,
      email VARCHAR(255) NOT NULL,
      verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, email)
    );
  `;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ emails: [] }, { status: 200 });
    await ensureTable();
    const rows = await sql`
      SELECT email, verified, created_at FROM user_notification_emails WHERE user_id = ${session.user.id} ORDER BY created_at DESC
    `;
    return NextResponse.json({ emails: rows.rows }, { status: 200 });
  } catch (e) {
    console.error("❌ List notification emails error:", e);
    return NextResponse.json({ emails: [] }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await ensureTable();
    const { email } = await req.json();
    if (!email || typeof email !== "string") return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    await sql`
      INSERT INTO user_notification_emails (user_id, email)
      VALUES (${session.user.id}, ${email})
      ON CONFLICT (user_id, email) DO NOTHING
    `;
    return NextResponse.json({ message: "Email added" }, { status: 200 });
  } catch (e) {
    console.error("❌ Add notification email error:", e);
    return NextResponse.json({ error: "Failed to add email" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await ensureTable();
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    await sql`DELETE FROM user_notification_emails WHERE user_id = ${session.user.id} AND email = ${email}`;
    return NextResponse.json({ message: "Email removed" }, { status: 200 });
  } catch (e) {
    console.error("❌ Remove notification email error:", e);
    return NextResponse.json({ error: "Failed to remove email" }, { status: 500 });
  }
}
