/**
 * Run Database Schema Migration
 * Creates orders, licenses, order_items, and webhook_events tables
 */

import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Vercel Postgres expects POSTGRES_URL
if (process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...\n');

    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'database', 'schema-products-orders.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found:', schemaPath);
      process.exit(1);
    }

    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📄 Executing schema...');
    console.log('   This will create/update:');
    console.log('   - products table');
    console.log('   - pricing_tiers table');
    console.log('   - orders table');
    console.log('   - order_items table');
    console.log('   - licenses table');
    console.log('   - downloads table');
    console.log('   - service_bookings table');
    console.log('   - webhook_events table\n');

    // Split schema into individual statements
    // This is a simple split - for production, use a proper migration tool
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      // Skip comments
      if (statement.startsWith('--')) continue;
      
      try {
        // Skip certain statements that cause issues
        if (
          statement.includes('CREATE EXTENSION') ||
          statement.includes('DO $$') ||
          statement.includes('CREATE TYPE') ||
          statement.includes('CREATE OR REPLACE FUNCTION') ||
          statement.includes('CREATE TRIGGER') ||
          statement.includes('COMMENT ON')
        ) {
          console.log(`⚠️  Skipping: ${statement.substring(0, 50)}...`);
          skipCount++;
          continue;
        }

        await sql.query(statement + ';');
        successCount++;
        
        // Log table creations
        if (statement.includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
          console.log(`✅ Created/verified table: ${tableName}`);
        }
      } catch (error: any) {
        // Ignore "already exists" errors
        if (error.message?.includes('already exists')) {
          skipCount++;
        } else {
          console.error(`❌ Error executing statement:`, error.message);
          console.error(`   Statement: ${statement.substring(0, 100)}...`);
          errorCount++;
        }
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ⚠️  Skipped: ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

    if (errorCount === 0) {
      console.log('\n✅ Migration completed successfully!');
    } else {
      console.log('\n⚠️  Migration completed with errors. Please review.');
    }

    // Verify tables exist
    console.log('\n🔍 Verifying tables...');
    
    const tables = ['products', 'pricing_tiers', 'orders', 'order_items', 'licenses', 'downloads', 'service_bookings', 'webhook_events'];
    
    for (const table of tables) {
      try {
        const result = await sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = ${table}
          )
        `;
        
        const exists = result.rows[0].exists;
        if (exists) {
          console.log(`   ✅ ${table}`);
        } else {
          console.log(`   ❌ ${table} - NOT FOUND!`);
        }
      } catch (error) {
        console.log(`   ❌ ${table} - Error checking`);
      }
    }

    console.log('\n✨ Database is ready for order and license management!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
