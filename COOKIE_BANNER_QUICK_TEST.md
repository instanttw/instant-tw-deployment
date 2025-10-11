# 🍪 Cookie Banner Quick Test Guide

## ⚡ 60-Second Test

### Step 1: First Visit Test
1. Open your website in **incognito/private mode**
2. Wait **1-2 seconds**
3. ✅ **Cookie banner slides up** from bottom of screen

### Step 2: Check Banner Content
Banner should show:
- ✅ **Cookie icon** and "We Value Your Privacy" heading
- ✅ Description text about cookies
- ✅ **3 buttons**: "Accept All", "Reject All", "Cookie Settings"
- ✅ Links to Privacy Policy and Cookie Policy
- ✅ **[X] close button** in top-right corner

### Step 3: Test Accept All
1. Click **"Accept All"** button
2. ✅ **Banner disappears** smoothly
3. **Refresh page**
4. ✅ **Banner stays hidden** (preference saved)

### Step 4: Test Cookie Settings
1. Clear browser data (or new incognito window)
2. Wait for banner to appear
3. Click **"Cookie Settings"** button
4. ✅ **Advanced settings** opens with 4 categories:
   - Necessary Cookies (always ON) ✅
   - Functional Cookies (toggle OFF) ⚪
   - Analytics Cookies (toggle OFF) ⚪
   - Marketing Cookies (toggle OFF) ⚪
5. Enable **Functional** and **Analytics**
6. Click **"Save Preferences"**
7. ✅ **Banner closes** and saves choices

### Step 5: Test Footer Link
1. Scroll to bottom of page
2. Find footer links area
3. ✅ **"Cookie Settings"** link visible (with gear icon)
4. Click the link
5. ✅ **Cookie banner reopens** in settings view

### Step 6: Test Reject All
1. Clear browser data again
2. Wait for banner
3. Click **"Reject All"**
4. ✅ **Banner closes**
5. Refresh page
6. ✅ **Banner stays hidden** (only necessary cookies enabled)

---

## 📱 Mobile Test

1. Open on mobile device (or resize browser)
2. ✅ Banner appears at bottom
3. ✅ Buttons stack vertically on small screens
4. ✅ Settings view is scrollable
5. ✅ All buttons easily tappable

---

## 🔍 Detailed Feature Test

### Test Expandable Sections:
1. Open Cookie Settings
2. Click **chevron (▼)** next to "Functional Cookies"
3. ✅ **Section expands** showing:
   - Description
   - Examples
   - Additional info
4. Click chevron again
5. ✅ **Section collapses**

### Test Toggle Switches:
1. Open Cookie Settings
2. Try to toggle **Necessary Cookies**
3. ✅ **Can't toggle** (disabled/always on)
4. Toggle **Functional Cookies** ON
5. ✅ **Switch moves** to enabled position
6. Toggle OFF again
7. ✅ **Switch moves** back

### Test Persistence:
1. Accept all cookies
2. Close browser completely
3. Reopen browser
4. Visit website
5. ✅ **No banner shows** (choice remembered)

### Test localStorage:
1. Open browser DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Find your domain
4. ✅ See keys:
   - `cookie-consent-given`: "true"
   - `cookie-consent-preferences`: {...}

---

## ✅ Success Criteria

Your cookie banner is working correctly if:

- ✅ Banner appears after 1 second on first visit
- ✅ Banner slides up smoothly from bottom
- ✅ Accept All button saves preference
- ✅ Reject All button saves preference  
- ✅ Cookie Settings opens advanced view
- ✅ Can customize individual categories
- ✅ Preferences persist after page refresh
- ✅ Footer link reopens settings
- ✅ Works on mobile devices
- ✅ No console errors

---

## 🐛 If Something Doesn't Work

### Banner doesn't appear:
- Hard refresh: **Ctrl + Shift + R**
- Clear browser cache and cookies
- Try incognito/private mode
- Wait full 1-2 seconds

### Preferences don't save:
- Check localStorage in DevTools
- Try different browser
- Disable browser extensions (some block cookies)
- Check browser console for errors

### Mobile issues:
- Zoom out if banner is cut off
- Rotate device to test both orientations
- Try different mobile browsers

---

## 📊 Expected Behavior Summary

| Action | Expected Result |
|--------|----------------|
| **First visit** | Banner appears after 1 second |
| **Click Accept All** | Banner closes, all cookies enabled |
| **Click Reject All** | Banner closes, only necessary cookies |
| **Click Cookie Settings** | Advanced settings opens |
| **Save custom prefs** | Banner closes, preferences saved |
| **Refresh page** | Banner stays hidden (choice saved) |
| **Click footer link** | Banner reopens in settings mode |
| **Mobile view** | Responsive, scrollable, usable |

---

## 🚀 Quick Verification Commands

### Check localStorage in Browser Console:
```javascript
// Check if consent given
localStorage.getItem('cookie-consent-given')
// Should return: "true" or null

// Check preferences
JSON.parse(localStorage.getItem('cookie-consent-preferences'))
// Should return: { necessary: true, functional: true/false, ... }

// Clear consent (for testing)
localStorage.removeItem('cookie-consent-given')
localStorage.removeItem('cookie-consent-preferences')
location.reload()
```

---

## 📍 Where to Find Components

**Banner appears:** Bottom of screen, slides up from below

**Footer link:** 
```
Footer → Bottom section → Legal links
Privacy Policy | Terms of Service | Refund Policy | Cookie Settings
                                                      ↑ HERE
```

---

**Build Location:**
```
C:\Users\PIETER\Downloads\instant-tw-deployment\out\
```

**Upload and test! The cookie banner is ready.** ✅
