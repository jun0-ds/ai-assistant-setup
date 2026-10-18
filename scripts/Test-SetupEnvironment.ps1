# Read-only Windows agent discovery. No auth/config contents are read.
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('claude', 'codex')]
    [string]$Agent,
    [string]$AgentPath,
    [string]$HostName = '127.0.0.1',
    [ValidateRange(1, 65535)][int]$Port = 6767,
    [switch]$ProbePaseo,
    [string]$ReportPath
)
$ErrorActionPreference = 'Stop'

function Invoke-VersionProbe {
    param([string]$Binary)
    $job = Start-Job -ScriptBlock {
        param($path)
        try {
            $output = & $path --version 2>&1
            [pscustomobject]@{ ExitCode = $LASTEXITCODE; Text = ($output | Out-String).Trim() }
        } catch {
            [pscustomobject]@{ ExitCode = -1; Text = $_.Exception.Message }
        }
    } -ArgumentList $Binary
    try {
        $completed = Wait-Job -Job $job -Timeout 10
        if ($null -eq $completed) {
            Stop-Job -Job $job
            return [pscustomobject]@{ Status = 'timeout'; ExitCode = $null; Version = $null }
        }
        $result = Receive-Job -Job $job
        $last = @($result)[-1]
        $status = if ($last.ExitCode -eq 0 -and $last.Text) { 'passed' } else { 'failed' }
        return [pscustomobject]@{ Status = $status; ExitCode = $last.ExitCode; Version = $last.Text }
    } finally {
        Remove-Job -Job $job -Force
    }
}

$commands = @(Get-Command $Agent -All -ErrorAction SilentlyContinue | ForEach-Object {
    [pscustomobject]@{ Type = $_.CommandType.ToString(); Path = $_.Path; Name = $_.Name }
})
$candidates = @()
if ($Agent -eq 'claude' -and $env:USERPROFILE) {
    $candidates += Join-Path $env:USERPROFILE '.local\bin\claude.exe'
}
if ($Agent -eq 'codex' -and $env:LOCALAPPDATA) {
    $candidates += Join-Path $env:LOCALAPPDATA 'Programs\OpenAI\Codex\bin\codex.exe'
}
$candidates = @($candidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf })
$selected = $null
if ($AgentPath) {
    if (-not [IO.Path]::IsPathRooted($AgentPath)) { throw 'AgentPath must be an absolute file path.' }
    if (-not (Test-Path -LiteralPath $AgentPath -PathType Leaf)) { throw 'AgentPath does not exist.' }
    $selected = (Resolve-Path -LiteralPath $AgentPath).Path
} else {
    $applications = @($commands | Where-Object { $_.Type -eq 'Application' -or $_.Type -eq 'ExternalScript' })
    if ($applications.Count -gt 0) { $selected = $applications[0].Path }
}
$version = if ($selected) { Invoke-VersionProbe -Binary $selected } else {
    [pscustomobject]@{ Status = 'missing'; ExitCode = $null; Version = $null }
}
$paseo = [pscustomobject]@{ Status = 'not-requested'; Host = $HostName; Port = $Port }
if ($ProbePaseo) {
    $client = New-Object Net.Sockets.TcpClient
    try {
        $attempt = $client.BeginConnect($HostName, $Port, $null, $null)
        if (-not $attempt.AsyncWaitHandle.WaitOne(2000)) { throw 'TCP connection timeout' }
        $client.EndConnect($attempt)
        $paseo.Status = 'tcp-open-only'
    } catch {
        $paseo.Status = 'unreachable'
    } finally {
        $client.Dispose()
    }
}
$machinePath = [Environment]::GetEnvironmentVariable('Path', 'Machine')
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
$expectedPath = @($machinePath, $userPath) -join ';'
$evidence = [ordered]@{
    SchemaVersion = 1
    Agent = $Agent
    PowerShellVersion = $PSVersionTable.PSVersion.ToString()
    OperatingSystem = [Environment]::OSVersion.VersionString
    Commands = $commands
    SelectedPath = $selected
    InstalledCandidates = $candidates
    VersionProbe = $version
    ProcessPathDiffersFromPersistentPath = ($env:Path -ne $expectedPath)
    PaseoTransport = $paseo
    PaseoProvider = 'unverified: use the affected daemon provider diagnostic'
    AuthenticationAndReply = 'unverified: confirm interactive sign-in and a real response'
    FreshPowerShell = 'run this script in a newly opened PowerShell; current process alone does not prove PATH persistence'
}
$json = $evidence | ConvertTo-Json -Depth 7
if ($ReportPath) {
    $parent = Split-Path -Parent $ReportPath
    if ($parent -and -not (Test-Path -LiteralPath $parent -PathType Container)) {
        throw 'ReportPath parent must already exist in your local state folder.'
    }
    [IO.File]::WriteAllText($ReportPath, $json, (New-Object Text.UTF8Encoding($false)))
}
$json
if ($version.Status -ne 'passed') { exit 1 }
