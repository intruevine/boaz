# FTP 업로드 스크립트
$ftpServer = "intruevine.dscloud.biz"
$username = "boazkim"
$password = "ThinQ2@22"
$remotePath = "/CSR"

Write-Host "FTP 서버 연결 중..." -ForegroundColor Green

# WebClient 객체 생성
$webclient = New-Object System.Net.WebClient
$webclient.Credentials = New-Object System.Net.NetworkCredential($username, $password)

# index.html 업로드
Write-Host "index.html 업로드 중..." -ForegroundColor Yellow
try {
    $webclient.UploadFile("ftp://$ftpServer$remotePath/index.html", "$PSScriptRoot/deploy/index.html")
    Write-Host "✓ index.html 업로드 완료" -ForegroundColor Green
} catch {
    Write-Host "✗ index.html 업로드 실패: $_" -ForegroundColor Red
}

# image/logo.jpg 업로드
Write-Host "logo.jpg 업로드 중..." -ForegroundColor Yellow
try {
    $webclient.UploadFile("ftp://$ftpServer$remotePath/image/logo.jpg", "$PSScriptRoot/deploy/image/logo.jpg")
    Write-Host "✓ logo.jpg 업로드 완료" -ForegroundColor Green
} catch {
    Write-Host "✗ logo.jpg 업로드 실패: $_" -ForegroundColor Red
}

Write-Host "`n배포 완료!" -ForegroundColor Green
Write-Host "접속 URL: https://intruevine.dscloud.biz/CSR" -ForegroundColor Cyan
