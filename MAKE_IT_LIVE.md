# 🚀 Make Authentication Live - Step by Step

You've generated your NEXTAUTH_SECRET! Now follow these exact steps:

---

## ✅ Step 1: Update .env File (DONE!)

Your `.env` file is now updated with:
```
NEXTAUTH_SECRET=I5oNV67vPpk4Grgr1SVvPhKoot8rJKeXYjprtwFx4V8=
```

---

## 🔧 Step 2: Run Setup Script

Open **PowerShell** and run:

```powershell
cd C:\Users\PIETER\Downloads\instant-tw-deployment
.\enable-auth.ps1
```

This will:
- ✅ Install mysql2 and bcryptjs packages
- ✅ Move authentication features from server-only-features to app folder
- ✅ Update next.config.ts to enable server features

**Expected output:**
```
=================================
Instant WP - Enable Authentication
=================================

Step 1: Installing required packages...
Step 2: Moving server features to app folder...
Step 3: Updating next.config.ts...

✅ Setup Complete!
```

---

## 🏗️ Step 3: Build the Application

```powershell
npm run build
```

**Wait for build to complete** (~30-60 seconds)

**Expected output:**
```
✓ Compiled successfully
✓ Generating static pages (46/46)
Route (app)                Size    First Load JS
...
```

---

## 🚀 Step 4: Start the Server

```powershell
npm start
```

**Expected output:**
```
> wp-website@0.1.0 start
> next start

  ▲ Next.js 15.5.4
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

✓ Ready in 2s
```

**Keep this terminal window open!**

---

## 🧪 Step 5: Test Signup & Login

### Test 1: Create Account (Signup)

1. Open browser: **http://localhost:3000**
2. Click the **user avatar icon** (top right corner)
3. Modal opens → Click **"Sign Up"** tab
4. Fill in:
   ```
   Full Name: Test User
   Email: test@example.com
   Password: password123
   Confirm Password: password123
   ```
5. Click **"Create Account"**
6. ✅ Should see: "Account created successfully. Please login."

### Test 2: Login

1. In the modal, click **"Login"** tab
2. Enter:
   ```
   Email: test@example.com
   Password: password123
   ```
3. Click **"Sign In"**
4. ✅ Modal closes and you're logged in!

### Test 3: Access Dashboard

1. Navigate to: **http://localhost:3000/dashboard**
2. ✅ Dashboard page loads!
3. You should see your user information

### Test 4: Logout

1. Click **"Logout"** button in header
2. Try accessing dashboard: **http://localhost:3000/dashboard**
3. ✅ Redirected to login page (protected route working!)

---

## 🎉 Success! Authentication is LIVE

If all tests pass, your authentication system is working!

**Users can now:**
- ✅ Sign up for accounts
- ✅ Login with email/password
- ✅ Access their dashboard
- ✅ Logout securely

---

## 🐛 Troubleshooting

### Problem: "Cannot find module 'mysql2'"

**Solution:**
```powershell
npm install mysql2 bcryptjs
```

### Problem: Build fails

**Check if `output: 'export'` was removed from `next.config.ts`:**

```typescript
// Should look like this:
const nextConfig: NextConfig = {
  // output: 'export', ← REMOVED
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

### Problem: "Database connection failed"

**Test database connection:**
```bash
mysql -u admin_wpinstant -p admin_wpinstant
# Enter password: QfJr8nDWKgXmaEZzB9g2
```

If this fails, check if MySQL is running.

### Problem: Signup works but login fails

**Check if user was created:**
```sql
USE admin_wpinstant;
SELECT * FROM users WHERE email = 'test@example.com';
```

Should show one row with hashed password.

---

## 📊 Verify in Database

**Check that user was created:**

```sql
-- Connect to MySQL
mysql -u admin_wpinstant -p admin_wpinstant

-- View users
SELECT id, name, email, role, status, created_at FROM users;

-- Should see your test user!
```

---

## 🌐 Make it Live on Your Domain

**When ready for production:**

1. Update `.env` file:
```env
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

2. Rebuild:
```bash
npm run build
```

3. Deploy with PM2:
```bash
npm install -g pm2
pm2 start npm --name "instant-wp" -- start
pm2 save
pm2 startup
```

4. Configure Nginx/Apache to proxy to port 3000

---

## 📝 Quick Command Reference

```powershell
# Setup
cd C:\Users\PIETER\Downloads\instant-tw-deployment
.\enable-auth.ps1

# Build & Start
npm run build
npm start

# Test
# Open: http://localhost:3000
# Signup → Login → Dashboard

# Deploy with PM2
pm2 start npm --name "instant-wp" -- start
pm2 logs instant-wp
```

---

## ✅ Checklist

- [x] NEXTAUTH_SECRET generated and added to .env
- [ ] Ran `.\enable-auth.ps1`
- [ ] Built successfully: `npm run build`
- [ ] Server started: `npm start`
- [ ] Tested signup
- [ ] Tested login
- [ ] Tested dashboard access
- [ ] Tested logout

---

🎊 **You're all set! Authentication is ready to use!** 🚀
