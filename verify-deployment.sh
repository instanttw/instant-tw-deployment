#!/bin/bash

# Deployment Verification Script
# Run this before deploying to catch any issues

echo "🔍 Verifying Deployment Readiness..."
echo ""

# Check if required packages are installed
echo "📦 Checking packages..."
if grep -q "@vercel/postgres" package.json; then
  echo "  ✅ @vercel/postgres found in package.json"
else
  echo "  ❌ @vercel/postgres NOT found - run: npm install @vercel/postgres"
  exit 1
fi

# Check if migration file exists
echo ""
echo "📁 Checking database files..."
if [ -f "database/migrations/001_add_products_tables_postgres.sql" ]; then
  echo "  ✅ PostgreSQL migration file found"
else
  echo "  ❌ Migration file missing"
  exit 1
fi

# Check if seeder exists
if [ -f "scripts/seed-products-postgres.ts" ]; then
  echo "  ✅ Product seeder found"
else
  echo "  ❌ Seeder file missing"
  exit 1
fi

# Check if checkout pages have dynamic exports
echo ""
echo "🔧 Checking checkout pages..."
if grep -q "export const dynamic = 'force-dynamic'" app/checkout/success/page.tsx; then
  echo "  ✅ Success page has dynamic export"
else
  echo "  ❌ Success page missing dynamic export"
  exit 1
fi

if grep -q "export const dynamic = 'force-dynamic'" app/checkout/cancel/page.tsx; then
  echo "  ✅ Cancel page has dynamic export"
else
  echo "  ❌ Cancel page missing dynamic export"
  exit 1
fi

# Check environment variables
echo ""
echo "🔐 Checking environment variables..."
if [ -n "$DATABASE_URL" ]; then
  echo "  ✅ DATABASE_URL is set"
else
  echo "  ⚠️  DATABASE_URL not set in current environment"
  echo "     (This is OK if it's set in Vercel)"
fi

if [ -n "$STRIPE_SECRET_KEY" ]; then
  echo "  ✅ STRIPE_SECRET_KEY is set"
else
  echo "  ⚠️  STRIPE_SECRET_KEY not set in current environment"
fi

if [ -n "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ]; then
  echo "  ✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set"
else
  echo "  ⚠️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not set in current environment"
fi

# Try to build
echo ""
echo "🏗️  Testing build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "  ✅ Build succeeded!"
else
  echo "  ❌ Build failed - run 'npm run build' to see errors"
  exit 1
fi

echo ""
echo "🎉 All checks passed! Ready to deploy!"
echo ""
echo "Next steps:"
echo "  1. Run migration in Neon Console"
echo "  2. Run: npx tsx scripts/seed-products-postgres.ts"
echo "  3. Deploy: vercel --prod"
echo ""
