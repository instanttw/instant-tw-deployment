# Fix Google OAuth Redirect Loop Issue - Next.js Project

## Project Context
- **Framework**: Next.js
- **Hosting**: Vercel (Frontend)
- **Database**: Neon Postgres
- **OAuth Provider**: Google OAuth (keys configured, authorization params added)
- **Working Reference**: GitHub OAuth successfully redirects to User Dashboard

## Current Status
✅ Google OAuth authorization parameters have been added (`prompt: "consent"`, `access_type: "offline"`, `response_type: "code"`)
✅ User authentication with Google works and completes successfully
✅ Enhanced error handling and logging implemented
❌ **After successful Google OAuth, user is redirected BACK to login page instead of Dashboard**

## Problem Description
The Google OAuth flow completes successfully (user confirms with Google), but upon returning to the website, the user is redirected to the **login page** instead of the **User Dashboard**. This suggests the issue is in the **redirect callback logic**, not the authorization flow itself.

**Expected**: After Google OAuth → User lands on `/dashboard`
**Actual**: After Google OAuth → User redirected to `/login` (possibly with or without error parameter)

## Root Cause Analysis
Since authorization params are already added and the OAuth flow completes, the issue is likely in:

1. **The `redirect` callback in NextAuth** - May be returning wrong URL
2. **Session creation timing** - Session might not be ready when redirect occurs
3. **Middleware interference** - Auth middleware might be catching and redirecting
4. **Missing database user** - User created but session doesn't recognize them
5. **Cookie/session storage** - Session not persisting between callback and redirect

## Investigation Steps

### 1. Check the NextAuth `redirect` Callback
**File**: `/lib/auth.ts` or `/pages/api/auth/[...nextauth].js`

Look for the `redirect` callback and ensure it's configured correctly:

```typescript
callbacks: {
  async redirect({ url, baseUrl }) {
    // CHECK THIS LOGIC - it might be redirecting to login
    
    // Should be something like:
    // If url starts with baseUrl, allow it
    if (url.startsWith(baseUrl)) return url;
    
    // Otherwise, redirect to dashboard after sign in
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    
    // Default to dashboard
    return `${baseUrl}/dashboard`;
  }
}
```

**Common Issues**:
- Callback might be returning `baseUrl` (homepage) instead of dashboard
- Might be checking for conditions that fail for Google but pass for GitHub
- Could be missing the dashboard redirect entirely

### 2. Verify Session Callback
Ensure the session callback properly returns user data:

```typescript
async session({ session, token }) {
  if (token && session.user) {
    session.user.id = token.id as string;
    session.user.email = token.email as string;
    session.user.name = token.name as string;
    // Add any other necessary fields
  }
  return session;
}
```

### 3. Check JWT Callback
Verify the JWT callback is storing user ID correctly:

```typescript
async jwt({ token, user, account, profile }) {
  if (user) {
    token.id = user.id;
    token.email = user.email;
    token.name = user.name;
  }
  return token;
}
```

### 4. Check Middleware Configuration
**File**: `/middleware.ts` or `/middleware.js`

Look for auth middleware that might be intercepting:

```typescript
// Check if there's logic that redirects unauthenticated users
// Make sure it's not triggering right after OAuth callback
```

### 5. Verify Next.js Pages Router or App Router Protected Routes
Check if dashboard route has protection that's rejecting the new session:

- `/pages/dashboard.tsx` or `/app/dashboard/page.tsx`
- Look for `getServerSideProps` or server-side session checks
- Ensure they're using NextAuth's session properly

### 6. Check Database User Creation
Even though error handling was added, verify the user is actually being created/found:

```typescript
// In signIn callback, add temporary logging:
console.log("🔍 User after database operation:", user);
console.log("🔍 Account type:", account.provider);
```

## Files to Check (Priority Order)

1. **`/lib/auth.ts`** - Most likely culprit
   - Focus on `redirect` callback
   - Check `session` callback
   - Verify `jwt` callback

2. **`/middleware.ts`** - May be intercepting
   - Look for auth checks
   - Check redirect logic

3. **`/pages/dashboard.tsx`** or **`/app/dashboard/page.tsx`**
   - Server-side session checks
   - Protected route logic

4. **`/app/login/page.tsx`** or **`/pages/login.tsx`**
   - Check if there's redirect logic on login page
   - Verify it's not trapping authenticated users

## Specific Things to Look For

### Issue #1: Redirect Callback Returns Wrong URL
```typescript
// WRONG - This might be happening:
async redirect({ url, baseUrl }) {
  return baseUrl; // ❌ Always returns homepage
}

// CORRECT - Should be:
async redirect({ url, baseUrl }) {
  // Allow callback URLs
  if (url.startsWith(baseUrl)) return url;
  // Default to dashboard after sign-in
  return `${baseUrl}/dashboard`;
}
```

### Issue #2: Missing Dashboard Redirect After OAuth
```typescript
// Check NextAuth configuration:
pages: {
  signIn: '/login',
  // Make sure there's NO configuration that overrides OAuth success redirect
}
```

### Issue #3: Session Not Available Immediately
```typescript
// In redirect callback, check if session exists:
async redirect({ url, baseUrl, token }) {
  console.log("🔍 Redirect callback - Token exists:", !!token);
  console.log("🔍 Redirect callback - URL:", url);
  console.log("🔍 Redirect callback - BaseURL:", baseUrl);
  
  // This helps debug what's being passed
}
```

## Testing & Debugging

### Add Temporary Logging
Add these console logs to understand the flow:

```typescript
callbacks: {
  async redirect({ url, baseUrl }) {
    console.log("🔄 REDIRECT CALLBACK TRIGGERED");
    console.log("  → Requested URL:", url);
    console.log("  → Base URL:", baseUrl);
    
    // Your redirect logic here
    const redirectUrl = `${baseUrl}/dashboard`;
    console.log("  → Redirecting to:", redirectUrl);
    return redirectUrl;
  },
  
  async signIn({ user, account, profile }) {
    console.log("✅ SIGNIN CALLBACK - SUCCESS");
    console.log("  → Provider:", account.provider);
    console.log("  → User ID:", user.id);
    return true; // Must return true to allow sign in
  }
}
```

### Test Flow
1. Clear all cookies and browser cache
2. Open browser DevTools → Network tab
3. Attempt Google OAuth login
4. Watch for:
   - `/api/auth/callback/google` response
   - Any redirect responses (302, 307)
   - Final landing URL
5. Check Vercel logs for the console.log output

## Expected Fix Location

**Most Likely**: The `redirect` callback in `/lib/auth.ts` needs to be fixed to properly redirect to dashboard after OAuth.

**Possible Code Fix**:
```typescript
callbacks: {
  async redirect({ url, baseUrl }) {
    // If the url is a callback URL, allow it
    if (url.startsWith(baseUrl)) return url;
    
    // If it's a relative URL, prepend baseUrl
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    
    // For OAuth sign-ins, default to dashboard
    return `${baseUrl}/dashboard`;
  },
  
  async signIn({ user, account }) {
    // This should already work, but ensure it returns true
    return true;
  },
  
  async session({ session, token }) {
    // Ensure session has user data
    if (token && session.user) {
      session.user.id = token.id as string;
    }
    return session;
  }
}
```

## Success Criteria

After fix:
✅ Google OAuth completes successfully
✅ User is redirected to `/dashboard` (NOT `/login`)
✅ User session persists on dashboard
✅ No error parameters in URL
✅ Behavior matches GitHub OAuth exactly
✅ Works in both development and production

## If This Doesn't Fix It

Check these additional locations:

1. **Environment Variables**: Verify `NEXTAUTH_URL` is correct in Vercel
   ```
   NEXTAUTH_URL=https://wp.instant.tw
   ```

2. **Google Cloud Console**: Verify authorized redirect URI
   ```
   https://wp.instant.tw/api/auth/callback/google
   ```

3. **Session Strategy**: Check if using JWT vs database sessions correctly
   ```typescript
   session: {
     strategy: "jwt", // or "database"
   }
   ```

## Action Items

1. ✅ Focus on `/lib/auth.ts` → `redirect` callback first
2. ✅ Add temporary logging to understand redirect flow
3. ✅ Test with logging enabled to see actual vs expected URLs
4. ✅ Compare redirect callback behavior between Google and GitHub
5. ✅ Check Vercel logs for redirect callback output
6. ✅ Remove logging after fix is confirmed

The issue is almost certainly in the redirect callback logic. Start there.