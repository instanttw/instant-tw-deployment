import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-service";

export async function POST(req: Request) {
  try {
    const { name, email, subject, department, message } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dept = (department || "General Inquiries").toString();
    const routing: Record<string, string> = {
      "General Inquiries": "hello@instant.tw",
      "Technical Support": "wp@instant.tw",
      "Sales": "sales@instant.tw",
      "Partnerships": "partners@instant.tw",
      "Press & Media": "press@instant.tw",
      "Billing": "billing@instant.tw",
    };

    const to = routing[dept] || process.env.SUPPORT_EMAIL || "wp@instant.tw";

    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.6;">
        <h2 style="margin:0 0 12px;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name || "(not provided)"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Department:</strong> ${dept}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr/>
        <p style="white-space:pre-wrap;">${message}</p>
      </div>
    `;

    await sendEmail({
      to,
      subject: `Contact Form: [${dept}] ${subject}`,
      html,
      text: `From: ${name || "(not provided)"} <${email}>, Dept: ${dept}\n\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/contact error", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
