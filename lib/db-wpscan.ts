/**
 * WP Scan Database Functions
 * Phase 2: Free vs Paid Differentiation
 * PostgreSQL / Neon compatible
 */

import { query, queryOne } from './db-neon';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// TYPES
// ============================================================================

export type Plan = 'FREE' | 'PRO' | 'AGENCY' | 'ENTERPRISE';
export type ScanFrequency = 'MANUAL' | 'WEEKLY' | 'DAILY' | 'REALTIME';
export type FindingSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type FindingStatus = 'OPEN' | 'ACKNOWLEDGED' | 'FIXED' | 'FALSE_POSITIVE' | 'IGNORED';

export interface WPScanUser {
  id: string;
  email: string;
  name?: string;
  plan: Plan;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status?: 'active' | 'canceled' | 'past_due' | 'incomplete';
  created_at: Date;
  updated_at: Date;
}

export interface Website {
  id: string;
  user_id: string;
  url: string;
  name?: string;
  scan_frequency: ScanFrequency;
  last_scanned_at?: Date;
  next_scan_at?: Date;
  is_active: boolean;
  notifications_enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Scan {
  id: string;
  website_id: string;
  user_id: string;
  scanned_at: Date;
  scan_duration_ms?: number;
  risk_score?: number;
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  detection_confidence?: number;
  core_data?: string; // JSON
  plugins_data?: string; // JSON
  themes_data?: string; // JSON
  security_data?: string; // JSON
  status: 'completed' | 'failed' | 'in_progress';
  error_message?: string;
  created_at: Date;
}

export interface Finding {
  id: string;
  scan_id: string;
  website_id: string;
  type: 'VULNERABILITY' | 'OUTDATED' | 'SECURITY_ISSUE';
  severity: FindingSeverity;
  title: string;
  description?: string;
  cve_id?: string;
  cvss_score?: number;
  component_type: 'CORE' | 'PLUGIN' | 'THEME';
  component_slug?: string;
  component_name?: string;
  affected_version?: string;
  fixed_in?: string;
  status: FindingStatus;
  first_detected_at: Date;
  last_seen_at: Date;
  resolved_at?: Date;
}

// ============================================================================
// USER FUNCTIONS
// ============================================================================

export async function getUserByEmail(email: string): Promise<WPScanUser | null> {
  return queryOne<WPScanUser>(
    'SELECT * FROM wp_scan_users WHERE email = ?',
    [email]
  );
}

export async function getUserById(id: string): Promise<WPScanUser | null> {
  return queryOne<WPScanUser>(
    'SELECT * FROM wp_scan_users WHERE id = ?',
    [id]
  );
}

export async function createUser(data: {
  email: string;
  name?: string;
  password?: string;
  plan?: Plan;
}): Promise<WPScanUser> {
  const id = uuidv4();
  const plan = data.plan || 'FREE';
  
  await query(
    `INSERT INTO wp_scan_users (id, email, name, password, plan) 
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.email, data.name || null, data.password || null, plan]
  );
  
  return getUserById(id) as Promise<WPScanUser>;
}

export async function updateUserPlan(
  userId: string,
  plan: Plan,
  stripeData?: {
    customerId?: string;
    subscriptionId?: string;
    status?: 'active' | 'canceled' | 'past_due' | 'incomplete';
  }
): Promise<void> {
  await query(
    `UPDATE wp_scan_users 
     SET plan = ?, 
         stripe_customer_id = COALESCE(?, stripe_customer_id),
         stripe_subscription_id = COALESCE(?, stripe_subscription_id),
         subscription_status = COALESCE(?, subscription_status)
     WHERE id = ?`,
    [
      plan,
      stripeData?.customerId || null,
      stripeData?.subscriptionId || null,
      stripeData?.status || null,
      userId
    ]
  );
}

// ============================================================================
// WEBSITE FUNCTIONS
// ============================================================================

export async function getWebsitesByUserId(userId: string): Promise<Website[]> {
  return query<Website>(
    'SELECT * FROM wp_scan_websites WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
}

export async function getWebsiteById(id: string): Promise<Website | null> {
  return queryOne<Website>(
    'SELECT * FROM wp_scan_websites WHERE id = ?',
    [id]
  );
}

export async function createWebsite(data: {
  user_id: string;
  url: string;
  name?: string;
  scan_frequency?: ScanFrequency;
}): Promise<Website> {
  const id = uuidv4();
  
  await query(
    `INSERT INTO wp_scan_websites (id, user_id, url, name, scan_frequency) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      id,
      data.user_id,
      data.url,
      data.name || null,
      data.scan_frequency || 'MANUAL'
    ]
  );
  
  return getWebsiteById(id) as Promise<Website>;
}

export async function updateWebsite(
  id: string,
  data: Partial<Pick<Website, 'name' | 'scan_frequency' | 'is_active' | 'notifications_enabled'>>
): Promise<void> {
  const updates: string[] = [];
  const values: unknown[] = [];
  
  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.scan_frequency !== undefined) {
    updates.push('scan_frequency = ?');
    values.push(data.scan_frequency);
  }
  if (data.is_active !== undefined) {
    updates.push('is_active = ?');
    values.push(data.is_active);
  }
  if (data.notifications_enabled !== undefined) {
    updates.push('notifications_enabled = ?');
    values.push(data.notifications_enabled);
  }
  
  if (updates.length > 0) {
    values.push(id);
    await query(
      `UPDATE wp_scan_websites SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }
}

export async function deleteWebsite(id: string): Promise<void> {
  await query('DELETE FROM wp_scan_websites WHERE id = ?', [id]);
}

export async function updateWebsiteLastScan(
  id: string,
  nextScanAt?: Date
): Promise<void> {
  await query(
    `UPDATE wp_scan_websites 
     SET last_scanned_at = CURRENT_TIMESTAMP,
         next_scan_at = ?
     WHERE id = ?`,
    [nextScanAt || null, id]
  );
}

// ============================================================================
// SCAN FUNCTIONS
// ============================================================================

export async function getScansByWebsiteId(
  websiteId: string,
  limit: number = 10
): Promise<Scan[]> {
  return query<Scan>(
    `SELECT * FROM wp_scan_scans 
     WHERE website_id = ? 
     ORDER BY scanned_at DESC 
     LIMIT ?`,
    [websiteId, limit]
  );
}

export async function getScanById(id: string): Promise<Scan | null> {
  return queryOne<Scan>(
    'SELECT * FROM wp_scan_scans WHERE id = ?',
    [id]
  );
}

export async function createScan(data: {
  website_id: string;
  user_id: string;
  scan_duration_ms?: number;
  risk_score?: number;
  total_vulnerabilities?: number;
  critical_count?: number;
  high_count?: number;
  medium_count?: number;
  low_count?: number;
  detection_confidence?: number;
  core_data?: object;
  plugins_data?: object;
  themes_data?: object;
  security_data?: object;
  status?: 'completed' | 'failed' | 'in_progress';
  error_message?: string;
}): Promise<Scan> {
  const id = uuidv4();
  
  await query(
    `INSERT INTO wp_scan_scans (
      id, website_id, user_id, scan_duration_ms, risk_score,
      total_vulnerabilities, critical_count, high_count, medium_count, low_count,
      detection_confidence, core_data, plugins_data, themes_data, security_data,
      status, error_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.website_id,
      data.user_id,
      data.scan_duration_ms || null,
      data.risk_score || null,
      data.total_vulnerabilities || 0,
      data.critical_count || 0,
      data.high_count || 0,
      data.medium_count || 0,
      data.low_count || 0,
      data.detection_confidence || null,
      data.core_data ? JSON.stringify(data.core_data) : null,
      data.plugins_data ? JSON.stringify(data.plugins_data) : null,
      data.themes_data ? JSON.stringify(data.themes_data) : null,
      data.security_data ? JSON.stringify(data.security_data) : null,
      data.status || 'completed',
      data.error_message || null
    ]
  );
  
  return getScanById(id) as Promise<Scan>;
}

export async function getLatestScanForWebsite(websiteId: string): Promise<Scan | null> {
  return queryOne<Scan>(
    `SELECT * FROM wp_scan_scans 
     WHERE website_id = ? 
     ORDER BY scanned_at DESC 
     LIMIT 1`,
    [websiteId]
  );
}

// ============================================================================
// FINDING FUNCTIONS
// ============================================================================

export async function createFinding(data: {
  scan_id: string;
  website_id: string;
  type: 'VULNERABILITY' | 'OUTDATED' | 'SECURITY_ISSUE';
  severity: FindingSeverity;
  title: string;
  description?: string;
  cve_id?: string;
  cvss_score?: number;
  component_type: 'CORE' | 'PLUGIN' | 'THEME';
  component_slug?: string;
  component_name?: string;
  affected_version?: string;
  fixed_in?: string;
}): Promise<Finding> {
  const id = uuidv4();
  
  await query(
    `INSERT INTO wp_scan_findings (
      id, scan_id, website_id, type, severity, title, description,
      cve_id, cvss_score, component_type, component_slug, component_name,
      affected_version, fixed_in
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.scan_id,
      data.website_id,
      data.type,
      data.severity,
      data.title,
      data.description || null,
      data.cve_id || null,
      data.cvss_score || null,
      data.component_type,
      data.component_slug || null,
      data.component_name || null,
      data.affected_version || null,
      data.fixed_in || null
    ]
  );
  
  return queryOne<Finding>(
    'SELECT * FROM wp_scan_findings WHERE id = ?',
    [id]
  ) as Promise<Finding>;
}

export async function getFindingsByScanId(scanId: string): Promise<Finding[]> {
  return query<Finding>(
    'SELECT * FROM wp_scan_findings WHERE scan_id = ? ORDER BY severity DESC, created_at DESC',
    [scanId]
  );
}

export async function getOpenFindingsByWebsite(websiteId: string): Promise<Finding[]> {
  return query<Finding>(
    `SELECT * FROM wp_scan_findings 
     WHERE website_id = ? AND status = 'OPEN' 
     ORDER BY severity DESC, first_detected_at DESC`,
    [websiteId]
  );
}

export async function updateFindingStatus(
  id: string,
  status: FindingStatus
): Promise<void> {
  const resolvedAt = status === 'FIXED' ? new Date() : null;
  
  await query(
    `UPDATE wp_scan_findings 
     SET status = ?, resolved_at = ?, last_seen_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [status, resolvedAt, id]
  );
}

// ============================================================================
// STATISTICS FUNCTIONS
// ============================================================================

export async function getUserStats(userId: string): Promise<{
  total_websites: number;
  total_scans: number;
  open_vulnerabilities: number;
  critical_vulnerabilities: number;
}> {
  const stats = await queryOne<any>(
    `SELECT 
      (SELECT COUNT(*) FROM wp_scan_websites WHERE user_id = ? AND is_active = 1) as total_websites,
      (SELECT COUNT(*) FROM wp_scan_scans WHERE user_id = ?) as total_scans,
      (SELECT COUNT(*) FROM wp_scan_findings f 
       INNER JOIN wp_scan_websites w ON f.website_id = w.id 
       WHERE w.user_id = ? AND f.status = 'OPEN') as open_vulnerabilities,
      (SELECT COUNT(*) FROM wp_scan_findings f 
       INNER JOIN wp_scan_websites w ON f.website_id = w.id 
       WHERE w.user_id = ? AND f.status = 'OPEN' AND f.severity = 'CRITICAL') as critical_vulnerabilities`,
    [userId, userId, userId, userId]
  );
  
  return stats || { total_websites: 0, total_scans: 0, open_vulnerabilities: 0, critical_vulnerabilities: 0 };
}

// ============================================================================
// PLAN LIMITS
// ============================================================================

export interface PlanLimits {
  maxWebsites: number;
  scanFrequency: ScanFrequency;
  showCVEDetails: boolean;
  showCVSSScores: boolean;
  downloadReports: boolean;
  emailAlerts: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
  webhooks: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    maxWebsites: 0, // Scan-only, no save
    scanFrequency: 'MANUAL',
    showCVEDetails: false,
    showCVSSScores: false,
    downloadReports: false,
    emailAlerts: false,
    apiAccess: false,
    whiteLabel: false,
    webhooks: false,
  },
  PRO: {
    maxWebsites: 3,
    scanFrequency: 'WEEKLY',
    showCVEDetails: true,
    showCVSSScores: false,
    downloadReports: true,
    emailAlerts: true,
    apiAccess: false,
    whiteLabel: false,
    webhooks: false,
  },
  AGENCY: {
    maxWebsites: 25,
    scanFrequency: 'DAILY',
    showCVEDetails: true,
    showCVSSScores: true,
    downloadReports: true,
    emailAlerts: true,
    apiAccess: false,
    whiteLabel: true,
    webhooks: true,
  },
  ENTERPRISE: {
    maxWebsites: -1, // Unlimited
    scanFrequency: 'REALTIME',
    showCVEDetails: true,
    showCVSSScores: true,
    downloadReports: true,
    emailAlerts: true,
    apiAccess: true,
    whiteLabel: true,
    webhooks: true,
  },
};

export function getPlanLimits(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan];
}

export async function canUserAddWebsite(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user) return false;
  
  const limits = getPlanLimits(user.plan);
  if (limits.maxWebsites === -1) return true; // Unlimited
  if (limits.maxWebsites === 0) return false; // Free plan
  
  const websites = await getWebsitesByUserId(userId);
  return websites.length < limits.maxWebsites;
}
