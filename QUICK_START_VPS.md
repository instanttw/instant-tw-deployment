# Quick Start: Deploy to VPS in 10 Steps

## ✅ **All 3 Features Are Already Implemented:**
1. ✅ Persistent cookies notice (localStorage + cookie, 365 days)
2. ✅ Direct login navigation (no modal, straight to /login)
3. ✅ Complete dashboard (8 tabs, all features from Item 11)

---

## 🚀 **10-Step Deployment:**

### **1. Verify next.config.ts**
Make sure it does NOT have `output: 'export'`:
```typescript
// Should look like this:
const nextConfig: NextConfig = {
  // NO output: 'export' line!
  images: { unoptimized: true },
  trailingSlash: true,
};
```

### **2. Upload Project to VPS**
**Using FTP/SFTP (FileZilla):**
- Upload entire folder to: `/var/www/wp.instant.tw/`
- Include: app/, components/, lib/, public/, config/, types/, package.json, etc.
- Exclude: node_modules/, .next/, out/

**Or using Git:**
```bash
git clone YOUR_REPO_URL /var/www/wp.instant.tw
```

### **3. SSH into VPS**
```bash
ssh your-user@your-vps-ip
```

### **4. Navigate to Project**
```bash
cd /var/www/wp.instant.tw
```

### **5. Install Dependencies**
```bash
npm install
```

### **6. Build Production App**
```bash
npm run build
```

### **7. Install PM2**
```bash
npm install -g pm2
```

### **8. Start App with PM2**
```bash
pm2 start npm --name "wp-instant" -- start
pm2 save
pm2 startup
```

### **9. Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/wp.instant.tw
```

**Paste this:**
```nginx
server {
    listen 80;
    server_name wp.instant.tw;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name wp.instant.tw;
    
    ssl_certificate /path/to/ssl/cert.crt;
    ssl_certificate_key /path/to/ssl/key.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable and reload:**
```bash
sudo ln -s /etc/nginx/sites-available/wp.instant.tw /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **10. Setup SSL (Let's Encrypt)**
```bash
sudo certbot --nginx -d wp.instant.tw
```

---

## ✅ **Verify Deployment**

Visit: `https://wp.instant.tw`

**Test All 3 Features:**

1. **Cookie Consent:**
   - ✅ Modal appears on first visit
   - ✅ Click "Accept All"
   - ✅ Refresh page → Modal does NOT reappear
   - ✅ Check browser DevTools → Cookie `instant_cookie_consent` exists

2. **Direct Login:**
   - ✅ Click avatar icon → Immediately goes to /login (no modal)
   - ✅ See login form with tabs
   - ✅ Can switch to Sign Up tab

3. **Dashboard:**
   - ✅ Login with credentials
   - ✅ Redirects to /dashboard
   - ✅ See all 8 tabs (Overview, Purchases, Websites, Reports, Hosting, Plugins, Subscriptions, Settings)
   - ✅ All tabs are clickable and functional

---

## 🆘 **Troubleshooting**

### "App won't start"
```bash
pm2 logs wp-instant
# Check error messages
```

### "Port 3000 in use"
```bash
pm2 delete wp-instant
pm2 start npm --name "wp-instant" -- start
```

### "Database connection error"
```bash
# Test database
mysql -u admin_wpinstant -p admin_wpinstant
```

### "502 Bad Gateway"
```bash
# Check if app is running
pm2 status

# Check nginx
sudo systemctl status nginx
```

---

## 📝 **Useful Commands**

```bash
# View app logs
pm2 logs wp-instant

# Restart app
pm2 restart wp-instant

# Check status
pm2 status

# Reload nginx
sudo systemctl reload nginx
```

---

## 🎉 **Success!**

When all 3 features work:
- ✅ Cookie consent persists
- ✅ Avatar → Direct to /login
- ✅ Dashboard fully functional at /dashboard

**Everything is now on wp.instant.tw running on your VPS!** 🚀

---

## 📧 **Need Help?**

If you encounter issues:
1. Check PM2 logs: `pm2 logs wp-instant`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify Next.js is running: `curl http://localhost:3000`
