/**
 * Create Admin User
 * Creates a default admin account for testing
 */

import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as crypto from 'crypto';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

// Simple password hashing (for testing only - use bcrypt in production)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function createAdminUser() {
  try {
    console.log('👤 Creating admin user...\n');

    // Check if admin already exists
    const existing = await sql`
      SELECT * FROM users WHERE email = 'admin@instant.tw' LIMIT 1
    `;

    if (existing.rows.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('   Email: admin@instant.tw');
      console.log('   Status: Active\n');
      return;
    }

    // Create admin user
    const password = 'admin123'; // Change this!
    const passwordHash = hashPassword(password);

    const result = await sql`
      INSERT INTO users (
        email,
        name,
        password_hash,
        email_verified,
        role
      ) VALUES (
        'admin@instant.tw',
        'Admin User',
        ${passwordHash},
        true,
        'admin'
      )
      RETURNING id, email, name, role
    `;

    const admin = result.rows[0];

    console.log('✅ Admin user created successfully!\n');
    console.log('   📧 Email: admin@instant.tw');
    console.log('   🔑 Password: admin123');
    console.log('   👤 Name: Admin User');
    console.log('   🎭 Role: admin');
    console.log('   🆔 ID:', admin.id);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');
    console.log('🌐 Login at: https://wp.instant.tw/login\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
