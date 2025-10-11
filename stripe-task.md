Task: Fix Broken Checkout URLs and Stripe Integration

## 🚨 CRITICAL ISSUE SUMMARY

20 Pages:

1. Services pages (7):
wp-scan 
themes 
maintenance 
seo 
speed-optimization 
security 
hosting 

2. Plugin pages (12):
Instant Image Optimizer
Instant Broken Link Fixer
Instant Security Guard
Instant Duplicator
Instant Forms
Instant SEO
Instant Backup
Instant Cache
Instant Popup Master
Instant Review Booster
Instant AI Writer
Instant Cart Recovery

3. Plugin-bundle page (1)


**Current State:** ALL 20 products/services have broken "Get Started" buttons that either:
1. Reload the page (do nothing)
2. Show 404 error page on instant.tw
3. Show "Something went wrong" error on the Stripe checkout page
4. Lead to non-existent Stripe checkout URLs

**Root Causes:**
1. **Hardcoded Stripe Payment Links** - URLs like `checkout.stripe.com/c/pay/cs_test_wpscan_pro_monthly` don't exist
2. **No Dynamic Checkout Implementation** - Missing `/api/checkout/create` endpoint
3. **Button Click Handlers** - Either missing or pointing to wrong URLs
4. **Stripe Integration Not Connected** - Despite having Stripe keys, no actual integration code exists

---

## 🎯 PHASE 1: URGENT DIAGNOSIS (DO THIS FIRST)

### Task 1.1: Complete Codebase Audit
```bash
# Claude Code, please systematically examine:

1. Find ALL "Get Started" button implementations across these 20 pages:
   - WP Scan (/wp-scan)
   - Hosting (/hosting)
   - Themes (/themes)
   - 12 Plugin pages (/plugins/*)
   - Pricing (/pricing)
   - Maintenance Plans (/maintenance-plans)
   - Speed Optimization (/speed-optimization)
   - Security Services (/security-services)
   - SEO Services (/seo-services)

2. For EACH button, document:
   - Current onClick handler or href value
   - What URL it points to (if any)
   - Whether it's hardcoded or dynamic
   - Component file path

3. Check if these files/endpoints exist:
   - /app/api/checkout/create/route.ts
   - /app/api/webhooks/stripe/route.ts
   - /lib/stripe/client.ts
   - /lib/stripe/checkout.ts
   - Any existing Stripe integration code

4. Generate a comprehensive report showing:
   - List of all 20 pages with their pricing plan count
   - Current button behavior for each pricing tier
   - What's broken and why
   - What files need to be created vs modified
```

**Expected Output:** A detailed markdown report mapping every single "Get Started" button to its current state and required fix.

---

## 🎯 PHASE 2: IMPLEMENT DYNAMIC STRIPE INTEGRATION

### Task 2.1: Create Stripe Utility Layer

```typescript
// Claude Code, create these files in order:

/* FILE 1: /lib/stripe/client.ts */
// Initialize Stripe client with secret key
// Use environment variable STRIPE_SECRET_KEY
// Export initialized stripe instance

/* FILE 2: /lib/stripe/checkout.ts */
// Implement createDynamicCheckout function that:
// 1. Accepts productId, priceTierId, optional metadata
// 2. Queries database for product and pricing_tier details
// 3. Creates Stripe checkout session using price_data (NOT pre-created products)
// 4. Returns checkout URL
// 
// Function signature:
async function createDynamicCheckout({
  productId: string,
  priceTierId: string, 
  metadata?: Record<string, any>
}): Promise<{ url: string; sessionId: string }>

// CRITICAL: Use price_data with dynamic pricing, NOT hardcoded price IDs
// Support both one-time payments and subscriptions based on billing_interval

/* FILE 3: /lib/db/products.ts */
// Create helper functions to fetch product data:
// - getProductWithPricing(productId)
// - getPricingTier(priceTierId)
// Query from your existing products and pricing_tiers tables
```

**Implementation Requirements:**
- Use `price_data` parameter in Stripe checkout (NOT pre-created products)
- Dynamically set `mode: 'payment'` for one-time or `mode: 'subscription'` for recurring
- Include proper metadata for order tracking
- Set success_url and cancel_url correctly

---

### Task 2.2: Create Checkout API Endpoint

```typescript
// Claude Code, create: /app/api/checkout/create/route.ts

/* API Route Requirements:
POST /api/checkout/create

Request Body:
{
  "productId": "string",      // e.g., "wpscan-pro"
  "priceTierId": "string",    // e.g., "pro-monthly"
  "metadata": {               // Optional
    "userId": "string",
    "email": "string"
  }
}

Response:
{
  "url": "https://checkout.stripe.com/...",
  "sessionId": "cs_test_..."
}

Implementation Steps:
1. Validate request body
2. Fetch product and pricing details from database
3. Validate pricing data exists
4. Call createDynamicCheckout from /lib/stripe/checkout.ts
5. Return checkout URL
6. Include comprehensive error handling
7. Log all operations for debugging

Error Responses:
- 400: Invalid request / missing fields
- 404: Product or pricing tier not found
- 500: Stripe API error with details
*/
```

---

### Task 2.3: Fix ALL "Get Started" Buttons

```typescript
// Claude Code, systematically update EVERY pricing card component:

/* Pattern to implement for ALL buttons:

BEFORE (broken):
<Button href="https://checkout.stripe.com/c/pay/cs_test_wpscan_pro_monthly">
  Get Started
</Button>

AFTER (working):
<Button onClick={() => handleCheckout('wpscan-pro', 'pro-monthly')}>
  Get Started
</Button>

Where handleCheckout is:
async function handleCheckout(productId: string, priceTierId: string) {
  try {
    setLoading(true);
    const response = await fetch('/api/checkout/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        productId, 
        priceTierId,
        metadata: {
          // Add any relevant metadata
        }
      })
    });
    
    if (!response.ok) throw new Error('Checkout failed');
    
    const { url } = await response.json();
    window.location.href = url; // Redirect to Stripe
  } catch (error) {
    console.error('Checkout error:', error);
    // Show error toast/message to user
  } finally {
    setLoading(false);
  }
}
*/

/* CRITICAL MAPPINGS:
For each of the 20 pages, map productId and priceTierId correctly:

WP Scan Page:
- Product ID: 'wpscan' (check actual slug in DB)
- Tiers: 'pro-monthly', 'pro-yearly', 'agency-monthly', 'agency-yearly'

Security Services Page:
- Product ID: 'security' (as per SQL provided)
- Tiers: 'pro-monthly', 'pro-yearly', 'agency-monthly', 'agency-yearly', 'enterprise-monthly', 'enterprise-yearly'

[Continue for all 20 products...]
*/

// TASK: Update buttons in these component files:
// 1. Find the actual component files for each page
// 2. Replace ALL href/onClick handlers
// 3. Add loading states to buttons
// 4. Add error handling with user feedback
```

---

## 🎯 PHASE 3: DATABASE VERIFICATION

### Task 3.1: Verify Product Data Exists

```sql
-- Claude Code, run these queries and report results:

-- 1. List all products
SELECT id, slug, name, type FROM products ORDER BY slug;

-- 2. Count pricing tiers per product
SELECT 
  p.slug,
  p.name,
  COUNT(pt.id) as tier_count
FROM products p
LEFT JOIN pricing_tiers pt ON p.id = pt.product_id
GROUP BY p.id, p.slug, p.name
ORDER BY p.slug;

-- 3. Check for missing pricing tiers
SELECT 
  p.slug,
  p.name
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM pricing_tiers pt WHERE pt.product_id = p.id
);

-- 4. Verify pricing data is complete
SELECT 
  p.slug as product,
  pt.tier_name,
  pt.price,
  pt.billing_interval,
  pt.pricing_model
FROM products p
JOIN pricing_tiers pt ON p.id = pt.product_id
ORDER BY p.slug, pt.sort_order;
```

**If any products/tiers are missing:**
- Report which ones
- Generate INSERT statements to add them
- Use the same pattern as the Security Services SQL provided earlier

---

## 🎯 PHASE 4: CREATE SUCCESS/CANCEL PAGES

### Task 4.1: Success Page
```typescript
// Claude Code, create: /app/checkout/success/page.tsx

/* Requirements:
1. Extract session_id from URL query params
2. Verify session with Stripe API (optional but recommended)
3. Show order confirmation
4. Display what was purchased
5. Show next steps (e.g., check email for license key)
6. Include "Return to Dashboard" or "Browse More Products" buttons
7. Handle case where session_id is missing/invalid
*/
```

### Task 4.2: Cancel Page
```typescript
// Claude Code, create: /app/checkout/cancel/page.tsx

/* Requirements:
1. Show friendly "checkout canceled" message
2. Explain user was not charged
3. Provide button to "Try Again" (goes back to pricing)
4. Suggest contacting support if needed
*/
```

---

## 🎯 PHASE 5: WEBHOOK HANDLER (For Later, But Prepare Now)

### Task 5.1: Create Webhook Endpoint
```typescript
// Claude Code, create: /app/api/webhooks/stripe/route.ts

/* Webhook Handler Requirements:
POST /api/webhooks/stripe

1. Verify Stripe signature (CRITICAL for security)
2. Handle these events:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - charge.refunded

3. For checkout.session.completed:
   - Extract product/pricing metadata
   - Create order record (when orders table exists)
   - Generate license key (when ready)
   - Send confirmation email (when ready)
   - Log for debugging

4. Return 200 response quickly (within 10 seconds)
5. Queue long operations (email, license gen) asynchronously

For now, just log events. We'll implement full fulfillment later.
*/
```

---

## 🎯 TESTING CHECKLIST

### Task 6.1: Systematic Testing Protocol

```bash
# Claude Code, create a test script/guide that covers:

TEST 1: API Endpoint
- curl POST to /api/checkout/create with valid product data
- Verify it returns Stripe checkout URL
- Test with invalid productId (should return 404)
- Test with missing fields (should return 400)

TEST 2: Each Product Page (20 pages)
- Visit each page
- Click "Get Started" on EACH pricing tier
- Verify redirect to Stripe checkout
- Verify correct product name shows in Stripe
- Verify correct price shows in Stripe
- Cancel and verify cancel page works

TEST 3: Complete Purchase Flow
- Use Stripe test card: 4242 4242 4242 4242
- Complete purchase for one-time payment
- Complete purchase for subscription
- Verify success page displays
- Check Stripe dashboard for session creation

TEST 4: Error Handling
- Test with invalid product IDs
- Test with network errors
- Test with Stripe API errors
- Verify user sees appropriate error messages

# Document results for each test
```

---

## 🎯 DELIVERABLES CHECKLIST

Claude Code, please confirm completion of:

- [ ] **Audit Report** - Detailed analysis of all 20 pages and current button states
- [ ] **Stripe Utilities** - `/lib/stripe/` files created and working
- [ ] **Database Helpers** - `/lib/db/products.ts` for querying products
- [ ] **Checkout API** - `/app/api/checkout/create/route.ts` functional
- [ ] **All Buttons Fixed** - Every "Get Started" button across all 20 pages updated
- [ ] **Success/Cancel Pages** - Both pages created and working
- [ ] **Webhook Stub** - Basic webhook handler in place (logging only for now)
- [ ] **Product Data Verification** - All 20 products and their tiers exist in DB
- [ ] **Testing Completed** - All test cases pass
- [ ] **Documentation** - README with:
  - Environment variables needed
  - How to test in development
  - How to add new products
  - Troubleshooting guide

---

## 🚨 CRITICAL SUCCESS CRITERIA

**This task is ONLY complete when:**

1. ✅ I can visit ANY of the 20 product/service pages
2. ✅ Click ANY "Get Started" button on ANY pricing tier
3. ✅ Get redirected to a WORKING Stripe checkout page
4. ✅ See the CORRECT product name and price on Stripe
5. ✅ Complete test purchase with `4242 4242 4242 4242`
6. ✅ Land on success page after payment
7. ✅ NO 404 errors, NO Stripe errors, NO page reloads

**If ANY button on ANY page fails, the task is not complete.**

---

## 📋 EXECUTION ORDER

Execute in this exact sequence:

1. **Run Phase 1** - Complete audit and report findings
2. **Wait for approval** - Review audit before proceeding
3. **Run Phase 2.1** - Create Stripe utility files
4. **Run Phase 2.2** - Create checkout API endpoint
5. **Test API** - Verify endpoint works with curl/Postman
6. **Run Phase 2.3** - Fix all buttons (do this page by page)
7. **Run Phase 3** - Verify all products exist in database
8. **Run Phase 4** - Create success/cancel pages
9. **Run Phase 5** - Create webhook stub
10. **Run Phase 6** - Execute full testing protocol
11. **Final Verification** - Test EVERY button on EVERY page

---

## 💡 HELPFUL CONTEXT

**Database Schema (Already Exists):**
```sql
- products (id, slug, name, type, description, short_description)
- pricing_tiers (id, product_id, tier_name, display_name, price, currency, pricing_model, billing_interval, features, sort_order)
```

**Environment Variables (Should Already Be Set):**
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (get this from Stripe CLI or dashboard)
NEXT_PUBLIC_URL=https://instant.tw (or localhost for dev)
DATABASE_URL=postgresql://... (Neon or your DB)
```

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Auth: `4000 0025 0000 3155`

---

## 🎬 START COMMAND

please begin with:

**"Starting Phase 1: Complete Codebase Audit. I will examine all 20 product/service pages and document the current state of every 'Get Started' button. Report will follow shortly."**

Then proceed systematically through each phase, reporting progress at each step.