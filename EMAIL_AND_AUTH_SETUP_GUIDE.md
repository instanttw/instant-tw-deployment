# Email & OAuth Setup Guide

## Table of Contents
1. [Current Email Structure](#current-email-structure)
2. [Email Notifications Strategy](#email-notifications-strategy)
3. [Recommended Solution: Resend](#recommended-solution-resend)
4. [Google OAuth Setup](#google-oauth-setup)
5. [GitHub OAuth Setup](#github-oauth-setup)
6. [Complete Implementation](#complete-implementation)

---

## Current Email Structure

### Current Status:
- ✅ **Email Service File Exists:** `lib/email-service.ts`
- ❌ **Not Configured:** No email provider setup
- ❌ **No Notifications:** Purchase confirmations not sent
- ✅ **Auth Setup:** Google & GitHub providers configured but missing credentials

### What's Working:
- Credentials-based login (email/password)
- User session management
- Password hashing with bcrypt

### What's Missing:
- Email provider configuration
- Purchase confirmation emails
- OAuth credentials for Google/GitHub
- Welcome emails (not needed per your requirement)
- Email verification (not needed per your requirement)

---

## Email Notifications Strategy

### Requirements Analysis:

**What You DON'T Need:**
- ❌ Signup confirmation emails
- ❌ Email verification after signup
- ❌ Welcome emails

**What You DO Need:**
- ✅ Purchase confirmation emails
- ✅ Order receipts
- ✅ License key delivery
- ✅ Invoice emails

### Option 1: Let Stripe Handle It (RECOMMENDED FOR SIMPLICITY)

**Pros:**
- ✅ **Zero Code:** Already built into Stripe
- ✅ **Professional Design:** Beautiful, mobile-responsive emails
- ✅ **Automatic:** Sent on every successful payment
- ✅ **Customizable:** Add your branding/logo
- ✅ **Reliable:** Stripe's email infrastructure
- ✅ **Includes:** Receipt, invoice, payment confirmation
- ✅ **Free:** Included with Stripe

**Cons:**
- ⚠️ Cannot include custom license keys in initial email
- ⚠️ Limited customization (but professional)
- ⚠️ Cannot add download links directly

**Best For:** Quick setup, reliable notifications

---

### Option 2: Custom Email Service (RECOMMENDED FOR FULL CONTROL)

**Pros:**
- ✅ **Full Control:** Include license keys, download links, custom content
- ✅ **Personalized:** Completely branded emails
- ✅ **Rich Content:** Product details, instructions, support links
- ✅ **Tracking:** Know when emails are opened/clicked

**Cons:**
- ⚠️ Requires setup (20 minutes)
- ⚠️ Additional service to manage
- ⚠️ Small monthly cost (free tier available)

**Best For:** Professional marketplace, better UX

---

### Option 3: Hybrid Approach (RECOMMENDED)

**Use Both:**
1. **Stripe Emails:** Payment receipts, invoices, refunds
2. **Custom Emails:** License keys, download links, onboarding

**Why This is Best:**
- ✅ Stripe handles payment confirmations automatically
- ✅ Custom emails provide license keys and downloads
- ✅ Separation of concerns (payment vs. product delivery)
- ✅ Redundancy (customers get multiple confirmations)

---

## Recommended Solution: Resend

**Why Resend:**
- ✅ **Modern & Easy:** Simple API, great DX
- ✅ **React Email Support:** Design emails with React components
- ✅ **Free Tier:** 3,000 emails/month free (100/day)
- ✅ **Fast Delivery:** Optimized infrastructure
- ✅ **Great Deliverability:** High inbox placement rates
- ✅ **Built for Developers:** Simple integration

### Pricing:
- **Free:** 3,000 emails/month (perfect for starting out)
- **Pro:** $20/month for 50,000 emails
- **Unlimited:** Custom pricing

### Alternative Options:
1. **SendGrid:** More enterprise, complex setup
2. **Mailgun:** Developer-focused, similar to Resend
3. **AWS SES:** Cheapest, but more complex
4. **Postmark:** Great deliverability, higher cost

---

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/

2. **Create New Project:**
   - Click "Select a project" → "New Project"
   - Name: `Instant.tw Marketplace` (or your preference)
   - Click "Create"

3. **Enable OAuth Consent Screen:**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" (for public users)
   - Click "Create"

4. **Configure OAuth Consent:**
   ```
   App name: Instant.tw
   User support email: your@email.com
   App logo: (upload your logo.png)
   Application home page: https://wp.instant.tw
   Authorized domains: instant.tw
   Developer contact: your@email.com
   ```
   - Click "Save and Continue"

5. **Scopes:**
   - Click "Add or Remove Scopes"
   - Add these scopes:
     - `userinfo.email`
     - `userinfo.profile`
   - Click "Update" → "Save and Continue"

6. **Test Users (Development Only):**
   - Add your email for testing
   - Click "Save and Continue"

### Step 2: Create OAuth 2.0 Credentials

1. **Go to Credentials:**
   - "APIs & Services" → "Credentials"
   - Click "+ Create Credentials" → "OAuth client ID"

2. **Configure OAuth Client:**
   ```
   Application type: Web application
   Name: Instant.tw Web Client
   
   Authorized JavaScript origins:
   - https://wp.instant.tw
   - http://localhost:3000 (for local testing)
   
   Authorized redirect URIs:
   - https://wp.instant.tw/api/auth/callback/google
   - http://localhost:3000/api/auth/callback/google (for local testing)
   ```

3. **Get Credentials:**
   - Click "Create"
   - **Copy your Client ID** (looks like: `123456-abc...apps.googleusercontent.com`)
   - **Copy your Client Secret** (looks like: `GOCSPX-...`)
   - Click "OK"

### Step 3: Add to Environment Variables

1. **Update `.env.local`:**
   ```bash
   # Google OAuth
   GOOGLE_CLIENT_ID="your-actual-client-id-here.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="GOCSPX-your-actual-secret-here"
   ```

2. **Update Vercel Environment Variables:**
   ```bash
   # In Vercel dashboard:
   Settings → Environment Variables → Add
   
   GOOGLE_CLIENT_ID = your-client-id
   GOOGLE_CLIENT_SECRET = your-secret
   ```

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

## GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. **Go to GitHub Settings:**
   - https://github.com/settings/developers
   - Or: Profile → Settings → Developer settings → OAuth Apps

2. **Click "New OAuth App":**

3. **Configure OAuth App:**
   ```
   Application name: Instant.tw
   Homepage URL: https://wp.instant.tw
   Application description: WordPress Plugin & Service Marketplace
   
   Authorization callback URL:
   https://wp.instant.tw/api/auth/callback/github
   ```

4. **Click "Register application"**

5. **Get Credentials:**
   - **Client ID** is displayed on the page
   - Click "Generate a new client secret"
   - **Copy the secret** (shown only once!)

### Step 2: Add to Environment Variables

1. **Update `.env.local`:**
   ```bash
   # GitHub OAuth
   GITHUB_CLIENT_ID="your-github-client-id-here"
   GITHUB_CLIENT_SECRET="your-github-client-secret-here"
   ```

2. **Update Vercel Environment Variables:**
   ```bash
   # In Vercel dashboard:
   Settings → Environment Variables → Add
   
   GITHUB_CLIENT_ID = your-client-id
   GITHUB_CLIENT_SECRET = your-secret
   ```

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

## Complete Implementation

### Part 1: Setup Resend for Emails

#### 1. Create Resend Account

1. **Sign up:** https://resend.com/signup
2. **Verify your email**
3. **Add your domain:**
   - Go to "Domains" → "Add Domain"
   - Enter: `instant.tw`
   - Add DNS records to your domain:
     ```
     Type: TXT
     Name: resend._domainkey
     Value: (provided by Resend)
     
     Type: MX
     Priority: 10
     Value: feedback-smtp.us-east-1.amazonses.com
     ```
   - Wait for verification (5-15 minutes)

4. **Get API Key:**
   - Go to "API Keys" → "Create API Key"
   - Name: `Production`
   - Permissions: `Sending access`
   - Copy the key (starts with `re_`)

#### 2. Install Resend Package

```bash
npm install resend
npm install @react-email/components
```

#### 3. Create Email Templates

Create: `lib/emails/purchase-confirmation.tsx`

```typescript
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface PurchaseEmailProps {
  customerName: string;
  orderNumber: string;
  products: Array<{
    name: string;
    price: string;
  }>;
  licenses: Array<{
    product: string;
    key: string;
  }>;
  totalAmount: string;
  orderDate: string;
}

export default function PurchaseConfirmationEmail({
  customerName = 'Customer',
  orderNumber = 'ORD-000001',
  products = [],
  licenses = [],
  totalAmount = '$0.00',
  orderDate = new Date().toLocaleDateString(),
}: PurchaseEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your purchase from Instant.tw - Order {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://wp.instant.tw/logo.png"
            width="150"
            height="40"
            alt="Instant.tw"
            style={logo}
          />
          <Heading style={h1}>Thank you for your purchase!</Heading>
          <Text style={text}>
            Hi {customerName},
          </Text>
          <Text style={text}>
            Your order has been confirmed and is ready to use. Below are your license keys and download links.
          </Text>

          <Section style={orderInfo}>
            <Text style={orderDetail}>
              <strong>Order Number:</strong> {orderNumber}
            </Text>
            <Text style={orderDetail}>
              <strong>Order Date:</strong> {orderDate}
            </Text>
            <Text style={orderDetail}>
              <strong>Total Amount:</strong> {totalAmount}
            </Text>
          </Section>

          <Heading as="h2" style={h2}>
            Your Products
          </Heading>
          {products.map((product, index) => (
            <Section key={index} style={productSection}>
              <Text style={productName}>{product.name}</Text>
              <Text style={productPrice}>{product.price}</Text>
            </Section>
          ))}

          <Heading as="h2" style={h2}>
            Your License Keys
          </Heading>
          <Text style={text}>
            Use these license keys to activate your plugins:
          </Text>
          {licenses.map((license, index) => (
            <Section key={index} style={licenseSection}>
              <Text style={licenseName}>{license.product}</Text>
              <code style={licenseKey}>{license.key}</code>
            </Section>
          ))}

          <Section style={buttonContainer}>
            <Button style={button} href="https://wp.instant.tw/dashboard/licenses">
              View My Licenses
            </Button>
          </Section>

          <Section style={buttonContainer}>
            <Button style={downloadButton} href="https://wp.instant.tw/dashboard/purchases">
              Download Products
            </Button>
          </Section>

          <Text style={footer}>
            Need help? Contact us at{' '}
            <Link href="mailto:support@instant.tw" style={link}>
              support@instant.tw
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '32px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const orderInfo = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '30px 0',
};

const orderDetail = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '5px 0',
};

const productSection = {
  borderBottom: '1px solid #e5e7eb',
  padding: '15px 0',
  display: 'flex',
  justifyContent: 'space-between',
};

const productName = {
  color: '#333',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const productPrice = {
  color: '#666',
  fontSize: '16px',
  margin: '0',
};

const licenseSection = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  padding: '15px',
  margin: '10px 0',
};

const licenseName = {
  color: '#333',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const licenseKey = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '4px',
  color: '#0070f3',
  fontFamily: 'monospace',
  fontSize: '14px',
  padding: '10px',
  display: 'block',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#0070f3',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 30px',
};

const downloadButton = {
  ...button,
  backgroundColor: '#10b981',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '48px 0 0',
  textAlign: 'center' as const,
};

const link = {
  color: '#0070f3',
  textDecoration: 'underline',
};
```

#### 4. Update Email Service

Update: `lib/email-service.ts`

```typescript
import { Resend } from 'resend';
import PurchaseConfirmationEmail from './emails/purchase-confirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPurchaseEmailParams {
  to: string;
  customerName: string;
  orderNumber: string;
  products: Array<{
    name: string;
    price: string;
  }>;
  licenses: Array<{
    product: string;
    key: string;
  }>;
  totalAmount: string;
  orderDate: string;
}

export async function sendPurchaseConfirmationEmail(params: SendPurchaseEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Instant.tw <orders@instant.tw>',
      to: [params.to],
      subject: `Order Confirmation - ${params.orderNumber}`,
      react: PurchaseConfirmationEmail(params),
    });

    if (error) {
      console.error('Error sending purchase email:', error);
      return { success: false, error };
    }

    console.log('Purchase email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send purchase email:', error);
    return { success: false, error };
  }
}
```

#### 5. Update Stripe Webhook to Send Emails

Update: `app/api/webhooks/stripe-dynamic/route.ts`

Find the `checkout.session.completed` handler and add email sending:

```typescript
import { sendPurchaseConfirmationEmail } from '@/lib/email-service';

// In the checkout.session.completed handler, after creating order and licenses:

if (event.type === 'checkout.session.completed') {
  // ... existing code to create order and licenses ...

  // Get order details
  const order = await getOrderById(createdOrder.id);
  const licenses = await getUserLicenses(userId);
  
  // Send purchase confirmation email
  const emailData = {
    to: session.customer_email || session.customer_details?.email || '',
    customerName: session.customer_details?.name || 'Customer',
    orderNumber: order.order_number,
    products: items.map(item => ({
      name: item.product_name,
      price: formatCurrency(item.total_price, session.currency),
    })),
    licenses: licenses.map(license => ({
      product: license.product_name || 'Plugin',
      key: license.license_key,
    })),
    totalAmount: formatCurrency(session.amount_total, session.currency),
    orderDate: new Date().toLocaleDateString(),
  };

  await sendPurchaseConfirmationEmail(emailData);
}
```

#### 6. Add Environment Variables

**`.env.local`:**
```bash
# Resend Email Service
RESEND_API_KEY="re_your_actual_api_key_here"
```

**Vercel Environment Variables:**
```bash
RESEND_API_KEY = re_your_actual_api_key_here
```

---

### Part 2: Configure Stripe Emails (Complement)

1. **Login to Stripe Dashboard:**
   - https://dashboard.stripe.com

2. **Go to Settings → Emails:**
   - Click "Settings" → "Emails"

3. **Customize Email Settings:**
   - **Successful payments:** ✅ Enabled
   - **Failed payments:** ✅ Enabled
   - **Refunds:** ✅ Enabled
   - **Disputes:** ✅ Enabled

4. **Add Branding:**
   - Upload logo
   - Set brand color
   - Customize email footer

5. **Test Emails:**
   - Make a test purchase
   - Check both Stripe AND custom emails arrive

---

## Testing Checklist

### Google OAuth:
- [ ] Sign in with Google button appears
- [ ] Clicking opens Google consent screen
- [ ] After approval, user is logged in
- [ ] User data saved to database
- [ ] User redirected to dashboard

### GitHub OAuth:
- [ ] Sign in with GitHub button appears
- [ ] Clicking opens GitHub consent screen
- [ ] After approval, user is logged in
- [ ] User data saved to database
- [ ] User redirected to dashboard

### Email Notifications:
- [ ] Make test purchase
- [ ] Stripe confirmation email received
- [ ] Custom email with license keys received
- [ ] License keys are correct
- [ ] Download links work
- [ ] Emails look professional on mobile

---

## Environment Variables Summary

### Required Variables:

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://wp.instant.tw"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-id"
GITHUB_CLIENT_SECRET="your-github-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Resend)
RESEND_API_KEY="re_..."
```

---

## Final Recommendation

### Best Approach:

1. **Setup Google & GitHub OAuth** (15 minutes)
   - Provides easy login options
   - Reduces password reset requests
   - Better user experience

2. **Use Hybrid Email Strategy** (30 minutes)
   - Enable Stripe emails for payment confirmations
   - Implement Resend for license key delivery
   - Best of both worlds

3. **Benefits:**
   - ✅ Users get immediate Stripe receipt
   - ✅ Users get license keys in separate email
   - ✅ Professional appearance
   - ✅ Reliable delivery
   - ✅ Full control over content

### Cost Summary:
- **Google OAuth:** Free
- **GitHub OAuth:** Free
- **Stripe Emails:** Free (included)
- **Resend:** Free up to 3,000 emails/month
- **Total:** $0/month for most startups

---

## Support

If you need help:
1. **Resend Docs:** https://resend.com/docs
2. **Google OAuth:** https://developers.google.com/identity/protocols/oauth2
3. **GitHub OAuth:** https://docs.github.com/en/apps/oauth-apps
4. **Stripe Emails:** https://stripe.com/docs/receipts

---

**Status:** Ready for implementation  
**Estimated Setup Time:** 1-2 hours total  
**Maintenance:** Minimal (all services auto-scale)
