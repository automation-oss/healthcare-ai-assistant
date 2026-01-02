# Test script to verify backend server is working
# Run this after starting the server

Write-Host "🧪 Testing Healthcare AI Backend" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001"

# Test 1: Health Check
Write-Host "Test 1: Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Health check passed: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
    Write-Host "   Make sure the server is running (npm run dev)" -ForegroundColor Yellow
    exit 1
}

# Test 2: Search Endpoint
Write-Host ""
Write-Host "Test 2: Search Endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        query = "rcm"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/search" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    
    if ($response.success) {
        Write-Host "✅ Search endpoint working" -ForegroundColor Green
        Write-Host "   Primary URL: $($response.data.primaryUrl)" -ForegroundColor Gray
        Write-Host "   Found $($response.data.additionalUrls.Count) additional URLs" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Search returned but success=false" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Search endpoint failed: $_" -ForegroundColor Red
}

# Test 3: Email Endpoint
Write-Host ""
Write-Host "Test 3: Email Endpoint..." -ForegroundColor Yellow
try {
    $testEmail = "test@example.com"
    $body = @{
        email = $testEmail
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/users/email" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    
    if ($response.success) {
        Write-Host "✅ Email endpoint working" -ForegroundColor Green
        Write-Host "   Saved email: $($response.data.email)" -ForegroundColor Gray
        Write-Host "   User ID: $($response.data.id)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Email endpoint failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ All tests completed!" -ForegroundColor Green






