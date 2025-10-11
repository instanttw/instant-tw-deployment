# ✅ Authentication Setup - Ready to Enable

## 📋 Current Status

**Database:** ✅ Created (`admin_wpinstant`)  
**Tables:** ✅ 17 tables created  
**Files:** ✅ All configuration files ready  
**Credentials:** ✅ Provided

---

## 🚀 Quick Setup (5 Minutes)

### **Option 1: Automated Setup (Recommended)**

```powershell
# Run in PowerShell from project directory:
.\enable-auth.ps1
```

This script will:
1. Install required packages (mysql2, bcryptjs)
2. Move server features to app folder
3. Update next.config.ts

### **Option 2: Manual Setup**

Follow the complete guide in `ENABLE_AUTH_GUIDE.md`

---

## 🔐 Important: Generate NEXTAUTH_SECRET

**Before starting the server, update `.env` file:**

```bash
# Generate a secure secret:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Copy the output and paste it into .env file:
NEXTAUTH_SECRET=your-generated-secret-here
```

---

## 🎯 What You Get

After setup, users can:

✅ **Sign Up** - Create account (no email sent as requested)  
✅ **Login** - Access with email/password  
✅ **Dashboard** - View after successful login  
✅ **Logout** - End session  
✅ **Protected Routes** - Dashboard only accessible when logged in

---

## 📊 Database Configuration

**Already Configured:**
```env
DATABASE_URL=mysql://admin_wpinstant:QfJr8nDWKgXmaEZzB9g2@localhost:3306/admin_wpinstant
```

**Tables in Database (17 total):**
1. users - User accounts
2. oauth_accounts - Social login (optional)
3. sessions - User sessions
4. verification_tokens - Email verification (optional)
5. subscriptions - User subscriptions
6. orders - Purchase orders
7. order_items - Order line items
8. payments - Payment records
9. invoices - Invoice records
10. websites - User websites
11. website_scans - Scan records
12. scan_results - Scan details
13. plugins - Plugin info
14. plugin_licenses - License keys
15. reports - Generated reports
16. notifications - User notifications
17. api_keys - API access keys

---

## 🧪 Test the Setup

### 1. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 2. Create Test Account

1. Click user avatar icon (top right)
2. Click "Sign Up" tab
3. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Create Account"
5. Success message appears (no email sent)

### 3. Login

1. Click "Login" tab
2. Enter credentials
3. Click "Sign In"
4. Redirects to dashboard

### 4. Access Dashboard

1. Navigate to http://localhost:3000/dashboard
2. See dashboard content
3. Click logout
4. Try dashboard again - redirected to login

---

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy with PM2

```bash
npm install -g pm2
pm2 start npm --name "instant-wp" -- start
pm2 save
pm2 startup
```

### Update Production URLs

**In `.env` for production:**
```env
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

---

## 📁 Files Created

**Configuration:**
- ✅ `.env` - Environment variables with database credentials
- ✅ `lib/db.ts` - Database connection helper
- ✅ `ENABLE_AUTH_GUIDE.md` - Complete setup guide
- ✅ `enable-auth.ps1` - Automated setup script

**Ready to Move:**
- ✅ `server-only-features/api` → `app/api`
- ✅ `server-only-features/login` → `app/login`
- ✅ `server-only-features/signup` → `app/signup`
- ✅ `server-only-features/dashboard` → `app/dashboard`

---

## ⚙️ Configuration Summary

### Database Connection
```typescript
// lib/db.ts
host: 'localhost'
user: 'admin_wpinstant'
password: 'QfJr8nDWKgXmaEZzB9g2'
database: 'admin_wpinstant'
```

### NextAuth Setup
- ✅ JWT strategy (no database session storage)
- ✅ 30-day session duration
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Custom login/signup pages
- ✅ Protected dashboard routes

### Features Enabled
- ✅ Email/Password authentication
- ✅ User registration
- ✅ Session management
- ✅ Dashboard access control
- ✅ Secure password storage

### Features Disabled (As Requested)
- ❌ Email notifications after signup
- ❌ Email verification
- ❌ Password reset emails
- ⚠️ Google/GitHub OAuth (optional)

---

## 🔧 Key Changes Made

1. **next.config.ts**
   - Removed `output: 'export'` to enable server features
   - Kept image optimization settings

2. **Database Connection**
   - Created `lib/db.ts` with MySQL connection pool
   - Configured with your database credentials

3. **.env File**
   - Added DATABASE_URL with your credentials
   - Added NEXTAUTH_SECRET (you need to generate)
   - Added application URLs

4. **File Structure**
   - Server features ready to move from `server-only-features` to `app`
   - Auth API routes prepared
   - Login/Signup pages ready
   - Dashboard with route protection

---

## ✅ Checklist

**Before Starting:**
- [ ] Run `.\enable-auth.ps1` or manually move folders
- [ ] Generate and add `NEXTAUTH_SECRET` to `.env`
- [ ] Verify database connection: `mysql -u admin_wpinstant -p`
- [ ] Install packages: `npm install`

**Build & Start:**
- [ ] Build: `npm run build`
- [ ] Start: `npm start` or `npm run dev`
- [ ] Open: http://localhost:3000

**Test Authentication:**
- [ ] Create test account via signup
- [ ] Login with test account
- [ ] Access dashboard
- [ ] Logout works
- [ ] Dashboard requires login

---

## 🆘 Need Help?

**Read the Full Guide:**
📖 `ENABLE_AUTH_GUIDE.md` - Complete step-by-step instructions

**Common Issues:**
- Database connection error → Check MySQL is running
- NextAuth error → Verify NEXTAUTH_SECRET is set
- Build fails → Make sure packages installed
- Login fails → Check database has users table

**Verify Database:**
```sql
USE admin_wpinstant;
SHOW TABLES;
DESCRIBE users;
SELECT * FROM users LIMIT 1;
```

---

## 🎉 Ready to Go!

1. Run the setup script: `.\enable-auth.ps1`
2. Generate NEXTAUTH_SECRET
3. Build and start: `npm run build && npm start`
4. Test signup → login → dashboard flow

**Your authentication system is ready to enable!** 🚀
