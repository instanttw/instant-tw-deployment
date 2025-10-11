import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Simulate scan delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate simulated scan results
    const mockResults = {
      url: url,
      core_version: "6.4.2",
      core_status: Math.random() > 0.7 ? "outdated" : "secure",
      plugins: [
        {
          name: "Contact Form 7",
          version: "5.8.4",
          status: Math.random() > 0.5 ? "secure" : "outdated",
        },
        {
          name: "Yoast SEO",
          version: "21.8",
          status: "secure",
        },
        {
          name: "WooCommerce",
          version: "8.4.0",
          status: Math.random() > 0.6 ? "secure" : "outdated",
        },
        {
          name: "Elementor",
          version: "3.18.2",
          status: "secure",
        },
        {
          name: "Wordfence Security",
          version: "7.11.3",
          status: Math.random() > 0.7 ? "outdated" : "secure",
        },
      ],
      themes: [
        {
          name: "Astra",
          version: "4.6.0",
          status: Math.random() > 0.6 ? "secure" : "outdated",
        },
        {
          name: "Twenty Twenty-Four",
          version: "1.0",
          status: "secure",
        },
      ],
      security: [
        "SSL/HTTPS Active",
        "WordPress Version Hidden",
        "File Permissions Correct",
        "Database Prefix Changed",
        "Admin Username Not 'admin'",
      ],
      risk_score: Math.floor(Math.random() * 30) + 65, // Random score between 65-95
      scanned_at: new Date().toISOString(),
    };

    // Randomly add some warnings to security checks
    if (Math.random() > 0.5) {
      mockResults.security = mockResults.security.filter((_, i) => i !== 4);
      mockResults.security.push("⚠️ XML-RPC Enabled (Security Risk)");
    }

    return NextResponse.json(mockResults);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to scan website" },
      { status: 500 }
    );
  }
}
