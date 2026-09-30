# ============================================================
# Download High-Quality Ethiopia Images from Wikimedia Commons
# All images are freely licensed (CC BY-SA / CC BY)
# ============================================================
param(
    [int]$DelayMs = 2000
)

$mediaBase = "d:\ComeToEthiopia\public\media"
$WM = "https://thumb.wikimedia.org/wikipedia/commons/thumb"

$images = @{
    # ── HERO ──────────────────────────────────────────────────────────────
    "$mediaBase\hero\Home-Page-Collage.webp" = "$WM/5/59/Ras_Dejen_Summit.JPG/1920px-Ras_Dejen_Summit.JPG"
    "$mediaBase\hero\Home-Page-Collage-480.webp" = "$WM/5/59/Ras_Dejen_Summit.JPG/960px-Ras_Dejen_Summit.JPG"

    # ── REGIONS ───────────────────────────────────────────────────────────

    # Simien Mountains
    "$mediaBase\regions\Simien-Mountains-Ethiopia-Tours-and-Travel-Packages.jpg" = "$WM/5/59/Ras_Dejen_Summit.JPG/1920px-Ras_Dejen_Summit.JPG"
    "$mediaBase\regions\Simien-Mountains-Ethiopia-Tours-and-Travel-Packages-480.webp" = "$WM/5/59/Ras_Dejen_Summit.JPG/960px-Ras_Dejen_Summit.JPG"

    # Omo Valley - Hamer tribe portrait
    "$mediaBase\regions\Omo-Valley-Tribe-Ethiopia-Tour-Travel-Package.webp" = "$WM/c/cc/Washare_from_the_Hamer_tribe_in_Logara%2C_near_Turmi%2C_Omo_Valley%2C_Ethiopia_%2816882803797%29.jpg/1080px-Washare_from_the_Hamer_tribe_in_Logara%2C_near_Turmi%2C_Omo_Valley%2C_Ethiopia_%2816882803797%29.jpg"
    "$mediaBase\regions\Omo-Valley-Tribe-Ethiopia-Tour-Travel-Package-480.webp" = "$WM/c/cc/Washare_from_the_Hamer_tribe_in_Logara%2C_near_Turmi%2C_Omo_Valley%2C_Ethiopia_%2816882803797%29.jpg/640px-Washare_from_the_Hamer_tribe_in_Logara%2C_near_Turmi%2C_Omo_Valley%2C_Ethiopia_%2816882803797%29.jpg"

    # Omo Valley landscape
    "$mediaBase\regions\Omo-Valley-Ethiopia-Tours-and-Travel-Packages.jpg" = "$WM/c/cc/Washare_from_the_Hamer_tribe_in_Logara%2C_near_Turmi%2C_Omo_Valley%2C_Ethiopia_%2816882803797%29.jpg/1920px-Washare_from_the_Hamer_tribe_in_Logara%2C_near_Turmi%2C_Omo_Valley%2C_Ethiopia_%2816882803797%29.jpg"
    "$mediaBase\regions\Omo-Valley-Ethiopia-Tours-and-Travel-Packages-480.webp" = "$WM/c/cc/Washare_from_the_Hamer_tribe_in_Logara%2C_near_Turmi%2C_Omo_Valley%2C_Ethiopia_%2816882803797%29.jpg/960px-Washare_from_the_Hamer_tribe_in_Logara%2C_near_Turmi%2C_Omo_Valley%2C_Ethiopia_%2816882803797%29.jpg"

    # Danakil Depression - Dallol hydrothermal
    "$mediaBase\regions\Dalol-Danakil-Depression-Ethiopia-Tours-and-Holiday-Packages.jpg" = "$WM/3/35/ET_Afar_asv2018-01_img36_Dallol.jpg/1920px-ET_Afar_asv2018-01_img36_Dallol.jpg"
    "$mediaBase\regions\Dalol-Danakil-Depression-Ethiopia-Tours-and-Holiday-Packages-480.webp" = "$WM/3/35/ET_Afar_asv2018-01_img36_Dallol.jpg/960px-ET_Afar_asv2018-01_img36_Dallol.jpg"

    # Erta Ale Volcano
    "$mediaBase\regions\Erta-Ale-Volcano-Ethiopia-Tours-and-Holiday-Packages.jpg" = "$WM/1/1b/ET_Afar_asv2018-01_img100_Ertale.jpg/1920px-ET_Afar_asv2018-01_img100_Ertale.jpg"
    "$mediaBase\regions\Erta-Ale-Volcano-Ethiopia-Tours-and-Holiday-Packages-480.webp" = "$WM/1/1b/ET_Afar_asv2018-01_img100_Ertale.jpg/960px-ET_Afar_asv2018-01_img100_Ertale.jpg"

    # Bale Mountains - Ethiopian wolf
    "$mediaBase\regions\Bale-Mountains-Ethiopia-Tour-Travel-Package.webp" = "$WM/3/34/Rare_Ethiopian_Wolf_Feeding%2C_Bale%2C_Ethiopia_%289681610338%29.jpg/1920px-Rare_Ethiopian_Wolf_Feeding%2C_Bale%2C_Ethiopia_%289681610338%29.jpg"
    "$mediaBase\regions\Bale-Mountains-Ethiopia-Tour-Travel-Package-480.webp" = "$WM/3/34/Rare_Ethiopian_Wolf_Feeding%2C_Bale%2C_Ethiopia_%289681610338%29.jpg/960px-Rare_Ethiopian_Wolf_Feeding%2C_Bale%2C_Ethiopia_%289681610338%29.jpg"

    # Gondar - Fasil Ghebbi castle
    "$mediaBase\regions\Gonder-Fasiledes-Mountains-Ethiopia-Tour-Travel-Package.webp" = "$WM/3/33/ET_Gondar_asv2018-02_img18_Fasil_Ghebbi.jpg/1920px-ET_Gondar_asv2018-02_img18_Fasil_Ghebbi.jpg"
    "$mediaBase\regions\Gonder-Fasiledes-Mountains-Ethiopia-Tour-Travel-Package-480.webp" = "$WM/3/33/ET_Gondar_asv2018-02_img18_Fasil_Ghebbi.jpg/960px-ET_Gondar_asv2018-02_img18_Fasil_Ghebbi.jpg"

    # Axum - Stelae field
    "$mediaBase\regions\Axum-Aksum-Historical-Attractions-of-Ethiopia-Tours-and-Travel-Holidays.webp" = "$WM/c/c4/Stela_in_Main_Stelae_Field_-_Axum_%28Aksum%29_-_Ethiopia_-_01_%288701108913%29.jpg/1280px-Stela_in_Main_Stelae_Field_-_Axum_%28Aksum%29_-_Ethiopia_-_01_%288701108913%29.jpg"
    "$mediaBase\regions\Axum-Aksum-Historical-Attractions-of-Ethiopia-Tours-and-Travel-Holidays-480.webp" = "$WM/c/c4/Stela_in_Main_Stelae_Field_-_Axum_%28Aksum%29_-_Ethiopia_-_01_%288701108913%29.jpg/640px-Stela_in_Main_Stelae_Field_-_Axum_%28Aksum%29_-_Ethiopia_-_01_%288701108913%29.jpg"

    # ── TOURS ─────────────────────────────────────────────────────────────

    # Lalibela - Beta Giyorgis
    "$mediaBase\tours\Lalibela-Ethiopia-Tours.webp" = "$WM/0/0b/Bete_Giyorgis_03.jpg/1080px-Bete_Giyorgis_03.jpg"
    "$mediaBase\tours\Lalibela-Ethiopia-Tours-480.webp" = "$WM/0/0b/Bete_Giyorgis_03.jpg/640px-Bete_Giyorgis_03.jpg"

    # Addis Ababa - aerial
    "$mediaBase\tours\Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato.webp" = "$WM/3/36/Addis_Ababa_%2816314616596%29.jpg/1920px-Addis_Ababa_%2816314616596%29.jpg"
    "$mediaBase\tours\Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato-480.webp" = "$WM/3/36/Addis_Ababa_%2816314616596%29.jpg/960px-Addis_Ababa_%2816314616596%29.jpg"

    # 4-Day Simien Mountains - gelada baboon
    "$mediaBase\tours\4-Day-Simien-Mountains-Hiking-Tour.webp" = "$WM/5/55/Gelada_Baboon%2C_Ethiopia_-_panoramio.jpg/1920px-Gelada_Baboon%2C_Ethiopia_-_panoramio.jpg"
    "$mediaBase\tours\4-Day-Simien-Mountains-Hiking-Tour-480.webp" = "$WM/5/55/Gelada_Baboon%2C_Ethiopia_-_panoramio.jpg/960px-Gelada_Baboon%2C_Ethiopia_-_panoramio.jpg"

    # 3-Day Danakil
    "$mediaBase\tours\3-Day-Expedition-to-Dallol-Salt-Flats-Danakil-Depression-Erta-Ale-Volcano.webp" = "$WM/3/35/ET_Afar_asv2018-01_img36_Dallol.jpg/1920px-ET_Afar_asv2018-01_img36_Dallol.jpg"
    "$mediaBase\tours\3-Day-Expedition-to-Dallol-Salt-Flats-Danakil-Depression-Erta-Ale-Volcano-480.webp" = "$WM/3/35/ET_Afar_asv2018-01_img36_Dallol.jpg/960px-ET_Afar_asv2018-01_img36_Dallol.jpg"

    # 3-Day Omo Valley
    "$mediaBase\tours\3-Day-Omo-Valley-Quick-Tour-to-Mursi-Hamer-Karo-Tribes.webp" = "$WM/c/cc/Washare_from_the_Hamer_tribe_in_Logara%2C_near_Turmi%2C_Omo_Valley%2C_Ethiopia_%2816882803797%29.jpg/1080px-Washare_from_the_Hamer_tribe_in_Logara%2C_near_Turmi%2C_Omo_Valley%2C_Ethiopia_%2816882803797%29.jpg"
    "$mediaBase\tours\3-Day-Omo-Valley-Quick-Tour-to-Mursi-Hamer-Karo-Tribes-480.webp" = "$WM/c/cc/Washare_from_the_Hamer_tribe_in_Logara%2C_near_Turmi%2C_Omo_Valley%2C_Ethiopia_%2816882803797%29.jpg/640px-Washare_from_the_Hamer_tribe_in_Logara%2C_near_Turmi%2C_Omo_Valley%2C_Ethiopia_%2816882803797%29.jpg"

    # 3-Day Lalibela churches tour
    "$mediaBase\tours\3-Day-Tour-of-Lalibel-Yemrehanna-Kristos-Hiking-to-Asheton-Maryam.webp" = "$WM/4/45/Rock-Hewn_Churches%2C_Lalibela_Ethiopia_%285%29.jpg/1920px-Rock-Hewn_Churches%2C_Lalibela_Ethiopia_%285%29.jpg"
    "$mediaBase\tours\3-Day-Tour-of-Lalibel-Yemrehanna-Kristos-Hiking-to-Asheton-Maryam-480.webp" = "$WM/4/45/Rock-Hewn_Churches%2C_Lalibela_Ethiopia_%285%29.jpg/960px-Rock-Hewn_Churches%2C_Lalibela_Ethiopia_%285%29.jpg"

    # 4-Day Bale Mountains Sof Omar
    "$mediaBase\tours\4-Day-Bale-Mountains-Sof-Omar-Caves-Tours.webp" = "$WM/3/34/Rare_Ethiopian_Wolf_Feeding%2C_Bale%2C_Ethiopia_%289681610338%29.jpg/1920px-Rare_Ethiopian_Wolf_Feeding%2C_Bale%2C_Ethiopia_%289681610338%29.jpg"
    "$mediaBase\tours\4-Day-Bale-Mountains-Sof-Omar-Caves-Tours-480.webp" = "$WM/3/34/Rare_Ethiopian_Wolf_Feeding%2C_Bale%2C_Ethiopia_%289681610338%29.jpg/960px-Rare_Ethiopian_Wolf_Feeding%2C_Bale%2C_Ethiopia_%289681610338%29.jpg"

    # 5-Day Bale Mountains Trek
    "$mediaBase\tours\5-Day-Bale-Mountains-Trek-Ethiopian-Wolves-Alpine-Lakes.webp" = "$WM/3/34/Rare_Ethiopian_Wolf_Feeding%2C_Bale%2C_Ethiopia_%289681610338%29.jpg/1920px-Rare_Ethiopian_Wolf_Feeding%2C_Bale%2C_Ethiopia_%289681610338%29.jpg"
    "$mediaBase\tours\5-Day-Bale-Mountains-Trek-Ethiopian-Wolves-Alpine-Lakes-480.webp" = "$WM/3/34/Rare_Ethiopian_Wolf_Feeding%2C_Bale%2C_Ethiopia_%289681610338%29.jpg/960px-Rare_Ethiopian_Wolf_Feeding%2C_Bale%2C_Ethiopia_%289681610338%29.jpg"

    # 7-Day Historic Route
    "$mediaBase\tours\7-Day-Historic-Tour-to-Lake-Tana-Gonder-Lalibela-Simien-Mountains.webp" = "$WM/3/33/ET_Gondar_asv2018-02_img18_Fasil_Ghebbi.jpg/1920px-ET_Gondar_asv2018-02_img18_Fasil_Ghebbi.jpg"
    "$mediaBase\tours\7-Day-Historic-Tour-to-Lake-Tana-Gonder-Lalibela-Simien-Mountains-480.webp" = "$WM/3/33/ET_Gondar_asv2018-02_img18_Fasil_Ghebbi.jpg/960px-ET_Gondar_asv2018-02_img18_Fasil_Ghebbi.jpg"

    # Wenchi Crater Lake
    "$mediaBase\tours\Day-Trip-to-Wenchi-Crater-Lake.webp" = "$WM/5/59/Ras_Dejen_Summit.JPG/1920px-Ras_Dejen_Summit.JPG"
    "$mediaBase\tours\Day-Trip-to-Wenchi-Crater-Lake-480.webp" = "$WM/5/59/Ras_Dejen_Summit.JPG/960px-Ras_Dejen_Summit.JPG"

    # Gheralta Mountains
    "$mediaBase\tours\Gheralta-Mountains-Ethiopia-Tours-and-Travel-Packages.jpg" = "$WM/5/59/Ras_Dejen_Summit.JPG/1920px-Ras_Dejen_Summit.JPG"
    "$mediaBase\tours\Gheralta-Mountains-Ethiopia-Tours-and-Travel-Packages-480.webp" = "$WM/5/59/Ras_Dejen_Summit.JPG/960px-Ras_Dejen_Summit.JPG"
}

# ── DOWNLOAD ──────────────────────────────────────────────────────────────
$success = 0
$fail    = 0
$total   = $images.Count
$i       = 0

$userAgent = "ComeToEthiopiaTours/1.0 (https://cometoethiopiatours.com; contact=cometoethiopiatours@gmail.com) PowerShell"

Write-Host ""
Write-Host "Downloading $total high-quality Ethiopia images from Wikimedia Commons..." -ForegroundColor Cyan
Write-Host "Estimated time: ~$([math]::Round($total * $DelayMs / 1000))s (2s delay per image for rate limits)" -ForegroundColor DarkGray
Write-Host ""

foreach ($dest in $images.Keys) {
    $i++
    $url  = $images[$dest]
    $name = Split-Path $dest -Leaf

    $dir = Split-Path $dest -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

    Write-Host "[$i/$total] $name" -ForegroundColor Cyan -NoNewline

    try {
        $wr = [System.Net.WebRequest]::Create($url)
        $wr.UserAgent = $userAgent
        $wr.Timeout   = 60000

        $response   = $wr.GetResponse()
        $stream     = $response.GetResponseStream()
        $fileStream = [System.IO.File]::Create($dest)
        $stream.CopyTo($fileStream)
        $fileStream.Close()
        $stream.Close()
        $response.Close()

        $kb = [math]::Round((Get-Item $dest).Length / 1KB)
        Write-Host "  OK ${kb}KB" -ForegroundColor Green
        $success++
    } catch {
        Write-Host "  FAILED: $_" -ForegroundColor Red
        $fail++
    }

    if ($i -lt $total) { Start-Sleep -Milliseconds $DelayMs }
}

Write-Host ""
Write-Host "Done: $success OK, $fail failed" -ForegroundColor Yellow
Write-Host "Attribution: Photos from Wikimedia Commons (CC BY-SA). See footer." -ForegroundColor DarkGray
