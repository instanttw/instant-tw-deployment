# 🔄 Restore Static Build for wp.instant.tw

Keep wp.instant.tw as a simple static site with /out folder!

---

## 🎯 What We're Doing

**Restore static export** so you can:
- ✅ Build creates `/out` folder again
- ✅ Upload to server via FTP/File Manager
- ✅ Keep your simple deployment workflow
- ✅ Authentication handled by dash.instant.tw

---

## 📝 STEP-BY-STEP

### **STEP 1: Update next.config.ts**

Open: `C:\Users\PIETER\Downloads\instant-tw-deployment\next.config.ts`

**Change from:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export removed to enable server-side features
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
};

export default nextConfig;
```

**To:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // ← Add this back for static export
  
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
};

export default nextConfig;
```

---

### **STEP 2: Update Auth Modal to Link to dash.instant.tw**

**File:** `components/auth/auth-modal.tsx`

Find the form submission handlers and update them to redirect to dash.instant.tw:

**At the top of the file, add:**
```typescript
const DASHBOARD_URL = 'https://dash.instant.tw';
```

**Update the signup success message:**
```typescript
// After successful signup
setSuccess('Account created! Redirecting to dashboard...');
setTimeout(() => {
  window.location.href = `${DASHBOARD_URL}/login`;
}, 1500);
```

**Update the login success:**
```typescript
// After successful login
window.location.href = `${DASHBOARD_URL}/dashboard`;
```

**OR simpler:** Just make the buttons link directly to dash.instant.tw:

Replace the entire auth modal functionality with redirect links:

```typescript
// In header.tsx, update the user avatar button:
<Button 
  onClick={() => window.location.href = 'https://dash.instant.tw/login'}
  variant="ghost" 
  size="icon"
>
  <User className="h-5 w-5" />
</Button>
```

---

### **STEP 3: Build Static Site**

```powershell
cd C:\Users\PIETER\Downloads\instant-tw-deployment

# Build
npm run build
```

**You'll see:**
```
✓ Generating static pages
✓ Exporting (2/2)
```

**The `/out` folder is back!** ✅

---

### **STEP 4: Upload /out Folder to Your Server**

**As you've been doing before:**

1. **Using FileZilla/FTP:**
   - Connect to your VPS
   - Navigate to: `/domains/wp.instant.tw/public_html/`
   - Upload contents of `/out` folder

2. **Or using DirectAdmin File Manager:**
   - Login to DirectAdmin
   - Go to File Manager
   - Navigate to wp.instant.tw folder
   - Upload /out folder contents

---

### **STEP 5: Test wp.instant.tw**

1. Visit: **https://wp.instant.tw**
2. Browse plugins, pricing (works as before) ✅
3. Click "Sign In" button
4. Should redirect to: **https://dash.instant.tw/login**
5. Login there
6. Dashboard opens at: **https://dash.instant.tw/dashboard** ✅

---

## 🎯 Alternative: Simple Link Approach

**Even simpler:** Just make auth buttons link to dash.instant.tw

**Update header.tsx:**

```typescript
// Replace auth modal with direct link
<Link href="https://dash.instant.tw/login">
  <Button variant="ghost" size="icon">
    <User className="h-5 w-5" />
  </Button>
</Link>
```

**Benefits:**
- ✅ No modal needed
- ✅ Direct to dashboard
- ✅ Cleaner separation
- ✅ Faster for users

---

## 📊 Final Structure

### **wp.instant.tw (Static Site)**
```
/out/
├── index.html           ← Homepage
├── plugins/             ← Plugin pages
├── pricing/             ← Pricing
├── about/               ← About page
├── contact/             ← Contact
└── ...                  ← All static pages
```

**Upload this to your server as before!**

### **dash.instant.tw (Vercel - Dynamic)**
```
Authentication + Dashboard
- /login
- /signup  
- /dashboard
- API routes
```

**Already deployed on Vercel!**

---

## ✅ Benefits

**For wp.instant.tw:**
- ✅ Static HTML (super fast)
- ✅ Simple deployment (upload /out folder)
- ✅ No server management
- ✅ Easy updates

**For dash.instant.tw:**
- ✅ Full authentication
- ✅ Vercel handles everything
- ✅ Scales automatically
- ✅ Free SSL, CDN

**For Users:**
- ✅ Fast browsing on wp.instant.tw
- ✅ Secure login at dash.instant.tw
- ✅ Seamless experience
- ✅ One account for everything

---

## 🔄 Your Workflow Going Forward

### **Updating wp.instant.tw Content:**

1. Edit content in your project
2. Build: `npm run build`
3. Upload `/out` folder to server
4. Done! ✅

### **Updating dash.instant.tw:**

1. Make changes in your project
2. Deploy: `vercel --prod`
3. Done! ✅

---

## 🎉 Perfect Setup!

You now have:
- ✅ Fast static site (wp.instant.tw)
- ✅ Powerful dashboard (dash.instant.tw)
- ✅ Simple deployment for both
- ✅ Best of both worlds!

---

## 📝 Quick Commands

**Build static site:**
```powershell
cd C:\Users\PIETER\Downloads\instant-tw-deployment
npm run build
# Upload /out folder
```

**Update dashboard:**
```powershell
cd C:\Users\PIETER\Downloads\instant-tw-deployment  
vercel --prod
```

---

🎊 **wp.instant.tw is back to simple static deployment!** 🎊
