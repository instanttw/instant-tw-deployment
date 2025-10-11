/**
 * Neon PostgreSQL Database Connection
 * Phase 2: WP Scan Database
 */

import { neon, neonConfig } from '@neondatabase/serverless';
import { resolve } from 'path';

// Load environment variables locally only (Next/Vercel injects env in production)
if (process.env.NODE_ENV !== 'production') {
  try {
    // Lazy import so it’s excluded from Edge/serverless bundles
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config({ path: resolve(process.cwd(), '.env.local') });
  } catch {}
}

// Configure Neon (deprecated warning is harmless)
neonConfig.fetchConnectionCache = true;

// Get connection string from environment
function getConnectionString() {
  const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL or NEON_DATABASE_URL environment variable is not set');
  }
  
  return connectionString;
}

// Lazy connection - only initialize when actually used (prevents build errors)
let _sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!_sql) {
    _sql = neon(getConnectionString());
  }
  return _sql;
}

// Export sql as a function that returns the connection
export const sql: any = new Proxy({} as any, {
  apply: (_target, _thisArg, args: any[]) => {
    return (getSql() as any)(...args as any);
  },
  get: (_target, prop) => {
    const sqlInstance: any = getSql();
    const value = sqlInstance[prop as any];
    return typeof value === 'function' ? value.bind(sqlInstance) : value;
  }
});

// Test database connection
export async function testConnection() {
  try {
    const sqlInstance = getSql();
    const result: any = await sqlInstance`SELECT NOW() as time, version() as version`;
    console.log('✅ Neon PostgreSQL connected successfully');
    console.log('   Time:', result[0].time);
    console.log('   Version:', result[0].version.split(' ')[0], result[0].version.split(' ')[1]);
    return true;
  } catch (error) {
    console.error('❌ Neon PostgreSQL connection failed:', error);
    return false;
  }
}

// Generic query helper
export async function query<T = unknown>(
  queryText: string,
  params?: unknown[]
): Promise<T[]> {
  try {
    // Convert positional parameters ($1, $2) if needed
    let processedQuery = queryText;
    if (params && params.length > 0) {
      // Replace ? with $1, $2, $3, etc. for PostgreSQL
      let paramIndex = 1;
      processedQuery = queryText.replace(/\?/g, () => `$${paramIndex++}`);
    }
    
    const result = await (sql as any)(processedQuery, params || []);
    return result as T[];
  } catch (error) {
    console.error('Query error:', error);
    console.error('Query:', queryText);
    console.error('Params:', params);
    throw error;
  }
}

// Get single row
export async function queryOne<T = unknown>(
  queryText: string,
  params?: unknown[]
): Promise<T | null> {
  const results = await query<T>(queryText, params);
  return results.length > 0 ? results[0] : null;
}

// Execute raw SQL (for schema creation)
export async function execute(queryText: string): Promise<void> {
  await (sql as any)(queryText);
}

export default sql;
