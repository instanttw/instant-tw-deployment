-- ============================================
-- Products & Pricing Tiers Migration
-- PostgreSQL / Neon compatible
-- ============================================

-- Create product type enum
DO $$ BEGIN
    CREATE TYPE product_type AS ENUM ('plugin', 'theme', 'service', 'subscription', 'bundle');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create pricing model enum
DO $$ BEGIN
    CREATE TYPE pricing_model_type AS ENUM ('one_time', 'subscription', 'hourly', 'package');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create billing interval enum
DO $$ BEGIN
    CREATE TYPE billing_interval_type AS ENUM ('month', 'year', 'lifetime');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create product status enum
DO $$ BEGIN
    CREATE TYPE product_status_type AS ENUM ('active', 'inactive', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -------------------------
-- Products Table
-- -------------------------
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type product_type NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    images JSONB,
    features JSONB,
    version VARCHAR(20),
    status product_status_type DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- -------------------------
-- Pricing Tiers Table
-- -------------------------
CREATE TABLE IF NOT EXISTS pricing_tiers (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    tier_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL, -- Price in cents
    currency VARCHAR(3) DEFAULT 'usd',
    pricing_model pricing_model_type NOT NULL,
    billing_interval billing_interval_type NULL,
    site_limit INTEGER NULL, -- Number of sites allowed, NULL = unlimited
    features JSONB,
    sort_order INTEGER DEFAULT 0,
    status product_status_type DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (product_id, tier_name)
);

CREATE INDEX IF NOT EXISTS idx_pricing_tiers_product_id ON pricing_tiers(product_id);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_tier_name ON pricing_tiers(tier_name);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_pricing_model ON pricing_tiers(pricing_model);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_status ON pricing_tiers(status);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_sort_order ON pricing_tiers(sort_order);

-- -------------------------
-- Triggers for updated_at
-- -------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_tiers_updated_at BEFORE UPDATE ON pricing_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- End of Migration
-- ============================================
