-- ============================================
-- Products & Pricing Tiers Migration
-- Adds support for dynamic product management
-- ============================================

USE instant_wp;

-- -------------------------
-- Products Table
-- -------------------------
CREATE TABLE IF NOT EXISTS products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type ENUM('plugin', 'theme', 'service', 'subscription', 'bundle') NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    images JSON,
    features JSON,
    version VARCHAR(20),
    status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Pricing Tiers Table
-- -------------------------
CREATE TABLE IF NOT EXISTS pricing_tiers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    tier_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    price INT NOT NULL COMMENT 'Price in cents',
    currency VARCHAR(3) DEFAULT 'usd',
    pricing_model ENUM('one_time', 'subscription', 'hourly', 'package') NOT NULL,
    billing_interval ENUM('month', 'year', 'lifetime') NULL,
    site_limit INT NULL COMMENT 'Number of sites allowed, NULL = unlimited',
    features JSON,
    sort_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_tier (product_id, tier_name),
    INDEX idx_product_id (product_id),
    INDEX idx_tier_name (tier_name),
    INDEX idx_pricing_model (pricing_model),
    INDEX idx_status (status),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- End of Migration
-- ============================================
