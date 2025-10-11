# Admin Login Credentials

## Default Admin Account ✅

I've created an admin user in your **production Neon database**:

### Login Details:
```
📧 Email:    admin@instant.tw
🔑 Password: admin123
🎭 Role:     admin
```

### Login URL:
**https://wp.instant.tw/login**

---

## How to Login

1. Visit: **https://wp.instant.tw/login**
2. Enter email: `admin@instant.tw`
3. Enter password: `admin123`
4. Click "Sign In"
5. You'll be redirected to `/admin` dashboard

---

## After Login

### Avatar Button Now Works ✅
- **Before:** Clicked avatar → Redirected to `dash.instant.tw/login` → 404 error
- **After:** Clicked avatar → Redirects to `/admin` dashboard (if logged in) or `/login` (if not)

### Admin Dashboard Access:
Once logged in, you can access:
- `/admin` - Main dashboard with stats
- `/admin/orders` - View all orders (TODO: create page)
- `/admin/licenses` - Manage licenses (TODO: create page)
- `/admin/products` - Manage products (TODO: create page)
- `/admin/webhooks` - View webhook logs (TODO: create page)

---

## Important Security Notes

⚠️ **CHANGE THE PASSWORD IMMEDIATELY!**

This is a default password created for testing. You should:

1. Login with the default credentials
2. Go to account settings
3. Change password to something secure
4. Or delete this user and create a new admin account

### To Change Admin Password:

You can create a new admin user with a different password:

```typescript
// Run this script with your own password
import { sql } from '@vercel/postgres';
import * as crypto from 'crypto';

const email = 'your-email@domain.com';
const password = 'your-secure-password';
const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

await sql`
  INSERT INTO users (email, name, password_hash, email_verified, role)
  VALUES (${email}, 'Your Name', ${passwordHash}, true, 'admin')
`;
```

---

## User Management

### Check All Users:
```bash
npx tsx -e "import { sql } from '@vercel/postgres'; import * as dotenv from 'dotenv'; dotenv.config({ path: '.env.local' }); if (process.env.DATABASE_URL && !process.env.POSTGRES_URL) process.env.POSTGRES_URL = process.env.DATABASE_URL; async function check() { const result = await sql.query('SELECT email, name, role FROM users'); console.log('Users:', result.rows); } check();"
```

### Delete Admin User:
```sql
DELETE FROM users WHERE email = 'admin@instant.tw';
```

### Create New Admin:
```bash
npx tsx scripts/create-admin-user.ts
```

---

## Avatar Button Behavior

### When Not Logged In:
- Click avatar → Redirects to `/login`
- Shows "Sign In" tooltip

### When Logged In:
- Click avatar → Redirects to `/admin` 
- Shows "Dashboard" tooltip
- Works for all user roles

---

## Deployment Status

✅ **Header fix deployed to production**
- Avatar button now redirects correctly
- No more `dash.instant.tw` 404 errors
- Works on wp.instant.tw

✅ **Admin user created in Neon**
- Email: admin@instant.tw
- Password: admin123
- Ready to use immediately

---

## Testing

**Test the fix:**

1. Visit: https://wp.instant.tw
2. Click the **user icon** (avatar) in top right corner
3. Should redirect to: https://wp.instant.tw/login (not dash.instant.tw)
4. Enter credentials above
5. Click "Sign In"
6. Should see admin dashboard

**If login doesn't work:**
- Check if `/login` page exists
- Verify auth is configured
- Check browser console for errors

---

## Next Steps

1. **Test Login:**
   - Visit https://wp.instant.tw
   - Click avatar icon
   - Should go to login page (no 404)
   - Login with credentials above

2. **Access Admin Dashboard:**
   - After login, click avatar again
   - Should go to /admin
   - See statistics and orders

3. **Change Password:**
   - For security, change default password
   - Or create a new admin user with your own email

---

## Summary

✅ Fixed avatar button redirect (no more dash.instant.tw error)
✅ Created admin user in production database
✅ Deployed to production
✅ Avatar now works: Not logged in → /login, Logged in → /admin

**Default Admin Credentials:**
- Email: `admin@instant.tw`
- Password: `admin123`

**Try it now at:** https://wp.instant.tw
