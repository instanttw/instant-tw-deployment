# ⚡ Quick Start - Enable Website on VPS

## 🚀 Super Fast Setup (5 Minutes)

Your files are uploaded! Run these commands on your VPS:

---

## Step 1: SSH into Your VPS

```bash
ssh root@your-server-ip
# Enter password when prompted
```

---

## Step 2: Navigate & Build

```bash
# Go to your uploaded folder (adjust path if different)
cd /var/www/instant-tw-deployment

# Install dependencies & build
npm install
npm run build
```

---

## Step 3: Start with PM2 (Permanent)

```bash
# Install PM2
npm install -g pm2

# Start your website
pm2 start npm --name "wp-instant" -- start

# Make it auto-start on reboot
pm2 startup
pm2 save

# Check status
pm2 status
```

✅ **Your site is now running on port 3000!**

Test: Visit `http://your-server-ip:3000`

---

## Step 4: Setup Nginx (For Domain Access)

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create config file
sudo nano /etc/nginx/sites-available/wp-instant
```

**Paste this (replace wp.instant.tw with your domain):**

```nginx
server {
    listen 80;
    server_name wp.instant.tw www.wp.instant.tw;

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

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/wp-instant /etc/nginx/sites-enabled/

# Test & reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 5: Open Firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## Step 6: Point Domain to Server

Go to your domain DNS settings and add:

```
Type: A
Name: wp (or @)
Value: YOUR_VPS_IP_ADDRESS
TTL: 3600
```

**Wait 15-30 minutes for DNS propagation**

---

## Step 7: Add SSL (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get FREE SSL certificate
sudo certbot --nginx -d wp.instant.tw -d www.wp.instant.tw
```

---

## ✅ Done! Your Site is Live!

Visit: **https://wp.instant.tw**

---

## 📊 Quick Commands Reference

```bash
# Check if app is running
pm2 status

# View logs
pm2 logs wp-instant

# Restart app
pm2 restart wp-instant

# Stop app
pm2 stop wp-instant
```

---

## 🐛 Troubleshooting

**App won't start?**
```bash
pm2 logs wp-instant  # Check error logs
node --version       # Need Node.js 18+
```

**Site not loading?**
```bash
pm2 status           # Check app status
sudo systemctl status nginx  # Check Nginx
sudo ufw status      # Check firewall
```

**Port already in use?**
```bash
sudo lsof -i :3000   # See what's using port 3000
```

---

## 🔄 Update Your Site Later

```bash
cd /var/www/instant-tw-deployment
npm install
npm run build
pm2 restart wp-instant
```

---

## 🎉 What's Live

✅ 8 WordPress plugin pages
✅ 4-tier pricing (FREE/Pro/Agency/Enterprise)
✅ 80 features, 96 FAQs, 24 testimonials
✅ AI-powered features
✅ $3.5M-$12.8M ARR potential

**Your WordPress plugin marketplace is LIVE! 🚀**

For detailed instructions, see: **VPS_START_WEBSITE_GUIDE.md**
