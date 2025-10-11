# Deploy to VPS Subdomain Without Terminal Access

## 🎯 Overview

This guide shows you how to deploy your WordPress Plugin Marketplace to **wp.instant.tw** on your existing VPS **without needing SSH/terminal access**.

**Method:** Export as static files, upload via FTP/File Manager

**Requirements:**
- FTP access to your VPS (or File Manager in cPanel/control panel)
- Ability to create subdomain in control panel
- Web server (Apache/Nginx) already running

---

## 🚀 Quick Overview

```
Step 1: Export static files locally (on your computer)
Step 2: Create subdomain wp.instant.tw in VPS control panel
Step 3: Upload files via FTP/File Manager
Step 4: Configure subdomain to point to uploaded folder
Done! ✅
```

---

## 📝 Detailed Steps

### Step 1: Export as Static Files (On Your Computer)

#### 1.1: Update Next.js Configuration

**File:** `C:\Users\PIETER\Downloads\wp-website\next.config.ts`

**Replace entire file with:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
```

**What this does:**
- `output: 'export'` → Generate static HTML files
- `images: { unoptimized: true }` → Use regular img tags (no Next.js image optimization)
- `trailingSlash: true` → Add trailing slash to URLs (better compatibility)

---

#### 1.2: Update Environment Variables

**File:** `C:\Users\PIETER\Downloads\wp-website\.env.production`

Create this file if it doesn't exist:

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://wp.instant.tw
```

---

#### 1.3: Build Static Export

Open terminal/PowerShell on your computer:

```bash
cd C:\Users\PIETER\Downloads\wp-website

# Install dependencies (if not done)
npm install

# Build static export
npm run build
```

**Expected output:**
```
✓ Generating static pages
✓ Collecting page data
✓ Finalizing page optimization
✓ Export successful!
```

---

#### 1.4: Verify Export

Check that the `out` folder was created:

```
C:\Users\PIETER\Downloads\wp-website\out\
```

This folder contains all static files ready to upload! ✅

---

### Step 2: Create Subdomain on VPS

#### Option A: cPanel

1. **Login to cPanel**
2. Go to **"Domains"** or **"Subdomains"**
3. Click **"Create A New Domain"** or **"Create Subdomain"**
4. Enter:
   - **Subdomain:** `wp`
   - **Domain:** `instant.tw` (should auto-fill)
   - **Document Root:** `/public_html/wp` (or custom path)
5. Click **"Create"**

---

#### Option B: Plesk

1. **Login to Plesk**
2. Go to **"Websites & Domains"**
3. Click **"Add Subdomain"**
4. Enter:
   - **Subdomain name:** `wp`
   - **Document root:** Create new folder (e.g., `/wp`)
5. Click **"OK"**

---

#### Option C: Other Control Panel

1. Find **"Domains"** or **"Subdomains"** section
2. Add new subdomain: `wp.instant.tw`
3. Set document root to a new folder
4. Save

**Note the document root path** (e.g., `/public_html/wp` or `/home/username/public_html/wp`)

---

### Step 3: Upload Files to VPS

#### Option A: FTP Client (FileZilla, WinSCP)

**Recommended: FileZilla (Free)**

1. **Download FileZilla:** https://filezilla-project.org/

2. **Connect to your VPS:**
   - Host: Your VPS IP or domain
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21 (or 22 for SFTP)

3. **Navigate to subdomain folder:**
   - Remote site: `/public_html/wp` (or your document root)
   - Local site: `C:\Users\PIETER\Downloads\wp-website\out`

4. **Upload all files:**
   - Select all files/folders in the `out` folder
   - Drag to remote folder
   - Wait for upload to complete (may take 5-10 minutes)

---

#### Option B: cPanel File Manager

1. **Login to cPanel**
2. Click **"File Manager"**
3. Navigate to subdomain folder (e.g., `/public_html/wp`)
4. Click **"Upload"** button
5. Select all files from: `C:\Users\PIETER\Downloads\wp-website\out`
6. Upload (or use zip option below for faster upload)

**Faster Method (Recommended):**

1. **On your computer, compress the out folder:**
   - Right-click `out` folder
   - Send to → Compressed (zipped) folder
   - Name it `wp-marketplace.zip`

2. **Upload zip to cPanel:**
   - Go to File Manager
   - Navigate to subdomain folder
   - Upload `wp-marketplace.zip`
   - Right-click → Extract
   - Delete zip file after extraction

---

### Step 4: Configure Subdomain

#### 4.1: Check File Structure

Your subdomain folder should have:

```
/public_html/wp/
├── index.html
├── plugins/
├── pricing/
├── privacy/
├── terms/
├── _next/
├── favicon.ico
└── ... other files
```

---

#### 4.2: Create .htaccess (Apache Servers)

If your VPS uses **Apache**, create this file to handle routing:

**File:** `/public_html/wp/.htaccess`

```apache
# Enable rewrite engine
RewriteEngine On

# Serve index.html for directory requests
DirectoryIndex index.html

# Handle trailing slashes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.+)/$ /$1 [R=301,L]

# Serve .html files without extension
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]

# Custom error pages
ErrorDocument 404 /404.html

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
</IfModule>
```

**How to create .htaccess:**
1. In cPanel File Manager → Create new file → Name it `.htaccess`
2. Or upload from your computer
3. Paste the content above
4. Save

---

#### 4.3: Nginx Configuration (If applicable)

If your VPS uses **Nginx**, you'll need to add this to your nginx config:

**File:** `/etc/nginx/sites-available/wp.instant.tw` (or in main config)

```nginx
server {
    listen 80;
    server_name wp.instant.tw;
    
    root /path/to/public_html/wp;
    index index.html;
    
    location / {
        try_files $uri $uri.html $uri/ =404;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Note:** If you don't have terminal access, ask your hosting provider to add this configuration for you.

---

### Step 5: Install SSL Certificate

#### Option A: cPanel with AutoSSL

1. Login to cPanel
2. Go to **"SSL/TLS Status"**
3. Find `wp.instant.tw` in the list
4. Click **"Run AutoSSL"**
5. Wait for certificate to be issued (1-5 minutes)

---

#### Option B: Let's Encrypt via Control Panel

1. Find **"SSL/TLS"** or **"Let's Encrypt"** in your control panel
2. Add certificate for `wp.instant.tw`
3. Enable auto-renewal

---

#### Option C: Ask Hosting Provider

If you can't find SSL options:
1. Contact your hosting support
2. Ask them to install Let's Encrypt SSL for `wp.instant.tw`
3. Most hosting providers do this for free

---

### Step 6: Verify Deployment

Wait 5-10 minutes for DNS propagation, then test:

✅ **Visit:** https://wp.instant.tw
✅ **Check HTTPS:** Green padlock in browser
✅ **Test pages:**
   - https://wp.instant.tw/plugins/
   - https://wp.instant.tw/pricing/
   - https://wp.instant.tw/privacy/
   - https://wp.instant.tw/terms/

✅ **Test buttons:**
   - Click "Get Plugin" buttons
   - Verify they open Google Drive or Stripe links
   - Check they open in new tab

---

## 🔧 Troubleshooting

### Issue: Pages show 404

**Cause:** Missing .htaccess or incorrect routing

**Solution:**
1. Check .htaccess file exists
2. Make sure trailing slashes are in URLs
3. Try accessing with .html extension: `/plugins/index.html`

---

### Issue: Images not loading

**Cause:** Incorrect path or missing files

**Solution:**
1. Check all files were uploaded from `out` folder
2. Verify `_next` folder exists
3. Check browser console for errors (F12)

---

### Issue: Styles not applied

**Cause:** CSS files not uploaded or cached

**Solution:**
1. Clear browser cache (Ctrl+F5)
2. Check `_next/static/css` folder exists
3. Check .htaccess allows .css files

---

### Issue: Subdomain doesn't load

**Cause:** DNS not propagated or misconfigured

**Solution:**
1. Wait 10-30 minutes for DNS propagation
2. Check subdomain is properly created in control panel
3. Verify document root path is correct
4. Test with: https://dnschecker.org

---

### Issue: SSL not working

**Cause:** Certificate not installed

**Solution:**
1. Check SSL is enabled for subdomain in control panel
2. Run AutoSSL or Let's Encrypt
3. Contact hosting support if needed

---

## 📊 File Structure on VPS

After upload, your VPS should look like this:

```
/home/username/public_html/
├── instant.tw/               (Your main site)
│   └── ... main site files
│
└── wp/                       (Your marketplace)
    ├── index.html           (Homepage)
    ├── plugins/
    │   ├── index.html
    │   ├── instant-image-optimizer/
    │   │   └── index.html
    │   └── ... other plugins
    ├── pricing/
    │   └── index.html
    ├── privacy/
    │   └── index.html
    ├── terms/
    │   └── index.html
    ├── _next/
    │   ├── static/
    │   │   ├── css/
    │   │   └── js/
    │   └── ...
    ├── favicon.ico
    └── .htaccess
```

---

## ✅ Checklist

Before uploading:
- [ ] Updated `next.config.ts` with `output: 'export'`
- [ ] Created `.env.production` with correct URL
- [ ] Ran `npm run build` successfully
- [ ] `out` folder created with all files

On VPS:
- [ ] Created subdomain `wp.instant.tw`
- [ ] Noted document root path
- [ ] Uploaded all files from `out` folder
- [ ] Created `.htaccess` file (Apache)
- [ ] Installed SSL certificate
- [ ] Verified all pages load correctly

---

## 🎯 Update Process

When you need to update your site:

1. **Make changes locally:**
   ```bash
   cd C:\Users\PIETER\Downloads\wp-website
   # Make your changes
   ```

2. **Rebuild:**
   ```bash
   npm run build
   ```

3. **Upload new files:**
   - Delete old files on VPS (except .htaccess)
   - Upload new `out` folder contents
   - Or upload as zip and extract

4. **Clear cache:**
   - Clear browser cache
   - May need to clear server cache if enabled

---

## 💡 Pro Tips

### Faster Updates

Instead of deleting all files, only replace:
- `_next/static/` folder (contains code changes)
- Individual page folders you modified
- Keep .htaccess unchanged

---

### Backup

Before major updates:
1. Download current live files
2. Keep local backup
3. Can restore if needed

---

### Performance

Your site will be fast because:
- ✅ Static files (no server processing)
- ✅ Browser caching enabled
- ✅ Gzip compression
- ✅ Minimal server load

---

### Monitoring

Check these regularly:
- SSL certificate expiry (usually auto-renews)
- Disk space usage
- Access logs for errors

---

## 🚀 Advantages of Static Export

### vs Running Node.js:
- ✅ No Node.js required on server
- ✅ No terminal access needed
- ✅ Faster page loads
- ✅ Lower server resource usage
- ✅ Works on any web hosting
- ✅ More secure (no server-side code)
- ✅ Easier to manage

### Trade-offs:
- ⚠️ No server-side rendering (SSR)
- ⚠️ No API routes (use external services)
- ⚠️ Need to rebuild for content changes

**For your use case:** Perfect! ✅
- You're using Google Drive for files
- You're using Stripe for payments
- Content is mostly static
- No backend needed

---

## 📞 If You Need Help

**Can't create subdomain?**
→ Contact your hosting provider support

**Can't upload files?**
→ Check FTP credentials or use File Manager

**SSL issues?**
→ Ask hosting support to install Let's Encrypt

**Site not loading?**
→ Check document root path is correct

---

## 🎉 Done!

Your WordPress Plugin Marketplace is now live at:
**https://wp.instant.tw**

Hosted on your VPS alongside instant.tw, no terminal access needed! 🚀

---

## 📋 Quick Reference

```bash
# LOCAL COMMANDS (on your computer):

# 1. Update config for static export
# Edit next.config.ts (add output: 'export')

# 2. Build
cd C:\Users\PIETER\Downloads\wp-website
npm run build

# 3. The 'out' folder is generated
# Upload everything inside 'out' to VPS

# VPS ACTIONS (via control panel):

# 1. Create subdomain: wp.instant.tw
# 2. Upload files to document root
# 3. Create .htaccess
# 4. Install SSL
# 5. Test!
```

**All done without terminal access!** ✅
