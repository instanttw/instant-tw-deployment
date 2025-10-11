
# Fix Next.js i18n Context Error in Production

## Problem Summary
Production site at https://wp.instant.tw returns 500 Internal Server Error due to:
`TypeError: Cannot read properties of null (reading 'useContext')`

The error occurs because Header and Footer components use `useTranslations()` from next-intl in the root layout, but the i18n context isn't properly available across mixed route types (i18n routes like /en/* and non-i18n routes like /login, /dashboard).

## Current Architecture Issues
1. Root layout (app/layout.tsx) contains Header/Footer that use next-intl hooks
2. Root layout serves BOTH:
   - i18n routes: /en/*, /zh/* (with [locale] dynamic segment)
   - Non-i18n routes: /login, /dashboard, /api/* (without locale)
3. NextIntlClientProvider in root layout doesn't properly handle this split
4. Build succeeds locally but fails in production

## Files to Investigate
- `app/layout.tsx` (root layout with Header/Footer)
- `app/[locale]/layout.tsx` (locale-specific layout)
- `middleware.ts` (i18n routing logic)
- `i18n.ts` or `next-intl.config.ts` (i18n configuration)
- `components/Header.tsx` and `components/Footer.tsx`
- `app/page.tsx` (root page redirect)
- `app/[locale]/page.tsx` (homepage)

## Recommended Solution Approaches

### Option 1: Split Layouts (Recommended - Least Breaking)
Create separate layouts for i18n and non-i18n routes:

1. Keep root layout minimal (no Header/Footer)
2. Create `app/[locale]/layout.tsx` with Header/Footer wrapped in NextIntlClientProvider
3. Create separate layouts for /login, /dashboard with their own header/footer or none
4. Move Header/Footer imports into locale-specific layout only

### Option 2: Make Header/Footer Context-Optional
1. Modify Header and Footer to gracefully handle missing i18n context
2. Use try-catch or conditional rendering when calling useTranslations()
3. Provide fallback English text when context is unavailable
4. Example pattern:
```tsx
'use client'
import { useTranslations } from 'next-intl'

export function Header() {
  let t
  try {
    t = useTranslations('Header')
  } catch {
    // Fallback for non-i18n routes
    t = (key) => fallbackTranslations[key] || key
  }
  return <header>{t('title')}</header>
}
```

### Option 3: Move All Routes Under [locale]
1. Restructure ALL routes to be under [locale]: /en/login, /en/dashboard
2. Update middleware to always require locale
3. Remove any non-i18n routes from root app directory
4. This is a breaking change but ensures consistent i18n context

## Implementation Steps

### Step 1: Analyze Current State
```bash
# Show current file structure
ls -la app/
ls -la app/[locale]/

# Check middleware configuration
cat middleware.ts

# Check i18n config
cat i18n.ts
cat next-intl.config.ts

# Review root layout
cat app/layout.tsx

# Review locale layout
cat app/[locale]/layout.tsx

# Check Header and Footer components
cat components/Header.tsx
cat components/Footer.tsx
```

### Step 2: Implement Solution (Option 1 Recommended)

**2a. Update Root Layout** (`app/layout.tsx`)
- Remove NextIntlClientProvider
- Remove Header and Footer components
- Keep only essential HTML structure and global providers

**2b. Update Locale Layout** (`app/[locale]/layout.tsx`)
- Add NextIntlClientProvider with proper locale
- Import and render Header and Footer here
- Ensure messages are loaded correctly

**2c. Handle Non-i18n Routes**
- Create `app/(auth)/layout.tsx` for /login routes with its own header
- Create `app/(dashboard)/layout.tsx` for /dashboard routes
- Use route groups to avoid affecting URL structure

**2d. Update Middleware**
- Ensure non-i18n routes are properly excluded from locale detection
- Verify matcher pattern excludes /login, /dashboard, /api, /_next, etc.

### Step 3: Test Locally
```bash
# Clean build
rm -rf .next
npm run build
npm run start

# Test all route types
curl http://localhost:3000/
curl http://localhost:3000/en
curl http://localhost:3000/login
curl http://localhost:3000/dashboard
```

### Step 4: Verify Production Build
```bash
# Build with production environment
NODE_ENV=production npm run build

# Check for any hydration or context errors in build output
```

## Key Things to Check

1. **Server Logs**: Look for the exact line causing `useContext` null error
2. **next-intl version**: Verify compatibility with Next.js 15.5.4
```bash
cat package.json | grep next-intl
cat package.json | grep next
```

3. **Missing 'use client' directives**: Ensure components using hooks have 'use client'
4. **Async Server Components**: Check if any server components are incorrectly using client hooks
5. **Provider nesting**: Ensure NextIntlClientProvider isn't nested incorrectly

## Debugging Commands

```bash
# Check for React version mismatches
npm ls react react-dom

# View recent commits
git log --oneline -10

# See what changed in problematic commit
git show 7be85ec

# Check Vercel environment variables
vercel env ls

# Pull production environment locally
vercel env pull .env.local
```

## Expected Outcome

After fix:
- ✅ https://wp.instant.tw/ → redirects to /en
- ✅ https://wp.instant.tw/en → loads homepage with i18n
- ✅ /login, /dashboard → load without i18n context errors
- ✅ Header/Footer display correctly on i18n routes
- ✅ No 500 errors in production
- ✅ Build succeeds without warnings

## Additional Context

- Site worked before commit 7be85ec
- Build succeeds locally but fails in production
- This suggests environment-specific issue or hydration mismatch
- Consider checking for differences in how Vercel handles SSR vs local

Please analyze the current code structure, identify the exact cause of the useContext error, and implement the recommended solution (preferably Option 1: Split Layouts). Ensure all routes work correctly both locally and in production.
```

This prompt provides Claude Code with:
1. Clear problem description with technical details
2. Multiple solution approaches ranked by recommendation
3. Step-by-step implementation instructions
4. Specific files to check and commands to run
5. Testing procedures and expected outcomes
6. Debugging guidance

