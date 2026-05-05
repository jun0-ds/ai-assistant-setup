# Codex CLI 세팅 가이드 (VS Code)

> OpenAI의 AI 어시스턴트. VS Code 안에서 채팅하듯 쓰는데, **내 컴퓨터 파일을 직접 읽고 고쳐줍니다.**
>
> 💰 **무료 입문 추천** — ChatGPT 계정으로 현재 무료 체험 가능 (한시적). 나중에 유료 전환은 ChatGPT Plus($20/월) 또는 Pro($200/월).

---

> ⏱️ **예상 소요 시간**
> - 완전 처음 (VS Code·Node.js 둘 다 없음): 20~30분
> - VS Code 있음: 10~15분
>
> 🚨 **Windows 사용자 필독**: Codex CLI는 Windows 네이티브에서 안정적으로 안 돕니다. **반드시 WSL2(Ubuntu)에서 진행하세요.** 0단계가 WSL 설치입니다. 안 거치면 중간에 깨집니다.

---

## 🗺️ 전체 흐름 — 무엇을 하는 건가요?

```
0. 사전 요구사항
   - Mac/Linux: git, Node.js 22+ 확인
   - Windows: WSL2 Ubuntu 설치 (필수)
        ↓
1. VS Code 설치                (에디터)
        ↓
2. Codex 확장 설치              (VS Code 안에 AI 붙이기)
        ↓
3. ChatGPT 로그인                (무료 체험이면 여기서 끝)
        ↓
4. AI 채팅창 열기                (오른쪽에 패널이 뜸)
        ↓
5. auto-setup.md 붙여넣기       (나머지는 AI가 자동 세팅)
```

---

## 0단계: 사전 요구사항

### 🍎 Mac · 🐧 Linux 사용자

git과 Node.js 22+가 깔려 있어야 합니다. 터미널에서 확인:

```bash
git --version
node --version
```

❌ 누락 시 설치:
- **git** (Mac): `xcode-select --install`
- **git** (Linux): `sudo apt install git`
- **Node.js**: https://nodejs.org → **LTS 22 이상** 다운로드 → 설치 → 터미널 새 창

✅ 둘 다 버전이 출력되면 **1단계로 이동**.

---

### 🪟 Windows 사용자 — WSL2 Ubuntu 설치 (필수)

### 왜 WSL이 필요한가요?

Codex CLI는 macOS/Linux용으로 설계됐습니다. Windows 네이티브(PowerShell·cmd)에서는 경로·권한·인증 흐름이 깨지는 일이 많습니다. **Windows 안에서 가벼운 Linux를 띄워주는 게 WSL2** — 마이크로소프트 공식 기능, 한 줄로 설치.

### 설치 절차

1. **PowerShell을 관리자 권한으로 열기**
   - 시작 메뉴 → "PowerShell" 검색 → 우클릭 → **"관리자 권한으로 실행"**

2. **WSL + Ubuntu 한 번에 설치:**
   ```powershell
   wsl --install
   ```
   > 기본으로 Ubuntu가 깔립니다. 5~10분 걸림.

3. **재부팅** (필요 시 자동 안내)

4. **재부팅 후 Ubuntu 첫 실행** — 시작 메뉴 → "Ubuntu" 클릭
   - 검은 창이 뜨면서 사용자명·비밀번호 설정 요청 → **간단하게 정해서 입력** (잊지 마세요)
   - 비밀번호 입력 시 **화면에 아무것도 안 찍힙니다 (정상)** — 그냥 치고 엔터

5. **Ubuntu 안에서 기본 도구 설치:**
   ```bash
   sudo apt update
   sudo apt install -y git curl
   ```
   > 비밀번호 물어보면 4번에서 정한 거 입력.

6. **Node.js 22 LTS 설치 (Ubuntu 안):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install -y nodejs
   node --version
   ```
   > `v22.x.x` 출력되면 성공. (Codex CLI는 Node 22+ 필요)

✅ **0단계 성공 신호**: Ubuntu 터미널에서 `git --version`, `node --version`, `npm --version` 모두 버전이 출력됨.

> 💡 **앞으로 모든 명령어는 Ubuntu 안에서 실행하세요.** PowerShell 아님. VS Code도 다음 단계에서 "WSL 모드"로 띄울 겁니다.

---

## 1단계: VS Code 설치 (없으면)

이미 쓰고 있다면 **2단계로 바로 이동**.

1. https://code.visualstudio.com 접속
2. 자기 OS에 맞는 설치 파일 다운로드 → 설치 — **Windows라도 Windows 버전을 받습니다 (Linux 버전 X)**. VS Code는 Windows에 깔지만 WSL Ubuntu에 원격 접속해서 작업합니다.
3. 실행해서 창이 뜨면 OK

![VS Code 설치 직후 — 왼쪽 사이드바의 Extensions 아이콘이 다음 단계 목표](../figures/01-vscode-installed.png)

### 🪟 Windows 사용자 추가 단계 — WSL Remote 확장 + WSL로 연결

VS Code 안에서 작업하되, **실제 명령어는 WSL Ubuntu 안에서 돌아야** Codex CLI가 깨지지 않습니다.

1. 왼쪽 사이드바 확장 아이콘(`Ctrl+Shift+X`) → 검색창에 `WSL` → Microsoft 제공 **"WSL"** 확장 → Install
2. 좌측 하단 **파란색 `><` 아이콘** 클릭 → **"Connect to WSL"** 선택
3. 새 창이 열리고 좌측 하단에 `WSL: Ubuntu` 표시 → 이제 모든 터미널·명령어가 Ubuntu 안에서 돕니다
4. 이 상태로 2단계 진행

---

## 2단계: Codex 확장 프로그램 설치

VS Code를 열고, 왼쪽 사이드바의 **확장 아이콘**(네모 4개 모양, 단축키 `Ctrl+Shift+X`) 클릭.

검색창에 `Codex` 또는 `ChatGPT` 입력 → OpenAI 제공 확장 → **Install** 클릭.

![Extensions 패널 — ① 검색창에 'Codex' 입력 → ③ 결과의 Codex 확장 Install](../figures/02-extensions-panel.png)

**또는 터미널에서 한 줄로:**

VS Code 안에서 터미널을 열어 (``Ctrl+` `` 백틱 키) 아래를 붙여넣기:

```bash
code --install-extension openai.chatgpt
```

✅ **성공 신호**: 확장 탭의 Codex/ChatGPT 항목에 `Uninstall` 버튼이 보이면 설치 완료.

---

## 3단계: 인증 (둘 중 하나)

### 방법 A — ChatGPT 계정 로그인 (무료 체험 포함, 추천)

확장 설치 후 Codex 패널을 열면 **"Sign in with ChatGPT"** 버튼이 나옵니다. 클릭 → 브라우저로 ChatGPT 로그인 → 완료.

ChatGPT Free 계정으로도 **현재 무료 체험 가능** (한시적). Plus/Pro 구독 중이면 한도가 더 큽니다.

### 방법 B — API 키 (종량제)

무료 체험 끝나고도 구독 없이 쓰려면:

1. https://platform.openai.com 접속 → 계정 생성
2. **Billing** 메뉴 → 크레딧 충전
3. **API Keys** 메뉴 → "Create secret key" → 복사
4. 환경 변수 `OPENAI_API_KEY` 로 설정 (auto-setup.md 단계에서 AI가 안내)

✅ **성공 신호**: 채팅창 하단에 모델 이름 (`GPT-5-Codex` 등)이 뜨면 인증 완료.

---

## 4단계: 채팅창 열기

**VS Code 왼쪽 사이드바에 ChatGPT/Codex 아이콘이 생겼습니다.**

클릭하면 오른쪽에 채팅 패널이 열림. ChatGPT 웹과 거의 동일한 입력창이 보임.

![Codex 채팅 패널 — ① 상단의 Codex 탭 / ② 하단 입력창에 auto-setup.md 내용 붙여넣기](../figures/04-codex-chat.png)

❓ **채팅창이 안 보이나요?**
- 상단 메뉴 → View → Command Palette (`Ctrl+Shift+P`) → `Codex` 검색

---

## 5단계: 나머지는 Codex에게 맡기기

채팅창이 열렸으면, 아래 파일 전체 내용을 **복사해서 채팅창에 붙여넣기**:

> 📋 **[auto-setup.md](auto-setup.md)** — 이 파일을 클릭해서 열고, 내용 전체 선택(`Ctrl+A`) → 복사(`Ctrl+C`) → Codex 채팅창에 붙여넣기(`Ctrl+V`) → 엔터.

Codex가 **질문을 시작**하면 답하기만 하면 됩니다:
- "Python 프로젝트 하실 건가요?" → Yes/No
- "ChatGPT 구독 중이신가요, API 키이신가요?"
- "호칭 지정하시겠어요?" → 자유롭게 (또는 "그냥 존댓말이요")

Codex가 알아서:
- Node.js / Codex CLI 설치 확인 및 안내
- 플러그인 설치 (sonmat — 선택)
- 글로벌 `AGENTS.md` 생성 (호칭·기본 규칙)
- Python 도구 설치 (선택 시만)

✅ **성공 신호**: Codex가 마지막에 "세팅 완료! 이제 시작하세요." 라고 말하면 끝.

---

## 참고

- **무료 체험**: ChatGPT Free/Go 계정으로 사용 가능 (한시적)
- **유료**: ChatGPT Plus $20/월, Pro $200/월 (Codex 포함)
- **API 종량제**: codex-mini ~$1.50/MTok, GPT-5 ~$10/MTok
- **기본 모델**: GPT-5-Codex
- **모델 변경**: `/model` 입력
- **공식 문서**: https://developers.openai.com/codex
- **Windows**: WSL2 Ubuntu **필수** (0단계). VS Code는 Windows에 설치 후 WSL Remote로 연결.

---

## 📚 용어 사전 (막힐 때 돌아오기)

| 용어 | 한 줄 설명 |
|------|----------|
| **터미널** | 검은 화면에 명령어 치는 도구. VS Code 안에서 ``Ctrl+` `` 로 열림. |
| **CLI** | 터미널에서 돌아가는 프로그램. |
| **WSL** | Windows 안에서 Linux를 돌리는 기능. `wsl --install` 한 줄로 설치. |
| **git** | 코드·파일 버전 관리 도구. sonmat을 GitHub에서 가져올 때 필요. WSL Ubuntu에 `apt install git` 으로 설치. |
| **Node.js** | AI 도구가 돌아가기 위한 엔진. Codex CLI는 22+ 필요. |
| **npm** | Node.js의 설치 도구. `npm install ~~` 명령으로 프로그램 설치. |
| **API 키** | "내 계정 비밀번호" 같은 것. 요금 청구 주소. |
| **환경 변수** | OS가 모든 프로그램에 알려주는 설정값. `OPENAI_API_KEY` 같은 것. |
| **플러그인 (sonmat)** | AI가 성급하게 답하기 전에 "정말 맞나?" 검증하는 보조 장치. 선택. |
| **AGENTS.md** | Codex의 글로벌 지침 파일. Claude의 `CLAUDE.md`에 해당. |
