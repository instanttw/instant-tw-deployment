# Full Next.js Deployment to VPS with Node.js

## Prerequisites Verified ✅
- SSH access to VPS
- Node.js installed
- Full project source code

---

## 🎯 **Deployment Overview**

Instead of uploading the `/out` folder, you'll:
1. Upload the **entire project** to VPS
2. Install dependencies
3. Build the production app
4. Run it with a process manager (PM2)
5. Configure reverse proxy (Nginx)

---

## 📦 **Step 1: Prepare the Project**

### Update next.config.ts

Make sure your `next.config.ts` does NOT have `output: 'export'`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NO output: 'export' - we need dynamic server
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
```

### Create .env.production file

```bash
# Create production environment file
DATABASE_URL=mysql://admin_wpinstant:QfJr8nDWKgXmaEZzB9g2@localhost:3306/admin_wpinstant
NEXTAUTH_URL=https://wp.instant.tw
NEXTAUTH_SECRET=I5oNV67vPpk4Grgr1SVvPhKoot8rJKeXYjprtwFx4V8=
NEXT_PUBLIC_APP_URL=https://wp.instant.tw
NODE_ENV=production
NEXT_PUBLIC_DASHBOARD_URL=https://wp.instant.tw
```

---

## 📤 **Step 2: Upload Project to VPS**

### Option A: Using Git (Recommended)

```bash
# On your local machine
cd C:\Users\PIETER\Downloads\instant-tw-deployment

# Initialize git if not already
git init
git add .
git commit -m "Prepare for VPS deployment"

# Push to your git repository (GitHub, GitLab, etc.)
# Then on VPS:
cd /var/www/wp.instant.tw
git clone YOUR_REPO_URL .
```

### Option B: Using FTP/SFTP

Upload these files/folders to `/var/www/wp.instant.tw/` (or your preferred directory):

**Include:**
- ✅ `/app` folder
- ✅ `/components` folder
- ✅ `/lib` folder
- ✅ `/public` folder
- ✅ `/config` folder
- ✅ `/types` folder
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `next.config.ts`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.ts`
- ✅ `postcss.config.mjs`
- ✅ `.env.production`

**Exclude:**
- ❌ `/node_modules` (will install on server)
- ❌ `/.next` (will build on server)
- ❌ `/out` (not needed)

---

## 🔧 **Step 3: SSH into VPS and Install**

```bash
# SSH into your VPS
ssh your-user@your-vps-ip

# Navigate to project directory
cd /var/www/wp.instant.tw

# Verify Node.js version (should be 18+)
node --version
npm --version

# Install dependencies
npm install

# Build the production application
npm run build

# This will create the optimized .next folder
```

---

## ⚡ **Step 4: Install PM2 (Process Manager)**

PM2 keeps your Next.js app running 24/7:

```bash
# Install PM2 globally
npm install -g pm2

# Start your Next.js app with PM2
pm2 start npm --name "wp-instant" -- start

# Configure PM2 to start on server reboot
pm2 startup
pm2 save

# Check status
pm2 status

# View logs
pm2 logs wp-instant
```

Your Next.js app is now running on `http://localhost:3000`

---

## 🌐 **Step 5: Configure Nginx Reverse Proxy**

### Create Nginx configuration

```bash
# Create/edit nginx config
sudo nano /etc/nginx/sites-available/wp.instant.tw
```

**Add this configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name wp.instant.tw www.wp.instant.tw;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name wp.instant.tw www.wp.instant.tw;

    # SSL Configuration (adjust paths to your SSL certificates)
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logging
    access_log /var/log/nginx/wp.instant.tw-access.log;
    error_log /var/log/nginx/wp.instant.tw-error.log;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files (Next.js serves these)
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_bypass $http_upgrade;
    }

    # Client-side navigation
    location /_next {
        proxy_pass http://localhost:3000;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable the site

```bash
# Create symlink to enable site
sudo ln -s /etc/nginx/sites-available/wp.instant.tw /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## 🔐 **Step 6: Setup SSL Certificate**

### Using Let's Encrypt (Free SSL)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d wp.instant.tw -d www.wp.instant.tw

# Certbot will automatically configure nginx for HTTPS
# And set up auto-renewal
```

---

## 🗄️ **Step 7: Configure MySQL Remote Access**

Your database connection needs to work from localhost:

```bash
# Edit MySQL config
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Find bind-address and set to:
bind-address = 127.0.0.1

# Restart MySQL
sudo systemctl restart mysql

# Verify database connection
mysql -u admin_wpinstant -p admin_wpinstant
```

---

## ✅ **Step 8: Verify Deployment**

```bash
# Check PM2 status
pm2 status

# Should show:
# ┌─────┬────────────┬─────────┬─────────┬───────┐
# │ id  │ name       │ status  │ restart │ uptime│
# ├─────┼────────────┼─────────┼─────────┼───────┤
# │ 0   │ wp-instant │ online  │ 0       │ 2m    │
# └─────┴────────────┴─────────┴─────────┴───────┘

# Check nginx
sudo systemctl status nginx

# Check logs
pm2 logs wp-instant --lines 50
```

Visit: `https://wp.instant.tw`

**You should see:**
- ✅ Homepage loads
- ✅ Cookie consent appears (and persists after accepting)
- ✅ Click avatar → Goes to /login
- ✅ Login works
- ✅ Dashboard accessible at /dashboard

---

## 🔄 **Deployment Updates (Future)**

When you make changes:

```bash
# On your local machine
git add .
git commit -m "Update features"
git push

# On VPS
ssh your-user@your-vps-ip
cd /var/www/wp.instant.tw
git pull
npm install  # If package.json changed
npm run build
pm2 restart wp-instant
```

---

## 🆘 **Troubleshooting**

### App won't start
```bash
# Check logs
pm2 logs wp-instant

# Common issues:
# - Port 3000 already in use: pm2 delete wp-instant; pm2 start npm --name "wp-instant" -- start
# - Build errors: npm run build (check output)
# - Missing dependencies: npm install
```

### Database connection fails
```bash
# Test database
mysql -u admin_wpinstant -p admin_wpinstant

# If fails, check:
# - User exists
# - Password correct
# - Database exists
```

### Nginx errors
```bash
# Check nginx error log
sudo tail -f /var/log/nginx/wp.instant.tw-error.log

# Test config
sudo nginx -t
```

### Port 3000 not accessible
```bash
# Check if Next.js is running
curl http://localhost:3000

# Check firewall
sudo ufw status
sudo ufw allow 3000/tcp  # If needed
```

---

## 📊 **Monitoring**

### PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# CPU and memory usage
pm2 list
```

### System Resources
```bash
# Check disk space
df -h

# Check memory
free -m

# Check CPU
top
```

---

## 🔒 **Security Checklist**

- ✅ SSL certificate installed
- ✅ Firewall configured (ufw)
- ✅ Only necessary ports open (80, 443, 22)
- ✅ Strong database password
- ✅ Environment variables secured
- ✅ Regular updates: `sudo apt update && sudo apt upgrade`

---

## 🎉 **Success Criteria**

Your deployment is successful when:
- ✅ `https://wp.instant.tw` loads
- ✅ Cookie consent appears and persists
- ✅ Login at `wp.instant.tw/login` works
- ✅ Dashboard at `wp.instant.tw/dashboard` works
- ✅ All 3 features functioning
- ✅ PM2 shows app as "online"
- ✅ SSL certificate valid

---

## 📝 **Quick Commands Reference**

```bash
# Restart app
pm2 restart wp-instant

# View logs
pm2 logs wp-instant

# Stop app
pm2 stop wp-instant

# Start app
pm2 start wp-instant

# Reload nginx
sudo systemctl reload nginx

# Check nginx status
sudo systemctl status nginx
```

---

**You're now running a full Next.js application with authentication on your VPS!** 🚀
