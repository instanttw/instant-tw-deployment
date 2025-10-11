# ✅ Verify Database is Ready

Before going live, let's confirm your database tables exist.

---

## 🗄️ Check Database Tables

### **Step 1: Connect to MySQL**

```bash
mysql -u admin_wpinstant -p admin_wpinstant
# Enter password: QfJr8nDWKgXmaEZzB9g2
```

### **Step 2: Check Tables Exist**

```sql
USE admin_wpinstant;
SHOW TABLES;
```

**You should see 17 tables:**
```
+---------------------------+
| Tables_in_admin_wpinstant |
+---------------------------+
| api_keys                  |
| invoices                  |
| notifications             |
| oauth_accounts            |
| order_items               |
| orders                    |
| payment_methods           |
| payments                  |
| plugin_licenses           |
| plugins                   |
| reports                   |
| scan_results              |
| sessions                  |
| subscriptions             |
| users                     |
| verification_tokens       |
| website_scans             |
| websites                  |
+---------------------------+
```

### **Step 3: Verify Users Table Structure**

```sql
DESCRIBE users;
```

**Should show:**
```
+---------------------+---------------------------------------------+------+-----+-------------------+
| Field               | Type                                        | Null | Key | Default           |
+---------------------+---------------------------------------------+------+-----+-------------------+
| id                  | bigint(20) unsigned                         | NO   | PRI | NULL              |
| email               | varchar(255)                                | NO   | UNI | NULL              |
| password_hash       | varchar(255)                                | YES  |     | NULL              |
| name                | varchar(255)                                | YES  |     | NULL              |
| avatar_url          | varchar(500)                                | YES  |     | NULL              |
| email_verified      | tinyint(1)                                  | YES  |     | 0                 |
| email_verified_at   | timestamp                                   | YES  |     | NULL              |
| two_factor_enabled  | tinyint(1)                                  | YES  |     | 0                 |
| two_factor_secret   | varchar(255)                                | YES  |     | NULL              |
| role                | enum('user','admin','support')              | YES  |     | user              |
| status              | enum('active','suspended','deleted')        | YES  |     | active            |
| last_login_at       | timestamp                                   | YES  |     | NULL              |
| last_login_ip       | varchar(45)                                 | YES  |     | NULL              |
| created_at          | timestamp                                   | NO   |     | CURRENT_TIMESTAMP |
| updated_at          | timestamp                                   | NO   |     | CURRENT_TIMESTAMP |
+---------------------+---------------------------------------------+------+-----+-------------------+
```

### **Step 4: Check if Tables are Empty**

```sql
SELECT COUNT(*) as user_count FROM users;
```

**Should show:**
```
+------------+
| user_count |
+------------+
|          0 |
+------------+
```

If it shows 0, perfect! You're ready to create your first user via signup.

---

## ✅ Everything Looks Good?

If all checks passed, your database is ready!

**Proceed to make authentication live:**
1. Run `.\enable-auth.ps1`
2. Build: `npm run build`
3. Start: `npm start`
4. Test signup at http://localhost:3000

---

## ❌ If Tables Don't Exist

**Import the schema:**

```bash
# In PowerShell or Command Prompt:
mysql -u admin_wpinstant -p admin_wpinstant < database/schema-directadmin.sql
# Enter password when prompted
```

**Then verify again:**
```sql
USE admin_wpinstant;
SHOW TABLES;
```

---

## 🔍 Test Database Connection

**Quick test from command line:**

```bash
mysql -u admin_wpinstant -p admin_wpinstant -e "SELECT 'Connection successful!' as status;"
```

**Should output:**
```
+-----------------------+
| status                |
+-----------------------+
| Connection successful!|
+-----------------------+
```

---

## ✅ Database Checklist

- [ ] Connected to MySQL successfully
- [ ] Database `admin_wpinstant` exists
- [ ] All 17 tables exist
- [ ] `users` table has correct structure
- [ ] Tables are empty (ready for first signup)

**If all checked, you're ready to go live!** 🚀

**Next:** Run `.\enable-auth.ps1` in your instant-tw-deployment folder.
