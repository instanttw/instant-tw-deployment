# VPS Deployment Checklist

## ✅ **Pre-Deployment Verification**

### Code Status:
- [x] All 3 features implemented
  - [x] Persistent cookies (lib/cookie-utils.ts, lib/cookie-consent-context.tsx)
  - [x] Direct login navigation (components/layout/header.tsx)
  - [x] Complete dashboard (app/dashboard/dashboard-client.tsx)
- [x] next.config.ts configured (no output: 'export')
- [x] .env.production created
- [x] TypeScript compiles without errors
- [x] All dependencies in package.json

### VPS Requirements:
- [ ] SSH access confirmed
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Port 3000 available
- [ ] Nginx/Apache installed
- [ ] MySQL running locally
- [ ] SSL certificate available (or can get Let's Encrypt)

---

## 📦 **Deployment Steps**

### Step 1: Upload Project
- [ ] Upload entire project folder to `/var/www/wp.instant.tw/`
- [ ] Verify all folders present (app/, components/, lib/, public/, etc.)
- [ ] .env.production file uploaded
- [ ] package.json uploaded

**Verification:**
```bash
ssh your-user@your-vps-ip
ls -la /var/www/wp.instant.tw/
# Should see: app/, components/, lib/, package.json, etc.
```

### Step 2: Install Dependencies
- [ ] SSH into VPS
- [ ] Navigate to project directory
- [ ] Run `npm install`
- [ ] Wait for completion (2-5 minutes)

**Commands:**
```bash
cd /var/www/wp.instant.tw
npm install
```

### Step 3: Build Production App
- [ ] Run `npm run build`
- [ ] Check for build errors
- [ ] Verify .next folder created

**Commands:**
```bash
npm run build
```

**Expected output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (51/51)
Route (app)                              Size     First Load JS
┌ ○ /                                    ...
```

### Step 4: Install & Configure PM2
- [ ] Install PM2 globally
- [ ] Start app with PM2
- [ ] Save PM2 configuration
- [ ] Setup startup script

**Commands:**
```bash
npm install -g pm2
pm2 start npm --name "wp-instant" -- start
pm2 save
pm2 startup
pm2 status  # Should show "online"
```

### Step 5: Configure Nginx
- [ ] Create nginx config file
- [ ] Update SSL certificate paths
- [ ] Enable site
- [ ] Test nginx configuration
- [ ] Reload nginx

**Commands:**
```bash
sudo nano /etc/nginx/sites-available/wp.instant.tw
# Paste configuration from VPS_DEPLOYMENT_GUIDE.md

sudo ln -s /etc/nginx/sites-available/wp.instant.tw /etc/nginx/sites-enabled/
sudo nginx -t  # Should say "successful"
sudo systemctl reload nginx
```

### Step 6: SSL Certificate
- [ ] Run certbot
- [ ] Verify certificate installation
- [ ] Test HTTPS access

**Commands:**
```bash
sudo certbot --nginx -d wp.instant.tw -d www.wp.instant.tw
```

### Step 7: Database Configuration
- [ ] Verify MySQL running
- [ ] Test database connection
- [ ] Confirm user has access

**Commands:**
```bash
mysql -u admin_wpinstant -p admin_wpinstant
# Should connect successfully
```

---

## 🧪 **Testing Phase**

### Feature 1: Persistent Cookies
- [ ] Visit https://wp.instant.tw
- [ ] Cookie consent modal appears
- [ ] Click "Accept All"
- [ ] Refresh page
- [ ] Modal does NOT reappear ✅
- [ ] Open DevTools → Application → Cookies
- [ ] Find `instant_cookie_consent` cookie
- [ ] Verify expiry is ~365 days in future

### Feature 2: Direct Login Navigation
- [ ] Click avatar icon (top right)
- [ ] Should go DIRECTLY to /login (no modal)
- [ ] See login form with email/password fields
- [ ] See "Sign Up" tab available
- [ ] Can switch between Login/Sign Up tabs

### Feature 3: Dashboard Access
- [ ] Create test account or login
- [ ] Should redirect to /dashboard after login
- [ ] See "Dashboard" header with user name
- [ ] See all 8 tabs:
  - [ ] Overview
  - [ ] Purchases
  - [ ] Websites
  - [ ] Reports
  - [ ] Hosting
  - [ ] Plugins
  - [ ] Subscriptions
  - [ ] Settings
- [ ] Click each tab - all should load
- [ ] Click "Sign Out" - should redirect to homepage

### General Tests
- [ ] Homepage loads
- [ ] All navigation links work
- [ ] Mobile responsive
- [ ] No console errors (F12 → Console)
- [ ] SSL certificate valid (green padlock)

---

## 🔍 **Verification Commands**

Run these on VPS to verify everything:

```bash
# Check PM2 status
pm2 status
# Should show: wp-instant | online

# Check app logs
pm2 logs wp-instant --lines 20
# Should show Next.js started on port 3000

# Check nginx
sudo systemctl status nginx
# Should show: active (running)

# Test local access
curl http://localhost:3000
# Should return HTML

# Test database
mysql -u admin_wpinstant -p admin_wpinstant -e "SHOW TABLES;"
# Should list tables

# Check disk space
df -h
# Ensure enough space

# Check memory
free -m
# Ensure enough RAM
```

---

## 🎯 **Success Criteria**

Your deployment is successful when ALL of these are true:

- [x] App running on PM2 with "online" status
- [x] Nginx proxying to localhost:3000
- [x] SSL certificate valid
- [x] https://wp.instant.tw loads homepage
- [x] Cookie consent appears and persists
- [x] Avatar → Direct to /login (no modal)
- [x] Login works
- [x] Dashboard accessible at /dashboard
- [x] All 8 dashboard tabs functional
- [x] No errors in PM2 logs
- [x] No errors in Nginx logs
- [x] No errors in browser console

---

## 🆘 **Common Issues & Solutions**

### Issue: "502 Bad Gateway"
**Solution:**
```bash
pm2 status  # Check if app is online
pm2 restart wp-instant
```

### Issue: "Build fails"
**Solution:**
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Issue: "Database connection error"
**Solution:**
```bash
# Verify .env.production
cat .env.production | grep DATABASE_URL

# Test connection
mysql -u admin_wpinstant -p admin_wpinstant
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
pm2 delete wp-instant
pm2 start npm --name "wp-instant" -- start
```

### Issue: "PM2 won't start on reboot"
**Solution:**
```bash
pm2 startup
# Follow instructions
pm2 save
```

---

## 📊 **Post-Deployment Monitoring**

### Daily Checks:
```bash
# App status
pm2 status

# Resource usage
pm2 monit
```

### Weekly Checks:
```bash
# Check logs for errors
pm2 logs wp-instant --lines 100

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

### System Updates:
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js packages (when needed)
npm update
npm run build
pm2 restart wp-instant
```

---

## 🎉 **Deployment Complete!**

Once all checkboxes are marked:
- ✅ All 3 features working
- ✅ No errors in logs
- ✅ SSL certificate valid
- ✅ PM2 showing "online"

**Your Next.js app with authentication is now live on wp.instant.tw!** 🚀

---

## 📝 **Quick Reference**

```bash
# Restart app after code changes
pm2 restart wp-instant

# View real-time logs
pm2 logs wp-instant -f

# Stop app
pm2 stop wp-instant

# Start app
pm2 start wp-instant

# Delete app from PM2
pm2 delete wp-instant

# Reload nginx
sudo systemctl reload nginx

# Test nginx config
sudo nginx -t
```

---

**Need to update your app? See VPS_DEPLOYMENT_GUIDE.md section "Deployment Updates"**
