# Windows 실행 파일과 PATH

사용할 에이전트 하나를 기준으로 검사합니다. PowerShell에서 명령이 보이는지, 새 PowerShell에서 실행되는지, Paseo 데몬이 실행할 수 있는지는 서로 다른 검사입니다.

## PowerShell에서 못 찾을 때

```powershell
Get-Command claude -All
Get-Command codex -All
```

설치한 쪽만 확인합니다. `CommandType`이 Alias나 Function이면 실제 파일 경로가 아니므로 `Source`나 `Path`에 나온 파일을 확인합니다. 설치가 여러 개 보이면 버전과 경로를 비교해 의도한 설치를 고릅니다. 오래된 설치를 바로 지우지는 않습니다.

네이티브 설치의 기본 위치는 아래와 같습니다. 사용자가 위치를 지정해 설치했다면 완료 메시지에 나온 위치를 먼저 확인합니다. WinGet·npm 등 다른 방식으로 설치했다면 아래 후보 대신 새 PowerShell의 `Get-Command`가 가리키는 파일을 씁니다. 파일이 실제로 있을 때만 사용합니다.

```powershell
# Claude 네이티브 기본 위치
$claudeExe = Join-Path $env:USERPROFILE '.local\bin\claude.exe'
Test-Path -LiteralPath $claudeExe
& $claudeExe --version

# Codex 네이티브 기본 위치
$codexExe = Join-Path $env:LOCALAPPDATA 'Programs\OpenAI\Codex\bin\codex.exe'
Test-Path -LiteralPath $codexExe
& $codexExe --version
```

절대경로로 실행할 수 있으면 그 방법으로 에이전트를 먼저 열어 진단을 맡깁니다. 경로에 공백이 있으면 `& 'C:\실제 경로\agent.exe'`처럼 호출 연산자와 따옴표를 씁니다. 폴더 이름이나 설치 경로를 추측해 시스템 PATH에 넣지 않습니다.

Claude와 Codex 모두 설치 직후 명령을 찾지 못할 수 있습니다. Claude 네이티브 설치기는 PATH를 직접 바꾸지 않고 `Setup notes`로 안내만 합니다. Codex 설치기는 사용자 PATH에 실행 위치를 추가하지만, 공식 명령이 별도 PowerShell에서 돌기 때문에 설치한 창에는 반영되지 않습니다. 그래서 [최초 설치](../guides/first-agent.md)에서는 두 에이전트 모두 설치 직후 PATH 등록 명령을 실행하게 합니다. 이 명령은 사용자 PATH에 폴더가 없을 때만 추가합니다.

이미 열린 창은 처음 시작할 때의 환경을 계속 씁니다. Windows Terminal 1.18 이상은 새 탭이 환경을 다시 읽는 것이 기본값이지만, 이전 버전이거나 이 설정을 끈 경우는 다릅니다. 그래서 창을 모두 닫고 새로 여는 방법을 기본으로 안내합니다. 현재 프로세스에만 PATH를 추가하고 완료로 처리하지 않습니다. 실제 파일이 있는 폴더가 사용자 PATH에 빠져 있으면 [최초 설치의 PATH 등록 명령](../guides/first-agent.md#실행-명령을-못-찾을-때)으로 그 폴더 하나만 추가합니다. 관리자 PATH나 PATH 전체를 덮어쓰지 않습니다. 변경한 뒤에는 새 창에서 `Get-Command`와 `--version`을 다시 확인합니다.

npm으로 설치했다면 `codex.ps1`·`claude.ps1`·`.cmd` shim이 보일 수 있습니다. `.ps1` 실행 정책 오류와 PATH 누락은 서로 다른 문제입니다. 에이전트에게 정확한 오류를 보내고, 실행 정책을 전역으로 완화하거나 Node 폴더를 임의로 지우지 않습니다. 가능하면 공식 네이티브 설치의 실제 `.exe`로 연결합니다.

## Paseo에서만 못 찾을 때

Paseo의 Settings → 해당 host → Providers → 제공자 → Diagnostic에서 아래 항목을 봅니다.

| 항목 | 볼 것 |
|---|---|
| Resolved path | PowerShell에서 확인한 파일과 같은지 |
| Daemon PATH | 실행 파일이 있는 폴더가 들어 있는지 |
| Version | 파일이 실제로 실행되는지 |

CLI가 있다면 호스트를 지정해 같은 진단을 받을 수 있습니다. 데스크톱 앱만 설치했다면 앱 화면의 진단을 써도 됩니다.

```powershell
paseo --host 127.0.0.1:6767 provider diagnostic codex --json
```

포트와 제공자는 실제 값으로 바꿉니다. PowerShell에서는 되더라도 이미 실행 중인 Windows 앱은 이전 환경을 그대로 갖고 있을 수 있습니다. 시작 환경이 바뀌었다면 작업 상태를 저장하고 필요한 앱·데몬만 다시 실행한 뒤 실제 답변까지 다시 확인합니다.

PATH 대신 공식 provider `command` 설정에 검증한 절대경로를 지정해도 됩니다. 기존 `agents.providers` 객체에 해당 제공자의 키만 병합합니다. `command`는 실행 파일과 인자로 이루어진 배열이며, 셸 별칭이나 함수를 넣지 않습니다. npm shim은 데몬에서 실제로 실행되는지로 검증합니다. 계정별 env와 플러그인 설정은 지우지 않습니다.

설정을 저장한 뒤에는 reload 결과를 읽어 실제로 적용됐는지 확인합니다. 새 창에서의 CLI 실행, Paseo provider 진단, Paseo 실제 응답 세 가지가 모두 끝나야 경로 문제를 통과로 적습니다.

[가이드 진단 단계](../stages/01-diagnose/CONTEXT.md) · [Paseo 공식 문제 해결](https://paseo.sh/docs/troubleshooting) · [공식 자료와 확인일](sources.md)
