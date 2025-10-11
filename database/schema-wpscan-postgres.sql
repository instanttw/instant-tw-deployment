-- WP Scan Database Schema
-- Phase 2: Free vs Paid Differentiation
-- PostgreSQL / Neon compatible

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE plan_type AS ENUM ('FREE', 'PRO', 'AGENCY', 'ENTERPRISE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE scan_frequency_type AS ENUM ('MANUAL', 'WEEKLY', 'DAILY', 'REALTIME');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status_type AS ENUM ('active', 'canceled', 'past_due', 'incomplete');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE scan_status_type AS ENUM ('completed', 'failed', 'in_progress');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE finding_type AS ENUM ('VULNERABILITY', 'OUTDATED', 'SECURITY_ISSUE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_type AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE finding_status_type AS ENUM ('OPEN', 'ACKNOWLEDGED', 'FIXED', 'FALSE_POSITIVE', 'IGNORED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE component_type AS ENUM ('CORE', 'PLUGIN', 'THEME');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('EMAIL', 'SLACK', 'WEBHOOK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_status_type AS ENUM ('PENDING', 'SENT', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table (extends NextAuth)
CREATE TABLE IF NOT EXISTS wp_scan_users (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password VARCHAR(255),
  email_verified TIMESTAMP,
  image VARCHAR(500),
  plan plan_type DEFAULT 'FREE',
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255),
  subscription_status subscription_status_type,
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON wp_scan_users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON wp_scan_users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_plan ON wp_scan_users(plan);

-- Websites table (sites being monitored)
CREATE TABLE IF NOT EXISTS wp_scan_websites (
  id VARCHAR(191) PRIMARY KEY,
  user_id VARCHAR(191) NOT NULL REFERENCES wp_scan_users(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  name VARCHAR(255),
  scan_frequency scan_frequency_type DEFAULT 'MANUAL',
  last_scanned_at TIMESTAMP,
  next_scan_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, url)
);

CREATE INDEX IF NOT EXISTS idx_websites_user_id ON wp_scan_websites(user_id);
CREATE INDEX IF NOT EXISTS idx_websites_last_scanned ON wp_scan_websites(last_scanned_at);
CREATE INDEX IF NOT EXISTS idx_websites_next_scan ON wp_scan_websites(next_scan_at);
CREATE INDEX IF NOT EXISTS idx_websites_active ON wp_scan_websites(is_active);

-- Scans table (scan history)
CREATE TABLE IF NOT EXISTS wp_scan_scans (
  id VARCHAR(191) PRIMARY KEY,
  website_id VARCHAR(191) NOT NULL REFERENCES wp_scan_websites(id) ON DELETE CASCADE,
  user_id VARCHAR(191) NOT NULL REFERENCES wp_scan_users(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scan_duration_ms INTEGER,
  risk_score INTEGER,
  total_vulnerabilities INTEGER DEFAULT 0,
  critical_count INTEGER DEFAULT 0,
  high_count INTEGER DEFAULT 0,
  medium_count INTEGER DEFAULT 0,
  low_count INTEGER DEFAULT 0,
  detection_confidence INTEGER,
  
  -- WordPress data (JSONB for better querying)
  core_data JSONB,
  plugins_data JSONB,
  themes_data JSONB,
  security_data JSONB,
  
  -- Status
  status scan_status_type DEFAULT 'completed',
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scans_website_id ON wp_scan_scans(website_id);
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON wp_scan_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON wp_scan_scans(scanned_at);
CREATE INDEX IF NOT EXISTS idx_scans_risk_score ON wp_scan_scans(risk_score);

-- Findings table (individual vulnerabilities/issues)
CREATE TABLE IF NOT EXISTS wp_scan_findings (
  id VARCHAR(191) PRIMARY KEY,
  scan_id VARCHAR(191) NOT NULL REFERENCES wp_scan_scans(id) ON DELETE CASCADE,
  website_id VARCHAR(191) NOT NULL REFERENCES wp_scan_websites(id) ON DELETE CASCADE,
  
  -- Finding details
  type finding_type NOT NULL,
  severity severity_type NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  
  -- Vulnerability specific
  cve_id VARCHAR(100),
  cvss_score DECIMAL(3,1),
  
  -- Affected component
  component_type component_type NOT NULL,
  component_slug VARCHAR(255),
  component_name VARCHAR(255),
  affected_version VARCHAR(50),
  fixed_in VARCHAR(50),
  
  -- Status tracking
  status finding_status_type DEFAULT 'OPEN',
  first_detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_findings_scan_id ON wp_scan_findings(scan_id);
CREATE INDEX IF NOT EXISTS idx_findings_website_id ON wp_scan_findings(website_id);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON wp_scan_findings(severity);
CREATE INDEX IF NOT EXISTS idx_findings_status ON wp_scan_findings(status);
CREATE INDEX IF NOT EXISTS idx_findings_cve_id ON wp_scan_findings(cve_id);
CREATE INDEX IF NOT EXISTS idx_findings_component ON wp_scan_findings(component_type, component_slug);

-- API Keys table (for Enterprise users)
CREATE TABLE IF NOT EXISTS wp_scan_api_keys (
  id VARCHAR(191) PRIMARY KEY,
  user_id VARCHAR(191) NOT NULL REFERENCES wp_scan_users(id) ON DELETE CASCADE,
  key_hash VARCHAR(255) UNIQUE NOT NULL,
  key_prefix VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON wp_scan_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON wp_scan_api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON wp_scan_api_keys(is_active);

-- Notifications table (email/webhook history)
CREATE TABLE IF NOT EXISTS wp_scan_notifications (
  id VARCHAR(191) PRIMARY KEY,
  user_id VARCHAR(191) NOT NULL REFERENCES wp_scan_users(id) ON DELETE CASCADE,
  website_id VARCHAR(191) REFERENCES wp_scan_websites(id) ON DELETE SET NULL,
  scan_id VARCHAR(191) REFERENCES wp_scan_scans(id) ON DELETE SET NULL,
  
  type notification_type NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  status notification_status_type DEFAULT 'PENDING',
  
  recipient VARCHAR(500),
  subject VARCHAR(500),
  content TEXT,
  error_message TEXT,
  
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON wp_scan_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON wp_scan_notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON wp_scan_notifications(type);

-- User settings table (preferences)
CREATE TABLE IF NOT EXISTS wp_scan_user_settings (
  user_id VARCHAR(191) PRIMARY KEY REFERENCES wp_scan_users(id) ON DELETE CASCADE,
  
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
  default_scan_frequency scan_frequency_type DEFAULT 'WEEKLY',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON wp_scan_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON wp_scan_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON wp_scan_audit_log(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_wp_scan_users_updated_at BEFORE UPDATE ON wp_scan_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wp_scan_websites_updated_at BEFORE UPDATE ON wp_scan_websites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wp_scan_findings_updated_at BEFORE UPDATE ON wp_scan_findings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wp_scan_user_settings_updated_at BEFORE UPDATE ON wp_scan_user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
