# Pricing Issues Analysis & Fix Plan

## Current Problems

### Problem 1: Homepage Shows Wrong Pricing
**Issue:** Plugin cards on homepage show "Pro from $49/year" (hardcoded)  
**Reality:** Pro tier is actually $39/year in plugins-data.ts  
**Status:** ✅ FIXED - Removed hardcode, now pulls from actual pricing data

### Problem 2: Pricing Data Inconsistency

**Three Different Price Sources:**

1. **Frontend Config (`plugins-data.ts`)**:
   - Pro: $39/year (annual billing)
   - Agency: $119/year (annual billing)  
   - Enterprise: $299/year (annual billing)

2. **Database (seeded by `seed-all-products.ts`)**:
   - Pro Monthly: $39/month (3900 cents)
   - Pro Yearly: $351/year (35100 cents) - 25% discount
   - Agency Monthly: $119/month (11900 cents)
   - Agency Yearly: $1,071/year (107100 cents) - 25% discount
   - Enterprise Monthly: $299/month (29900 cents)
   - Enterprise Yearly: $2,691/year (269100 cents) - 25% discount

3. **What User Reports Seeing:**
   - Site: "$49 per month"
   - Stripe: "$391 per year"

### Problem 3: Billing Period Mismatch
**Issue:** User clicks button showing monthly price, but Stripe opens with yearly price  
**Cause:** Need to verify tierName is being passed correctly with billing period

## Root Cause Analysis

The confusion comes from mixing annual and monthly pricing:

- `plugins-data.ts` was designed for ANNUAL billing ($39/year, $119/year, $299/year)
- Database seeder was designed for MONTHLY billing ($39/month, etc.)
- Homepage was showing hardcoded "$49" (incorrect)

## Questions for User

Before I can fix everything, I need to know:

1. **What should the CORRECT Pro pricing be?**
   - Option A: $39/month ($351/year with discount)
   - Option B: $39/year (annual only)
   - Option C: $49/month ($441/year with discount)
   - Option D: Something else

2. **What billing model do you want?**
   - Option A: Both monthly and yearly (recommended)
   - Option B: Yearly only
   - Option C: Monthly only

3. **For all 12 plugins, should they have the same pricing?**
   - Yes - All plugins use same Pro/Agency/Enterprise pricing
   - No - Different plugins have different prices

## Recommended Fix (Assuming Monthly + Yearly Model)

### Option 1: Monthly Primary ($39/month base)
```
Pro: $39/month or $351/year (save 25%)
Agency: $119/month or $1,071/year (save 25%)
Enterprise: $299/month or $2,691/year (save 25%)
```

### Option 2: Affordable Monthly ($29/month base)
```
Pro: $29/month or $261/year (save 25%)
Agency: $99/month or $891/year (save 25%)  
Enterprise: $249/month or $2,241/year (save 25%)
```

### Option 3: Higher Monthly ($49/month base)
```
Pro: $49/month or $441/year (save 25%)
Agency: $149/month or $1,341/year (save 25%)
Enterprise: $349/month or $3,141/year (save 25%)
```

## Files That Need Updates

Once pricing is decided:

1. **`config/plugins-data.ts`** - Update all 12 plugin pricing objects
2. **`scripts/seed-all-products.ts`** - Update pluginTiers template
3. **Database** - Re-run seeder to update all tiers
4. **Components** - Already fixed to pull from actual data

## Temporary Fix Applied

✅ **Fixed plugin-card.tsx** - Removed hardcoded "$49/year", now shows actual Pro price from plugins-data.ts

**Current behavior:**
- Homepage will now show "Pro from $39/year" (from plugins-data.ts)
- Plugin detail pages will show pricing from database
- Still have mismatch between config file and database

## Next Steps

**USER DECISION NEEDED:**

Please specify the correct pricing structure:

```markdown
**Pricing Decision:**
- Pro Monthly: $___/month
- Pro Yearly: $___/year
- Agency Monthly: $___/month
- Agency Yearly: $___/year
- Enterprise Monthly: $___/month
- Enterprise Yearly: $___/year

**Apply to:**
- [ ] All 12 plugins (same pricing)
- [ ] Different pricing per plugin (specify which)

**Billing Options:**
- [ ] Monthly and Yearly (recommended)
- [ ] Yearly only
- [ ] Monthly only
```

Once you provide this, I will:
1. Update plugins-data.ts with correct pricing
2. Update database seeder with correct pricing
3. Re-seed database
4. Verify all pricing displays match
5. Test Stripe checkout with correct amounts and billing periods

## Testing Checklist (After Fix)

- [ ] Homepage shows correct "Pro from $X/period"
- [ ] Plugin detail page shows same pricing as homepage
- [ ] Clicking Pro Monthly button opens Stripe with monthly amount
- [ ] Clicking Pro Yearly button opens Stripe with yearly amount
- [ ] All 12 plugins show consistent pricing
- [ ] Services pages show correct pricing
- [ ] Bundle page shows correct pricing

---

**Status:** ⏳ Awaiting user pricing decision  
**Files Modified:** `components/sections/plugin-card.tsx` (hardcode removed)  
**Files Pending:** `config/plugins-data.ts`, `scripts/seed-all-products.ts`
