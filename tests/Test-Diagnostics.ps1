$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$scriptPath = Join-Path $root 'scripts\Test-SetupEnvironment.ps1'
$temp = Join-Path ([IO.Path]::GetTempPath()) ('agent-setup-test-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $temp | Out-Null
try {
    $binary = Join-Path $temp 'agent with space.cmd'
    [IO.File]::WriteAllText($binary, "@echo off`r`necho fixture-agent 1.0`r`nexit /b 0`r`n")
    $report = Join-Path $temp 'report.json'
    $output = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $scriptPath -Agent codex -AgentPath $binary -ReportPath $report
    if ($LASTEXITCODE -ne 0) { throw "Expected successful version probe: $output" }
    $data = Get-Content -Raw -LiteralPath $report | ConvertFrom-Json
    if ($data.VersionProbe.Status -ne 'passed' -or $data.SelectedPath -ne $binary) { throw 'Wrong binary evidence' }
    if ($data.AuthenticationAndReply -notlike 'unverified*') { throw 'Must not claim auth verification' }
    if ($data.PaseoProvider -notlike 'unverified*') { throw 'Must not claim daemon verification' }
    $missing = Join-Path $temp 'does-not-exist.exe'
    $savedPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $scriptPath -Agent claude -AgentPath $missing 2>$null | Out-Null
    $missingExit = $LASTEXITCODE
    $ErrorActionPreference = $savedPreference
    if ($missingExit -eq 0) { throw 'Missing absolute binary must fail' }
    $failed = Join-Path $temp 'failed.cmd'
    [IO.File]::WriteAllText($failed, "@echo off`r`necho fixture failure`r`nexit /b 7`r`n")
    $output = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $scriptPath -Agent codex -AgentPath $failed
    if ($LASTEXITCODE -eq 0) { throw 'Nonzero version process must fail' }
    $data = $output | ConvertFrom-Json
    if ($data.VersionProbe.ExitCode -ne 7 -or $data.VersionProbe.Status -ne 'failed') { throw 'Process failure evidence lost' }
    Write-Output 'PASS: explicit binary, space path, failure exit, missing binary, local report, verification boundaries'
} finally {
    Remove-Item -LiteralPath $temp -Recurse -Force
}
