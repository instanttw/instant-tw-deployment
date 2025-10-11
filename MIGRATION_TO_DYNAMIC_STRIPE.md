# Migration to Dynamic Stripe System

## 🎯 Why Migrate?

### Current Problem (Static Approach):
- ❌ Need to create 30+ Stripe products in dashboard
- ❌ Need 30+ environment variables
- ❌ Every new product = Stripe dashboard work
- ❌ Can't scale to 500+ products
- ❌ Price changes require env var updates + redeployment

### Dynamic Solution (Already Implemented!):
- ✅ No pre-created Stripe products needed
- ✅ Store products in database
- ✅ Create checkout sessions on-the-fly using `price_data`
- ✅ Unlimited products
- ✅ Price changes = simple database update

---

## 📚 What's Already Implemented

### 1. Dynamic Stripe Library (`lib/stripe-dynamic.ts`)

**Key Features:**
```typescript
// Create checkout with dynamic pricing
const session = await createDynamicCheckout({
  items: [{
    product: {
      id: 'themes-pro',
      name: 'Themes Pro',
      description: 'Custom theme design',
      type: 'service',
    },
    pricingTier: {
      tier_name: 'pro',
      display_name: 'Pro',
      price: 9900, // $99.00
      currency: 'usd',
      pricing_model: 'one_time',
    },
  }],
  userId: user.id,
  userEmail: user.email,
});
```

**No Stripe products needed!** The checkout session is created dynamically.

### 2. API Route (`/api/checkout/dynamic`)

Already handles:
- Single product checkout
- Multiple items (bundles)
- Custom service pricing
- Subscriptions
- One-time payments

### 3. Database Schema (`database/schema.sql`)

Tables ready:
- `orders` - Track all purchases
- `order_items` - Line items with metadata
- `licenses` - License key management
- `subscriptions` - Subscription tracking

### 4. Unified Checkout Button

Already supports dynamic checkout:
```typescript
<UnifiedCheckoutButton
  productSlug="themes-pro"  // Database lookup
  tierName="pro"            // Database lookup
>
  Get Started
</UnifiedCheckoutButton>
```

---

## 🔄 Migration Strategy

### Phase 1: Database Setup ✅ (Already Done)

Database schema exists. You need to:

1. **Create database:**
   ```bash
   # Run the schema
   mysql -u root -p < database/schema.sql
   ```

2. **Add database URL to environment:**
   ```env
   DATABASE_URL=mysql://user:pass@host:3306/instant_wp
   ```

### Phase 2: Populate Products Database

Create a migration script to add all products:

```typescript
// scripts/seed-products.ts
const products = [
  {
    slug: 'themes-pro',
    name: 'Themes Pro',
    type: 'service',
    description: 'Custom theme design & development',
    tiers: [
      { 
        name: 'monthly',
        display_name: 'Pro Monthly',
        price: 9900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
      },
      { 
        name: 'yearly',
        display_name: 'Pro Yearly',
        price: 89100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
      },
    ],
  },
  // ... add all 500+ products
];
```

### Phase 3: Update Components

#### Before (Static):
```typescript
<UnifiedCheckoutButton
  productId="themes-pro"      // ❌ Hardcoded, needs Stripe product
  billingCycle="monthly"
>
  Get Started
</UnifiedCheckoutButton>
```

#### After (Dynamic):
```typescript
<UnifiedCheckoutButton
  productSlug="themes-pro"    // ✅ Database lookup
  tierName="pro"              // ✅ Database lookup
>
  Get Started
</UnifiedCheckoutButton>
```

### Phase 4: Remove Static Configuration

Once migration is complete:
1. Delete hardcoded products from `lib/stripe.ts`
2. Remove 30+ environment variables
3. Use `lib/stripe-dynamic.ts` exclusively

---

## 🚀 Quick Migration Guide

### Step 1: Set Up Database (5 minutes)

```bash
# 1. Create database
mysql -u your_user -p < database/schema.sql

# 2. Add DATABASE_URL to .env.local
echo "DATABASE_URL=mysql://user:pass@localhost:3306/instant_wp" >> .env.local

# 3. Add to Vercel
vercel env add DATABASE_URL
```

### Step 2: Create Database Helper (`lib/db-products.ts`)

```typescript
import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL!);

export async function getProductBySlug(slug: string) {
  const [rows] = await pool.execute(
    'SELECT * FROM products WHERE slug = ?',
    [slug]
  );
  return rows[0];
}

export async function getPricingTiers(productId: string) {
  const [rows] = await pool.execute(
    'SELECT * FROM pricing_tiers WHERE product_id = ?',
    [productId]
  );
  return rows;
}

export async function getPricingTier(productId: string, tierName: string) {
  const [rows] = await pool.execute(
    'SELECT * FROM pricing_tiers WHERE product_id = ? AND tier_name = ?',
    [productId, tierName]
  );
  return rows[0];
}
```

### Step 3: Create Product Seeder

```typescript
// scripts/seed-products.ts
import { pool } from './lib/db';

async function seedProducts() {
  // Themes Service
  const [themes] = await pool.execute(
    `INSERT INTO products (slug, name, type, description) 
     VALUES ('themes', 'Theme Design Services', 'service', 'Custom WordPress themes')
     ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`
  );
  
  const themesId = themes.insertId;
  
  // Themes pricing tiers
  await pool.execute(
    `INSERT INTO pricing_tiers (product_id, tier_name, display_name, price, currency, pricing_model, billing_interval)
     VALUES 
       (?, 'pro-monthly', 'Pro Monthly', 9900, 'usd', 'subscription', 'month'),
       (?, 'pro-yearly', 'Pro Yearly', 89100, 'usd', 'subscription', 'year'),
       (?, 'agency-monthly', 'Agency Monthly', 59900, 'usd', 'subscription', 'month'),
       (?, 'agency-yearly', 'Agency Yearly', 539100, 'usd', 'subscription', 'year')
     ON DUPLICATE KEY UPDATE price=VALUES(price)`,
    [themesId, themesId, themesId, themesId]
  );
  
  console.log('✅ Themes service seeded');
  
  // Repeat for Maintenance, SEO, Speed, Security...
  // Then for all 12 plugins, hosting, etc.
}

seedProducts().then(() => process.exit(0));
```

Run it:
```bash
tsx scripts/seed-products.ts
```

### Step 4: Update API Route (Already Done!)

The `/api/checkout/dynamic` route already handles database lookups.

### Step 5: Update Service Pages

Change from static to dynamic:

```typescript
// themes/page.tsx (BEFORE)
<UnifiedCheckoutButton
  productId="themes-pro"       // ❌ Static
  billingCycle={billingCycle}
>

// themes/page.tsx (AFTER)
<UnifiedCheckoutButton
  productSlug="themes"          // ✅ Dynamic
  tierName={`pro-${billingCycle}`}
>
```

### Step 6: Test

```bash
# 1. Click buy button
# 2. Should call /api/checkout/dynamic
# 3. Should create checkout session with price_data
# 4. Should redirect to Stripe checkout (not 404!)
# 5. Complete payment
# 6. Should redirect to success page
```

---

## 📊 Comparison Table

| Feature | Static (Current) | Dynamic (Recommended) |
|---------|-----------------|----------------------|
| **Stripe Products** | Create 30+ manually | Zero |
| **Environment Vars** | 30+ price IDs | 1 database URL |
| **Scalability** | ❌ Limited | ✅ Unlimited |
| **Add New Product** | Dashboard + env vars + redeploy | Database INSERT |
| **Update Price** | Dashboard + env vars + redeploy | Database UPDATE |
| **Custom Pricing** | ❌ Not possible | ✅ Easy |
| **Bundles** | ❌ Complex | ✅ Simple |
| **500+ Products** | ❌ Impossible | ✅ No problem |

---

## 🎯 Recommended Action Plan

### Option 1: Full Migration (Recommended)

**Timeline:** 2-3 hours

1. ✅ Set up database (5 min)
2. ✅ Create database helper functions (15 min)
3. ✅ Seed all products (30 min)
4. ✅ Update all service pages (30 min)
5. ✅ Update plugin pages (30 min)
6. ✅ Test thoroughly (30 min)
7. ✅ Deploy

**Result:** Clean, scalable system ready for 500+ products

### Option 2: Hybrid Approach (Quick Fix)

**Timeline:** 30 minutes

1. ✅ Keep static system for WP Scan & Hosting (already working)
2. ✅ Use dynamic system for new services (Themes, Maintenance, etc.)
3. ✅ Gradually migrate old products to database

**Result:** Fix immediate issues, migrate over time

### Option 3: Band-Aid (Not Recommended)

Continue with static approach:
- Create 30 Stripe products
- Add 30 environment variables
- Fix remaining 3 service pages

**Result:** Works short-term, but you'll hit the wall at ~50-100 products

---

## 🔥 My Recommendation: **Option 1 (Full Migration)**

Here's why:

1. **System already built** - 90% of work is done
2. **2-3 hours now** saves weeks later
3. **Scales to 1000+ products** easily
4. **No Stripe dashboard work** ever again
5. **Easy price updates** via database
6. **Supports complex features**:
   - Custom pricing
   - Bundles
   - Volume discounts
   - Promotional pricing
   - A/B testing

---

## 🛠️ What I Can Help With

I can:

1. ✅ **Create the product seeder script** with all your current products
2. ✅ **Update all service pages** to use dynamic system
3. ✅ **Create database helper functions** for product lookups
4. ✅ **Add product management admin panel** (add/edit/delete products via UI)
5. ✅ **Write migration guide** for your team
6. ✅ **Set up testing** to verify everything works

---

## 📝 Next Steps

Tell me which option you prefer:

**Option 1 (Full Migration - Recommended):**
- "Let's migrate to dynamic system"
- I'll create product seeder, update all pages, test it

**Option 2 (Hybrid):**
- "Let's use dynamic for new stuff only"
- I'll fix immediate issues with dynamic system

**Option 3 (Continue Static):**
- "Let's stick with static for now"
- I'll complete the Stripe product creation guide

**Which path do you want to take?** 🚀

---

## 💡 Benefits of Dynamic System

### For Developers:
- ✅ No Stripe dashboard work
- ✅ No environment variable juggling
- ✅ Simple database queries
- ✅ Easy testing (just seed database)

### For Business:
- ✅ Launch new products in minutes
- ✅ A/B test pricing easily
- ✅ Create promotional offers dynamically
- ✅ Support complex pricing models
- ✅ Scale to thousands of products

### For Users:
- ✅ Accurate, up-to-date pricing
- ✅ Better bundle deals
- ✅ Personalized pricing (future)
- ✅ Faster checkout experience

---

**The dynamic system is already built. We just need to populate the database and update the components. Ready to migrate?** 🎯
