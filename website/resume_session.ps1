# Resume Chat Session Script
# Run this to quickly restart the development environment

Write-Host "🚀 Resuming EcommerceWithAds Development Session..." -ForegroundColor Green

# Navigate to project directory
Set-Location "C:\Users\micha\EcommerceWithAds\website"

Write-Host "📁 Project Directory: $(Get-Location)" -ForegroundColor Cyan

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if database is running
Write-Host "🔍 Checking database connection..." -ForegroundColor Yellow
try {
    npm run db:push --silent
    Write-Host "✅ Database connected" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Database connection issue - check PostgreSQL" -ForegroundColor Red
}

# Start development server
Write-Host "🌐 Starting development server..." -ForegroundColor Yellow
Write-Host "📍 Server will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📖 Check CHAT_SESSION_SUMMARY.md for full context" -ForegroundColor Cyan

# Open browser
Start-Process "http://localhost:3000"

# Start the server
npm run dev
