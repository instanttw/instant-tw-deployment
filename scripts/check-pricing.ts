import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
const envPath = ['.env.local', '.env.production', '.env']
  .map(file => path.join(process.cwd(), file))
  .find(file => {
    try {
      return require('fs').existsSync(file);
    } catch {
      return false;
    }
  });

if (envPath) {
  dotenv.config({ path: envPath });
}

if (process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

async function checkPricing() {
  try {
    console.log('Checking database pricing...\n');
    
    const result = await sql`
      SELECT 
        p.slug, 
        p.name,
        pt.tier_name, 
        pt.display_name, 
        pt.price/100 as price_usd, 
        pt.billing_interval
      FROM pricing_tiers pt
      JOIN products p ON p.id = pt.product_id
      WHERE p.slug LIKE 'instant-%'
      ORDER BY p.slug, pt.sort_order
      LIMIT 24
    `;
    
    console.log('Database Pricing:\n');
    console.table(result.rows);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkPricing().then(() => process.exit(0));
