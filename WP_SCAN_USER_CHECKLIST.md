# WP Scan 404 Error - User Testing Checklist

## Investigation Results: Backend is Correct ✅

I've verified that the backend is properly configured:

### ✅ Database Verified
- Product exists: `wp-scan`  
- All 6 pricing tiers exist with correct names:
  - ✅ `pro-monthly` = $49
  - ✅ `pro-yearly` = $441
  - ✅ `agency-monthly` = $149
  - ✅ `agency-yearly` = $1,341
  - ✅ `enterprise-monthly` = $499
  - ✅ `enterprise-yearly` = $4,491

### ✅ Stripe Keys Configured
- `STRIPE_SECRET_KEY` is set in `.env.local`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set

### ✅ Button Implementation Correct
- Buttons use `UnifiedCheckoutButton` properly
- Tier names match database exactly

---

## Why You're Seeing 404

The session ID `cs_test_wpscan_` is NOT a valid Stripe session ID. Real ones look like `cs_test_a1b2c3d4e5f6...`

This suggests:
1. **Cached old code** - Browser has old version before fixes
2. **Dev server not running** - Need fresh build
3. **API error not showing** - Check browser console

---

## Steps to Fix

### 1. **Clear Browser Cache & Restart Dev Server**

```bash
# Stop dev server (Ctrl+C)
# Clear .next folder
Remove-Item -Recurse -Force .next

# Restart dev server
npm run dev
```

Then in browser:
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or open in incognito/private window

### 2. **Check Browser Console**

When you click "Upgrade to Pro":

1. Open browser DevTools (`F12`)
2. Go to **Console** tab
3. Click the "Upgrade to Pro" button
4. Look for error messages

**Expected:** No errors, button should work

**If you see error:**
- "Product not found" → Database issue (but we verified it exists)
- "Pricing tier not found" → Tier name mismatch (but we verified they match)
- "Network error" → Dev server not running
- Any other error → Tell me what it says!

### 3. **Check Network Tab**

1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Click "Upgrade to Pro" button
4. Find the request to `/api/checkout/dynamic`
5. Click on it → Check **Response**

**Expected good response:**
```json
{
  "success": true,
  "sessionId": "cs_test_a1b2c3d4e5f6...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4...",
  "product": {
    "name": "WordPress Security Scanner",
    "tier": "Pro Monthly"
  }
}
```

**If you see error response:**
```json
{
  "error": "Product not found"
}
```

Tell me what the exact error message is!

### 4. **Test Specific Buttons**

Try each button separately and note which ones fail:

- [ ] Pro Monthly - `/wp-scan/plans` → Toggle to Monthly → Click "Upgrade to Pro"
- [ ] Pro Yearly - `/wp-scan/plans` → Toggle to Yearly → Click "Upgrade to Pro"
- [ ] Agency Monthly - `/wp-scan/plans` → Toggle to Monthly → Click "Upgrade to Agency"
- [ ] Agency Yearly - `/wp-scan/plans` → Toggle to Yearly → Click "Upgrade to Agency"

**Do all buttons fail or just some?**

---

## Quick Test Commands

### Test 1: Verify Database Has WP Scan
```bash
npx tsx scripts/check-wpscan.ts
```

**Expected output:**
```
✅ Product found: WordPress Security Scanner
📊 Found 6 pricing tiers
✓ Verification:
   pro-monthly: ✅ EXISTS
   pro-yearly: ✅ EXISTS
   agency-monthly: ✅ EXISTS
   agency-yearly: ✅ EXISTS
```

### Test 2: Check Dev Server is Running
Visit: `http://localhost:3000/wp-scan/plans`

**Should see:** WP Scan pricing page with plans

**If 404:** Dev server not running → Run `npm run dev`

---

## Most Likely Issue

Based on the invalid session ID `cs_test_wpscan_`, you're probably seeing:

**OLD CACHED CODE**
- Your browser cached the old version before database was seeded
- Old code had placeholder session IDs
- New code is correct but browser hasn't loaded it

**Fix:** 
1. Hard refresh: `Ctrl+Shift+R`
2. Or use incognito window
3. Or clear browser cache completely

---

## If Still Not Working

Please provide me with:

1. **Browser console errors** (screenshot or copy/paste)
2. **Network tab response** from `/api/checkout/dynamic` (screenshot or JSON)
3. **Which buttons fail?** All of them or just specific ones?
4. **Are you on localhost:3000?** Make sure dev server is running
5. **Did you restart dev server** after I re-seeded the database?

---

## Why SEO Works But WP Scan Doesn't

Possible reasons:
1. **You tested SEO after fixes** but WP Scan before
2. **SEO page loaded fresh** but WP Scan is cached
3. **Product type difference** - SEO is `service`, WP Scan is `subscription` (might trigger different code path with a bug)

To test if it's #3, check if other subscription products work or only services work.

---

## Quick Verification

Run these commands to verify everything is correct:

```bash
# 1. Check database has WP Scan
npx tsx scripts/check-wpscan.ts

# 2. Rebuild fresh
Remove-Item -Recurse -Force .next
npm run dev

# 3. Open fresh browser (incognito)
# Visit: http://localhost:3000/wp-scan/plans
# Try "Upgrade to Pro"
```

If you still get 404, check browser console and tell me the exact error!

---

**Next Step:** Please try the "Clear Cache & Restart" steps above and let me know what you see in the browser console.
