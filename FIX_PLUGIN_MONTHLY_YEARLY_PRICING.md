# Fix Plugin Monthly/Yearly Pricing

## Problem Understood:

❌ **My Mistake:** I removed the toggle entirely
✅ **What You Actually Wanted:** Keep the toggle, but show DIFFERENT prices for monthly vs yearly (25% discount on yearly)

---

## Solution Overview:

### Step 1: Update Database (Run SQL)
Add monthly and yearly subscription tiers for all 12 plugins

### Step 2: Deploy Code Changes
Updated plugin page to:
- Show toggle (Monthly / Yearly with 25% savings)
- Display different prices based on toggle
- Pass correct tier name to checkout (`pro-monthly` or `pro-yearly`)

---

## Step-by-Step Fix:

### 1️⃣ Run SQL in Neon (REQUIRED)

**File:** `add-plugin-monthly-yearly-tiers.sql`

This will:
1. Convert existing tiers (`pro`, `agency`, `enterprise`) to monthly subscriptions (`pro-monthly`, etc.)
2. Add new yearly tiers with 25% discount
3. Verify all tiers were created

**Example for instant-image-optimizer:**
- Current database: `pro` = $39 (one-time)
- After SQL:
  - `pro-monthly` = $39/month
  - `pro-yearly` = $351/year (saves $117 vs $468)
  - `agency-monthly` = $119/month
  - `agency-yearly` = $1,071/year (saves $357 vs $1,428)
  - `enterprise-monthly` = $299/month
  - `enterprise-yearly` = $2,691/year (saves $897 vs $3,588)

---

### 2️⃣ Deploy Code Changes

**Files Changed:**
- `app/plugins/[slug]/plugin-detail-client.tsx`

**Changes:**
1. ✅ Restored monthly/yearly toggle
2. ✅ Price calculation:
   - Monthly: Shows base price (e.g., $39/month)
   - Yearly: Shows `price × 12 × 0.75` (e.g., $351/year)
   - Shows savings amount in green
3. ✅ Button passes correct tier:
   - Monthly: `tierName="pro-monthly"`
   - Yearly: `tierName="pro-yearly"`

---

## What Users Will See:

### Monthly Selected:
```
Pro
$39/month
[Get Started] → Charges $39/month
```

### Yearly Selected:
```
Pro
$351/year
Save $117
[Get Started] → Charges $351/year
```

---

## All 12 Plugins Affected:

1. instant-image-optimizer
2. instant-broken-link-fixer
3. instant-duplicator
4. instant-forms-replacement
5. instant-security-guard
6. instant-backup-restore
7. instant-seo-booster
8. instant-cache-optimizer
9. instant-database-cleaner
10. instant-migration-tool
11. instant-redirect-manager
12. instant-schema-generator

Each will have 6 paid tiers:
- pro-monthly, pro-yearly
- agency-monthly, agency-yearly  
- enterprise-monthly, enterprise-yearly

---

## Testing After Deployment:

1. **Run SQL** in Neon
2. **Deploy code:** `vercel --prod`
3. **Clear cache** or use incognito
4. **Visit:** https://wp.instant.tw/plugins/instant-image-optimizer
5. **Toggle between Monthly/Yearly:**
   - Should see different prices
   - Should see "Save $XX" on yearly
   - Buttons should work for both

---

## Pricing Formula:

```
Monthly Price = $X
Yearly Price = $X × 12 × 0.75 (25% discount)
Savings = $X × 12 × 0.25 (you save 25%)
```

**Example:**
- Monthly: $39
- Yearly: $39 × 12 × 0.75 = $351
- Savings: $39 × 12 × 0.25 = $117

User pays $351 instead of $468 for yearly!

---

## Next Steps:

1. **Run SQL:** `add-plugin-monthly-yearly-tiers.sql` in Neon
2. **Verify:** Check that tiers were created (SQL output shows ~72 rows)
3. **Deploy:** I'll deploy the code after you confirm database is updated
4. **Test:** Try the toggle on a plugin page

---

**Ready to run the SQL? Let me know when done, and I'll deploy the code changes!**
