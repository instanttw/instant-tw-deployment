# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **WordPress Plugin Marketplace** built with Next.js 15, featuring a comprehensive e-commerce platform for selling WordPress plugins and services. The site supports multiple languages, currencies, dynamic Stripe checkout, user authentication, and a complete admin dashboard.

## Development Commands

### Core Commands
```bash
# Development server with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Generate sitemap after build
npm run postbuild

# Start production server
npm start

# Lint code
npm run lint

# Type checking (UI components only)
npm run typecheck

# Full type checking (including excluded APIs)
npm run typecheck:full
```

### Database Commands
```bash
# Test database connections
node -e "require('./lib/db-neon.ts').testConnection()"

# Run database migrations (manual)
# Check database/ folder for SQL files
```

### Deployment Commands
```bash
# Deploy to Vercel
vercel

# Deploy to VPS (Linux/Mac)
bash deploy.sh

# Verify deployment
npm run build && npm start
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and React Server Components
- **Styling**: Tailwind CSS v4 with `@theme inline` configuration
- **Database**: Dual support - MySQL (legacy) and Neon PostgreSQL (current)
- **Authentication**: NextAuth.js v4 with multiple providers
- **Payments**: Dynamic Stripe integration with on-the-fly checkout sessions
- **Email**: Resend for transactional emails
- **Deployment**: Vercel (primary) with VPS fallback support

### Key Architecture Patterns

#### 1. Database Layer
- **Neon PostgreSQL** (`lib/db-neon.ts`) - Primary database for new features
- **MySQL** (`lib/db.ts`) - Legacy database support
- **Database Services**: Separate modules for products, orders, WP scanning
- **Connection Pooling**: Enabled for both database types

#### 2. Stripe Integration
- **Dynamic Pricing** (`lib/stripe-dynamic.ts`) - Creates products on-the-fly
- **No Pre-created Products** - Uses `price_data` for unlimited product flexibility
- **Mixed Checkout Support** - Handles both subscriptions and one-time payments
- **Metadata Driven** - Rich metadata for order tracking

#### 3. Authentication & Authorization
- **NextAuth.js** (`lib/auth.ts`) - Supports Google OAuth, GitHub, email
- **Role-based Access** - Customer/Admin roles with protected routes
- **Session Management** - Server-side session handling

#### 4. Internationalization (Currently Disabled)
- **7 Language Support** - Messages stored in `messages/` directory
- **Next-intl Integration** - Currently disabled due to 404 issues
- **Currency Support** - Multi-currency with context provider

#### 5. Context Providers Structure
```tsx
<AuthProvider>
  <CartProvider>
    <CookieConsentProvider>
      <CurrencyProvider>
        {/* App content */}
      </CurrencyProvider>
    </CookieConsentProvider>
  </CartProvider>
</AuthProvider>
```

### Directory Structure

#### Core Application
- `app/` - Next.js 15 App Router pages (34+ routes)
- `components/` - Reusable React components organized by feature
- `lib/` - Business logic, database connections, utilities
- `types/` - TypeScript type definitions
- `public/` - Static assets and images

#### Data & Configuration
- `database/` - SQL migration files and database setup
- `messages/` - Internationalization files (7 languages)
- `config/` - Application configuration files

#### Special Directories
- `api-backup*/` - Backup of API implementations
- `server-only-features/` - Server-side only code
- `out/` - Static export output (for wp.instant.tw)

### Component Architecture

#### Layout Components
- `Header` - Navigation with language/currency switching
- `Footer` - Site footer with links and legal pages
- `FloatingChatbot` - AI-powered customer support

#### Feature Components
- `UnifiedCheckoutButton` - Dynamic Stripe checkout integration
- `CartSidebar` - Shopping cart with real-time updates
- `CookieBanner` - GDPR compliant cookie consent
- `AuthProvider` - Authentication state management

### Database Schema

#### Core Tables
- **Products** - Plugin information and metadata
- **Orders** - Purchase history and license management
- **Users** - Customer accounts and authentication
- **WP Scan** - WordPress security scanning results
- **Licenses** - Product license keys and activations

### Environment Configuration

#### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...          # Neon PostgreSQL
MYSQL_* variables                      # Legacy MySQL support

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret

# Stripe (Dynamic Integration)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
```

### Development Considerations

#### TypeScript Configuration
- **Dual tsconfig.json files** - `tsconfig.json` (full) and `tsconfig.ui.json` (UI only)
- **Excluded directories** - API backups and server-only features excluded from UI build
- **Strict mode enabled** - Full TypeScript strict mode for better code quality

#### Build Configuration
- **Turbopack enabled** - For faster builds and development
- **Type checking disabled in build** - Use `npm run typecheck` instead
- **ESLint disabled during build** - Run separately for better performance

#### Middleware (Currently Disabled)
- **I18N middleware disabled** - Due to site-wide 404 issues
- **Simple passthrough** - All requests currently bypass middleware

### Testing Strategy

#### Database Testing
```bash
# Test database connections
node -e "require('./lib/db-neon.ts').testConnection()"

# Verify Stripe configuration
npm run dev # Check console for Stripe initialization
```

#### Deployment Verification
- **Test all 34+ pages** - Ensure no 404 errors
- **Verify checkout flow** - Complete purchase flow testing
- **Check responsive design** - Mobile/tablet compatibility
- **Validate internationalization** - When re-enabled

### Common Development Tasks

#### Adding New Plugins
1. Add plugin data to `lib/db-products.ts`
2. Create plugin page in `app/plugins/[slug]/`
3. Update sitemap and structured data
4. Add product images to `public/images/plugins/`

#### Stripe Integration Changes
- Use `lib/stripe-dynamic.ts` for all checkout modifications
- Never create static Stripe products - use dynamic `price_data`
- Test with Stripe CLI webhook forwarding

#### Database Migrations
- Add SQL files to `database/` directory
- Use Neon PostgreSQL for new features
- Maintain MySQL compatibility for existing data

### Performance Optimization

#### Image Optimization
- **Next.js Image component** - Automatic WebP/AVIF conversion
- **Responsive images** - Multiple device sizes configured
- **External domains** - wp.instant.tw domain whitelisted

#### Caching Strategy
- **Static generation** where possible
- **ISR for dynamic content** - Product pages with revalidation
- **Database connection pooling** - Enabled for both MySQL and PostgreSQL

### Security Features

#### Authentication Security
- **bcryptjs** for password hashing
- **CSRF protection** via NextAuth
- **Secure session cookies** - httpOnly, secure flags

#### Data Protection
- **Environment variable validation** - Required vars checked at startup
- **SQL injection prevention** - Parameterized queries
- **XSS protection** - Sanitized user inputs

This architecture supports a scalable WordPress plugin marketplace with modern development practices, comprehensive testing capabilities, and production-ready deployment options.