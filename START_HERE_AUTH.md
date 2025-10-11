# 🎯 START HERE - Enable Login, Signup & Dashboard

## 📋 What You Have

✅ **Database:** `admin_wpinstant` with 17 tables created  
✅ **Credentials:** Hostname: localhost, User: admin_wpinstant, Password provided  
✅ **Requirements:** User signup → login → dashboard access (no email notifications)  

---

## 🚀 Quick Start (Choose One Method)

### **Method 1: Automated (5 Minutes) - RECOMMENDED**

```powershell
# 1. Open PowerShell in: C:\Users\PIETER\Downloads\instant-tw-deployment

# 2. Run the automated script:
.\enable-auth.ps1

# 3. Generate a secret key:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 4. Open .env file and paste the generated key:
#    Replace: NEXTAUTH_SECRET=instant-wp-secret-key-change-this...
#    With: NEXTAUTH_SECRET=<your-generated-key> I5oNV67vPpk4Grgr1SVvPhKoot8rJKeXYjprtwFx4V8=

# 5. Build and start:
npm run build
npm start

# 6. Test at http://localhost:3000
```

**Done! Skip to "Testing" section below.**

---

### **Method 2: Manual (10 Minutes)**

#### Step 1: Install Dependencies
```bash
npm install mysql2 bcryptjs
npm install --save-dev @types/bcryptjs
```

#### Step 2: Move Server Features
```powershell
# Copy these folders:
Copy-Item -Path "server-only-features\api" -Destination "app\api" -Recurse -Force
Copy-Item -Path "server-only-features\login" -Destination "app\login" -Recurse -Force
Copy-Item -Path "server-only-features\signup" -Destination "app\signup" -Recurse -Force
Copy-Item -Path "server-only-features\dashboard" -Destination "app\dashboard" -Recurse -Force
Copy-Item -Path "server-only-features\checkout" -Destination "app\checkout" -Recurse -Force
```

#### Step 3: Update next.config.ts
Open `next.config.ts` and **remove** this line:
```typescript
output: 'export',  // ← DELETE THIS LINE
```

Should look like:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', removed to enable server features
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
```

#### Step 4: Generate NEXTAUTH_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output.

#### Step 5: Update .env File
Open `.env` file and replace:
```env
NEXTAUTH_SECRET=instant-wp-secret-key-change-this-to-random-32-chars-minimum
```

With:
```env
NEXTAUTH_SECRET=<paste-your-generated-key-here>
```

#### Step 6: Build and Start
```bash
npm run build
npm start
```

---

## 🧪 Testing (2 Minutes)

### Test 1: Signup (Create Account)

1. Open http://localhost:3000
2. Click the **user avatar icon** (top right)
3. Modal opens → Click **"Sign Up"** tab
4. Fill in the form:
   ```
   Full Name: Test User
   Email: test@example.com
   Password: password123
   Confirm Password: password123
   ```
5. Click **"Create Account"**
6. ✅ Success message shows (no email sent - as you requested)

### Test 2: Login

1. In the same modal, click **"Login"** tab
2. Enter:
   ```
   Email: test@example.com
   Password: password123
   ```
3. Click **"Sign In"**
4. ✅ Modal closes and you're logged in

### Test 3: Dashboard Access

1. Navigate to: http://localhost:3000/dashboard
2. ✅ Dashboard page loads (you're logged in)
3. Click **"Logout"** in the header
4. Try accessing dashboard again: http://localhost:3000/dashboard
5. ✅ Redirected to login page (protected route working)

**All tests pass? Authentication is working!** 🎉

---

## 📊 What's Configured

### Database Connection
```
Host: localhost
Database: admin_wpinstant
User: admin_wpinstant
Password: QfJr8nDWKgXmaEZzB9g2
```

### Authentication Settings
- **Strategy:** JWT (JSON Web Tokens)
- **Session Duration:** 30 days
- **Password Hashing:** bcrypt (12 rounds)
- **Login Page:** /login
- **Signup Page:** /signup (embedded in login modal)
- **Dashboard:** /dashboard (protected)

### What Happens
1. **Signup:** User data saved to `users` table, NO email sent
2. **Login:** Password verified, JWT session created
3. **Dashboard:** Only accessible if JWT session valid
4. **Logout:** JWT session destroyed

---

## 🔧 Troubleshooting

### ❌ "Cannot find module 'mysql2'"
**Fix:**
```bash
npm install mysql2 bcryptjs
```

### ❌ "Database connection failed"
**Fix:**
1. Check MySQL is running:
   ```bash
   # Check service status
   sudo systemctl status mysql
   # Or on Windows, check in Services app
   ```
2. Test connection manually:
   ```bash
   mysql -u admin_wpinstant -p admin_wpinstant
   # Enter password: QfJr8nDWKgXmaEZzB9g2
   ```

### ❌ "NextAuth configuration error"
**Fix:**
1. Make sure `.env` file exists
2. Verify `NEXTAUTH_SECRET` is set (at least 32 characters)
3. Restart server after changing `.env`

### ❌ "Signup works but login fails"
**Fix:**
1. Check if user was created:
   ```sql
   USE admin_wpinstant;
   SELECT * FROM users WHERE email = 'test@example.com';
   ```
2. Verify password_hash is not empty
3. Check user status is 'active'

### ❌ "Dashboard redirects to login even after login"
**Fix:**
1. Clear browser cookies
2. Check browser console for errors (F12)
3. Verify NEXTAUTH_SECRET is correct
4. Restart the server

---

## 🌐 Production Deployment

### Update URLs for Production

Edit `.env` file:
```env
# Change from:
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# To:
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### Deploy with PM2

```bash
# Build for production
npm run build

# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name "instant-wp" -- start

# Save PM2 list
pm2 save

# Auto-start on reboot
pm2 startup
```

### Verify Production

1. Visit: https://your-domain.com
2. Test signup → login → dashboard flow
3. Check PM2 logs: `pm2 logs instant-wp`

---

## 📁 Important Files

**Configuration:**
- ✅ `.env` - Database credentials and secrets
- ✅ `lib/db.ts` - Database connection helper
- ✅ `next.config.ts` - Server features enabled

**Authentication:**
- ✅ `app/api/auth/[...nextauth]/route.ts` - NextAuth config
- ✅ `app/api/auth/signup/route.ts` - Signup API
- ✅ `app/login/page.tsx` - Login page (in auth modal)
- ✅ `app/dashboard/` - Protected dashboard

**Setup Scripts:**
- ✅ `enable-auth.ps1` - Automated setup
- ✅ `ENABLE_AUTH_GUIDE.md` - Detailed guide
- ✅ `AUTH_SETUP_COMPLETE.md` - Quick reference

---

## ✅ Final Checklist

**Setup:**
- [ ] Ran `.\enable-auth.ps1` or moved folders manually
- [ ] Generated NEXTAUTH_SECRET
- [ ] Updated `.env` with generated secret
- [ ] Installed packages: `npm install`
- [ ] Built project: `npm run build`
- [ ] Started server: `npm start`

**Testing:**
- [ ] Can access http://localhost:3000
- [ ] Signup form works
- [ ] Login form works
- [ ] Dashboard accessible after login
- [ ] Dashboard protected when logged out
- [ ] Logout works

**Verification:**
- [ ] User created in database (`SELECT * FROM users;`)
- [ ] No errors in console
- [ ] No email sent (as requested)

---

## 🎓 User Flow Summary

```
┌─────────────────────────────────────────────────┐
│ 1. User clicks "Sign In" button/avatar         │
│    → Auth modal opens                           │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 2. User clicks "Sign Up" tab                    │
│    → Fills name, email, password                │
│    → Clicks "Create Account"                    │
│    → User saved to database (NO EMAIL SENT)     │
│    → Success message shown                      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 3. User switches to "Login" tab                 │
│    → Enters email and password                  │
│    → Clicks "Sign In"                           │
│    → Password verified against database         │
│    → JWT session created                        │
│    → Modal closes                               │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 4. User navigates to /dashboard                 │
│    → Session checked                            │
│    → Dashboard page loads                       │
│    → User sees their data                       │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 5. User clicks "Logout"                         │
│    → JWT session destroyed                      │
│    → Redirected to homepage                     │
│    → Dashboard now requires login again         │
└─────────────────────────────────────────────────┘
```

---

## 🎉 You're All Set!

**To enable authentication:**
1. Run: `.\enable-auth.ps1`
2. Generate and set NEXTAUTH_SECRET
3. Build: `npm run build`
4. Start: `npm start`
5. Test: Create account → Login → Access dashboard

**Everything is ready to go!** 🚀

---

## 📚 Additional Resources

**Detailed Documentation:**
- `ENABLE_AUTH_GUIDE.md` - Complete step-by-step guide (15 min read)
- `AUTH_SETUP_COMPLETE.md` - Quick reference
- `addition1.md` - Original requirements

**Database Schema:**
- `database/schema.sql` - All 17 tables structure
- `database/IMPORT_GUIDE.md` - Database import instructions

**Need Help?**
1. Check troubleshooting section above
2. Read `ENABLE_AUTH_GUIDE.md` for details
3. Verify database connection: `mysql -u admin_wpinstant -p`
4. Check application logs: `pm2 logs instant-wp`
