# AI Assistant Setup

### 👉 **[사이트에서 편하게 보기 (jun0-ds.github.io/ai-assistant-setup)](https://jun0-ds.github.io/ai-assistant-setup/)**

> 깃허브 화면이 어렵게 느껴지면 위 링크로 이동하세요. 깔끔한 웹페이지로 같은 내용이 보입니다.

---

> ⚠️ 썸네일 보고 놀라지 마세요. 군침이 싹 돕니다.

내 컴퓨터에 AI 어시스턴트 세팅하기.

> 코딩뿐 아니라 **글쓰기, 데이터 분석, 문서 정리, 공부, 업무 자동화** 등 뭐든 시킬 수 있습니다.

### 이런 걸 할 수 있어요

- **코딩** — 코드 작성, 디버깅, 리팩토링
- **글쓰기** — 초안 작성, 퇴고, 번역
- **분석** — 데이터 정리, 시각화, 리포트
- **문서** — 요약, 포맷 변환, 템플릿 생성
- **학습** — 개념 설명, 예제 생성, 퀴즈
- **자동화** — 반복 작업 처리, 파일 정리, 스크립트 생성

---

## 🧭 당신은 누구인가요? — 경로 먼저 고르기

가이드 길이에 압도되지 말고, 해당되는 한 줄만 따라가세요.

| 당신 | 추천 | 왜 |
|------|------|------|
| **일단 무료로 시작해보고 싶다** | 👉 [Codex (무료 체험)](#codex-cli-openai--무료-입문-추천) | ChatGPT 계정이면 바로 시작. 결제 정보 안 물어봄. |
| **ChatGPT / Claude 웹을 이미 돈 내고 쓴다** | 👉 [Claude Code (유료)](#claude-code-anthropic--유료-메인-추천) | 가장 완성도 높음. 구독 중이면 추가 비용 없음. |
| **진지하게 오래 쓸 거다** | 👉 [Claude Code (유료)](#claude-code-anthropic--유료-메인-추천) | 긴 맥락·깊은 분석·플러그인 생태계. |
| **개발은 안 한다, 글쓰기·분석만 하고 싶다** | 👉 둘 다 OK — [Codex](#codex-cli-openai--무료-입문-추천)로 무료 시작 | 세팅 과정은 거의 동일. |

> 💡 **Claude / Codex 모두 VS Code 안에서 쓰는 AI 채팅 도구입니다.** 웹 ChatGPT와 비슷한 채팅 경험인데, **내 컴퓨터 파일을 직접 읽고 고쳐줍니다.** 이게 핵심 차이.

---

## ⚠️ 세팅 전에 알아둘 것 (비개발자 필독)

이 가이드는 몇 가지 **생소한 개념**을 씁니다. 지금 모든 용어를 이해할 필요는 없어요 — 나올 때마다 여기 돌아오세요.

| 용어 | 쉬운 설명 |
|------|----------|
| **VS Code** | 마이크로소프트가 만든 무료 코드 편집기. AI를 여기 안에 붙여서 씁니다. |
| **터미널 (Terminal / PowerShell)** | 검은 화면에 명령어를 치는 도구. VS Code 안에서도 열 수 있습니다 (``Ctrl+` `` 키). |
| **CLI** | "Command Line Interface"의 약자. 터미널에서 돌아가는 프로그램. |
| **Node.js** | AI 도구가 돌아가기 위한 엔진. 한 번만 설치하면 됩니다. |
| **npm** | Node.js에 딸려오는 설치 도구. `npm install ~~` 명령으로 프로그램을 깝니다. |
| **API 키** | "내 계정 비밀번호" 같은 것. AI에게 요금을 누구에게 받을지 알려주는 코드. |
| **플러그인 (sonmat)** | 선택 사항. AI가 성급하게 답하기 전에 "정말 맞나?" 한 번 더 검증하는 보조 장치. |

### 예상 소요 시간

- **정말 처음이면 (VS Code·Node.js 둘 다 없음)**: 20~30분
- **VS Code는 써봤음**: 10~15분
- **"3분" 아닙니다** — 과장 없이 써둡니다.

### 비용 — 솔직하게

> 📢 **오해 방지** — 이 가이드 자체는 **공개 무료 자료**(BSD 3-Clause 라이선스)입니다. 아래 비용은 OpenAI·Anthropic 등 **AI 회사에 직접 결제**하는 사용료고, 가이드 제작자에게 지불되는 게 아닙니다.

- **Codex (무료 체험)**: ChatGPT 계정만 있으면 현재 무료. 한도 초과 시 유료 전환 안내가 뜸.
- **Claude Code (유료)**: 두 가지 방식 중 하나.
  - **API 종량제**: $5부터 충전 → 가볍게 쓰면 **한 달 $3~10 정도**. 많이 쓰면 그 이상.
  - **Claude Pro/Max 구독**: 월 $20 / $100~200. 이미 구독 중이면 추가 비용 없음.

---

## Claude Code (Anthropic) — 유료, 메인 추천

> Anthropic의 AI 어시스턴트. 긴 맥락·깊은 분석·플러그인 생태계가 강점.

| 파일 | 용도 |
|------|------|
| [claude/setup-guide.md](claude/setup-guide.md) | 👉 **여기부터 시작** — VS Code 확장 설치 + 로그인 |
| [claude/auto-setup.md](claude/auto-setup.md) | 설치 끝나면 AI 채팅창에 붙여넣기 → 나머지 자동 |
| [claude/troubleshooting.md](claude/troubleshooting.md) | 문제 해결 (Windows·플러그인 이슈) |

## Codex CLI (OpenAI) — 무료 입문 추천

> OpenAI의 AI 어시스턴트. ChatGPT 계정으로 무료 체험 가능.

| 파일 | 용도 |
|------|------|
| [codex/setup-guide.md](codex/setup-guide.md) | 👉 **여기부터 시작** — VS Code 확장 설치 + ChatGPT 로그인 |
| [codex/auto-setup.md](codex/auto-setup.md) | 설치 끝나면 AI 채팅창에 붙여넣기 → 나머지 자동 |

## ~~Gemini CLI (Google)~~ — ⏸️ 임시 퇴출

> ~~무료 AI 어시스턴트. Google 계정으로 바로 시작.~~
>
> **현재 Gemini는 응답 속도 이슈로 가이드에서 임시 제외 중입니다.**
> Google이 성능 개선하면 다시 포함 예정. 그 전에는 **Codex (무료)** 를 추천.
> ~~[gemini/setup-guide.md](gemini/setup-guide.md)~~ (파일은 보존, 권장하지 않음)

---

## 어떤 AI를 고를까? — 비교표

| | **Claude Code** (유료 메인) | **Codex CLI** (무료 입문) | ~~Gemini CLI~~ |
|---|---|---|---|
| **가격** | 유료 ($5부터 API 종량제 / Pro $20/월) | **무료** (ChatGPT 계정, 체험 한시적) | ~~무료~~ |
| **일일 한도** | 구독 플랜별 | ChatGPT 플랜별 | ~~1,000 요청~~ |
| **속도** | ⚡ 빠름 | ⚡ 빠름 | ~~🐢 느림 (임시 제외 사유)~~ |
| **Node.js** | 18+ | 22+ | ~~20+~~ |
| **강점** | 깊은 분석, 긴 맥락, 플러그인 | GPT-5 기반 강력한 에이전트 | — |
| **VS Code** | ✅ 확장 | ✅ 확장 | ~~✅~~ |
| **Windows** | ✅ 네이티브 (Git for Windows 필요) | 🚨 **WSL2 필수** (CLI 안정성) | ~~✅~~ |
| **글로벌 지침 파일** | `CLAUDE.md` | `AGENTS.md` | ~~`GEMINI.md`~~ |
| **플러그인** | ✅ [sonmat](https://github.com/jun0-ds/sonmat) | ✅ [sonmat](https://github.com/jun0-ds/sonmat) | ~~✅~~ |

---

## 사용법

1. 위 **"당신은 누구인가요?"** 에서 경로 고르기
2. 해당 AI의 `setup-guide.md` 를 열고 단계별로 따라하기
   - **Claude**: 0단계에서 git·Node.js 사전 설치 → 3단계에서 CLI(`npm install -g @anthropic-ai/claude-code`) → 6단계에서 sonmat 슬래시 설치
   - **Codex (Windows)**: 0단계에서 WSL2 Ubuntu 설치 후 모든 작업을 Ubuntu 안에서 진행
3. AI가 동작하면 `auto-setup.md` 내용을 첫 대화에 붙여넣기
4. AI가 질문하면 답하기 → 세팅 끝
