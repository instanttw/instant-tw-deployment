# Deploy All Pricing Fixes to Production

## Current Situation
- ✅ All fixes completed locally
- ❌ Production doesn't have the fixes yet
- User is testing on production (wp.instant.tw) and seeing 404 errors

---

## What Needs to be Deployed

### Files Modified:
1. `app/services/security/page.tsx` - Fixed pricing ($99, $299, $999)
2. `app/services/seo/page.tsx` - Fixed pricing ($99, $1,499)
3. `app/wp-scan/plans/page.tsx` - Fixed pricing ($49, $149, $499)
4. `scripts/seed-all-products.ts` - Updated with tiered plugin pricing
5. `config/plugins-data.ts` - Updated all 12 plugins with tiered pricing

### Database Changes Needed:
- Production database needs to be re-seeded with correct pricing

---

## Deployment Steps

### Step 1: Deploy to Vercel Production (No Git Needed!)

```bash
# Deploy to production
vercel --prod

# This will:
# 1. Upload your code to Vercel
# 2. Build the Next.js application
# 3. Deploy to production domain
# 4. Takes 2-5 minutes usually
```

**Expected Output:**
```
✔ Deployed to production
🔍 Inspect: https://vercel.com/...
✅ Production: https://wp.instant.tw
```

### Step 4: Seed Production Database ⚠️ CRITICAL

After deployment, you MUST re-seed the production database:

**Option A: Using Vercel CLI (Recommended)**

```bash
# Run seeder against production database
vercel env pull .env.production.local
npx tsx scripts/seed-all-products.ts
```

**Option B: Using Vercel Dashboard**

1. Go to Vercel Dashboard → Your Project
2. Go to **Settings** → **Functions**
3. Or create a temporary API endpoint to run the seeder:

Create `app/api/admin/seed-production/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  // Add authentication check here!
  const { authorization } = await request.json();
  
  if (authorization !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Run seeder code here
  // Copy content from scripts/seed-all-products.ts
  
  return NextResponse.json({ success: true, message: 'Database seeded' });
}
```

Then call it:
```bash
curl -X POST https://wp.instant.tw/api/admin/seed-production \
  -H "Content-Type: application/json" \
  -d '{"authorization": "your-secret-key"}'
```

**Option C: Direct Database Connection**

1. Get production database URL from Vercel dashboard
2. Copy to local `.env.production.local`:
   ```
   DATABASE_URL=postgres://...production-url...
   ```
3. Run seeder:
   ```bash
   npx tsx scripts/seed-all-products.ts
   ```

**⚠️ WARNING:** Make sure you're seeding PRODUCTION database, not local!

---

## Verification After Deployment

### 1. Check Build Succeeded
- Go to Vercel Dashboard
- Check deployment status: Should show "Ready"
- If failed, check build logs for errors

### 2. Test Production Site

Visit your production URLs:

**WP Scan:**
- https://wp.instant.tw/wp-scan/plans
- Verify shows: Pro $49, Agency $149, Enterprise $499
- Click "Upgrade to Pro" → Should open valid Stripe checkout (not 404)

**SEO Services:**
- https://wp.instant.tw/services/seo
- Verify shows: Pro $99, Agency $499, Enterprise $1,499
- Click "Get Started" on Enterprise → Stripe should show $1,499

**Security Services:**
- https://wp.instant.tw/services/security
- Verify shows: Pro $99, Agency $299, Enterprise $999
- Click "Get Started" → Verify Stripe shows correct prices

### 3. Complete Test Purchase

Use Stripe test card: `4242 4242 4242 4242`
- Test WP Scan Pro checkout
- Test SEO Enterprise checkout
- Verify success page shows after purchase

---

## Rollback Plan (If Something Goes Wrong)

If deployment has issues:

```bash
# Rollback in Vercel Dashboard
# Go to Deployments → Find previous working deployment → Click "Promote to Production"

# Or redeploy previous commit
git log --oneline -10  # Find previous commit
git checkout <previous-commit-hash>
vercel --prod
```

---

## Common Issues & Solutions

### Issue 1: Vercel CLI Not Installed
```bash
npm install -g vercel
vercel login
```

### Issue 2: Build Fails
- Check Vercel build logs
- Usually TypeScript or missing environment variable
- Fix locally first, then redeploy

### Issue 3: Database Connection Fails
- Check `DATABASE_URL` is set in Vercel environment variables
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add `DATABASE_URL` if missing (from Neon dashboard)

### Issue 4: WP Scan Still 404 After Deploy
- Database wasn't seeded → Run Step 4 again
- Check Vercel Functions logs for errors
- Verify `DATABASE_URL` is correct in production

### Issue 5: Pricing Still Wrong
- Hard refresh browser: Ctrl+Shift+F5
- Clear Vercel cache: `vercel --prod --force`
- Check if build used old files

---

## Environment Variables Needed in Production

Make sure these are set in Vercel:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string (from Neon)
- `STRIPE_SECRET_KEY` - Stripe secret key (sk_test_... or sk_live_...)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `NEXTAUTH_URL` - Your production URL (https://wp.instant.tw)
- `NEXTAUTH_SECRET` - Random secret for NextAuth

**Optional:**
- `STRIPE_WEBHOOK_SECRET` - For webhook verification
- Other API keys as needed

Check in Vercel Dashboard → Settings → Environment Variables

---

## Deployment Checklist

Before deploying:
- [ ] All code changes committed to git
- [ ] Local tests passed
- [ ] Environment variables set in Vercel
- [ ] Database URL correct in Vercel

During deployment:
- [ ] Run `vercel --prod`
- [ ] Wait for build to complete
- [ ] Check build logs for errors

After deployment:
- [ ] Seed production database
- [ ] Test WP Scan checkout (no 404)
- [ ] Test SEO Services pricing
- [ ] Test Security Services pricing
- [ ] Complete test purchase

---

## Next Steps - Run These Commands

```bash
# 1. Check git status
cd "C:\Users\PIETER\Downloads\instant-tw-deployment"
git status

# 2. Commit changes
git add .
git commit -m "Fix all Stripe pricing mismatches and WP Scan 404 errors"

# 3. Deploy to production
vercel --prod

# 4. After deployment succeeds, seed production database
# (Choose one of the options in Step 4 above)

# 5. Test on production
# Visit: https://wp.instant.tw/wp-scan/plans
# Try checkout - should work now!
```

---

**Ready to deploy?** Let me know when you're ready and I'll guide you through each step!
