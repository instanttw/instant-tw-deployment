# Fix WordPress OAuth Callback Error

## Problem Description

After WordPress.com authentication confirmation, users are redirected back to the login page with an error:

```
https://wp.instant.tw/login/?callbackUrl=https%3A%2F%2Fwp.instant.tw%2Fdashboard&error=OAuthCallback
```

**Expected**: Redirect to `/dashboard` after successful WordPress OAuth
**Actual**: Redirect to `/login` with `OAuthCallback` error

## WordPress.com App Configuration

Current settings registered:
- **Redirect URLs**: `https://wp.instant.tw`
- **Javascript Origins**: `https://wp.instant.tw`
- **Type**: Web
- **Request token URL**: `https://public-api.wordpress.com/oauth2/token`
- **Authorize URL**: `https://public-api.wordpress.com/oauth2/authorize`
- **Authenticate URL**: `https://public-api.wordpress.com/oauth2/authenticate`

## Root Cause

The **Redirect URL in WordPress.com app is incorrect**. It should point to the NextAuth callback endpoint, not just the base domain.

### Critical Issues:

1. ❌ **Wrong Redirect URL**: Currently set to `https://wp.instant.tw`
2. ✅ **Should be**: `https://wp.instant.tw/api/auth/callback/wordpress`

## Fix Steps

### Step 1: Update WordPress.com App Configuration

**Action Required**: Go to WordPress.com Developer Portal

1. Visit: https://developer.wordpress.com/apps/
2. Click on your application
3. Update **Redirect URLs** to:
   ```
   https://wp.instant.tw/api/auth/callback/wordpress
   http://localhost:3000/api/auth/callback/wordpress
   ```
   ⚠️ Include BOTH production and development URLs

4. Keep **Javascript Origins** as:
   ```
   https://wp.instant.tw
   http://localhost:3000
   ```

5. Save changes

### Step 2: Verify NextAuth WordPress Provider Configuration

**File**: `/lib/auth.ts`

Check that the WordPress provider is configured correctly:

```typescript
const WordPressProvider = {
  id: "wordpress",
  name: "WordPress",
  type: "oauth" as const,
  
  authorization: {
    url: "https://public-api.wordpress.com/oauth2/authorize",
    params: {
      scope: "auth",
      response_type: "code",
    },
  },
  
  token: {
    url: "https://public-api.wordpress.com/oauth2/token",
  },
  
  userinfo: {
    url: "https://public-api.wordpress.com/rest/v1/me",
  },
  
  clientId: process.env.WORDPRESS_CLIENT_ID,
  clientSecret: process.env.WORDPRESS_CLIENT_SECRET,
  
  profile(profile: any) {
    return {
      id: profile.ID?.toString() || profile.id?.toString(),
      name: profile.display_name || profile.username,
      email: profile.email,
      image: profile.avatar_URL || profile.avatar_url,
    };
  },
};
```

**Key Points**:
- ✅ Use `authorization`, `token`, `userinfo` as objects with `url` property
- ✅ Ensure `response_type: "code"` is set
- ✅ Profile mapping handles both uppercase and lowercase field names

### Step 3: Check Environment Variables

**Files**: `.env.local` and Vercel Environment Variables

Verify these are set correctly:

```bash
WORDPRESS_CLIENT_ID=your_client_id_from_wordpress_com
WORDPRESS_CLIENT_SECRET=your_client_secret_from_wordpress_com
NEXTAUTH_URL=https://wp.instant.tw
NEXTAUTH_SECRET=your_nextauth_secret_here
```

**Verify in Vercel**:
```bash
# Check if variables exist
vercel env ls

# Pull environment variables
vercel env pull
```

### Step 4: Update signIn Callback for WordPress

**File**: `/lib/auth.ts`

Ensure the `signIn` callback handles WordPress authentication:

```typescript
callbacks: {
  async signIn({ user, account, profile }) {
    try {
      if (!user.email) {
        console.error("❌ No email provided by OAuth provider");
        return false;
      }

      // Handle WordPress OAuth
      if (account?.provider === "wordpress") {
        console.log("🔍 WordPress OAuth - User data:", {
          id: user.id,
          email: user.email,
          name: user.name,
        });

        try {
          // Check if user exists in database
          let existingUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // Create new user
            existingUser = await db.user.create({
              data: {
                email: user.email,
                name: user.name || "WordPress User",
                image: user.image,
                provider: "wordpress",
                providerId: user.id,
              },
            });
            console.log("✅ Created WordPress user:", existingUser.id);
          } else {
            // Update existing user
            await db.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                lastLogin: new Date(),
              },
            });
            console.log("✅ Updated WordPress user:", existingUser.id);
          }

          // CRITICAL: Attach database user ID
          user.id = existingUser.id;
          return true;
        } catch (dbError) {
          console.error("❌ Database error in WordPress OAuth:", dbError);
          // Return true anyway if you want to allow sign-in even if DB fails
          // return false; // Uncomment to block sign-in on DB error
          return true; // Allow sign-in, user will be in session but not in DB
        }
      }

      // Handle other providers (GitHub, etc.)
      if (account?.provider === "github") {
        // ... existing GitHub logic
      }

      return true;
    } catch (error) {
      console.error("❌ CRITICAL: Unexpected error in signIn callback:", error);
      return false;
    }
  },

  async redirect({ url, baseUrl }) {
    console.log("🔄 Redirect callback triggered");
    console.log("  → URL:", url);
    console.log("  → BaseURL:", baseUrl);

    // If url is a callback URL, allow it
    if (url.startsWith(baseUrl)) return url;
    
    // If it's a relative URL, prepend baseUrl
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    
    // Default to dashboard for OAuth sign-ins
    const redirectUrl = `${baseUrl}/dashboard`;
    console.log("  → Redirecting to:", redirectUrl);
    return redirectUrl;
  },

  async jwt({ token, user, account }) {
    if (user) {
      token.id = user.id;
      token.email = user.email;
      token.name = user.name;
      token.image = user.image;
    }
    return token;
  },

  async session({ session, token }) {
    if (token && session.user) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.image = token.image as string;
    }
    return session;
  },
}
```

### Step 5: Verify Login Button Configuration

**File**: `/app/login/page.tsx` or wherever the login UI is

```tsx
<button
  onClick={() => signIn("wordpress", { 
    callbackUrl: "/dashboard",
    redirect: true 
  })}
  className="wordpress-oauth-button"
>
  <WordPressIcon />
  Continue with WordPress
</button>
```

**Key Points**:
- ✅ Set `callbackUrl: "/dashboard"` explicitly
- ✅ Set `redirect: true` to enable automatic redirect

## Common WordPress OAuth Issues

### Issue 1: Token Endpoint Wrong
**Problem**: Using `/oauth2/authenticate` instead of `/oauth2/token`
**Fix**: Use `https://public-api.wordpress.com/oauth2/token` for token endpoint

### Issue 2: Wrong API Version
**Problem**: Using REST API v2 endpoints
**Fix**: Use REST API v1 for userinfo: `https://public-api.wordpress.com/rest/v1/me`

### Issue 3: Profile Field Mapping
**Problem**: WordPress.com returns uppercase field names (`ID`, `avatar_URL`)
**Fix**: Handle both cases in profile callback:
```typescript
id: profile.ID?.toString() || profile.id?.toString(),
image: profile.avatar_URL || profile.avatar_url,
```

### Issue 4: Missing Scopes
**Problem**: Not requesting proper OAuth scopes
**Fix**: Minimum scope is `auth`, can add more:
```typescript
scope: "auth" // Basic authentication
// Or for more access:
// scope: "auth global" // Access to all sites
```

## Alternative WordPress Provider Configuration

If the above doesn't work, try this alternative format:

```typescript
import WordPressProvider from "next-auth/providers/wordpress"; // If available

// OR use custom provider with different structure:
const WordPressProvider = {
  id: "wordpress",
  name: "WordPress",
  type: "oauth",
  version: "2.0",
  
  accessTokenUrl: "https://public-api.wordpress.com/oauth2/token",
  authorizationUrl: "https://public-api.wordpress.com/oauth2/authorize?response_type=code",
  profileUrl: "https://public-api.wordpress.com/rest/v1/me",
  
  profile: (profile) => ({
    id: String(profile.ID),
    name: profile.display_name,
    email: profile.email,
    image: profile.avatar_URL,
  }),
  
  clientId: process.env.WORDPRESS_CLIENT_ID,
  clientSecret: process.env.WORDPRESS_CLIENT_SECRET,
};
```

## Testing & Debugging

### Step 1: Clear Browser State
1. Clear all cookies for `wp.instant.tw`
2. Clear browser cache
3. Open incognito/private window

### Step 2: Test OAuth Flow
1. Go to https://wp.instant.tw/login
2. Click "Continue with WordPress"
3. **Watch Network Tab** in DevTools:
   - Should redirect to `https://public-api.wordpress.com/oauth2/authorize?...`
   - After authorization, should redirect to `https://wp.instant.tw/api/auth/callback/wordpress?code=...`
   - Finally should redirect to `https://wp.instant.tw/dashboard`

### Step 3: Check Vercel Logs
```bash
vercel logs --follow
```

Look for:
- ✅ `WordPress OAuth - User data:` log
- ✅ `Created WordPress user:` or `Updated WordPress user:`
- ✅ `Redirect callback triggered`
- ❌ Any error messages

### Step 4: Check for Errors
If you see `OAuthCallback` error, check these:

1. **Redirect URL mismatch** in WordPress.com app settings
2. **Client ID/Secret** incorrect or missing
3. **NEXTAUTH_URL** doesn't match your domain
4. **Token exchange failing** (check Vercel logs)
5. **Profile endpoint returning error**

## Expected Successful Flow

```
1. User clicks "Continue with WordPress"
   → GET https://public-api.wordpress.com/oauth2/authorize?
      client_id=XXX
      &redirect_uri=https://wp.instant.tw/api/auth/callback/wordpress
      &response_type=code
      &scope=auth

2. User authorizes on WordPress.com
   → Redirects to: https://wp.instant.tw/api/auth/callback/wordpress?code=ABC123

3. NextAuth exchanges code for token
   → POST https://public-api.wordpress.com/oauth2/token
      code=ABC123
      &client_id=XXX
      &client_secret=YYY
      &redirect_uri=https://wp.instant.tw/api/auth/callback/wordpress
   → Response: { access_token: "...", token_type: "bearer" }

4. NextAuth fetches user profile
   → GET https://public-api.wordpress.com/rest/v1/me
      Authorization: Bearer [access_token]
   → Response: { ID: 123, email: "...", display_name: "...", avatar_URL: "..." }

5. signIn callback executes
   → Creates/updates user in database
   → Returns true

6. redirect callback executes
   → Returns "/dashboard"

7. User lands on dashboard
   ✅ SUCCESS
```

## Quick Fix Checklist

- [ ] Update WordPress.com app Redirect URL to `https://wp.instant.tw/api/auth/callback/wordpress`
- [ ] Verify `WORDPRESS_CLIENT_ID` in environment variables
- [ ] Verify `WORDPRESS_CLIENT_SECRET` in environment variables
- [ ] Check `NEXTAUTH_URL=https://wp.instant.tw` in Vercel
- [ ] Ensure WordPress provider config uses correct token/userinfo URLs
- [ ] Verify `signIn` callback returns `true` for WordPress
- [ ] Check `redirect` callback returns `/dashboard`
- [ ] Test in incognito window after clearing cache
- [ ] Check Vercel logs for errors

## Success Criteria

✅ User clicks "Continue with WordPress"
✅ Redirects to WordPress.com authorization page
✅ User authorizes application
✅ Redirects back to wp.instant.tw
✅ No `OAuthCallback` error
✅ User lands on `/dashboard`
✅ User session persists
✅ User data saved in database

## If Still Failing

Add temporary debug logging in NextAuth config:

```typescript
export const authOptions: NextAuthOptions = {
  debug: true, // Enable debug mode
  logger: {
    error(code, metadata) {
      console.error("❌ NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("⚠️ NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("🔍 NextAuth Debug:", code, metadata);
    },
  },
  // ... rest of config
};
```

This will show detailed OAuth flow logs in Vercel.