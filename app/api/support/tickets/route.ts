import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { sendEmail } from "@/lib/email-service";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT,
      name VARCHAR(255),
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      priority VARCHAR(50),
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'open',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { name, email, subject, category, priority, message } = body || {};
    const userEmail = email || session?.user?.email;
    if (!userEmail || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await ensureTable();
    const res = await sql`
      INSERT INTO support_tickets (user_id, name, email, subject, category, priority, message)
      VALUES (${session?.user?.id || null}, ${name || session?.user?.name || null}, ${userEmail}, ${subject}, ${category || null}, ${priority || 'normal'}, ${message})
      RETURNING id
    `;
    const ticketId = res.rows[0]?.id as number;

    const html = `
      <p>New support ticket received.</p>
      <ul>
        <li><strong>ID:</strong> ${ticketId}</li>
        <li><strong>Name:</strong> ${name || session?.user?.name || ''}</li>
        <li><strong>Email:</strong> ${userEmail}</li>
        <li><strong>Category:</strong> ${category || ''}</li>
        <li><strong>Priority:</strong> ${priority || 'normal'}</li>
        <li><strong>Subject:</strong> ${subject}</li>
      </ul>
      <p>${message?.replace(/\n/g, '<br/>')}</p>
    `;
    await sendEmail({
      to: process.env.SUPPORT_EMAIL || 'wp@instant.tw',
      subject: `Support Ticket #${ticketId}: ${subject}`,
      html,
    });

    return NextResponse.json({ message: "Ticket submitted", id: ticketId }, { status: 200 });
  } catch (e) {
    console.error('❌ Submit ticket error:', e);
    return NextResponse.json({ error: "Failed to submit ticket" }, { status: 500 });
  }
}
