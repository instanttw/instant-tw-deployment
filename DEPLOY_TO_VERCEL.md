# 🚀 Deploy dash.instant.tw to Vercel (10 Minutes)

Deploy your unified dashboard to Vercel for FREE!

---

## 📋 Prerequisites

- ✅ Vercel account (FREE) - create at https://vercel.com
- ✅ Your VPS IP address
- ✅ MySQL database (admin_wpinstant) accessible remotely

---

## 🎯 STEP-BY-STEP DEPLOYMENT

### **STEP 1: Prepare Environment Variables (2 minutes)**

1. **Find your VPS IP address:**
   - Login to DirectAdmin → Server Information
   - Or ask your hosting provider
   - Example: `123.45.67.89`

2. **Update `.env.dash` file:**
   
   Open `.env.dash` and replace:
   ```env
   DATABASE_URL=mysql://admin_wpinstant:QfJr8nDWKgXmaEZzB9g2@YOUR_VPS_IP:3306/admin_wpinstant
   ```
   
   With your actual VPS IP:
   ```env
   DATABASE_URL=mysql://admin_wpinstant:QfJr8nDWKgXmaEZzB9g2@123.45.67.89:3306/admin_wpinstant
   ```

3. **Keep these as-is:**
   ```env
   NEXTAUTH_URL=https://dash.instant.tw
   NEXT_PUBLIC_APP_URL=https://dash.instant.tw
   NEXTAUTH_SECRET=I5oNV67vPpk4Grgr1SVvPhKoot8rJKeXYjprtwFx4V8=
   ```

---

### **STEP 2: Enable Remote MySQL Access (5 minutes)**

**IMPORTANT:** Your VPS MySQL needs to accept remote connections from Vercel.

**Option A: Using DirectAdmin**

1. Login to DirectAdmin
2. Go to **MySQL Management**
3. Find user: `admin_wpinstant`
4. Allow remote access from: **Any Host (%)** or **Vercel IPs**
5. Save changes

**Option B: Contact Your Host**

Send this message to your hosting support:
```
Hi,

I need to enable remote MySQL access for database: admin_wpinstant
User: admin_wpinstant

Please allow connections from any IP (%) or specifically from Vercel's IP ranges.

Also ensure:
- MySQL is listening on 0.0.0.0 (not just 127.0.0.1)
- Port 3306 is open in firewall

Thank you!
```

**To Test Remote Access:**

From your computer, try:
```bash
mysql -h YOUR_VPS_IP -u admin_wpinstant -p admin_wpinstant
# Enter password: QfJr8nDWKgXmaEZzB9g2
```

If it connects, remote access works! ✅

---

### **STEP 3: Create Vercel Account (1 minute)**

1. Go to: https://vercel.com
2. Click **"Sign Up"**
3. Sign up with:
   - GitHub (recommended)
   - Or GitLab
   - Or Email

**It's completely FREE!**

---

### **STEP 4: Install Vercel CLI (1 minute)**

Open **PowerShell**:

```powershell
npm install -g vercel
```

---

### **STEP 5: Login to Vercel**

```powershell
vercel login
```

Follow the prompts to authenticate.

---

### **STEP 6: Deploy to Vercel (2 minutes)**

```powershell
cd C:\Users\PIETER\Downloads\instant-tw-deployment

# Deploy to Vercel
vercel
```

**Follow the prompts:**

```
? Set up and deploy "instant-tw-deployment"? [Y/n] 
→ Y

? Which scope do you want to deploy to? 
→ Select your account

? Link to existing project? [y/N] 
→ N

? What's your project's name? 
→ instant-dashboard (or any name)

? In which directory is your code located? 
→ ./ (press Enter)

? Want to override the settings? [y/N] 
→ N
```

**Vercel will:**
- Upload your code
- Install dependencies
- Build the project
- Deploy it
- Give you a URL

**You'll see:**
```
✅ Production: https://instant-dashboard.vercel.app [copied to clipboard]
```

---

### **STEP 7: Add Environment Variables in Vercel**

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click your project: `instant-dashboard`

2. **Go to Settings → Environment Variables**

3. **Add these variables one by one:**

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | `mysql://admin_wpinstant:QfJr8nDWKgXmaEZzB9g2@YOUR_VPS_IP:3306/admin_wpinstant` |
   | `NEXTAUTH_URL` | `https://dash.instant.tw` |
   | `NEXTAUTH_SECRET` | `I5oNV67vPpk4Grgr1SVvPhKoot8rJKeXYjprtwFx4V8=` |
   | `NEXT_PUBLIC_APP_URL` | `https://dash.instant.tw` |
   | `NEXT_PUBLIC_APP_NAME` | `Instant Dashboard` |
   | `NODE_ENV` | `production` |

4. **Click "Save" for each**

5. **Redeploy:**
   - Go to **Deployments** tab
   - Click **⋮** (three dots) on latest deployment
   - Click **"Redeploy"**

---

### **STEP 8: Add Custom Domain (dash.instant.tw)**

1. **In Vercel Dashboard:**
   - Go to your project
   - Click **"Settings"** → **"Domains"**

2. **Add Domain:**
   - Enter: `dash.instant.tw`
   - Click **"Add"**

3. **Vercel will show DNS instructions:**
   ```
   Add CNAME record:
   Name: dash
   Value: cname.vercel-dns.com
   ```

4. **Add DNS Record in your domain registrar:**
   - Login to your domain provider (where you bought instant.tw)
   - Go to DNS settings
   - Add CNAME record:
     - **Host/Name:** `dash`
     - **Points to:** `cname.vercel-dns.com`
     - **TTL:** 3600 (or Auto)
   - Save

5. **Wait 5-60 minutes for DNS propagation**

6. **Vercel will automatically:**
   - Verify the domain
   - Issue SSL certificate
   - Enable HTTPS

---

### **STEP 9: Test Your Dashboard!**

1. Visit: **https://dash.instant.tw**
   
   *If DNS not propagated yet, use: https://instant-dashboard.vercel.app*

2. **Test Signup:**
   - Click "Sign Up"
   - Create test account
   - Check database: User should be in `users` table

3. **Test Login:**
   - Login with test account
   - Should work!

4. **Test Dashboard:**
   - Visit: https://dash.instant.tw/dashboard
   - Should show dashboard
   - User is logged in ✅

---

## 🎉 SUCCESS! Dashboard is LIVE

Your unified dashboard is now live at:
**https://dash.instant.tw**

**Users can:**
- ✅ Sign up
- ✅ Login
- ✅ Access dashboard
- ✅ Works for all subdomains!

---

## 🔄 Making Updates

**When you need to update:**

```powershell
cd C:\Users\PIETER\Downloads\instant-tw-deployment

# Deploy update
vercel --prod
```

That's it! Vercel automatically builds and deploys.

---

## 📊 Monitoring

**View logs:**
- Go to Vercel Dashboard
- Click your project
- Go to **"Deployments"**
- Click any deployment
- View **"Logs"** tab

**Check errors:**
- Real-time function logs
- Build logs
- Runtime logs

---

## 🐛 Troubleshooting

### **Database Connection Error**

**Check:**
1. VPS IP is correct in DATABASE_URL
2. MySQL accepts remote connections
3. Port 3306 is open in firewall
4. User has remote access permissions

**Test connection:**
```bash
mysql -h YOUR_VPS_IP -u admin_wpinstant -p admin_wpinstant
```

### **Authentication Not Working**

**Check:**
1. NEXTAUTH_URL is https://dash.instant.tw
2. NEXTAUTH_SECRET is set
3. All environment variables added in Vercel
4. Redeployed after adding variables

### **Domain Not Working**

**Check:**
1. DNS propagation (can take up to 24 hours, usually 5-60 minutes)
2. CNAME record points to cname.vercel-dns.com
3. SSL certificate issued (Vercel does this automatically)

**Test DNS:**
```bash
nslookup dash.instant.tw
```

Should show Vercel's servers.

---

## ✅ Deployment Checklist

- [ ] VPS IP address obtained
- [ ] Updated DATABASE_URL in .env.dash
- [ ] MySQL remote access enabled
- [ ] Vercel account created
- [ ] Vercel CLI installed
- [ ] Logged in to Vercel
- [ ] Deployed to Vercel
- [ ] Environment variables added in Vercel
- [ ] Redeployed after adding variables
- [ ] Custom domain added (dash.instant.tw)
- [ ] DNS CNAME record added
- [ ] SSL certificate issued (automatic)
- [ ] Tested signup
- [ ] Tested login
- [ ] Tested dashboard

---

## 🎯 What's Next?

1. ✅ dash.instant.tw is live with authentication
2. ⏭️ Update wp.instant.tw to link to dash.instant.tw
3. ⏭️ Restore static build for wp.instant.tw

**See next guide:** `RESTORE_STATIC_WP_SITE.md`

---

## 💰 Cost

**Vercel FREE tier includes:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Analytics

**More than enough for your dashboard!**

If you exceed limits (unlikely), Hobby plan is $20/month.

---

## 🌟 Benefits of Vercel

✅ **Zero Config** - Just deploy, everything works
✅ **Auto Scaling** - Handles traffic spikes
✅ **Global CDN** - Fast worldwide
✅ **Zero Downtime** - Deployments don't interrupt service
✅ **Preview URLs** - Test before going live
✅ **Rollback** - Instant rollback to previous version
✅ **Analytics** - Built-in performance monitoring

---

🎊 **Your unified dashboard is now live on Vercel!** 🎊
