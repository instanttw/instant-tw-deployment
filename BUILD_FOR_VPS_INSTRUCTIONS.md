# Build Instructions - Multiple Options

## 🎯 **Best Solution: Use Vercel (5 minutes)**

Since there are complexities with static export, I **strongly recommend using Vercel**:

```bash
cd C:\Users\PIETER\Downloads\instant-tw-deployment  
vercel
```

Then add custom domain `wp.instant.tw` in Vercel dashboard.

**Why Vercel is better:**
- ✅ No build issues
- ✅ Free tier
- ✅ Automatic SSL
- ✅ 5 minute setup
- ✅ Perfect for Next.js

See: **VERCEL_SUBDOMAIN_QUICK_START.txt** for details

---

## Alternative: Manual File Removal + Static Build

If you must use static files on VPS:

**Step 1:** Close all editors and terminals

**Step 2:** Delete these folders:
- `C:\Users\PIETER\Downloads\wp-website\app\api`
- `C:\Users\PIETER\Downloads\wp-website\app\dashboard`
- `C:\Users\PIETER\Downloads\wp-website\app\login`

**Step 3:** Run build:
```bash
cd C:\Users\PIETER\Downloads\wp-website
npm run build
```

**Step 4:** Upload `out` folder contents to VPS

---

**Recommendation: Just use Vercel - it's much easier!** 🚀
