# 🌐 Deploy WITHOUT Terminal Access (DirectAdmin/cPanel)

Deploy using only **File Manager** or **FTP** - no SSH/terminal needed!

---

## 📋 What You'll Use

- ✅ Your local Windows computer
- ✅ DirectAdmin or cPanel File Manager
- ✅ Or FTP client (FileZilla)
- ✅ DirectAdmin Node.js App Manager

---

## 🚀 DEPLOYMENT STEPS

### **STEP 1: Build Project Locally (On Your Computer)**

Open **PowerShell** in the project folder:

```powershell
# Navigate to project
cd C:\Users\PIETER\Downloads\instant-tw-deployment

# Run setup script
.\enable-auth.ps1

# Install dependencies
npm install

# Build for production
npm run build
```

**Wait for:** ✓ Compiled successfully

This creates a `.next` folder with your production build.

---

### **STEP 2: Create Upload Package**

We need to upload these folders/files to your VPS:

**Required Files/Folders:**
- ✅ `.next/` folder (the built application)
- ✅ `public/` folder
- ✅ `node_modules/` folder (yes, upload this)
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `.env` file
- ✅ `next.config.ts`

**Optional but recommended:**
- ✅ `app/` folder
- ✅ `components/` folder
- ✅ `lib/` folder
- ✅ `config/` folder

**Create a deployment folder to make uploading easier:**

```powershell
# Create deployment package folder
mkdir C:\Users\PIETER\Downloads\instant-deploy-package

# Copy essential files
Copy-Item -Path ".next" -Destination "C:\Users\PIETER\Downloads\instant-deploy-package\.next" -Recurse
Copy-Item -Path "public" -Destination "C:\Users\PIETER\Downloads\instant-deploy-package\public" -Recurse
Copy-Item -Path "node_modules" -Destination "C:\Users\PIETER\Downloads\instant-deploy-package\node_modules" -Recurse
Copy-Item -Path "package.json" -Destination "C:\Users\PIETER\Downloads\instant-deploy-package\"
Copy-Item -Path "package-lock.json" -Destination "C:\Users\PIETER\Downloads\instant-deploy-package\"
Copy-Item -Path ".env" -Destination "C:\Users\PIETER\Downloads\instant-deploy-package\"
Copy-Item -Path "next.config.ts" -Destination "C:\Users\PIETER\Downloads\instant-deploy-package\"
```

---

### **STEP 3: Upload via DirectAdmin File Manager**

#### **Option A: Using DirectAdmin File Manager**

1. **Login to DirectAdmin:**
   - Go to: `https://your-server.com:2222`
   - Login with your credentials

2. **Navigate to File Manager:**
   - Click **"File Manager"** in main menu
   - Navigate to your domain folder (usually `domains/instant.tw/public_html`)

3. **Create Node.js App Folder:**
   - Create a new folder: `nodejs-app` (or any name)
   - Enter that folder

4. **Upload Files:**
   - Click **"Upload"** button
   - Upload the contents from `instant-deploy-package` folder
   - This may take 10-30 minutes depending on file size

#### **Option B: Using FileZilla (FTP)**

1. **Download FileZilla:**
   - Download from: https://filezilla-project.org

2. **Connect to Your VPS:**
   - Host: `your-server.com` or VPS IP
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: `21` (FTP) or `22` (SFTP)

3. **Upload Files:**
   - Navigate to: `/domains/instant.tw/public_html/nodejs-app/`
   - Upload all files from `instant-deploy-package` folder
   - This may take 10-30 minutes

---

### **STEP 4: Configure Node.js App in DirectAdmin**

1. **Go to Node.js Selector:**
   - In DirectAdmin, find **"Node.js Selector"** or **"Node.js Setup"**
   - (Location varies by DirectAdmin version)

2. **Create New Node.js Application:**
   - Click **"Create Application"**
   - Fill in:
     - **Node.js Version:** 18.x or 20.x (latest LTS)
     - **Application Mode:** Production
     - **Application Root:** `/domains/instant.tw/public_html/nodejs-app`
     - **Application URL:** `instant.tw` (your domain)
     - **Application Startup File:** `node_modules/next/dist/bin/next`
     - **Environment Variables:** (Add these one by one)
       ```
       NODE_ENV=production
       PORT=3000
       ```

3. **Set Custom Start Command:**
   - Startup command: `npm start`
   - Or: `node node_modules/next/dist/bin/next start`

4. **Click "Create" or "Save"**

5. **Start the Application:**
   - Click **"Start"** or **"Restart"** button

---

### **STEP 5: Alternative - Create startup.sh File**

If DirectAdmin doesn't have Node.js Selector, create a startup file:

1. **Create file:** `startup.sh` in your app folder
2. **Content:**
```bash
#!/bin/bash
cd /home/username/domains/instant.tw/public_html/nodejs-app
export NODE_ENV=production
npm start
```

3. **Make it executable** (if you can run commands):
   - Or contact hosting support to make it executable

---

### **STEP 6: Configure Domain/Subdomain**

1. **In DirectAdmin, go to Domain Setup**
2. **Add/Edit your domain:** `instant.tw`
3. **Point to Node.js application:**
   - Some hosts call this "Proxy" or "Reverse Proxy"
   - Point domain to: `localhost:3000`
   - Or configure in "Domain Pointer" or "Subdomain" settings

---

### **STEP 7: Setup SSL Certificate**

1. **In DirectAdmin:**
   - Go to **"SSL Certificates"**
   - Select **"Let's Encrypt"** or **"Free SSL"**
   - Select domain: `instant.tw`
   - Click **"Generate Certificate"**
   - Wait for SSL to activate

2. **Enable HTTPS Redirect:**
   - In **"Domain Management"**
   - Enable **"Force SSL/HTTPS"** option

---

### **STEP 8: Test Your Live Website!**

1. Visit: **https://instant.tw**
2. Click user avatar icon
3. Sign up
4. Login
5. Visit: **https://instant.tw/dashboard**

**✅ Dashboard loads? YOU'RE LIVE!**

---

## 🎯 Simplified Alternative - Pre-Built Package

**I can create a pre-built production package for you:**

Let me know and I'll create a zip file with everything built and ready to upload!

---

## 📦 What Gets Uploaded

**Total size:** ~300-500 MB (mostly node_modules)

**Essential folders:**
- `.next/` (80-100 MB) - Built application
- `node_modules/` (200-300 MB) - Dependencies
- `public/` (5-10 MB) - Static files

**Small files:**
- `package.json` (2 KB)
- `.env` (1 KB)
- `next.config.ts` (1 KB)

---

## 🔧 Troubleshooting Without Terminal

### **App Not Starting?**

**Check in DirectAdmin:**
1. Node.js App status (should show "Running")
2. Error logs (usually under Node.js App section)
3. Restart the application

### **Database Connection Issues?**

**Verify in .env file uploaded:**
```env
DATABASE_URL=mysql://admin_wpinstant:QfJr8nDWKgXmaEZzB9g2@localhost:3306/admin_wpinstant
```

### **502 Bad Gateway?**

**Possible causes:**
1. Node.js app not running - Restart it in DirectAdmin
2. Wrong startup command - Check Node.js App settings
3. Port conflict - Make sure port 3000 is available

### **Files Not Uploading?**

1. Upload in smaller batches
2. Compress as ZIP and upload, then extract in File Manager
3. Use FTP client instead of File Manager

---

## 💡 DirectAdmin Doesn't Have Node.js Selector?

**Contact Your Hosting Provider:**

Send them this message:
```
Hi,

I need to deploy a Next.js application on my VPS. 
Could you please:
1. Install Node.js version 18+ on my account
2. Enable Node.js app hosting for my domain: instant.tw
3. Or provide instructions on how to deploy a Node.js app

The app needs to run on port 3000 and be proxied to my domain.

Thank you!
```

**Alternative:** Ask them to install **Passenger** or **PM2** for Node.js apps.

---

## 📊 DirectAdmin Setup Checklist

- [ ] Built project locally (`npm run build`)
- [ ] Created upload package
- [ ] Uploaded all files to VPS
- [ ] Node.js app configured in DirectAdmin
- [ ] Domain pointed to Node.js app
- [ ] SSL certificate installed
- [ ] App started/running
- [ ] Tested signup online
- [ ] Tested login online
- [ ] Tested dashboard access

---

## 🎁 Want a Pre-Built Package?

I can create a ZIP file with everything ready:
1. All files built for production
2. Optimized for upload
3. Ready to extract and run
4. Includes setup instructions

Just let me know!

---

## 🆘 Still Stuck?

**Contact your hosting provider and ask:**

1. **"How do I deploy a Node.js application?"**
2. **"Can you install my Next.js app?"**
3. **"Do you support Node.js hosting?"**

**Many hosts offer free setup assistance!**

---

## ✅ Alternative: Build Locally, Run on VPS

**Simplest approach without terminal:**

1. Build everything locally (done ✓)
2. Upload built files via FTP
3. Use DirectAdmin Node.js manager
4. Start the app
5. Configure domain proxy
6. Done!

**This is the standard approach for shared hosting!**

---

## 🎉 Once Deployed

Users worldwide can:
- ✅ Visit https://instant.tw
- ✅ Sign up for accounts
- ✅ Login
- ✅ Access dashboard

**Your authentication will be LIVE!** 🌐🚀

---

**Need help with DirectAdmin setup?** Share your DirectAdmin interface screenshots and I can provide specific instructions!
