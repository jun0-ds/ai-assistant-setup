# Codex 자동 세팅 요청

## 👋 진행 원칙 — 사용자가 비개발자일 수 있음

이 가이드를 붙여넣은 사용자는 **비개발자일 확률이 높습니다.** 아래 원칙을 꼭 지켜줘:

1. **낯선 용어는 첫 등장 시 한 줄로 풀이**해줘 (예: "Node.js는 AI 도구가 돌아가는 엔진이에요").
2. **각 명령어 실행 전에 "이 단계에서 뭘 하는지" 한 줄** 설명해줘.
3. **명령어를 실행한 뒤 "성공하면 이렇게 나옵니다"를 보여주고**, 실제 출력이 다르면 함께 진단해줘.
4. **사용자가 "이게 뭐예요?"라고 물으면 기술 답변 전에 비유부터 써줘.**
5. **한 번에 한 단계씩** 진행. 여러 명령어를 쏟아붓지 말 것.

---

이 세팅을 시작하기 전에, 아래 질문을 먼저 해줘.
답변을 받은 뒤 해당하는 단계만 실행할 것.

## 사전 질문

1. **Python 프로젝트를 할 예정인가요?** (Yes/No)
   - Yes → 6단계(Python 도구 설치) 실행
   - No → 6단계 스킵

2. **ChatGPT 구독 중인가요, API 키를 사용하나요?**
   - 구독 중 또는 무료 체험 → ChatGPT 로그인 안내
   - API 키 → 환경 변수 설정 안내

3. **AI에게 원하는 호칭이나 말투가 있나요?** (자유롭게 답변)
   - 예: "나를 '선배'라고 불러줘, 너는 '막내'야"
   - 예: "편하게 반말로 해줘"
   - 예: "존댓말로 해줘"
   - 딱히 없으면 → 호칭 섹션 생략, 기본 존댓말

---

질문 답변을 받았으면 아래 작업을 순서대로 실행해줘.
모든 명령어는 bash 기준으로 실행한다.

> **Windows 사용자 전제:** setup-guide.md의 0단계에 따라 **WSL2 Ubuntu가 이미 설치**되어 있고, VS Code가 WSL Remote 모드로 연결된 상태여야 한다. PowerShell이나 cmd 분기는 사용하지 않는다 — 셸이 PowerShell이면 사용자에게 "WSL Ubuntu 터미널로 전환"을 먼저 요청할 것.

## 1. 기존 설정 백업

`~/.codex/` 디렉토리가 이미 존재하면, 아래 파일들을 `.bak`으로 백업:
- `~/.codex/AGENTS.md` → `~/.codex/AGENTS.md.bak`

존재하지 않는 파일은 스킵.

## 2. 환경 확인 및 CLI 설치

Node.js 22+ 확인:
```bash
node --version
```

> 사용자에게 설명 — "Node.js는 AI 도구가 돌아가는 엔진입니다. 한 번만 설치하면 돼요."
> 성공 신호 — "`v22.x.x` 이상 버전 번호가 나오면 OK."
> 실패 대응 — "`command not found` 가 나오면 미설치. https://nodejs.org 에서 LTS 버전 설치."

없거나 22 미만이면 https://nodejs.org 에서 LTS 설치를 안내해줘.
설치 완료 후 다음 진행.

Codex CLI 확인:
```bash
codex --version
```

> 성공 신호 — "버전 번호가 나오면 설치됨."

없으면:
```bash
npm install -g @openai/codex
```

> 설치에 2~3분 걸릴 수 있다고 미리 안내해줘.

## 3. 인증 설정

### ChatGPT 계정 사용 시

```bash
codex
```
실행 후 "Sign in with ChatGPT" 선택. 브라우저에서 로그인.

### API 키 사용 시

> ⚠️ **보안 주의:** API 키는 민감 정보입니다. `.bashrc`에 직접 넣는 대신 `.env` 파일이나 시크릿 관리 도구 사용을 권장합니다. 아래는 가장 간단한 방법이지만, 이 파일은 **절대 git에 커밋하지 마세요.**

**bash/zsh (Mac · Linux · Windows WSL):**
```bash
echo 'export OPENAI_API_KEY="여기에_API_키_입력"' >> ~/.bashrc
source ~/.bashrc
```

> Windows 사용자는 PowerShell이 아닌 **WSL Ubuntu 터미널** 안에서 위 명령을 실행한다. WSL 안의 환경변수와 Windows 환경변수는 별개다.

## 4. sonmat 설치 (AI 사고·검증 규율 체계)

sonmat을 통째로 Codex 환경에 설치한다. **흩어진 파일이 아니라 하나의 체계**로 유지할 것.

이미 설치되어 있으면 최신 버전으로 업데이트:
```bash
if [ -d ~/.codex/sonmat/.git ]; then
  git -C ~/.codex/sonmat pull origin main --ff-only
else
  git clone https://github.com/jun0-ds/sonmat.git ~/.codex/sonmat
fi
```

설치 확인:
```bash
ls ~/.codex/sonmat/discipline/  # core.md, hints.md
ls ~/.codex/sonmat/skills/       # autoloop, guard, imp, inspect, scribe
ls ~/.codex/sonmat/agents/       # sonmat-worker.md
```

| 플러그인 | 역할 |
|---------|------|
| **sonmat** | AI의 사고·검증 규율 체계 — 코드를 짜기 전에 "이게 맞나?" 한 번 더 생각하게 만드는 플러그인 |

## 5. 글로벌 설정 생성

### AGENTS.md 생성

`~/.codex/AGENTS.md` 파일을 생성한다.

**중요:** `~/.codex/sonmat/discipline/core.md`와 `~/.codex/sonmat/discipline/hints.md`의 내용을 읽어서 AGENTS.md 안에 **직접 붙여넣기** 할 것. 파일 참조("see core.md")가 아니라 내용 자체를 넣어야 한다 — 참조만 하면 안 읽을 수 있다.

AGENTS.md 구조:

```markdown
# AGENTS.md

## 호칭

(사전 질문 3번 답변을 바탕으로 작성. 예시:)
- 사용자 → Codex: "(사용자가 정한 호칭)"
- Codex → 사용자: "(사용자가 정한 호칭)"
- (사용자가 원하는 말투 스타일)

## Core Discipline (sonmat)

(여기에 discipline/core.md 내용 전체를 붙여넣기)

## Domain Hints

(여기에 discipline/hints.md 내용 전체를 붙여넣기)

## Skills

Available skills (`~/.codex/sonmat/skills/`):
- `autoloop/` — autonomous loop with escalation
- `guard/` — pre-commit verification
- `imp/` — devil's advocate for reasoning
- `inspect/` — deep inspection mode (dependencies, side effects, rollback)
- `scribe/` — background meta channel (bridge notes, progress tracking)

## Python 설정

- Python 실행: `uv run python` (python 직접 호출 금지)
- 패키지 설치: `uv pip install` (pip 직접 호출 금지)
- 린트/포맷: `ruff check`, `ruff format`
```

> 사전 질문 3번에서 호칭/말투 요청이 **없었으면** "## 호칭" 섹션을 제거하고 생성할 것.
> Python을 안 쓴다고 답했으면 "## Python 설정" 섹션을 제거하고 생성할 것.

## 6. Python 개발 도구 설치 (사전 질문에서 Yes인 경우만)

### uv 설치

먼저 `uv --version`으로 설치 여부 확인. 없으면 (Mac · Linux · Windows WSL 공통):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

> Windows는 **WSL Ubuntu 안에서** 실행. PowerShell 사용 금지 (Codex CLI 환경과 분리됨).

### ruff 설치

uv 설치 후:
```bash
uv tool install ruff
```

설치 확인:
```bash
uv --version
ruff --version
```

## 7. 최종 확인

아래 항목 체크해서 결과 알려줘 (해당 항목만):

- [ ] Node.js 22+ 설치됨
- [ ] Codex CLI 설치됨
- [ ] 인증 완료 (ChatGPT 로그인 또는 API 키 설정)
- [ ] sonmat 설치됨
- [ ] ~/.codex/AGENTS.md 생성됨
- [ ] (Python 선택 시) uv 설치됨
- [ ] (Python 선택 시) ruff 설치됨

전부 완료되면 "세팅 완료! 이제 시작하세요." 라고 알려줘.
