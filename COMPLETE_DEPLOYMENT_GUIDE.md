# 🚀 COMPLETE DEPLOYMENT GUIDE - Option 1

## Your Perfect Architecture

```
instant.tw (Main)
    ↓
    ├── wp.instant.tw (WordPress Marketplace - Static)
    │   - Upload /out folder as before
    │   - Fast & simple
    │
    └── dash.instant.tw (Dashboard - Vercel)
        - Authentication for ALL domains
        - User accounts
        - Dashboard
```

---

## 📋 What You'll Do

### **Part 1: Deploy dash.instant.tw (Authentication Hub)**
- Deploy to Vercel (FREE)
- Handles all authentication
- Works for all subdomains

### **Part 2: Restore wp.instant.tw (Static Site)**
- Get /out folder back
- Upload to server as before
- Links to dash.instant.tw for auth

---

## 🎯 QUICK START

### **Step 1: Deploy Dashboard to Vercel**

**Follow this guide:** `DEPLOY_TO_VERCEL.md`

**Summary:**
1. Get your VPS IP address
2. Update `.env.dash` with VPS IP
3. Enable remote MySQL access
4. Deploy to Vercel: `vercel`
5. Add environment variables in Vercel dashboard
6. Add custom domain: dash.instant.tw
7. Update DNS: Add CNAME record

**Time:** 10-15 minutes

---

### **Step 2: Restore Static Site for wp.instant.tw**

**Follow this guide:** `RESTORE_STATIC_WP_SITE.md`

**Summary:**
1. Update `next.config.ts` - add `output: 'export'`
2. Build: `npm run build`
3. `/out` folder returns!
4. Upload to server as before

**Time:** 5 minutes

---

## 📝 Quick Command Reference

**Build static site (wp.instant.tw):**
```powershell
cd C:\Users\PIETER\Downloads\instant-tw-deployment
npm run build
# Upload /out folder to server
```

**Deploy dashboard (dash.instant.tw):**
```powershell
cd C:\Users\PIETER\Downloads\instant-tw-deployment
vercel --prod
```

---

## ✅ After Deployment

**wp.instant.tw:**
- ✅ Static site (upload /out folder)
- ✅ Fast and simple
- ✅ Auth buttons link to dash.instant.tw

**dash.instant.tw:**
- ✅ Full authentication
- ✅ User dashboard
- ✅ Works for all domains

**Users can:**
- Browse plugins at wp.instant.tw (fast static site)
- Login at dash.instant.tw (secure authentication)
- Manage account at dash.instant.tw/dashboard
- Same account works everywhere!

---

## 🎉 Perfect Setup!

This is the **BEST** architecture:
- ✅ Simple static site deployment
- ✅ Powerful authentication on Vercel
- ✅ FREE hosting for dashboard
- ✅ Scalable and professional
- ✅ Industry best practice

---

## 📚 Detailed Guides

1. **`ARCHITECTURE_SETUP.md`** - Understand the architecture
2. **`DEPLOY_TO_VERCEL.md`** - Deploy dashboard (15 min)
3. **`RESTORE_STATIC_WP_SITE.md`** - Restore /out folder (5 min)
4. **`.env.dash`** - Environment variables for dashboard

---

## 🆘 Need Help?

**Common Issues:**

**1. Database connection error:**
- Check VPS IP in DATABASE_URL
- Enable remote MySQL access
- Test: `mysql -h VPS_IP -u admin_wpinstant -p`

**2. Domain not working:**
- Wait for DNS propagation (5-60 minutes)
- Check CNAME record: dash → cname.vercel-dns.com

**3. /out folder not created:**
- Make sure `output: 'export'` is in next.config.ts
- Run: `npm run build`

---

## ✅ Deployment Checklist

**Dashboard (dash.instant.tw):**
- [ ] Updated .env.dash with VPS IP
- [ ] Enabled remote MySQL access
- [ ] Deployed to Vercel
- [ ] Added environment variables
- [ ] Added custom domain
- [ ] Updated DNS (CNAME)
- [ ] SSL certificate issued (automatic)
- [ ] Tested signup/login

**Static Site (wp.instant.tw):**
- [ ] Added `output: 'export'` to next.config.ts
- [ ] Built project: `npm run build`
- [ ] /out folder created
- [ ] Uploaded to server
- [ ] Tested website loads
- [ ] Auth buttons link to dash.instant.tw

---

## 🎊 You're Ready to Go!

Follow the guides in order:
1. `DEPLOY_TO_VERCEL.md` - Set up dashboard
2. `RESTORE_STATIC_WP_SITE.md` - Restore static site

**Everything is documented and ready!** 🚀
