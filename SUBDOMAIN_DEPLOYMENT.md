# Deploying to Subdomain (wp.instant.tw) on Vercel

## 📋 Overview

This guide shows you how to deploy your WordPress Plugin Marketplace to **wp.instant.tw** subdomain using Vercel.

**Setup:**
- Main domain: `instant.tw` → Your other project
- Subdomain: `wp.instant.tw` → This WordPress Plugin Marketplace

---

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Deploy to Vercel

1. **Open terminal in deployment folder:**
```bash
cd C:\Users\PIETER\Downloads\instant-tw-deployment
```

2. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

3. **Login to Vercel:**
```bash
vercel login
```

4. **Deploy:**
```bash
vercel
```

5. **Follow prompts:**
   - Login to your Vercel account
   - Confirm project name (e.g., "instant-tw-marketplace")
   - Confirm settings
   - Wait for deployment

6. **Note the deployment URL** (e.g., `instant-tw-marketplace.vercel.app`)

---

### Step 2: Add Subdomain to Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your project

2. **Go to Project Settings:**
   - Click **Settings** tab
   - Click **Domains** in sidebar

3. **Add Custom Domain:**
   - Click **Add** button
   - Enter: `wp.instant.tw`
   - Click **Add**

4. **Vercel will provide DNS instructions:**
   - You'll see either:
     - **CNAME record** (most common for subdomains)
     - **A record** (less common)

---

### Step 3: Configure DNS

#### Option A: CNAME Record (Recommended for Subdomains)

Go to your domain registrar (where you bought instant.tw) and add:

```
Type:  CNAME
Name:  wp
Value: cname.vercel-dns.com
TTL:   3600 (or default)
```

#### Option B: A Record (If Vercel requires it)

```
Type:  A
Name:  wp
Value: 76.76.21.21 (Vercel's IP - check Vercel dashboard for latest)
TTL:   3600 (or default)
```

**Note:** Vercel will show you the exact records to add in the dashboard.

---

### Step 4: Set Environment Variable

In Vercel dashboard:

1. Go to **Project Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://wp.instant.tw`
   - **Environment**: Select all (Production, Preview, Development)
3. Click **Save**
4. **Redeploy** the project for changes to take effect

---

### Step 5: Verify Deployment

Wait 5-10 minutes for DNS propagation, then test:

✅ Visit: **https://wp.instant.tw**
✅ Check HTTPS is working (green padlock)
✅ Test all pages:
   - https://wp.instant.tw/plugins
   - https://wp.instant.tw/pricing
   - https://wp.instant.tw/privacy

---

## ⚠️ Important: Plugin Download URLs

### Current Setup Issue

Currently, all "Get Plugin" buttons link to `wp.instant.tw/{shortcode}`:
- wp.instant.tw/imo (Image Optimizer)
- wp.instant.tw/ium (Uptime Monitor)
- etc.

But `wp.instant.tw` is now your marketplace site!

### Solution Options

#### Option 1: Use Different Subdomain for Downloads (RECOMMENDED)

Change plugin download URLs to a different subdomain:

**Examples:**
- `downloads.instant.tw/{shortcode}`
- `plugins.instant.tw/{shortcode}`
- `store.instant.tw/{shortcode}`

**To implement:**
1. Decide on subdomain (e.g., `downloads.instant.tw`)
2. Update plugin URLs in code (I'll show you how below)
3. Set up that subdomain with your WordPress site

#### Option 2: Use URL Paths

Keep `wp.instant.tw` but use different paths:
- Marketplace: `wp.instant.tw/` (root)
- Downloads: `wp.instant.tw/download/imo`, `wp.instant.tw/download/ium`, etc.

**To implement:**
1. Update plugin URLs to use `/download/` prefix
2. Configure WordPress on same subdomain with different path

#### Option 3: Use Main Domain for Downloads

- Marketplace: `wp.instant.tw`
- Downloads: `instant.tw/plugins/imo`, `instant.tw/plugins/ium`, etc.

**To implement:**
1. Update plugin URLs to point to main domain
2. Set up plugin downloads on main domain

---

## 🔧 Updating Plugin Download URLs

If you choose **Option 1** (recommended), let's update to `downloads.instant.tw`:

### Update Plugin Data File

Edit the plugin URLs in your local source folder:

**File:** `C:\Users\PIETER\Downloads\wp-website\config\plugins-data.ts`

Find and replace all `wp.instant.tw` with `downloads.instant.tw`:

```typescript
// Before:
productUrl: "https://wp.instant.tw/imo"

// After:
productUrl: "https://downloads.instant.tw/imo"
```

Or use this command in your source folder:

```bash
# Windows (PowerShell)
cd C:\Users\PIETER\Downloads\wp-website
(Get-Content config/plugins-data.ts) -replace 'wp\.instant\.tw', 'downloads.instant.tw' | Set-Content config/plugins-data.ts
```

Then rebuild and redeploy:
```bash
npm run build
vercel --prod
```

---

## 📊 Complete Setup Example

### Recommended Architecture:

```
instant.tw                    → Your other project (main website)
wp.instant.tw                 → This WordPress plugin marketplace
downloads.instant.tw          → Actual WordPress plugin downloads
```

### DNS Configuration:

```dns
# Your other project (on Vercel or elsewhere)
instant.tw                    → CNAME → your-other-project.vercel.app

# This marketplace
wp.instant.tw                 → CNAME → cname.vercel-dns.com

# Plugin downloads (WordPress site)
downloads.instant.tw          → A → your-wordpress-server-ip
```

### URL Structure:

```
# Marketplace
https://wp.instant.tw                              → Homepage
https://wp.instant.tw/plugins                      → All plugins
https://wp.instant.tw/plugins/instant-image-optimizer → Plugin detail

# Downloads (WordPress)
https://downloads.instant.tw/imo                   → Download Image Optimizer
https://downloads.instant.tw/ium                   → Download Uptime Monitor
... etc
```

---

## 🔄 Complete Deployment Process

### 1. Deploy Marketplace to wp.instant.tw

```bash
cd C:\Users\PIETER\Downloads\instant-tw-deployment
vercel
# In Vercel dashboard: Add domain "wp.instant.tw"
# Configure DNS: CNAME wp → cname.vercel-dns.com
```

### 2. Set Up Download Subdomain

```bash
# Option A: New subdomain
# Add DNS: CNAME downloads → your-wordpress-server-ip
# Install WordPress on downloads.instant.tw

# Option B: Use existing subdomain/path
# Configure WordPress on your existing server
```

### 3. Update Plugin URLs (if needed)

If using different subdomain for downloads:
```bash
cd C:\Users\PIETER\Downloads\wp-website
# Update config/plugins-data.ts (change wp.instant.tw URLs)
npm run build
vercel --prod
```

---

## ✅ Verification Checklist

After deployment:

- [ ] https://wp.instant.tw loads correctly
- [ ] HTTPS working (green padlock)
- [ ] All pages accessible:
  - [ ] /plugins
  - [ ] /pricing
  - [ ] /privacy
  - [ ] /terms
  - [ ] /refund-policy
- [ ] "Get Plugin" buttons link to correct download URLs
- [ ] Currency switcher works
- [ ] Language switcher works
- [ ] Chatbot works
- [ ] Mobile responsive
- [ ] DNS fully propagated (test: https://dnschecker.org)

---

## 🐛 Troubleshooting

### DNS Not Propagating

**Issue:** wp.instant.tw doesn't load

**Solution:**
1. Wait 10-30 minutes for DNS propagation
2. Check DNS with: https://dnschecker.org (enter "wp.instant.tw")
3. Clear browser cache (Ctrl+F5)
4. Try incognito mode

### SSL Certificate Error

**Issue:** "Not secure" or certificate error

**Solution:**
1. Wait for Vercel to issue SSL (usually 5 minutes)
2. Check domain is correctly added in Vercel
3. Ensure DNS is pointed correctly
4. Redeploy if needed

### Wrong Base URL

**Issue:** Links point to instant.tw instead of wp.instant.tw

**Solution:**
1. Check environment variable in Vercel
2. Set `NEXT_PUBLIC_SITE_URL=https://wp.instant.tw`
3. Redeploy project

### 404 Errors

**Issue:** Some pages show 404

**Solution:**
1. Check if build was successful
2. Redeploy with: `vercel --prod`
3. Check Vercel build logs

---

## 📞 Need Help?

### Common Questions

**Q: Can I use both instant.tw and wp.instant.tw on Vercel?**
A: Yes! You can deploy different projects to different domains/subdomains on Vercel. Just make sure they're separate projects.

**Q: Will the subdomain cost extra on Vercel?**
A: No! Custom domains (including subdomains) are free on Vercel, even on the free tier.

**Q: How do I change the plugin download URLs later?**
A: Update `config/plugins-data.ts`, rebuild (`npm run build`), and redeploy (`vercel --prod`).

**Q: Can I use Cloudflare with Vercel subdomain?**
A: Yes! But you'll need to use CNAME setup and may need to configure Cloudflare proxy settings.

---

## 🎉 Done!

Your WordPress Plugin Marketplace is now live at **https://wp.instant.tw**!

### Next Steps:

1. ✅ Set up plugin download subdomain (downloads.instant.tw)
2. ✅ Update plugin URLs if using different subdomain
3. ✅ Test all functionality
4. ✅ Monitor analytics
5. ✅ Promote your marketplace!

---

**Deployment Location:** Vercel  
**Marketplace URL:** https://wp.instant.tw  
**Status:** 🚀 Live

Good luck with your marketplace! 🎊
