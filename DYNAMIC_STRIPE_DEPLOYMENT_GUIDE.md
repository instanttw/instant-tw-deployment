# Dynamic Stripe System - Deployment Guide

## 🎯 Overview

This guide will walk you through deploying the **dynamic Stripe checkout system** that supports unlimited products without pre-creating Stripe products or environment variables.

**What's Changed:**
- ❌ No more hardcoded Stripe product IDs
- ❌ No more 30+ environment variables
- ✅ Database-driven product management
- ✅ Dynamic checkout sessions using `price_data`
- ✅ Scales to 1000+ products easily

---

## 📋 Prerequisites

Before starting, make sure you have:

- [x] MySQL database (local or hosted)
- [x] Stripe account (test keys for development)
- [x] Node.js installed
- [x] Access to your hosting environment

---

## 🚀 Step-by-Step Deployment

### Step 1: Set Up MySQL Database (5 minutes)

#### Option A: Local Development (MySQL/MariaDB)

```bash
# Start MySQL
mysql -u root -p

# Create database
CREATE DATABASE instant_wp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Run main schema
mysql -u root -p instant_wp < database/schema.sql

# Run products migration
mysql -u root -p instant_wp < database/migrations/001_add_products_tables.sql
```

#### Option B: Remote Database (PlanetScale, AWS RDS, etc.)

```bash
# Using remote connection
mysql -h your-host.com -u your-user -p instant_wp < database/schema.sql
mysql -h your-host.com -u your-user -p instant_wp < database/migrations/001_add_products_tables.sql
```

#### Verify Tables Created

```sql
USE instant_wp;
SHOW TABLES;
-- Should see 'products' and 'pricing_tiers' tables
```

---

### Step 2: Install Dependencies (2 minutes)

```bash
# Install required packages
npm install mysql2 dotenv tsx
```

---

### Step 3: Configure Environment Variables (3 minutes)

Update your `.env.local` file:

```env
# Database Connection
DATABASE_URL=mysql://username:password@localhost:3306/instant_wp

# Stripe Keys (existing)
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# NextAuth (existing)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
```

**For Vercel:**
```bash
# Add DATABASE_URL
vercel env add DATABASE_URL
# Enter: mysql://user:pass@host:3306/instant_wp

# Verify
vercel env ls
```

---

### Step 4: Seed Products (2 minutes)

Run the product seeder to populate your database:

```bash
npx tsx scripts/seed-products.ts
```

**Expected Output:**
```
🌱 Starting product seeding...

✅ Database connected

📦 Seeding: WordPress Theme Design Services...
   ✨ Created new product (ID: 1)
      ↳ Created tier: Pro Monthly
      ↳ Created tier: Pro Yearly
      ↳ Created tier: Agency Monthly
      ↳ Created tier: Agency Yearly
      ↳ Created tier: Enterprise Monthly
      ↳ Created tier: Enterprise Yearly
   ✅ Seeded 6 pricing tiers

📦 Seeding: WordPress Maintenance & Care Plans...
   ✨ Created new product (ID: 2)
   ...

🎉 Seeding complete!
   📊 Products seeded: 5 new, 0 updated
   💰 Pricing tiers: 30 new tiers created
   ✨ Total products in database: 5
```

---

### Step 5: Verify Database Content (1 minute)

```sql
USE instant_wp;

-- Check products
SELECT id, slug, name, type FROM products;

-- Check pricing tiers
SELECT pt.id, p.slug, pt.tier_name, pt.display_name, pt.price 
FROM pricing_tiers pt
JOIN products p ON pt.product_id = p.id
ORDER BY p.slug, pt.sort_order;
```

**Expected:**
- 5 products (themes, maintenance, seo, speed-optimization, security)
- 30 pricing tiers (6 per product: pro/agency/enterprise × monthly/yearly)

---

### Step 6: Test Locally (10 minutes)

#### 6.1 Start Development Server

```bash
npm run dev
```

#### 6.2 Test Each Service Page

Visit these URLs and click "Get Started" buttons:

1. **Themes:** http://localhost:3000/services/themes
2. **Maintenance:** http://localhost:3000/services/maintenance
3. **SEO:** http://localhost:3000/services/seo
4. **Speed Optimization:** http://localhost:3000/services/speed-optimization
5. **Security:** http://localhost:3000/services/security

#### 6.3 Complete Test Purchase

1. Click any "Get Started" button
2. Should redirect to Stripe checkout (not 404!)
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete payment
5. Should redirect to `/checkout/success?session_id=...`
6. Success page should display order details

---

### Step 7: Deploy to Vercel (5 minutes)

#### 7.1 Add Environment Variables

```bash
# Add all required env vars to Vercel
vercel env add DATABASE_URL
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET

# Pull environment variables locally (optional)
vercel env pull .env.local
```

#### 7.2 Deploy

```bash
# Deploy to production
vercel --prod

# Or push to main branch if auto-deploy is enabled
git add .
git commit -m "Migrate to dynamic Stripe system

- Add database-driven product management
- Remove hardcoded Stripe product IDs
- Support unlimited products via price_data
- Add product seeder script
- Update all service pages to use dynamic checkout

Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>"
git push origin main
```

#### 7.3 Verify Deployment

1. Visit your production URL
2. Test buy buttons on all service pages
3. Complete a test purchase
4. Check Vercel logs for any errors

---

## 🧪 Testing Checklist

### ✅ Database Tests

- [ ] Database connection works
- [ ] Products table has 5 products
- [ ] Pricing tiers table has 30 tiers
- [ ] All product slugs are correct
- [ ] All pricing tiers have correct names

### ✅ Checkout Flow Tests

For each service (Themes, Maintenance, SEO, Speed, Security):

- [ ] Monthly button creates Stripe session
- [ ] Yearly button creates Stripe session (25% discount)
- [ ] Stripe checkout page loads (no 404)
- [ ] Test payment completes successfully
- [ ] Redirects to success page
- [ ] Success page shows correct product details

### ✅ API Tests

```bash
# Test checkout API endpoint
curl -X POST http://localhost:3000/api/checkout/dynamic \
  -H "Content-Type: application/json" \
  -d '{
    "productSlug": "themes",
    "tierName": "pro-monthly",
    "userId": "test-user-123",
    "userEmail": "test@example.com"
  }'

# Should return JSON with checkout session URL
```

### ✅ Production Tests

- [ ] All service pages load without errors
- [ ] Buy buttons work on production
- [ ] Stripe checkout redirects work
- [ ] Success page displays correctly
- [ ] No 404 or 500 errors in Vercel logs

---

## 🔍 Troubleshooting

### Issue 1: Database Connection Failed

**Error:** `ER_ACCESS_DENIED_ERROR` or `ECONNREFUSED`

**Solution:**
```bash
# Check DATABASE_URL format
# Should be: mysql://user:password@host:port/database

# Test connection manually
mysql -h host -u user -p database

# Check firewall rules (for remote databases)
# Allow connections from your IP and Vercel IPs
```

---

### Issue 2: Product Not Found

**Error:** `Product 'themes' not found in database`

**Solution:**
```bash
# Re-run seeder
npx tsx scripts/seed-products.ts

# Verify products exist
mysql -u root -p instant_wp -e "SELECT slug FROM products;"
```

---

### Issue 3: Stripe Checkout 404

**Error:** Clicking button shows Stripe error page

**Solution:**
```javascript
// Check console logs for errors
// Common issues:
// 1. STRIPE_SECRET_KEY not set
// 2. Database connection failed
// 3. Product slug mismatch

// Debug by testing API directly:
fetch('/api/checkout/dynamic', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productSlug: 'themes',
    tierName: 'pro-monthly',
    userId: 'test',
    userEmail: 'test@test.com'
  })
}).then(r => r.json()).then(console.log);
```

---

### Issue 4: Tier Name Mismatch

**Error:** `Pricing tier 'pro-monthly' not found for product 'themes'`

**Solution:**
```sql
-- Check actual tier names in database
SELECT tier_name FROM pricing_tiers WHERE product_id = (
  SELECT id FROM products WHERE slug = 'themes'
);

-- Update component if needed
-- Tier names should match exactly: 'pro-monthly', 'agency-yearly', etc.
```

---

### Issue 5: Vercel Deployment Errors

**Error:** Build fails or runtime errors on Vercel

**Solution:**
```bash
# Check Vercel logs
vercel logs

# Common fixes:
# 1. Verify all environment variables are set
vercel env ls

# 2. Check node_modules are installed
npm ci

# 3. Verify TypeScript compiles
npm run build

# 4. Check database is accessible from Vercel
# (May need to whitelist Vercel IPs)
```

---

## 📊 Monitoring & Maintenance

### Check Database Health

```sql
-- Product count
SELECT COUNT(*) as product_count FROM products;

-- Pricing tier count
SELECT COUNT(*) as tier_count FROM pricing_tiers;

-- Products by type
SELECT type, COUNT(*) as count FROM products GROUP BY type;

-- Average price by product
SELECT p.name, AVG(pt.price/100) as avg_price_usd
FROM products p
JOIN pricing_tiers pt ON p.id = pt.product_id
GROUP BY p.id;
```

### Monitor Stripe Webhooks

```bash
# Set up Stripe webhook endpoint
# URL: https://your-domain.com/api/webhooks/stripe
# Events to listen for:
# - checkout.session.completed
# - payment_intent.succeeded
# - payment_intent.payment_failed
```

### Backup Database

```bash
# Daily backup recommended
mysqldump -u root -p instant_wp > backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u root -p instant_wp < backup_20240115.sql
```

---

## 🎯 Adding New Products

One of the biggest advantages of the dynamic system is how easy it is to add products.

### Method 1: Via Database (Quick)

```sql
-- Add new product
INSERT INTO products (slug, name, type, description, short_description)
VALUES (
  'custom-plugin-dev',
  'Custom Plugin Development',
  'service',
  'Full description here...',
  'Custom WordPress plugins built to your specs'
);

-- Get the product ID (e.g., 6)
SELECT LAST_INSERT_ID();

-- Add pricing tiers
INSERT INTO pricing_tiers (product_id, tier_name, display_name, price, currency, pricing_model, billing_interval, sort_order)
VALUES
  (6, 'basic-monthly', 'Basic Monthly', 29900, 'usd', 'subscription', 'month', 1),
  (6, 'basic-yearly', 'Basic Yearly', 269100, 'usd', 'subscription', 'year', 2),
  (6, 'pro-monthly', 'Pro Monthly', 79900, 'usd', 'subscription', 'month', 3),
  (6, 'pro-yearly', 'Pro Yearly', 719100, 'usd', 'subscription', 'year', 4);

-- Done! Product is now available via API immediately
```

### Method 2: Via Seeder Script (Recommended)

1. Edit `scripts/seed-products.ts`
2. Add new product to the `products` array:

```typescript
{
  slug: 'custom-plugin-dev',
  name: 'Custom Plugin Development',
  type: 'service',
  description: '...',
  short_description: '...',
  tiers: [
    {
      tier_name: 'basic-monthly',
      display_name: 'Basic Monthly',
      price: 29900,
      currency: 'usd',
      pricing_model: 'subscription',
      billing_interval: 'month',
      features: JSON.stringify(['Feature 1', 'Feature 2']),
      sort_order: 1,
    },
    // ... more tiers
  ],
},
```

3. Run seeder:
```bash
npx tsx scripts/seed-products.ts
```

### Method 3: Via Admin UI (Coming Soon)

Once the admin UI is built (TODO #10), you'll be able to:
- Add products via web interface
- Edit pricing tiers
- Upload product images
- Manage features list
- Preview changes before publishing

---

## 📈 Scaling to 500+ Products

The dynamic system is designed to handle high volume:

### Database Performance

```sql
-- Add indexes for better performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_pricing_tiers_product_tier ON pricing_tiers(product_id, tier_name);
CREATE INDEX idx_pricing_tiers_sort ON pricing_tiers(sort_order);
```

### Caching Strategy

```typescript
// Cache product lookups (future enhancement)
import { redis } from '@/lib/redis';

async function getCachedProduct(slug: string) {
  const cached = await redis.get(`product:${slug}`);
  if (cached) return JSON.parse(cached);
  
  const product = await getProductBySlug(slug);
  await redis.set(`product:${slug}`, JSON.stringify(product), 'EX', 3600);
  return product;
}
```

### Database Pooling

Already configured in `lib/db-products.ts`:
```typescript
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10,  // Adjust based on traffic
  queueLimit: 0,
});
```

---

## 🎉 Success Metrics

After deployment, you should see:

### ✅ Technical Wins

- Zero hardcoded Stripe product IDs
- One `DATABASE_URL` instead of 30+ env vars
- Database-driven product catalog
- Dynamic Stripe session creation
- No manual Stripe dashboard work

### ✅ Business Wins

- Add new products in minutes (not hours)
- Update pricing without redeployment
- A/B test pricing easily
- Create promotional offers dynamically
- Support complex pricing models

### ✅ Developer Wins

- Clean, maintainable codebase
- Easy to test (seed database)
- No environment variable juggling
- Scalable to 1000+ products
- Simple product management

---

## 📚 Additional Resources

### Files Created

- `lib/db-products.ts` - Database helper functions
- `lib/stripe-dynamic.ts` - Dynamic Stripe integration (already existed)
- `scripts/seed-products.ts` - Product seeder
- `database/migrations/001_add_products_tables.sql` - Schema migration
- `MIGRATION_TO_DYNAMIC_STRIPE.md` - Full migration documentation

### Updated Files

- `app/services/themes/page.tsx` - Uses dynamic checkout
- `app/services/maintenance/page.tsx` - Uses dynamic checkout
- `app/services/seo/page.tsx` - Uses dynamic checkout
- `app/services/speed-optimization/page.tsx` - Uses dynamic checkout
- `app/services/security/page.tsx` - Uses dynamic checkout

### API Endpoints

- `POST /api/checkout/dynamic` - Create dynamic checkout session
- `GET /api/products/:slug` - Get product details (to be created)
- `GET /api/products/:slug/tiers` - Get pricing tiers (to be created)

---

## 🚦 Next Steps

### Immediate (Required)

1. ✅ Set up database
2. ✅ Run migrations
3. ✅ Seed products
4. ✅ Test locally
5. ✅ Deploy to Vercel
6. ✅ Test production

### Short-term (Recommended)

1. ⏳ Set up Stripe webhooks
2. ⏳ Add order tracking
3. ⏳ Create customer dashboard
4. ⏳ Build admin product management UI
5. ⏳ Add product images
6. ⏳ Implement caching layer

### Long-term (Nice to Have)

1. ⏳ A/B testing for pricing
2. ⏳ Dynamic discounts
3. ⏳ Bulk pricing
4. ⏳ Custom pricing per customer
5. ⏳ Multi-currency support
6. ⏳ Promotional campaigns

---

## ✅ Deployment Complete!

Congratulations! You've successfully migrated to the dynamic Stripe system. Your platform can now scale to unlimited products without any manual Stripe dashboard work.

**Questions or issues?** Check the troubleshooting section or create an issue in the repository.

---

**Happy Scaling! 🚀**
