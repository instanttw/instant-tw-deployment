import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { sql } from '@vercel/postgres';

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

    // Check if user already exists in unified users table
    const existingUser = await sql`
      SELECT id, email 
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `;

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user in unified users table
    const result = await sql`
      INSERT INTO users (email, name, password_hash, role, created_at, updated_at)
      VALUES (
        ${email},
        ${name},
        ${hashedPassword},
        'user',
        NOW(),
        NOW()
      )
      RETURNING id, email, name, role
    `;

    const user = result.rows[0];

    console.log('✅ New user created via email signup:', email);

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
    console.error("❌ Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
