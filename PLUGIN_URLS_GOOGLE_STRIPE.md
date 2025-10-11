# Plugin URLs - Google Drive + Stripe Setup

## 🎯 Overview

Since you're hosting plugins on **Google Drive** and using **Stripe** for payments, your plugin URLs should link directly to:
- Google Drive download links (for free plugins)
- Stripe payment links (for paid plugins)

**No intermediate subdomain needed!**

---

## 📋 Your Configuration

### For Free Plugins:
```typescript
productUrl: "https://drive.google.com/file/d/YOUR-FILE-ID/view?usp=sharing"
```

### For Paid Plugins (Stripe Payment Link):
```typescript
productUrl: "https://buy.stripe.com/test_XXXXXXXXXXXXX"
// or for production:
productUrl: "https://buy.stripe.com/live_XXXXXXXXXXXXX"
```

---

## 🔧 How to Update Plugin URLs

### Step 1: Get Your URLs

#### **Google Drive Links:**

1. Upload plugin to Google Drive
2. Right-click → Share → Get link
3. Set to "Anyone with the link"
4. Copy the link (format: `https://drive.google.com/file/d/FILE-ID/view?usp=sharing`)

**Tip:** For direct download (skip preview), use:
```
https://drive.google.com/uc?export=download&id=FILE-ID
```

#### **Stripe Payment Links:**

1. Go to Stripe Dashboard
2. Click "Payment Links" in sidebar
3. Create new payment link for each plugin
4. Set price, description, etc.
5. Copy the payment link (format: `https://buy.stripe.com/...`)

---

### Step 2: Update Plugin Data

Edit: `C:\Users\PIETER\Downloads\wp-website\config\plugins-data.ts`

**Example for a Free Plugin:**
```typescript
{
  id: "1",
  slug: "instant-image-optimizer",
  name: "Instant Image Optimizer",
  tagline: "Optimize images automatically",
  description: "...",
  icon: "/plugins/image-icon.svg",
  category: "Performance",
  productUrl: "https://drive.google.com/uc?export=download&id=1ABC123XYZ", // ← Google Drive
  rating: 4.9,
  // ... rest of config
  pricing: {
    free: {
      price: 0,
      billingCycle: "annual",
      features: ["Basic optimization", "WebP conversion", "Lazy loading"]
    }
  }
}
```

**Example for a Paid Plugin:**
```typescript
{
  id: "2",
  slug: "instant-uptime-monitor",
  name: "Instant Uptime Monitor",
  tagline: "Monitor your site 24/7",
  description: "...",
  icon: "/plugins/uptime-icon.svg",
  category: "Monitoring",
  productUrl: "https://buy.stripe.com/test_XXXXXXXXXXXXX", // ← Stripe payment link
  rating: 4.8,
  // ... rest of config
  pricing: {
    pro: {
      price: 49,
      billingCycle: "annual",
      features: ["24/7 monitoring", "Email alerts", "99.9% uptime"]
    }
  }
}
```

---

## 📊 Complete Example for All 12 Plugins

Here's how your plugins should be configured:

```typescript
export const allPlugins: Plugin[] = [
  {
    id: "1",
    slug: "instant-image-optimizer",
    name: "Instant Image Optimizer",
    productUrl: "https://drive.google.com/uc?export=download&id=YOUR-FILE-ID-1",
    // Has free tier - links to Google Drive
    pricing: {
      free: { price: 0, features: [...] },
      pro: { price: 29, features: [...] }
    }
  },
  {
    id: "2",
    slug: "instant-uptime-monitor",
    name: "Instant Uptime Monitor",
    productUrl: "https://buy.stripe.com/YOUR-STRIPE-LINK-2",
    // Paid only - links to Stripe
    pricing: {
      pro: { price: 49, features: [...] }
    }
  },
  {
    id: "3",
    slug: "instant-broken-link-fixer",
    name: "Instant Broken Link Fixer",
    productUrl: "https://buy.stripe.com/YOUR-STRIPE-LINK-3",
    pricing: {
      pro: { price: 39, features: [...] }
    }
  },
  // ... rest of plugins
];
```

---

## 🎨 Button Behavior

### Free Plugin (with Google Drive link):
- **"Download Free" button** → Opens Google Drive download
- **"Get Started" button** → Opens Google Drive download
- **"Get Plugin" button** → Opens Google Drive download

### Paid Plugin (with Stripe link):
- **"Buy Pro" button** → Opens Stripe checkout
- **"Get Started" button** → Opens Stripe checkout
- **"Get Plugin" button** → Opens Stripe checkout

All buttons already configured to open in new tab! ✅

---

## 🔄 Update Process

### 1. Prepare Your Links

Create a list of all your links:

```
Plugin 1: Instant Image Optimizer
  - Google Drive: https://drive.google.com/uc?export=download&id=FILE-ID-1
  
Plugin 2: Instant Uptime Monitor
  - Stripe: https://buy.stripe.com/LINK-2
  
Plugin 3: Instant Broken Link Fixer
  - Stripe: https://buy.stripe.com/LINK-3

... etc for all 12 plugins
```

---

### 2. Update Configuration

Edit `config/plugins-data.ts` and update each plugin's `productUrl`:

```typescript
// Find this in each plugin:
productUrl: "https://wp.instant.tw/imo",  // ← OLD

// Replace with:
productUrl: "https://drive.google.com/uc?export=download&id=YOUR-FILE-ID",  // ← NEW (Google Drive)
// OR
productUrl: "https://buy.stripe.com/YOUR-PAYMENT-LINK",  // ← NEW (Stripe)
```

---

### 3. Rebuild & Deploy

```bash
# Rebuild
cd C:\Users\PIETER\Downloads\wp-website
npm run build

# Copy to deployment folder
robocopy .next C:\Users\PIETER\Downloads\instant-tw-deployment\.next /E
Copy-Item config\plugins-data.ts C:\Users\PIETER\Downloads\instant-tw-deployment\config\ -Force

# Deploy to Vercel
cd C:\Users\PIETER\Downloads\instant-tw-deployment
vercel --prod
```

---

## 💡 Pro Tips

### Google Drive Direct Download

Use this format for direct download (skips preview page):
```
https://drive.google.com/uc?export=download&id=FILE-ID
```

**To get FILE-ID from a Google Drive link:**
```
Original: https://drive.google.com/file/d/1ABC123XYZ/view?usp=sharing
FILE-ID:  1ABC123XYZ
Direct:   https://drive.google.com/uc?export=download&id=1ABC123XYZ
```

---

### Stripe Test vs Production

**Test Mode:**
```
https://buy.stripe.com/test_XXXXXXXXXXXXX
```

**Production Mode:**
```
https://buy.stripe.com/XXXXXXXXXXXXX
```

Start with test links, then switch to production when ready!

---

### Mixed Free + Paid Plugins

For plugins with both free and paid tiers:

**Option 1: Link to Stripe (shows both tiers)**
```typescript
productUrl: "https://buy.stripe.com/YOUR-LINK"
// Stripe page can show free download + paid upgrade
```

**Option 2: Link to Google Drive for free tier**
```typescript
productUrl: "https://drive.google.com/uc?export=download&id=FILE-ID"
// Free users download from Drive, you promote paid version in-plugin
```

**Option 3: Create custom landing page**
```typescript
productUrl: "https://wp.instant.tw/plugins/instant-image-optimizer"
// User stays on your site, sees both options
```

---

## 🎯 Recommended Structure

### For Plugins with Free Version:
→ Link to **Google Drive** download
→ Include upgrade CTA inside the plugin

### For Paid-Only Plugins:
→ Link to **Stripe payment link**
→ After payment, send download link via email

### For Freemium Plugins:
→ Link to **Google Drive** for free version
→ Show "Upgrade to Pro" inside plugin settings
→ Upgrade button links to Stripe

---

## ✅ Final Setup

```
User visits: https://wp.instant.tw
              ↓
Clicks "Get Plugin" button
              ↓
              ├── Free plugin → Google Drive download
              └── Paid plugin → Stripe checkout
                                      ↓
                                  User pays
                                      ↓
                             Email with download link
```

**No intermediate subdomain needed!** ✅

---

## 📝 Quick Checklist

Before deployment:

- [ ] Upload all plugins to Google Drive
- [ ] Set sharing to "Anyone with the link"
- [ ] Get direct download links (with FILE-ID)
- [ ] Create Stripe payment links for paid plugins
- [ ] Update all `productUrl` in `config/plugins-data.ts`
- [ ] Test each link (Google Drive downloads, Stripe checkout)
- [ ] Rebuild project: `npm run build`
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Test all "Get Plugin" buttons on live site

---

## 🎉 Done!

Your marketplace at **wp.instant.tw** now links directly to:
- ✅ Google Drive for downloads
- ✅ Stripe for payments

No extra subdomain needed! Simple and clean! 🚀
