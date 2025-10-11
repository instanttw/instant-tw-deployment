/**
 * Initialize WP Scan Database Tables
 * Run this script to create all necessary database tables
 * 
 * Usage: npx tsx scripts/init-wpscan-db.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import mysql from 'mysql2/promise';

async function initDatabase() {
  console.log('🚀 Initializing WP Scan database...\n');
  
  // Create connection
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'admin_wpinstant',
    password: 'QfJr8nDWKgXmaEZzB9g2',
    database: 'admin_wpinstant',
    multipleStatements: true,
  });
  
  try {
    // Read schema file
    const schemaPath = join(process.cwd(), 'database', 'schema-wpscan.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    console.log('📄 Executing schema...');
    
    // Execute schema
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          const tableName = statement.match(/CREATE TABLE.*?`?(\w+)`?/i)?.[1];
          if (tableName) {
            console.log(`✅ Created table: ${tableName}`);
          }
        } catch (error: any) {
          if (error.code === 'ER_TABLE_EXISTS_EXISTS') {
            console.log(`⚠️  Table already exists, skipping...`);
          } else {
            throw error;
          }
        }
      }
    }
    
    console.log('\n✅ Database initialization complete!');
    console.log('\nCreated tables:');
    console.log('  - wp_scan_users');
    console.log('  - wp_scan_websites');
    console.log('  - wp_scan_scans');
    console.log('  - wp_scan_findings');
    console.log('  - wp_scan_api_keys');
    console.log('  - wp_scan_notifications');
    console.log('  - wp_scan_user_settings');
    console.log('  - wp_scan_audit_log');
    
    // Show table stats
    const [tables] = await connection.query(
      `SELECT TABLE_NAME, TABLE_ROWS 
       FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = 'admin_wpinstant' 
       AND TABLE_NAME LIKE 'wp_scan_%'`
    );
    
    console.log('\nTable Statistics:');
    console.table(tables);
    
  } catch (error) {
    console.error('\n❌ Error initializing database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default initDatabase;
