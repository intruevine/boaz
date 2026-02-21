# Deployment Script
Write-Host "=== Deployment Started ===" -ForegroundColor Green

if (-not (Test-Path "deploy/index.html")) {
    Write-Host "ERROR: deploy/index.html not found!" -ForegroundColor Red
    exit 1
}

Write-Host "OK: Files ready" -ForegroundColor Green
Write-Host "  - deploy/index.html" -ForegroundColor Gray
Write-Host "  - deploy/image/logo.jpg" -ForegroundColor Gray

Write-Host "`nUploading via FTP..." -ForegroundColor Yellow

try {
    Write-Host "  Uploading index.html..." -ForegroundColor Gray
    curl.exe --user "boazkim:R@kaf_427" --ftp-skip-pasv-ip -T deploy/index.html ftp://intruevine.dscloud.biz/web_packages/CSR/index.html 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { Write-Host "  SUCCESS: index.html" -ForegroundColor Green }
    else { Write-Host "  FAILED: index.html" -ForegroundColor Red }
    
    Write-Host "  Uploading logo.jpg..." -ForegroundColor Gray
    curl.exe --user "boazkim:R@kaf_427" --ftp-skip-pasv-ip -T deploy/image/logo.jpg ftp://intruevine.dscloud.biz/web_packages/CSR/image/logo.jpg 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { Write-Host "  SUCCESS: logo.jpg" -ForegroundColor Green }
    else { Write-Host "  FAILED: logo.jpg" -ForegroundColor Red }
} catch {
    Write-Host "  ERROR: $_" -ForegroundColor Red
}

Write-Host "`n=== Done ===" -ForegroundColor Green
Write-Host "URL: https://intruevine.dscloud.biz/CSR" -ForegroundColor Cyan
Write-Host "`nAlternative: Use FileZilla" -ForegroundColor Yellow
Write-Host "  Host: inturevine.dscloud.biz" -ForegroundColor White
Write-Host "  User: boazkim" -ForegroundColor White
Write-Host "  Pass: R@kaf_427" -ForegroundColor White
