param(
  [string]$OutputPath = (Join-Path (Join-Path $PSScriptRoot '..') 'artifacts/Sterinova-Backend-source.zip')
)

$ErrorActionPreference = 'Stop'
$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$output = [System.IO.Path]::GetFullPath($OutputPath)
if (-not $output.StartsWith($root + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'El ZIP de salida debe quedar dentro del repositorio.'
}
if ([System.IO.Path]::GetExtension($output) -ne '.zip') {
  throw 'El archivo de salida debe tener extensión .zip.'
}

$rootFiles = @('.env.example', '.gitignore', 'AGENTS.md', 'README.md', 'package.json', 'package-lock.json', 'nest-cli.json', 'tsconfig.json', 'tsconfig.build.json')
function Get-PackageRelativePath([string]$path) {
  $absolute = [System.IO.Path]::GetFullPath($path)
  if (-not $absolute.StartsWith($root + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'El archivo del paquete debe quedar dentro del repositorio.'
  }
  return $absolute.Substring($root.Length + 1).Replace('\', '/')
}
$files = @($rootFiles | ForEach-Object { Join-Path $root $_ } | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf })
$files += @(Get-ChildItem -LiteralPath $root -File -Filter 'vitest.config*.ts' | Select-Object -ExpandProperty FullName)
foreach ($directory in @('src', 'test', 'scripts', 'docs')) {
  $files += @(Get-ChildItem -LiteralPath (Join-Path $root $directory) -Recurse -File | Select-Object -ExpandProperty FullName)
}
$files = $files | Where-Object {
  $relative = Get-PackageRelativePath $_
  $relative -notmatch '(^|/)(storage|node_modules|local|historico|ejemplos-formatos)/' -and
  $relative -notmatch '(^|/)\.env(\.|$)' -or $relative -eq '.env.example'
} | Where-Object {
  $_ -notmatch '\.(rar|zip)$'
} | Sort-Object -Unique

$parent = Split-Path -Parent $output
New-Item -ItemType Directory -Path $parent -Force | Out-Null
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path -LiteralPath $output) { Remove-Item -LiteralPath $output -Force }
$archive = [System.IO.Compression.ZipFile]::Open($output, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($file in $files) {
    $relative = Get-PackageRelativePath $file
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file, $relative, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally {
  $archive.Dispose()
}

$check = [System.IO.Compression.ZipFile]::OpenRead($output)
try {
  $unsafe = @($check.Entries | Where-Object { $_.FullName -match '(^|/)(\.env($|\.)|storage/|[^/]+\.(rar|zip)$)' -and $_.FullName -ne '.env.example' })
  if ($unsafe.Count) { throw 'El paquete contiene rutas excluidas; no debe compartirse.' }
  Write-Output "Paquete seguro: $output ($($check.Entries.Count) archivos)"
} finally {
  $check.Dispose()
}
