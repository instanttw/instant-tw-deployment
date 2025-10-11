# 🏗️ WP Scan Phase 2: In Progress

## Status: BUILDING

**Phase 2: Free vs Paid Differentiation**

Started: January 10, 2025

---

## ✅ Completed So Far

### 1. Database Schema Design ✅
**File:** `/database/schema-wpscan.sql`

**Tables Created:**
- `wp_scan_users` - User accounts with plan information
- `wp_scan_websites` - Websites being monitored
- `wp_scan_scans` - Scan history
- `wp_scan_findings` - Individual vulnerabilities
- `wp_scan_api_keys` - API keys for Enterprise users
- `wp_scan_notifications` - Email/webhook notification history
- `wp_scan_user_settings` - User preferences
- `wp_scan_audit_log` - Security audit trail

**Features:**
- MySQL/MariaDB compatible
- Foreign keys with CASCADE delete
- Proper indexes for performance
- Enum types for plan, severity, status
- JSON fields for scan data storage

---

### 2. Database Functions Library ✅
**File:** `/lib/db-wpscan.ts`

**Functions Implemented:**
```typescript
// User Management
- getUserByEmail(email)
- getUserById(id)
- createUser(data)
- updateUserPlan(userId, plan, stripeData)

// Website Management
- getWebsitesByUserId(userId)
- getWebsiteById(id)
- createWebsite(data)
- updateWebsite(id, data)
- deleteWebsite(id)
- updateWebsiteLastScan(id, nextScanAt)

// Scan Management
- getScansByWebsiteId(websiteId, limit)
- getScanById(id)
- createScan(data)
- getLatestScanForWebsite(websiteId)

// Finding Management
- createFinding(data)
- getFindingsByScanId(scanId)
- getOpenFindingsByWebsite(websiteId)
- updateFindingStatus(id, status)

// Statistics
- getUserStats(userId)
- canUserAddWebsite(userId)
```

**Plan Limits Defined:**
```typescript
FREE: 0 websites (scan-only), no CVE details
PRO: 3 websites, weekly scans, CVE details, PDF reports
AGENCY: 25 websites, daily scans, CVSS scores, white-label
ENTERPRISE: Unlimited, real-time, API access, webhooks
```

---

### 3. Database Initialization Script ✅
**File:** `/scripts/init-wpscan-db.ts`

**Usage:**
```bash
npx tsx scripts/init-wpscan-db.ts
```

**Creates all 8 tables with proper schema**

---

### 4. NextAuth Integration ✅
**Files Updated:**
- `/lib/auth.ts` - Integrated with WP Scan database
- `/app/api/auth/signup/route.ts` - Real user creation
- `/types/next-auth.d.ts` - TypeScript types with plan field

**Features:**
- Credentials login with bcryptjs
- Google OAuth (configured)
- GitHub OAuth (configured)
- User plan in session
- Password hashing
- Database user lookup

---

## 🚧 In Progress

### 5. Authentication Pages
- [ ] Login page UI
- [ ] Signup page UI
- [ ] Forgot password flow
- [ ] Email verification (optional)

### 6. User Dashboard
- [ ] Dashboard layout
- [ ] Website management page
- [ ] Scan history page
- [ ] Individual scan results page
- [ ] Settings page

### 7. Stripe Integration
- [ ] Create Stripe products
- [ ] Checkout flow
- [ ] Webhook handlers
- [ ] Subscription management
- [ ] Customer portal

### 8. Scan Saving & Plan Gating
- [ ] Save scan results to database
- [ ] Plan-based feature restrictions
- [ ] Upgrade prompts for free users
- [ ] Website limit enforcement
- [ ] CVE details gating

---

## 📋 Next Steps

### Immediate (Next):
1. **Run database initialization script**
   ```bash
   npx tsx scripts/init-wpscan-db.ts
   ```

2. **Create authentication pages**
   - Login page with email/password
   - Signup page with validation
   - OAuth buttons (Google/GitHub)

3. **Build dashboard structure**
   - Dashboard layout component
   - Navigation menu
   - User profile dropdown

4. **Implement save scan functionality**
   - Update scan API to save results
   - Check user authentication
   - Enforce plan limits

### After That:
5. **Stripe products & checkout**
6. **Feature gating implementation**
7. **PDF report generation (Pro+)**
8. **Email notifications setup**

---

## 🎯 Phase 2 Goals

| Goal | Status | Progress |
|------|--------|----------|
| Database schema | ✅ DONE | 100% |
| Database functions | ✅ DONE | 100% |
| NextAuth integration | ✅ DONE | 100% |
| Auth pages | 🚧 IN PROGRESS | 0% |
| Dashboard | 🚧 IN PROGRESS | 0% |
| Stripe integration | ⏳ PENDING | 0% |
| Plan gating | ⏳ PENDING | 0% |
| Save scans | ⏳ PENDING | 0% |

**Overall Phase 2 Progress:** 37.5% (3/8 tasks complete)

---

## 📁 Files Created/Modified

### New Files:
1. `/database/schema-wpscan.sql` (300 lines)
2. `/lib/db-wpscan.ts` (600 lines)
3. `/scripts/init-wpscan-db.ts` (80 lines)
4. `/types/next-auth.d.ts` (25 lines)
5. `/PHASE_2_PROGRESS.md` (this file)

### Modified Files:
1. `/lib/auth.ts` (integrated WP Scan DB)
2. `/app/api/auth/signup/route.ts` (real user creation)

**Total Lines of Code (Phase 2 so far):** ~1,005 lines

---

## 🔑 Environment Variables Needed

Add to `.env.local`:

```env
# Database (already configured)
DB_HOST=localhost
DB_USER=admin_wpinstant
DB_PASSWORD=QfJr8nDWKgXmaEZzB9g2
DB_NAME=admin_wpinstant

# NextAuth (already configured)
NEXTAUTH_URL=https://wp.instant.tw
NEXTAUTH_SECRET=your-secret-here

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret

# Stripe (coming next)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# WPVulnDB API (optional)
WPVULNDB_API_TOKEN=your-wpscan-token
```

---

## 🚀 What's Working Now

1. ✅ **Real WordPress scanning** (Phase 1)
2. ✅ **Database schema ready**
3. ✅ **User authentication backend**
4. ✅ **Database functions library**
5. ✅ **Plan limits defined**

## 🔨 What's Being Built

1. 🚧 **Authentication pages** (login/signup UI)
2. 🚧 **User dashboard** (website management)
3. 🚧 **Scan saving** (persist results to DB)
4. 🚧 **Plan gating** (free vs paid features)

---

**Phase 2 Status:** 37.5% Complete

**Next Session:** Continue building auth pages and dashboard
