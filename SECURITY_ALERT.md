# 🚨 SECURITY ALERT - IMMEDIATE ACTION REQUIRED

## Critical Security Issue

You have **publicly exposed your LIVE Stripe API keys** in this conversation.

### Keys Exposed:
- ✅ Publishable Key: `pk_live_51S7Jq9Q7DZRJfE9G...`
- ✅ Secret Key: `sk_live_51S7Jq9Q7DZRJfE9G...`
- ✅ Webhook Secret: `whsec_Vo5LKJm8esDfNEC09oDSNiAW7gynJCEb`

### Risk Level: **HIGH**

Anyone with access to these keys can:
- ❌ Create charges on your Stripe account
- ❌ Issue refunds
- ❌ View customer data
- ❌ Modify subscriptions
- ❌ Access payment information

## IMMEDIATE ACTION (DO NOW)

### Step 1: Rotate Stripe Keys (5 minutes)

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/apikeys

2. **Roll Secret Key**:
   - Find "Secret key" section
   - Click the "..." menu → "Roll key"
   - Confirm the action
   - **COPY THE NEW KEY IMMEDIATELY** (you can't view it again)

3. **Roll Publishable Key**:
   - Find "Publishable key" section
   - Click the "..." menu → "Roll key"
   - Confirm and copy the new key

4. **Roll Webhook Secret**:
   - Go to: https://dashboard.stripe.com/webhooks
   - Click your webhook endpoint
   - Click "Roll secret" button
   - Copy the new webhook secret

### Step 2: Update Vercel (2 minutes)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

2. **Update** these variables with NEW keys:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = [new publishable key]
   STRIPE_SECRET_KEY = [new secret key]
   STRIPE_WEBHOOK_SECRET = [new webhook secret]
   ```

3. Make sure the variable names are EXACTLY as shown above (not _DYNAMIC)

### Step 3: Redeploy (1 minute)

1. Go to Vercel → Deployments
2. Click latest deployment → "Redeploy"
3. Wait for deployment to complete

### Step 4: Verify (2 minutes)

1. Visit: https://wp.instant.tw/wp-scan/plans
2. Test checkout with test card: 4242 4242 4242 4242
3. Verify it works with new keys

## Why This Happened

When you shared the Stripe keys in this conversation, they became visible to:
- Anyone with access to this conversation
- Potentially logged in various systems
- Could be cached or stored

**Always treat API keys like passwords** - never share them publicly.

## How to Safely Share Keys in Future

### DO:
- ✅ Use Vercel's secure environment variables
- ✅ Use secret management tools (Vercel, AWS Secrets Manager)
- ✅ Share via secure channels (1Password, LastPass)
- ✅ Use test keys for development/debugging

### DON'T:
- ❌ Post keys in chat/messages
- ❌ Commit keys to Git repositories
- ❌ Share in screenshots
- ❌ Email keys in plain text
- ❌ Store in plain text files

## Monitoring (After Key Rotation)

### For the next 48 hours:

1. **Monitor Stripe Dashboard**:
   - Check for unauthorized transactions
   - Review recent payments
   - Check for new customers you don't recognize

2. **Check Vercel Logs**:
   - Look for unusual API activity
   - Monitor error rates

3. **Alert Setup**:
   - Enable Stripe email alerts for all charges
   - Set up Slack/Discord webhooks for transactions

## If You See Unauthorized Activity

1. **Immediately disable keys** in Stripe Dashboard
2. **Contact Stripe support**: https://support.stripe.com
3. **File a dispute** for any unauthorized charges
4. **Review** all recent transactions
5. **Check** your Stripe balance and payouts

## Best Practices Going Forward

### Development:
- Use **test keys** (pk_test_, sk_test_) for development
- Never commit keys to Git (use .env files with .gitignore)
- Rotate keys regularly (every 90 days)

### Production:
- Use **live keys** only in Vercel environment variables
- Enable Stripe's security features:
  - 2FA on Stripe account
  - IP whitelisting (if possible)
  - Webhook signature verification (already implemented)

### Team Access:
- Use Stripe's team member feature (don't share keys)
- Grant minimum required permissions
- Remove access when team members leave

## Vercel Environment Variable Security

### Good Setup:
```bash
# In Vercel Dashboard (secure)
STRIPE_SECRET_KEY = sk_live_...
```

### Bad Setup:
```bash
# In .env file committed to Git (exposed)
STRIPE_SECRET_KEY=sk_live_...
```

### Your .env.local File

Check your local `.env.local` file. If it has LIVE keys, remove them:

```bash
# REMOVE live keys from .env.local
# Use test keys for local development:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_test_..."
```

**Live keys should ONLY be in Vercel, never in your local files.**

## Checklist

Complete these steps NOW:

- [ ] Rotate Stripe Secret Key
- [ ] Rotate Stripe Publishable Key  
- [ ] Rotate Stripe Webhook Secret
- [ ] Update all keys in Vercel
- [ ] Remove any live keys from .env.local
- [ ] Redeploy Vercel project
- [ ] Test checkout still works
- [ ] Monitor Stripe Dashboard for 48 hours
- [ ] Enable Stripe email alerts
- [ ] Enable 2FA on Stripe account

## Time Required

- Key rotation: 5 minutes
- Vercel update: 2 minutes
- Testing: 2 minutes
- **Total: 10 minutes**

## Support

If you see unauthorized charges:
- **Stripe Support**: https://support.stripe.com
- **Emergency**: Contact your bank to dispute charges

---

**Status**: URGENT - Rotate keys immediately
**Time Sensitive**: Do this within the next hour
**Last Updated**: 2025-01-10
