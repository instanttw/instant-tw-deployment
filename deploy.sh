#!/bin/bash

# ==============================================
# Instant.tw Deployment Script
# ==============================================
# This script automates the deployment process
# Run this on your server after uploading files
# ==============================================

set -e  # Exit on any error

echo "======================================"
echo "  Instant.tw Deployment Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="instant-tw"
APP_DIR="/var/www/instant-tw"
NODE_VERSION="20"

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}→${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root or with sudo"
    exit 1
fi

# Step 1: Check Node.js version
print_info "Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_CURRENT=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_CURRENT" -ge "$NODE_VERSION" ]; then
        print_success "Node.js $(node -v) installed"
    else
        print_error "Node.js version must be $NODE_VERSION or higher. Current: $(node -v)"
        print_info "Run: curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -"
        print_info "Then: sudo apt-get install -y nodejs"
        exit 1
    fi
else
    print_error "Node.js not installed"
    exit 1
fi

# Step 2: Check PM2
print_info "Checking PM2..."
if command -v pm2 &> /dev/null; then
    print_success "PM2 installed"
else
    print_info "Installing PM2..."
    npm install -g pm2
    print_success "PM2 installed"
fi

# Step 3: Check Nginx
print_info "Checking Nginx..."
if command -v nginx &> /dev/null; then
    print_success "Nginx installed"
else
    print_info "Installing Nginx..."
    apt install nginx -y
    print_success "Nginx installed"
fi

# Step 4: Navigate to app directory
if [ ! -d "$APP_DIR" ]; then
    print_error "Directory $APP_DIR does not exist"
    print_info "Please upload your files to $APP_DIR first"
    exit 1
fi

cd $APP_DIR
print_success "Changed directory to $APP_DIR"

# Step 5: Install dependencies
print_info "Installing dependencies..."
if [ -f "package-lock.json" ]; then
    npm ci --production
else
    npm install --production
fi
print_success "Dependencies installed"

# Step 6: Check for .env file
if [ ! -f ".env.production" ]; then
    print_info "Creating .env.production file..."
    cat > .env.production <<EOF
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://instant.tw
EOF
    print_success ".env.production created (please update with your values)"
fi

# Step 7: Build application (if not already built)
if [ ! -d ".next" ]; then
    print_info "Building application..."
    npm run build
    print_success "Application built"
else
    print_success "Build files already exist"
fi

# Step 8: Stop existing PM2 process (if running)
print_info "Checking for existing PM2 processes..."
if pm2 list | grep -q "$APP_NAME"; then
    print_info "Stopping existing process..."
    pm2 stop $APP_NAME
    pm2 delete $APP_NAME
    print_success "Stopped existing process"
fi

# Step 9: Start application with PM2
print_info "Starting application with PM2..."
pm2 start npm --name "$APP_NAME" -- start
pm2 save
print_success "Application started"

# Step 10: Setup PM2 startup
print_info "Configuring PM2 startup..."
pm2 startup | tail -n 1 | bash
print_success "PM2 startup configured"

# Step 11: Check if Nginx config exists
if [ ! -f "/etc/nginx/sites-available/$APP_NAME" ]; then
    print_info "Nginx config not found. Creating basic config..."
    
    cat > /etc/nginx/sites-available/$APP_NAME <<'EOF'
server {
    listen 80;
    server_name instant.tw www.instant.tw;
    
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
EOF

    # Enable site
    ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    
    # Test Nginx config
    if nginx -t; then
        systemctl reload nginx
        print_success "Nginx configured and reloaded"
    else
        print_error "Nginx configuration error"
        exit 1
    fi
else
    print_success "Nginx config already exists"
    systemctl reload nginx
fi

# Step 12: Setup firewall (UFW)
print_info "Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 22 > /dev/null 2>&1
    ufw allow 80 > /dev/null 2>&1
    ufw allow 443 > /dev/null 2>&1
    ufw --force enable > /dev/null 2>&1
    print_success "Firewall configured"
else
    print_info "UFW not installed, skipping firewall setup"
fi

# Step 13: Show status
echo ""
echo "======================================"
echo "  Deployment Complete!"
echo "======================================"
echo ""

print_success "Application is running!"
echo ""
echo "Status:"
pm2 status
echo ""

# Step 14: Next steps
echo "Next steps:"
echo ""
echo "1. SSL Certificate (HTTPS):"
echo "   sudo apt install certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d instant.tw -d www.instant.tw"
echo ""
echo "2. Update .env.production with your values:"
echo "   nano $APP_DIR/.env.production"
echo ""
echo "3. Check if site is accessible:"
echo "   curl http://localhost:3000"
echo "   Visit: http://your-server-ip"
echo ""
echo "4. Monitor application:"
echo "   pm2 logs $APP_NAME"
echo "   pm2 monit"
echo ""
echo "5. After SSL is installed:"
echo "   Visit: https://instant.tw"
echo ""

print_success "Done! Your WordPress Plugin Marketplace is deployed! 🚀"
