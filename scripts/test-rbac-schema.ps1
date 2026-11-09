param(
  [Parameter(Mandatory = $true)]
  [string]$MariaDbBin,
  [string]$BackupFile,
  [switch]$RunApplicationE2E
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$binDirectory = (Resolve-Path -LiteralPath $MariaDbBin).Path
$baseDirectory = Split-Path -Parent $binDirectory
foreach ($binary in @('mysql_install_db.exe', 'mysqld.exe', 'mysqladmin.exe')) {
  if (-not (Test-Path -LiteralPath (Join-Path $binDirectory $binary) -PathType Leaf)) {
    throw "Falta $binary en el directorio indicado."
  }
}

$testRoot = Join-Path $repositoryRoot ('tmp\rbac-mariadb-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $testRoot | Out-Null
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
$listener.Start()
$testPort = $listener.LocalEndpoint.Port
$listener.Stop()
$testPassword = [guid]::NewGuid().ToString('N')
$testServer = $null
$verificationExit = 1
$previousEnvironment = @{}
foreach ($key in @('RBAC_TEST_DISPOSABLE_SERVER', 'RBAC_TEST_PORT', 'RBAC_TEST_PASSWORD', 'RBAC_TEST_BACKUP_PATH', 'RBAC_TEST_MYSQL_BINARY')) {
  $previousEnvironment[$key] = [Environment]::GetEnvironmentVariable($key, 'Process')
}

Push-Location -LiteralPath $repositoryRoot
try {
  & (Join-Path $binDirectory 'mysql_install_db.exe') "--datadir=$testRoot" "--password=$testPassword" "--port=$testPort" --silent 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Falló la inicialización de la instancia temporal; no se usó el datadir de trabajo.' }
  $testServer = Start-Process -FilePath (Join-Path $binDirectory 'mysqld.exe') -ArgumentList @(
    '--no-defaults', "--basedir=`"$baseDirectory`"", "--datadir=`"$testRoot`"",
    "--port=$testPort", '--bind-address=127.0.0.1', '--skip-name-resolve',
    "--pid-file=`"$testRoot\server.pid`"", "--log-error=`"$testRoot\server.log`"",
    '--innodb-buffer-pool-size=32M'
  ) -WindowStyle Hidden -RedirectStandardOutput "$testRoot\stdout.log" -RedirectStandardError "$testRoot\stderr.log" -PassThru

  $ready = $false
  for ($attempt = 0; $attempt -lt 50; $attempt++) {
    if ($testServer.HasExited) { throw 'La instancia temporal terminó durante el arranque.' }
    & (Join-Path $binDirectory 'mysqladmin.exe') --no-defaults --protocol=tcp --host=127.0.0.1 "--port=$testPort" --user=root "--password=$testPassword" ping --silent 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { $ready = $true; break }
    Start-Sleep -Milliseconds 200
  }
  if (-not $ready) { throw 'La instancia temporal no estuvo disponible a tiempo.' }

  $env:RBAC_TEST_DISPOSABLE_SERVER = '1'
  $env:RBAC_TEST_PORT = [string]$testPort
  $env:RBAC_TEST_PASSWORD = $testPassword
  $env:RBAC_TEST_MYSQL_BINARY = Join-Path $binDirectory 'mysql.exe'
  $env:RBAC_TEST_BACKUP_PATH = if ($BackupFile) { (Resolve-Path -LiteralPath $BackupFile).Path } else { $null }
  Write-Output "MariaDB temporal aislada en 127.0.0.1:$testPort; datadir exclusivo bajo tmp/."
  node node_modules/vitest/vitest.mjs run --config ./vitest.config.rbac.ts
  $verificationExit = $LASTEXITCODE
  if ($verificationExit -eq 0 -and $RunApplicationE2E) {
    node scripts/run-isolated-app-e2e.mjs
    $verificationExit = $LASTEXITCODE
  }
} finally {
  try {
    if ($testServer -and -not $testServer.HasExited) {
      & (Join-Path $binDirectory 'mysqladmin.exe') --no-defaults --protocol=tcp --host=127.0.0.1 "--port=$testPort" --user=root "--password=$testPassword" shutdown 2>$null | Out-Null
      if (-not $testServer.WaitForExit(5000)) { Stop-Process -Id $testServer.Id }
    }
  } finally {
    try {
      if ($verificationExit -eq 0 -and $testServer -and $testServer.HasExited) {
        $absoluteTestRoot = [System.IO.Path]::GetFullPath($testRoot)
        $absoluteTempRoot = [System.IO.Path]::GetFullPath((Join-Path $repositoryRoot 'tmp'))
        $insideTempRoot = $absoluteTestRoot.StartsWith($absoluteTempRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)
        $expectedName = (Split-Path -Leaf $absoluteTestRoot) -match '^rbac-mariadb-[a-f0-9]{32}$'
        if (-not $insideTempRoot -or -not $expectedName) { throw 'Se rechaza limpiar una ruta fuera del datadir temporal esperado.' }
        Remove-Item -LiteralPath $absoluteTestRoot -Recurse -Force
      }
    } finally {
      foreach ($key in $previousEnvironment.Keys) {
        [Environment]::SetEnvironmentVariable($key, $previousEnvironment[$key], 'Process')
      }
      Pop-Location
      Write-Output 'Instancia temporal detenida; no se utilizaron DB_* ni la base de trabajo.'
    }
  }
}
exit $verificationExit
