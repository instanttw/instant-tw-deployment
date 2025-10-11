# 🚀 Stripe Checkout - Quick Setup Guide

## ⚡ **Get Payments Working in 30 Minutes**

Follow these steps to enable Stripe checkout across your entire site.

---

## ✅ **Step 1: Create Stripe Products (15 minutes)**

### **Login to Stripe:**
https://dashboard.stripe.com/

### **Create Your Main Products:**

1. **Go to: Products → Add Product**

2. **Create: "Pro Plan"**
   - Name: Pro Plan
   - Description: All 12 premium plugins for 3 websites
   - Click "Add pricing"
   - **Monthly Price:** $49.00 USD
   - Billing period: Monthly
   - Save → Copy Price ID (starts with `price_`)
   - Add another price: **Yearly Price:** $441.00 USD
   - Save → Copy Price ID

3. **Create: "Agency Plan"**
   - Monthly: $299
   - Yearly: $2,691
   - Copy both Price IDs

4. **Create: "Enterprise Plan"**
   - Monthly: $999
   - Yearly: $8,991
   - Copy both Price IDs

5. **Repeat for other products** (hosting, plugins, services)

---

## ✅ **Step 2: Update Price Configuration (5 minutes)**

### **Edit File:** `config/stripe-prices.ts`

Replace placeholder IDs with your real ones:

```typescript
export const STRIPE_PRICES: StripePrices = {
  plans: {
    pro: {
      monthly: "price_1QXXpQQ7DZRJfE9G2bSfBxqN", // ← Your Pro monthly ID
      yearly: "price_1QXXqAQ7DZRJfE9GVvKQOAVQ",  // ← Your Pro yearly ID
    },
    agency: {
      monthly: "price_YOUR_ID_HERE", // ← Paste your Agency monthly ID
      yearly: "price_YOUR_ID_HERE",  // ← Paste your Agency yearly ID
    },
    // ... continue for all products
  }
};
```

**Save the file!**

---

## ✅ **Step 3: Setup Webhook (5 minutes)**

### **In Stripe Dashboard:**

1. **Go to: Developers → Webhooks**

2. **Click: "Add endpoint"**

3. **Endpoint URL:**
   ```
   https://wp.instant.tw/api/stripe/webhook
   ```

4. **Select events to listen to:**
   - `checkout.session.completed` ✓
   - `payment_intent.succeeded` ✓
   - `customer.subscription.created` ✓
   - `customer.subscription.updated` ✓
   - `customer.subscription.deleted` ✓

5. **Click "Add endpoint"**

6. **Copy the Signing Secret** (starts with `whsec_`)

7. **Add to `.env.production`:**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
   ```

---

## ✅ **Step 4: Test with Test Mode (5 minutes)**

### **Create `.env.local` for testing:**

```env
# Stripe Test Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Run locally:**
```bash
npm run dev
```

### **Test checkout:**
1. Go to http://localhost:3000/pricing
2. Click "Get Pro" button
3. Should redirect to Stripe checkout
4. Use test card: **4242 4242 4242 4242**
5. Any future date, any CVC
6. Complete payment
7. Should redirect to success page ✓

---

## ✅ **Step 5: Deploy to Production**

### **Verify `.env.production` has:**

```env
# Live Keys (already there)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51S7Jq9Q7DZRJfE9Gl...
STRIPE_SECRET_KEY=sk_live_51S7Jq9Q7DZRJfE9G8CE...
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_from_step_3

# App URL
NEXT_PUBLIC_APP_URL=https://wp.instant.tw
```

### **Upload to VPS:**
- Upload your updated `config/stripe-prices.ts`
- Upload `.env.production` with webhook secret
- Restart your app

### **Test on live site:**
1. Visit https://wp.instant.tw/pricing
2. Click any "Get Started" button
3. Test with REAL card (recommend $1 test)
4. Verify success page works
5. Check Stripe dashboard for payment ✓

---

## 🎯 **That's It!**

Your Stripe integration is now live! All purchase buttons across your site will work:

- ✅ Pricing page
- ✅ Hosting page
- ✅ Service pages
- ✅ Plugin pages
- ✅ WP Scan page

---

## 🧪 **Quick Test Checklist**

After setup, test these:

- [ ] Click "Get Pro" on pricing page
- [ ] Click "Get Started" on hosting page
- [ ] Click purchase button on a service page
- [ ] Try monthly vs yearly toggle
- [ ] Complete a test purchase
- [ ] Verify success page shows
- [ ] Check Stripe dashboard for payment
- [ ] Try canceling checkout (verify cancel page)

---

## 🚨 **Troubleshooting**

### **"Product not found" error:**
→ You haven't updated Price IDs in `config/stripe-prices.ts`

### **"Webhook signature verification failed":**
→ Webhook secret in `.env.production` is incorrect

### **Checkout button not working:**
→ Check browser console for errors
→ Verify Stripe keys are correct in .env.production

### **Can't find Price IDs:**
→ Go to Stripe Dashboard → Products → Click product → Copy price ID

---

## 📞 **Need Help?**

1. Check `STRIPE_SETUP_COMPLETE.md` for detailed docs
2. Look at Stripe Dashboard → Developers → Logs
3. Check your application logs: `pm2 logs`

---

## 🎉 **Congratulations!**

You now have a fully functional payment system powered by Stripe!

**Next:** Monitor your Stripe dashboard for incoming payments and webhook events.

**Important:** Test refunds and subscription cancellations to ensure the full lifecycle works.
