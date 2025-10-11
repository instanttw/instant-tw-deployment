-- ============================================
-- Instant WordPress Platform - Database Schema
-- MySQL/MariaDB Compatible (DirectAdmin)
-- For existing database: admin_wpinstant
-- ============================================

-- Note: Database already exists, no need to create it
-- USE admin_wpinstant; -- Uncomment if needed

-- -------------------------
-- Users Table
-- -------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) DEFAULT NULL,
    `name` VARCHAR(255) DEFAULT NULL,
    `avatar_url` VARCHAR(500) DEFAULT NULL,
    `email_verified` TINYINT(1) DEFAULT 0,
    `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
    `two_factor_enabled` TINYINT(1) DEFAULT 0,
    `two_factor_secret` VARCHAR(255) DEFAULT NULL,
    `role` ENUM('user', 'admin', 'support') DEFAULT 'user',
    `status` ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
    `last_login_at` TIMESTAMP NULL DEFAULT NULL,
    `last_login_ip` VARCHAR(45) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `email` (`email`),
    KEY `idx_email` (`email`),
    KEY `idx_status` (`status`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- OAuth Accounts Table
-- -------------------------
DROP TABLE IF EXISTS `oauth_accounts`;
CREATE TABLE `oauth_accounts` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `provider` ENUM('google', 'github') NOT NULL,
    `provider_account_id` VARCHAR(255) NOT NULL,
    `access_token` TEXT DEFAULT NULL,
    `refresh_token` TEXT DEFAULT NULL,
    `expires_at` TIMESTAMP NULL DEFAULT NULL,
    `token_type` VARCHAR(50) DEFAULT NULL,
    `scope` TEXT DEFAULT NULL,
    `id_token` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_provider_account` (`provider`, `provider_account_id`),
    KEY `idx_user_id` (`user_id`),
    CONSTRAINT `oauth_accounts_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Sessions Table
-- -------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
    `id` VARCHAR(255) PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `session_token` VARCHAR(255) NOT NULL,
    `access_token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `session_token` (`session_token`),
    UNIQUE KEY `access_token` (`access_token`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_expires_at` (`expires_at`),
    CONSTRAINT `sessions_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Verification Tokens Table
-- -------------------------
DROP TABLE IF EXISTS `verification_tokens`;
CREATE TABLE `verification_tokens` (
    `identifier` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`identifier`, `token`),
    KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Subscriptions Table
-- -------------------------
DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `plan_type` ENUM('pro', 'agency', 'enterprise') NOT NULL,
    `billing_cycle` ENUM('monthly', 'yearly') NOT NULL,
    `status` ENUM('active', 'cancelled', 'past_due', 'unpaid', 'trialing') NOT NULL DEFAULT 'active',
    `stripe_subscription_id` VARCHAR(255) DEFAULT NULL,
    `stripe_customer_id` VARCHAR(255) DEFAULT NULL,
    `stripe_price_id` VARCHAR(255) DEFAULT NULL,
    `current_period_start` TIMESTAMP NOT NULL,
    `current_period_end` TIMESTAMP NOT NULL,
    `cancel_at_period_end` TINYINT(1) DEFAULT 0,
    `cancelled_at` TIMESTAMP NULL DEFAULT NULL,
    `trial_end` TIMESTAMP NULL DEFAULT NULL,
    `websites_limit` INT NOT NULL DEFAULT 3,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `stripe_subscription_id` (`stripe_subscription_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status` (`status`),
    KEY `idx_stripe_subscription_id` (`stripe_subscription_id`),
    KEY `idx_current_period_end` (`current_period_end`),
    CONSTRAINT `subscriptions_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Orders Table
-- -------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `order_number` VARCHAR(50) NOT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(3) DEFAULT 'USD',
    `status` ENUM('pending', 'processing', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    `payment_method` ENUM('stripe', 'paypal', 'wire_transfer') NOT NULL DEFAULT 'stripe',
    `stripe_payment_intent_id` VARCHAR(255) DEFAULT NULL,
    `stripe_charge_id` VARCHAR(255) DEFAULT NULL,
    `invoice_url` VARCHAR(500) DEFAULT NULL,
    `receipt_url` VARCHAR(500) DEFAULT NULL,
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `order_number` (`order_number`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_order_number` (`order_number`),
    KEY `idx_status` (`status`),
    KEY `idx_created_at` (`created_at`),
    CONSTRAINT `orders_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Order Items Table
-- -------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_id` BIGINT UNSIGNED NOT NULL,
    `product_type` ENUM('plugin', 'theme', 'service', 'subscription') NOT NULL,
    `product_id` VARCHAR(255) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `metadata` JSON DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_order_id` (`order_id`),
    KEY `idx_product_type` (`product_type`),
    CONSTRAINT `order_items_order_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Websites Table
-- -------------------------
DROP TABLE IF EXISTS `websites`;
CREATE TABLE `websites` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `domain` VARCHAR(255) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `status` ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'active',
    `hosting_plan` ENUM('none', 'basic', 'pro', 'enterprise') DEFAULT 'none',
    `directadmin_username` VARCHAR(100) DEFAULT NULL,
    `directadmin_domain` VARCHAR(255) DEFAULT NULL,
    `wordpress_version` VARCHAR(20) DEFAULT NULL,
    `php_version` VARCHAR(20) DEFAULT NULL,
    `ssl_enabled` TINYINT(1) DEFAULT 0,
    `last_scan_at` TIMESTAMP NULL DEFAULT NULL,
    `last_backup_at` TIMESTAMP NULL DEFAULT NULL,
    `disk_usage_mb` INT DEFAULT 0,
    `bandwidth_usage_mb` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_user_domain` (`user_id`, `domain`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_domain` (`domain`),
    KEY `idx_status` (`status`),
    KEY `idx_last_scan_at` (`last_scan_at`),
    CONSTRAINT `websites_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Website Reports Table
-- -------------------------
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `website_id` BIGINT UNSIGNED NOT NULL,
    `report_type` ENUM('security', 'performance', 'seo', 'uptime', 'broken_links') NOT NULL,
    `status` ENUM('pending', 'in_progress', 'completed', 'failed') DEFAULT 'pending',
    `score` INT DEFAULT NULL,
    `data` JSON DEFAULT NULL,
    `issues_found` INT DEFAULT 0,
    `issues_critical` INT DEFAULT 0,
    `issues_warning` INT DEFAULT 0,
    `issues_info` INT DEFAULT 0,
    `pdf_url` VARCHAR(500) DEFAULT NULL,
    `generated_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_website_id` (`website_id`),
    KEY `idx_report_type` (`report_type`),
    KEY `idx_generated_at` (`generated_at`),
    KEY `idx_status` (`status`),
    CONSTRAINT `reports_website_fk` FOREIGN KEY (`website_id`) REFERENCES `websites`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Licenses Table
-- -------------------------
DROP TABLE IF EXISTS `licenses`;
CREATE TABLE `licenses` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `license_key` VARCHAR(255) NOT NULL,
    `product_type` ENUM('plugin', 'theme', 'subscription') NOT NULL,
    `product_id` VARCHAR(255) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `website_id` BIGINT UNSIGNED DEFAULT NULL,
    `status` ENUM('active', 'expired', 'suspended', 'revoked') DEFAULT 'active',
    `activations_limit` INT DEFAULT 1,
    `activations_count` INT DEFAULT 0,
    `expires_at` TIMESTAMP NULL DEFAULT NULL,
    `last_checked_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `license_key` (`license_key`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_license_key` (`license_key`),
    KEY `idx_status` (`status`),
    KEY `idx_expires_at` (`expires_at`),
    CONSTRAINT `licenses_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    CONSTRAINT `licenses_website_fk` FOREIGN KEY (`website_id`) REFERENCES `websites`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Downloads Table
-- -------------------------
DROP TABLE IF EXISTS `downloads`;
CREATE TABLE `downloads` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `product_type` ENUM('plugin', 'theme') NOT NULL,
    `product_id` VARCHAR(255) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `version` VARCHAR(20) NOT NULL,
    `file_url` VARCHAR(500) NOT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` TEXT DEFAULT NULL,
    `downloaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_user_id` (`user_id`),
    KEY `idx_product_type` (`product_type`),
    KEY `idx_downloaded_at` (`downloaded_at`),
    CONSTRAINT `downloads_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Support Tickets Table
-- -------------------------
DROP TABLE IF EXISTS `support_tickets`;
CREATE TABLE `support_tickets` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `ticket_number` VARCHAR(50) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('open', 'in_progress', 'waiting_reply', 'resolved', 'closed') DEFAULT 'open',
    `priority` ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    `category` ENUM('general', 'technical', 'billing', 'feature_request', 'bug_report') NOT NULL,
    `assigned_to` BIGINT UNSIGNED DEFAULT NULL,
    `last_reply_at` TIMESTAMP NULL DEFAULT NULL,
    `closed_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `ticket_number` (`ticket_number`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_ticket_number` (`ticket_number`),
    KEY `idx_status` (`status`),
    KEY `idx_created_at` (`created_at`),
    CONSTRAINT `support_tickets_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    CONSTRAINT `support_tickets_assigned_fk` FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Support Ticket Replies Table
-- -------------------------
DROP TABLE IF EXISTS `support_ticket_replies`;
CREATE TABLE `support_ticket_replies` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `ticket_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `message` TEXT NOT NULL,
    `is_staff_reply` TINYINT(1) DEFAULT 0,
    `attachments` JSON DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_ticket_id` (`ticket_id`),
    KEY `idx_created_at` (`created_at`),
    CONSTRAINT `ticket_replies_ticket_fk` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets`(`id`) ON DELETE CASCADE,
    CONSTRAINT `ticket_replies_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Activity Log Table
-- -------------------------
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED DEFAULT NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(50) DEFAULT NULL,
    `entity_id` BIGINT UNSIGNED DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` TEXT DEFAULT NULL,
    `metadata` JSON DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_user_id` (`user_id`),
    KEY `idx_action` (`action`),
    KEY `idx_entity_type` (`entity_type`),
    KEY `idx_created_at` (`created_at`),
    CONSTRAINT `activity_logs_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- API Keys Table
-- -------------------------
DROP TABLE IF EXISTS `api_keys`;
CREATE TABLE `api_keys` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `key_name` VARCHAR(255) NOT NULL,
    `api_key` VARCHAR(255) NOT NULL,
    `api_secret` VARCHAR(255) DEFAULT NULL,
    `permissions` JSON DEFAULT NULL,
    `last_used_at` TIMESTAMP NULL DEFAULT NULL,
    `expires_at` TIMESTAMP NULL DEFAULT NULL,
    `status` ENUM('active', 'inactive', 'revoked') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `api_key` (`api_key`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_api_key` (`api_key`),
    KEY `idx_status` (`status`),
    CONSTRAINT `api_keys_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Notifications Table
-- -------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `data` JSON DEFAULT NULL,
    `read_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_user_id` (`user_id`),
    KEY `idx_read_at` (`read_at`),
    KEY `idx_created_at` (`created_at`),
    CONSTRAINT `notifications_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- Shopping Cart Table
-- -------------------------
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED DEFAULT NULL,
    `session_id` VARCHAR(255) DEFAULT NULL,
    `product_type` ENUM('plugin', 'theme', 'service', 'subscription') NOT NULL,
    `product_id` VARCHAR(255) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `metadata` JSON DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_user_id` (`user_id`),
    KEY `idx_session_id` (`session_id`),
    KEY `idx_created_at` (`created_at`),
    CONSTRAINT `cart_items_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insert Default Admin User (Optional)
-- ============================================
-- Password: 'admin123' (hashed with bcrypt)
-- IMPORTANT: Change this immediately after first login!
INSERT INTO `users` (`email`, `password_hash`, `name`, `role`, `email_verified`) 
VALUES (
    'admin@instant.tw',
    '$2a$10$XQKx7T2aKJb5NqQYJ4u7qOvKx7LhqI6LPqXY8J1JhQKx7T2aKJb5N',
    'Admin User',
    'admin',
    1
) ON DUPLICATE KEY UPDATE `id`=`id`;

-- ============================================
-- End of Schema
-- ============================================
