import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS community_comments (
      id BIGSERIAL PRIMARY KEY,
      post_id BIGINT NOT NULL,
      user_id BIGINT,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await ensureTables();
  const id = Number(params.id);
  const res = await sql`SELECT id, post_id, content, created_at FROM community_comments WHERE post_id = ${id} ORDER BY created_at ASC`;
  return NextResponse.json({ comments: res.rows }, { status: 200 });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await ensureTables();
    const id = Number(params.id);
    const { content } = await req.json();
    if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });
    await sql`INSERT INTO community_comments (post_id, user_id, content) VALUES (${id}, ${session.user.id}, ${content})`;
    return NextResponse.json({ message: "Comment added" }, { status: 200 });
  } catch (e) {
    console.error('❌ Add comment error:', e);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
