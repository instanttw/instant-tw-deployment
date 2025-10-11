/**
 * Database Helper Functions for Orders
 * Handles order, license, and order item operations
 */

import { sql } from '@vercel/postgres';
import crypto from 'crypto';

// ===========================================
// TYPES
// ===========================================

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'refunded' | 'partially_refunded' | 'failed' | 'canceled';
export type LicenseStatus = 'active' | 'expired' | 'revoked' | 'suspended';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  currency: string;
  customer_email?: string;
  customer_name?: string;
  billing_address?: any;
  items: any[];
  metadata?: any;
  notes?: string;
  fulfilled_at?: Date;
  refunded_at?: Date;
  refund_amount?: number;
  refund_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  pricing_tier_id?: string;
  product_name: string;
  product_slug: string;
  tier_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  currency: string;
  metadata?: any;
  created_at: Date;
}

export interface License {
  id: string;
  license_key: string;
  order_id: string;
  order_item_id?: string;
  user_id: string;
  product_id: string;
  status: LicenseStatus;
  tier_name?: string;
  site_limit?: number;
  sites_used: number;
  activated_at?: Date;
  expires_at?: Date;
  last_checked_at?: Date;
  activated_domains: string[];
  metadata?: any;
  created_at: Date;
  updated_at: Date;
}

export interface WebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  stripe_account?: string;
  api_version?: string;
  payload: any;
  processed: boolean;
  processed_at?: Date;
  processing_error?: string;
  retry_count: number;
  metadata?: any;
  received_at: Date;
}

// ===========================================
// ORDER FUNCTIONS
// ===========================================

/**
 * Create a new order
 */
export async function createOrder(orderData: {
  user_id: string;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  status?: OrderStatus;
  subtotal: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  currency?: string;
  customer_email?: string;
  customer_name?: string;
  billing_address?: any;
  items: any[];
  metadata?: any;
}): Promise<Order> {
  try {
    // Generate order number
    const orderNumber = await generateOrderNumber();
    
    const { rows } = await sql`
      INSERT INTO orders (
        order_number,
        user_id,
        stripe_session_id,
        stripe_payment_intent_id,
        stripe_subscription_id,
        stripe_customer_id,
        status,
        subtotal,
        discount_amount,
        tax_amount,
        total_amount,
        currency,
        customer_email,
        customer_name,
        billing_address,
        items,
        metadata
      ) VALUES (
        ${orderNumber},
        ${orderData.user_id},
        ${orderData.stripe_session_id || null},
        ${orderData.stripe_payment_intent_id || null},
        ${orderData.stripe_subscription_id || null},
        ${orderData.stripe_customer_id || null},
        ${orderData.status || 'pending'},
        ${orderData.subtotal},
        ${orderData.discount_amount || 0},
        ${orderData.tax_amount || 0},
        ${orderData.total_amount},
        ${orderData.currency || 'usd'},
        ${orderData.customer_email || null},
        ${orderData.customer_name || null},
        ${orderData.billing_address ? JSON.stringify(orderData.billing_address) : null},
        ${JSON.stringify(orderData.items)},
        ${orderData.metadata ? JSON.stringify(orderData.metadata) : null}
      )
      RETURNING *
    `;
    
    return rows[0] as Order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const { rows } = await sql`
      SELECT * FROM orders WHERE id = ${orderId} LIMIT 1
    `;
    
    if (rows.length === 0) return null;
    return rows[0] as Order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

/**
 * Get order by Stripe session ID
 */
export async function getOrderByStripeSession(sessionId: string): Promise<Order | null> {
  try {
    const { rows } = await sql`
      SELECT * FROM orders WHERE stripe_session_id = ${sessionId} LIMIT 1
    `;
    
    if (rows.length === 0) return null;
    return rows[0] as Order;
  } catch (error) {
    console.error('Error fetching order by session:', error);
    throw error;
  }
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId: string, limit: number = 50): Promise<Order[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM orders 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    
    return rows as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus, metadata?: any): Promise<Order> {
  try {
    const fulfilledAt = status === 'completed' ? new Date() : null;
    const metadataJson = metadata ? JSON.stringify(metadata) : null;
    const { rows } = await sql`
      UPDATE orders 
      SET 
        status = ${status},
        fulfilled_at = ${fulfilledAt as any},
        metadata = COALESCE(${metadataJson}, metadata),
        updated_at = NOW()
      WHERE id = ${orderId}
      RETURNING *
    `;
    
    return rows[0] as Order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

/**
 * Generate unique order number
 */
async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Get count of orders today
  const { rows } = await sql`
    SELECT COUNT(*) as count 
    FROM orders 
    WHERE DATE(created_at) = CURRENT_DATE
  `;
  
  const count = parseInt(rows[0].count) + 1;
  const orderNumber = `ORD-${dateStr}-${count.toString().padStart(6, '0')}`;
  
  return orderNumber;
}

// ===========================================
// ORDER ITEMS FUNCTIONS
// ===========================================

/**
 * Create order item
 */
export async function createOrderItem(itemData: {
  order_id: string;
  product_id: string;
  pricing_tier_id?: string;
  product_name: string;
  product_slug: string;
  tier_name?: string;
  quantity?: number;
  unit_price: number;
  total_price: number;
  currency?: string;
  metadata?: any;
}): Promise<OrderItem> {
  try {
    const { rows } = await sql`
      INSERT INTO order_items (
        order_id,
        product_id,
        pricing_tier_id,
        product_name,
        product_slug,
        tier_name,
        quantity,
        unit_price,
        total_price,
        currency,
        metadata
      ) VALUES (
        ${itemData.order_id},
        ${itemData.product_id},
        ${itemData.pricing_tier_id || null},
        ${itemData.product_name},
        ${itemData.product_slug},
        ${itemData.tier_name || null},
        ${itemData.quantity || 1},
        ${itemData.unit_price},
        ${itemData.total_price},
        ${itemData.currency || 'usd'},
        ${itemData.metadata ? JSON.stringify(itemData.metadata) : null}
      )
      RETURNING *
    `;
    
    return rows[0] as OrderItem;
  } catch (error) {
    console.error('Error creating order item:', error);
    throw error;
  }
}

/**
 * Get order items
 */
export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `;
    
    return rows as OrderItem[];
  } catch (error) {
    console.error('Error fetching order items:', error);
    throw error;
  }
}

// ===========================================
// LICENSE FUNCTIONS
// ===========================================

/**
 * Generate license key
 */
export function generateLicenseKey(): string {
  // Format: XXXX-XXXX-XXXX-XXXX-XXXX (20 chars + 4 dashes = 24 chars)
  const segments = 5;
  const segmentLength = 4;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking chars
  
  const key = Array.from({ length: segments }, () => {
    return Array.from({ length: segmentLength }, () => {
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
  }).join('-');
  
  return key;
}

/**
 * Create license
 */
export async function createLicense(licenseData: {
  order_id: string;
  order_item_id?: string;
  user_id: string;
  product_id: string;
  tier_name?: string;
  site_limit?: number;
  expires_at?: Date;
  metadata?: any;
}): Promise<License> {
  try {
    const licenseKey = generateLicenseKey();
    
    const { rows } = await sql`
      INSERT INTO licenses (
        license_key,
        order_id,
        order_item_id,
        user_id,
        product_id,
        status,
        tier_name,
        site_limit,
        sites_used,
        expires_at,
        metadata
      ) VALUES (
        ${licenseKey},
        ${licenseData.order_id},
        ${licenseData.order_item_id || null},
        ${licenseData.user_id},
        ${licenseData.product_id},
        'active',
        ${licenseData.tier_name || null},
        ${licenseData.site_limit || null},
        0,
        ${licenseData.expires_at ? (licenseData.expires_at as any) : null},
        ${licenseData.metadata ? JSON.stringify(licenseData.metadata) : null}
      )
      RETURNING *
    `;
    
    return rows[0] as License;
  } catch (error) {
    console.error('Error creating license:', error);
    throw error;
  }
}

/**
 * Get license by key
 */
export async function getLicenseByKey(licenseKey: string): Promise<License | null> {
  try {
    const { rows } = await sql`
      SELECT * FROM licenses WHERE license_key = ${licenseKey} LIMIT 1
    `;
    
    if (rows.length === 0) return null;
    return rows[0] as License;
  } catch (error) {
    console.error('Error fetching license:', error);
    throw error;
  }
}

/**
 * Validate license
 */
export async function validateLicense(licenseKey: string, domain?: string): Promise<{
  valid: boolean;
  license?: License;
  reason?: string;
}> {
  try {
    const license = await getLicenseByKey(licenseKey);
    
    if (!license) {
      return { valid: false, reason: 'License key not found' };
    }
    
    if (license.status !== 'active') {
      return { valid: false, reason: `License is ${license.status}`, license };
    }
    
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      // Auto-expire
      await updateLicenseStatus(license.id, 'expired');
      return { valid: false, reason: 'License has expired', license };
    }
    
    // Check site limit if domain provided
    if (domain && license.site_limit) {
      const domains = license.activated_domains || [];
      if (!domains.includes(domain) && domains.length >= license.site_limit) {
        return { valid: false, reason: 'Site limit reached', license };
      }
    }
    
    // Update last checked
    await sql`
      UPDATE licenses 
      SET last_checked_at = NOW()
      WHERE id = ${license.id}
    `;
    
    return { valid: true, license };
  } catch (error) {
    console.error('Error validating license:', error);
    throw error;
  }
}

/**
 * Activate license on domain
 */
export async function activateLicense(licenseKey: string, domain: string): Promise<{
  success: boolean;
  message: string;
  license?: License;
}> {
  try {
    const validation = await validateLicense(licenseKey, domain);
    
    if (!validation.valid) {
      return { success: false, message: validation.reason || 'Invalid license' };
    }
    
    const license = validation.license!;
    const domains = license.activated_domains || [];
    
    // Already activated on this domain
    if (domains.includes(domain)) {
      return { success: true, message: 'Already activated', license };
    }
    
    // Add domain
    domains.push(domain);
    
    const { rows } = await sql`
      UPDATE licenses 
      SET activated_domains = ${JSON.stringify(domains)},
          sites_used = ${domains.length},
          activated_at = COALESCE(activated_at, NOW())
      WHERE id = ${license.id}
      RETURNING *
    `;
    
    return { success: true, message: 'License activated', license: rows[0] as License };
  } catch (error) {
    console.error('Error activating license:', error);
    throw error;
  }
}

/**
 * Deactivate license from domain
 */
export async function deactivateLicense(licenseKey: string, domain: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const license = await getLicenseByKey(licenseKey);
    
    if (!license) {
      return { success: false, message: 'License not found' };
    }
    
    const domains = (license.activated_domains || []).filter(d => d !== domain);
    
    await sql`
      UPDATE licenses 
      SET activated_domains = ${JSON.stringify(domains)},
          sites_used = ${domains.length}
      WHERE id = ${license.id}
    `;
    
    return { success: true, message: 'License deactivated from domain' };
  } catch (error) {
    console.error('Error deactivating license:', error);
    throw error;
  }
}

/**
 * Get user's licenses
 */
export async function getUserLicenses(userId: string): Promise<License[]> {
  try {
    const { rows } = await sql`
      SELECT l.*, p.name as product_name, p.slug as product_slug
      FROM licenses l
      JOIN products p ON l.product_id = p.id
      WHERE l.user_id = ${userId}
      ORDER BY l.created_at DESC
    `;
    
    return rows as License[];
  } catch (error) {
    console.error('Error fetching user licenses:', error);
    throw error;
  }
}

/**
 * Update license status
 */
export async function updateLicenseStatus(licenseId: string, status: LicenseStatus): Promise<void> {
  try {
    await sql`
      UPDATE licenses 
      SET status = ${status}
      WHERE id = ${licenseId}
    `;
  } catch (error) {
    console.error('Error updating license status:', error);
    throw error;
  }
}

// ===========================================
// WEBHOOK EVENT FUNCTIONS
// ===========================================

/**
 * Log webhook event
 */
export async function logWebhookEvent(eventData: {
  event_id: string;
  event_type: string;
  stripe_account?: string;
  api_version?: string;
  payload: any;
  metadata?: any;
}): Promise<WebhookEvent> {
  try {
    const { rows } = await sql`
      INSERT INTO webhook_events (
        event_id,
        event_type,
        stripe_account,
        api_version,
        payload,
        metadata,
        processed,
        retry_count
      ) VALUES (
        ${eventData.event_id},
        ${eventData.event_type},
        ${eventData.stripe_account || null},
        ${eventData.api_version || null},
        ${JSON.stringify(eventData.payload)},
        ${eventData.metadata ? JSON.stringify(eventData.metadata) : null},
        false,
        0
      )
      RETURNING *
    `;
    
    return rows[0] as WebhookEvent;
  } catch (error) {
    console.error('Error logging webhook event:', error);
    throw error;
  }
}

/**
 * Mark webhook as processed
 */
export async function markWebhookProcessed(eventId: string, success: boolean, error?: string): Promise<void> {
  try {
    await sql`
      UPDATE webhook_events 
      SET processed = ${success},
          processed_at = NOW(),
          processing_error = ${error || null}
      WHERE event_id = ${eventId}
    `;
  } catch (error) {
    console.error('Error marking webhook processed:', error);
    throw error;
  }
}

/**
 * Get unprocessed webhooks
 */
export async function getUnprocessedWebhooks(limit: number = 100): Promise<WebhookEvent[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM webhook_events 
      WHERE processed = false 
      AND retry_count < 5
      ORDER BY received_at ASC
      LIMIT ${limit}
    `;
    
    return rows as WebhookEvent[];
  } catch (error) {
    console.error('Error fetching unprocessed webhooks:', error);
    throw error;
  }
}

// ===========================================
// ADMIN & STATS FUNCTIONS
// ===========================================

/**
 * Get sales stats
 */
export async function getSalesStats(days: number = 30): Promise<{
  total_revenue: number;
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  refunded_orders: number;
  average_order_value: number;
}> {
  try {
    const { rows } = await sql`
      SELECT 
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'refunded' THEN 1 END) as refunded_orders,
        COALESCE(AVG(total_amount), 0) as average_order_value
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '${days} days'
    `;
    
    return rows[0] as any;
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    throw error;
  }
}

/**
 * Get top products
 */
export async function getTopProducts(limit: number = 10): Promise<any[]> {
  try {
    const { rows } = await sql`
      SELECT 
        oi.product_id,
        oi.product_name,
        oi.product_slug,
        COUNT(*) as order_count,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.total_price) as total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status IN ('completed', 'processing')
        AND o.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY oi.product_id, oi.product_name, oi.product_slug
      ORDER BY total_revenue DESC
      LIMIT ${limit}
    `;
    
    return rows;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
}

/**
 * Get recent orders
 */
export async function getRecentOrders(limit: number = 20): Promise<Order[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM orders
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    
    return rows as Order[];
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
}

export default {
  // Orders
  createOrder,
  getOrderById,
  getOrderByStripeSession,
  getUserOrders,
  updateOrderStatus,
  
  // Order Items
  createOrderItem,
  getOrderItems,
  
  // Licenses
  generateLicenseKey,
  createLicense,
  getLicenseByKey,
  validateLicense,
  activateLicense,
  deactivateLicense,
  getUserLicenses,
  updateLicenseStatus,
  
  // Webhooks
  logWebhookEvent,
  markWebhookProcessed,
  getUnprocessedWebhooks,
  
  // Stats
  getSalesStats,
  getTopProducts,
  getRecentOrders,
};
