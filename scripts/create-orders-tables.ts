/**
 * Create Orders, Licenses, and Webhooks Tables
 * Simplified version without complex SQL
 */

import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

async function createTables() {
  try {
    console.log('🚀 Creating orders, licenses, and webhook tables...\n');

    // Create orders table
    console.log('📦 Creating orders table...');
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_number VARCHAR(50) UNIQUE NOT NULL,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        stripe_session_id VARCHAR(500),
        stripe_payment_intent_id VARCHAR(500),
        stripe_subscription_id VARCHAR(500),
        stripe_customer_id VARCHAR(500),
        status VARCHAR(50) DEFAULT 'pending',
        subtotal INTEGER NOT NULL,
        discount_amount INTEGER DEFAULT 0,
        tax_amount INTEGER DEFAULT 0,
        total_amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'usd',
        customer_email VARCHAR(500),
        customer_name VARCHAR(500),
        billing_address JSONB,
        items JSONB NOT NULL,
        metadata JSONB DEFAULT '{}'::jsonb,
        notes TEXT,
        fulfilled_at TIMESTAMP WITH TIME ZONE,
        refunded_at TIMESTAMP WITH TIME ZONE,
        refund_amount INTEGER,
        refund_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Orders table created');

    // Create order_items table
    console.log('📦 Creating order_items table...');
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id),
        pricing_tier_id UUID REFERENCES pricing_tiers(id),
        product_name VARCHAR(500) NOT NULL,
        product_slug VARCHAR(255) NOT NULL,
        tier_name VARCHAR(100),
        quantity INTEGER DEFAULT 1,
        unit_price INTEGER NOT NULL,
        total_price INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'usd',
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Order items table created');

    // Create licenses table
    console.log('🔑 Creating licenses table...');
    await sql`
      CREATE TABLE IF NOT EXISTS licenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        license_key VARCHAR(500) UNIQUE NOT NULL,
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id),
        status VARCHAR(50) DEFAULT 'active',
        tier_name VARCHAR(100),
        site_limit INTEGER,
        sites_used INTEGER DEFAULT 0,
        activated_at TIMESTAMP WITH TIME ZONE,
        expires_at TIMESTAMP WITH TIME ZONE,
        last_checked_at TIMESTAMP WITH TIME ZONE,
        activated_domains JSONB DEFAULT '[]'::jsonb,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Licenses table created');

    // Create webhook_events table
    console.log('📡 Creating webhook_events table...');
    await sql`
      CREATE TABLE IF NOT EXISTS webhook_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id VARCHAR(500) UNIQUE NOT NULL,
        event_type VARCHAR(200) NOT NULL,
        stripe_account VARCHAR(200),
        api_version VARCHAR(50),
        payload JSONB NOT NULL,
        processed BOOLEAN DEFAULT false,
        processed_at TIMESTAMP WITH TIME ZONE,
        processing_error TEXT,
        retry_count INTEGER DEFAULT 0,
        metadata JSONB DEFAULT '{}'::jsonb,
        received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Webhook events table created');

    // Create indexes
    console.log('\n📊 Creating indexes...');
    
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC)`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id)`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_licenses_user ON licenses(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_licenses_order ON licenses(order_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status)`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(event_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id)`;
    
    console.log('✅ Indexes created');

    // Verify tables
    console.log('\n🔍 Verifying tables...');
    const tables = ['orders', 'order_items', 'licenses', 'webhook_events'];
    
    for (const table of tables) {
      const result = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = ${table}
        )
      `;
      
      const exists = result.rows[0].exists;
      console.log(`   ${exists ? '✅' : '❌'} ${table}`);
    }

    console.log('\n✨ Database schema is ready!');
    console.log('   You can now:');
    console.log('   - Process Stripe webhooks');
    console.log('   - Create orders automatically');
    console.log('   - Generate license keys');
    console.log('   - View admin dashboard\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.message?.includes('users')) {
      console.error('\n⚠️  Looks like the users table doesn\'t exist yet.');
      console.error('   This is required for the orders system to work.');
      console.error('   Please create the users table first.\n');
    }
    process.exit(1);
  }
}

createTables();
