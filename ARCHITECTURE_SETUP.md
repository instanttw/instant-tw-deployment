# 🏗️ Your Multi-Domain Architecture

Perfect setup! Here's your domain structure:

---

## 🌐 Domain Architecture

```
┌─────────────────────────────────────────────────────────┐
│ instant.tw (Main Project - Parent Domain)              │
│ - Main company website                                  │
│ - Overview of all services                              │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────┐
        ↓                                     ↓
┌──────────────────────┐          ┌──────────────────────┐
│ wp.instant.tw        │          │ dash.instant.tw      │
│ WordPress Marketplace│          │ Unified Dashboard    │
│ - Static Site        │          │ - Node.js App        │
│ - Upload /out folder │  ←──────→  │ - Authentication    │
│ - Fast & Simple      │          │ - All User Accounts  │
└──────────────────────┘          └──────────────────────┘
         ↓                                   ↑
    Browse plugins                     Login/Signup
    View pricing                       Manage account
    Static content                     Dashboard access
                                      ↓
                          Works for ALL subdomains:
                          - instant.tw users
                          - wp.instant.tw users
                          - Future subdomains
```

---

## 🎯 How It Will Work

### **wp.instant.tw (WordPress Marketplace) - STATIC**
**Current deployment method continues!**

✅ Keep using `/out` folder
✅ Upload to your server as before
✅ Fast static HTML
✅ No server-side processing needed

**Features:**
- Homepage
- Plugin catalog
- Pricing pages
- Service pages
- Blog, docs, etc.
- ALL static content

**No authentication here** - just content!

---

### **dash.instant.tw (Dashboard) - VERCEL/NODE.JS**
**Handles ALL authentication for ALL domains!**

🚀 Deployed to Vercel (FREE)
🔐 Handles authentication
👤 User accounts
📊 Dashboard for all services

**Features:**
- User signup
- User login
- Password reset
- User dashboard
- Account management
- Subscriptions
- All user-specific features

**Serves users from:**
- instant.tw
- wp.instant.tw
- Any other subdomains you add

---

## 🔄 User Flow Example

**Scenario 1: User visits WordPress Marketplace**

```
1. User visits: wp.instant.tw
   ↓
2. Browses plugins (static, fast)
   ↓
3. Clicks "Sign In" button
   ↓
4. Redirects to: dash.instant.tw/login
   ↓
5. User logs in
   ↓
6. Sees dashboard at: dash.instant.tw/dashboard
   ↓
7. Can navigate back to wp.instant.tw (logged in via cookie)
```

**Scenario 2: User from main site**

```
1. User visits: instant.tw
   ↓
2. Clicks "My Account"
   ↓
3. Redirects to: dash.instant.tw/login
   ↓
4. Same dashboard, same account!
```

---

## 📊 What Each Domain Needs

### **wp.instant.tw Configuration**

**Files needed on server:**
```
/out/             ← Static HTML files
├── index.html
├── plugins/
├── pricing/
└── ...
```

**Deployment:**
- Build: `npm run build` (creates /out folder)
- Upload: /out folder via FTP/File Manager
- Update: Just replace /out folder contents

**Auth Integration:**
- Login button → Links to `https://dash.instant.tw/login`
- Signup button → Links to `https://dash.instant.tw/signup`
- Dashboard → Links to `https://dash.instant.tw/dashboard`

---

### **dash.instant.tw Configuration**

**Deployment:**
- Platform: Vercel (FREE)
- Source: instant-tw-deployment folder
- Features: Authentication, Dashboard, API routes

**Database:**
- Connects to: admin_wpinstant on your VPS
- Uses remote MySQL connection

**Environment Variables:**
```env
NEXTAUTH_URL=https://dash.instant.tw
NEXT_PUBLIC_APP_URL=https://dash.instant.tw
DATABASE_URL=mysql://admin_wpinstant:password@your-vps-ip:3306/admin_wpinstant
NEXTAUTH_SECRET=I5oNV67vPpk4Grgr1SVvPhKoot8rJKeXYjprtwFx4V8=
```

---

## 🔐 Unified Authentication

**Single Sign-On across all domains!**

When user logs in at `dash.instant.tw`:
- Session works on `instant.tw`
- Session works on `wp.instant.tw`
- Session works on any subdomain

**How?** Share cookies across subdomains:
```javascript
// In NextAuth configuration
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      domain: '.instant.tw',  // Works for all subdomains!
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true
    }
  }
}
```

---

## 🚀 Benefits of This Architecture

### **For wp.instant.tw:**
✅ Keep simple deployment (upload /out folder)
✅ Super fast (static HTML)
✅ No server management
✅ Easy to update
✅ No downtime during dashboard maintenance

### **For dash.instant.tw:**
✅ Centralized authentication
✅ One database for all users
✅ Easy to manage
✅ Scalable (Vercel handles traffic)
✅ FREE hosting
✅ Auto SSL, CDN, scaling

### **For Users:**
✅ One account for everything
✅ Seamless experience
✅ Fast browsing on wp.instant.tw
✅ Powerful features on dash.instant.tw

---

## 📝 Implementation Plan

### **Phase 1: Setup dash.instant.tw (This Session)**
1. Configure project for dash.instant.tw
2. Deploy to Vercel
3. Setup database connection
4. Test authentication
5. Configure DNS

### **Phase 2: Update wp.instant.tw (Next)**
1. Restore static export
2. Update login buttons to link to dash.instant.tw
3. Upload /out folder as before
4. Test integration

### **Phase 3: Future Subdomains**
- All use dash.instant.tw for authentication
- Each subdomain can be static or dynamic
- Unified user experience

---

## 🎯 What We'll Do Now

1. ✅ Configure for dash.instant.tw
2. ✅ Update environment variables
3. ✅ Deploy to Vercel
4. ✅ Setup DNS for dash.instant.tw
5. ✅ Test authentication
6. ✅ Restore static build for wp.instant.tw
7. ✅ Update wp.instant.tw to link to dash.instant.tw

---

## 🌟 Perfect Architecture!

This is actually the **BEST** way to do it:

**Separation of Concerns:**
- Content sites: Static (fast, simple)
- User features: Dynamic (powerful, flexible)

**Common in production:**
- Netflix: `netflix.com` (marketing) + `www.netflix.com/browse` (app)
- Spotify: `spotify.com` (marketing) + `open.spotify.com` (app)
- Slack: `slack.com` (marketing) + `app.slack.com` (app)

**You're following industry best practices!** 🎉

---

Ready to set up dash.instant.tw on Vercel! 🚀
