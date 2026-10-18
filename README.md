# AI Assistant Setup · 1.0

내 컴퓨터에 에이전트 하나를 설치하고, 나머지는 에이전트와 함께 준비해요.

**[웹 가이드](https://jun0-ds.github.io/ai-assistant-setup/)** · [최초 설치](guides/first-agent.md) · [첫 요청](prompts/start.md) · [오류 해결](references/troubleshooting.md)

Windows에서 Claude Code 또는 Codex 하나를 설치하고 로그인해 첫 답변을 받으면 직접 할 준비는 끝나요. 첫 요청을 전달하면 에이전트가 이 저장소의 [라우터](CONTEXT.md)를 읽고 현재 상태에 맞는 단계부터 진행해요. WSL은 나중에 옮겨갈 수 있는 [선택 경로](references/wsl-migration.md)예요.

## 진행 흐름

| 단계 | 하는 일 | 통과 기준 |
|---|---|---|
| 직접 준비 | 에이전트 하나 설치·로그인 | 새 PowerShell에서 실행되고 실제 답변을 받아요. |
| 환경 진단 | 실행파일·PowerShell·기존 설치 확인 | 실제 경로와 실행 환경을 구분해요. |
| 작업공간 | 문턱·업무·개인 라우팅 준비 | 일반 폴더에서도 필요한 문맥을 찾아요. |
| Paseo | 데스크톱 앱에서 에이전트 연결 | localhost로 접속하고 실제 답변을 받아요. |
| 모바일〔선택〕 | 다른 기기에서 같은 호스트 접속 | 원격 응답과 기존 localhost 접속을 함께 확인해요. |
| 첫 작업 | 자료·결과·임시를 나눠 실제 작업 | 결과를 열어 보고 정리·보관 후 다시 찾아요. |
| 유지 | 하루 한 번 업데이트 확인·복구 | 개인 자료를 보존하며 필요한 단계만 재개해요. |

설치됐다는 표시나 명령 종료만으로 다음 단계로 넘어가지 않아요. 에이전트가 확인 결과와 남은 일을 로컬 상태 파일에 남기므로 중간에 멈췄다가 이어갈 수 있어요.

## 문서 구조

ICM의 선택적 문맥 로딩과 단계별 입력·진행·출력 계약을 사용해요. [CONTEXT.md](CONTEXT.md)가 필요한 단계와 참고 문서를 연결해요. 에이전트는 전부 한꺼번에 읽지 않아요. 웹 본문은 같은 Markdown에서 생성해요.

문턱 설치는 보부상·사랑채를 기본으로 내려받지 않아요. 손맛·더듬이는 작업공간 단계에서 연결해요. 기존 권한·계정·모델 설정을 초기화하지 않아요.

## 개발·검증

```sh
npm ci
npm run build
npm run check
npm test
npm run test:browser
```

Windows 읽기 전용 진단은 `scripts/Test-SetupEnvironment.ps1`이에요. 실제 최초 설치·로그인·Paseo 응답·다른 기기 연결은 대상 기기에서 따로 확인해야 해요. [검증·릴리스 안내](docs/release.md)에 범위를 적었어요.

[문서 안내](docs/README.md) · [변경 이력](CHANGELOG.md) · [공식 자료](references/sources.md) · [이전 v0.5.0](https://github.com/jun0-ds/ai-assistant-setup/tree/v0.5.0) · [라이선스](LICENSE)
