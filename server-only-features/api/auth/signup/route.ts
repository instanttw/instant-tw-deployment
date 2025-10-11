import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";

// TODO: Import your database client
// import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // TODO: Check if user already exists
    /*
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    */

    // Hash password
    const hashedPassword = await hash(password, 12);

    // TODO: Create user in database
    /*
    const user = await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });
    */

    // Temporary mock response (remove in production)
    const user = {
      id: "mock-id",
      name,
      email,
    };

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
