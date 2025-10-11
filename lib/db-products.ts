/**
 * Database Helper Functions for Products
 * Handles product and pricing tier retrieval from database
 * Uses PostgreSQL via Vercel/Neon
 */

import { sql } from '@vercel/postgres';

// ===========================================
// TYPES
// ===========================================

export interface Product {
  id: string;
  slug: string;
  name: string;
  type: 'plugin' | 'service' | 'subscription' | 'bundle';
  description?: string;
  short_description?: string;
  images?: string;
  features?: string;
  version?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PricingTier {
  id: string;
  product_id: string;
  tier_name: string;
  display_name: string;
  price: number; // In cents
  currency: string;
  pricing_model: 'one_time' | 'subscription' | 'hourly' | 'package';
  billing_interval?: 'month' | 'year' | 'lifetime';
  site_limit?: number;
  features?: string;
  sort_order?: number;
  created_at?: Date;
  updated_at?: Date;
}

// ===========================================
// PRODUCT QUERIES
// ===========================================

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { rows } = await sql`
      SELECT * FROM products WHERE slug = ${slug} LIMIT 1
    `;
    
    if (rows.length === 0) {
      return null;
    }

    const product = rows[0] as Product;
    return product;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { rows } = await sql`
      SELECT * FROM products WHERE id = ${id} LIMIT 1
    `;
    
    if (rows.length === 0) {
      return null;
    }

    return rows[0] as Product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

/**
 * Get all products
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM products ORDER BY created_at DESC
    `;
    
    return rows as Product[];
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
}

/**
 * Get products by type
 */
export async function getProductsByType(type: string): Promise<Product[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM products WHERE type = ${type} ORDER BY created_at DESC
    `;
    
    return rows as Product[];
  } catch (error) {
    console.error('Error fetching products by type:', error);
    throw error;
  }
}

// ===========================================
// PRICING TIER QUERIES
// ===========================================

/**
 * Get all pricing tiers for a product
 */
export async function getPricingTiers(productId: string): Promise<PricingTier[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM pricing_tiers 
      WHERE product_id = ${productId} 
      ORDER BY sort_order, price
    `;
    
    return rows as PricingTier[];
  } catch (error) {
    console.error('Error fetching pricing tiers:', error);
    throw error;
  }
}

/**
 * Get specific pricing tier
 */
export async function getPricingTier(
  productId: string,
  tierName: string
): Promise<PricingTier | null> {
  try {
    const { rows } = await sql`
      SELECT * FROM pricing_tiers 
      WHERE product_id = ${productId} AND tier_name = ${tierName} 
      LIMIT 1
    `;
    
    if (rows.length === 0) {
      return null;
    }

    return rows[0] as PricingTier;
  } catch (error) {
    console.error('Error fetching pricing tier:', error);
    throw error;
  }
}

/**
 * Get pricing tier by product slug and tier name
 */
export async function getPricingTierBySlug(
  productSlug: string,
  tierName: string
): Promise<PricingTier | null> {
  try {
    const { rows } = await sql`
      SELECT pt.* 
      FROM pricing_tiers pt
      INNER JOIN products p ON pt.product_id = p.id
      WHERE p.slug = ${productSlug} AND pt.tier_name = ${tierName}
      LIMIT 1
    `;
    
    if (rows.length === 0) {
      return null;
    }

    return rows[0] as PricingTier;
  } catch (error) {
    console.error('Error fetching pricing tier by slug:', error);
    throw error;
  }
}

// ===========================================
// COMBINED QUERIES
// ===========================================

/**
 * Get product with all pricing tiers
 */
export async function getProductWithPricing(slug: string): Promise<{
  product: Product | null;
  tiers: PricingTier[];
}> {
  try {
    const product = await getProductBySlug(slug);
    
    if (!product) {
      return { product: null, tiers: [] };
    }
    
    const tiers = await getPricingTiers(product.id);
    
    return { product, tiers };
  } catch (error) {
    console.error('Error fetching product with pricing:', error);
    throw error;
  }
}

// ===========================================
// ADMIN FUNCTIONS (Create/Update)
// ===========================================

/**
 * Create new product
 */
export async function createProduct(data: {
  slug: string;
  name: string;
  type: string;
  description?: string;
  short_description?: string;
  images?: any;
  features?: any;
  version?: string;
}): Promise<string> {
  try {
    const { rows } = await sql`
      INSERT INTO products (slug, name, type, description, short_description, images, features, version)
      VALUES (
        ${data.slug}, 
        ${data.name}, 
        ${data.type}, 
        ${data.description || null}, 
        ${data.short_description || null}, 
        ${data.images ? JSON.stringify(data.images) : null}, 
        ${data.features ? JSON.stringify(data.features) : null}, 
        ${data.version || null}
      )
      RETURNING id
    `;
    
    return rows[0].id.toString();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Create pricing tier
 */
export async function createPricingTier(data: {
  product_id: string;
  tier_name: string;
  display_name: string;
  price: number;
  currency: string;
  pricing_model: string;
  billing_interval?: string;
  site_limit?: number;
  features?: any;
  sort_order?: number;
}): Promise<string> {
  try {
    const { rows } = await sql`
      INSERT INTO pricing_tiers 
      (product_id, tier_name, display_name, price, currency, pricing_model, 
       billing_interval, site_limit, features, sort_order)
      VALUES (
        ${data.product_id}, 
        ${data.tier_name}, 
        ${data.display_name}, 
        ${data.price}, 
        ${data.currency}, 
        ${data.pricing_model}, 
        ${data.billing_interval || null}, 
        ${data.site_limit || null}, 
        ${data.features ? JSON.stringify(data.features) : null}, 
        ${data.sort_order || 0}
      )
      RETURNING id
    `;
    
    return rows[0].id.toString();
  } catch (error) {
    console.error('Error creating pricing tier:', error);
    throw error;
  }
}

/**
 * Update product
 */
export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<void> {
  try {
    const updates: any = {};
    
    if (data.name) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.short_description !== undefined) updates.short_description = data.short_description;
    if (data.images) updates.images = JSON.stringify(data.images);
    if (data.features) updates.features = JSON.stringify(data.features);
    if (data.version) updates.version = data.version;
    
    if (Object.keys(updates).length === 0) {
      return;
    }
    
    const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(updates);
    
    await sql.query(
      `UPDATE products SET ${setClause} WHERE id = $${values.length + 1}`,
      [...values, id]
    );
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Update pricing tier
 */
export async function updatePricingTier(
  id: string,
  data: Partial<PricingTier>
): Promise<void> {
  try {
    const updates: any = {};
    
    if (data.display_name) updates.display_name = data.display_name;
    if (data.price !== undefined) updates.price = data.price;
    if (data.currency) updates.currency = data.currency;
    if (data.site_limit !== undefined) updates.site_limit = data.site_limit;
    if (data.features) updates.features = JSON.stringify(data.features);
    if (data.sort_order !== undefined) updates.sort_order = data.sort_order;
    
    if (Object.keys(updates).length === 0) {
      return;
    }
    
    const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(updates);
    
    await sql.query(
      `UPDATE pricing_tiers SET ${setClause} WHERE id = $${values.length + 1}`,
      [...values, id]
    );
  } catch (error) {
    console.error('Error updating pricing tier:', error);
    throw error;
  }
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Check if database is connected
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

export default {
  getProductBySlug,
  getProductById,
  getAllProducts,
  getProductsByType,
  getPricingTiers,
  getPricingTier,
  getPricingTierBySlug,
  getProductWithPricing,
  createProduct,
  createPricingTier,
  updateProduct,
  updatePricingTier,
  checkDatabaseConnection,
};
