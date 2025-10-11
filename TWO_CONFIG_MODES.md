# 🔄 Two Configuration Modes

Your `next.config.ts` needs different settings for different deployments:

---

## 🎯 **For dash.instant.tw (Vercel) - DYNAMIC**

**Configuration:**
```typescript
const nextConfig: NextConfig = {
  // NO output: 'export' - needs dynamic features!
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

**Deploy:**
```powershell
vercel
```

**Result:** Full authentication, dashboard, API routes work ✅

---

## 📁 **For wp.instant.tw (Static) - STATIC**

**Configuration:**
```typescript
const nextConfig: NextConfig = {
  output: 'export',  // Add this line!
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

**Build:**
```powershell
npm run build
# Creates /out folder
```

**Result:** Static HTML files to upload ✅

---

## 🔄 **Workflow:**

### **When deploying to Vercel (dash.instant.tw):**
1. Make sure `output: 'export'` is **REMOVED**
2. Run: `vercel`
3. Done!

### **When building for server (wp.instant.tw):**
1. **ADD** `output: 'export'` to config
2. Run: `npm run build`
3. Upload `/out` folder
4. **REMOVE** `output: 'export'` again

---

## 💡 **Pro Tip:**

Keep it without `output: 'export'` by default (for Vercel).

Only add it temporarily when you need to build the static site.

---

## ✅ **Current Configuration:**

I've updated it to **dynamic mode** (no output: 'export') for dash.instant.tw deployment.

When you need to build wp.instant.tw later, temporarily add `output: 'export'` back.

---

This is normal when you have both static and dynamic deployments! 🎯
