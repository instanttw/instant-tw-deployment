# 🌐 PRODUCTION DEPLOYMENT - Make it Live Online

Deploy authentication to your production VPS so **real users online** can signup and login.

---

## 📋 What You Need

Before starting, have these ready:
- ✅ Your production domain (e.g., `instant.tw` or `wp.instant.tw`)
- ✅ SSH access to your VPS
- ✅ MySQL database running on VPS (admin_wpinstant)
- ✅ Node.js installed on VPS (version 18+)

---

## 🚀 STEP-BY-STEP PRODUCTION DEPLOYMENT

### **STEP 1: Update .env for Production Domain**

**On your local machine**, edit `.env` file:

**Change from:**
```env
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**To your production domain:**
```env
NEXTAUTH_URL=https://instant.tw
# Or if using subdomain: https://wp.instant.tw
NEXT_PUBLIC_APP_URL=https://instant.tw
# Or: https://wp.instant.tw
NODE_ENV=production
```

**Keep these the same:**
```env
DATABASE_URL=mysql://admin_wpinstant:QfJr8nDWKgXmaEZzB9g2@localhost:3306/admin_wpinstant
NEXTAUTH_SECRET=I5oNV67vPpk4Grgr1SVvPhKoot8rJKeXYjprtwFx4V8=
```

---

### **STEP 2: Run Setup Script (Local)**

```powershell
cd C:\Users\PIETER\Downloads\instant-tw-deployment
.\enable-auth.ps1
```

**Wait for:** ✅ Setup Complete!

---

### **STEP 3: Upload to Your VPS**

**Using FileZilla, WinSCP, or command line:**

```powershell
# Using SCP (replace with your VPS details):
scp -r C:\Users\PIETER\Downloads\instant-tw-deployment\* user@your-vps-ip:/var/www/instant-tw/

# Or upload via FTP/SFTP using FileZilla/WinSCP
# Upload entire instant-tw-deployment folder to: /var/www/instant-tw/
```

**Important folders to upload:**
- ✅ `app/` (with api, login, signup, dashboard)
- ✅ `components/`
- ✅ `lib/` (with db.ts)
- ✅ `config/`
- ✅ `public/`
- ✅ `.env` (with production URLs)
- ✅ `package.json`
- ✅ `next.config.ts`
- ✅ All other project files

**DO NOT upload:**
- ❌ `node_modules/` (will install on server)
- ❌ `.next/` (will build on server)
- ❌ `out/` (not needed)

---

### **STEP 4: SSH into Your VPS**

```bash
ssh user@your-vps-ip
# Or use PuTTY on Windows
```

---

### **STEP 5: Navigate to Project Folder**

```bash
cd /var/www/instant-tw
# Or wherever you uploaded the files
```

---

### **STEP 6: Install Dependencies**

```bash
npm install
```

**Wait for:** Installation complete (2-3 minutes)

---

### **STEP 7: Build for Production**

```bash
npm run build
```

**Wait for:** ✓ Compiled successfully (1-2 minutes)

---

### **STEP 8: Install PM2 (Process Manager)**

```bash
# Install PM2 globally
sudo npm install -g pm2

# Or without sudo if you have permissions:
npm install -g pm2
```

---

### **STEP 9: Start with PM2**

```bash
# Start the application
pm2 start npm --name "instant-wp" -- start

# Check status
pm2 status

# View logs
pm2 logs instant-wp
```

**You should see:**
```
┌────┬────────────────┬─────────────┬─────────┐
│ id │ name           │ mode        │ status  │
├────┼────────────────┼─────────────┼─────────┤
│ 0  │ instant-wp     │ fork        │ online  │
└────┴────────────────┴─────────────┴─────────┘
```

---

### **STEP 10: Save PM2 Configuration**

```bash
# Save current PM2 processes
pm2 save

# Setup auto-restart on server reboot
pm2 startup

# Copy and run the command PM2 shows you
# It will look like: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u user --hp /home/user
```

---

### **STEP 11: Configure Nginx (or Apache)**

#### **Option A: Using Nginx**

**Create/Edit Nginx configuration:**

```bash
sudo nano /etc/nginx/sites-available/instant-tw
```

**Add this configuration:**

```nginx
server {
    listen 80;
    server_name instant.tw www.instant.tw;
    # Or for subdomain: wp.instant.tw

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable the site:**

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/instant-tw /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### **Option B: Using Apache**

**Create/Edit Apache configuration:**

```bash
sudo nano /etc/apache2/sites-available/instant-tw.conf
```

**Add this configuration:**

```apache
<VirtualHost *:80>
    ServerName instant.tw
    ServerAlias www.instant.tw

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    <Proxy *>
        Order allow,deny
        Allow from all
    </Proxy>
</VirtualHost>
```

**Enable required modules and site:**

```bash
# Enable proxy modules
sudo a2enmod proxy
sudo a2enmod proxy_http

# Enable site
sudo a2ensite instant-tw

# Restart Apache
sudo systemctl restart apache2
```

---

### **STEP 12: Install SSL Certificate (Let's Encrypt)**

**Using Certbot (FREE SSL):**

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx
# Or for Apache: python3-certbot-apache

# Get SSL certificate (Nginx)
sudo certbot --nginx -d instant.tw -d www.instant.tw
# Or for subdomain: -d wp.instant.tw

# Or for Apache:
# sudo certbot --apache -d instant.tw -d www.instant.tw

# Follow the prompts
# Choose: 2 (Redirect HTTP to HTTPS)
```

**Certbot will automatically:**
- ✅ Install SSL certificate
- ✅ Configure HTTPS
- ✅ Setup auto-renewal
- ✅ Redirect HTTP to HTTPS

---

### **STEP 13: Verify DNS Settings**

Make sure your domain points to your VPS:

```bash
# Check DNS
nslookup instant.tw
# Should show your VPS IP address
```

**If DNS not configured:**
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add/Update A record:
   - **Host:** @ (or instant.tw)
   - **Type:** A
   - **Value:** Your VPS IP address
3. Wait 5-60 minutes for propagation

---

### **STEP 14: Test Production Website**

1. **Open browser:** https://instant.tw (or your domain)
2. **Click:** User avatar icon
3. **Sign Up:** Create real account
4. **Login:** Use credentials
5. **Visit:** https://instant.tw/dashboard
6. **✅ Works? AUTHENTICATION IS LIVE!**

---

## 🧪 Production Testing Checklist

Test these on your live domain:

- [ ] Website loads: https://instant.tw
- [ ] HTTPS working (green padlock)
- [ ] Signup form opens
- [ ] Can create account
- [ ] No email sent (as requested)
- [ ] Can login with created account
- [ ] Dashboard loads after login
- [ ] Can logout
- [ ] Dashboard protected when logged out

---

## 🗄️ Verify Database Connection on VPS

**SSH into VPS and test:**

```bash
# Connect to MySQL
mysql -u admin_wpinstant -p admin_wpinstant

# Check tables
SHOW TABLES;

# Check users
SELECT id, name, email, role, status FROM users;

# Exit
exit
```

---

## 🔧 Troubleshooting Production Issues

### **Issue: Website not accessible**

**Check PM2 is running:**
```bash
pm2 status
pm2 logs instant-wp
```

**Restart if needed:**
```bash
pm2 restart instant-wp
```

### **Issue: Database connection failed**

**Verify MySQL is running:**
```bash
sudo systemctl status mysql
# Or: sudo systemctl status mariadb
```

**Test database connection:**
```bash
mysql -u admin_wpinstant -p admin_wpinstant
```

### **Issue: 502 Bad Gateway**

**Check Node.js app is running:**
```bash
pm2 status
pm2 logs instant-wp
```

**Check Nginx configuration:**
```bash
sudo nginx -t
sudo systemctl status nginx
```

### **Issue: SSL not working**

**Check certificate:**
```bash
sudo certbot certificates
```

**Renew if expired:**
```bash
sudo certbot renew
```

### **Issue: "NEXTAUTH_URL mismatch"**

**Verify .env has correct domain:**
```bash
cd /var/www/instant-tw
cat .env | grep NEXTAUTH_URL
```

Should show:
```
NEXTAUTH_URL=https://instant.tw
```

**If wrong, edit:**
```bash
nano .env
# Update URLs
# Save and restart
pm2 restart instant-wp
```

---

## 📊 Monitor Your Application

### **View Live Logs**
```bash
pm2 logs instant-wp --lines 100
```

### **Check Status**
```bash
pm2 status
```

### **Monitor Resources**
```bash
pm2 monit
```

### **Restart if Needed**
```bash
pm2 restart instant-wp
```

### **Stop Application**
```bash
pm2 stop instant-wp
```

### **Start Again**
```bash
pm2 start instant-wp
```

---

## 🔄 Update Application (Future Updates)

When you need to update:

```bash
# SSH into VPS
ssh user@your-vps-ip

# Navigate to project
cd /var/www/instant-tw

# Pull/upload new changes
# git pull (if using git)
# Or upload via FTP

# Install new dependencies (if any)
npm install

# Rebuild
npm run build

# Restart
pm2 restart instant-wp

# Check logs
pm2 logs instant-wp
```

---

## 🎯 Production Configuration Summary

**Domain:** https://instant.tw (or your domain)  
**Database:** admin_wpinstant on localhost  
**App Port:** 3000 (proxied by Nginx/Apache)  
**Process Manager:** PM2  
**SSL:** Let's Encrypt (auto-renews)  
**Auth:** NextAuth with JWT sessions  

**File Locations:**
- Project: `/var/www/instant-tw/`
- .env: `/var/www/instant-tw/.env`
- Logs: `pm2 logs instant-wp`

---

## ✅ Production Checklist

**Before Going Live:**
- [x] .env updated with production domain
- [x] Uploaded to VPS
- [x] Dependencies installed
- [x] Built successfully
- [x] PM2 running
- [x] Nginx/Apache configured
- [x] SSL certificate installed
- [x] DNS pointing to VPS
- [x] Tested signup
- [x] Tested login
- [x] Tested dashboard access

---

## 🎉 You're Live!

Once all steps are complete:

**Users can now:**
- ✅ Visit https://instant.tw
- ✅ Sign up for accounts
- ✅ Login with email/password
- ✅ Access their dashboard
- ✅ Use all features

**Your authentication is LIVE on the internet!** 🌐🚀

---

## 📞 Need Help?

**Check logs:**
```bash
pm2 logs instant-wp
sudo tail -f /var/log/nginx/error.log
```

**Restart services:**
```bash
pm2 restart instant-wp
sudo systemctl restart nginx
sudo systemctl restart mysql
```

**Database issues:**
```bash
mysql -u admin_wpinstant -p admin_wpinstant -e "SHOW TABLES;"
```

**Still stuck?** Check `ENABLE_AUTH_GUIDE.md` for detailed troubleshooting.

---

🎊 **Your website is now LIVE with authentication!** 🎊
