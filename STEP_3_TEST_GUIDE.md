# Step 3: Test API - Complete Guide

## ✅ What You've Done So Far

1. ✅ **Database Schema Initialized** - All 8 tables created
2. ✅ **Products Seeded** - 16 products + 40+ pricing tiers
3. ✅ **Webhook Configured** - Stripe webhook endpoint set up
4. ✅ **Database Connection** - Added to Vercel environment variables

**Great progress!** Now let's test the API.

---

## 🧪 Testing Options

You have 3 ways to test:

### Option 1: Test in Neon Console (EASIEST - 2 minutes)

1. Go to your Neon dashboard
2. Open SQL Editor
3. Run the queries in `test-database.sql`

This will verify:
- ✅ All tables exist
- ✅ Products are seeded
- ✅ Pricing tiers are configured
- ✅ Database is ready for orders

### Option 2: Test via Production API (5 minutes)

Since you've already deployed to Vercel, you can test the live API:

**Using Browser DevTools:**

1. Go to https://wp.instant.tw
2. Sign in to your account
3. Open Browser Console (F12)
4. Paste this code:

```javascript
// Test single product checkout
fetch('/api/checkout/dynamic', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productSlug: 'instant-backup',
    tierName: 'pro',
    quantity: 1
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Checkout API Response:', data);
  if (data.url) {
    console.log('Stripe Checkout URL:', data.url);
    console.log('Would redirect to:', data.url);
  }
});
```

**Expected Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "product": {
    "name": "Instant Backup - Pro",
    "tier": "Pro"
  }
}
```

### Option 3: Test Locally (10 minutes)

If you want to test locally:

1. **Start local dev server:**
```powershell
cd "C:\Users\PIETER\Downloads\instant-tw-deployment"
npm run dev
```

2. **Sign in at http://localhost:3000**

3. **Use the test script or browser console** (same as Option 2 but use `http://localhost:3000`)

---

## 🎯 Quick Verification Tests

### Test 1: Check Products in Database

**Run in Neon Console:**
```sql
SELECT 
  p.name, 
  pt.tier_name, 
  pt.price / 100.0 as price_usd,
  pt.pricing_model
FROM products p
JOIN pricing_tiers pt ON p.id = pt.product_id
WHERE p.is_active = true
ORDER BY p.name, pt.price
LIMIT 20;
```

**Expected:** See your 16 products with pricing

### Test 2: Test Checkout API (Production)

**In browser console on wp.instant.tw:**
```javascript
// Must be signed in first!
fetch('/api/checkout/dynamic', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productSlug: 'instant-security-guard',
    tierName: 'pro'
  })
})
.then(r => r.json())
.then(console.log);
```

### Test 3: Test Service Checkout

```javascript
fetch('/api/checkout/dynamic', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productSlug: 'stripe-implementation',
    tierName: 'basic'
  })
})
.then(r => r.json())
.then(console.log);
```

### Test 4: Test Bundle Checkout

```javascript
fetch('/api/checkout/dynamic', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [
      { productSlug: 'instant-backup', tierName: 'pro' },
      { productSlug: 'instant-cache-pro', tierName: 'pro' }
    ]
  })
})
.then(r => r.json())
.then(console.log);
```

---

## ✅ What to Look For

### Successful Response:
```json
{
  "success": true,
  "sessionId": "cs_test_abc123...",
  "url": "https://checkout.stripe.com/...",
  "product": {
    "name": "Product Name",
    "tier": "Pro"
  }
}
```

### Common Errors:

**"Unauthorized - Please sign in"**
- Solution: Make sure you're signed in to wp.instant.tw

**"Product not found"**
- Solution: Run `test-database.sql` to check if products exist
- Run seeding script again if needed

**"Pricing tier not found"**
- Solution: Check if the tier name is correct (free, pro, agency, basic, etc.)

**"Database connection error"**
- Solution: Verify `DATABASE_URL` in Vercel environment variables

---

## 📊 Verification Checklist

Run these checks to confirm everything is working:

- [ ] **Database tables exist** (run test-database.sql Test 1)
- [ ] **Products seeded** (should see 16 products)
- [ ] **Pricing tiers configured** (should see 40+ tiers)
- [ ] **Checkout API responds** (returns session ID and URL)
- [ ] **Stripe checkout URL generated** (starts with https://checkout.stripe.com)
- [ ] **Can click URL and see Stripe checkout page**

---

## 🎉 Success Criteria

✅ **Step 3 is complete when:**

1. Database queries show products and pricing
2. Checkout API returns valid Stripe URLs
3. Stripe checkout page loads (test with Stripe test card)
4. No errors in API responses

---

## 🚀 Next Steps

Once Step 3 tests pass:

**Step 5: Test Live Purchase (from START_HERE_DYNAMIC_STRIPE.md)**

1. Click a Stripe checkout URL
2. Use test card: `4242 4242 4242 4242`
3. Complete the purchase
4. Check Vercel logs for webhook delivery
5. Check database for new order
6. Check database for generated license

---

## 💡 Pro Tips

### Quick Database Query Dashboard

Save these queries for quick checks:

```sql
-- Recent orders
SELECT order_number, status, total_amount/100.0 as total_usd, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- Active licenses
SELECT license_key, status, tier_name, created_at 
FROM licenses 
WHERE status = 'active' 
ORDER BY created_at DESC 
LIMIT 10;

-- Webhook events
SELECT event_type, processed, received_at 
FROM webhook_events 
ORDER BY received_at DESC 
LIMIT 10;

-- Product sales count
SELECT p.name, COUNT(oi.id) as sales
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.name
ORDER BY sales DESC;
```

### Testing with Postman/Insomnia

If you prefer API testing tools:

**Endpoint:** `POST https://wp.instant.tw/api/checkout/dynamic`

**Headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=YOUR_SESSION_COOKIE
```

**Body:**
```json
{
  "productSlug": "instant-backup",
  "tierName": "pro",
  "quantity": 1
}
```

---

## 🆘 Troubleshooting

### Issue: "Cannot find products table"
**Solution:** Run `database/schema-products-orders.sql` in Neon

### Issue: "No products found"
**Solution:** Run `npx tsx scripts/seed-products.ts`

### Issue: API returns 401 Unauthorized
**Solution:** Sign in to wp.instant.tw first, or add authentication cookie

### Issue: Stripe checkout URL not loading
**Solution:** 
- Check if `STRIPE_SECRET_KEY` is set in Vercel
- Verify you're using test key (sk_test_) for testing

---

## ✅ Ready to Proceed?

Once you can:
1. See products in database ✓
2. Get Stripe checkout URLs from API ✓
3. Open Stripe checkout page ✓

**You're ready for Step 5: Test Live Purchase!**

This will verify the complete flow:
- Purchase → Webhook → Order Created → License Generated

Let me know if you want help with Step 5 next!
