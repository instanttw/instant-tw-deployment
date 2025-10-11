/**
 * Verify Production Database Tables
 * Checks if all required tables exist on Neon
 */

import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

async function verifyTables() {
  try {
    console.log('🔍 Verifying production database tables...\n');
    
    const tables = [
      'users',
      'products', 
      'pricing_tiers',
      'orders',
      'order_items',
      'licenses',
      'webhook_events'
    ];
    
    let allExist = true;
    
    for (const table of tables) {
      try {
        const result = await sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = ${table}
          )
        `;
        
        const exists = result.rows[0].exists;
        console.log(`   ${exists ? '✅' : '❌'} ${table}`);
        
        if (!exists) allExist = false;
      } catch (error) {
        console.log(`   ❌ ${table} - Error checking`);
        allExist = false;
      }
    }
    
    console.log('');
    
    if (allExist) {
      console.log('✅ All tables exist on production database!');
      console.log('   Your Neon database is ready.\n');
    } else {
      console.log('⚠️  Some tables are missing!');
      console.log('   Run: npx tsx scripts/create-all-tables-simple.ts\n');
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyTables();
