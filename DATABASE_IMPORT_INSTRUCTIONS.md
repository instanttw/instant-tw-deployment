# 🗄️ Database Import Instructions

## ✅ **Use This SQL File:**

```
database/schema-directadmin.sql
```

This file is specifically designed for DirectAdmin MySQL/MariaDB.

---

## 📋 **Your Database Details:**

```
Database Name: instantt_wp
Username: instantt_wp
Password: KLEcpFWeyAbdGjFCgmUS
Host: localhost
Port: 3306
```

---

## 🚀 **Quick Import Guide**

### **Method 1: phpMyAdmin (Easiest) ⭐**

1. **Login to DirectAdmin**
   - URL: Your DirectAdmin panel URL
   - Login with your credentials

2. **Open phpMyAdmin**
   - Go to "MySQL Management"
   - Click "phpMyAdmin" button

3. **Select Your Database**
   - Click on `instantt_wp` in left sidebar

4. **Import Schema**
   - Click "Import" tab at top
   - Click "Choose File"
   - Select: `schema-directadmin.sql` from your computer
   - Scroll down
   - Click "Go" button

5. **Success!**
   - You'll see: "Import has been successfully finished"
   - Database now has 17 tables

---

### **Method 2: SSH Command Line**

```bash
# SSH into your VPS
ssh your-user@your-vps-ip

# Upload schema-directadmin.sql to server first

# Import the schema
mysql -u instantt_wp -p'KLEcpFWeyAbdGjFCgmUS' instantt_wp < schema-directadmin.sql

# Verify tables created
mysql -u instantt_wp -p'KLEcpFWeyAbdGjFCgmUS' instantt_wp -e "SHOW TABLES;"

# Should show 17 tables
```

---

## 📊 **Tables That Will Be Created:**

After import, you'll have **17 tables**:

1. ✅ `users` - User accounts (for login/signup)
2. ✅ `oauth_accounts` - Social login (Google, GitHub)
3. ✅ `sessions` - User sessions (NextAuth)
4. ✅ `verification_tokens` - Email verification
5. ✅ `subscriptions` - Pro/Agency/Enterprise plans
6. ✅ `orders` - Purchase orders
7. ✅ `order_items` - Order line items
8. ✅ `websites` - User's WordPress sites
9. ✅ `reports` - Website scan reports
10. ✅ `licenses` - Plugin license keys
11. ✅ `downloads` - Download tracking
12. ✅ `support_tickets` - Support system
13. ✅ `support_ticket_replies` - Ticket responses
14. ✅ `activity_logs` - User activity tracking
15. ✅ `api_keys` - API authentication
16. ✅ `notifications` - User notifications
17. ✅ `cart_items` - Shopping cart

---

## ✅ **Verify Import Success**

After importing, run this to check:

```sql
SHOW TABLES;
```

You should see all 17 tables listed.

---

## 🔧 **Test Database Connection**

After import, test the connection:

```bash
# SSH into VPS
ssh your-user@your-vps-ip

# Test connection
mysql -u instantt_wp -p'KLEcpFWeyAbdGjFCgmUS' instantt_wp

# If connected successfully, you'll see:
# mysql>

# List tables
SHOW TABLES;

# Check users table structure
DESCRIBE users;

# Exit
exit
```

---

## 🎯 **Default Test User**

The schema includes a default admin user for testing:

```
Email: admin@instant.tw
Password: admin123
```

**⚠️ IMPORTANT:** 
- This is for testing only
- Change password after first login
- Or create new user via signup

---

## 🐛 **Troubleshooting**

### **Error: "Access denied for user"**

**Solution:** Verify username/password are correct
```bash
mysql -u instantt_wp -p instantt_wp
# Enter password when prompted
```

### **Error: "Unknown database"**

**Solution:** Database doesn't exist. Create it first:
```bash
# Login as root or admin user
mysql -u root -p

# Create database
CREATE DATABASE instantt_wp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (if needed)
CREATE USER 'instantt_wp'@'localhost' IDENTIFIED BY 'KLEcpFWeyAbdGjFCgmUS';

# Grant permissions
GRANT ALL PRIVILEGES ON instantt_wp.* TO 'instantt_wp'@'localhost';
FLUSH PRIVILEGES;

# Exit
exit

# Now import schema
mysql -u instantt_wp -p'KLEcpFWeyAbdGjFCgmUS' instantt_wp < schema-directadmin.sql
```

### **Error: "Table already exists"**

**Solution:** Drop existing tables first. The schema file uses `DROP TABLE IF EXISTS` so this shouldn't happen, but if it does:

```sql
-- Drop all tables in correct order
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS api_keys;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS support_ticket_replies;
DROP TABLE IF EXISTS support_tickets;
DROP TABLE IF EXISTS downloads;
DROP TABLE IF EXISTS licenses;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS websites;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS verification_tokens;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS oauth_accounts;
DROP TABLE IF EXISTS users;

-- Then import schema again
```

---

## 📋 **Import Checklist**

- [ ] Database `instantt_wp` exists
- [ ] User `instantt_wp` has permissions
- [ ] Upload `schema-directadmin.sql` file
- [ ] Import via phpMyAdmin or SSH
- [ ] Verify 17 tables created
- [ ] Test database connection
- [ ] Try logging in with test user
- [ ] `.env.production` has correct DATABASE_URL

---

## 🎉 **After Successful Import**

Your database is ready! You can now:

1. ✅ Deploy your Next.js app
2. ✅ Users can signup/login
3. ✅ Dashboard will work
4. ✅ All 3 features functional

---

## 🔐 **Security Note**

After deploying:

1. Change default admin password
2. Delete test user if not needed
3. Create your own admin account
4. Enable two-factor authentication
5. Regularly backup database

---

## 📞 **Still Need Help?**

**Check:**
1. MySQL/MariaDB version: `mysql --version`
2. User permissions: `SHOW GRANTS FOR 'instantt_wp'@'localhost';`
3. DirectAdmin error logs
4. Try importing smaller table first to test

---

**The `schema-directadmin.sql` file is ready to import! Start with phpMyAdmin (Method 1) for easiest setup.** 🚀
