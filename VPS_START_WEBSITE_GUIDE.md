# 🚀 Start Your Website on VPS - Complete Guide

## Quick Start (5 Steps)

Your deployment folder is uploaded! Here's how to get it running:

---

## Step 1: Connect to Your VPS

```bash
# Via SSH (replace with your details)
ssh root@your-server-ip
# OR
ssh username@your-server-ip
```

---

## Step 2: Navigate to Your Deployment Folder

```bash
# Find where you uploaded the folder (common locations)
cd /var/www/instant-tw-deployment
# OR
cd /home/username/instant-tw-deployment
# OR
cd ~/instant-tw-deployment

# Verify you're in the right place
ls -la
# You should see: package.json, next.config.ts, app/, config/, etc.
```

---

## Step 3: Install Dependencies & Build

```bash
# Install Node.js dependencies
npm install

# Build the production application
npm run build

# This will create optimized production files
# Should take 2-5 minutes depending on server speed
```

**Expected Output:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

## Step 4: Start the Production Server

### Option A: Quick Test (Temporary)

```bash
# Start the server (runs on port 3000 by default)
npm start

# Or specify a custom port
PORT=3000 npm start
```

**Test it:** Open `http://your-server-ip:3000` in browser

**⚠️ WARNING:** This stops when you close SSH. Use Option B for permanent hosting.

---

### Option B: Production Setup (Permanent) - **RECOMMENDED**

#### Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start your app with PM2
pm2 start npm --name "wp-instant" -- start

# OR start on specific port
PORT=3000 pm2 start npm --name "wp-instant" -- start

# Make PM2 restart on server reboot
pm2 startup
pm2 save
```

#### Useful PM2 Commands:

```bash
# Check app status
pm2 status

# View logs
pm2 logs wp-instant

# Restart app
pm2 restart wp-instant

# Stop app
pm2 stop wp-instant

# Delete app from PM2
pm2 delete wp-instant

# Monitor in real-time
pm2 monit
```

---

## Step 5: Configure Web Server (Nginx/Apache)

Your Next.js app runs on port 3000. To access it via domain name (wp.instant.tw), you need a reverse proxy.

### Option A: Nginx Configuration

#### 1. Install Nginx (if not installed):

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### 2. Create Nginx Configuration:

```bash
# Create new site configuration
sudo nano /etc/nginx/sites-available/wp-instant
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name wp.instant.tw www.wp.instant.tw;

    # Increase upload size limit
    client_max_body_size 50M;

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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Handle static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 3. Enable the Site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/wp-instant /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Ensure Nginx starts on boot
sudo systemctl enable nginx
```

---

### Option B: Apache Configuration

#### 1. Install Apache (if not installed):

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install apache2

# Enable required modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
```

#### 2. Create Apache Configuration:

```bash
sudo nano /etc/apache2/sites-available/wp-instant.conf
```

**Paste this configuration:**

```apache
<VirtualHost *:80>
    ServerName wp.instant.tw
    ServerAlias www.wp.instant.tw

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    # Logging
    ErrorLog ${APACHE_LOG_DIR}/wp-instant-error.log
    CustomLog ${APACHE_LOG_DIR}/wp-instant-access.log combined
</VirtualHost>
```

#### 3. Enable the Site:

```bash
# Enable site
sudo a2ensite wp-instant.conf

# Test Apache configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2

# Enable Apache on boot
sudo systemctl enable apache2
```

---

## Step 6: Configure Firewall

```bash
# Allow HTTP (port 80)
sudo ufw allow 80/tcp

# Allow HTTPS (port 443) - for SSL later
sudo ufw allow 443/tcp

# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Step 7: Point Domain to VPS

### Update DNS Records:

Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.) and add:

**A Record:**
```
Type: A
Name: wp (or @)
Value: your-vps-ip-address
TTL: 3600
```

**CNAME Record (optional for www):**
```
Type: CNAME
Name: www
Value: wp.instant.tw
TTL: 3600
```

**DNS Propagation:** Takes 5 minutes to 48 hours (usually 15-30 minutes)

---

## Step 8: Install SSL Certificate (HTTPS)

### Using Let's Encrypt (Free SSL):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx  # For Nginx
# OR
sudo apt install certbot python3-certbot-apache  # For Apache

# Get SSL certificate
sudo certbot --nginx -d wp.instant.tw -d www.wp.instant.tw  # Nginx
# OR
sudo certbot --apache -d wp.instant.tw -d www.wp.instant.tw  # Apache

# Auto-renewal (certbot sets this up automatically)
sudo certbot renew --dry-run
```

---

## 🎯 QUICK COMMAND SEQUENCE (Copy & Paste)

Here's everything in one go:

```bash
# 1. Navigate to folder
cd /var/www/instant-tw-deployment  # Adjust path

# 2. Install & Build
npm install
npm run build

# 3. Install PM2 and start app
npm install -g pm2
pm2 start npm --name "wp-instant" -- start
pm2 startup
pm2 save

# 4. Check if running
pm2 status
pm2 logs wp-instant

# 5. Configure Nginx (if using Nginx)
sudo nano /etc/nginx/sites-available/wp-instant
# Paste the Nginx config from above, save (Ctrl+X, Y, Enter)

sudo ln -s /etc/nginx/sites-available/wp-instant /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 6. Configure firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 7. Get SSL certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d wp.instant.tw -d www.wp.instant.tw
```

---

## ✅ Verification Checklist

After completing the steps:

- [ ] Run `pm2 status` - Should show "online" status
- [ ] Run `curl http://localhost:3000` - Should return HTML
- [ ] Run `sudo nginx -t` - Should say "syntax is ok"
- [ ] Visit `http://your-server-ip:3000` - Should load website
- [ ] Visit `http://wp.instant.tw` - Should load website
- [ ] Visit `https://wp.instant.tw` - Should load with SSL (after Step 8)
- [ ] Check all 8 plugin pages load correctly
- [ ] Test responsive design on mobile

---

## 🐛 Troubleshooting

### App Won't Start

```bash
# Check Node.js version (requires 18+)
node --version

# Check logs
pm2 logs wp-instant

# Try starting manually to see errors
npm start
```

### Port Already in Use

```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 [PID]

# Or use different port
PORT=3001 pm2 start npm --name "wp-instant" -- start
```

### Nginx Error

```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Site Not Loading

```bash
# Check if app is running
pm2 status

# Check Nginx is running
sudo systemctl status nginx

# Check firewall
sudo ufw status

# Check DNS
nslookup wp.instant.tw
```

### Database Connection Error

```bash
# Check .env file exists
cat .env

# Verify database credentials
# Make sure DATABASE_URL is correct
```

---

## 📊 Performance Optimization (Optional)

### Enable Caching:

Add to Nginx config inside `server` block:

```nginx
# Cache static assets
location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Enable Gzip Compression:

Add to Nginx config:

```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
gzip_min_length 1000;
```

---

## 🔄 Updating Your Site

When you make changes and want to deploy:

```bash
# 1. Upload new files to server (via FTP/Git)

# 2. SSH into server
cd /var/www/instant-tw-deployment

# 3. Install any new dependencies
npm install

# 4. Rebuild
npm run build

# 5. Restart with PM2
pm2 restart wp-instant

# 6. Check status
pm2 logs wp-instant
```

---

## 📱 Monitor Your Site

### Real-time Monitoring:

```bash
# Monitor all apps
pm2 monit

# View logs
pm2 logs wp-instant --lines 100

# Check memory/CPU usage
pm2 show wp-instant
```

### Server Resources:

```bash
# Check disk space
df -h

# Check memory
free -m

# Check CPU
top
```

---

## 🎉 Success!

Your WordPress plugin marketplace is now live at:
- **http://wp.instant.tw** (after DNS propagation)
- **https://wp.instant.tw** (after SSL installation)

### What's Live:
✅ 8 comprehensive plugin pages
✅ 4-tier pricing on all plugins
✅ 80 features, 96 FAQs, 24 testimonials
✅ FREE tiers for lead generation
✅ AI-powered differentiators
✅ $3.5M-$12.8M ARR potential

---

## 📞 Need Help?

Common issues and solutions are in the Troubleshooting section above.

For server-specific issues, check your VPS provider's documentation or support.

---

**Your website is ready to generate leads and revenue! 🚀**
