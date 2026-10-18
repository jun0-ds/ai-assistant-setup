# 3. 컴퓨터 상태 확인

## 입력

| 자료 | 범위 | 이유 |
|---|---|---|
| [Windows 경로](../../references/windows-paths.md) | 현재 증상 | 실제 바이너리와 실행 환경을 구분해요. |
| `state/setup-status.md` | 있다면 전체 | 기존 상태부터 이어가요. |
| [진단 스크립트](../../scripts/Test-SetupEnvironment.ps1) | 실행 전 전체 | 검사 범위와 출력을 확인해요. |

## 진행

1. Windows 네이티브인지 WSL인지 확인해요. Windows 안내를 WSL 셸에서 실행하지 않아요.
2. 준비 폴더는 실제 문서 폴더의 `AgentSetup`, 소스는 `source/`, 기록은 `state/`로 나눠요. 사용자가 정한 위치가 있으면 유지해요. 상태는 공개 Git에 올리지 않아요.
3. 선택한 에이전트만 `Get-Command <agent> -All`, 실제 파일 존재, `--version`으로 검사해요. 별칭·함수·npm shim과 실제 실행파일을 구분해요.
4. `powershell -NoProfile -File <source>/scripts/Test-SetupEnvironment.ps1 -Agent codex`처럼 진단해요. Claude면 `-Agent claude`예요. 변경 없는 진단이며 결과는 로컬에만 저장해요.
5. PATH를 고쳤다면 새 PowerShell에서 재확인해요. 이 결과로 Paseo 데몬의 인식까지 통과했다고 적지 않아요.
6. 지금 실제 응답을 받고 본인의 의도한 계정을 사용하는지 확인해요. 인증 파일 내용이나 토큰은 출력하지 않아요.
7. 기존 Paseo·Tailscale·문턱의 위치·버전·구동 방식을 확인해요. 재설치나 초기화부터 하지 않아요.

## 출력

로컬 상태에 버전 `1.0.1`, 네이티브/WSL, 선택 에이전트의 실제 경로·버전·PowerShell 검사·실제 응답, 기존 도구와 남은 문제를 기록해요.

실패하면 해당 검사부터 복구하고, 통과하면 [4. 작업공간](../02-workspace/CONTEXT.md)으로 가요.
