# PowerShell Script to Enable Authentication
# Run this in PowerShell as Administrator

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Instant WP - Enable Authentication" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if running from correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Installing required packages..." -ForegroundColor Yellow
npm install mysql2 bcryptjs
npm install --save-dev @types/bcryptjs

Write-Host ""
Write-Host "Step 2: Moving server features to app folder..." -ForegroundColor Yellow

# Create app folders if they don't exist
New-Item -ItemType Directory -Path "app\api" -Force | Out-Null

# Move folders
if (Test-Path "server-only-features\api\auth") {
    Write-Host "  Moving API routes..." -ForegroundColor Gray
    Copy-Item -Path "server-only-features\api\*" -Destination "app\api\" -Recurse -Force
}

if (Test-Path "server-only-features\login") {
    Write-Host "  Moving login page..." -ForegroundColor Gray
    Copy-Item -Path "server-only-features\login" -Destination "app\login" -Recurse -Force
}

if (Test-Path "server-only-features\signup") {
    Write-Host "  Moving signup page..." -ForegroundColor Gray
    Copy-Item -Path "server-only-features\signup" -Destination "app\signup" -Recurse -Force
}

if (Test-Path "server-only-features\dashboard") {
    Write-Host "  Moving dashboard..." -ForegroundColor Gray
    Copy-Item -Path "server-only-features\dashboard" -Destination "app\dashboard" -Recurse -Force
}

if (Test-Path "server-only-features\checkout") {
    Write-Host "  Moving checkout..." -ForegroundColor Gray
    Copy-Item -Path "server-only-features\checkout" -Destination "app\checkout" -Recurse -Force
}

Write-Host ""
Write-Host "Step 3: Updating next.config.ts..." -ForegroundColor Yellow

$configContent = @"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export removed to enable server-side features
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
};

export default nextConfig;
"@

$configContent | Out-File -FilePath "next.config.ts" -Encoding UTF8 -Force

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Review and update the .env file with your NEXTAUTH_SECRET" -ForegroundColor White
Write-Host "2. Generate a secret: node -e 'console.log(require(\"crypto\").randomBytes(32).toString(\"base64\"))'" -ForegroundColor Gray
Write-Host "3. Build the project: npm run build" -ForegroundColor White
Write-Host "4. Start the server: npm start" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full Guide: Read ENABLE_AUTH_GUIDE.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""
