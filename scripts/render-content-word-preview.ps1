$ErrorActionPreference = 'Stop'
$taskRoot = (Resolve-Path -LiteralPath '.').Path
$inputDocument = Join-Path $taskRoot 'tmp/content-guides-qa/blank-template.docx'
$outputPdf = Join-Path $taskRoot 'tmp/content-guides-qa/blank-template-word.pdf'
$wordApplication = $null
$wordDocument = $null
try {
  $wordApplication = New-Object -ComObject Word.Application
  $wordApplication.Visible = $false
  $wordApplication.DisplayAlerts = 0
  $wordApplication.AutomationSecurity = 3
  $wordDocument = $wordApplication.Documents.Open($inputDocument, $false, $true)
  $wordDocument.ExportAsFixedFormat($outputPdf, 17)
  Write-Output 'WORD_PREVIEW_EXPORTED'
} finally {
  if ($null -ne $wordDocument) { $wordDocument.Close(0); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($wordDocument) }
  if ($null -ne $wordApplication) { $wordApplication.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($wordApplication) }
}
