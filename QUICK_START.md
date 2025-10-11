# Quick Start - Deploy in 15 Minutes

This is the fastest way to get your WordPress Plugin Marketplace live.

---

## 🚀 Option 1: Vercel (Easiest - 5 Minutes)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy
```bash
cd instant-tw-deployment
vercel
```

### Step 3: Follow Prompts
- Login to Vercel
- Confirm project name
- Deploy!

### Step 4: Add Custom Domain
1. Go to Vercel dashboard
2. Project Settings → Domains
3. Add `instant.tw`
4. Update DNS as instructed

**Done!** ✅ Your site is live with automatic SSL!

---

## 🖥️ Option 2: VPS Server (15-20 Minutes)

### Prerequisites
- Ubuntu 20.04+ server
- Root/sudo access
- Domain pointing to server IP

### Step 1: Connect to Server
```bash
ssh root@your-server-ip
```

### Step 2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v  # Verify installation
```

### Step 3: Install PM2 & Nginx
```bash
sudo npm install -g pm2
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Step 4: Upload Files

**Method A: Use SCP (from your computer)**
```bash
scp -r C:\Users\PIETER\Downloads\instant-tw-deployment/* root@server-ip:/var/www/instant-tw/
```

**Method B: Use SFTP client (FileZilla, WinSCP)**
- Connect to server
- Create `/var/www/instant-tw` directory
- Upload all files

### Step 5: Install Dependencies
```bash
cd /var/www/instant-tw
npm ci --production
```

### Step 6: Create Environment File
```bash
nano .env.production
```

Add:
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://instant.tw
```

Save: Ctrl+X, Y, Enter

### Step 7: Start with PM2
```bash
pm2 start npm --name "instant-tw" -- start
pm2 save
pm2 startup
```

### Step 8: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/instant.tw
```

Paste:
```nginx
server {
    listen 80;
    server_name instant.tw www.instant.tw;
    
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

Save and enable:
```bash
sudo ln -s /etc/nginx/sites-available/instant.tw /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 9: Install SSL
```bash
sudo certbot --nginx -d instant.tw -d www.instant.tw
```

Follow prompts. Choose "2" for redirect to HTTPS.

### Step 10: Open Firewall
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

**Done!** ✅ Visit https://instant.tw

---

## ✅ Verify Deployment

Check these URLs work:
- https://instant.tw
- https://instant.tw/plugins
- https://instant.tw/pricing
- https://instant.tw/privacy

---

## 🔧 Useful Commands

### Check if app is running
```bash
pm2 status
pm2 logs instant-tw
```

### Restart app
```bash
pm2 restart instant-tw
```

### View logs
```bash
pm2 logs instant-tw --lines 100
```

### Check Nginx status
```bash
sudo systemctl status nginx
sudo nginx -t
```

---

## 🐛 Quick Troubleshooting

### Site not loading?
```bash
# Check if app is running
pm2 status

# Check if port 3000 responds
curl http://localhost:3000

# Restart everything
pm2 restart instant-tw
sudo systemctl restart nginx
```

### Build failed?
```bash
# Check Node version (must be 18+)
node -v

# Rebuild
cd /var/www/instant-tw
npm run build
```

### Permission errors?
```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/instant-tw

# Fix permissions
chmod -R 755 /var/www/instant-tw
```

---

## 📞 Need Help?

- **Full Guide**: See `DEPLOYMENT_GUIDE.md`
- **Server Requirements**: See `SERVER_REQUIREMENTS.md`
- **Email Support**: wp@instant.tw

---

## 🎉 Success Checklist

- [ ] Site loads at your domain
- [ ] HTTPS working (green padlock)
- [ ] All pages load correctly
- [ ] Plugin buttons link to wp.instant.tw
- [ ] PM2 monitoring active
- [ ] Firewall configured

**Congratulations! Your WordPress Plugin Marketplace is LIVE! 🚀**
