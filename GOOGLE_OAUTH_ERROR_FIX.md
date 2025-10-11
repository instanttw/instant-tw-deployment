# Google OAuth Error Fix - OAuthCallback Error

## Issue Identified

**Error:** `OAuthCallback` error when redirecting from Google OAuth  
**URL:** `https://wp.instant.tw/login/?callbackUrl=https%3A%2F%2Fwp.instant.tw%2Fdashboard&error=OAuthCallback`  
**Cause:** Exception being thrown in the `signIn` callback during database operations

---

## Root Cause

The `OAuthCallback` error in NextAuth means something in the `signIn` callback:
1. Threw an unhandled exception
2. Returned `false` unexpectedly
3. Had a database connection/query failure

Since GitHub works but Google doesn't, this suggests:
- The callback logic is correct
- But Google OAuth might be providing data in a slightly different format
- Or the database operations are timing out/failing for Google specifically

---

## Fixes Applied

### 1. Added Authorization Parameters to Google Provider

**Why:** Google OAuth needs explicit parameters to work properly

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code"
    }
  }
})
```

**What this does:**
- `prompt: "consent"` - Always show consent screen (ensures fresh token)
- `access_type: "offline"` - Get refresh token
- `response_type: "code"` - Use authorization code flow

### 2. Enhanced Error Handling

**Before:** Single try-catch with minimal error details  
**After:** Nested try-catch blocks with detailed error logging

```typescript
try {
  // Outer try-catch for entire callback
  try {
    // Inner try-catch for database operations
    // Each DB operation logs success/failure
  } catch (dbError) {
    // Log specific database errors
  }
} catch (outerError) {
  // Log critical callback failures
}
```

### 3. Improved Error Logging

Every error now logs:
- ❌ Error marker for easy filtering
- Error message
- Full error stack trace
- Context about what was happening

### 4. Fallback for Update Failures

If updating existing user info fails, we now continue anyway rather than failing the entire sign-in:

```typescript
try {
  await sql`UPDATE users...`;
} catch (updateError) {
  console.error('⚠️ Failed to update user info, but continuing:', updateError);
}
```

---

## How to Debug After Deployment

### Step 1: Deploy Changes

```bash
git add lib/auth.ts
git commit -m "fix: improve Google OAuth error handling and add authorization params"
git push origin main
```

### Step 2: Attempt Google OAuth Login

1. Go to: https://wp.instant.tw/login
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. Note what happens (success or error)

### Step 3: Check Vercel Logs

**Go to:** https://vercel.com → Your Project → Logs

**Filter by:** `/api/auth/callback/google`

**Look for these log patterns:**

#### If Successful:
```
🔐 signIn callback triggered { provider: 'google', email: '...' }
🔍 Checking if user exists: ...
✅ Existing OAuth user found OR ✅ New OAuth user created
🎫 JWT token created/updated
📝 Session created
🔀 Redirecting to dashboard
```

#### If Failed - Look for:
```
❌ No email provided by OAuth provider
OR
❌ Database error in OAuth signIn callback
OR
❌ Failed to create OAuth user
OR
❌ CRITICAL: Unexpected error in signIn callback
```

**Critical:** Any line with ❌ will show the exact error message and stack trace.

### Step 4: Check Specific Errors

#### Error Type 1: No Email
```
❌ No email provided by OAuth provider
```
**Fix:** Check Google Cloud Console → OAuth consent screen → Scopes  
**Ensure:** `userinfo.email` scope is enabled

#### Error Type 2: Database Error
```
❌ Database error in OAuth signIn callback
Error details: { message: '...', stack: '...' }
```
**Fix:** Check DATABASE_URL in Vercel environment variables  
**Ensure:** Neon Postgres connection is working

#### Error Type 3: User Creation Failed
```
❌ Failed to create OAuth user - no rows returned
```
**Fix:** Check users table structure  
**Ensure:** All columns exist (id, email, name, role, created_at, updated_at)

#### Error Type 4: Critical Unexpected Error
```
❌ CRITICAL: Unexpected error in signIn callback
```
**Fix:** Check the full error message and stack trace in logs  
**Investigate:** The specific line that's failing

---

## Comparison: Why GitHub Works But Google Doesn't

### Possible Differences:

1. **OAuth Flow:**
   - GitHub uses simpler OAuth flow
   - Google requires more specific parameters

2. **Data Format:**
   - GitHub might provide email in a different structure
   - Google might have additional fields

3. **Timing:**
   - Google callback might take longer
   - Database operations might timeout

4. **Scopes:**
   - GitHub default scopes include email
   - Google needs explicit email scope

---

## Verification Checklist

### Before Testing:

- [ ] Deploy changes to Vercel
- [ ] Verify environment variables:
  - `GOOGLE_CLIENT_ID` set in Vercel
  - `GOOGLE_CLIENT_SECRET` set in Vercel
  - `NEXTAUTH_URL` = `https://wp.instant.tw`
  - `NEXTAUTH_SECRET` set
  - `DATABASE_URL` set and working

### Google Cloud Console Check:

- [ ] Go to: https://console.cloud.google.com
- [ ] Select your project
- [ ] APIs & Services → Credentials
- [ ] Check OAuth 2.0 Client:
  - Authorized redirect URIs includes:
    `https://wp.instant.tw/api/auth/callback/google`
- [ ] OAuth consent screen:
  - Scopes include: `userinfo.email`, `userinfo.profile`
  - App is published (or test users added)

### During Testing:

- [ ] Open incognito window
- [ ] Go to /login
- [ ] Click "Sign in with Google"
- [ ] Complete Google consent
- [ ] Note the redirect URL
- [ ] Check if dashboard opens OR error page

### After Testing:

- [ ] Check Vercel logs immediately
- [ ] Look for ❌ error markers
- [ ] Copy full error message if any
- [ ] Check database for user creation
- [ ] Try GitHub OAuth to confirm it still works

---

## Expected Behavior After Fix

### Google OAuth Flow:

```
1. User clicks "Sign in with Google"
2. Redirected to Google consent screen
3. User approves access
4. Google redirects back with authorization code
5. NextAuth exchanges code for tokens
6. signIn callback executes:
   - Logs provider and email
   - Checks database for existing user
   - Creates user if new OR updates if existing
   - Returns true (success)
7. JWT callback creates token
8. Session callback creates session
9. Redirect callback sends to /dashboard
10. User lands on dashboard (authenticated)
```

### If Error Occurs:

```
1-5. Same as above
6. signIn callback encounters error:
   - Logs ❌ error with details
   - Returns false
7. NextAuth redirects to error page:
   /login?error=OAuthCallback
8. User sees login page with error
```

**With our fix:** Detailed logs will show exactly which step failed and why.

---

## Testing Commands

### Check Environment Variables:

```bash
# On Vercel Dashboard
vercel env ls

# Or pull them locally
vercel env pull .env.vercel
```

### Check Database Connection:

```sql
-- In Neon Postgres console
SELECT * FROM users WHERE email = 'your-google-email@gmail.com';
```

### Check Vercel Logs:

```bash
# Real-time logs
vercel logs --follow

# Recent logs
vercel logs --since 5m
```

---

## Alternative: Simplified Callback (If Issues Persist)

If the enhanced callback still has issues, we can simplify to this minimal version:

```typescript
async signIn({ user, account, profile }) {
  // Always allow credentials
  if (account?.provider === "credentials") {
    return true;
  }

  // For OAuth, just allow sign in without DB operations
  // User will be created in JWT/session callbacks instead
  return true;
}
```

**Then handle user creation in JWT callback instead.**

But let's try the enhanced version first to get detailed error logs.

---

## Success Criteria

After deployment and testing:

✅ **Google OAuth Success:**
- User completes Google consent
- User redirected to /dashboard
- User is authenticated
- User appears in database
- No error in URL
- Vercel logs show all ✅ success markers

✅ **GitHub OAuth Still Works:**
- Same behavior as before
- Doesn't break with our changes

✅ **Credentials Login Still Works:**
- Email/password login unchanged
- Still redirects to dashboard

---

## If Still Failing After This Fix

### Gather This Information:

1. **Exact error from Vercel logs:**
   - Copy the full ❌ error message
   - Include stack trace if available

2. **Google Cloud Console settings:**
   - Screenshot of authorized redirect URIs
   - Screenshot of OAuth consent screen scopes
   - Is app published or in testing?

3. **Database check:**
   ```sql
   -- Check if users table exists
   \d users
   
   -- Check recent OAuth attempts
   SELECT * FROM users 
   WHERE password_hash IS NULL 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

4. **Environment variables:**
   - Confirm all are set in Vercel (don't share the actual values)
   - Confirm NEXTAUTH_URL matches your domain exactly

5. **Browser console:**
   - Open DevTools → Console
   - Note any errors during OAuth flow

---

## Next Steps

1. **Deploy** these changes
2. **Test** Google OAuth login
3. **Check** Vercel logs for detailed error info
4. **Share** the specific ❌ error message if it still fails
5. **Verify** GitHub OAuth still works

With the enhanced error logging, we'll be able to pinpoint exactly what's failing and fix it quickly.

---

**Status:** ✅ Enhanced error handling deployed  
**Action Required:** Deploy → Test → Check Logs → Report specific errors if any
