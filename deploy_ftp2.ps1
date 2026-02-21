# FTP 배포 (Passive Mode + Explicit SSL)
$ftpServer = "intruevine.dscloud.biz"
$username = "boazkim"
$password = "ThinQ2@22"
$remotePath = "/CSR"

Write-Host "FTP Passive Mode로 연결 시도..." -ForegroundColor Green

# FtpWebRequest 사용
$ftpUrl = "ftp://$ftpServer$remotePath/"

# index.html 업로드
$uri = New-Object System.Uri($ftpUrl + "index.html")
$ftp = [System.Net.FtpWebRequest]::Create($uri)
$ftp.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
$ftp.Credentials = New-Object System.Net.NetworkCredential($username, $password)
$ftp.UseBinary = $true
$ftp.UsePassive = $true
$ftp.KeepAlive = $false

try {
    $content = [System.IO.File]::ReadAllBytes("$PSScriptRoot/deploy/index.html")
    $stream = $ftp.GetRequestStream()
    $stream.Write($content, 0, $content.Length)
    $stream.Close()
    Write-Host "✓ index.html 업로드 완료" -ForegroundColor Green
} catch {
    Write-Host "✗ index.html 업로드 실패: $_" -ForegroundColor Red
}

# logo.jpg 업로드
$uri2 = New-Object System.Uri($ftpUrl + "image/logo.jpg")
$ftp2 = [System.Net.FtpWebRequest]::Create($uri2)
$ftp2.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
$ftp2.Credentials = New-Object System.Net.NetworkCredential($username, $password)
$ftp2.UseBinary = $true
$ftp2.UsePassive = $true
$ftp2.KeepAlive = $false

try {
    $content2 = [System.IO.File]::ReadAllBytes("$PSScriptRoot/deploy/image/logo.jpg")
    $stream2 = $ftp2.GetRequestStream()
    $stream2.Write($content2, 0, $content2.Length)
    $stream2.Close()
    Write-Host "✓ logo.jpg 업로드 완료" -ForegroundColor Green
} catch {
    Write-Host "✗ logo.jpg 업로드 실패: $_" -ForegroundColor Red
}

Write-Host "`n배포 시도 완료!" -ForegroundColor Green
