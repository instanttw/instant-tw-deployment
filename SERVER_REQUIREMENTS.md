# Server Requirements for Instant.tw

## 🖥️ Minimum Requirements

### Operating System
- **Linux**: Ubuntu 20.04+, Debian 10+, CentOS 7+, or any modern Linux distribution
- **Windows Server**: 2016+ (with Node.js support)
- **macOS**: 10.15+ (for local testing/development)

### Software
- **Node.js**: 18.17 or higher (20.x LTS recommended)
- **npm**: 9.x or higher (comes with Node.js)
- **Process Manager**: PM2 (recommended) or systemd

### Hardware
- **CPU**: 1 vCore minimum (2+ recommended for production)
- **RAM**: 512MB minimum, **1GB+ recommended**
- **Disk Space**: 500MB minimum, **2GB+ recommended**
- **Network**: 100Mbps+ connection

---

## 💼 Recommended Production Setup

### Cloud Providers (Recommended Specs)

#### DigitalOcean
- **Droplet**: Basic Droplet $6/month
  - 1 vCPU
  - 1GB RAM
  - 25GB SSD
  - 1TB Transfer

#### AWS Lightsail
- **Instance**: $5/month plan
  - 1 vCPU
  - 512MB RAM (upgrade to $10/month with 1GB recommended)
  - 20GB SSD
  - 1TB Transfer

#### Vultr
- **Cloud Compute**: $6/month
  - 1 vCPU
  - 1GB RAM
  - 25GB SSD
  - 1TB Bandwidth

#### Linode (Akamai)
- **Nanode**: $5/month
  - 1 CPU Core
  - 1GB RAM
  - 25GB SSD
  - 1TB Transfer

#### Hetzner
- **CX11**: €4.15/month (~$4.50)
  - 1 vCPU
  - 2GB RAM
  - 20GB SSD
  - 20TB Traffic

---

## ⚡ Recommended for Different Traffic Levels

### Low Traffic (< 10,000 visits/month)
- **CPU**: 1 vCore
- **RAM**: 1GB
- **Disk**: 25GB SSD
- **Estimated Cost**: $5-6/month

**Suitable for:**
- New launches
- Testing production
- Small audiences

---

### Medium Traffic (10,000 - 100,000 visits/month)
- **CPU**: 2 vCores
- **RAM**: 2GB
- **Disk**: 50GB SSD
- **Estimated Cost**: $12-18/month

**Suitable for:**
- Growing businesses
- Active user base
- Multiple plugins downloaded daily

---

### High Traffic (100,000+ visits/month)
- **CPU**: 4 vCores
- **RAM**: 4GB+
- **Disk**: 80GB+ SSD
- **Estimated Cost**: $24-40/month
- **Load Balancer**: Consider adding

**Suitable for:**
- Established marketplace
- High download volumes
- Multiple concurrent users

---

## 🔧 Software Requirements

### Required

**1. Node.js** (v18.17+ or v20.x LTS)
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node -v  # Should show v20.x.x
npm -v   # Should show 10.x.x+
```

**2. Process Manager - PM2** (recommended)
```bash
sudo npm install -g pm2
```

**3. Reverse Proxy - Nginx or Apache**
```bash
# Nginx (recommended)
sudo apt install nginx -y

# Or Apache
sudo apt install apache2 -y
```

---

### Optional but Recommended

**4. Git** (for easier updates)
```bash
sudo apt install git -y
```

**5. Certbot** (for free SSL)
```bash
sudo apt install certbot python3-certbot-nginx -y
```

**6. Firewall** (UFW on Ubuntu)
```bash
sudo apt install ufw -y
```

**7. Monitoring Tools**
```bash
# htop for resource monitoring
sudo apt install htop -y

# ncdu for disk usage
sudo apt install ncdu -y
```

---

## 🌐 Network Requirements

### Ports to Open

**Essential:**
- **80** (HTTP) - For Let's Encrypt and HTTP to HTTPS redirect
- **443** (HTTPS) - For secure website access
- **22** (SSH) - For server management (consider changing default)

**Internal Only:**
- **3000** (Node.js) - Application port (should not be publicly accessible)

### Firewall Configuration
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## 🗄️ Database Requirements

### Current (Not Required)
The application currently doesn't use a database. All data is stored in configuration files.

### Future (When Needed)
If you add user authentication, payment processing, or dynamic content:

**PostgreSQL** (Recommended)
- Version: 12+
- RAM: Add 256MB-512MB to server
- Disk: Add 5GB+

**MySQL/MariaDB** (Alternative)
- Version: 8.0+ / 10.5+
- RAM: Add 256MB-512MB to server
- Disk: Add 5GB+

---

## 💾 Storage Requirements

### Current Deployment
- **Application Files**: ~100MB
- **Node Modules**: ~300MB
- **Build Files (.next)**: ~50MB
- **Static Assets**: ~20MB
- **Logs**: ~10MB (grows over time)
- **Total**: ~500MB

### Recommended Allocation
- **System**: 5GB
- **Application**: 2GB
- **Logs**: 1GB
- **Updates/Backups**: 2GB
- **Free Space**: 5GB+
- **Total**: 15GB+ recommended

---

## 🚀 Platform-Specific Requirements

### Vercel (Easiest - No Server Needed)
**What You Get:**
- Automatic scaling
- Global CDN
- SSL included
- Zero configuration
- Serverless functions

**Requirements:**
- Git repository (GitHub, GitLab, Bitbucket)
- Vercel account (free tier available)
- No server management needed!

**Free Tier Limits:**
- 100GB bandwidth/month
- Unlimited sites
- Commercial use allowed

**Cost:**
- **Free**: $0/month (perfect for starting)
- **Pro**: $20/month (for more bandwidth/features)

**Recommended**: ⭐⭐⭐⭐⭐ Perfect for Next.js

---

### Netlify (Alternative)
**Requirements:**
- Git repository
- Netlify account

**Free Tier:**
- 100GB bandwidth/month
- 300 build minutes/month

**Cost:**
- **Free**: $0/month
- **Pro**: $19/month

---

### Cloudflare Pages (Alternative)
**Requirements:**
- Git repository
- Cloudflare account

**Free Tier:**
- Unlimited bandwidth
- Unlimited requests

**Cost:**
- **Free**: $0/month
- **Pro**: $20/month (for more features)

---

### Railway (Alternative)
**Requirements:**
- Git repository or Docker
- Railway account

**Free Tier:**
- $5 free credit/month
- Pay for usage

**Cost:**
- Usage-based pricing
- ~$5-20/month typical

---

### Traditional VPS

**Hosting Providers Comparison:**

| Provider | Plan | CPU | RAM | Storage | Bandwidth | Price |
|----------|------|-----|-----|---------|-----------|-------|
| Hetzner | CX11 | 1 | 2GB | 20GB | 20TB | $4.50 |
| Vultr | Basic | 1 | 1GB | 25GB | 1TB | $6 |
| DigitalOcean | Basic | 1 | 1GB | 25GB | 1TB | $6 |
| Linode | Nanode | 1 | 1GB | 25GB | 1TB | $5 |
| AWS Lightsail | Small | 1 | 512MB | 20GB | 1TB | $5 |
| Contabo | VPS-S | 4 | 8GB | 200GB | 32TB | $7 |

**Recommended**: Hetzner (best value) or DigitalOcean (best UI/support)

---

## 🔍 Performance Benchmarks

### Expected Performance

**With Recommended Setup (1GB RAM, 1 vCore):**
- **Page Load**: < 1 second
- **Time to First Byte**: < 200ms
- **Concurrent Users**: 50-100
- **Requests/Second**: 100+

**With High-End Setup (4GB RAM, 4 vCore):**
- **Page Load**: < 500ms
- **Time to First Byte**: < 100ms
- **Concurrent Users**: 500+
- **Requests/Second**: 1000+

---

## 📊 Monitoring Requirements

### Disk Space Monitoring
```bash
# Check disk usage
df -h

# Check folder sizes
du -sh /var/www/instant-tw/*
```

### RAM Monitoring
```bash
# Check memory usage
free -h

# Real-time monitoring
htop
```

### CPU Monitoring
```bash
# Check CPU usage
top

# Or use htop
htop
```

### Application Monitoring
```bash
# With PM2
pm2 monit
pm2 status
pm2 logs instant-tw
```

---

## ⚙️ Recommended Server Configuration

### For Ubuntu 20.04/22.04 (Most Common)

**Complete Setup Script:**
```bash
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Install useful tools
sudo apt install git htop ncdu -y

# Configure firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Optimize for Node.js
echo "fs.file-max = 65536" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

echo "Setup complete! Node.js version:"
node -v
```

Save as `server-setup.sh`, upload to server, and run:
```bash
chmod +x server-setup.sh
./server-setup.sh
```

---

## ✅ Requirements Checklist

Before deploying, verify:

### Server Access
- [ ] SSH access to server
- [ ] Sudo/root privileges
- [ ] Domain DNS configured

### Software Installed
- [ ] Node.js 18.17+ installed
- [ ] npm 9.x+ installed
- [ ] PM2 installed (or alternative)
- [ ] Nginx or Apache installed

### Server Configuration
- [ ] Firewall configured (ports 80, 443, 22)
- [ ] Swap file created (if RAM < 2GB)
- [ ] Time zone set correctly
- [ ] Hostname configured

### Domain & SSL
- [ ] Domain pointing to server IP
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] HTTPS working

### Application
- [ ] All files uploaded
- [ ] Dependencies installed
- [ ] Build completed
- [ ] Environment variables set
- [ ] Application running
- [ ] Nginx proxy configured

---

## 🎯 Summary

### Absolute Minimum (Budget)
- $5/month VPS
- 512MB RAM
- 1 CPU
- Node.js + PM2 + Nginx

### Recommended (Production)
- $6-12/month VPS
- 1-2GB RAM
- 1-2 CPU
- Node.js + PM2 + Nginx + SSL

### Easiest (No Server)
- Vercel - Free tier
- Zero server management
- Best for Next.js
- Perfect for starting

---

**Ready to deploy? Check DEPLOYMENT_GUIDE.md for step-by-step instructions!**
