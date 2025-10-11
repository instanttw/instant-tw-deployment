# 🚀 Currency Switcher - Complete Deployment & Testing Guide

## ✅ Currency Implementation Complete!

The currency switcher has been successfully implemented with:
- **3 Currencies Supported**: USD ($), EUR (€), GBP (£)
- **1:1:1 Conversion**: Prices remain the same, only symbols change
- **Persistent Selection**: Choice saved in localStorage
- **Instant Loading**: No flash of USD on page load
- **All Pages Updated**: 7 service pages + pricing page

---

## 📦 Deployment Instructions

### Step 1: Upload Files

1. **Navigate to build folder:**
   ```
   C:\Users\PIETER\Downloads\instant-tw-deployment\out
   ```

2. **Upload ALL contents** to your web server:
   - Upload everything inside the `out` folder
   - Ensure `_next` folder is uploaded completely
   - Maintain the exact folder structure

### Step 2: Clear Server Cache

If your hosting provider has caching:
- Clear **all server-side cache** (Cloudflare, nginx cache, WordPress cache, etc.)
- Clear **CDN cache** if using one
- Restart web server if needed

### Step 3: Clear Browser Cache

**CRITICAL**: Old JavaScript files may be cached in users' browsers!

**Method 1 - Hard Refresh:**
- **Windows**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

**Method 2 - Clear Browser Cache:**
- Open DevTools (F12)
- Right-click the refresh button → "Empty Cache and Hard Reload"

**Method 3 - Incognito/Private Mode:**
- Test in a new incognito window
- No cache, clean slate

---

## 🧪 Complete Testing Checklist

### Test 1: Currency Switcher Button

1. Open your website homepage
2. Look at the top-right header
3. **Find the currency button** (should show `$ USD`)
4. Click it
5. Select **EUR (€)**

**✅ Expected Result:**
- Button immediately changes to show **€ EUR**
- Dropdown menu closes

**❌ If Not Working:**
- Button still shows `$ USD` → Browser cache issue
- Button doesn't exist → Files not uploaded correctly

### Test 2: Price Updates

After selecting EUR:

1. **Homepage** - Check any prices displayed
2. **Pricing Page** (`/pricing`) - Should show €49, €149, etc.
3. **WP Scan** (`/wp-scan`) - Should show:
   - Free: **Free**
   - Pro: **€15/month**
   - Agency: **€49/month**
   - Enterprise: **€599/month**

**✅ Expected Result:**
- ALL prices show € symbol
- Numbers stay the same (15, 49, 599)
- Both main price AND yearly breakdown show €

**❌ If Not Working:**
- Prices still show $ → Old JavaScript cached
- Some pages work, others don't → Missing files

### Test 3: All Service Pages

Visit each page and verify currency symbol:

| Page | URL | Check Prices |
|------|-----|-------------|
| **Themes** | `/services/themes` | €99, €599, €1,299 |
| **Hosting** | `/services/hosting` | €29, €69, €139, €299 |
| **Maintenance** | `/services/maintenance` | €49, €149, €499 |
| **Speed Optimization** | `/services/speed-optimization` | €79, €199, €499 |
| **Security** | `/services/security` | €69, €189, €599 |
| **SEO** | `/services/seo` | €199, €499, €999 |
| **WP Scan** | `/wp-scan` | €15, €49, €599 |

**✅ Expected Result:**
- All pages consistently show € symbol
- Prices are correct
- Yearly breakdown also uses €

### Test 4: Currency Persistence

1. Select **GBP (£)**
2. Verify button shows **£ GBP**
3. Verify prices show **£** symbol
4. **Close the entire browser** (not just the tab!)
5. **Reopen browser**
6. **Navigate to your website**

**✅ Expected Result:**
- Dropdown button immediately shows **£ GBP** (NO flash of $)
- Prices immediately show **£** symbol (NO flash of $)
- No delay, instant from first pixel

**❌ If Not Working:**
- Brief flash of $ before changing to £ → Check console for errors
- Always reverts to $ → localStorage not persisting (check browser settings)

### Test 5: Switch Between All Currencies

1. Start with **USD**
2. Switch to **EUR** → Verify all € symbols
3. Switch to **GBP** → Verify all £ symbols
4. Switch back to **USD** → Verify all $ symbols

**✅ Expected Result:**
- Each switch updates ALL prices instantly
- No delays, no errors
- Consistent across all pages

---

## 🔧 Troubleshooting Common Issues

### Issue 1: Currency button shows $ icon instead of symbol

**Symptom:**
```
Button shows: [💵 icon] USD  instead of  $ USD
```

**Cause:** Old JavaScript files cached

**Fix:**
1. Hard refresh: `Ctrl + Shift + R`
2. Clear browser cache completely
3. Test in incognito mode
4. Re-upload `_next/static/chunks/` folder

### Issue 2: Prices don't update when currency changes

**Symptom:**
- Click EUR, but prices still show $
- Some pages work, others don't

**Cause:** JavaScript errors or missing files

**Fix:**
1. Open DevTools (F12)
2. Check Console tab for errors
3. Look for 404 errors in Network tab
4. Ensure ALL files from `out/_next/` uploaded
5. Check file permissions on server

### Issue 3: Currency reverts to USD on page reload

**Symptom:**
- Select EUR, prices update
- Refresh page → back to USD

**Cause:** `beforeInteractive` script not loading

**Fix:**
1. Check if `index.html` contains the currency-init script
2. View page source (`Ctrl + U`)
3. Search for: `localStorage.getItem('preferred-currency')`
4. If not found: Re-upload ALL HTML files
5. Clear server cache

### Issue 4: "Flash" of USD before switching to saved currency

**Symptom:**
- Selected EUR yesterday
- Today: Brief $ visible, then switches to €

**Cause:** Script loading order issue

**Fix:**
1. This should NOT happen with current build
2. If it does: Check browser console for errors
3. Ensure `currency-init` script is in `<head>` or very early in `<body>`
4. Verify no Content Security Policy blocking inline scripts

### Issue 5: Currency works on some pages, not others

**Symptom:**
- Homepage shows € correctly
- Service pages still show $

**Cause:** Missing page files or old cached pages

**Fix:**
1. Re-upload ENTIRE `out` folder
2. Don't upload selectively
3. Verify folder structure:
   ```
   /services/
     /themes/
       index.html  ← Must exist!
     /hosting/
       index.html  ← Must exist!
   ```
4. Clear ALL caches (server + browser)

---

## 🖥️ Local Testing (Before Deployment)

Test locally first to confirm everything works:

### Option 1: Using Python

```bash
cd C:\Users\PIETER\Downloads\instant-tw-deployment\out
python -m http.server 8000
```

Then open: `http://localhost:8000`

### Option 2: Using Node.js

```bash
cd C:\Users\PIETER\Downloads\instant-tw-deployment\out
npx serve
```

Then open the URL shown

### Option 3: Using PHP

```bash
cd C:\Users\PIETER\Downloads\instant-tw-deployment\out
php -S localhost:8000
```

Then open: `http://localhost:8000`

### Local Testing Steps:

1. Open in browser
2. Open DevTools (F12)
3. Go to Application tab → Local Storage
4. Clear all data
5. Refresh page (should show USD by default)
6. Click currency switcher → Select EUR
7. Check console for any errors
8. Refresh page (should immediately show EUR, no flash)
9. Navigate to `/wp-scan` (should show EUR)
10. Navigate to `/services/themes` (should show EUR)

If it works locally but not on server → **deployment/caching issue**

---

## 📊 Browser DevTools Debugging

### Check 1: Verify Script Loaded

1. Open DevTools (F12)
2. Go to **Console** tab
3. Type: `document.documentElement.getAttribute('data-currency')`
4. Press Enter

**✅ Expected:** Should return `"USD"` or `"EUR"` or `"GBP"`  
**❌ Problem:** Returns `null` → Script didn't run

### Check 2: Verify localStorage

1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **Local Storage**
4. Click your domain
5. Look for `preferred-currency` key

**✅ Expected:** Key exists with value `USD`, `EUR`, or `GBP`  
**❌ Problem:** Key missing → Selection not saving

### Check 3: Verify React Context

1. Open DevTools (F12)
2. Go to **Console** tab
3. Type: `localStorage.getItem('preferred-currency')`
4. Press Enter

**✅ Expected:** Returns your selected currency  
**❌ Problem:** Returns `null` → Never saved

### Check 4: Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Look for any **red** (404/500 errors)

**Common files to check:**
- `/_next/static/chunks/app/layout-*.js`
- `/_next/static/chunks/1255-*.js`
- `/services/themes/index.html`

**❌ If 404 errors:** Files not uploaded correctly

---

## 🎯 Quick Verification Script

Copy-paste this into browser console to test:

```javascript
// Test 1: Check if script ran
console.log('Currency attr:', document.documentElement.getAttribute('data-currency'));

// Test 2: Check localStorage
console.log('Saved currency:', localStorage.getItem('preferred-currency'));

// Test 3: Test saving
localStorage.setItem('preferred-currency', 'EUR');
console.log('Saved EUR, please refresh page');

// After refresh, check if it stuck:
// It should show EUR immediately!
```

---

## ✅ Success Criteria

Your currency switcher is working correctly when:

1. ✅ Dropdown button shows correct symbol ($ € £)
2. ✅ ALL prices across ALL pages show correct symbol
3. ✅ Currency persists after browser close/reopen
4. ✅ NO flash of USD on page load
5. ✅ Switching currencies updates everything instantly
6. ✅ Works in incognito mode (no cache)
7. ✅ Works on mobile browsers
8. ✅ No console errors

---

## 🆘 Still Not Working?

If you've tried everything above and it still doesn't work:

### Diagnostic Steps:

1. **Test locally** (see Local Testing section)
   - If works locally but not on server → deployment issue
   - If doesn't work locally → rebuild needed

2. **Check file timestamps**
   - All files in `out` should be from today (Jan 7, 2025 6:20 AM)
   - If older → you're using wrong build

3. **Verify upload**
   - Download a file from your server
   - Compare with local `out` folder
   - Should be identical

4. **Check server configuration**
   - Is JavaScript enabled?
   - Any Content Security Policy blocking scripts?
   - Any ad blockers interfering?

### Contact Information:

If still broken, provide:
1. URL of your deployed site
2. Screenshot of browser console (F12 → Console)
3. Screenshot of Network tab showing any errors
4. What currency you selected
5. What you see vs what you expect

---

## 📱 Mobile Testing

Don't forget to test on mobile devices:

### iOS Safari:
1. Open in Safari
2. Select EUR
3. Close Safari app completely (swipe up)
4. Reopen Safari
5. Should still show EUR

### Chrome Mobile:
1. Open in Chrome
2. Long-press refresh button → "Empty cache and hard reload"
3. Test currency switching

---

## 🎉 Final Checklist

Before considering deployment complete:

- [ ] Uploaded ALL files from `out` folder
- [ ] Cleared server cache
- [ ] Cleared browser cache / tested incognito
- [ ] Tested USD → EUR → GBP switching
- [ ] Tested all 7 service pages
- [ ] Tested currency persistence (browser restart)
- [ ] No console errors
- [ ] No flash of USD on page load
- [ ] Dropdown button shows correct symbol
- [ ] Tested on mobile device
- [ ] Tested in different browsers (Chrome, Firefox, Safari)

---

## 📈 Expected Behavior Summary

| Action | Expected Result |
|--------|----------------|
| **First visit** | Shows $ USD (default) |
| **Click currency switcher** | Dropdown opens with 3 options |
| **Select EUR** | Button changes to € EUR, all prices update |
| **Navigate to /wp-scan** | Prices show €15, €49, €599 |
| **Navigate to /services/themes** | Prices show €99, €599, €1,299 |
| **Close browser** | Currency preference saved |
| **Reopen browser** | Immediately shows € EUR (no flash of $) |
| **All pages** | Consistently show € symbol |

---

**Build Date:** January 7, 2025 6:20 AM  
**Total Pages:** 46 static pages  
**Build Location:** `C:\Users\PIETER\Downloads\instant-tw-deployment\out`  
**Status:** ✅ Ready for production deployment
