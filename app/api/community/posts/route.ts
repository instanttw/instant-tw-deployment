import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS community_posts (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

export async function GET() {
  await ensureTables();
  const res = await sql`SELECT p.id, p.title, LEFT(p.content, 300) AS excerpt, p.created_at FROM community_posts p ORDER BY p.created_at DESC LIMIT 100`;
  return NextResponse.json({ posts: res.rows }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await ensureTables();
    const { title, content } = await req.json();
    if (!title || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const result = await sql`
      INSERT INTO community_posts (user_id, title, content) VALUES (${session.user.id}, ${title}, ${content}) RETURNING id
    `;
    return NextResponse.json({ id: result.rows[0].id }, { status: 200 });
  } catch (e) {
    console.error('❌ Create post error:', e);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
