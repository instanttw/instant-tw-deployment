# Clear Cache and Test WP Scan

## The deployment is complete, but you need to clear browser cache!

The code changes are deployed to production, but your browser is showing a cached version.

---

## Step 1: Clear Browser Cache

### Chrome/Edge:
1. Press `Ctrl + Shift + Delete`
2. Select **Cached images and files**
3. Time range: **Last 24 hours**
4. Click **Clear data**

### Or Use Incognito/Private Mode:
- Press `Ctrl + Shift + N` (Chrome/Edge)
- Press `Ctrl + Shift + P` (Firefox)

---

## Step 2: Hard Refresh the WP Scan Page

1. Go to: https://wp.instant.tw/wp-scan/plans
2. Press **Ctrl + F5** (hard refresh)
3. Click a button (Pro Monthly)

---

## Step 3: What Should Happen

**OLD behavior (cached):**
- Redirects to: `https://checkout.stripe.com/c/pay/cs_test_wpscan_pro_monthly`
- Error: "Something went wrong"

**NEW behavior (after cache clear):**
- Shows loading spinner on button
- Creates NEW checkout session
- Redirects to: `https://checkout.stripe.com/c/pay/cs_live_...` (dynamic session ID)
- Shows Stripe checkout form with price $19.00/month

---

## Step 4: Verify Deployment

Check if code is actually deployed:
- Visit: https://wp.instant.tw/wp-scan/plans
- Right-click → View Page Source
- Search for: "UnifiedCheckoutButton"
- Should see: `productSlug="wp-scan"` and `tierName=`

If you don't see this, the deployment might not have propagated yet.

---

## Alternative: Direct Test URL

Try the direct Vercel deployment URL (bypasses DNS cache):
https://instant-tw-deployment-i7uuxkmzq-instants-projects-b4491864.vercel.app/wp-scan/plans

This should work immediately without cache issues.

---

## Troubleshooting

If still not working:

1. **Check Vercel deployment:**
   - Visit: https://vercel.com/instants-projects-b4491864/instant-tw-deployment
   - Check latest deployment status
   - Make sure it says "Ready"

2. **Check DNS propagation:**
   - wp.instant.tw might still point to old deployment
   - Wait 5-10 minutes for DNS to update

3. **Check if database was updated:**
   ```sql
   SELECT * FROM products WHERE slug = 'wp-scan';
   ```
   Should return 1 row

4. **Test the API directly:**
   Open browser console and run:
   ```javascript
   fetch('/api/checkout/dynamic', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       productSlug: 'wp-scan',
       tierName: 'pro-monthly'
     })
   }).then(r => r.json()).then(console.log)
   ```
   
   Should return: `{ success: true, url: "https://checkout.stripe.com/..." }`

---

## What We Fixed Today:

1. ✅ Disabled old static API (`/api/stripe/checkout`)
2. ✅ Updated UnifiedCheckoutButton to only use dynamic API
3. ✅ Added wp-scan product to database with 6 tiers
4. ✅ Deployed all changes to production

---

**Next: Please clear cache and test, then let me know what happens!**
