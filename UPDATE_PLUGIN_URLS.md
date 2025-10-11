# Update Plugin Download URLs - Quick Guide

## ⚠️ IMPORTANT: Plugin URL Conflict

Since you're deploying the marketplace to **wp.instant.tw**, your plugin buttons currently link to **wp.instant.tw/{shortcode}**, which would link to themselves!

You need to choose where actual plugin downloads will be hosted.

---

## 🎯 Recommended Solution

Use a different subdomain for downloads:

**Example:**
- **Marketplace**: `https://wp.instant.tw` (this project)
- **Downloads**: `https://downloads.instant.tw` (your WordPress plugin site)

---

## 🔧 Quick Update Steps

### Step 1: Choose Download Subdomain

Pick one:
- `downloads.instant.tw` ⭐ (recommended)
- `plugins.instant.tw`
- `store.instant.tw`

### Step 2: Update Plugin URLs

**Option A - Automated (PowerShell):**

```powershell
cd C:\Users\PIETER\Downloads\wp-website

# Replace wp.instant.tw with downloads.instant.tw
(Get-Content config/plugins-data.ts) -replace 'wp\.instant\.tw', 'downloads.instant.tw' | Set-Content config/plugins-data.ts
```

**Option B - Manual:**
Edit `config/plugins-data.ts` and change all:
```typescript
productUrl: "https://wp.instant.tw/imo"
```
To:
```typescript
productUrl: "https://downloads.instant.tw/imo"
```

### Step 3: Rebuild

```bash
cd C:\Users\PIETER\Downloads\wp-website
npm run build
```

### Step 4: Update Deployment Package

```powershell
robocopy "C:\Users\PIETER\Downloads\wp-website\.next" "C:\Users\PIETER\Downloads\instant-tw-deployment\.next" /E

Copy-Item "C:\Users\PIETER\Downloads\wp-website\config\plugins-data.ts" "C:\Users\PIETER\Downloads\instant-tw-deployment\config\" -Force
```

### Step 5: Redeploy

```bash
cd C:\Users\PIETER\Downloads\instant-tw-deployment
vercel --prod
```

---

## 🌐 Set Up Download Subdomain

Add DNS record for downloads subdomain:

```
Type:  A (or CNAME)
Name:  downloads
Value: Your-WordPress-Server-IP
TTL:   3600
```

Then set up WordPress on downloads.instant.tw with short URL redirects.

---

## ✅ Final Structure

```
instant.tw           → Your other project
wp.instant.tw        → This marketplace (Vercel)
downloads.instant.tw → Plugin downloads (WordPress)
```

See **SUBDOMAIN_DEPLOYMENT.md** for complete details!
