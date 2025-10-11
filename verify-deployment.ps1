# Deployment Verification Script (PowerShell)
# Run this before deploying to catch any issues

Write-Host "🔍 Verifying Deployment Readiness..." -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check if required packages are installed
Write-Host "📦 Checking packages..." -ForegroundColor Yellow
if (Select-String -Path "package.json" -Pattern "@vercel/postgres" -Quiet) {
  Write-Host "  ✅ @vercel/postgres found in package.json" -ForegroundColor Green
} else {
  Write-Host "  ❌ @vercel/postgres NOT found - run: npm install @vercel/postgres" -ForegroundColor Red
  $allGood = $false
}

# Check if migration file exists
Write-Host ""
Write-Host "📁 Checking database files..." -ForegroundColor Yellow
if (Test-Path "database\migrations\001_add_products_tables_postgres.sql") {
  Write-Host "  ✅ PostgreSQL migration file found" -ForegroundColor Green
} else {
  Write-Host "  ❌ Migration file missing" -ForegroundColor Red
  $allGood = $false
}

# Check if seeder exists
if (Test-Path "scripts\seed-products-postgres.ts") {
  Write-Host "  ✅ Product seeder found" -ForegroundColor Green
} else {
  Write-Host "  ❌ Seeder file missing" -ForegroundColor Red
  $allGood = $false
}

# Check if checkout pages have dynamic exports
Write-Host ""
Write-Host "🔧 Checking checkout pages..." -ForegroundColor Yellow
if (Select-String -Path "app\checkout\success\page.tsx" -Pattern "export const dynamic = 'force-dynamic'" -Quiet) {
  Write-Host "  ✅ Success page has dynamic export" -ForegroundColor Green
} else {
  Write-Host "  ❌ Success page missing dynamic export" -ForegroundColor Red
  $allGood = $false
}

if (Select-String -Path "app\checkout\cancel\page.tsx" -Pattern "export const dynamic = 'force-dynamic'" -Quiet) {
  Write-Host "  ✅ Cancel page has dynamic export" -ForegroundColor Green
} else {
  Write-Host "  ❌ Cancel page missing dynamic export" -ForegroundColor Red
  $allGood = $false
}

# Check environment variables
Write-Host ""
Write-Host "🔐 Checking environment variables..." -ForegroundColor Yellow
if ($env:DATABASE_URL) {
  Write-Host "  ✅ DATABASE_URL is set" -ForegroundColor Green
} else {
  Write-Host "  ⚠️  DATABASE_URL not set in current environment" -ForegroundColor DarkYellow
  Write-Host "     (This is OK if it's set in Vercel)" -ForegroundColor Gray
}

if ($env:STRIPE_SECRET_KEY) {
  Write-Host "  ✅ STRIPE_SECRET_KEY is set" -ForegroundColor Green
} else {
  Write-Host "  ⚠️  STRIPE_SECRET_KEY not set in current environment" -ForegroundColor DarkYellow
}

if ($env:NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  Write-Host "  ✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set" -ForegroundColor Green
} else {
  Write-Host "  ⚠️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not set in current environment" -ForegroundColor DarkYellow
}

# Try to build
Write-Host ""
Write-Host "🏗️  Testing build..." -ForegroundColor Yellow
$buildOutput = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Host "  ✅ Build succeeded!" -ForegroundColor Green
} else {
  Write-Host "  ❌ Build failed - run 'npm run build' to see errors" -ForegroundColor Red
  Write-Host $buildOutput -ForegroundColor Gray
  $allGood = $false
}

Write-Host ""
if ($allGood) {
  Write-Host "🎉 All checks passed! Ready to deploy!" -ForegroundColor Green
} else {
  Write-Host "⚠️  Some checks failed - please fix the issues above" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run migration in Neon Console" -ForegroundColor White
Write-Host "  2. Run: npx tsx scripts/seed-products-postgres.ts" -ForegroundColor White
Write-Host "  3. Deploy: vercel --prod" -ForegroundColor White
Write-Host ""
