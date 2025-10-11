import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserLicenses } from "@/lib/db-orders";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const licenses = await getUserLicenses(session.user.id);

    return NextResponse.json({
      success: true,
      licenses,
    });
  } catch (error: any) {
    console.error("Error fetching user licenses:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
