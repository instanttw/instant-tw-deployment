# Upload Guide - What Goes Where

## 📁 **Folder Structure to Upload**

### **FROM (Your Computer):**
```
C:\Users\PIETER\Downloads\instant-tw-deployment\
│
├── app/                    ✅ UPLOAD
├── components/             ✅ UPLOAD
├── lib/                    ✅ UPLOAD
├── public/                 ✅ UPLOAD
├── config/                 ✅ UPLOAD
├── types/                  ✅ UPLOAD
├── messages/               ✅ UPLOAD
├── database/               ✅ UPLOAD
│
├── .env.production         ✅ UPLOAD ⚠️ IMPORTANT!
├── package.json            ✅ UPLOAD
├── package-lock.json       ✅ UPLOAD
├── next.config.ts          ✅ UPLOAD
├── tsconfig.json           ✅ UPLOAD
├── tailwind.config.ts      ✅ UPLOAD
├── postcss.config.mjs      ✅ UPLOAD
├── eslint.config.mjs       ✅ UPLOAD
├── i18n.ts                 ✅ UPLOAD
├── next-env.d.ts           ✅ UPLOAD
│
├── node_modules/           ❌ DO NOT UPLOAD
├── .next/                  ❌ DO NOT UPLOAD
├── out/                    ❌ DO NOT UPLOAD
└── *.md files              ⚠️ OPTIONAL (docs only)
```

---

## 📍 **TO (Your VPS - DirectAdmin):**

### **Option 1: DirectAdmin File Manager Upload**

**Path depends on your DirectAdmin setup. Common locations:**

```
/home/username/domains/wp.instant.tw/public_html/
```

Or:

```
/home/username/public_html/domains/wp.instant.tw/
```

Or:

```
/var/www/wp.instant.tw/
```

**How to find YOUR path:**
1. Login to DirectAdmin
2. Go to "File Manager"
3. Navigate to wp.instant.tw folder
4. Look at the path shown at the top
5. That's where you upload!

---

## 🚀 **Upload Methods**

### **Method 1: FTP/SFTP (FileZilla) - RECOMMENDED**

**Using FileZilla:**

1. **Connect to your VPS:**
   - Host: `your-vps-ip` or `wp.instant.tw`
   - Username: Your SSH username
   - Password: Your SSH password
   - Port: `22` (SFTP) or `21` (FTP)

2. **Navigate to your site directory:**
   - Usually: `/home/username/domains/wp.instant.tw/public_html/`
   - Or check DirectAdmin for exact path

3. **Upload these folders and files:**
   - Select folders: app/, components/, lib/, public/, config/, types/, messages/, database/
   - Select files: .env.production, package.json, package-lock.json, next.config.ts, tsconfig.json, etc.
   - Right-click → Upload
   - Wait for upload to complete (5-10 minutes depending on connection)

4. **Verify upload:**
   - Check all folders appear in remote side
   - Verify file count matches
   - Check .env.production is there

---

### **Method 2: DirectAdmin File Manager**

1. **Login to DirectAdmin**
2. Click "File Manager"
3. Navigate to wp.instant.tw directory
4. Click "Upload Files"
5. **Upload in batches** (DirectAdmin may have limits):
   - First: Upload all .js, .ts, .json files
   - Then: Upload app/ folder
   - Then: Upload components/ folder
   - Continue for each folder

**Note:** This method is slower but works if you don't have FTP access.

---

### **Method 3: Git (Advanced)**

```bash
# On your local machine
cd C:\Users\PIETER\Downloads\instant-tw-deployment
git init
git add .
git commit -m "Initial deployment"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Then on VPS via SSH:
cd /home/username/domains/wp.instant.tw/public_html/
git clone YOUR_REPO_URL .
```

---

## 🎯 **After Upload, Your VPS Should Have:**

```
/home/username/domains/wp.instant.tw/public_html/
│
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── login/
│   └── ... (all app routes)
│
├── components/
│   ├── auth/
│   ├── cookie-consent/
│   ├── layout/
│   └── ... (all components)
│
├── lib/
│   ├── cookie-utils.ts
│   ├── cookie-consent-context.tsx
│   ├── db.ts
│   └── ... (all lib files)
│
├── public/
├── config/
├── types/
├── messages/
├── database/
│
├── .env.production          ⚠️ CHECK THIS!
├── package.json
├── package-lock.json
└── ... (all config files)
```

---

## ✅ **Verification Checklist**

After uploading, SSH into your VPS and verify:

```bash
# SSH into VPS
ssh your-user@your-vps-ip

# Navigate to project
cd /home/username/domains/wp.instant.tw/public_html/

# List files
ls -la

# You should see:
# app/
# components/
# lib/
# public/
# .env.production
# package.json
# etc.

# Check .env.production exists
cat .env.production

# Should show your database configuration
```

---

## 🗂️ **Upload Size Reference**

**Approximate sizes:**
- app/ → ~5-10 MB
- components/ → ~2-5 MB
- lib/ → ~1-2 MB
- public/ → ~5-10 MB (images, fonts)
- Config files → <1 MB

**Total:** ~50-100 MB (without node_modules)

**node_modules/** → ~300-500 MB ❌ **DON'T UPLOAD THIS!**
We'll install it on the server with `npm install`

---

## 🚨 **Common Upload Issues**

### **Issue: Upload too slow**
**Solution:** Use FTP/SFTP instead of DirectAdmin File Manager

### **Issue: .env.production not uploading**
**Solution:** Files starting with . are hidden. In FileZilla: Server → Force showing hidden files

### **Issue: Upload times out**
**Solution:** Upload folders one at a time, not all at once

### **Issue: Permission denied**
**Solution:** Check you have write permissions in the directory

---

## 📞 **Need Your Exact Upload Path?**

**Tell me:**
1. Your DirectAdmin username
2. Screenshot of DirectAdmin File Manager showing the path

I'll give you the exact upload path!

---

## 🎯 **Next Steps After Upload**

Once files are uploaded:

1. SSH into VPS
2. Navigate to upload directory
3. Run: `npm install`
4. Run: `npm run build`
5. Start with PM2

**See:** `DEPLOY_NOW.md` for complete instructions!
