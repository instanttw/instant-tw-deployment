# ⚡ QUICK PRODUCTION DEPLOYMENT

Deploy to your **VPS** so users online can signup/login.

---

## 🎯 What's Your Domain?

**Replace `instant.tw` with YOUR domain in `.env` file:**
- instant.tw
- wp.instant.tw
- your-domain.com
- Or whatever your production domain is

---

## 📝 QUICK STEPS

### **1. Update .env (Already Done!)**

I've updated `.env` to use `https://instant.tw`

**If your domain is different**, edit `.env` and change:
```env
NEXTAUTH_URL=https://YOUR-ACTUAL-DOMAIN.com
NEXT_PUBLIC_APP_URL=https://YOUR-ACTUAL-DOMAIN.com
```

---

### **2. Run Setup (Local Machine)**

```powershell
cd C:\Users\PIETER\Downloads\instant-tw-deployment
.\enable-auth.ps1
```

Wait for: ✅ Setup Complete!

---

### **3. Upload to VPS**

**Upload entire `instant-tw-deployment` folder to your VPS:**

Using FileZilla/WinSCP:
- Connect to your VPS
- Upload to: `/var/www/instant-tw/` (or any folder)

**DO NOT upload:**
- ❌ `node_modules/` folder
- ❌ `.next/` folder
- ❌ `out/` folder

---

### **4. SSH into VPS**

```bash
ssh root@your-vps-ip
# Or: ssh your-username@your-vps-ip
```

---

### **5. Install & Build on VPS**

```bash
# Go to project folder
cd /var/www/instant-tw

# Install packages
npm install

# Build for production
npm run build
```

---

### **6. Start with PM2**

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "instant-wp" -- start

# Save configuration
pm2 save

# Auto-start on reboot
pm2 startup
# (run the command PM2 shows you)
```

---

### **7. Configure Web Server**

#### **Nginx Configuration:**

```bash
sudo nano /etc/nginx/sites-available/instant-tw
```

**Add:**
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

**Enable:**
```bash
sudo ln -s /etc/nginx/sites-available/instant-tw /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### **8. Install SSL (FREE)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d instant.tw -d www.instant.tw

# Choose option 2: Redirect HTTP to HTTPS
```

---

### **9. Test Production**

Visit: **https://instant.tw** (your domain)

1. Click user avatar icon
2. Sign up with real email
3. Login
4. Visit: https://instant.tw/dashboard
5. ✅ Dashboard loads = **LIVE!**

---

## ✅ Quick Checklist

- [ ] .env has your production domain
- [ ] Ran `.\enable-auth.ps1` locally
- [ ] Uploaded to VPS
- [ ] Ran `npm install` on VPS
- [ ] Ran `npm run build` on VPS
- [ ] Started with PM2
- [ ] Configured Nginx/Apache
- [ ] Installed SSL certificate
- [ ] Tested signup/login online

---

## 🐛 Quick Troubleshooting

**Check if app is running:**
```bash
pm2 status
pm2 logs instant-wp
```

**Restart if needed:**
```bash
pm2 restart instant-wp
```

**Check database:**
```bash
mysql -u admin_wpinstant -p admin_wpinstant -e "SHOW TABLES;"
```

**View logs:**
```bash
pm2 logs instant-wp --lines 50
```

---

## 🎉 Done!

Users can now visit **https://instant.tw** and:
- ✅ Sign up for accounts
- ✅ Login
- ✅ Access dashboard

**Full guide:** See `PRODUCTION_DEPLOYMENT.md` for detailed instructions.

🚀 **Your authentication is LIVE!**
