# Dynamic Stripe Integration for Instant.tw

## Project Context

We're building **instant.tw** - a WordPress plugin marketplace and services platform with:
- **12+ WordPress Plugins** (free, pro, lifetime versions)
- **4 Stripe Integration Services** (implementation, consulting, custom development)
- **Potential for 1000s of products** as we scale

**Problem**: Creating individual Stripe Products and Price IDs for each item is NOT scalable.

**Goal**: Implement a smart, dynamic Stripe integration that handles unlimited products without creating individual Stripe products/prices for each one.

---

## Requirements

### Core Features Needed:

1. **Dynamic Checkout System**
   - Generate checkout sessions on-the-fly
   - Pass product/service details dynamically
   - Support one-time payments AND subscriptions
   - Handle multiple currencies if needed

2. **Product Database Structure**
   - Store all products/services in our database
   - Track pricing, descriptions, features
   - Support multiple pricing tiers per product
   - Version management (free, pro, lifetime)

3. **Smart Stripe Integration Strategies** (Choose Best Approach)

   **Option A: Generic Price IDs + Metadata**
   - Create 3-5 generic Stripe prices (e.g., $10, $50, $100, $500, $1000 tiers)
   - Use metadata to pass actual product details
   - Dynamically select closest generic price

   **Option B: Stripe Checkout Line Items API**
   - Use `price_data` parameter in checkout sessions
   - Create prices dynamically at checkout time
   - No pre-created products needed

   **Option C: Hybrid Approach**
   - Generic products for common price points
   - Dynamic prices for custom/variable pricing
   - Metadata for product identification

4. **Payment Flows to Support**
   - Single plugin purchase (one-time)
   - Plugin subscription (monthly/yearly)
   - Lifetime plugin access (one-time)
   - Service packages (consulting hours)
   - Bundle deals (multiple plugins)
   - Custom pricing for services

5. **Post-Purchase Handling**
   - Webhook integration for payment confirmation
   - Automatic license key generation
   - Email delivery of downloads/access
   - Order tracking and history
   - Refund management

---

## Technical Implementation Tasks

### 1. Database Schema Design

Create tables for:
```sql
- products (id, name, type, description, features_json)
- pricing_tiers (id, product_id, tier_name, price, currency, billing_interval)
- orders (id, user_id, stripe_session_id, status, metadata_json)
- licenses (id, order_id, product_id, license_key, expires_at)
- services (id, name, description, hourly_rate, min_hours)
```

### 2. Stripe Integration Layer

**File Structure:**
```
/lib/stripe/
  ├── client.ts           # Stripe client initialization
  ├── checkout.ts         # Dynamic checkout session creation
  ├── webhooks.ts         # Webhook handlers
  ├── products.ts         # Product/price management
  └── metadata.ts         # Metadata helper functions
```

**Key Functions to Implement:**

```typescript
// Create dynamic checkout session
createDynamicCheckout({
  productId: string,
  priceTier: string,
  quantity: number,
  customPrice?: number,
  metadata: object
})

// Handle webhook events
handleStripeWebhook(event: Stripe.Event)

// Generate license key
generateLicenseKey(orderId: string, productId: string)

// Verify payment and fulfill order
fulfillOrder(sessionId: string)
```

### 3. API Routes

```
POST /api/checkout/create        # Create checkout session
POST /api/webhooks/stripe        # Handle Stripe webhooks
GET  /api/orders/:id             # Get order details
POST /api/orders/:id/refund      # Process refund
GET  /api/licenses/verify        # Verify license key
```

### 4. Frontend Components

```typescript
// Components needed:
- <PricingCard /> - Display product pricing
- <CheckoutButton /> - Trigger checkout
- <PricingToggle /> - Switch between monthly/yearly
- <BundleSelector /> - Select multiple products
- <ServiceBooking /> - Book consultation hours
- <OrderHistory /> - Show past purchases
```

---

## Recommended Approach: Dynamic Price Data

### Why This is Best:

✅ **No pre-created products needed**
✅ **Unlimited scalability**
✅ **Full flexibility on pricing**
✅ **Easy to update prices**
✅ **Support for custom quotes**

### Implementation Strategy:

```typescript
// Example: Create checkout with dynamic price_data
const session = await stripe.checkout.sessions.create({
  mode: 'payment', // or 'subscription'
  line_items: [{
    price_data: {
      currency: 'usd',
      unit_amount: 4900, // $49.00 - from our database
      product_data: {
        name: 'InstantWP Pro Plugin',
        description: 'Lifetime access to InstantWP Pro',
        images: ['https://instant.tw/images/instantwp-pro.jpg'],
        metadata: {
          product_id: 'iwp_pro_001',
          product_type: 'plugin',
          license_type: 'lifetime',
          version: 'pro'
        }
      }
    },
    quantity: 1
  }],
  metadata: {
    user_id: 'user_123',
    product_ids: 'iwp_pro_001',
    order_type: 'plugin_purchase'
  },
  success_url: 'https://instant.tw/checkout/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://instant.tw/checkout/cancel'
});
```

### For Subscriptions:

```typescript
price_data: {
  currency: 'usd',
  unit_amount: 2900, // $29/month
  recurring: {
    interval: 'month', // or 'year'
    interval_count: 1
  },
  product_data: {
    name: 'InstantWP Pro - Monthly',
    // ... rest of product data
  }
}
```

---

## Product Catalog Structure

### Plugins (12+ items)
```typescript
const plugins = [
  {
    id: 'iwp_free',
    name: 'InstantWP Free',
    tiers: [
      { name: 'free', price: 0, type: 'lifetime' }
    ]
  },
  {
    id: 'iwp_pro',
    name: 'InstantWP Pro',
    tiers: [
      { name: 'monthly', price: 29, type: 'subscription', interval: 'month' },
      { name: 'yearly', price: 290, type: 'subscription', interval: 'year' },
      { name: 'lifetime', price: 490, type: 'one_time' }
    ]
  },
  // ... 10 more plugins
]
```

### Services (4+ items)
```typescript
const services = [
  {
    id: 'stripe_implementation',
    name: 'Stripe Integration Implementation',
    pricing_model: 'hourly',
    base_rate: 150,
    min_hours: 5,
    description: 'Custom Stripe payment integration'
  },
  {
    id: 'stripe_consulting',
    name: 'Stripe Strategy Consulting',
    pricing_model: 'package',
    packages: [
      { hours: 2, price: 300, name: 'Quick Consult' },
      { hours: 5, price: 700, name: 'Strategy Session' },
      { hours: 10, price: 1300, name: 'Deep Dive' }
    ]
  },
  // ... 2 more services
]
```

---

## Smart Features to Implement

### 1. **Bundle Pricing**
```typescript
// Calculate bundle discount
const bundlePrice = calculateBundleDiscount([
  'iwp_pro',
  'iwp_security',
  'iwp_seo'
]) // Returns discounted total
```

### 2. **Upgrade Paths**
```typescript
// Upgrade from monthly to lifetime - credit existing payments
const upgradePrice = calculateUpgradePrice(
  currentSubscription,
  'lifetime'
)
```

### 3. **Variable Service Pricing**
```typescript
// Custom hours for consulting
const customServiceCheckout = {
  service_id: 'stripe_consulting',
  hours: 8,
  hourly_rate: 150,
  total: 1200
}
```

### 4. **Promotional Pricing**
```typescript
// Apply coupon codes dynamically
session.discounts = [{
  coupon: 'LAUNCH50' // 50% off - managed in Stripe dashboard
}]
```

### 5. **Geographic Pricing**
```typescript
// Adjust pricing based on user location
const price = getLocalizedPrice(basePrice, userCountry)
```

---

## Webhook Handler Logic

```typescript
async function handleWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      // 1. Extract session data
      // 2. Look up product details from metadata
      // 3. Generate license keys
      // 4. Create order record
      // 5. Send confirmation email
      // 6. Grant access to downloads
      break;
    
    case 'customer.subscription.created':
      // Handle new subscription
      break;
    
    case 'customer.subscription.deleted':
      // Revoke access
      break;
    
    case 'invoice.payment_succeeded':
      // Extend subscription/license
      break;
    
    case 'charge.refunded':
      // Revoke license, update order status
      break;
  }
}
```

---

## Security Considerations

1. **Webhook Signature Verification**
   ```typescript
   const sig = req.headers['stripe-signature'];
   const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
   ```

2. **Price Validation**
   - Always validate price on server-side
   - Never trust client-submitted prices
   - Check against database before creating session

3. **License Key Security**
   - Generate cryptographically secure keys
   - Hash and store securely
   - Implement verification API

4. **Metadata Sanitization**
   - Validate all metadata before using
   - Prevent injection attacks
   - Limit metadata size

---

## Testing Strategy

1. **Use Stripe Test Mode**
   - Test cards: 4242 4242 4242 4242
   - Test different scenarios

2. **Test Cases:**
   - Single plugin purchase
   - Subscription creation
   - Upgrade/downgrade
   - Refund processing
   - Failed payment handling
   - Webhook delivery
   - Bundle purchases
   - Custom service pricing

3. **Webhook Testing**
   - Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   - Test all event types

---

## Migration Path for Existing Stripe Setup

If you already have some Stripe products:

1. **Keep existing products** - don't delete
2. **Add metadata** to identify them
3. **Implement dynamic system** for new products
4. **Gradually migrate** old products to new system
5. **Maintain backward compatibility**

---

## Performance Optimizations

1. **Cache product catalog** in Redis/memory
2. **Batch license generation** for multiple items
3. **Queue webhook processing** for heavy operations
4. **Use Stripe's idempotency keys** for retry safety
5. **Implement rate limiting** on checkout creation

---

## Admin Dashboard Features

Build admin panel to:
- View all orders/transactions
- Generate custom checkout links
- Issue refunds
- Manage licenses
- View revenue analytics
- Export financial reports
- Create promotional codes

---

## Code Style & Patterns

- Use TypeScript for type safety
- Implement proper error handling
- Add comprehensive logging
- Write unit tests for critical functions
- Use environment variables for secrets
- Follow Next.js 14+ App Router patterns
- Implement proper loading states
- Add toast notifications for user feedback

---

## Deliverables

Please implement:

1. ✅ Complete database schema with migrations
2. ✅ Stripe integration utilities (`/lib/stripe/`)
3. ✅ API routes for checkout and webhooks
4. ✅ Product catalog management system
5. ✅ Dynamic checkout session creation
6. ✅ Webhook handler with all event types
7. ✅ License key generation & verification
8. ✅ Frontend components for pricing/checkout
9. ✅ Email notification system
10. ✅ Admin dashboard for order management
11. ✅ Comprehensive error handling
12. ✅ Testing suite with examples
13. ✅ Documentation for setup and usage

---

## Success Criteria

- ✅ Can add unlimited products without touching Stripe dashboard
- ✅ Checkout works for one-time and subscription payments
- ✅ Webhooks properly fulfill orders
- ✅ License keys generated and delivered automatically
- ✅ Can handle bundles and custom pricing
- ✅ Admin can manage everything from dashboard
- ✅ Code is maintainable and well-documented
- ✅ All payments are tracked and reconcilable

---

## Questions to Address

1. Should we use Prisma or raw SQL for database?
2. Where to host the database? (Neon, Supabase, etc.)
3. Email service? (Resend, SendGrid, etc.)
4. Should we implement a cart system or direct checkout?
5. Need download delivery system? (S3, Vercel Blob?)
6. License key verification - how often should plugins check?

---

## Additional Context

- **Framework**: Next.js 14+ (App Router)
- **Hosting**: Vercel
- **Database**: TBD (recommend Neon Postgres)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React hooks + Context API
- **Type Safety**: TypeScript throughout

---

## Start Here

Begin by:
1. Setting up the database schema
2. Creating the Stripe utility functions
3. Implementing the dynamic checkout API
4. Building the webhook handler
5. Creating the product catalog UI

Focus on **simplicity, scalability, and maintainability**. Every product should be manageable from our database, not Stripe's dashboard.

Let's build this smart! 🚀
