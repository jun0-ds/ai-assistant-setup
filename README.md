# AI Assistant Setup · 1.0

내 컴퓨터에 에이전트 하나를 직접 설치하고, 나머지는 에이전트와 함께 준비합니다.

**[웹 가이드](https://jun0-ds.github.io/ai-assistant-setup/)** · [최초 설치](guides/first-agent.md) · [첫 요청](prompts/start.md) · [오류 해결](references/troubleshooting.md)

Windows에서 Claude Code나 Codex 중 하나를 설치하고 PATH를 등록한 뒤 로그인해 첫 답변을 받으면 직접 할 준비는 끝납니다. 첫 요청을 보내면 에이전트가 이 저장소의 [라우터](CONTEXT.md)를 읽고 현재 상태에 맞는 단계부터 진행합니다. WSL은 나중에 옮겨 갈 수 있는 [선택 경로](references/wsl-migration.md)입니다.

## 진행 흐름

| 단계 | 하는 일 | 통과 기준 |
|---|---|---|
| 1. 최초 설치 | 에이전트 하나 설치·PATH 등록·로그인 | 새 PowerShell에서 실행, 실제 답변 수신 |
| 2. 첫 요청 | 가이드를 에이전트에 전달 | 에이전트가 ICM 라우터를 읽기 시작 |
| 3. 환경 진단 | 설치용 권한 설정, 실행 파일·PowerShell·기존 설치 확인 | 실제 경로와 실행 환경 구분 |
| 4. 작업공간 | `C:\AgentWorkspace`에 문턱·업무·개인 라우팅 준비 | 일반 폴더에서도 필요한 문맥을 찾음 |
| 5. Paseo | 데스크톱 앱에서 에이전트 연결, 권한을 평소 수준으로 조정 | localhost로 접속해 실제 답변 수신 |
| 6. 모바일〔선택〕 | 다른 기기에서 같은 호스트 접속 | 원격 응답과 기존 localhost 접속 모두 확인 |
| 7. 첫 작업 | 자료·결과·임시를 나눠 실제 작업 | 결과 확인, 정리·보관 뒤 재조회 |
| 8. 유지 | 하루 한 번 업데이트 확인·복구 | 개인 자료를 보존하며 필요한 단계만 재개 |

설치 완료 표시나 명령 종료만 보고 다음 단계로 넘어가지 않습니다. 에이전트가 확인 결과와 남은 일을 로컬 상태 파일에 남기므로 중간에 멈췄다가 이어 갈 수 있습니다.

## 문서 구조

ICM의 선택적 문맥 로딩과 단계별 입력·진행·출력 계약을 따릅니다. [CONTEXT.md](CONTEXT.md)가 필요한 단계와 참고 문서를 연결하므로 에이전트가 모든 문서를 한꺼번에 읽지 않습니다. 웹 본문은 같은 Markdown에서 생성합니다.

Claude와 ChatGPT 계정이 모두 있으면 Claude가 지휘하고 Codex가 코드 수정·테스트를 맡도록 [역할을 나눕니다](references/claude-codex.md). 문턱 기본 설치에는 보부상·사랑채가 들어 있지 않습니다. 손맛·더듬이는 작업공간 단계에서 연결합니다. 기존 권한·계정·모델 설정은 초기화하지 않습니다.

## 개발·검증

```sh
npm ci
npm run build
npm run check
npm test
npm run test:browser
```

Windows 읽기 전용 진단 스크립트는 `scripts/Test-SetupEnvironment.ps1`입니다. 실제 최초 설치·로그인·Paseo 응답·다른 기기 연결은 대상 기기에서 따로 확인해야 합니다. 검증 범위는 [검증·릴리스 안내](docs/release.md)에 있습니다.

[문서 안내](docs/README.md) · [변경 이력](CHANGELOG.md) · [공식 자료](references/sources.md) · [이전 v0.5.0](https://github.com/jun0-ds/ai-assistant-setup/tree/v0.5.0) · [라이선스](LICENSE)
