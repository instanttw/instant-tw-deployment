# How to Find Commit Hash in Vercel Dashboard

## Visual Guide

### Step 1: Open Deployments Tab
1. Go to: https://vercel.com/instants-projects-b4491864/instant-tw-deployment
2. Click the **"Deployments"** tab (second tab from left)

### Step 2: Look at Deployment List
You'll see a table with columns:
- **Status** (circle icon - green = success, red = failed)
- **Commit/Branch** (this is what we need!)
- **Age** (how long ago)
- **Duration** (build time)
- **Domain** (production URL)

### Step 3: Find the Commit Hash

#### In the List View (Your Screenshot):
Each deployment row shows:
```
[Circle Icon] [Commit Message] [Branch Icon] main
               ↑ THIS IS THE COMMIT MESSAGE
```

The commit message might look like:
- "feat: Complete i18n implementation with 6 languages"
- "fix: Complete footer translations and exclude wp-scan from i18n"

**To see the hash**:
1. Hover your mouse over the commit message
2. OR click on the deployment row

#### In the Detail View:
After clicking a deployment:
1. Look at the top section
2. You'll see: **"Source"** section
3. It shows:
   ```
   Branch: main
   Commit: abb1aeb ← THIS IS THE HASH (7 characters)
   ```

## What Commit Hash Should Be Deployed?

### Latest (CORRECT - What We Want):
- **`72b2d93`** - Very latest (docs only, safe to use)
- **`abb1aeb`** ← **DEPLOY THIS ONE** (has all fixes)
- **`cab0a19`** (docs only)
- **`638ec00`** (has Hero translation fix)

### Old (WRONG - Causes Problems):
- **`0b8ae72`** ← **THIS IS THE PROBLEM** (initial buggy i18n)
- Anything older than this

## How to Check Which is Currently Live

### Method 1: Find "Production" Badge
- Look for a deployment with a **"Production"** badge/label
- That's what's currently live on wp.instant.tw
- Check its commit hash

### Method 2: Check Latest Successful Deployment
- The TOP deployment in the list is usually production
- But not always! Someone might have rolled back
- Look for the green "Production" indicator

## How to Deploy the Correct Version

### If Wrong Commit is Live:

**Option 1: Promote Correct Deployment**
1. Find deployment with commit `abb1aeb` or `72b2d93`
2. Click on it
3. Click three dots menu (•••) in top right
4. Select **"Promote to Production"**
5. Confirm
6. Wait 1-2 minutes

**Option 2: Redeploy from Main**
1. Click the **"Deployments"** tab
2. Click **"Redeploy"** button (top right)
3. Select **"main"** branch
4. **IMPORTANT**: Uncheck "Use existing Build Cache"
5. Click "Redeploy"
6. Wait 2-3 minutes

## Verification After Deployment

### Quick Check:
1. Go to: https://wp.instant.tw/es
2. Look at the page title (browser tab or H1)
3. **If you see**: "Plugins WordPress Premium y Personalizados..." ✅ CORRECT
4. **If you see**: "Premium & Custom WordPress Plugins" ❌ WRONG (old version)

### Detailed Check:
Open https://wp.instant.tw/es and verify:
- [ ] Header "Pricing" shows "Precios"
- [ ] Hero title is in Spanish (starts with "Plugins WordPress Premium")
- [ ] Hero button shows "Explorar Todos los Plugins"
- [ ] Footer "Refund Policy" shows "Política de Reembolso"
- [ ] /wp-scan page loads (not 404)

If ALL checkboxes pass ✅ → Deployment is correct
If ANY fail ❌ → Wrong commit deployed or cache issue

## Common Mistakes

### Mistake 1: Redeploying Wrong Commit
- Don't redeploy `0b8ae72` - that's the broken version
- Make sure you're deploying from the TOP of the list
- Or specifically select commit `abb1aeb`

### Mistake 2: Not Clearing Cache
- After deployment, you MUST clear browser cache
- CDN cache can take 5-10 minutes to update
- Use incognito window for immediate testing

### Mistake 3: Looking at Staging Instead of Production
- Make sure you're checking the PRODUCTION deployment
- Not a preview deployment
- Look for the "Production" badge

## Screenshot Example (From Your Screenshot)

In your screenshot `/c/Users/Pieter/Downloads/rrth.png`:
- I can see the Vercel deployments list
- Each row shows a commit message
- To find the hash, you need to either:
  1. Hover over the commit message text
  2. OR click the row to open details
  3. The 7-character hash will appear

The commit message in the top row might say something like:
"feat: Complete i18n implementation with 6 languages"

If you see that message → That's commit `0b8ae72` (the OLD/BUGGY version)
You need to deploy a NEWER commit instead!

## Summary for Team

**Ask someone with Vercel admin access to:**
1. Open Vercel Dashboard
2. Find deployment with commit starting with `abb1aeb` or `72b2d93`
3. Promote it to production
4. Share the commit message and hash they deployed

**Current Situation:**
- Git has 8 commits with fixes (latest: `72b2d93`)
- Production appears to be on OLD commit (possibly `0b8ae72`)
- This causes translations not to work properly

**Expected Result After Deploying `abb1aeb`:**
- Header: Fully Spanish on /es ✅
- Hero: Fully Spanish on /es ✅  
- Footer: Fully Spanish on /es ✅
- /wp-scan: Works (no 404) ✅
- Other content: Still English (not implemented yet) ⚠️
