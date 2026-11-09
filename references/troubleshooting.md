# 오류 대응

증상에 맞는 문서만 읽고 원인 확인 → 변경 → 같은 검사 재수행 순서로 진행합니다. 실행한 명령, 오류 문장, 어느 창에서 실행했는지는 도움이 됩니다. 비밀번호·인증 코드·키·토큰·설정 파일 전체는 채팅에 붙여 넣지 않습니다.

| 증상 | 확인할 것 | 돌아갈 단계 |
|---|---|---|
| Claude 설치 끝에 `… is not in your PATH` 표시 | 설치는 정상. PATH 등록 명령 실행 | [1. 최초 설치](../guides/first-agent.md#claude) |
| `claude`·`codex` 명령을 인식하지 못함 | [터미널 완전 재시작·PATH 등록 명령 재실행](../guides/first-agent.md#실행-명령을-못-찾을-때), [실제 파일·PATH 진단](windows-paths.md) | [3. 진단](../stages/01-diagnose/CONTEXT.md) |
| 설치 중에도 허용할지 계속 물어봄 | 첫 요청에서 권한을 바꿨는지, 설정 파일의 실제 값, 바꾼 뒤 [다시 시작](../prompts/start.md#처음-한-번-허용하고-다시-시작하기)했는지, 안 되면 [직접 설정](../guides/first-agent.md#권한을-직접-설정하려면) | [3. 진단](../stages/01-diagnose/CONTEXT.md) |
| 현재 창에서만 되고 새 창에서는 실패 | 사용자 PATH의 영구 값과 프로세스 환경 구분 | [3. 진단](../stages/01-diagnose/CONTEXT.md) |
| 스크립트 실행 정책 오류 | `.ps1` shim 문제인지, 로컬 파일 차단인지 확인 | 아래 PowerShell 오류 |
| 로그인·이용권 오류 | 의도한 계정·로그인 상태·공식 이용 가능 여부 | [1. 최초 설치](../guides/first-agent.md) |
| CLI는 되는데 Paseo에 제공자가 없음 | [Daemon PATH·resolved path·version](windows-paths.md#paseo에서만-못-찾을-때) | [5. Paseo](../stages/03-paseo/CONTEXT.md) |
| 접속 거부 | 대상 host·실제 포트·데몬 실행 여부·다른 프로그램의 포트 점유 | [5. Paseo](../stages/03-paseo/CONTEXT.md) |
| PC에서는 되고 휴대폰에서는 안 됨 | [QR 연결·릴레이 켜짐·PC 전원과 인터넷](paseo-network.md#qr로-연결하기), Tailscale이면 전달 규칙·접근 정책 | [6. 모바일](../stages/04-mobile/CONTEXT.md) |
| 휴대폰에서는 되고 localhost에서는 안 됨 | Tailscale 사용 시 loopback bind를 Tailnet IP로 바꿨는지 | [6. 모바일](../stages/04-mobile/CONTEXT.md) |
| 연결이 403으로 거부됨 | 로그에서 실제 host·origin 문제와 비밀번호 오류를 구분하고 해당 값만 공식 설정과 대조 | [6. 모바일](../stages/04-mobile/CONTEXT.md) |
| 연결은 되지만 답변 없음 | 제공자 실행·계정·한도·로그·현재 작업 환경 | [5. Paseo](../stages/03-paseo/CONTEXT.md) |
| 설정을 바꿔도 그대로 | 실제로 쓰이는 config·reload 결과·구동 시 덮어쓰는 값 | [5. Paseo](../stages/03-paseo/CONTEXT.md) |
| 파일·지침을 읽지 못함 | 실제 cwd·경로·trust·기존 지침과의 충돌 | [4. 작업공간](../stages/02-workspace/CONTEXT.md) |
| 재부팅·절전 뒤 원격 연결 끊김 | 앱·데몬·인터넷·PC 절전, Tailscale 사용 시 그 연결 | [8. 유지](../stages/06-maintenance/CONTEXT.md) |

## 에이전트를 아직 실행할 수 없을 때

먼저 설치 메시지에 나온 절대경로로 실행되는지 확인합니다. 실행되면 그 에이전트에게 PATH·Paseo 진단을 이어서 맡깁니다. 설치 자체가 실패했다면 사용한 명령과 오류 문장을 평소 쓰던 웹 AI에 보내 공식 설치 안내와 대조합니다. 무작정 다른 계정·WSL·다른 제공자로 바꾸지 않습니다.

## PowerShell 오류

- `irm`을 모른다는 오류가 나면 PowerShell 명령을 CMD에서 실행하지 않았는지 확인합니다. `&&` 오류가 나면 현재 PowerShell 버전이 그 구문을 지원하는지 확인합니다.
- `.ps1` 실행이 차단되면 실제 실행 파일, 공식 `.cmd`·`.exe`, 프로세스에만 적용되는 실행 방법이 있는지 확인합니다. `Set-ExecutionPolicy Unrestricted` 같은 전역 완화를 기본 해결책으로 쓰지 않습니다.
- 내려받은 로컬 파일에 붙은 인터넷 차단 표식이 원인이면 출처와 내용을 검토한 뒤 그 파일만 차단을 해제합니다. 회사가 관리하는 정책은 우회하지 않습니다.
- 한글이나 공백이 들어간 경로는 따옴표로 감싸고 `-LiteralPath`를 씁니다. Windows 경로를 WSL 경로로 취급하지 않습니다.

## 버전과 다운로드

네트워크·DNS·프록시 문제, 공식 배포 주소 문제, 요청한 tag가 없는 문제를 구분합니다. 이 버전의 계약은 가이드 `v1.1.0`과 문턱 `v0.2.0`입니다. 릴리스 전 검토 환경에서는 로컬 소스를 써도 되지만, 공개 버전의 파일이 없는데 성공했다고 안내하지 않습니다. 다른 버전을 가져오려면 설치 계약이 어떻게 다른지 먼저 확인합니다.

## 증거를 남기고 재개하기

`state/setup-status.md`에 실패한 검사, 관찰한 오류, 바꾼 것, 재검사 결과, 사용자가 다음에 할 행동을 남깁니다. 사용자가 직접 기기를 조작하거나 로그인해야 하면 그 부분만 요청합니다. 로그는 해당 오류 구간만 보고 민감 정보를 지웁니다. 설치·설정 전체 삭제, 계정 인증 복사, 방화벽 전체 해제부터 시작하지 않습니다.

```text
이 단계에서 막혔어요. 사용한 명령과 오류는 아래와 같아요.
현재 로컬 setup-status.md를 읽고 원인을 확인한 뒤, 필요한 수정만 하고 실패한 검사를 다시 해 주세요.
내가 해야 할 일이 있으면 한 번에 하나씩 알려 주세요.
```

[가이드 라우터](../CONTEXT.md) · [Paseo 공식 오류 안내](https://paseo.sh/docs/troubleshooting)
