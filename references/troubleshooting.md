# 오류가 나도 에이전트와 계속해요

증상에 맞는 문서만 읽고 원인 → 변경 → 같은 검사 재수행 순서로 진행해요. 명령·오류·어느 창에서 실행했는지는 유용해요. 비밀번호·인증코드·키·토큰·설정 파일 전체는 채팅에 붙이지 않아요.

| 증상 | 확인할 것 | 돌아갈 단계 |
|---|---|---|
| Claude 설치 끝에 `Native installation exists but … is not in your PATH` | 설치는 됨. 사용자 PATH에 `.local\bin` 추가 | [1. 최초 설치](../guides/first-agent.md#claude) |
| 명령이 인식되지 않음 | [실제 파일·새 PowerShell·PATH](windows-paths.md) | [3. 진단](../stages/01-diagnose/CONTEXT.md) |
| 현재 창만 되고 새 창은 실패 | 사용자 PATH의 영구 값과 프로세스 환경 구분 | [3. 진단](../stages/01-diagnose/CONTEXT.md) |
| 스크립트 실행 정책 오류 | `.ps1` shim인지, 로컬 파일 차단인지 확인 | 아래 PowerShell 오류 |
| 로그인·이용권 오류 | 의도한 계정·로그인 상태·공식 이용 가능 여부 | [최초 설치](../guides/first-agent.md) |
| CLI는 되는데 Paseo에서 제공자 없음 | [Daemon PATH·resolved path·version](windows-paths.md#paseo에서만-못-찾을-때) | [5. Paseo](../stages/03-paseo/CONTEXT.md) |
| 접속 거부 | 대상 host·실제 포트·데몬 실행·다른 포트 점유 | [5. Paseo](../stages/03-paseo/CONTEXT.md) |
| 로컬은 되고 폰은 안 됨 | [Tailnet·전달 규칙·접근 정책·PC 전원](paseo-network.md) | [6. 모바일](../stages/04-mobile/CONTEXT.md) |
| 폰은 되고 localhost가 안 됨 | loopback bind를 Tailnet IP로 치환했는지 | [6. 모바일](../stages/04-mobile/CONTEXT.md) |
| 연결이 403으로 거부됨 | 실제 host/origin·비밀번호 오류를 로그에서 구분하고 해당 값만 공식 설정과 대조 | [6. 모바일](../stages/04-mobile/CONTEXT.md) |
| 연결되지만 답변 없음 | 제공자 실행·계정·한도·로그·현재 작업 환경 | [5. Paseo](../stages/03-paseo/CONTEXT.md) |
| 설정을 바꿔도 그대로 | 실제 사용하는 config·reload 결과·구동 override | [5. Paseo](../stages/03-paseo/CONTEXT.md) |
| 파일·지침을 못 읽음 | 실제 cwd·경로·trust·기존 지침 충돌 | [4. 작업공간](../stages/02-workspace/CONTEXT.md) |
| 재부팅·절전 뒤 원격 끊김 | 앱/데몬·Tailscale 유지와 PC 절전 | [8. 유지](../stages/06-maintenance/CONTEXT.md) |

## 에이전트도 아직 실행이 안 된다면

설치 메시지에 나온 절대경로로 실행할 수 있는지 먼저 확인해요. 실행되면 그 에이전트가 PATH·Paseo 진단을 이어가게 해요. 설치 자체가 실패하면 사용한 명령과 오류 문장을 평소 쓰던 웹 AI에 보내 공식 설치 안내와 대조해요. 무작정 다른 계정·WSL·다른 제공자로 바꾸지 않아요.

## PowerShell 오류

- `irm`을 모른다는 오류는 CMD에서 PowerShell 명령을 실행했는지 확인해요. `&&` 오류는 현재 PowerShell 버전이 해당 구문을 지원하는지 확인해요.
- `.ps1` 실행이 차단되면 실제 실행파일·공식 `.cmd` 또는 `.exe`·프로세스 한정 실행 방법을 확인해요. `Set-ExecutionPolicy Unrestricted` 같은 전역 완화를 기본 해결로 쓰지 않아요.
- 내려받은 로컬 파일의 인터넷 차단 표식이 원인이면 출처와 내용을 검토한 뒤 그 파일만 차단 해제해요. 회사가 관리하는 정책을 우회하지 않아요.
- 한글·공백 경로는 실제 경로에 따옴표를 쓰고 `-LiteralPath`를 사용해요. Windows 경로를 WSL 경로로 간주하지 않아요.

## 버전과 다운로드

네트워크·DNS·프록시·공식 배포 주소와 요청한 tag 존재를 구분해요. 이 버전의 계약은 가이드 `v1.0.1`과 문턱 `v0.2.0`이에요. 릴리스 전 검토 환경에서는 로컬 소스를 사용할 수 있지만, 공개 버전의 파일이 없는데 성공한 것으로 안내하지 않아요. 다른 버전을 가져오려면 설치 계약 차이를 확인해요.

## 증거를 남기고 재개하기

`state/setup-status.md`에 실패 검사, 관찰 오류, 변경한 것, 재검사 결과, 다음 사용자 행동을 남겨요. 실제 사용자가 조작할 기기·로그인이 필요하면 그 부분만 요청해요. 로그는 해당 오류 구간만 보고 민감정보를 지워요. 설치/설정 전체 삭제·계정 인증 복사·방화벽 전체 해제부터 시작하지 않아요.

```text
이 단계에서 막혔어요. 사용한 명령과 오류는 아래와 같아요.
현재 로컬 setup-status.md를 읽고 원인을 확인한 뒤, 필요한 수정만 하고 실패한 검사를 다시 해줘요.
내가 해야 할 일이 있으면 한 번에 하나씩 알려줘요.
```

[가이드 라우터](../CONTEXT.md) · [Paseo 공식 오류 안내](https://paseo.sh/docs/troubleshooting)
