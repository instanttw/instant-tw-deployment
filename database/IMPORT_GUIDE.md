# 📊 Database Import Guide for DirectAdmin

## Your Database Credentials

```
Hostname: localhost
Database: admin_wpinstant
Username: admin_wpinstant
Password: QfJr8nDWKgXmaEZzB9g2
```

---

## ✅ Use This File: `schema-directadmin.sql`

This file is specifically designed for DirectAdmin and won't have import errors!

### What's Fixed:
- ✅ Removed `CREATE DATABASE` command
- ✅ Uses backticks for all table/column names
- ✅ Uses `DROP TABLE IF EXISTS` to clean existing tables
- ✅ Compatible with MySQL 5.7+ and MariaDB
- ✅ Uses `TINYINT(1)` instead of `BOOLEAN`
- ✅ Explicit `DEFAULT NULL` for nullable columns
- ✅ Proper foreign key constraint names

---

## 🔧 Import Methods

### Method 1: Via phpMyAdmin (Recommended)

1. **Login to DirectAdmin**
   - Go to: `https://your-server.com:2222`
   - Login with your credentials

2. **Open phpMyAdmin**
   - Click "MySQL Management"
   - Click "phpMyAdmin" icon

3. **Select Database**
   - Click on `admin_wpinstant` in left sidebar

4. **Import File**
   - Click "Import" tab at top
   - Click "Choose File"
   - Select: `schema-directadmin.sql`
   - Scroll down and click "Go"

5. **Verify**
   - Should see message: "Import has been successfully finished"
   - Click on database name to see 17 tables created

---

### Method 2: Via Command Line (SSH)

```bash
# Login to your server via SSH
ssh your-username@your-server.com

# Navigate to upload directory
cd /path/to/uploaded/files

# Import the schema
mysql -u admin_wpinstant -p admin_wpinstant < schema-directadmin.sql

# Enter password when prompted: QfJr8nDWKgXmaEZzB9g2

# Verify tables were created
mysql -u admin_wpinstant -p admin_wpinstant -e "SHOW TABLES;"
```

---

### Method 3: Via DirectAdmin File Manager

1. **Upload File**
   - DirectAdmin → File Manager
   - Navigate to `/domains/your-domain.com/public_html/`
   - Upload `schema-directadmin.sql`

2. **Execute via phpMyAdmin**
   - Follow Method 1 steps above
   - Or use SQL tab to paste entire file content

---

## 📋 Tables That Will Be Created

After successful import, you'll have these 17 tables:

```
1. users                    - User accounts
2. oauth_accounts           - Social login (Google, GitHub)
3. sessions                 - User sessions
4. verification_tokens      - Email verification
5. subscriptions            - Pro/Agency/Enterprise plans
6. orders                   - Purchase orders
7. order_items              - Order details
8. websites                 - User's WordPress sites
9. reports                  - Scan reports
10. licenses                - License keys
11. downloads               - Download tracking
12. support_tickets         - Support system
13. support_ticket_replies  - Ticket responses
14. activity_logs           - User activity
15. api_keys                - API authentication
16. notifications           - User notifications
17. cart_items              - Shopping cart (optional)
```

---

## 🐛 Troubleshooting

### Error: "Access denied"
**Solution:** Make sure you're using the correct database name `admin_wpinstant`

### Error: "Table already exists"
**Solution:** The file uses `DROP TABLE IF EXISTS`, so this shouldn't happen. If it does, manually drop tables first:
```sql
DROP TABLE IF EXISTS cart_items, notifications, api_keys, activity_logs, 
support_ticket_replies, support_tickets, downloads, licenses, reports, 
websites, order_items, orders, subscriptions, verification_tokens, 
sessions, oauth_accounts, users;
```

### Error: "Unknown character set"
**Solution:** Your MySQL version might not support utf8mb4. Change in file:
```sql
# Change from:
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
# To:
DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
```

### Error: "Foreign key constraint fails"
**Solution:** Tables must be imported in order. The `schema-directadmin.sql` file has them in correct order already.

### Error: "JSON not supported"
**Solution:** Your MySQL version is older than 5.7. You need to upgrade MySQL or change JSON columns to TEXT:
```sql
# Change from:
`metadata` JSON DEFAULT NULL
# To:
`metadata` TEXT DEFAULT NULL
```

---

## ✅ Verify Import Success

After import, run this query to verify:

```sql
SELECT 
    TABLE_NAME,
    TABLE_ROWS
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'admin_wpinstant'
ORDER BY 
    TABLE_NAME;
```

You should see all 17 tables listed.

---

## 🔐 Default Admin User

The import creates a default admin user:

```
Email: admin@instant.tw
Password: admin123
```

**⚠️ IMPORTANT:** Change this password immediately after first login!

---

## 🔄 Update Database Connection in .env

After successful import, update your `.env.local` file:

```env
DATABASE_URL=mysql://admin_wpinstant:QfJr8nDWKgXmaEZzB9g2@localhost:3306/admin_wpinstant

# Or if you're using DirectAdmin's remote access:
DATABASE_URL=mysql://admin_wpinstant:QfJr8nDWKgXmaEZzB9g2@your-server.com:3306/admin_wpinstant
```

---

## 📱 Test Connection

Create a simple test script `test-db.php`:

```php
<?php
$host = 'localhost';
$db = 'admin_wpinstant';
$user = 'admin_wpinstant';
$pass = 'QfJr8nDWKgXmaEZzB9g2';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    echo "✅ Connection successful!\n";
    
    // Count tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "📊 Found " . count($tables) . " tables\n";
    
    foreach ($tables as $table) {
        echo "  - $table\n";
    }
} catch(PDOException $e) {
    echo "❌ Connection failed: " . $e->getMessage() . "\n";
}
?>
```

Run it:
```bash
php test-db.php
```

---

## 🎯 Next Steps

After successful import:

1. ✅ Verify all 17 tables exist
2. ✅ Change default admin password
3. ✅ Update `.env.local` with database credentials
4. ✅ Test database connection
5. ✅ Set up NextAuth.js
6. ✅ Configure Stripe
7. ✅ Deploy your application

---

## 📧 Need Help?

If you encounter any issues:

1. Check MySQL/MariaDB version: `mysql --version`
2. Check user permissions: `SHOW GRANTS FOR 'admin_wpinstant'@'localhost';`
3. Check error logs in DirectAdmin
4. Try importing a smaller test table first

---

**The `schema-directadmin.sql` file is ready to import without errors!** 🎉
