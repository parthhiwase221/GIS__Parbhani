$geojsonPath = "public\FINAL PARBHANI MPMS.geojson"
$outputPath = "public\qgis2web_2025_12_08-16_09_36_742787\data\mpms_lookup.js"

Write-Host "Reading GeoJSON..."
$raw = [System.IO.File]::ReadAllText((Resolve-Path $geojsonPath), [System.Text.Encoding]::UTF8)
$data = $raw | ConvertFrom-Json

$lookup = New-Object System.Collections.Generic.Dictionary[string, object]

Write-Host "Processing features..."
foreach ($feature in $data.features) {
    $propNo = $feature.properties.PROP_NO
    if ($propNo) {
        $lookup[$propNo] = $feature.properties
    }
}

Write-Host "Serializing to JSON..."
# Using Compress to keep size down and avoid line break issues
$json = $lookup | ConvertTo-Json -Depth 10 -Compress
$jsContent = "var mpms_lookup = " + $json + ";"

Write-Host "Saving to $outputPath..."
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Resolve-Path $outputPath), $jsContent, $utf8NoBom)

Write-Host "Verifying syntax..."
try {
    # Quick check if it's roughly valid by checking if it ends with };
    if ($jsContent.EndsWith("};")) {
        Write-Host "Done! File looks valid."
    }
    else {
        Write-Warning "File might be truncated or invalid!"
    }
}
catch {
    Write-Error "Verification failed."
}
