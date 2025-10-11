-- WP Scan Database Schema
-- Phase 2: Free vs Paid Differentiation
-- MySQL/MariaDB compatible

-- Users table (extends NextAuth)
CREATE TABLE IF NOT EXISTS wp_scan_users (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password VARCHAR(255),
  email_verified TIMESTAMP NULL,
  image VARCHAR(500),
  plan ENUM('FREE', 'PRO', 'AGENCY', 'ENTERPRISE') DEFAULT 'FREE',
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255),
  subscription_status ENUM('active', 'canceled', 'past_due', 'incomplete') NULL,
  trial_ends_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_stripe_customer (stripe_customer_id),
  INDEX idx_plan (plan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Websites table (sites being monitored)
CREATE TABLE IF NOT EXISTS wp_scan_websites (
  id VARCHAR(191) PRIMARY KEY,
  user_id VARCHAR(191) NOT NULL,
  url VARCHAR(500) NOT NULL,
  name VARCHAR(255),
  scan_frequency ENUM('MANUAL', 'WEEKLY', 'DAILY', 'REALTIME') DEFAULT 'MANUAL',
  last_scanned_at TIMESTAMP NULL,
  next_scan_at TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES wp_scan_users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_url (user_id, url),
  INDEX idx_user_id (user_id),
  INDEX idx_last_scanned (last_scanned_at),
  INDEX idx_next_scan (next_scan_at),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Scans table (scan history)
CREATE TABLE IF NOT EXISTS wp_scan_scans (
  id VARCHAR(191) PRIMARY KEY,
  website_id VARCHAR(191) NOT NULL,
  user_id VARCHAR(191) NOT NULL,
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scan_duration_ms INT,
  risk_score INT,
  total_vulnerabilities INT DEFAULT 0,
  critical_count INT DEFAULT 0,
  high_count INT DEFAULT 0,
  medium_count INT DEFAULT 0,
  low_count INT DEFAULT 0,
  detection_confidence INT,
  
  -- WordPress data (JSON stored as TEXT)
  core_data TEXT,
  plugins_data TEXT,
  themes_data TEXT,
  security_data TEXT,
  
  -- Status
  status ENUM('completed', 'failed', 'in_progress') DEFAULT 'completed',
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (website_id) REFERENCES wp_scan_websites(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES wp_scan_users(id) ON DELETE CASCADE,
  INDEX idx_website_id (website_id),
  INDEX idx_user_id (user_id),
  INDEX idx_scanned_at (scanned_at),
  INDEX idx_risk_score (risk_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Findings table (individual vulnerabilities/issues)
CREATE TABLE IF NOT EXISTS wp_scan_findings (
  id VARCHAR(191) PRIMARY KEY,
  scan_id VARCHAR(191) NOT NULL,
  website_id VARCHAR(191) NOT NULL,
  
  -- Finding details
  type ENUM('VULNERABILITY', 'OUTDATED', 'SECURITY_ISSUE') NOT NULL,
  severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  
  -- Vulnerability specific
  cve_id VARCHAR(100),
  cvss_score DECIMAL(3,1),
  
  -- Affected component
  component_type ENUM('CORE', 'PLUGIN', 'THEME') NOT NULL,
  component_slug VARCHAR(255),
  component_name VARCHAR(255),
  affected_version VARCHAR(50),
  fixed_in VARCHAR(50),
  
  -- Status tracking
  status ENUM('OPEN', 'ACKNOWLEDGED', 'FIXED', 'FALSE_POSITIVE', 'IGNORED') DEFAULT 'OPEN',
  first_detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (scan_id) REFERENCES wp_scan_scans(id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES wp_scan_websites(id) ON DELETE CASCADE,
  INDEX idx_scan_id (scan_id),
  INDEX idx_website_id (website_id),
  INDEX idx_severity (severity),
  INDEX idx_status (status),
  INDEX idx_cve_id (cve_id),
  INDEX idx_component (component_type, component_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- API Keys table (for Enterprise users)
CREATE TABLE IF NOT EXISTS wp_scan_api_keys (
  id VARCHAR(191) PRIMARY KEY,
  user_id VARCHAR(191) NOT NULL,
  key_hash VARCHAR(255) UNIQUE NOT NULL,
  key_prefix VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  last_used_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES wp_scan_users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_key_hash (key_hash),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications table (email/webhook history)
CREATE TABLE IF NOT EXISTS wp_scan_notifications (
  id VARCHAR(191) PRIMARY KEY,
  user_id VARCHAR(191) NOT NULL,
  website_id VARCHAR(191),
  scan_id VARCHAR(191),
  
  type ENUM('EMAIL', 'SLACK', 'WEBHOOK') NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  status ENUM('PENDING', 'SENT', 'FAILED') DEFAULT 'PENDING',
  
  recipient VARCHAR(500),
  subject VARCHAR(500),
  content TEXT,
  error_message TEXT,
  
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES wp_scan_users(id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES wp_scan_websites(id) ON DELETE SET NULL,
  FOREIGN KEY (scan_id) REFERENCES wp_scan_scans(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User settings table (preferences)
CREATE TABLE IF NOT EXISTS wp_scan_user_settings (
  user_id VARCHAR(191) PRIMARY KEY,
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  slack_webhook_url VARCHAR(500),
  webhook_url VARCHAR(500),
  webhook_secret VARCHAR(255),
  
  -- Report preferences
  white_label_enabled BOOLEAN DEFAULT FALSE,
  company_name VARCHAR(255),
  company_logo_url VARCHAR(500),
  
  -- Scan preferences
  default_scan_frequency ENUM('MANUAL', 'WEEKLY', 'DAILY') DEFAULT 'WEEKLY',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES wp_scan_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit log table (for security and compliance)
CREATE TABLE IF NOT EXISTS wp_scan_audit_log (
  id VARCHAR(191) PRIMARY KEY,
  user_id VARCHAR(191),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(191),
  details TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
