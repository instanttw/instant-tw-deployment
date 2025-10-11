/**
 * Create Admin User with bcrypt
 * Creates admin account with proper bcrypt password hashing
 */

import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { hash } from 'bcryptjs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

async function createAdminUser() {
  try {
    console.log('👤 Creating admin user with bcrypt...\n');

    const email = 'admin@instant.tw';
    const password = 'admin123';
    const name = 'Admin User';

    // Check if admin already exists
    const existing = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;

    if (existing.rows.length > 0) {
      console.log('⚠️  Admin user already exists. Updating password...\n');
      
      // Hash password with bcrypt
      const passwordHash = await hash(password, 10);
      
      // Update existing user
      await sql`
        UPDATE users 
        SET password_hash = ${passwordHash},
            role = 'admin',
            email_verified = true
        WHERE email = ${email}
      `;
      
      console.log('✅ Admin user password updated!\n');
    } else {
      console.log('Creating new admin user...\n');
      
      // Hash password with bcrypt
      const passwordHash = await hash(password, 10);

      // Create admin user
      const result = await sql`
        INSERT INTO users (
          email,
          name,
          password_hash,
          email_verified,
          role
        ) VALUES (
          ${email},
          ${name},
          ${passwordHash},
          true,
          'admin'
        )
        RETURNING id, email, name, role
      `;

      const admin = result.rows[0];
      console.log('✅ Admin user created successfully!\n');
      console.log('   🆔 ID:', admin.id);
    }

    console.log('   📧 Email:    admin@instant.tw');
    console.log('   🔑 Password: admin123');
    console.log('   👤 Name:     Admin User');
    console.log('   🎭 Role:     admin');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');
    console.log('🌐 Login at: https://wp.instant.tw/login\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
