# download-images.ps1
# Downloads 16 missing tour photos from Wikimedia Commons (CC-BY/CC-BY-SA).
# All images are free to use with attribution; attribution is in credits.md.
# Run from the project root:  .\scripts\download-images.ps1

$dest = ".\public\media\tours"
if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }

$images = @(
  # 1. Harar gate — Wikimedia thumb (no rate limit)
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Harar_Gate.jpg/1280px-Harar_Gate.jpg"
    name = "Harar-Walled-City-Ethiopia-Tours-480.jpg"
    desc = "Harar Gate, UNESCO walled city, eastern Ethiopia"
  },
  # 2. Awash National Park — oryx
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Awash_NP_Oryx.jpg/1280px-Awash_NP_Oryx.jpg"
    name = "Awash-National-Park-Oryx-Ethiopia-Tours-480.jpg"
    desc = "Beisa oryx at Awash National Park, Ethiopia"
  },
  # 3. Lake Hawassa fish market
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Awasa_fish_market.jpg/1280px-Awasa_fish_market.jpg"
    name = "Lake-Hawassa-Fish-Market-Ethiopia-Tours-480.jpg"
    desc = "Hawassa fish market at dawn, pelicans and fishermen, Ethiopia"
  },
  # 4. Lake Hawassa lake view
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Hawassa_lake%2C_Ethiopia.jpg/1280px-Hawassa_lake%2C_Ethiopia.jpg"
    name = "Rift-Valley-Lake-Hawassa-Ethiopia-Tours-480.jpg"
    desc = "Lake Hawassa, Ethiopian Rift Valley"
  },
  # 5. Debre Libanos monastery
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Debre_Libanos_Monastery_Ethiopia_Oct19_D72_12186.jpg/1280px-Debre_Libanos_Monastery_Ethiopia_Oct19_D72_12186.jpg"
    name = "Debre-Libanos-Monastery-Ethiopia-Tours-480.jpg"
    desc = "Debre Libanos monastery, 13th century, north of Addis Ababa"
  },
  # 6. Blue Nile Gorge (near Debre Libanos / Portuguese Bridge)
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Blue_Nile_Gorge_Waterfall_view_Oromia_Ethiopia_Oct19_D72_12340.jpg/1280px-Blue_Nile_Gorge_Waterfall_view_Oromia_Ethiopia_Oct19_D72_12340.jpg"
    name = "Blue-Nile-Gorge-Portuguese-Bridge-Ethiopia-Tours-480.jpg"
    desc = "Blue Nile Gorge below Portuguese Bridge, near Debre Libanos, Ethiopia"
  },
  # 7. Tiya UNESCO stelae
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tiya_stele.jpg/960px-Tiya_stele.jpg"
    name = "Tiya-Stelae-UNESCO-Ethiopia-Tours-480.jpg"
    desc = "Tiya UNESCO stelae field, 14th-century carved standing stones, south Ethiopia"
  },
  # 8. Konso stone terraces
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Konso.jpg/1280px-Konso.jpg"
    name = "Konso-Stone-Terraces-Ethiopia-Tours-480.jpg"
    desc = "Konso stone terraces and fortified village, UNESCO World Heritage, southern Ethiopia"
  },
  # 9. Dorze bamboo beehive house
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Dorze_Beehive_House_%2811483949906%29.jpg/1280px-Dorze_Beehive_House_%2811483949906%29.jpg"
    name = "Dorze-Bamboo-Village-Arba-Minch-Ethiopia-Tours-480.jpg"
    desc = "Dorze beehive bamboo house, above Arba Minch, southern Ethiopia"
  },
  # 10. Ethiopian coffee ceremony
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Ethiopian_coffee_ceremony.jpg/1280px-Ethiopian_coffee_ceremony.jpg"
    name = "Addis-Ababa-Coffee-Ceremony-Ethiopia-Tours-480.jpg"
    desc = "Ethiopian coffee ceremony, clay pot and cups, Addis Ababa"
  },
  # 11. Ethiopian wolf — Bale Mountains Sanetti Plateau
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Canis_simensis_Bale_Mountains_National_Park_5.jpg/1280px-Canis_simensis_Bale_Mountains_National_Park_5.jpg"
    name = "Ethiopian-Wolf-Bale-Mountains-Sanetti-Plateau-480.jpg"
    desc = "Ethiopian wolf on Sanetti Plateau, Bale Mountains National Park"
  },
  # 12. Ethiopian wolf close-up — Sanetti Plateau
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Ethiopian_wolf_%28Canis_simensis_citernii%29.jpg/1280px-Ethiopian_wolf_%28Canis_simensis_citernii%29.jpg"
    name = "Ethiopian-Wolf-Canis-Simensis-Bale-480.jpg"
    desc = "Ethiopian wolf, Canis simensis citernii, Bale Mountains"
  },
  # 13. Sof Omar cave — underground river
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Underground_River%2C_Sof_Omer_Cave%2C_Ethiopia_%2811562528124%29.jpg/1280px-Underground_River%2C_Sof_Omer_Cave%2C_Ethiopia_%2811562528124%29.jpg"
    name = "Sof-Omar-Cave-Underground-River-Ethiopia-Tours-480.jpg"
    desc = "Sof Omar cave underground river, Weyib River, Bale region, Ethiopia"
  },
  # 14. Sof Omar cave entrance
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sof_Omar_Cave%2C_Ethiopia_%2810116690765%29.jpg/1280px-Sof_Omar_Cave%2C_Ethiopia_%2810116690765%29.jpg"
    name = "Sof-Omar-Cave-Ethiopia-Tours-480.jpg"
    desc = "Sof Omar cave entrance, largest cave in Ethiopia"
  },
  # 15. Lake Ziway — birds
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Egyptian_Goose_%28Alopochen_aegyptiaca%29%2C_Lake_Ziway%2C_Ethiopia.jpg/1280px-Egyptian_Goose_%28Alopochen_aegyptiaca%29%2C_Lake_Ziway%2C_Ethiopia.jpg"
    name = "Lake-Ziway-Birds-Ethiopia-Rift-Valley-Tours-480.jpg"
    desc = "Egyptian Goose at Lake Ziway, Ethiopian Rift Valley"
  },
  # 16. Harar town with city wall (wider view)
  @{
    url  = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Town_of_Harar_with_Citywall.jpg/1280px-Town_of_Harar_with_Citywall.jpg"
    name = "Harar-City-Wall-Historic-Ethiopia-Tours-480.jpg"
    desc = "Harar walled city with Jugol wall, UNESCO, eastern Ethiopia"
  }
)

$total = $images.Count
$i = 0

foreach ($img in $images) {
  $i++
  $outPath = Join-Path $dest $img.name
  if (Test-Path $outPath) {
    Write-Host "[$i/$total] SKIP (exists): $($img.name)"
    continue
  }
  Write-Host "[$i/$total] Downloading: $($img.name)"
  try {
    Invoke-WebRequest `
      -Uri $img.url `
      -OutFile $outPath `
      -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" `
      -Headers @{ "Referer" = "https://commons.wikimedia.org/" } `
      -TimeoutSec 30
    $size = (Get-Item $outPath).Length / 1KB
    Write-Host "  OK - $([math]::Round($size, 0)) KB  - $($img.desc)"
  } catch {
    Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if (Test-Path $outPath) { Remove-Item $outPath }
  }
  Start-Sleep -Milliseconds 500
}
Write-Host ""
Write-Host "Done. Check public\media\tours\ for downloaded files."
Write-Host "All images are from Wikimedia Commons. Licenses: CC-BY 2.0, CC-BY-SA 3.0/4.0."
Write-Host "Attribution required - see docs/credits.md for the list."
