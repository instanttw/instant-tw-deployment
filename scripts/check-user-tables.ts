import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

async function check() {
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE '%user%'
    ORDER BY table_name
  `;
  
  console.log('User-related tables:', tables.rows);
  
  // Check users table
  const users = await sql`SELECT email, role FROM users LIMIT 5`;
  console.log('\nUsers in "users" table:', users.rows);
  
  // Check if wp_scan_users exists
  try {
    const wpUsers = await sql`SELECT email FROM wp_scan_users LIMIT 5`;
    console.log('\nUsers in "wp_scan_users" table:', wpUsers.rows);
  } catch (e) {
    console.log('\nwp_scan_users table does not exist');
  }
}

check().catch(console.error);
