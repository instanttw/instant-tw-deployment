# WP Scan Development Plan & Status

## 📊 Current Status Analysis

### ⚠️ CRITICAL ISSUE: All Scans Show Mock Data

**Current Reality:**
- ❌ WordPress detection works but scan results are **100% fake**
- ❌ Free and paid users see **identical mock data**
- ❌ Stripe links are test URLs that don't work
- ❌ No backend, no database, no real scanning

Looking at the code (wp-scan/page.tsx line 98-152):

```typescript
const mockResults: ScanResult = {
  url: url,
  core_version: "6.4.2",
  core_status: Math.random() > 0.7 ? "outdated" : "secure",
  plugins: [
    { name: "Contact Form 7", version: "5.8.4", status: Math.random() > 0.5 ? "secure" : "outdated" },
    // ... more random data
  ],
  // COMPLETELY FAKE/RANDOM DATA
};
```

**Translation:** Currently, **EVERYONE (free and paid)** sees the **SAME RANDOM FAKE DATA** regardless of what they pay.

---

## 🎭 What's Promised vs What's Delivered

| Feature | Free Plan | Pro Plan ($15/mo) | Agency Plan ($49/mo) | Enterprise ($599/mo) | **Actually Built?** |
|---------|-----------|-------------------|----------------------|----------------------|---------------------|
| **One-time scan** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ **FAKE** - Shows mock data |
| **Basic vulnerability check** | ✅ Yes | ✅ Enhanced | ✅ Enhanced | ✅ Enhanced | ❌ **FAKE** - Random status |
| **Real WordPress scanning** | - | - | - | - | ❌ **NOT IMPLEMENTED** |
| **CVE/Vulnerability IDs** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes | ❌ **NOT IMPLEMENTED** |
| **CVSS Risk Scores** | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ❌ **NOT IMPLEMENTED** |
| **Downloadable PDF Reports** | ❌ No | ✅ Yes | ✅ White-label | ✅ White-label | ❌ **NOT IMPLEMENTED** |
| **Weekly/Daily Scans** | ❌ No | ✅ Weekly | ✅ Daily | ✅ Real-time | ❌ **NOT IMPLEMENTED** |
| **Email Alerts** | ❌ No | ✅ Yes | ✅ Yes + Slack | ✅ Yes + Webhooks | ❌ **NOT IMPLEMENTED** |
| **Multiple Sites** | ❌ No | 3 sites | 25 sites | Unlimited | ❌ **NOT IMPLEMENTED** |
| **Continuous Monitoring** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes | ❌ **NOT IMPLEMENTED** |
| **API Access** | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ **NOT IMPLEMENTED** |
| **Dedicated Dashboard** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes | ❌ **NOT IMPLEMENTED** |

---

## 🚨 The Real Problem

### Current User Journey (Free):
1. User enters URL → WordPress detection works ✅
2. User clicks "Run Free Scan" → Shows MOCK DATA ❌
3. User sees random fake results for plugins/themes ❌

### Current User Journey (Paid):
1. User clicks "Get Started" on Pro/Agency plan
2. Redirects to: `https://checkout.stripe.com/c/pay/cs_test_wpscan_pro_monthly`
3. **This is a TEST Stripe link that doesn't exist** ❌
4. Even if payment worked, user would see **SAME MOCK DATA** as free ❌

---

## 🛠️ What Needs to Be Built

### Phase 1: Make Free Scan Actually Work (Foundation)

#### 1. Real WordPress Scanning Backend
```typescript
// Create: /app/api/scan-wordpress/route.ts
// This should ACTUALLY scan WordPress sites, not return mock data

Features needed:
- Detect WordPress core version
- List installed plugins + versions
- List installed themes + versions  
- Check against vulnerability database
- Return REAL data (not Math.random())
```

**Implementation Options:**
- **Option A (Recommended):** Integrate with **WPScan API** (wpscan.com has commercial API)
- **Option B (SELECTED):** Build custom scraper using wp-json API + vulnerability database
- **Option C:** Use WPVulnDB or similar vulnerability database

#### 2. Vulnerability Database
Need a source of truth for WordPress vulnerabilities:
- WPScan Vulnerability Database (recommended - 24,000+ CVEs)
- WPVulnDB
- CVE.org
- NVD (National Vulnerability Database)

---

### Phase 2: Differentiate Free from Paid

#### Free Plan Limitations (What to Build):

1. **One-Time Scan Only**
   - No ability to save scan results
   - No scan history
   - Must re-scan manually each time

2. **Basic Information Only**
   ```typescript
   // Free scan shows:
   {
     core_version: "6.4.2",
     core_status: "outdated", // Just status, no CVE details
     plugins: [
       { name: "Plugin Name", status: "vulnerable" } 
       // ❌ NO version details
       // ❌ NO CVE IDs
       // ❌ NO CVSS scores
       // ❌ NO fix recommendations
     ]
   }
   ```

3. **No Report Download**
   - Can view results on screen only
   - No PDF/CSV export

4. **Limited Details**
   - Show "X vulnerabilities found" but not details
   - Show "Plugin is outdated" but not what version is safe
   - Blur or hide specific CVE IDs behind paywall

---

### Phase 3: Build Paid Plan Features

#### Pro Plan ($15/month) - What to Build:

1. **User Authentication + Dashboard**
   ```
   Create: dash.instant.tw/wp-scan/
   - Login/signup system (NextAuth already configured?)
   - Dashboard to manage up to 3 websites
   - Scan history for each site
   ```

2. **Detailed Scan Results**
   ```typescript
   // Pro scan shows FULL details:
   {
     plugins: [{
       name: "Contact Form 7",
       version: "5.8.4",
       latest_version: "5.9.0",
       vulnerabilities: [
         {
           cve_id: "CVE-2023-1234",
           severity: "High",
           cvss_score: 7.5,
           description: "SQL Injection vulnerability...",
           fixed_in: "5.9.0",
           references: ["https://..."]
         }
       ]
     }]
   }
   ```

3. **Scheduled Scans**
   - Cron job or scheduled task (Vercel Cron?)
   - Scan each site weekly automatically
   - Store results in database

4. **PDF Report Generation**
   - Use library like `puppeteer` or `jsPDF`
   - Generate downloadable PDF with scan results

5. **Email Alerts**
   - Email service (SendGrid, Resend, etc.)
   - Send email when new vulnerability detected
   - Weekly summary email

6. **Database Schema**
   ```sql
   users (id, email, plan, stripe_customer_id)
   websites (id, user_id, url, last_scan_date, status)
   scans (id, website_id, scan_date, results_json)
   vulnerabilities (id, scan_id, cve_id, severity, status)
   ```

---

#### Agency Plan ($49/month) - Additional Features:

1. **White-Label Reports**
   - Customize PDF header/footer with agency logo
   - Remove "Powered by Instant" branding
   - Custom domain for report links

2. **Daily Scans**
   - Run cron job daily instead of weekly

3. **Up to 25 Sites**
   - Increase website limit in database/UI

4. **CVSS Risk Scores**
   - Show full CVSS v3 breakdown
   - Risk prioritization dashboard

5. **Slack Integration**
   - Slack webhook notifications
   - Send alerts to customer's Slack channel

6. **Team Management**
   - Invite team members
   - Role-based access (admin, viewer)

---

#### Enterprise Plan ($599/month) - Additional Features:

1. **RESTful API**
   ```
   POST /api/v1/scan
   GET /api/v1/sites/{id}/scans
   GET /api/v1/vulnerabilities
   
   Requires API key authentication
   ```

2. **Real-Time Monitoring**
   - WebSocket or Server-Sent Events
   - Instant notifications (not just daily/weekly)

3. **Webhooks**
   - HTTP webhooks to customer's endpoint
   - Payload with vulnerability data

4. **Vulnerability PoC (Proof of Concept)**
   - Link to exploit code
   - Attack vector details
   - Remediation steps

5. **Dedicated Account Manager**
   - Onboarding call
   - Custom integration support
   - Priority email support

---

## 💰 Recommended Differentiation Strategy

### Free Plan (Marketing Tool)
```
Purpose: Lead generation
What to show:
- ✅ Scan works and detects WordPress
- ✅ Shows "5 vulnerabilities found" (count only)
- ✅ Shows plugin names but versions/details are blurred
- ❌ No CVE IDs, no fix versions
- ❌ No download, no history
- ❌ CTA: "Upgrade to see full details"
```

### Pro Plan (Individual/SMB)
```
Purpose: Individuals managing a few sites
What to show:
- ✅ Full vulnerability details + CVE IDs
- ✅ Fix recommendations
- ✅ Download PDF report
- ✅ Weekly auto-scans + email alerts
- ✅ Up to 3 sites
```

### Agency Plan (Web Agencies)
```
Purpose: Agencies managing client sites
What to show:
- ✅ Everything in Pro
- ✅ White-label reports (add agency branding)
- ✅ Daily scans instead of weekly
- ✅ Up to 25 sites
- ✅ CVSS scores + risk prioritization
- ✅ Slack notifications
```

### Enterprise (Hosting Companies/Large Orgs)
```
Purpose: High-volume users needing automation
What to show:
- ✅ Everything in Agency
- ✅ RESTful API access
- ✅ Unlimited sites
- ✅ Real-time monitoring (not just daily)
- ✅ Webhooks for automation
- ✅ Vulnerability PoC data
```

---

## 🎯 Immediate Action Items

### Priority 1 (Must Have - Make Free Scan Real)
1. ✅ WordPress detection (DONE - works now!)
2. ❌ **Build actual scanning backend** - Option B: Custom scraper with wp-json API
3. ❌ Show REAL plugin/theme data (not mock)
4. ❌ Implement basic vulnerability checking

### Priority 2 (Differentiate Free vs Paid)
1. ❌ Add authentication (NextAuth)
2. ❌ Create user dashboard at dash.instant.tw
3. ❌ Build database schema for users/sites/scans
4. ❌ Configure real Stripe products (not test links)
5. ❌ Implement plan-based feature gating

### Priority 3 (Paid Features)
1. ❌ PDF report generation
2. ❌ Scheduled scans (cron jobs)
3. ❌ Email notifications
4. ❌ White-label options
5. ❌ API endpoints

---

## 🔗 Recommended Tech Stack

```typescript
// Scanning Backend - OPTION B SELECTED
- Custom WordPress scraper using wp-json API
- WPVulnDB for vulnerability data (free tier available)
- WordPress.org API for plugin/theme information

// Database
- PostgreSQL (Vercel Postgres)
- Prisma ORM

// Authentication
- NextAuth (already configured?)

// Scheduling
- Vercel Cron Jobs (free tier: daily)
- OR: Upstash QStash for more frequent jobs

// PDF Generation
- @react-pdf/renderer or jsPDF

// Email
- Resend.com (free tier: 3000 emails/month)

// Payments
- Stripe Subscriptions (already integrated?)
```

---

## 📌 Summary

**Current Reality:**
- ❌ WordPress detection works but scan results are **100% fake**
- ❌ Free and paid users see **identical mock data**
- ❌ Stripe links are test URLs that don't work
- ❌ No backend, no database, no real scanning

**What Needs to Happen:**
1. Build actual WordPress scanning (Custom scraper with wp-json API - OPTION B)
2. Show REAL vulnerability data instead of random fake data
3. Implement authentication + user dashboard
4. Build database to store users, sites, and scan history
5. Create differentiation: Free = limited details, Paid = full details + features
6. Configure real Stripe products and handle webhooks
7. Build scheduled scanning, email alerts, PDF reports for paid plans

**Estimated Development Time:**
- Phase 1 (Real scanning): 2-3 weeks
- Phase 2 (Auth + differentiation): 2-3 weeks
- Phase 3 (Paid features): 3-4 weeks
- **Total: 7-10 weeks for full implementation**

---

## 🚀 Implementation Selected

**Chosen Approach: Option B**
- Build custom scraper using wp-json REST API
- Integrate with free vulnerability databases
- No dependency on paid third-party scanning APIs
- Full control over scanning logic and data

**Next Steps:**
1. Draft detailed implementation plan
2. Build WordPress scraper using wp-json API
3. Integrate vulnerability database
4. Implement real scanning backend
5. Create free vs paid differentiation
6. Build authentication and dashboard
7. Implement paid features (PDF, alerts, scheduling)
