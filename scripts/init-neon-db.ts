/**
 * Initialize WP Scan Database Tables on Neon PostgreSQL
 * Run this script to create all necessary database tables
 * 
 * Usage: npx tsx scripts/init-neon-db.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { readFileSync } from 'fs';
import { join } from 'path';
import { sql, testConnection } from '../lib/db-neon';
import { Client } from 'pg';

async function initDatabase() {
  console.log('🚀 Initializing WP Scan database on Neon PostgreSQL...\n');
  
  try {
    // Test connection first
    console.log('📡 Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      throw new Error('Failed to connect to database');
    }
    
    console.log('\n📄 Reading PostgreSQL schema...');
    
    // Read PostgreSQL schema file
    const schemaPath = join(process.cwd(), 'database', 'schema-wpscan-postgres.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    console.log('🔨 Executing schema...\n');
    
    // Use pg Client directly for schema execution (supports multi-statement SQL)
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    try {
      await client.connect();
      await client.query(schema);
      await client.end();
    } catch (error) {
      await client.end();
      throw error;
    }
    
    console.log('\n✅ Database initialization complete!');
    console.log('\nCreated tables:');
    console.log('  ✓ wp_scan_users');
    console.log('  ✓ wp_scan_websites');
    console.log('  ✓ wp_scan_scans');
    console.log('  ✓ wp_scan_findings');
    console.log('  ✓ wp_scan_api_keys');
    console.log('  ✓ wp_scan_notifications');
    console.log('  ✓ wp_scan_user_settings');
    console.log('  ✓ wp_scan_audit_log');
    
    // Show table stats
    const tables = await sql`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
      FROM pg_tables
      WHERE tablename LIKE 'wp_scan_%'
      ORDER BY tablename
    `;
    
    console.log('\n📊 Table Statistics:');
    console.table(tables.map(t => ({
      table: t.tablename,
      size: t.size
    })));
    
    // Test query
    console.log('\n🧪 Testing database queries...');
    const testResult = await sql`SELECT COUNT(*) as count FROM wp_scan_users`;
    console.log(`✓ Users table: ${testResult[0].count} records`);
    
    console.log('\n🎉 Neon PostgreSQL database is ready!');
    console.log('\nConnection details:');
    console.log('  Database: wp-instant-tw');
    console.log('  Provider: Neon (Serverless PostgreSQL)');
    console.log('  Status: Active ✓');
    
  } catch (error) {
    console.error('\n❌ Error initializing database:', error);
    console.error('\nPlease check:');
    console.error('  1. DATABASE_URL is set in .env.local');
    console.error('  2. Neon database is accessible');
    console.error('  3. Connection string is correct');
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error.message);
      process.exit(1);
    });
}

export default initDatabase;
