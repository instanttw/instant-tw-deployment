# Deployment Guide - Two-Site Architecture

## 🏗️ Architecture Overview

```
wp.instant.tw (VPS - Static)
├── Cookie consent modal
├── Header (links to dash.instant.tw)
├── Public pages (home, plugins, pricing, services)
└── NO authentication, NO dashboard

dash.instant.tw (Vercel - Dynamic)
├── Cookie consent modal
├── Full authentication (NextAuth)
├── Login/Signup pages
├── Dashboard (8 tabs)
└── User management
```

---

## 📦 Deployment Strategy

### **Option 1: Deploy dash.instant.tw (Vercel) - RECOMMENDED FIRST**

This contains the dashboard and authentication:

```powershell
cd C:\Users\Pieter\Downloads\instant-tw-deployment

# Make sure next.config.ts does NOT have output: 'export'
# Current config is correct

vercel --prod
```

**What gets deployed:**
- ✅ Full dashboard (all 8 tabs)
- ✅ Authentication system
- ✅ Login/Signup pages
- ✅ Cookie consent
- ✅ API routes

**URL:** `https://dash.instant.tw`

---

### **Option 2: Build for wp.instant.tw (VPS Static)**

This creates the /out folder for your VPS:

#### Step 1: Update next.config.ts

**Add this line:**
```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // ← ADD THIS LINE
  
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
};

export default nextConfig;
```

#### Step 2: Build Static Site

```powershell
npm run build
```

This creates the `/out` folder.

#### Step 3: Upload to VPS

**Upload contents of `/out` folder to:**
```
/domains/wp.instant.tw/public_html/
```

**Methods:**
- FileZilla/FTP
- DirectAdmin File Manager
- SCP/SFTP

#### Step 4: Restore Dynamic Config

**Remove the output line:**
```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NO output: 'export' here
  
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
};

export default nextConfig;
```

**What wp.instant.tw will have:**
- ✅ Cookie consent (works client-side)
- ✅ Header with avatar → Redirects to dash.instant.tw/login
- ✅ All public content
- ❌ Dashboard (only on dash.instant.tw)
- ❌ Authentication (only on dash.instant.tw)

---

## 🔄 Header Behavior

The header is now **smart** and detects which domain it's on:

### On wp.instant.tw (Static):
```javascript
Click Avatar → window.location.href = 'https://dash.instant.tw/login'
```

### On dash.instant.tw (Dynamic):
```javascript
Click Avatar → router.push('/login') // or '/dashboard' if logged in
```

This is handled automatically by the code!

---

## ✅ Testing Checklist

### Test dash.instant.tw (Vercel):
- [ ] Visit https://dash.instant.tw
- [ ] Cookie consent appears (accept it)
- [ ] Click avatar → Goes to /login
- [ ] Login with test account
- [ ] Click avatar → Goes to /dashboard
- [ ] All 8 dashboard tabs work
- [ ] Sign out works

### Test wp.instant.tw (VPS Static):
- [ ] Visit https://wp.instant.tw
- [ ] Cookie consent appears (accept it)
- [ ] Refresh → Cookie consent does NOT reappear
- [ ] Click avatar → Redirects to dash.instant.tw/login
- [ ] All pages load (home, plugins, pricing, services)
- [ ] Navigation works
- [ ] Mobile menu works

---

## 🎯 Recommended Deployment Order

1. **First:** Deploy to Vercel (dash.instant.tw)
   - This gets authentication live
   - Users can login at dash.instant.tw
   
2. **Second:** Build and upload to VPS (wp.instant.tw)
   - This gets the marketing site updated
   - Avatar now links to dash.instant.tw

---

## 🔑 Environment Variable

You can optionally set this in Vercel:

```
NEXT_PUBLIC_DASHBOARD_URL=https://dash.instant.tw
```

This allows the header to know where to redirect users.

**If not set:** Defaults to `https://dash.instant.tw` (which is correct)

---

## 🚨 Common Issues

### Issue: "Dashboard doesn't work on wp.instant.tw"
**Solution:** That's correct! Dashboard only works on dash.instant.tw (Vercel). wp.instant.tw is static.

### Issue: "Cookie consent appears every time on static site"
**Solution:** Make sure cookies are enabled in browser and site is served over HTTPS.

### Issue: "Avatar doesn't redirect properly"
**Solution:** Clear browser cache. The updated header should redirect to dash.instant.tw.

---

## 📝 Summary

**Two separate deployments:**

| Feature | wp.instant.tw (VPS) | dash.instant.tw (Vercel) |
|---------|---------------------|--------------------------|
| Cookie Consent | ✅ Yes | ✅ Yes |
| Public Pages | ✅ Yes | ❌ No |
| Login/Signup | ❌ No (redirects) | ✅ Yes |
| Dashboard | ❌ No | ✅ Yes |
| Authentication | ❌ No | ✅ Yes |
| Deployment | `/out` folder upload | `vercel --prod` |

---

## 🎊 You're Ready!

**Start with Vercel (easier):**
```powershell
vercel --prod
```

**Then build for VPS when ready:**
```powershell
# 1. Add output: 'export' to next.config.ts
# 2. npm run build
# 3. Upload /out folder
# 4. Remove output: 'export' from next.config.ts
```

Both sites will work seamlessly together! 🚀
