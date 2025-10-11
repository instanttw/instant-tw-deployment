# 🔐 Enable Authentication & Dashboard - Complete Guide

## 📋 Prerequisites

✅ Database created: `admin_wpinstant`  
✅ Database credentials available  
✅ 17 tables already created in database  
✅ Node.js installed on VPS  

---

## 🚀 Step-by-Step Implementation

### **Step 1: Update Configuration Files**

#### 1.1 Update `next.config.ts`

**Remove static export to enable server-side features:**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // REMOVE THIS LINE: output: 'export',
  
  // Keep these settings
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
};

export default nextConfig;
```

#### 1.2 Create `.env` file in project root

```bash
# Database Configuration
DATABASE_URL=mysql://admin_wpinstant:QfJr8nDWKgXmaEZzB9g2@localhost:3306/admin_wpinstant

# NextAuth Configuration  
NEXTAUTH_URL=http://localhost:3000
# IMPORTANT: Change to https://your-domain.com in production
NEXTAUTH_SECRET=your-random-secret-min-32-characters

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**IMPORTANT:** Generate a secure `NEXTAUTH_SECRET`:
```bash
# On Linux/Mac:
openssl rand -base64 32

# Or use this Node.js command:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### **Step 2: Install Required Dependencies**

```bash
cd C:\Users\PIETER\Downloads\instant-tw-deployment
npm install mysql2 bcryptjs
npm install --save-dev @types/bcryptjs
```

---

### **Step 3: Move Server Features to App Folder**

**Move authentication and dashboard from `server-only-features` to `app`:**

```bash
# On Windows PowerShell:
Move-Item -Path "server-only-features\api" -Destination "app\api" -Force
Move-Item -Path "server-only-features\login" -Destination "app\login" -Force
Move-Item -Path "server-only-features\signup" -Destination "app\signup" -Force
Move-Item -Path "server-only-features\dashboard" -Destination "app\dashboard" -Force
Move-Item -Path "server-only-features\checkout" -Destination "app\checkout" -Force
```

**Or manually:**
1. Copy `server-only-features/api` folder → `app/api`
2. Copy `server-only-features/login` folder → `app/login`
3. Copy `server-only-features/signup` folder → `app/signup`
4. Copy `server-only-features/dashboard` folder → `app/dashboard`
5. Copy `server-only-features/checkout` folder → `app/checkout`

---

### **Step 4: Create Database Helper**

**File: `lib/db.ts`**

```typescript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'admin_wpinstant',
  password: 'QfJr8nDWKgXmaEZzB9g2',
  database: 'admin_wpinstant',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const [results] = await pool.execute(sql, params);
  return results as T;
}

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const results = await query<T[]>(sql, params);
  return results.length > 0 ? results[0] : null;
}

export default pool;
```

---

### **Step 5: Update Auth Configuration**

**File: `app/api/auth/[...nextauth]/route.ts`**

Update the database adapter to use your MySQL connection:

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query, queryOne } from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Get user from database
        const user = await queryOne<any>(
          'SELECT * FROM users WHERE email = ? AND status = "active"',
          [credentials.email]
        );

        if (!user || !user.password_hash) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);

        if (!isValid) {
          return null;
        }

        // Update last login
        await query(
          'UPDATE users SET last_login_at = NOW() WHERE id = ?',
          [user.id]
        );

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
    signUp: '/signup',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
```

---

### **Step 6: Update Signup API**

**File: `app/api/auth/signup/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await query<any[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user (NO EMAIL NOTIFICATION as requested)
    await query(
      `INSERT INTO users (name, email, password_hash, role, status, created_at) 
       VALUES (?, ?, ?, 'user', 'active', NOW())`,
      [name, email, password_hash]
    );

    return NextResponse.json(
      { message: 'Account created successfully. Please login.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
```

---

### **Step 7: Protect Dashboard Route**

**File: `app/dashboard/layout.tsx`**

```typescript
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return <>{children}</>;
}
```

---

### **Step 8: Build and Run**

```bash
# Build the application
npm run build

# Start the server
npm start

# Or for development:
npm run dev
```

---

## 🧪 Testing the Authentication Flow

### Test 1: Create Account (Signup)

1. Open http://localhost:3000
2. Click user avatar icon or "Sign In" button
3. Click "Sign Up" tab
4. Fill in:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
5. Click "Create Account"
6. Should see success message (NO email sent as requested)

### Test 2: Login

1. Switch to "Login" tab
2. Enter:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Sign In"
4. Should redirect to dashboard

### Test 3: Dashboard Access

1. After login, navigate to http://localhost:3000/dashboard
2. Should see dashboard (not redirected to login)
3. Click logout
4. Try accessing dashboard again
5. Should redirect to login page

---

## 🗄️ Verify Database Tables

**Check that these tables exist in `admin_wpinstant` database:**

```sql
-- Login to MySQL and check:
USE admin_wpinstant;
SHOW TABLES;

-- Should see these 17 tables:
-- 1. users
-- 2. oauth_accounts
-- 3. sessions
-- 4. verification_tokens
-- 5. subscriptions
-- 6. orders
-- 7. order_items
-- 8. payments
-- 9. invoices
-- 10. websites
-- 11. website_scans
-- 12. scan_results
-- 13. plugins
-- 14. plugin_licenses
-- 15. reports
-- 16. notifications
-- 17. api_keys

-- Check users table structure:
DESCRIBE users;

-- Test if you can insert a user:
SELECT * FROM users LIMIT 1;
```

---

## 🚀 Production Deployment to VPS

### Option 1: PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Build production
npm run build

# Start with PM2
pm2 start npm --name "instant-wp" -- start

# Save PM2 process list
pm2 save

# Setup auto-restart on server reboot
pm2 startup
```

### Option 2: systemd service

**Create `/etc/systemd/system/instant-wp.service`:**

```ini
[Unit]
Description=Instant WordPress Platform
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/instant-tw-deployment
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable instant-wp
sudo systemctl start instant-wp
sudo systemctl status instant-wp
```

---

## 🔧 Troubleshooting

### Problem: "Cannot find module 'mysql2'"
**Solution:**
```bash
npm install mysql2
```

### Problem: "Database connection failed"
**Solution:**
1. Check MySQL is running: `sudo systemctl status mysql`
2. Verify credentials in `.env`
3. Test connection: `mysql -u admin_wpinstant -p admin_wpinstant`

### Problem: "NextAuth configuration error"
**Solution:**
1. Ensure `NEXTAUTH_SECRET` is set in `.env`
2. Make sure it's at least 32 characters

### Problem: "Cannot connect to database from Next.js"
**Solution:**
1. Check MySQL allows connections from localhost
2. Verify user permissions:
```sql
GRANT ALL PRIVILEGES ON admin_wpinstant.* TO 'admin_wpinstant'@'localhost';
FLUSH PRIVILEGES;
```

### Problem: "Signup works but login fails"
**Solution:**
1. Check password hashing is working
2. Verify user was inserted: `SELECT * FROM users WHERE email = 'test@example.com';`
3. Check user status is 'active'

### Problem: "Dashboard redirects to login even after login"
**Solution:**
1. Check session is being created
2. Verify JWT secret is configured
3. Clear browser cookies and try again

---

## 📊 What Happens After These Changes

### ✅ Enabled Features:
- User registration (signup) without email notifications
- User login with email/password
- Dashboard access for logged-in users
- Session management (JWT)
- Protected routes
- Logout functionality

### ❌ Still Disabled (Optional):
- Email notifications (as requested)
- Password reset via email (requires email setup)
- Google/GitHub OAuth (requires OAuth credentials)
- Stripe payments (requires Stripe setup)

---

## 🎯 Quick Checklist

Before testing, verify:

- [ ] `next.config.ts` updated (remove `output: 'export'`)
- [ ] `.env` file created with database credentials
- [ ] `NEXTAUTH_SECRET` generated and added to `.env`
- [ ] `mysql2` and `bcryptjs` packages installed
- [ ] `lib/db.ts` created
- [ ] Server features moved from `server-only-features` to `app` folder
- [ ] Application built successfully (`npm run build`)
- [ ] Server started (`npm start`)
- [ ] Can access http://localhost:3000
- [ ] Auth modal opens when clicking user icon
- [ ] Signup form works
- [ ] Login form works
- [ ] Dashboard accessible after login
- [ ] Logout works

---

## 🎉 Success!

After completing these steps:

1. **Signup** works and creates users in database
2. **Login** validates credentials and creates session
3. **Dashboard** accessible only when logged in
4. **No email notifications** sent (as requested)
5. **Database** properly stores all user data

Your authentication system is now fully functional! 🚀

---

**Need Help?**  
- Check application logs: `pm2 logs instant-wp`
- Check database: `mysql -u admin_wpinstant -p admin_wpinstant`
- Test database connection: Add `console.log()` in `lib/db.ts`
