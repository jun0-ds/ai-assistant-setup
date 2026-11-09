# codex-delegate - lets Claude (director) hand coding and test runs to Codex (worker).
#
#   New task:  codex-delegate -C <absolute work folder> -PromptFile <brief.md> [-Model m] [-Effort e]
#   Follow-up: codex-delegate -Resume <session> -C <same work folder> -PromptFile <followup.md>
#
# Prints one header line (exit, session, tokens, run folder) and the Codex final report.
# The full event log stays in the run folder so it does not fill Claude's context.
# Run folder: %LOCALAPPDATA%\codex-delegate\<time>-<pid>\  (prompt.md, events.jsonl, stderr.log, last.md)
# Keep this file ASCII-only: Windows PowerShell 5.1 misreads non-ASCII in files without a BOM.
param(
  [string]$C,
  [string]$Resume,
  [string]$PromptFile,
  [string]$Model,
  [string]$Effort
)

function Fail($message) { [Console]::Error.WriteLine("codex-delegate: $message"); exit 2 }
function Quote($value) { if ($value -match '[\s"]') { '"' + ($value -replace '"', '\"') + '"' } else { $value } }

if (-not $C -and -not $Resume) { Fail 'need -C <folder> for a new task or -Resume <session> -C <folder> for a follow-up' }
if ($C -and -not (Test-Path -LiteralPath $C -PathType Container)) { Fail "folder not found: $C" }
if (-not $PromptFile -or -not (Test-Path -LiteralPath $PromptFile -PathType Leaf)) { Fail 'need -PromptFile <brief.md> that exists' }
$codex = Get-Command codex -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $codex) { Fail 'codex not found on PATH' }

$run = Join-Path $env:LOCALAPPDATA ('codex-delegate\' + (Get-Date -Format 'yyyyMMdd-HHmmss') + "-$PID")
New-Item -ItemType Directory -Force -Path $run | Out-Null
$prompt = Join-Path $run 'prompt.md'
Copy-Item -LiteralPath $PromptFile -Destination $prompt
if ((Get-Item -LiteralPath $prompt).Length -eq 0) { Fail 'empty brief' }
$events = Join-Path $run 'events.jsonl'
$stderr = Join-Path $run 'stderr.log'
$last = Join-Path $run 'last.md'

$argv = @('exec')
if ($Resume) { $argv += 'resume' }
$argv += @('--json', '-o', $last, '--skip-git-repo-check')
if ($Model) { $argv += @('-m', $Model) }
if ($Effort) { $argv += @('-c', "model_reasoning_effort=$Effort") }
if ($Resume) { $argv += $Resume } else { $argv += @('-C', $C) }
$argv += '-'

# File redirection keeps the brief and the events as raw UTF-8 bytes (no console code page conversion).
$start = @{
  FilePath = $codex.Source
  ArgumentList = (($argv | ForEach-Object { Quote $_ }) -join ' ')
  RedirectStandardInput = $prompt
  RedirectStandardOutput = $events
  RedirectStandardError = $stderr
  NoNewWindow = $true
  Wait = $true
  PassThru = $true
}
if ($C) { $start.WorkingDirectory = $C }
$process = Start-Process @start
$rc = $process.ExitCode

$session = $Resume
$usage = ''
foreach ($line in [IO.File]::ReadAllLines($events)) {
  try { $event = $line | ConvertFrom-Json } catch { continue }
  if ($event.type -eq 'thread.started' -and $event.thread_id) { $session = $event.thread_id }
  if ($event.type -eq 'turn.completed' -and $event.usage) {
    $usage = "in=$($event.usage.input_tokens) cached=$($event.usage.cached_input_tokens) out=$($event.usage.output_tokens)"
  }
}
if (-not $session) { $session = '?' }

Write-Output "[codex-delegate] exit=$rc session=$session $usage run=$run"
if ((Test-Path -LiteralPath $last) -and (Get-Item -LiteralPath $last).Length -gt 0) {
  Write-Output ([IO.File]::ReadAllText($last))
} else {
  Write-Output '(no final report - last 20 lines of stderr follow)'
  Get-Content -LiteralPath $stderr -Tail 20 -Encoding UTF8
}
exit $rc
