# 3. 컴퓨터 상태 확인

## 입력

| 자료 | 범위 | 이유 |
|---|---|---|
| [Windows 경로](../../references/windows-paths.md) | 현재 증상 | 실제 바이너리와 실행 환경 구분 |
| `state/setup-status.md` | 있다면 전체 | 기존 상태부터 재개 |
| [진단 스크립트](../../scripts/Test-SetupEnvironment.ps1) | 실행 전 전체 | 검사 범위와 출력 확인 |

## 진행

1. 가장 먼저 권한 설정을 확인합니다. Claude는 `~/.claude/settings.json`의 `permissions.defaultMode`, Codex는 `~/.codex/config.toml`의 `approval_policy`·`sandbox_mode`를 읽습니다. 첫 요청대로 설치용 권한이 아니면 기존 파일을 백업하고 해당 키만 바꿉니다. Claude는 `permissions.defaultMode = "bypassPermissions"`와 최상위 `skipDangerousModePermissionPrompt = true`, Codex는 맨 앞에 `approval_policy = 'never'`·`sandbox_mode = 'danger-full-access'`입니다. Codex에 `default_permissions` 등 다른 권한 설정이 이미 있으면 덮지 말고 무엇이 있는지 설명한 뒤 정합니다. 확인 창이 뜨면 무엇을 바꾸는지 한 문장으로 먼저 알리고 허용을 고르라고 안내합니다. 바꾼 뒤에는 상태를 저장하고, [첫 요청 안내](../../prompts/start.md#처음-한-번-허용하고-다시-시작하기)대로 다시 시작하는 방법을 알려 줍니다. 바꾸지 못하면 [직접 설정 명령](../../guides/first-agent.md#권한을-직접-설정하려면)을 안내합니다.
2. Windows 네이티브인지 WSL인지 확인합니다. Windows용 안내를 WSL 셸에서 실행하지 않습니다.
3. 준비 폴더를 C 드라이브 바로 아래의 `C:\AgentSetup`에 만들고, 그 안을 소스용 `source/`와 기록용 `state/`로 나눕니다. 사용자가 정한 위치나 기존 준비 폴더가 있으면 그대로 씁니다. 상태는 공개 Git에 올리지 않습니다.
4. 선택한 에이전트만 `Get-Command <agent> -All`, 실제 파일 존재, `--version`으로 검사합니다. 별칭·함수·npm shim을 실제 실행 파일과 구분합니다.
5. `powershell -NoProfile -File <source>/scripts/Test-SetupEnvironment.ps1 -Agent codex`처럼 진단합니다. Claude라면 `-Agent claude`를 씁니다. 아무것도 바꾸지 않는 진단이며 결과는 로컬에만 저장합니다.
6. 사용자 PATH에 실행 파일 폴더가 없으면 [최초 설치의 PATH 등록 명령](../../guides/first-agent.md#실행-명령을-못-찾을-때)으로 추가하고 새 PowerShell에서 다시 확인합니다. 이 결과만으로 Paseo 데몬도 인식한다고 적지 않습니다.
7. 실제 응답을 받아 보고, 사용자가 의도한 계정으로 로그인했는지 확인합니다. 인증 파일 내용이나 토큰은 출력하지 않습니다.
8. 기존 Paseo·Tailscale·문턱의 위치·버전·구동 방식을 확인합니다. 재설치나 초기화부터 하지 않습니다.
9. 다른 에이전트가 이미 설치돼 있는지 확인하고, 사용자가 말하지 않았다면 Claude와 ChatGPT 계정이 둘 다 있는지 한 번 묻습니다. 둘 다 있으면 5단계에서 [Claude·Codex 함께 쓰기](../../references/claude-codex.md)를 적용한다고 기록합니다.

## 출력

로컬 상태에 가이드 버전 `1.2.1`, 네이티브/WSL 여부, 선택한 에이전트의 실제 경로·버전·PowerShell 검사·실제 응답, 권한 상태, 기존 도구와 남은 문제를 기록합니다.

실패하면 그 검사부터 복구하고, 통과하면 [4. 작업공간](../02-workspace/CONTEXT.md)으로 갑니다.
