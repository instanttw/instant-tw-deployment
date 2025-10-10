import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email-service";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await sendEmail({
      to: email,
      subject: "Instant Notifications Test",
      html: `<p>This is a test notification from Instant.</p><p>If you received this, notifications are working for <strong>${email}</strong>.</p>`,
    });

    return NextResponse.json({ message: "Test email sent" }, { status: 200 });
  } catch (e) {
    console.error("❌ Send notification test error:", e);
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 });
  }
}
