# Verify You Have the Latest Deployment

## How to Check Which Version is Deployed

### Method 1: Check Vercel Dashboard
1. Go to: https://vercel.com/instants-projects-b4491864/instant-tw-deployment
2. Click **"Deployments"** tab
3. Look at the **first/top deployment** (should say "Production")
4. Check the commit hash - it should be: **`abb1aeb`** or **`cab0a19`**
5. If it shows **`0b8ae72`** or older, you need to redeploy

### Method 2: Check Footer for Clues
- **OLD VERSION**: Footer shows "Refund Policy" and "Cookie Settings" in English (even on /es)
- **NEW VERSION**: Footer shows "Política de Reembolso" and "Configuración de Cookies" on /es

### Method 3: Check Browser Console
1. Open https://wp.instant.tw/es
2. Press F12 → Console tab
3. Type: `document.querySelector('footer').innerText`
4. If you see "Refund Policy", you're on the old deployment

## Latest Commits Not Yet Deployed:

Your local git has these commits:
1. `abb1aeb` - Fix footer translations and wp-scan 404 (LATEST)
2. `cab0a19` - Documentation
3. `638ec00` - Hero component translatable
4. `ecf8390` - Documentation
5. `476c49a` - pt-BR to pt fix
6. `1850262` - NextIntlClientProvider in root layout
7. `62eb539` - Populate [locale] directory

But production might still be on:
- `0b8ae72` - Initial i18n (with bugs)

## How to Force Deploy Latest

### If Vercel Dashboard Shows Old Commit:

**Option A: Redeploy Latest Commit**
1. In Vercel Dashboard → Deployments
2. Find commit **`abb1aeb`** (the very top one)
3. If it's NOT marked "Production", click it
4. Click three dots (•••) → **"Promote to Production"**

**Option B: Manual Redeploy**
1. In Vercel Dashboard → Deployments  
2. Click the TOP deployment (should be `abb1aeb`)
3. Click three dots → **"Redeploy"**
4. **IMPORTANT**: Make sure "Use existing Build Cache" is UNCHECKED
5. Wait 2 minutes

### Clear Browser Cache:
After redeploying, you MUST clear cache:
1. Press **Ctrl+Shift+Delete** (or Cmd+Shift+Delete on Mac)
2. Select "Cached images and files"
3. Choose "All time"
4. Click "Clear data"
5. Close ALL browser tabs with wp.instant.tw
6. Open a NEW incognito/private window
7. Visit https://wp.instant.tw/es

## What You Should See After Correct Deployment

### On https://wp.instant.tw/es (Spanish):

**Header (Top Navigation):**
- "Plugins" (not Plugins - should be same)
- "Precios" (not Pricing) ✅
- "Servicios" dropdown (not Services) ✅
- "Explorar Plugins" button (not Browse Plugins) ✅

**Hero Section:**
- Title: "Plugins WordPress Premium y Personalizados Construidos para el Éxito"
- Subtitle: Starting with "Transforma tu sitio WordPress..."
- Button: "Explorar Todos los Plugins" (not Browse All Plugins)

**Footer (Bottom):**
- "Productos", "Servicios", "Recursos", "Empresa" column headers
- "Política de Reembolso" (not Refund Policy) ✅
- "Configuración de Cookies" (not Cookie Settings) ✅
- "© 2025 Instant. Todos los derechos reservados." (not All rights reserved) ✅

**Trust Badges:**
- Should show 6 badges: SSL Seguro, Cumple con GDPR, PCI DSS Nivel 1, 99.9% de Tiempo Activo, Garantía de Devolución, Soporte 24/7

### On https://wp.instant.tw/wp-scan:
- Page should load (not 404)
- Content will be in English (WP Scan is excluded from i18n)

### Still in English (Expected):
- Featured Plugins section
- Services Overview cards
- Benefits section
- Testimonials

## Troubleshooting

### If Still Showing English After Redeploy:

**1. Verify Deployment Commit**
```bash
# Check what's deployed
curl -I https://wp.instant.tw/ | grep x-vercel
```
Look for build ID and compare to Vercel dashboard

**2. Check Build Logs**
- In Vercel Dashboard → Click the deployment
- Click "Building" → "View Build Logs"
- Search for "app/[locale]" - should show files were deployed
- Search for "messages/es.json" - should be included

**3. CDN Cache**
- Vercel uses CDN caching
- Wait 5-10 minutes for global cache to clear
- Or use: https://wp.instant.tw/es?nocache=1

**4. Check Translation Files**
- In Vercel deployment → "Source" tab
- Navigate to `messages/es.json`
- Verify it contains the Spanish translations

### If /wp-scan Still 404:

1. Check middleware.ts in deployment has `wp-scan` exclusion
2. Verify app/wp-scan/page.tsx exists in deployment
3. Check Vercel function logs for routing errors

## Expected vs Actual

### What SHOULD Be Translated (After Latest Deploy):
✅ Header navigation
✅ Footer links and legal text
✅ Hero title, subtitle, CTA buttons
✅ Trust badges (SSL, GDPR, etc.)
✅ Payment method labels

### What Will NOT Be Translated (Not Implemented Yet):
❌ "Trusted by 5,720,000+ WordPress sites" badge
❌ Featured Plugins section
❌ Services Overview cards
❌ WP Scan Promo banner
❌ Benefits section
❌ Testimonials section
❌ Statistics (Average Rating, Active Installs, etc.)

## Quick Test Script

Run this in browser console on https://wp.instant.tw/es:

```javascript
// Check if translations are working
console.log('Header:', document.querySelector('header').innerText.includes('Precios') ? 'TRANSLATED ✅' : 'ENGLISH ❌');
console.log('Footer:', document.querySelector('footer').innerText.includes('Política de Reembolso') ? 'TRANSLATED ✅' : 'ENGLISH ❌');
console.log('Hero:', document.querySelector('h1').innerText.includes('WordPress Premium') ? 'TRANSLATED ✅' : 'ENGLISH ❌');
```

If all show ❌, the deployment failed or cache is serving old version.
If Header shows ✅ but Hero shows ❌, the Hero commit didn't deploy.

---

**IMPORTANT**: Make sure you're deploying commit `abb1aeb` from Vercel Dashboard, NOT the old `0b8ae72` commit. Check the commit hash in the deployment details!
