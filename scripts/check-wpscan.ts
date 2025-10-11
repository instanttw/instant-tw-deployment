/**
 * Check WP Scan product and tiers in database
 */

import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Vercel Postgres expects POSTGRES_URL, but we use DATABASE_URL
if (process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

async function checkWPScan() {
  try {
    console.log('🔍 Checking WP Scan in database...\n');
    
    // Check product exists
    const productResult = await sql`
      SELECT id, slug, name, type 
      FROM products 
      WHERE slug = 'wp-scan'
    `;
    
    if (productResult.rows.length === 0) {
      console.log('❌ WP Scan product NOT FOUND in database!');
      console.log('   This is why checkout buttons are failing.\n');
      return;
    }
    
    const product = productResult.rows[0];
    console.log('✅ Product found:');
    console.log(`   ID: ${product.id}`);
    console.log(`   Slug: ${product.slug}`);
    console.log(`   Name: ${product.name}`);
    console.log(`   Type: ${product.type}\n`);
    
    // Check pricing tiers
    const tiersResult = await sql`
      SELECT tier_name, display_name, price, billing_interval
      FROM pricing_tiers 
      WHERE product_id = ${product.id}
      ORDER BY price
    `;
    
    console.log(`📊 Found ${tiersResult.rows.length} pricing tiers:\n`);
    
    tiersResult.rows.forEach(tier => {
      const priceInDollars = (tier.price / 100).toFixed(2);
      console.log(`   ${tier.tier_name}:`);
      console.log(`     Display: ${tier.display_name}`);
      console.log(`     Price: $${priceInDollars}`);
      console.log(`     Interval: ${tier.billing_interval}`);
      console.log('');
    });
    
    // Check what the buttons are looking for
    console.log('🔘 Button tier names (what checkout API receives):');
    console.log('   Pro Monthly:     "pro-monthly"');
    console.log('   Pro Yearly:      "pro-yearly"');
    console.log('   Agency Monthly:  "agency-monthly"');
    console.log('   Agency Yearly:   "agency-yearly"\n');
    
    // Verify these match
    const expectedTiers = ['pro-monthly', 'pro-yearly', 'agency-monthly', 'agency-yearly'];
    const existingTiers = tiersResult.rows.map(t => t.tier_name);
    
    console.log('✓ Verification:');
    expectedTiers.forEach(expected => {
      const exists = existingTiers.includes(expected);
      console.log(`   ${expected}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkWPScan();
