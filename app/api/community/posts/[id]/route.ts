import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const postRes = await sql`SELECT id, title, content, created_at FROM community_posts WHERE id = ${id} LIMIT 1`;
  if (postRes.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post: postRes.rows[0] }, { status: 200 });
}
