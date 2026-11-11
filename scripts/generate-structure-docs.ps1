<#
.SYNOPSIS
Generates structure maps for the Sterinova backend and frontend repositories.

.DESCRIPTION
From the backend repository root, run:
  powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\generate-structure-docs.ps1

The frontend repository must be a sibling directory named SterinovaFrontend.
#>

$ErrorActionPreference = 'Stop'
$branch = [string][char]0x251C + [string][char]0x2500 + [string][char]0x2500 + ' '
$lastBranch = [string][char]0x2514 + [string][char]0x2500 + [string][char]0x2500 + ' '
$vertical = [string][char]0x2502
$rootWord = 'ra' + [char]0x00ED + 'z'
$generationWord = 'generaci' + [char]0x00F3 + 'n'

$backendRoot = Split-Path -Parent $PSScriptRoot
$frontendRoot = Join-Path (Split-Path -Parent $backendRoot) 'SterinovaFrontend'

$repositories = @(
    [PSCustomObject]@{
        Name = 'Sterinova-Backend'
        Root = $backendRoot
        Document = 'docs\ESTRUCTURA_BACKEND.md'
    },
    [PSCustomObject]@{
        Name = 'SterinovaFrontend'
        Root = $frontendRoot
        Document = 'docs\ESTRUCTURA_FRONTEND.md'
    }
)

foreach ($repository in $repositories) {
    if (-not (Test-Path -LiteralPath $repository.Root -PathType Container)) {
        throw "Repository directory does not exist: $($repository.Root)"
    }
}

$excludedDirectoryNames = @(
    'node_modules', '.next', '.nuxt', '.output', '.turbo', '.cache', '.git',
    '__pycache__', '.pytest_cache', '.mypy_cache', '.ruff_cache'
)
$excludedRootDirectoryNames = @(
    'dist', 'build', 'out', 'coverage', '.vercel', '.netlify', '.temp',
    '.tmp', 'tmp', 'temp', 'playwright-report', 'test-results'
)
$excludedDirectoryRelativePaths = @('storage\backups')
$excludedFileExtensions = @(
    '.log', '.tsbuildinfo', '.tmp', '.temp', '.swp', '.swo', '.bak', '.orig',
    '.cache', '.pyc', '.pyo', '.exe', '.dll', '.so', '.dylib', '.pdb',
    '.obj', '.o', '.a', '.lib', '.class', '.wasm', '.bin', '.zip', '.rar',
    '.7z', '.tar', '.gz', '.pem', '.key', '.p12', '.pfx', '.jks',
    '.keystore', '.ppk', '.crt', '.cer', '.der', '.asc', '.gpg'
)
$systemFileNames = @('.DS_Store', 'Thumbs.db', 'desktop.ini', 'ehthumbs.db')
$rootGeneratedFileNames = @(
    'backend-test-true.txt', 'pdf-render-result.txt', 'rendered-test.pdf',
    'vitest-single.txt', 'frontend-build.txt', 'next-env.d.ts'
)
$safeEnvironmentFileNames = @('.env.example', '.env.sample', '.env.template')

function Test-IncludedFile {
    param([System.IO.FileInfo]$File)

    if (($File.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
        return $false
    }

    if ($excludedFileExtensions -contains $File.Extension) {
        return $false
    }

    if ($systemFileNames -contains $File.Name -or $File.Name.StartsWith('~$')) {
        return $false
    }

    if ($File.DirectoryName -ieq $script:currentRepositoryRoot -and
        $rootGeneratedFileNames -contains $File.Name) {
        return $false
    }

    if ($File.Name -match '^\.env($|\.)' -and $safeEnvironmentFileNames -notcontains $File.Name) {
        return $false
    }

    if ($File.Name -match '^(id_rsa|id_ed25519)(\.pub)?$') {
        return $false
    }

    if ($File.Name -match '(?i)(credentials?|secrets?|passwords?|service[-_]?account)' -and
        $File.Extension -match '^\.(json|ya?ml|toml|ini|conf|config|txt|env)$') {
        return $false
    }

    return $true
}

function Get-IncludedChildren {
    param([string]$Directory)

    $children = @(Get-ChildItem -LiteralPath $Directory -Force)
    $included = @(
        foreach ($child in $children) {
            if (($child.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
                continue
            }

            if ($child.PSIsContainer) {
                if ($excludedDirectoryNames -contains $child.Name) {
                    continue
                }
                if ($Directory -ieq $script:currentRepositoryRoot -and
                    $excludedRootDirectoryNames -contains $child.Name) {
                    continue
                }
                if ($excludedDirectoryRelativePaths -contains $child.FullName.Substring($script:currentRepositoryRoot.Length).TrimStart([char]'\', [char]'/')) {
                    continue
                }
                $child
            }
            elseif (Test-IncludedFile -File $child) {
                $child
            }
        }
    )

    return @($included | Sort-Object `
        @{ Expression = { if ($_.PSIsContainer) { 0 } else { 1 } } }, `
        @{ Expression = { $_.Name.ToLowerInvariant() } }, `
        @{ Expression = { $_.Name } })
}

function Add-TreeChildren {
    param(
        [string]$Directory,
        [string]$Prefix,
        [System.Collections.Generic.List[string]]$Lines
    )

    $children = @(Get-IncludedChildren -Directory $Directory)
    for ($index = 0; $index -lt $children.Count; $index++) {
        $child = $children[$index]
        $isLast = $index -eq ($children.Count - 1)
        $connector = if ($isLast) { $lastBranch } else { $branch }
        $displayName = $child.Name

        if ($child.PSIsContainer) {
            $script:folderCount++
            $displayName += '/'
        }
        else {
            $script:fileCount++
        }

        [void]$Lines.Add("$Prefix$connector$displayName")

        if ($child.PSIsContainer) {
            $nextPrefix = if ($isLast) { "$Prefix    " } else { $Prefix + $vertical + '   ' }
            Add-TreeChildren -Directory $child.FullName -Prefix $nextPrefix -Lines $Lines
        }
    }
}

$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
foreach ($repository in $repositories) {
    $documentPath = Join-Path $repository.Root $repository.Document
    $documentDirectory = Split-Path -Parent $documentPath
    if (-not (Test-Path -LiteralPath $documentDirectory -PathType Container)) {
        New-Item -ItemType Directory -Path $documentDirectory -Force | Out-Null
    }
    if (-not (Test-Path -LiteralPath $documentPath -PathType Leaf)) {
        [System.IO.File]::WriteAllText($documentPath, '', $utf8WithoutBom)
    }

    $script:folderCount = 1
    $script:fileCount = 0
    $script:currentRepositoryRoot = $repository.Root
    $treeLines = New-Object 'System.Collections.Generic.List[string]'
    [void]$treeLines.Add("$($repository.Name)/")
    Add-TreeChildren -Directory $repository.Root -Prefix '' -Lines $treeLines

    $totalCount = $script:folderCount + $script:fileCount
    if (($treeLines.Count - 1) -ne ($totalCount - 1)) {
        throw "Tree item count does not match calculated totals for $($repository.Name)."
    }

    $date = Get-Date -Format 'yyyy-MM-dd'
    $lines = @(
        "# Estructura de $($repository.Name)"
        ''
        "- Proyecto: $($repository.Name)"
        "- Ruta ${rootWord} del repositorio: ``$($repository.Root)``"
        "- Fecha de ${generationWord}: $date"
        "- Carpetas incluidas (incluye la ${rootWord}): $script:folderCount"
        "- Archivos incluidos: $script:fileCount"
        "- Total de carpetas y archivos: $totalCount"
        ''
        '```text'
        $treeLines
        '```'
        ''
    )

    [System.IO.File]::WriteAllText($documentPath, ($lines -join "`r`n"), $utf8WithoutBom)
    Write-Output "$($repository.Name): $script:folderCount folders, $script:fileCount files -> $documentPath"
}
