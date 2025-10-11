-- Products, Orders & Licenses Schema
-- Dynamic Stripe Integration - Supports unlimited products
-- PostgreSQL / Neon compatible

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- ENUM TYPES
-- ===========================================

-- Product types
DO $$ BEGIN
    CREATE TYPE product_type AS ENUM (
        'plugin',           -- WordPress plugins
        'service',          -- One-time services
        'subscription',     -- Recurring subscriptions (hosting, WP scan, bundles)
        'bundle'            -- Multiple products packaged together
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Pricing models
DO $$ BEGIN
    CREATE TYPE pricing_model_type AS ENUM (
        'one_time',         -- Single payment
        'subscription',     -- Recurring payment
        'hourly',           -- Service by hour
        'package'           -- Fixed service package
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Billing intervals
DO $$ BEGIN
    CREATE TYPE billing_interval_type AS ENUM ('month', 'year', 'lifetime');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Order status
DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM (
        'pending',          -- Payment not completed
        'processing',       -- Payment received, being fulfilled
        'completed',        -- Order fulfilled
        'refunded',         -- Full refund issued
        'partially_refunded', -- Partial refund issued
        'failed',           -- Payment failed
        'canceled'          -- Order canceled
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- License status
DO $$ BEGIN
    CREATE TYPE license_status_type AS ENUM (
        'active',           -- License is active
        'expired',          -- License expired
        'revoked',          -- License revoked (refund/violation)
        'suspended'         -- Temporarily suspended
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ===========================================
-- TABLES
-- ===========================================

-- Products catalog
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    type product_type NOT NULL,
    description TEXT,
    short_description VARCHAR(1000),
    features JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    download_url VARCHAR(1000),
    documentation_url VARCHAR(1000),
    demo_url VARCHAR(1000),
    version VARCHAR(50),
    requires_license BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Pricing tiers for products
CREATE TABLE IF NOT EXISTS pricing_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tier_name VARCHAR(100) NOT NULL, -- 'free', 'pro', 'agency', 'enterprise', 'lifetime'
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL, -- Amount in cents (e.g., 4900 = $49.00)
    currency VARCHAR(3) DEFAULT 'usd',
    pricing_model pricing_model_type NOT NULL,
    billing_interval billing_interval_type,
    features JSONB DEFAULT '[]'::jsonb,
    site_limit INTEGER, -- Number of sites allowed (NULL = unlimited)
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, tier_name)
);

CREATE INDEX idx_pricing_tiers_product ON pricing_tiers(product_id);
CREATE INDEX idx_pricing_tiers_active ON pricing_tiers(is_active);

-- Orders (purchases)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Stripe data
    stripe_session_id VARCHAR(500),
    stripe_payment_intent_id VARCHAR(500),
    stripe_subscription_id VARCHAR(500),
    stripe_customer_id VARCHAR(500),
    
    -- Order details
    status order_status_type DEFAULT 'pending',
    subtotal INTEGER NOT NULL, -- Amount in cents
    discount_amount INTEGER DEFAULT 0,
    tax_amount INTEGER DEFAULT 0,
    total_amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    
    -- Customer info (snapshot at time of purchase)
    customer_email VARCHAR(500),
    customer_name VARCHAR(500),
    billing_address JSONB,
    
    -- Metadata
    items JSONB NOT NULL, -- Array of purchased items with details
    metadata JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    
    -- Fulfillment
    fulfilled_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    refund_amount INTEGER,
    refund_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX idx_orders_stripe_subscription ON orders(stripe_subscription_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Order items (individual products in an order)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    pricing_tier_id UUID REFERENCES pricing_tiers(id),
    
    -- Product snapshot (in case product changes later)
    product_name VARCHAR(500) NOT NULL,
    product_slug VARCHAR(255) NOT NULL,
    tier_name VARCHAR(100),
    
    -- Pricing
    quantity INTEGER DEFAULT 1,
    unit_price INTEGER NOT NULL, -- Amount in cents
    total_price INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Licenses (access keys for products)
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_key VARCHAR(500) UNIQUE NOT NULL,
    
    -- Relations
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    
    -- License details
    status license_status_type DEFAULT 'active',
    tier_name VARCHAR(100),
    site_limit INTEGER,
    sites_used INTEGER DEFAULT 0,
    
    -- Activation
    activated_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_checked_at TIMESTAMP WITH TIME ZONE,
    
    -- Domain tracking
    activated_domains JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_licenses_key ON licenses(license_key);
CREATE INDEX idx_licenses_user ON licenses(user_id);
CREATE INDEX idx_licenses_order ON licenses(order_id);
CREATE INDEX idx_licenses_product ON licenses(product_id);
CREATE INDEX idx_licenses_status ON licenses(status);
CREATE INDEX idx_licenses_expires ON licenses(expires_at);

-- Downloads tracking
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    license_id UUID REFERENCES licenses(id),
    order_id UUID REFERENCES orders(id),
    
    -- Download details
    file_name VARCHAR(500),
    file_version VARCHAR(50),
    file_size_bytes BIGINT,
    download_url VARCHAR(1000),
    
    -- IP and user agent for security
    ip_address INET,
    user_agent TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_downloads_user ON downloads(user_id);
CREATE INDEX idx_downloads_product ON downloads(product_id);
CREATE INDEX idx_downloads_license ON downloads(license_id);
CREATE INDEX idx_downloads_date ON downloads(downloaded_at DESC);

-- Service bookings (for hourly/package services)
CREATE TABLE IF NOT EXISTS service_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    
    -- Booking details
    hours_purchased DECIMAL(10, 2),
    hours_used DECIMAL(10, 2) DEFAULT 0,
    hourly_rate INTEGER, -- Amount in cents
    
    -- Scheduling
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, canceled
    
    -- Notes
    requirements TEXT,
    deliverables TEXT,
    notes TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_service_bookings_order ON service_bookings(order_id);
CREATE INDEX idx_service_bookings_user ON service_bookings(user_id);
CREATE INDEX idx_service_bookings_product ON service_bookings(product_id);
CREATE INDEX idx_service_bookings_status ON service_bookings(status);

-- Webhooks log (for debugging and auditing)
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(500) UNIQUE NOT NULL,
    event_type VARCHAR(200) NOT NULL,
    
    -- Stripe data
    stripe_account VARCHAR(200),
    api_version VARCHAR(50),
    
    -- Event data
    payload JSONB NOT NULL,
    
    -- Processing
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    processing_error TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX idx_webhook_events_received ON webhook_events(received_at DESC);
CREATE INDEX idx_webhook_events_event_id ON webhook_events(event_id);

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_tiers_updated_at BEFORE UPDATE ON pricing_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON licenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_bookings_updated_at BEFORE UPDATE ON service_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR AS $$
DECLARE
    new_number VARCHAR;
    counter INTEGER;
BEGIN
    counter := (SELECT COUNT(*) FROM orders) + 1;
    new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 6, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Check license validity
CREATE OR REPLACE FUNCTION is_license_valid(license_key_param VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    license_record RECORD;
BEGIN
    SELECT * INTO license_record
    FROM licenses
    WHERE license_key = license_key_param;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    IF license_record.status != 'active' THEN
        RETURN FALSE;
    END IF;
    
    IF license_record.expires_at IS NOT NULL AND license_record.expires_at < NOW() THEN
        UPDATE licenses SET status = 'expired' WHERE license_key = license_key_param;
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Get user's active licenses for a product
CREATE OR REPLACE FUNCTION get_user_product_licenses(user_id_param UUID, product_id_param UUID)
RETURNS TABLE (
    license_key VARCHAR,
    tier_name VARCHAR,
    expires_at TIMESTAMP WITH TIME ZONE,
    sites_used INTEGER,
    site_limit INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.license_key,
        l.tier_name,
        l.expires_at,
        l.sites_used,
        l.site_limit
    FROM licenses l
    WHERE l.user_id = user_id_param
        AND l.product_id = product_id_param
        AND l.status = 'active'
        AND (l.expires_at IS NULL OR l.expires_at > NOW())
    ORDER BY l.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- COMMENTS
-- ===========================================

COMMENT ON TABLE products IS 'Product catalog for plugins, services, and subscriptions';
COMMENT ON TABLE pricing_tiers IS 'Pricing options for each product (free, pro, lifetime, etc.)';
COMMENT ON TABLE orders IS 'Customer orders and purchases';
COMMENT ON TABLE order_items IS 'Individual items within each order';
COMMENT ON TABLE licenses IS 'License keys for purchased products';
COMMENT ON TABLE downloads IS 'Track all product downloads';
COMMENT ON TABLE service_bookings IS 'Bookings for hourly/package services';
COMMENT ON TABLE webhook_events IS 'Stripe webhook events log';

COMMENT ON COLUMN products.metadata IS 'Flexible JSON field for product-specific data';
COMMENT ON COLUMN orders.items IS 'Snapshot of purchased items at checkout time';
COMMENT ON COLUMN licenses.activated_domains IS 'Array of domains where license is activated';
