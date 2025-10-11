# Deploy to NEW Vercel Project - Step by Step

## Prerequisites ✅
- You have a Vercel account
- Project builds successfully locally
- All environment variables documented

---

## METHOD 1: Deploy via Vercel Dashboard (EASIEST)

### Step 1: Build the Project Locally
```powershell
cd "C:\Users\PIETER\Downloads\instant-tw-deployment"
npm run build
```

✅ Verify build succeeds with no errors

### Step 2: Create New Vercel Project

1. **Go to Vercel Dashboard**: https://vercel.com/
2. **Click "Add New" → "Project"**
3. **Choose "Continue with GitHub"** (or skip if you prefer manual upload)

### Option A: Connect to GitHub Repository

**If you want auto-deploy from GitHub:**

1. Select repository: `instanttw/wp-instant`
2. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

3. **Add Environment Variables** (CRITICAL):
   Click "Environment Variables" and add these:

   ```
   DATABASE_URL=your_neon_database_url_here
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=your_nextauth_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   WORDPRESS_CLIENT_ID=your_wordpress_client_id
   WORDPRESS_CLIENT_SECRET=your_wordpress_client_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   STRIPE_SECRET_KEY=your_stripe_secret
   RESEND_API_KEY=your_resend_key
   EMAIL_FROM=noreply@instant.tw
   ```

4. **Click "Deploy"**
5. Wait 2-3 minutes
6. Get your deployment URL: `https://your-project.vercel.app`

### Option B: Upload Folder Manually (NO GITHUB)

**If you don't want to use GitHub:**

1. Install Vercel CLI:
   ```powershell
   npm install -g vercel
   ```

2. Login to Vercel:
   ```powershell
   vercel login
   ```

3. Deploy:
   ```powershell
   cd "C:\Users\PIETER\Downloads\instant-tw-deployment"
   vercel --prod
   ```

4. Follow prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your team
   - Link to existing project? **N**
   - What's your project's name? `instant-wp-marketplace` (or your choice)
   - In which directory is your code located? `./`
   - Want to override settings? **N**

5. Add environment variables:
   ```powershell
   vercel env add DATABASE_URL
   # Paste your database URL when prompted
   
   vercel env add NEXTAUTH_SECRET
   # Paste your secret
   
   # Repeat for all environment variables
   ```

6. Redeploy with env vars:
   ```powershell
   vercel --prod
   ```

---

## Step 3: Configure Custom Domain (Optional)

If you want to use `wp.instant.tw`:

1. Go to your new Vercel project
2. Click "Settings" → "Domains"
3. Add domain: `wp.instant.tw`
4. Follow DNS instructions to update your domain registrar
5. Wait for DNS propagation (5-30 minutes)

---

## Step 4: Test All Languages

After deployment, test these URLs:

### With Vercel URL (Immediate)
- ✅ https://your-project.vercel.app/
- ✅ https://your-project.vercel.app/es (Spanish - should be 100% translated!)
- ✅ https://your-project.vercel.app/fr (French - header/footer only)
- ✅ https://your-project.vercel.app/de (German - header/footer only)
- ✅ https://your-project.vercel.app/ar (Arabic - header/footer only)
- ✅ https://your-project.vercel.app/pt (Portuguese - header/footer only)
- ✅ https://your-project.vercel.app/it (Italian - header/footer only)

### With Custom Domain (After DNS)
- ✅ https://wp.instant.tw/
- ✅ https://wp.instant.tw/es

---

## CRITICAL: Environment Variables You MUST Add

**Get these from your current .env file:**

```bash
# Database
DATABASE_URL="postgresql://..." # Your Neon database

# Auth
NEXTAUTH_URL="https://your-project.vercel.app"
NEXTAUTH_SECRET="..." # Random secret key

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# WordPress OAuth
WORDPRESS_CLIENT_ID="..."
WORDPRESS_CLIENT_SECRET="..."

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@instant.tw"

# Optional
NODE_ENV="production"
```

**How to add in Vercel:**
1. Project Settings → Environment Variables
2. Add each variable
3. Select all environments (Production, Preview, Development)
4. Click "Save"

---

## Troubleshooting

### Build Fails
**Error**: "Module not found"
**Solution**: Make sure all dependencies are in package.json
```powershell
npm install
npm run build
```

### Database Connection Fails
**Error**: "Can't connect to database"
**Solution**: 
1. Check DATABASE_URL is correct
2. Verify Neon database is active
3. Check IP allowlist (Vercel IPs should be allowed)

### OAuth Doesn't Work
**Error**: "Redirect URI mismatch"
**Solution**:
1. Update Google OAuth redirect URI: `https://your-project.vercel.app/api/auth/callback/google`
2. Update WordPress OAuth redirect URI: `https://your-project.vercel.app/api/auth/callback/wordpress`

### Translations Don't Show
**Error**: Spanish still shows English
**Solution**:
1. Check build logs - ensure `messages/` folder is included
2. Clear browser cache
3. Try incognito window
4. Check build output includes locale routes

---

## What Will Work Immediately

### ✅ English & Spanish (100%)
- Homepage fully translated
- All sections working
- Header, Footer, Hero, Benefits, Testimonials, etc.

### ⚠️ Other 5 Languages (Partial)
- French, German, Arabic, Portuguese, Italian
- Header & Footer translated
- Homepage content sections still English
- **To fix**: Add translation keys to fr.json, de.json, ar.json, pt.json, it.json

---

## Advantages of New Project

1. **Clean Slate**: No old deployment baggage
2. **Fresh Configuration**: All settings correct from start
3. **Easy Testing**: Can compare old vs new
4. **No Conflicts**: Avoids any existing issues
5. **Quick**: Takes 5-10 minutes total

---

## After Successful Deploy

### Keep Old Project Running (Recommended)
- Don't delete old Vercel project yet
- Test new project thoroughly
- Switch domains when ready
- Delete old project after 1 week

### Monitor First 24 Hours
- Check error logs in Vercel
- Test all critical features
- Verify database connections
- Test checkout flow
- Check email sending

---

## Quick Start Commands

```powershell
# Test build locally first
cd "C:\Users\PIETER\Downloads\instant-tw-deployment"
npm run build

# Option A: Deploy with Vercel CLI
npm install -g vercel
vercel login
vercel --prod

# Option B: Manual upload
# Just use Vercel Dashboard → New Project → Upload folder
```

---

## Expected Results

After deploying to new Vercel project:

1. **English site works perfectly** ✅
2. **Spanish site 100% translated** ✅ 
3. **Other languages partially working** ⚠️
4. **All functionality works** (auth, checkout, database) ✅
5. **Fast builds** (~2-3 minutes) ✅

The new project will have the latest commit with all i18n fixes!

---

## Need Help?

If deployment fails:
1. Check Vercel build logs
2. Verify all environment variables are set
3. Test build locally first: `npm run build`
4. Check database connection
5. Review function logs in Vercel dashboard

**Ready to deploy?** Choose Method 1 Option A or B above and follow the steps!
