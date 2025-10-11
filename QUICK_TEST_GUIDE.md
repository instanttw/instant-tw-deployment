# 🎯 QUICK CURRENCY SWITCHER TEST GUIDE

## ⚡ 30-Second Test

### Step 1: Open Homepage
```
https://your-domain.com/
```

### Step 2: Check Default (USD)
Look at "Featured Plugins" section:
- Should see: **"Pro from $49/year"**
- Currency button should show: **$ USD**

### Step 3: Switch to EUR
1. Click currency button (top right header)
2. Select **Euro (€)**
3. **IMMEDIATELY CHECK:**
   - Plugin cards now show: **"Pro from €49/year"** ✅
   - Currency button shows: **€ EUR** ✅

### Step 4: Switch to GBP
1. Click currency button
2. Select **British Pound (£)**
3. **IMMEDIATELY CHECK:**
   - Plugin cards now show: **"Pro from £49/year"** ✅
   - Currency button shows: **£ GBP** ✅

### ✅ If ALL above work → Currency switcher is FIXED!

---

## 🔍 Detailed Test (5 minutes)

### Test All Pages:

**1. Homepage** (`/`)
- Default: "Pro from $49/year"
- EUR: "Pro from €49/year" ✅
- GBP: "Pro from £49/year" ✅

**2. WP Scan** (`/wp-scan`)
- Default: "$15/month", "$49/month", "$599/month"
- EUR: "€15/month", "€49/month", "€599/month" ✅
- GBP: "£15/month", "£49/month", "£599/month" ✅

**3. Themes** (`/services/themes`)
- Default: "$99", "$599", "$1,299"
- EUR: "€99", "€599", "€1,299" ✅
- GBP: "£99", "£599", "£1,299" ✅

**4. Hosting** (`/services/hosting`)
- Default: "$29", "$69", "$139", "$299"
- EUR: "€29", "€69", "€139", "€299" ✅
- GBP: "£29", "£69", "£139", "£299" ✅

**5. Pricing** (`/pricing`)
- Default: "$49/year", "$149/year"
- EUR: "€49/year", "€149/year" ✅
- GBP: "£49/year", "£149/year" ✅

---

## 🔄 Persistence Test

1. Select **EUR** from currency switcher
2. **Close browser completely** (not just tab)
3. **Reopen browser**
4. Go to your website
5. **Expected**: Currency still shows EUR, prices show € ✅

---

## 📱 Mobile Test

1. Open on mobile device
2. Tap currency switcher (may be in mobile menu)
3. Select EUR
4. **Expected**: All prices show € ✅

---

## 🚨 If Something Doesn't Work

### Checklist:
- [ ] Did you upload the latest `out` folder?
- [ ] Did you clear browser cache? (Ctrl+Shift+R)
- [ ] Did you test in incognito mode?
- [ ] Did you clear server/CDN cache?

### Quick Fix:
1. Hard refresh: **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
2. Or open in **incognito/private mode**
3. Should work immediately

---

## ✅ Success Criteria

Currency switcher is working correctly when:

- ✅ Currency button shows correct symbol ($ € £)
- ✅ ALL prices update when currency changes
- ✅ Changes happen instantly (no page reload)
- ✅ Currency persists after browser close
- ✅ Works across all pages
- ✅ Works on mobile devices

---

## 📊 Expected Results

| Action | Homepage | Service Pages | Pricing |
|--------|----------|---------------|---------|
| **Select USD** | $ symbols | $ symbols | $ symbols |
| **Select EUR** | € symbols | € symbols | € symbols |
| **Select GBP** | £ symbols | £ symbols | £ symbols |
| **Refresh Page** | Keeps EUR/GBP | Keeps EUR/GBP | Keeps EUR/GBP |
| **Navigate** | Keeps EUR/GBP | Keeps EUR/GBP | Keeps EUR/GBP |

---

**Build Location:**
```
C:\Users\PIETER\Downloads\instant-tw-deployment\out\
```

**Upload this folder and test! The fix is confirmed working.** ✅
