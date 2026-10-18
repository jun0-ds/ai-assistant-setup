# Windows 실행파일과 PATH

사용할 에이전트 하나를 기준으로 검사해요. PowerShell에서 명령이 보이는 것, 새 PowerShell에서 실행되는 것, Paseo 데몬이 실행하는 것은 서로 다른 검사예요.

## PowerShell에서 못 찾을 때

```powershell
Get-Command claude -All
Get-Command codex -All
```

설치한 쪽만 확인하세요. `CommandType`이 Alias·Function이면 실제 파일 경로가 아니에요. `Source`나 `Path`의 파일을 확인해요. 여러 설치가 보이면 버전과 경로를 비교하고 의도한 설치를 선택해요. 오래된 설치를 바로 지우지 않아요.

네이티브 설치의 기본 후보는 아래예요. 사용자 지정 설치는 완료 메시지에 나온 위치를 먼저 확인해요. 파일이 실제로 있을 때만 사용해요.

```powershell
# Claude 네이티브 기본 후보
$claudeExe = Join-Path $env:USERPROFILE '.local\bin\claude.exe'
Test-Path -LiteralPath $claudeExe
& $claudeExe --version

# Codex 네이티브 기본 후보
$codexExe = Join-Path $env:LOCALAPPDATA 'Programs\OpenAI\Codex\bin\codex.exe'
Test-Path -LiteralPath $codexExe
& $codexExe --version
```

절대경로로 실행할 수 있으면 그 방법으로 에이전트를 먼저 열어 진단을 맡겨요. 경로에 공백이 있으면 `& 'C:\실제 경로\agent.exe'`처럼 호출 연산자와 따옴표를 써요. 폴더명이나 설치 경로를 추측해 시스템 PATH에 추가하지 않아요.

설치 직후에는 새 PowerShell을 열어요. 현재 프로세스에만 PATH를 추가한 것으로 완료 처리하지 않아요. 실제 파일이 있는 폴더가 사용자 PATH에 빠졌다면 에이전트가 기존 값을 읽고 필요한 폴더 하나만 추가하는 변경을 제안해요. 관리자 PATH나 전체 PATH를 덮지 않아요. 변경 뒤 새 창에서 `Get-Command`와 `--version`을 다시 확인해요.

npm으로 설치한 경우 `codex.ps1`·`claude.ps1`·`.cmd` shim이 보일 수 있어요. `.ps1` 실행 정책 오류와 PATH 누락은 다른 문제예요. 에이전트에게 정확한 오류를 보내고, 정책을 전역 완화하거나 Node 폴더를 임의로 지우지 않아요. 가능한 경우 공식 네이티브 설치의 실제 `.exe`로 연결해요.

## Paseo에서만 못 찾을 때

Paseo의 Settings → 해당 host → Providers → 제공자 → Diagnostic에서 아래를 봐요.

| 항목 | 볼 것 |
|---|---|
| Resolved path | PowerShell에서 확인한 파일과 같은지 |
| Daemon PATH | 실행파일이 있는 폴더가 포함되는지 |
| Version | 파일을 실제로 실행할 수 있는지 |

CLI가 있다면 해당 호스트를 명시해 같은 진단을 받을 수 있어요. 데스크톱 앱만 설치했다면 GUI 진단을 사용해도 돼요.

```powershell
paseo --host 127.0.0.1:6767 provider diagnostic codex --json
```

실제 포트·제공자로 바꾸세요. PowerShell에서 되더라도 이미 실행 중인 Windows 앱은 이전 환경을 가지고 있을 수 있어요. 시작 환경이 바뀌었으면 작업 상태를 저장하고 필요한 앱/데몬만 다시 실행한 뒤 실제 답변까지 재확인해요.

PATH 대신 공식 provider `command` 설정에 검증한 절대경로를 지정할 수도 있어요. 기존 `agents.providers` 객체에 해당 제공자의 키만 병합해요. `command`는 실행파일과 인자 배열이며, 단순 셸 별칭·함수를 넣지 않아요. npm shim은 데몬의 실제 실행 결과로 검증해요. 계정별 env와 플러그인 설정을 지우지 않아요.

설정 저장 후 reload 결과를 읽고 실제 적용 여부를 확인해요. 새 CLI 실행·Paseo provider diagnostic·Paseo 실제 응답 세 가지가 끝나야 경로 문제를 통과로 적어요.

[가이드 진단 단계](../stages/01-diagnose/CONTEXT.md) · [Paseo 공식 문제 해결](https://paseo.sh/docs/troubleshooting) · [공식 자료와 확인일](sources.md)
