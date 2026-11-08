# 공식 자료와 확인 범위

확인일: 2026-10-19 KST. 설치 명령·설정 계약은 아래 공식 문서를 대조했어요. 계정별 이용 가능 여부·요금·모델은 이 가이드에서 고정하지 않아요. 새 버전이나 오류가 생기면 현재 설치된 버전과 공식 문서를 다시 대조해요.

| 주제 | 원천 | 이번 가이드에 반영한 범위 |
|---|---|---|
| Codex 최초 설치 | [CLI](https://developers.openai.com/codex/cli), [Markdown 원문](https://learn.chatgpt.com/docs/codex/cli.md) | Windows 공식 standalone PowerShell 설치·CLI 로그인·설치기의 PATH 등록과 `[y/N]` 질문(설치 스크립트 원문, 2026-11-07 재확인) |
| Windows Terminal | [#14999](https://github.com/microsoft/terminal/pull/14999) | 1.18부터 새 탭·창이 환경변수를 다시 읽는 기본값과 `compatibility.reloadEnvironmentVariables` 설정(2026-11-07 확인) |
| Codex Windows | [Windows](https://developers.openai.com/codex/windows) | 네이티브 사용 가능·현재 권한 안내는 공식 설정 따름 |
| Claude Code | [설치](https://code.claude.com/docs/en/setup) | 네이티브 설치·설치기가 PATH를 바꾸지 않는 동작과 [PATH 해결](https://code.claude.com/docs/en/troubleshoot-install#verify-your-path)·WinGet 대안과 수동 업데이트(2026-11-04 확인)·새 창·선택적 Git for Windows |
| Paseo | [시작](https://paseo.sh/docs), [제공자](https://paseo.sh/docs/providers) | 데스크톱 내장 데몬·외부 CLI 사용 |
| 경로 진단 | [문제 해결](https://paseo.sh/docs/troubleshooting) | daemon PATH·resolved path·Windows 시작 환경·reload |
| 네트워크 | [연결](https://paseo.sh/docs/connectivity), [보안](https://paseo.sh/docs/security) | localhost·릴레이 QR 기본 경로(2026-11-07 확인)·Tailnet direct·인증·실사용 검증 |
| Tailscale TCP | [Serve CLI](https://tailscale.com/docs/reference/tailscale-cli/serve), [Windows 예제](https://tailscale.com/docs/reference/examples/serve) | raw TCP·백그라운드·포트별 해제·관리자 조작 |
| 문턱 | [저장소](https://github.com/jun0-ds/munteok) | Windows core 설치·라우팅·사용자 데이터 보존 |
| 손맛·더듬이 | [손맛](https://github.com/jun0-ds/sonmat), [더듬이](https://github.com/jun0-ds/deodeumi) | 검증 규율·검색 방법론 원천 연결 |
| ICM | [원천](https://github.com/RinDig/Interpreted-Context-Methdology), [구성 원칙](https://github.com/RinDig/Interpreted-Context-Methdology/blob/main/_core/CONVENTIONS.md) | 선택 로딩·단계 입력/진행/출력·참고/작업 파일 분리 |

Tailscale TCP 전달을 localhost Paseo에 조합한 경로는 원천 기능을 이용한 구성안이에요. Paseo 공식 문서가 이 조합 전체를 직접 보장한다는 뜻은 아니에요. 실제 Windows/휴대폰 왕복과 재부팅 지속성은 설치할 기기에서 검증해요. TCP 연결이나 provider 버전 확인은 실제 에이전트 응답을 대체하지 않아요.
