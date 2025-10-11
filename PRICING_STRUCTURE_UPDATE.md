# New Pricing Structure Implementation

## Overview
Implementing tiered yearly pricing with informational monthly display.

## Pricing Tiers

### Tier 1: $49.99/year (7 plugins)
- Instant Image Optimizer
- Instant Broken Link Fixer
- Instant Duplicator
- Instant Forms
- Instant Cache
- Instant Popup Master
- Instant AI Writer

### Tier 2: $69.99/year (5 plugins)
- Instant Security Guard
- Instant SEO
- Instant Backup
- Instant Review Booster
- Instant Cart Recovery

## Price Breakdown

### Tier 1 Plugins:
- Pro: $49.99/year ($4.99/month display only)
- Agency: $999.99/year ($99.99/month display only)
- Enterprise: $4,999/year ($499.99/month display only)

### Tier 2 Plugins:
- Pro: $69.99/year ($6.99/month display only)
- Agency: $1,099.99/year ($109.99/month display only)
- Enterprise: $6,999/year ($699.99/month display only)

## Database Pricing (in cents)

### Tier 1:
- Pro: 4999 cents
- Agency: 99999 cents
- Enterprise: 499900 cents

### Tier 2:
- Pro: 6999 cents
- Agency: 109999 cents
- Enterprise: 699900 cents

## Implementation Notes
- Only yearly prices are purchasable
- Monthly prices are calculated and displayed as informational
- Stripe checkout only receives yearly price IDs
- Homepage shows "Starting at $49.99" or "Starting at $69.99"
