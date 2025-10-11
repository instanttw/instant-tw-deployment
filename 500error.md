# DEBUG: Production 500 Errors After Split Layout Implementation

## Critical Context
Split layout architecture was successfully implemented per team recommendation, but ALL routes return 500 errors in production while builds succeed locally and on Vercel.

## Current State
- ✅ Local build: Works perfectly
- ✅ Vercel build: Succeeds with no errors
- ❌ Production runtime: ALL routes return 500 errors
- Latest deployment: dpl_2jiZT5QKqeci1izDjTSQBoRBUscT (commit 3e6a379)

## Immediate Diagnostic Steps

### Step 1: Check Vercel Production Logs
```bash
# Try to get runtime logs (may timeout - use Vercel dashboard if so)
vercel logs --follow

# Get logs for specific deployment
vercel logs dpl_2jiZT5QKqeci1izDjTSQBoRBUscT

# If CLI times out, use Vercel Dashboard:
# 1. Go to https://vercel.com/instant-tw-deployment
# 2. Click on latest deployment
# 3. Go to "Runtime Logs" tab
# 4. Look for Error entries with stack traces
```

### Step 2: Identify Common Production-Only Issues

Check for these Next.js 15 + React 19 production-specific problems:

**A. Async Params Issue (Most Likely)**
Next.js 15 requires async params. Check all page.tsx and layout.tsx files:

```bash
# Search for synchronous params usage
grep -r "params\:" app/ --include="*.tsx" --include="*.ts"

# Look for patterns like:
# ❌ Wrong: export default function Page({ params })
# ✅ Correct: export default async function Page({ params })
```

**B. Check All Dynamic Route Files**
```bash
# List all files that might use params
find app -name "page.tsx" -o -name "layout.tsx" | xargs grep -l "params"
```

**C. Examine Key Files for Async Issues**

1. **Root page** (`app/page.tsx`)
```bash
cat app/page.tsx
```
Should be:
```tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/en')
}
```

2. **Locale layout** (`app/[locale]/layout.tsx`)
```bash
cat app/[locale]/layout.tsx
```
Must have async params:
```tsx
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }> // Note: Promise wrapper
}) {
  const { locale } = await params // Must await
  // ... rest of code
}
```

3. **Locale page** (`app/[locale]/page.tsx`)
```bash
cat app/[locale]/page.tsx
```
Must also be async:
```tsx
export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // ... rest of code
}
```

### Step 3: Check For Server Component Issues

**A. Verify no client hooks in server components**
```bash
# Search for useContext, useState, useEffect in files without 'use client'
grep -r "use\(Context\|State\|Effect\)" app/ --include="*.tsx" | grep -v "'use client'"
```

**B. Check middleware for runtime errors**
```bash
cat middleware.ts

# Look for:
# 1. Synchronous operations that might fail in Edge runtime
# 2. Node.js APIs not available in Edge
# 3. Missing error handling
```

### Step 4: Check Environment Variables

**A. List all environment variables in Vercel**
```bash
vercel env ls

# Critical vars to check:
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
# - Any API keys
```

**B. Pull production env to test locally**
```bash
vercel env pull .env.production
NODE_ENV=production npm run build
npm run start
```

### Step 5: Check for next-intl Compatibility Issues

**A. Verify next-intl configuration**
```bash
cat i18n.ts
cat next.config.js

# Check next-intl version
npm list next-intl
```

**B. Look for getRequestConfig issues**
```bash
# Find i18n configuration
find . -name "*i18n*" -o -name "*intl*" | grep -v node_modules
```

Common issue in production:
```tsx
// ❌ Wrong: Synchronous
export default getRequestConfig(({ locale }) => ({
  messages: require(`./messages/${locale}.json`)
}))

// ✅ Correct: Async
export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}))
```

## Implementation Fixes

### Fix 1: Update All Params to Async (Most Likely Fix)

**Update app/[locale]/layout.tsx:**
```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

// Add this to validate locale
const locales = ['en', 'zh'] // Your supported locales

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // CRITICAL: Must await params
  const { locale } = await params
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }
  
  // Get messages
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <CartProvider>
        <CurrencyProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Chatbot />
          <CartSidebar />
          <CookieConsent />
        </CurrencyProvider>
      </CartProvider>
    </NextIntlClientProvider>
  )
}
```

**Update app/[locale]/page.tsx:**
```tsx
export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Your page content
  return <div>...</div>
}
```

**Update any other dynamic routes:**
```bash
# Find all files with [param] in path
find app -type d -name "\[*\]"

# Each needs async params handling
```

### Fix 2: Check i18n Configuration

**Update i18n.ts (or next-intl config):**
```tsx
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  }
})
```

### Fix 3: Add Error Boundaries

**Add app/error.tsx (if not exists):**
```tsx
'use client'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error('Root error:', error)
  
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>Error: {error.message}</p>
      <p>Digest: {error.digest}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

**Add app/[locale]/error.tsx:**
```tsx
'use client'

export default function LocaleError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error('Locale error:', error)
  
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Testing Procedure

### Test 1: Local Production Build
```bash
# Clean everything
rm -rf .next
rm -rf node_modules/.cache

# Fresh build
npm run build

# Run in production mode
npm run start

# Test all routes
curl http://localhost:3000/
curl http://localhost:3000/en
curl http://localhost:3000/login
curl http://localhost:3000/dashboard
```

### Test 2: Vercel Preview Deployment
```bash
# Deploy to preview
vercel --prod=false

# Test the preview URL
# Check logs immediately after deployment
vercel logs --follow
```

### Test 3: Check Build Output
```bash
# Look for any warnings in build output
npm run build 2>&1 | tee build.log

# Check for:
# - "use client" warnings
# - Dynamic import warnings
# - Middleware warnings
```

## Common Next.js 15 Production Issues Checklist

- [ ] All dynamic route handlers use `await params`
- [ ] All `getRequestConfig` functions are async
- [ ] No Node.js APIs used in middleware (Edge runtime)
- [ ] All client components have 'use client' directive
- [ ] No synchronous require() for dynamic imports
- [ ] Environment variables exist in Vercel
- [ ] No console.error in Server Components (causes hydration issues)
- [ ] Middleware doesn't modify response headers incorrectly
- [ ] No circular dependencies in imports

## Debug Output Commands

Run these to gather information:

```bash
# 1. Show all layout and page files
find app -name "layout.tsx" -o -name "page.tsx"

# 2. Check for params usage
grep -r "params" app/ --include="*.tsx" -A 2 -B 2

# 3. Check middleware
cat middleware.ts

# 4. Check i18n config
cat i18n.ts
cat next-intl.config.ts 2>/dev/null || echo "No next-intl.config.ts"

# 5. Check package versions
cat package.json | grep -E "(next|react|next-intl)"

# 6. List all 'use client' files
grep -r "'use client'" app/ --include="*.tsx" | cut -d: -f1 | sort -u

# 7. Check for any .env files
ls -la .env* 2>/dev/null || echo "No .env files"
```

## Expected Resolution

After implementing async params fix:
- ✅ https://wp.instant.tw/ → redirects to /en → loads correctly
- ✅ https://wp.instant.tw/en → loads with i18n
- ✅ https://wp.instant.tw/login → loads non-i18n route
- ✅ No 500 errors
- ✅ Vercel logs show successful requests

## If Still Failing

1. **Enable verbose logging** in next.config.js:
```js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true
    }
  }
}
```

2. **Add temporary debug logging** in layouts to identify where it fails

3. **Try simpler version** - temporarily remove all providers from [locale]/layout.tsx to isolate issue

4. **Check Vercel dashboard** for any platform-specific issues or outages

Please implement these fixes, focusing first on the async params issue as it's the most common cause of production-only 500 errors in Next.js 15.
```

