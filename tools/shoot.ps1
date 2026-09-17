# tools/shoot.ps1 — chup headless Chrome index/lo-trinh/components x {desktop 1440, mobile 400} x {light, dark}.
# Dung: powershell -ExecutionPolicy Bypass -File D:\Project\GD\tools\shoot.ps1 [-Out <thu muc>]
# Khong dung Chrome extension (khong mo duoc file://) va khong co Python -> chi dung headless Chrome truc tiep.
#
# QUAN TRONG (da vap 2026-09-15): --window-size / --screenshot cua chrome.exe KHONG dang tin cay tren may nay —
# Chrome ap mot MIN WIDTH ~484 CSS px cho viewport bat ke --window-size yeu cau nho hon (vd 400 hoac 300),
# lam sai lech hoan toan cac anh chup mobile (400px). Vi vay script nay dung Chrome DevTools Protocol (CDP)
# qua remote-debugging-port + Emulation.setDeviceMetricsOverride de ep dung kich thuoc viewport, roi
# Page.captureScreenshot de chup — day la cach duy nhat kiem chung cho ra dung 400px viewport.
# Xem: design-spec-v2.txt muc 8.
param(
    [string]$Out = (Join-Path $env:TEMP "gd-shots")
)

$ErrorActionPreference = "Continue"

function Find-Browser {
    $candidates = @(
        (Join-Path $env:ProgramFiles "Google\Chrome\Application\chrome.exe"),
        (Join-Path ${env:ProgramFiles(x86)} "Google\Chrome\Application\chrome.exe"),
        (Join-Path $env:LOCALAPPDATA "Google\Chrome\Application\chrome.exe"),
        (Join-Path $env:ProgramFiles "Microsoft\Edge\Application\msedge.exe"),
        (Join-Path ${env:ProgramFiles(x86)} "Microsoft\Edge\Application\msedge.exe")
    )
    foreach ($c in $candidates) {
        if ($c -and (Test-Path $c)) { return $c }
    }
    throw "Khong tim thay chrome.exe hoac msedge.exe trong cac vi tri thong thuong."
}

function Send-WS($ws, $obj) {
    $json = $obj | ConvertTo-Json -Depth 10 -Compress
    $bytes = [Text.Encoding]::UTF8.GetBytes($json)
    $seg = New-Object System.ArraySegment[byte] (, $bytes)
    $ws.SendAsync($seg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult() | Out-Null
}

function Receive-WS($ws) {
    $buffer = New-Object byte[] 131072
    $seg = New-Object System.ArraySegment[byte] (, $buffer)
    $all = New-Object System.Text.StringBuilder
    do {
        $result = $ws.ReceiveAsync($seg, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
        $all.Append([Text.Encoding]::UTF8.GetString($buffer, 0, $result.Count)) | Out-Null
    } while (-not $result.EndOfMessage)
    return $all.ToString()
}

# Nhan tin CDP cho toi khi thay method hoac id mong muon xuat hien, co timeout.
function Wait-WSFor($ws, [string]$matchPattern, [int]$timeoutSec = 12) {
    $deadline = (Get-Date).AddSeconds($timeoutSec)
    while ((Get-Date) -lt $deadline) {
        $msg = Receive-WS $ws
        if ($msg -match $matchPattern) { return $msg }
    }
    return $null
}

$browser = Find-Browser
Write-Host "Dung trinh duyet: $browser"

if (-not (Test-Path $Out)) {
    New-Item -ItemType Directory -Path $Out -Force | Out-Null
}

$root = Split-Path -Parent $PSScriptRoot
$rootUrl = ($root -replace '\\', '/')

$pages = @(
    @{ name = "index"; file = "index.html" },
    @{ name = "lo-trinh"; file = "lo-trinh.html" },
    @{ name = "components"; file = "components.html" },
    # Bai hoc that: cao hon nhieu (nhieu section dai) nen can height rieng, xem heightOverride ben duoi.
    @{ name = "lesson-tang-1-01-mda"; file = "lessons/tang-1/01-mda.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-0-01-game-la-gi"; file = "lessons/tang-0/01-game-la-gi.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-0-02-game-designer-lam-gi"; file = "lessons/tang-0/02-game-designer-lam-gi.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-0-03-tu-duy-nguoi-choi"; file = "lessons/tang-0/03-tu-duy-nguoi-choi.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-1-02-core-loop"; file = "lessons/tang-1/02-core-loop.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-1-03-fun-dong-luc"; file = "lessons/tang-1/03-fun-dong-luc.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-1-04-flow-do-kho"; file = "lessons/tang-1/04-flow-do-kho.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-1-05-game-feel"; file = "lessons/tang-1/05-game-feel.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-2-01-prototype-giay"; file = "lessons/tang-2/01-prototype-giay.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-2-02-playtest"; file = "lessons/tang-2/02-playtest.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-2-03-vong-lap-iteration"; file = "lessons/tang-2/03-vong-lap-iteration.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-2-04-tai-lieu-thiet-ke"; file = "lessons/tang-2/04-tai-lieu-thiet-ke.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-2-05-lam-viec-voi-dev-art"; file = "lessons/tang-2/05-lam-viec-voi-dev-art.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-3-01-systems-design"; file = "lessons/tang-3/01-systems-design.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-3-02-economy-sources-sinks"; file = "lessons/tang-3/02-economy-sources-sinks.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-3-03-balance-spreadsheet"; file = "lessons/tang-3/03-balance-spreadsheet.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-4-01-f2p-liveops"; file = "lessons/tang-4/01-f2p-liveops.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } },
    @{ name = "lesson-tang-4-02-metrics-ab-test"; file = "lessons/tang-4/02-metrics-ab-test.html"; heightOverride = @{ desktop = 20000; mobile = 32000 } }
)
$viewports = @(
    @{ name = "desktop"; width = 1440; height = 2600 },
    @{ name = "mobile"; width = 400; height = 3000 }
)
$themes = @("light", "dark")

$port = 9422
$userDataDir = Join-Path $env:TEMP ("gd-shots-profile-" + [guid]::NewGuid().ToString())

$chromeProc = Start-Process -FilePath $browser -ArgumentList @(
    "--headless=new",
    "--hide-scrollbars",
    "--disable-gpu",
    "--remote-debugging-port=$port",
    "--user-data-dir=$userDataDir",
    "about:blank"
) -PassThru

# Doi CDP san sang
$ready = $false
$deadline = (Get-Date).AddSeconds(15)
while ((Get-Date) -lt $deadline -and -not $ready) {
    try {
        Invoke-RestMethod -Uri "http://127.0.0.1:$port/json/version" -TimeoutSec 2 | Out-Null
        $ready = $true
    } catch {
        Start-Sleep -Milliseconds 300
    }
}
if (-not $ready) {
    throw "Chrome khong mo remote debugging port $port kip thoi."
}

$shots = @()

try {
    foreach ($page in $pages) {
        foreach ($vp in $viewports) {
            foreach ($theme in $themes) {
                $fileUrl = "file:///$rootUrl/$($page.file)?theme=$theme"
                $outName = "$($page.name)-$($vp.name)-$theme.png"
                $outPath = Join-Path $Out $outName

                try {
                    $target = Invoke-RestMethod -Uri "http://127.0.0.1:$port/json/new?about:blank" -Method PUT
                    $ws = New-Object System.Net.WebSockets.ClientWebSocket
                    $ws.ConnectAsync([Uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult() | Out-Null

                    $shotHeight = $vp.height
                    if ($page.heightOverride -and $page.heightOverride.ContainsKey($vp.name)) { $shotHeight = $page.heightOverride[$vp.name] }
                    Send-WS $ws @{ id = 1; method = "Emulation.setDeviceMetricsOverride"; params = @{ width = $vp.width; height = $shotHeight; deviceScaleFactor = 1; mobile = $false } }
                    Wait-WSFor $ws '"id":1' | Out-Null

                    Send-WS $ws @{ id = 2; method = "Page.enable" }
                    Wait-WSFor $ws '"id":2' | Out-Null

                    Send-WS $ws @{ id = 3; method = "Page.navigate"; params = @{ url = $fileUrl } }
                    Wait-WSFor $ws '"method":"Page.loadEventFired"' 15 | Out-Null
                    Start-Sleep -Milliseconds 500

                    Send-WS $ws @{ id = 4; method = "Page.captureScreenshot"; params = @{ format = "png" } }
                    $shotMsg = Wait-WSFor $ws '"id":4' 15

                    if ($shotMsg) {
                        $obj = $shotMsg | ConvertFrom-Json
                        $bytes = [Convert]::FromBase64String($obj.result.data)
                        [IO.File]::WriteAllBytes($outPath, $bytes)
                    }

                    $ws.Dispose()
                    Invoke-RestMethod -Uri "http://127.0.0.1:$port/json/close/$($target.id)" -TimeoutSec 5 | Out-Null
                } catch {
                    Write-Host "LOI khi chup ${outName}: $_"
                }

                if (Test-Path $outPath) {
                    $shots += $outPath
                    Write-Host "OK: $outName"
                } else {
                    Write-Host "LOI: khong tao duoc $outName"
                }
            }
        }
    }
} finally {
    Stop-Process -Id $chromeProc.Id -Force -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force $userDataDir -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Danh sach anh ($($shots.Count)):"
$shots | ForEach-Object { Write-Host " - $_" }
