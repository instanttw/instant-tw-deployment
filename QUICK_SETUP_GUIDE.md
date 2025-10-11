# 🚀 Quick Setup Guide - Get Production Ready in 1 Hour

## ⏱️ Timeline Overview

- **15 min:** Update remaining service pages with Stripe checkout
- **20 min:** Create Stripe products and get Price IDs
- **15 min:** Set up environment variables
- **10 min:** Deploy and test

---

## Step 1: Update Service Pages (15 minutes)

### Files to Update:

Update these 6 pages using the pattern from `/app/pricing/page.tsx`:

1. `/app/wp-scan/page.tsx`
2. `/app/services/maintenance/page.tsx`
3. `/app/services/speed-optimization/page.tsx`
4. `/app/services/security/page.tsx`
5. `/app/services/seo/page.tsx`
6. `/app/services/themes/page.tsx`

### Quick Update Pattern:

**1. Add import:**
```tsx
import { StripeCheckoutButton } from "@/components/stripe-checkout-button";
```

**2. Replace product data:**
```tsx
// Change from:
stripeMonthly: "https://...",
stripeYearly: "https://...",

// To:
productId: "service-tier", // e.g., "wpscan-pro", "security-agency"
```

**3. Replace button:**
```tsx
// Change from:
<Button asChild>
  <Link href={stripeLink}>Get Started</Link>
</Button>

// To:
<StripeCheckoutButton
  productId={plan.productId}
  billingCycle={billingCycle}
  className="w-full"
>
  Get Started
</StripeCheckoutButton>
```

---

## Step 2: Create Stripe Products (20 minutes)

### Create Products in Stripe Dashboard:

Go to: https://dashboard.stripe.com/products

### Products to Create (36 total):

For each service, create 3 tiers (Pro, Agency, Enterprise):

1. **Pricing Plans** (3)
   - Pro: $49/mo, $441/yr
   - Agency: $299/mo, $2,691/yr
   - Enterprise: $999/mo, $8,991/yr

2. **WP Scan** (3)
   - Pro: $15/mo, $135/yr
   - Agency: $49/mo, $441/yr
   - Enterprise: $599/mo, $5,391/yr

3. **Hosting** (4)
   - Startup: $29/mo, $261/yr
   - Professional: $69/mo, $621/yr
   - Growth: $139/mo, $1,251/yr
   - Scale: $299/mo, $2,691/yr

4. **Maintenance** (3)
   - Pro: $49/mo, $441/yr
   - Agency: $149/mo, $1,341/yr
   - Enterprise: $499/mo, $4,491/yr

5. **Speed Optimization** (3)
   - Pro: $79/mo, $711/yr
   - Agency: $199/mo, $1,791/yr
   - Enterprise: $499/mo, $4,491/yr

6. **Security** (3)
   - Pro: $69/mo, $621/yr
   - Agency: $189/mo, $1,701/yr
   - Enterprise: $599/mo, $5,391/yr

7. **SEO** (3)
   - Pro: $199/mo, $1,791/yr
   - Agency: $499/mo, $4,491/yr
   - Enterprise: $999/mo, $8,991/yr

8. **Themes/Design** (3)
   - Pro: $299/mo, $2,691/yr
   - Agency: $599/mo, $5,391/yr
   - Enterprise: $1,299/mo, $11,691/yr

### For Each Product:

1. Click "Add product"
2. Enter name: "Pro Plan - Monthly" (or appropriate name)
3. Set price
4. Set billing: Recurring → Monthly (or Yearly)
5. Click "Save"
6. **Copy the Price ID** (starts with `price_`)

### Track Price IDs:

Create a spreadsheet or text file to track all 72 Price IDs:

```
PRO_MONTHLY: price_1234567890
PRO_YEARLY: price_0987654321
...
```

---

## Step 3: Configure Environment Variables (15 minutes)

### Create `.env.local` file:

```env
# ============================================
# PRODUCTION ENVIRONMENT VARIABLES
# ============================================

# -------------------------
# Application
# -------------------------
NEXT_PUBLIC_APP_URL=https://instant.tw
NEXTAUTH_URL=https://instant.tw
NODE_ENV=production

# -------------------------
# NextAuth Secret (REQUIRED)
# -------------------------
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# -------------------------
# Database (REQUIRED)
# -------------------------
DATABASE_URL=mysql://your_username:your_password@localhost:3306/instant_wp

# -------------------------
# Stripe Keys (REQUIRED)
# -------------------------
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# -------------------------
# Stripe Price IDs (REQUIRED - 72 total)
# -------------------------
# Main Plans
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_YEARLY_PRICE_ID=price_...
STRIPE_AGENCY_MONTHLY_PRICE_ID=price_...
STRIPE_AGENCY_YEARLY_PRICE_ID=price_...
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_...
STRIPE_ENTERPRISE_YEARLY_PRICE_ID=price_...

# WP Scan
STRIPE_WPSCAN_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_WPSCAN_PRO_YEARLY_PRICE_ID=price_...
STRIPE_WPSCAN_AGENCY_MONTHLY_PRICE_ID=price_...
STRIPE_WPSCAN_AGENCY_YEARLY_PRICE_ID=price_...
STRIPE_WPSCAN_ENTERPRISE_MONTHLY_PRICE_ID=price_...
STRIPE_WPSCAN_ENTERPRISE_YEARLY_PRICE_ID=price_...

# Hosting
STRIPE_HOSTING_STARTUP_MONTHLY_PRICE_ID=price_...
STRIPE_HOSTING_STARTUP_YEARLY_PRICE_ID=price_...
STRIPE_HOSTING_PROFESSIONAL_MONTHLY_PRICE_ID=price_...
STRIPE_HOSTING_PROFESSIONAL_YEARLY_PRICE_ID=price_...
STRIPE_HOSTING_GROWTH_MONTHLY_PRICE_ID=price_...
STRIPE_HOSTING_GROWTH_YEARLY_PRICE_ID=price_...
STRIPE_HOSTING_SCALE_MONTHLY_PRICE_ID=price_...
STRIPE_HOSTING_SCALE_YEARLY_PRICE_ID=price_...

# Maintenance
STRIPE_MAINTENANCE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_MAINTENANCE_PRO_YEARLY_PRICE_ID=price_...
STRIPE_MAINTENANCE_AGENCY_MONTHLY_PRICE_ID=price_...
STRIPE_MAINTENANCE_AGENCY_YEARLY_PRICE_ID=price_...
STRIPE_MAINTENANCE_ENTERPRISE_MONTHLY_PRICE_ID=price_...
STRIPE_MAINTENANCE_ENTERPRISE_YEARLY_PRICE_ID=price_...

# Speed Optimization
STRIPE_SPEED_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_SPEED_PRO_YEARLY_PRICE_ID=price_...
STRIPE_SPEED_AGENCY_MONTHLY_PRICE_ID=price_...
STRIPE_SPEED_AGENCY_YEARLY_PRICE_ID=price_...
STRIPE_SPEED_ENTERPRISE_MONTHLY_PRICE_ID=price_...
STRIPE_SPEED_ENTERPRISE_YEARLY_PRICE_ID=price_...

# Security
STRIPE_SECURITY_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_SECURITY_PRO_YEARLY_PRICE_ID=price_...
STRIPE_SECURITY_AGENCY_MONTHLY_PRICE_ID=price_...
STRIPE_SECURITY_AGENCY_YEARLY_PRICE_ID=price_...
STRIPE_SECURITY_ENTERPRISE_MONTHLY_PRICE_ID=price_...
STRIPE_SECURITY_ENTERPRISE_YEARLY_PRICE_ID=price_...

# SEO
STRIPE_SEO_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_SEO_PRO_YEARLY_PRICE_ID=price_...
STRIPE_SEO_AGENCY_MONTHLY_PRICE_ID=price_...
STRIPE_SEO_AGENCY_YEARLY_PRICE_ID=price_...
STRIPE_SEO_ENTERPRISE_MONTHLY_PRICE_ID=price_...
STRIPE_SEO_ENTERPRISE_YEARLY_PRICE_ID=price_...

# Themes/Design
STRIPE_THEMES_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_THEMES_PRO_YEARLY_PRICE_ID=price_...
STRIPE_THEMES_AGENCY_MONTHLY_PRICE_ID=price_...
STRIPE_THEMES_AGENCY_YEARLY_PRICE_ID=price_...
STRIPE_THEMES_ENTERPRISE_MONTHLY_PRICE_ID=price_...
STRIPE_THEMES_ENTERPRISE_YEARLY_PRICE_ID=price_...

# -------------------------
# OAuth (Optional)
# -------------------------
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GITHUB_CLIENT_ID=...
# GITHUB_CLIENT_SECRET=...

# -------------------------
# Email (Optional - for later)
# -------------------------
# EMAIL_SERVER_HOST=smtp.example.com
# EMAIL_SERVER_PORT=587
# EMAIL_SERVER_USER=...
# EMAIL_FROM=noreply@instant.tw
```

### Generate NextAuth Secret:

```bash
openssl rand -base64 32
```

---

## Step 4: Set Up Stripe Webhook (5 minutes)

### Create Webhook Endpoint:

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://instant.tw/api/stripe/webhook`
4. Select events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.paid`
   - ✅ `invoice.payment_failed`
5. Click "Add endpoint"
6. **Copy webhook secret** (`whsec_...`)
7. Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

---

## Step 5: Deploy (10 minutes)

### Option A: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /c/Users/PIETER/Downloads/instant-tw-deployment
vercel

# Add environment variables in Vercel dashboard:
# Settings → Environment Variables → paste all from .env.local

# Deploy production
vercel --prod
```

### Option B: Deploy to VPS

```bash
# On your server:
git clone your-repo
cd instant-tw-deployment
npm install
npm run build

# Set up PM2
npm install -g pm2
pm2 start npm --name "instant" -- start
pm2 save
pm2 startup

# Configure Nginx reverse proxy
# Point to localhost:3000
```

---

## Step 6: Test Everything (5 minutes)

### Test Checklist:

1. ✅ Visit pricing page - click "Get Pro" → Stripe checkout opens
2. ✅ Complete test purchase (use test card: 4242 4242 4242 4242)
3. ✅ Redirects to success page
4. ✅ Check Stripe dashboard - payment received
5. ✅ Check webhook received in Stripe dashboard
6. ✅ Visit /signup - create account
7. ✅ Visit /login - sign in
8. ✅ Visit /dashboard - see user data
9. ✅ Sign out
10. ✅ Try accessing /dashboard - redirects to login

---

## 🎯 Production Checklist

Before going live:

- [ ] All 6 service pages updated with Stripe checkout
- [ ] All 72 Stripe products created
- [ ] All 72 Price IDs added to .env.local
- [ ] Webhook configured and secret added
- [ ] Database credentials configured
- [ ] NextAuth secret generated
- [ ] Application deployed
- [ ] Test payment completed successfully
- [ ] Test authentication flow works
- [ ] Test dashboard access
- [ ] SSL certificate installed (automatic on Vercel)
- [ ] Custom domain configured (if using Vercel)

---

## 🆘 Quick Troubleshooting

### Issue: Stripe checkout doesn't open
**Fix:** Check browser console for errors. Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set.

### Issue: "Invalid price ID" error
**Fix:** Double-check Price ID matches exactly in `.env.local` and Stripe dashboard.

### Issue: Webhook not receiving events
**Fix:** Verify webhook URL is correct and webhook secret matches.

### Issue: Can't sign in
**Fix:** Verify `NEXTAUTH_SECRET` is set and `NEXTAUTH_URL` matches your domain.

### Issue: API routes return 404
**Fix:** Ensure you're deploying to a platform that supports Next.js API routes (Vercel, VPS with Node.js).

---

## 📞 Support

If you encounter issues:

1. Check `IMPLEMENTATION_COMPLETE.md` for detailed documentation
2. Check `.env.example.example` for all environment variables
3. Review Stripe dashboard for webhook delivery logs
4. Check browser console for JavaScript errors
5. Check server logs for API errors

---

**Time to Production:** ~1 hour if you follow this guide step-by-step!

Good luck! 🚀
