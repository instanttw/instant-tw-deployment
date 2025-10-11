/**
 * API Key Management
 * Generates and manages API keys for Enterprise users
 */

import { sql } from './db-neon';
import crypto from 'crypto';

/**
 * Generate a secure API key
 */
export function generateApiKey(): string {
  const prefix = 'wp_scan';
  const randomBytes = crypto.randomBytes(32).toString('hex');
  return `${prefix}_${randomBytes}`;
}

/**
 * Hash an API key for secure storage
 */
export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

/**
 * Create a new API key for a user
 */
export async function createApiKey(
  userId: string,
  name: string,
  expiresInDays?: number
): Promise<{ apiKey: string; id: string }> {
  const apiKey = generateApiKey();
  const hashedKey = hashApiKey(apiKey);
  
  let expiresAt = null;
  if (expiresInDays) {
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + expiresInDays);
    expiresAt = expDate.toISOString();
  }
  
  const result = await sql`
    INSERT INTO wp_scan_api_keys (
      user_id,
      key_hash,
      name,
      expires_at,
      is_active
    ) VALUES (
      ${userId},
      ${hashedKey},
      ${name},
      ${expiresAt},
      true
    )
    RETURNING id
  `;
  
  return {
    apiKey, // Return the plain key only once
    id: result[0].id,
  };
}

/**
 * Validate an API key and return user info
 */
export async function validateApiKey(apiKey: string): Promise<{
  valid: boolean;
  userId?: string;
  plan?: string;
  keyId?: string;
} | null> {
  const hashedKey = hashApiKey(apiKey);
  
  const results = await sql`
    SELECT 
      k.id as key_id,
      k.user_id,
      k.expires_at,
      k.is_active,
      u.plan,
      u.subscription_status
    FROM wp_scan_api_keys k
    JOIN wp_scan_users u ON k.user_id = u.id
    WHERE k.key_hash = ${hashedKey}
    LIMIT 1
  `;
  
  if (results.length === 0) {
    return { valid: false };
  }
  
  const key = results[0];
  
  // Check if key is active
  if (!key.is_active) {
    return { valid: false };
  }
  
  // Check if key is expired
  if (key.expires_at && new Date(key.expires_at) < new Date()) {
    return { valid: false };
  }
  
  // Check if user's subscription is active
  if (key.subscription_status !== 'active') {
    return { valid: false };
  }
  
  // Update last used timestamp
  await sql`
    UPDATE wp_scan_api_keys
    SET last_used_at = CURRENT_TIMESTAMP
    WHERE id = ${key.key_id}
  `;
  
  return {
    valid: true,
    userId: key.user_id,
    plan: key.plan,
    keyId: key.key_id,
  };
}

/**
 * List all API keys for a user
 */
export async function listApiKeys(userId: string) {
  const keys = await sql`
    SELECT 
      id,
      name,
      created_at,
      last_used_at,
      expires_at,
      is_active
    FROM wp_scan_api_keys
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  
  return keys;
}

/**
 * Revoke (deactivate) an API key
 */
export async function revokeApiKey(keyId: string, userId: string): Promise<boolean> {
  const result = await sql`
    UPDATE wp_scan_api_keys
    SET is_active = false
    WHERE id = ${keyId} AND user_id = ${userId}
  `;
  
  return result.count > 0;
}

/**
 * Delete an API key permanently
 */
export async function deleteApiKey(keyId: string, userId: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM wp_scan_api_keys
    WHERE id = ${keyId} AND user_id = ${userId}
  `;
  
  return result.count > 0;
}

/**
 * Get API key usage statistics
 */
export async function getApiKeyStats(keyId: string, userId: string) {
  const stats = await sql`
    SELECT 
      COUNT(*) as total_requests,
      MAX(created_at) as last_request_at
    FROM wp_scan_audit_log
    WHERE user_id = ${userId}
    AND action LIKE 'api:%'
  `;
  
  return stats[0] || { total_requests: 0, last_request_at: null };
}
