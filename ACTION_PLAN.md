# ACTION PLAN - Fix Checkout & Go Live

## Executive Summary

**Problem**: Checkout buttons are broken (404 errors, Stripe errors)
**Root Cause**: Stripe API keys not configured in environment
**Solution**: Add Stripe keys + test checkout
**Time Required**: 15-30 minutes
**Status**: Code is ready, just needs configuration

---

## Phase 1: Fix Broken Checkout (DO NOW)

### Task 1.1: Get Stripe API Keys
**Time**: 5 minutes | **Priority**: CRITICAL

1. Sign up/Login to Stripe: https://dashboard.stripe.com
2. Get test API keys: https://dashboard.stripe.com/test/apikeys
   - Copy **Publishable key** (pk_test_...)
   - Copy **Secret key** (sk_test_...)
3. Create webhook: https://dashboard.stripe.com/test/webhooks
   - Endpoint: `http://localhost:3000/api/webhooks/stripe-dynamic`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy **Webhook secret** (whsec_...)

### Task 1.2: Configure Environment
**Time**: 2 minutes | **Priority**: CRITICAL

Edit `.env.local` and replace the placeholder values:

```bash
# Replace these lines in .env.local:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_ACTUAL_KEY"
STRIPE_SECRET_KEY="sk_test_YOUR_ACTUAL_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_ACTUAL_SECRET"
```

### Task 1.3: Seed Database
**Time**: 2 minutes | **Priority**: CRITICAL

```bash
cd "C:\Users\PIETER\Downloads\instant-tw-deployment"
npx tsx scripts/seed-products-postgres.ts
```

### Task 1.4: Test Locally
**Time**: 5 minutes | **Priority**: CRITICAL

```bash
# Start dev server
npm run dev

# Open browser: http://localhost:3000/wp-scan/plans
# Click "Upgrade to Pro"
# Sign in or create account
# Test checkout with: 4242 4242 4242 4242
```

**Expected Result**: 
- ✅ Redirects to Stripe Checkout (not error page)
- ✅ Can complete payment
- ✅ Redirects to success page

### Task 1.5: Test All Pages
**Time**: 10 minutes | **Priority**: HIGH

Test checkout on these pages:
- [ ] http://localhost:3000/wp-scan/plans
- [ ] http://localhost:3000/services/themes
- [ ] http://localhost:3000/services/maintenance
- [ ] http://localhost:3000/services/seo
- [ ] http://localhost:3000/services/speed-optimization
- [ ] http://localhost:3000/services/security
- [ ] http://localhost:3000/services/hosting
- [ ] http://localhost:3000/pricing

---

## Phase 2: Deploy to Production (AFTER TESTING)

### Task 2.1: Configure Production Stripe Keys
**Time**: 3 minutes | **Priority**: HIGH

1. Go to Stripe Dashboard
2. Switch to **Live mode** (toggle in dashboard)
3. Get production keys: https://dashboard.stripe.com/apikeys
   - Copy **Live Publishable key** (pk_live_...)
   - Copy **Live Secret key** (sk_live_...)
4. Create production webhook:
   - Endpoint: `https://wp.instant.tw/api/webhooks/stripe-dynamic`
   - Same events as test mode
   - Copy **Live Webhook secret**

### Task 2.2: Add Keys to Vercel
**Time**: 3 minutes | **Priority**: HIGH

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add these variables (for Production):
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
   STRIPE_SECRET_KEY = sk_live_...
   STRIPE_WEBHOOK_SECRET = whsec_...
   DATABASE_URL = (your Neon PostgreSQL URL)
   NEXTAUTH_URL = https://wp.instant.tw
   NEXTAUTH_SECRET = (your secret)
   ```

### Task 2.3: Deploy
**Time**: 5 minutes | **Priority**: HIGH

```bash
# Deploy to production
vercel --prod

# Or push to GitHub (if auto-deploy enabled)
git push origin main
```

### Task 2.4: Test Production
**Time**: 10 minutes | **Priority**: HIGH

1. Visit: https://wp.instant.tw/wp-scan/plans
2. Test checkout with real card (or test card if still in test mode)
3. Verify payment in Stripe Dashboard
4. Check all pages work

---

## Phase 3: Implement Order Management (NEXT)

**Status**: Not implemented yet (placeholder comments in webhook handler)
**Priority**: HIGH (but only after Phase 1 & 2 are complete)
**Estimated Time**: 2-3 days

### What Needs to Be Built:

1. **Orders Table** (database)
   ```sql
   CREATE TABLE orders (
     id BIGSERIAL PRIMARY KEY,
     user_id BIGINT NOT NULL,
     stripe_session_id VARCHAR(255) UNIQUE,
     stripe_payment_intent_id VARCHAR(255),
     total_amount INTEGER,
     currency VARCHAR(3),
     status VARCHAR(50),
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. **License Keys System**
   - Generate unique license keys
   - Store in database
   - Validate on plugin download
   - Revoke on refund

3. **Email Notifications**
   - Send order confirmation email
   - Include license key
   - Include download links
   - Receipt from Stripe

4. **User Dashboard**
   - View purchase history
   - Download purchased plugins
   - Manage subscriptions
   - View license keys

### Implementation Priority:

1. **Week 1**: Orders table + basic order creation
2. **Week 2**: License key generation + storage
3. **Week 3**: Email notifications (use Resend or SendGrid)
4. **Week 4**: User dashboard (purchase history)

---

## Phase 4: Build Admin Dashboard (LATER)

**Status**: Not needed yet
**Priority**: LOW
**When to Build**: After 10-50 sales
**Estimated Time**: 1-2 weeks

### Recommended Features:

**Priority 1** (Week 1):
- View all orders (table with search/filter)
- View order details
- Issue refunds via Stripe API
- Basic revenue metrics

**Priority 2** (Week 2):
- Product management (CRUD)
- View customer list
- Email template customization
- Analytics dashboard

**Priority 3** (Week 3-4):
- User management (roles, permissions)
- Subscription management
- Coupon/discount code creation
- Advanced analytics

### Alternative: Use Stripe Dashboard

For now, you can manage everything via Stripe Dashboard:
- View all transactions
- Issue refunds
- Manage subscriptions
- Export data for analytics

**Recommendation**: Wait until you have steady sales before building custom admin.

---

## Testing Checklist

### Before Going Live:

- [ ] All Stripe keys configured (test mode)
- [ ] Database seeded (8 products, 54 tiers)
- [ ] Local dev server runs without errors
- [ ] Can navigate all pages (no 404s)
- [ ] User authentication works
- [ ] Buy buttons redirect to Stripe (not errors)
- [ ] Can complete test purchase
- [ ] Success page displays correctly
- [ ] Webhook receives events (check logs)
- [ ] Payment shows in Stripe Dashboard
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile device
- [ ] All pages tested (8+ pages with checkout)

### Before Production Deploy:

- [ ] Production Stripe keys obtained
- [ ] Webhook endpoint updated to production URL
- [ ] Environment variables added to Vercel
- [ ] Test deployment on staging first
- [ ] Production database seeded
- [ ] SSL certificate valid
- [ ] Domain DNS configured
- [ ] Error monitoring set up (Sentry)
- [ ] Analytics set up (if needed)
- [ ] Legal pages ready (Privacy, Terms)

---

## Email Integration Recommendation

**Question**: "Suggest the best email feature to integrate to our NextJS project"

### Answer: Use **Resend** (Recommended)

**Why Resend?**
- Built for Next.js/React
- Best developer experience
- Generous free tier (100 emails/day)
- Easy to set up (5 minutes)
- Great deliverability
- React Email templates

**Setup:**

```bash
npm install resend
```

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(order: Order) {
  await resend.emails.send({
    from: 'orders@instant.tw',
    to: order.customerEmail,
    subject: 'Order Confirmation - Instant WordPress',
    html: `<h1>Thanks for your purchase!</h1>
           <p>Order ID: ${order.id}</p>
           <p>License Key: ${order.licenseKey}</p>`,
  });
}
```

**Alternatives:**

| Service | Pros | Cons | Cost |
|---------|------|------|------|
| **Resend** | Best DX, Next.js native | Newer service | Free: 100/day<br>Paid: $20/mo |
| **SendGrid** | Reliable, mature | Complex setup | Free: 100/day<br>Paid: $15/mo |
| **AWS SES** | Cheapest, reliable | AWS complexity | $0.10 per 1000 |
| **Postmark** | Great deliverability | More expensive | Free: 100/mo<br>Paid: $15/mo |
| **Mailgun** | Popular, reliable | API complexity | Free: 1000/mo<br>Paid: $35/mo |

**Recommendation**: Start with **Resend**. If you outgrow it (>3000 emails/day), switch to AWS SES for cost efficiency.

---

## Success Metrics

### Phase 1 Complete When:
- ✅ All buy buttons work
- ✅ Can complete test purchases
- ✅ No errors in console/logs
- ✅ Payments show in Stripe

### Phase 2 Complete When:
- ✅ Production deployment successful
- ✅ First real sale completed
- ✅ Webhook events working in production

### Phase 3 Complete When:
- ✅ Orders stored in database
- ✅ License keys generated
- ✅ Email confirmations sent
- ✅ Users can view purchase history

### Phase 4 Complete When:
- ✅ Admin can view all orders
- ✅ Admin can issue refunds
- ✅ Basic analytics dashboard
- ✅ Product management interface

---

## Timeline Estimate

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| **Phase 1** | Fix checkout | 30 min | 🔴 TO DO |
| **Phase 2** | Deploy production | 30 min | ⏳ After Phase 1 |
| **Phase 3** | Order management | 2-3 days | ⏳ After Phase 2 |
| **Phase 4** | Admin dashboard | 1-2 weeks | ⏳ After 10+ sales |

**Total to launch**: 1 hour (Phases 1 + 2)
**Total to full system**: 2-4 weeks (All phases)

---

## Next Actions (Right Now)

1. **Run verification script**:
   ```powershell
   .\test-checkout.ps1
   ```

2. **Add Stripe keys** (see QUICK_FIX_GUIDE.md)

3. **Seed database**:
   ```bash
   npx tsx scripts/seed-products-postgres.ts
   ```

4. **Test checkout**:
   ```bash
   npm run dev
   ```

5. **Go live** (after testing):
   ```bash
   vercel --prod
   ```

---

## Support Resources

- **Implementation Guide**: `DO_NOW_IMPLEMENTATION_COMPLETE.md`
- **Quick Fix**: `QUICK_FIX_GUIDE.md`
- **Status**: `status.md`
- **Stripe Docs**: https://stripe.com/docs
- **Testing Cards**: https://stripe.com/docs/testing#cards

---

**Status**: Ready to implement
**Last Updated**: 2025-01-10
**Estimated Time to Launch**: 1 hour
