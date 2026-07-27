$ErrorActionPreference = "Stop"

$workspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$pluginSource = Join-Path $workspaceRoot "wordpress-plugin\workcv-uk-career-tools"
$extensionSource = Join-Path $workspaceRoot "chrome-extension\workcv-job-keyword-highlighter"
$downloadDirectory = Join-Path $workspaceRoot "public\downloads"
$extensionDist = Join-Path $workspaceRoot "chrome-extension\dist"
$systemTempRoot = [System.IO.Path]::GetTempPath()
$stageRoot = Join-Path $systemTempRoot "workcv-distribution-package"
$extensionStage = Join-Path $stageRoot "workcv-job-keyword-highlighter"

if (-not $stageRoot.StartsWith($systemTempRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Package staging path resolved outside the temporary directory."
}

New-Item -ItemType Directory -Force -Path $downloadDirectory, $extensionDist | Out-Null

node (Join-Path $PSScriptRoot "generate-extension-icons.mjs")

Compress-Archive `
    -LiteralPath $pluginSource `
    -DestinationPath (Join-Path $downloadDirectory "workcv-uk-career-tools.zip") `
    -CompressionLevel Optimal `
    -Force

if (Test-Path -LiteralPath $stageRoot) {
    Remove-Item -LiteralPath $stageRoot -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $extensionStage | Out-Null

$runtimeFiles = @(
    "manifest.json",
    "shared.js",
    "content.js",
    "highlighter.css",
    "popup.html",
    "popup.css",
    "popup.js"
)

foreach ($file in $runtimeFiles) {
    Copy-Item -LiteralPath (Join-Path $extensionSource $file) -Destination $extensionStage
}
Copy-Item -LiteralPath (Join-Path $extensionSource "icons") -Destination $extensionStage -Recurse

Compress-Archive `
    -Path (Join-Path $extensionStage "*") `
    -DestinationPath (Join-Path $extensionDist "workcv-job-keyword-highlighter.zip") `
    -CompressionLevel Optimal `
    -Force

Remove-Item -LiteralPath $stageRoot -Recurse -Force

Write-Output "Created public/downloads/workcv-uk-career-tools.zip"
Write-Output "Created chrome-extension/dist/workcv-job-keyword-highlighter.zip"
