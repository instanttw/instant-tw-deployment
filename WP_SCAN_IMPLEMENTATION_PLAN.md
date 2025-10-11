# WP Scan Production Implementation Plan

## 🎯 Project Overview

**Goal:** Build a production-ready WordPress vulnerability scanner with real scanning capabilities, replacing the current mock data system.

**Approach:** Option B - Custom scraper using WordPress REST API + vulnerability database

**Timeline:** 7-10 weeks (can be parallelized)

**Current Status:** 
- ✅ WordPress detection working
- ❌ All scan results are mock/fake data
- ❌ No authentication system
- ❌ No database
- ❌ No paid plan differentiation

---

## 📋 Implementation Phases

### **PHASE 1: Core Scanning Engine (Week 1-3)**
Build the actual WordPress scanning capability using wp-json API

### **PHASE 2: Free vs Paid Differentiation (Week 2-4)**
Implement authentication, database, and plan-based feature gating

### **PHASE 3: Paid Features (Week 4-7)**
Build Pro/Agency/Enterprise features (PDF, scheduling, alerts)

### **PHASE 4: Polish & Production (Week 7-10)**
Testing, optimization, monitoring, documentation

---

## 🔧 PHASE 1: Core Scanning Engine

### Goals:
- Replace mock data with real WordPress scanning
- Detect actual WordPress version, plugins, themes
- Check against vulnerability databases
- Return accurate security data

### 1.1 WordPress Information Scraper

**File:** `/lib/wordpress-scanner.ts`

**Capabilities:**
```typescript
interface WordPressScanData {
  // Core WordPress
  core: {
    version: string;
    latest_version: string;
    is_outdated: boolean;
  };
  
  // Plugins
  plugins: Array<{
    slug: string;
    name: string;
    version: string;
    latest_version: string;
    is_active: boolean;
    is_outdated: boolean;
  }>;
  
  // Themes
  themes: Array<{
    slug: string;
    name: string;
    version: string;
    latest_version: string;
    is_active: boolean;
    is_outdated: boolean;
  }>;
  
  // Server info
  server: {
    php_version?: string;
    server_software?: string;
    https_enabled: boolean;
  };
}
```

**Implementation Steps:**

1. **Extract data from wp-json API**
   ```typescript
   // GET {url}/wp-json/
   // Returns: WordPress version, site info, namespaces
   
   // GET {url}/wp-json/wp/v2/
   // Returns: Available endpoints, capabilities
   ```

2. **Plugin Detection Strategy:**
   - Parse HTML source for `/wp-content/plugins/{slug}/` paths
   - Check common plugin asset URLs (CSS/JS files)
   - Use wp-json endpoints if accessible
   - Parse HTML comments and meta tags

3. **Theme Detection Strategy:**
   - Parse HTML for `/wp-content/themes/{slug}/` paths
   - Check stylesheet links
   - Look for theme-specific CSS/JS files

4. **Version Detection:**
   - Check generator meta tag
   - wp-json API version field
   - Common file paths (readme.txt, style.css)
   - HTML comments

**Data Sources:**
```
Primary: WordPress REST API (wp-json)
Secondary: HTML parsing
Fallback: Common file path checks
```

---

### 1.2 Vulnerability Database Integration

**Option 1 (Recommended): WPVulnDB API**
- URL: https://wpscan.com/api
- Free tier: 25 requests/day
- Paid tier: $50-200/month for higher limits
- Data: 24,000+ vulnerabilities with CVE IDs

**Option 2: WordPress.org Plugin Directory API**
- URL: https://api.wordpress.org/plugins/info/1.2/
- Free, unlimited
- Limited vulnerability data

**Option 3: Self-hosted vulnerability DB**
- Scrape/sync from public sources
- Store locally in database
- More maintenance, but no API limits

**Recommended: Start with WPVulnDB free tier, implement caching**

**File:** `/lib/vulnerability-checker.ts`

```typescript
interface Vulnerability {
  id: string;
  cve_id?: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvss_score?: number;
  affected_versions: string;
  fixed_in?: string;
  references: string[];
  published_date: string;
}

async function checkPluginVulnerabilities(
  slug: string, 
  version: string
): Promise<Vulnerability[]> {
  // Query WPVulnDB or local cache
  // Return matching vulnerabilities
}
```

**Implementation:**
1. Create API client for WPVulnDB
2. Implement response caching (Redis or DB)
3. Version comparison logic
4. Severity calculation

---

### 1.3 Scanning API Route

**File:** `/app/api/scan-wordpress/route.ts`

**Flow:**
```
1. Receive URL from frontend
2. Verify WordPress (already working)
3. Extract WordPress data (scraper)
4. Get latest version info from WordPress.org
5. Check vulnerabilities (vulnerability checker)
6. Calculate risk score
7. Return structured results
```

**Implementation:**
```typescript
export async function POST(request: NextRequest) {
  const { url } = await request.json();
  
  // 1. Detect WordPress (already working)
  const detection = await detectWordPressSite(url);
  if (!detection.isWordPress) {
    return error response;
  }
  
  // 2. Scrape WordPress info
  const wpData = await scrapeWordPressInfo(url);
  
  // 3. Get latest versions from WordPress.org
  const latestVersions = await getLatestVersions(wpData);
  
  // 4. Check vulnerabilities
  const vulnerabilities = await checkVulnerabilities(wpData);
  
  // 5. Calculate risk score
  const riskScore = calculateRiskScore(vulnerabilities, wpData);
  
  // 6. Format response
  return {
    url,
    scanned_at: new Date().toISOString(),
    core: {
      version: wpData.core.version,
      latest: latestVersions.core,
      vulnerabilities: vulnerabilities.core,
    },
    plugins: wpData.plugins.map(plugin => ({
      ...plugin,
      latest: latestVersions.plugins[plugin.slug],
      vulnerabilities: vulnerabilities.plugins[plugin.slug] || [],
    })),
    themes: wpData.themes.map(theme => ({
      ...theme,
      latest: latestVersions.themes[theme.slug],
      vulnerabilities: vulnerabilities.themes[theme.slug] || [],
    })),
    risk_score: riskScore,
    total_vulnerabilities: countVulnerabilities(vulnerabilities),
  };
}
```

---

### 1.4 Update Frontend to Use Real Data

**File:** `/app/wp-scan/page.tsx`

**Changes:**
1. Remove all `Math.random()` mock data
2. Call `/api/scan-wordpress` instead of generating fake results
3. Handle loading states properly
4. Display real vulnerability data
5. Show actual version numbers and CVE IDs

---

### 1.5 Testing & Validation

**Test Sites:**
```
✓ wordpress.org (official site)
✓ woocommerce.com (known plugins)
✓ wordpress.com/themes (theme showcase)
✓ Sites with known vulnerabilities
✓ Sites with security plugins (hardened)
✓ Sites with custom configurations
```

**Metrics:**
- Scan accuracy: >90% plugin detection
- Scan speed: <15 seconds per site
- False positives: <5%
- API reliability: 99%+ uptime

---

## 🔐 PHASE 2: Authentication & Database

### 2.1 Database Schema

**Technology:** PostgreSQL + Prisma ORM

**Schema:**

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String    // hashed
  plan          Plan      @default(FREE)
  stripeCustomerId String? @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  websites      Website[]
  apiKeys       ApiKey[]
}

enum Plan {
  FREE
  PRO
  AGENCY
  ENTERPRISE
}

model Website {
  id          String   @id @default(cuid())
  url         String
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  scanFrequency ScanFrequency @default(MANUAL)
  lastScannedAt DateTime?
  isActive      Boolean  @default(true)
  
  scans       Scan[]
  createdAt   DateTime @default(now())
  
  @@unique([userId, url])
}

enum ScanFrequency {
  MANUAL      // Free
  WEEKLY      // Pro
  DAILY       // Agency
  REALTIME    // Enterprise
}

model Scan {
  id          String   @id @default(cuid())
  websiteId   String
  website     Website  @relation(fields: [websiteId], references: [id])
  
  scannedAt   DateTime @default(now())
  riskScore   Int
  
  // JSON fields for scan data
  coreData    Json
  pluginsData Json
  themesData  Json
  vulnerabilitiesData Json
  
  findings    Finding[]
}

model Finding {
  id          String   @id @default(cuid())
  scanId      String
  scan        Scan     @relation(fields: [scanId], references: [id])
  
  type        FindingType
  severity    Severity
  title       String
  description String
  cveId       String?
  cvssScore   Float?
  
  affectedItem String  // plugin/theme/core name
  affectedVersion String?
  fixedIn     String?
  
  status      FindingStatus @default(OPEN)
  
  createdAt   DateTime @default(now())
}

enum FindingType {
  VULNERABILITY
  OUTDATED
  SECURITY_ISSUE
}

enum Severity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum FindingStatus {
  OPEN
  ACKNOWLEDGED
  FIXED
  FALSE_POSITIVE
}

model ApiKey {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  key         String   @unique
  name        String
  lastUsedAt  DateTime?
  
  createdAt   DateTime @default(now())
  expiresAt   DateTime?
  isActive    Boolean  @default(true)
}
```

---

### 2.2 Authentication System

**Technology:** NextAuth.js (already configured?)

**Files to create/update:**
- `/app/api/auth/[...nextauth]/route.ts` (configure providers)
- `/app/(auth)/login/page.tsx`
- `/app/(auth)/signup/page.tsx`
- `/app/(auth)/forgot-password/page.tsx`

**Features:**
- Email/password authentication
- OAuth (Google, GitHub optional)
- Email verification
- Password reset
- Session management

---

### 2.3 User Dashboard

**Location:** `/app/dashboard/wp-scan/`

**Pages:**

1. **Dashboard Home** (`/dashboard/wp-scan`)
   - Overview of all websites
   - Recent scans summary
   - Vulnerability alerts
   - Quick actions

2. **Websites List** (`/dashboard/wp-scan/websites`)
   - Table of added websites
   - Add/edit/delete websites
   - Trigger manual scan
   - View scan history

3. **Website Detail** (`/dashboard/wp-scan/websites/[id]`)
   - Detailed scan results
   - Vulnerability timeline
   - Scan history chart
   - Export reports (paid)

4. **Scan Results** (`/dashboard/wp-scan/scans/[id]`)
   - Full scan details
   - Vulnerabilities with CVE IDs
   - Recommendations
   - Download PDF (paid)

5. **Settings** (`/dashboard/wp-scan/settings`)
   - Account settings
   - Notification preferences
   - API keys (Enterprise)
   - Billing

---

### 2.4 Plan-Based Feature Gating

**File:** `/lib/plan-limits.ts`

```typescript
interface PlanLimits {
  maxWebsites: number;
  scanFrequency: 'manual' | 'weekly' | 'daily' | 'realtime';
  showCVEDetails: boolean;
  showCVSSScores: boolean;
  downloadReports: boolean;
  emailAlerts: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
  webhooks: boolean;
}

const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    maxWebsites: 0, // No save, scan-only
    scanFrequency: 'manual',
    showCVEDetails: false,
    showCVSSScores: false,
    downloadReports: false,
    emailAlerts: false,
    apiAccess: false,
    whiteLabel: false,
    webhooks: false,
  },
  PRO: {
    maxWebsites: 3,
    scanFrequency: 'weekly',
    showCVEDetails: true,
    showCVSSScores: false,
    downloadReports: true,
    emailAlerts: true,
    apiAccess: false,
    whiteLabel: false,
    webhooks: false,
  },
  AGENCY: {
    maxWebsites: 25,
    scanFrequency: 'daily',
    showCVEDetails: true,
    showCVSSScores: true,
    downloadReports: true,
    emailAlerts: true,
    apiAccess: false,
    whiteLabel: true,
    webhooks: true,
  },
  ENTERPRISE: {
    maxWebsites: -1, // unlimited
    scanFrequency: 'realtime',
    showCVEDetails: true,
    showCVSSScores: true,
    downloadReports: true,
    emailAlerts: true,
    apiAccess: true,
    whiteLabel: true,
    webhooks: true,
  },
};
```

**Implementation:**
- Middleware to check plan limits
- UI components that show/hide based on plan
- Upgrade prompts for premium features
- Graceful degradation for free users

---

### 2.5 Stripe Integration

**Files:**
- `/app/api/stripe/create-checkout/route.ts`
- `/app/api/stripe/webhook/route.ts`
- `/app/api/stripe/portal/route.ts`

**Products to create in Stripe:**

```typescript
const STRIPE_PRODUCTS = {
  PRO_MONTHLY: {
    name: 'WP Scan Pro',
    price: 15_00, // $15.00
    interval: 'month',
    features: ['3 websites', 'Weekly scans', 'CVE details', 'PDF reports'],
  },
  PRO_YEARLY: {
    name: 'WP Scan Pro (Yearly)',
    price: 135_00, // $135/year (25% discount)
    interval: 'year',
  },
  AGENCY_MONTHLY: {
    name: 'WP Scan Agency',
    price: 49_00,
    interval: 'month',
    features: ['25 websites', 'Daily scans', 'White-label', 'CVSS scores'],
  },
  AGENCY_YEARLY: {
    name: 'WP Scan Agency (Yearly)',
    price: 441_00, // $441/year (25% discount)
    interval: 'year',
  },
};
```

**Webhook Handlers:**
- `checkout.session.completed` → Create user subscription
- `customer.subscription.updated` → Update user plan
- `customer.subscription.deleted` → Downgrade to free
- `invoice.payment_succeeded` → Confirm payment
- `invoice.payment_failed` → Handle failed payment

---

## 📊 PHASE 3: Paid Features

### 3.1 PDF Report Generation

**Technology:** `@react-pdf/renderer` or `puppeteer`

**File:** `/lib/pdf-generator.ts`

**Features:**
- Branded header/footer
- Executive summary
- Detailed vulnerability list with CVE IDs
- CVSS scores and severity ratings
- Remediation recommendations
- Scan metadata (date, URL, risk score)
- White-label support (Agency+)

**Implementation:**
```typescript
async function generateScanReport(
  scan: Scan,
  options: {
    includeDetails: boolean;
    includeCVSS: boolean;
    whiteLabel?: {
      logo: string;
      companyName: string;
      hideInstantBranding: boolean;
    };
  }
): Promise<Buffer> {
  // Generate PDF with react-pdf
  // Return PDF buffer
}
```

---

### 3.2 Scheduled Scanning

**Technology:** Vercel Cron or Upstash QStash

**File:** `/app/api/cron/scan-websites/route.ts`

**Flow:**
```
1. Cron job triggers (daily at 2 AM UTC)
2. Query database for sites needing scans
3. For each site:
   - Check user plan and scan frequency
   - Run scan if due
   - Compare with last scan
   - Detect new vulnerabilities
   - Send alerts if needed
   - Save results to database
```

**Implementation:**
```typescript
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/scan-websites",
      "schedule": "0 2 * * *" // Daily at 2 AM
    }
  ]
}

// /app/api/cron/scan-websites/route.ts
export async function GET(request: NextRequest) {
  // Verify cron secret
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get sites due for scanning
  const sites = await getSitesDueForScan();
  
  // Scan each site
  const results = await Promise.allSettled(
    sites.map(site => scanAndNotify(site))
  );
  
  return NextResponse.json({
    scanned: results.filter(r => r.status === 'fulfilled').length,
    failed: results.filter(r => r.status === 'rejected').length,
  });
}
```

---

### 3.3 Email Notifications

**Technology:** Resend.com or SendGrid

**File:** `/lib/email-service.ts`

**Email Types:**

1. **New Vulnerability Alert**
   - Triggered when scan finds new vulnerability
   - Shows severity, affected plugin/theme
   - Links to dashboard for details

2. **Weekly/Daily Summary**
   - Overview of all sites
   - New findings since last email
   - Action items

3. **Scan Complete**
   - Immediate notification after manual scan
   - Quick summary of findings

4. **Critical Alert**
   - Sent immediately for critical vulnerabilities
   - Requires action

**Implementation:**
```typescript
interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

async function sendVulnerabilityAlert(
  user: User,
  website: Website,
  vulnerability: Finding
): Promise<void> {
  const template = renderEmailTemplate('vulnerability-alert', {
    userName: user.name,
    websiteUrl: website.url,
    vulnerability,
    dashboardUrl: `https://dash.instant.tw/wp-scan/scans/${vulnerability.scanId}`,
  });
  
  await sendEmail(template);
}
```

---

### 3.4 Slack Integration (Agency+)

**File:** `/lib/slack-notifier.ts`

**Features:**
- Configure Slack webhook URL in settings
- Send notifications to Slack channel
- Rich message formatting with buttons
- Severity-based message colors

**Implementation:**
```typescript
async function sendSlackNotification(
  webhookUrl: string,
  notification: {
    title: string;
    message: string;
    severity: Severity;
    url: string;
  }
): Promise<void> {
  const color = {
    LOW: '#36a64f',
    MEDIUM: '#ff9800',
    HIGH: '#ff5722',
    CRITICAL: '#f44336',
  }[notification.severity];
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [{
        color,
        title: notification.title,
        text: notification.message,
        actions: [{
          type: 'button',
          text: 'View Details',
          url: notification.url,
        }],
      }],
    }),
  });
}
```

---

### 3.5 API Access (Enterprise)

**File:** `/app/api/v1/[...endpoint]/route.ts`

**Endpoints:**

```
POST   /api/v1/scan
  Body: { url: string }
  Returns: Scan results

GET    /api/v1/websites
  Returns: List of user's websites

POST   /api/v1/websites
  Body: { url: string }
  Returns: Created website

GET    /api/v1/websites/{id}
  Returns: Website details

GET    /api/v1/websites/{id}/scans
  Returns: Scan history for website

GET    /api/v1/scans/{id}
  Returns: Detailed scan results

GET    /api/v1/vulnerabilities
  Query: ?severity=high&status=open
  Returns: Filtered vulnerabilities
```

**Authentication:** API key in header
```
Authorization: Bearer wp_scan_key_xxxxxxxxxxxxx
```

**Rate Limiting:**
- Free: N/A (no API access)
- Pro: N/A (no API access)
- Agency: N/A (no API access)
- Enterprise: 1000 requests/day

---

### 3.6 Webhooks (Agency+)

**File:** `/lib/webhook-service.ts`

**Events:**
```
scan.completed
vulnerability.detected
vulnerability.fixed
scan.failed
```

**Payload Example:**
```json
{
  "event": "vulnerability.detected",
  "timestamp": "2025-01-10T12:00:00Z",
  "data": {
    "website": {
      "id": "web_123",
      "url": "https://example.com"
    },
    "vulnerability": {
      "id": "vuln_456",
      "cve_id": "CVE-2024-1234",
      "severity": "high",
      "cvss_score": 7.5,
      "title": "SQL Injection in Contact Form 7",
      "affected_item": "contact-form-7",
      "affected_version": "5.8.4",
      "fixed_in": "5.9.0"
    }
  }
}
```

---

## 🧪 PHASE 4: Testing & Production

### 4.1 Testing Strategy

**Unit Tests:**
- WordPress scraper functions
- Vulnerability checker logic
- Version comparison
- Risk score calculation

**Integration Tests:**
- Full scan flow end-to-end
- Database operations
- API endpoints
- Webhook delivery

**E2E Tests:**
- User signup → add website → scan → view results
- Free → Pro upgrade flow
- PDF report generation
- Email delivery

**Load Testing:**
- 100 concurrent scans
- Database query performance
- API rate limiting
- Cron job handling

---

### 4.2 Monitoring & Logging

**Tools:**
- Vercel Analytics
- Sentry for error tracking
- Database monitoring (Prisma metrics)
- Custom dashboard for scan metrics

**Metrics to Track:**
- Scan success rate
- Average scan duration
- Vulnerability detection accuracy
- API uptime
- User conversion rate (free → paid)

---

### 4.3 Documentation

**User Documentation:**
- Getting started guide
- FAQ
- Video tutorials
- API documentation (for Enterprise)

**Developer Documentation:**
- Architecture overview
- Database schema
- API reference
- Deployment guide

---

## 📅 Development Timeline

### Week 1-2: Core Scanning
- [ ] WordPress scraper implementation
- [ ] Vulnerability database integration
- [ ] Scanning API route
- [ ] Frontend integration (remove mock data)
- [ ] Testing with real WordPress sites

### Week 2-3: Database & Auth
- [ ] Prisma schema design
- [ ] Database setup (Vercel Postgres)
- [ ] NextAuth configuration
- [ ] User signup/login pages
- [ ] Basic dashboard structure

### Week 3-4: Plan Differentiation
- [ ] Plan limits implementation
- [ ] Feature gating logic
- [ ] Stripe product setup
- [ ] Checkout flow
- [ ] Webhook handlers
- [ ] Free vs paid UI differences

### Week 4-5: Dashboard & Saved Scans
- [ ] Website management UI
- [ ] Scan history display
- [ ] Detailed scan results page
- [ ] Manual scan triggering
- [ ] Settings page

### Week 5-6: PDF Reports & Scheduling
- [ ] PDF report generator
- [ ] Cron job implementation
- [ ] Scheduled scan logic
- [ ] Email service setup
- [ ] Vulnerability comparison (new vs old scans)

### Week 6-7: Notifications & Integrations
- [ ] Email templates
- [ ] Alert logic
- [ ] Slack integration
- [ ] Webhook system
- [ ] White-label support

### Week 7-8: API & Enterprise Features
- [ ] API endpoints
- [ ] API key management
- [ ] Rate limiting
- [ ] API documentation
- [ ] CVSS score display

### Week 8-9: Testing & Bug Fixes
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Load testing
- [ ] Bug fixes
- [ ] Performance optimization

### Week 9-10: Polish & Launch
- [ ] User documentation
- [ ] Marketing materials
- [ ] Beta testing with real users
- [ ] Monitoring setup
- [ ] Production deployment
- [ ] Launch! 🚀

---

## 🎯 Success Criteria

**Phase 1 Complete:**
- ✅ Real WordPress data (no mock data)
- ✅ 90%+ plugin detection accuracy
- ✅ Scans complete in <15 seconds
- ✅ Vulnerability database integration working

**Phase 2 Complete:**
- ✅ Users can sign up and log in
- ✅ Stripe payments working
- ✅ Free users see limited results
- ✅ Paid users see full details
- ✅ Database storing all scan data

**Phase 3 Complete:**
- ✅ PDF reports generating correctly
- ✅ Scheduled scans running automatically
- ✅ Email notifications working
- ✅ API endpoints functional (Enterprise)

**Phase 4 Complete:**
- ✅ 99%+ uptime
- ✅ <5% false positive rate
- ✅ All tests passing
- ✅ Documentation complete
- ✅ Ready for production launch

---

## 🚀 Let's Build It!

**Next Step:** Start Phase 1 - Core Scanning Engine

Would you like to proceed with implementation? I'll start building the WordPress scanner and vulnerability checker.
