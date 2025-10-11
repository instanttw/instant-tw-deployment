# PowerShell Script to Test Checkout Setup
# Run this script to verify all requirements are met

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Checkout Setup Verification Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# Check 1: .env.local exists
Write-Host "Checking .env.local file..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "  ✓ .env.local exists" -ForegroundColor Green
    
    $envContent = Get-Content ".env.local" -Raw
    
    # Check Stripe keys
    if ($envContent -match 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_[^"]*"' -and 
        $envContent -notmatch 'YOUR_PUBLISHABLE_KEY_HERE') {
        Write-Host "  ✓ Stripe Publishable Key configured" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Stripe Publishable Key NOT configured" -ForegroundColor Red
        $errors += "Add your Stripe Publishable Key to .env.local"
    }
    
    if ($envContent -match 'STRIPE_SECRET_KEY="sk_test_[^"]*"' -and 
        $envContent -notmatch 'YOUR_SECRET_KEY_HERE') {
        Write-Host "  ✓ Stripe Secret Key configured" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Stripe Secret Key NOT configured" -ForegroundColor Red
        $errors += "Add your Stripe Secret Key to .env.local"
    }
    
    if ($envContent -match 'STRIPE_WEBHOOK_SECRET="whsec_[^"]*"' -and 
        $envContent -notmatch 'YOUR_WEBHOOK_SECRET_HERE') {
        Write-Host "  ✓ Stripe Webhook Secret configured" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Stripe Webhook Secret NOT configured" -ForegroundColor Red
        $errors += "Add your Stripe Webhook Secret to .env.local"
    }
    
    # Check Database URL
    if ($envContent -match 'DATABASE_URL=postgresql://') {
        Write-Host "  ✓ Database URL configured" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Database URL NOT configured" -ForegroundColor Red
        $errors += "Add DATABASE_URL to .env.local"
    }
    
} else {
    Write-Host "  ✗ .env.local does NOT exist" -ForegroundColor Red
    $errors += "Create .env.local file (copy from .env.local.TEMPLATE)"
}

Write-Host ""

# Check 2: node_modules exists
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✓ node_modules exists (dependencies installed)" -ForegroundColor Green
} else {
    Write-Host "  ✗ node_modules missing" -ForegroundColor Red
    $errors += "Run: npm install"
}

Write-Host ""

# Check 3: Required files exist
Write-Host "Checking project files..." -ForegroundColor Yellow
$requiredFiles = @(
    "lib/stripe-dynamic.ts",
    "lib/db-products.ts",
    "app/api/checkout/dynamic/route.ts",
    "components/UnifiedCheckoutButton.tsx",
    "scripts/seed-products-postgres.ts"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file missing" -ForegroundColor Red
        $errors += "Missing file: $file"
    }
}

Write-Host ""

# Check 4: Database connection (if we can test it)
Write-Host "Database Status..." -ForegroundColor Yellow
Write-Host "  ⚠ Manual check required" -ForegroundColor Yellow
Write-Host "    Run: npx tsx scripts/seed-products-postgres.ts" -ForegroundColor Gray

Write-Host ""

# Summary
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    Write-Host ""
    Write-Host "✓ All checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: npx tsx scripts/seed-products-postgres.ts" -ForegroundColor White
    Write-Host "  2. Run: npm run dev" -ForegroundColor White
    Write-Host "  3. Visit: http://localhost:3000/wp-scan/plans" -ForegroundColor White
    Write-Host "  4. Test checkout with card: 4242 4242 4242 4242" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Issues found ($($errors.Count)):" -ForegroundColor Red
    Write-Host ""
    foreach ($error in $errors) {
        Write-Host "  • $error" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Fix these issues and run this script again." -ForegroundColor Yellow
    Write-Host ""
}

if ($warnings.Count -gt 0) {
    Write-Host "Warnings ($($warnings.Count)):" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  • $warning" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "For detailed instructions, see: QUICK_FIX_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
