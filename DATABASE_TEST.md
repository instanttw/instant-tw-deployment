# Database Connection Test

## ✅ **Your Database Credentials**

```
Database Name: instantt_wp
Username: instantt_wp
Password: KLEcpFWeyAbdGjFCgmUS
Host: localhost
Port: 3306
```

---

## 🔧 **Updated Configuration**

Your `.env.production` now has:

```env
DATABASE_URL=mysql://instantt_wp:KLEcpFWeyAbdGjFCgmUS@localhost:3306/instantt_wp
```

---

## ✅ **Test Connection After Upload**

Once you've uploaded files and SSH'd into your VPS, test the database connection:

```bash
# SSH into your VPS
ssh your-user@your-vps-ip

# Test database connection
mysql -u instantt_wp -p'KLEcpFWeyAbdGjFCgmUS' instantt_wp

# If successful, you'll see:
# mysql>

# Check if database has tables
SHOW TABLES;

# Check if users table exists (for authentication)
DESCRIBE users;

# Exit
exit
```

---

## 🗄️ **Database Schema Required**

For authentication and dashboard to work, your database needs these tables:

### **1. users table** (for authentication)
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **2. sessions table** (for NextAuth)
```sql
CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 📝 **Check if Tables Exist**

After connecting to database:

```sql
-- Show all tables
SHOW TABLES;

-- If tables don't exist, create them
-- Copy SQL from above
```

---

## 🔍 **Common Issues**

### **Issue: Can't connect to database**

**Check 1: Database exists**
```bash
mysql -u root -p -e "SHOW DATABASES LIKE 'instantt_wp';"
```

**Check 2: User has permissions**
```bash
mysql -u root -p -e "SHOW GRANTS FOR 'instantt_wp'@'localhost';"
```

**Check 3: User can access from localhost**
```bash
mysql -u instantt_wp -p'KLEcpFWeyAbdGjFCgmUS' -e "SELECT 1;"
```

---

## ✅ **Verification Checklist**

Before starting your app:

- [ ] Database `instantt_wp` exists
- [ ] User `instantt_wp` exists
- [ ] Password `KLEcpFWeyAbdGjFCgmUS` works
- [ ] Can connect via: `mysql -u instantt_wp -p instantt_wp`
- [ ] Users table exists (for authentication)
- [ ] Sessions table exists (for sessions)

---

## 🚀 **Ready to Deploy**

Your `.env.production` is now updated with correct credentials!

**Next steps:**
1. Upload all files (including updated .env.production)
2. SSH into VPS
3. Test database connection
4. Run `npm install`
5. Run `npm run build`
6. Start with PM2

See `DEPLOY_NOW.md` for complete instructions!
