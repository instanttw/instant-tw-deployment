# 🔧 Vercel Environment Variables Setup

## ❌ Current Issue

Build is failing because `DATABASE_URL` environment variable is not properly configured in Vercel.

**Error:**
```
Error: Database connection string format for `neon()` should be: postgresql://user:password@host.tld/dbname?option=value
```

---

## ✅ Solution

### Step 1: Go to Vercel Dashboard

1. Open https://vercel.com/dashboard
2. Select project: **instant-tw-deployment**
3. Go to **Settings** → **Environment Variables**

### Step 2: Add DATABASE_URL

**Important:** You mentioned you added `POSTGRES_URL`, but the code expects `DATABASE_URL`.

**Add this variable:**

```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_TtKI2mjw3Scu@ep-raspy-meadow-aedilh0m-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
Environment: Production, Preview, Development (check all)
```

**OR** if you want to keep POSTGRES_URL, I've already updated the code to accept both:
- The code now checks for `DATABASE_URL` OR `POSTGRES_URL`
- So either variable name will work

### Step 3: Verify All Required Environment Variables

Make sure these are set in Vercel (Production environment):

```bash
# Database (REQUIRED)
DATABASE_URL=postgresql://neondb_owner:npg_TtKI2mjw3Scu@ep-raspy-meadow-aedilh0m-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

# OR use this name (code accepts both now)
POSTGRES_URL=postgresql://neondb_owner:npg_TtKI2mjw3Scu@ep-raspy-meadow-aedilh0m-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

# Authentication (REQUIRED)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://wp.instant.tw

# Stripe (REQUIRED for payments)
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)

# Stripe Webhooks (REQUIRED for order fulfillment)
STRIPE_WEBHOOK_SECRET=whsec_... (for subscriptions)
STRIPE_WEBHOOK_SECRET_DYNAMIC=whsec_... (for products/services)

# Optional but recommended
CRON_SECRET=your_random_secret (for WP Scan cron jobs)
RESEND_API_KEY=re_... (for email notifications)
```

### Step 4: Redeploy

After adding environment variables:

```powershell
cd "C:\Users\PIETER\Downloads\instant-tw-deployment"
vercel --prod
```

---

## 🔍 Verify Environment Variables Are Set

In Vercel Dashboard → Project Settings → Environment Variables, you should see:

| Variable Name | Environment | Value Preview |
|---------------|-------------|---------------|
| DATABASE_URL | Production, Preview, Development | `postgresql://neondb_...` |
| NEXTAUTH_SECRET | Production, Preview, Development | `***hidden***` |
| NEXTAUTH_URL | Production, Preview, Development | `https://wp.instant.tw` |
| STRIPE_SECRET_KEY | Production, Preview, Development | `sk_test_...` |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Production, Preview, Development | `pk_test_...` |

---

## 🐛 Common Issues

### Issue 1: "DATABASE_URL is not set"
**Solution:** Add DATABASE_URL in Vercel dashboard, not just locally

### Issue 2: "Connection string format error"
**Solution:** Make sure the connection string:
- Starts with `postgresql://`
- Has format: `postgresql://user:password@host/database?params`
- Includes `?sslmode=require` at the end

### Issue 3: Build succeeds but runtime error
**Solution:** Check that environment variables are set for ALL environments (Production, Preview, Development)

### Issue 4: Local works but Vercel fails
**Solution:** Environment variables in `.env.local` don't sync to Vercel automatically - must add manually in dashboard

---

## ✅ Quick Fix Checklist

- [ ] Go to Vercel Dashboard
- [ ] Select instant-tw-deployment project
- [ ] Go to Settings → Environment Variables
- [ ] Click "Add New"
- [ ] Add `DATABASE_URL` with your Neon connection string
- [ ] Check all 3 environments (Production, Preview, Development)
- [ ] Save
- [ ] Redeploy: `vercel --prod`

---

## 🚀 After Adding Environment Variables

The build should succeed and show:

```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
✅ Build Completed
```

Then your site will be live with working checkout buttons!

---

## 💡 Pro Tip

**To verify environment variables are loaded:**

Add this temporary API route: `app/api/test-env/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  });
}
```

Then visit: `https://wp.instant.tw/api/test-env`

Should show `true` for all variables.

---

## 📞 Need Help?

If still failing after adding DATABASE_URL:

1. **Screenshot Vercel environment variables page**
2. **Copy full error log from Vercel deployment**
3. **Check if DATABASE_URL shows in error logs** (might be censored)

The fix I made (accepting both DATABASE_URL and POSTGRES_URL) will work once environment variables are properly set in Vercel!
