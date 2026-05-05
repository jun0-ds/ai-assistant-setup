# Claude Code 자동 세팅 요청

## 👋 진행 원칙 — 사용자가 비개발자일 수 있음

이 가이드를 붙여넣은 사용자는 **비개발자일 확률이 높습니다.** 아래 원칙을 꼭 지켜줘:

1. **낯선 용어는 첫 등장 시 한 줄로 풀이**해줘 (예: "Node.js는 AI 도구가 돌아가는 엔진이에요").
2. **각 명령어 실행 전에 "이 단계에서 뭘 하는지" 한 줄** 설명해줘.
3. **명령어를 실행한 뒤 "성공하면 이렇게 나옵니다"를 보여주고**, 실제 출력이 다르면 함께 진단해줘.
4. **사용자가 "이게 뭐예요?"라고 물으면 기술 답변 전에 비유부터 써줘.**
5. **한 번에 한 단계씩** 진행. 여러 명령어를 쏟아붓지 말 것. 사용자가 답할 시간을 주기.

---

이 세팅을 시작하기 전에, 아래 질문을 먼저 해줘.
답변을 받은 뒤 해당하는 단계만 실행할 것.

## 사전 질문

1. **Python 프로젝트를 할 예정인가요?** (Yes/No)
   - Yes → 5번(Python 도구 설치) 실행
   - No → 5번 스킵

2. **Claude 구독(Pro/Max) 중인가요, API 키를 사용하나요?**
   - 구독 중 → 인증 관련 안내 스킵
   - API 키 → API 키 입력 안내 포함

3. **이미 ~/.claude/settings.json이 존재하나요?**
   - **setup-guide.md 6단계를 따라왔다면 → 있음 (Yes로 답)**. permissions만 들어있을 것.
   - Yes → 4번(병합 모드)로 처리. 기존 `permissions.allow` 등은 절대 건드리지 말고 `hooks.SessionStart`·`enabledPlugins`·`extraKnownMarketplaces`만 병합.
   - No → 처음부터 전체 세팅 (1번 백업은 빈 폴더면 스킵)

4. **AI에게 원하는 호칭이나 말투가 있나요?** (자유롭게 답변)
   - 예: "나를 '선배'라고 불러줘, 너는 '막내'야"
   - 예: "편하게 반말로 해줘"
   - 예: "존댓말로 해줘"
   - 딱히 없으면 → 호칭 섹션 생략, 기본 존댓말

---

질문 답변을 받았으면 아래 작업을 순서대로 실행해줘.
OS를 먼저 확인해 — Windows면 PowerShell, Mac/Linux면 bash. (Windows에서 sonmat 슬래시 명령은 setup-guide.md 7단계에서 이미 처리됨.)

> **기존 Claude Code 세팅이 있어도 OK.** 기존 설정 파일은 `.bak`으로 백업 후 새 설정으로 교체함. (사전 질문 3번에서 Yes면 병합 모드로 처리.)

## 1. 기존 설정 백업

`~/.claude/` 디렉토리가 이미 존재하면, 아래 파일들을 `.bak`으로 백업:
- `~/.claude/CLAUDE.md` → `~/.claude/CLAUDE.md.bak`
- `~/.claude/settings.json` → `~/.claude/settings.json.bak`

존재하지 않는 파일은 스킵.

## 2. 환경 및 사전 설치 확인

> setup-guide.md를 따라온 사용자라면 **git, Node.js, Claude Code CLI, sonmat 플러그인**이 이미 설치되어 있어야 한다. 아래로 빠르게 확인만 하고, 누락이 있으면 그때 안내한다.

```bash
git --version
node --version
claude --version
```

> 성공 신호 — 세 줄 모두 버전 번호가 출력.
> 실패 대응 — 누락된 항목이 있으면 setup-guide.md의 해당 단계로 돌려보낸다 (git/Node는 0단계, claude는 3단계).

sonmat 플러그인 설치 확인:

```bash
ls ~/.claude/plugins/marketplaces/sonmat 2>/dev/null && echo "sonmat OK" || echo "sonmat MISSING"
```

> `sonmat MISSING`이 나오면 채팅창에서 슬래시 명령으로 설치하도록 안내:
> ```
> /plugin marketplace add jun0-ds/sonmat
> /plugin install sonmat@sonmat
> ```
> 설치 후 채팅창을 닫았다 다시 열어야 활성화된다고 명시.

| 플러그인 | 역할 |
|---------|------|
| **sonmat** | AI의 사고·검증 규율 체계 — 코드를 짜기 전에 "이게 맞나?" 한 번 더 생각하게 만드는 플러그인 |

## 3. 글로벌 설정 생성

### 디렉토리 생성

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude"
```

**Mac/Linux:**
```bash
mkdir -p ~/.claude
```

### CLAUDE.md 생성

`~/.claude/CLAUDE.md` 파일 생성:

> **sonmat의 사고규율(Thinking/Action Rules)은 여기에 직접 쓰지 않는다.**
> setup-guide.md 7단계에서 설치한 sonmat 플러그인의 session-start 훅이 첫 실행 시
> `~/.claude/CLAUDE.md`에 discipline 파일 참조 블록(`## sonmat`)을 자동으로 심는다.
> Claude Code는 해당 경로의 최신 파일을 매 세션마다 읽으므로,
> sonmat이 업데이트되면 규율도 자동으로 최신화된다.

```markdown
# CLAUDE.md

Global instructions for all projects.

## 0. 호칭

(사전 질문 4번 답변을 바탕으로 작성. 예시:)
- 사용자 → 클로드: "(사용자가 정한 호칭)"
- 클로드 → 사용자: "(사용자가 정한 호칭)"
- (사용자가 원하는 말투 스타일)

## 1. Python Project Rules

- When refactoring or developing new Python projects, use the **Astral** toolchain:
  - **uv** for project/package management and script execution.
  - **ruff** for linting and formatting.
  - **ty** for type checking.

- **Always use `uv`**: When running Python scripts, installing dependencies, or managing the environment, you must use `uv`.
  - Example: `uv run python script.py` instead of `python script.py`
  - Example: `uv pip install package` instead of `pip install package`

## 2. Repository Setup

- sonmat hook이 git repo 진입 시 `CLAUDE.md`를 자동 생성한다 (없을 때만).
- 프로젝트 규칙은 처음부터 채우지 않는다. 대화 중 발견된 규칙을 사용자 확인 후 추가한다.
```

> 사전 질문 4번에서 호칭/말투 요청이 **없었으면** "## 0. 호칭" 섹션 자체를 제거하고 생성할 것.
> Python을 안 쓴다고 답했으면 "## 1. Python Project Rules" 섹션을 제거하고 생성할 것.

> **참고:** 첫 세션 실행 후 `~/.claude/CLAUDE.md` 하단에 아래 블록이 자동 추가됨:
> ```
> ## sonmat
> - Discipline: `~/.claude/plugins/marketplaces/sonmat/discipline/core.md`
> - Domain hints: `~/.claude/plugins/marketplaces/sonmat/discipline/hints.md`
> - Memory: `~/.claude/sonmat/memory/`
> ```

### settings.json 생성/병합

> ⚠️ **주의**: setup-guide.md 6단계에서 사용자가 이미 `~/.claude/settings.json`을 만들어 둔 상태가 default다. 이 경우 **`permissions.allow`를 절대 덮어쓰지 말고**, 아래 `hooks.SessionStart`·`enabledPlugins`·`extraKnownMarketplaces` 키만 추가 병합한다. 새로 만드는 경우에만 아래 전체 템플릿 사용.

> **Windows/Mac/Linux 자동 분기:** 아래 스크립트에서 OS를 확인하여 sonmat 훅 경로를 자동 결정한다.
> - `run-hook.cmd`가 존재하면 `.cmd` 사용 (Windows)
> - 없으면 `run-hook.sh` 사용 (Mac/Linux/WSL)

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm *)",
      "Bash(npx *)",
      "Bash(node *)",
      "Bash(python *)",
      "Bash(uv *)",
      "Bash(ruff *)"
    ]
  },
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "(훅 경로 — 아래 자동 분기 참조)",
            "async": false
          }
        ]
      }
    ]
  },
  "enabledPlugins": {
    "sonmat@sonmat": true
  },
  "extraKnownMarketplaces": {
    "sonmat": {
      "source": {
        "source": "github",
        "repo": "jun0-ds/sonmat"
      }
    }
  }
}
```

**훅 경로 자동 결정:**
```bash
SONMAT_HOOKS="$HOME/.claude/plugins/marketplaces/sonmat/hooks"
if [ -f "$SONMAT_HOOKS/run-hook.cmd" ]; then
  HOOK_CMD="$SONMAT_HOOKS/run-hook.cmd session-start"
else
  HOOK_CMD="bash $SONMAT_HOOKS/run-hook.sh session-start"
fi
```

이 결과값을 `settings.json`의 `hooks.SessionStart[0].hooks[0].command`에 넣을 것.

## 4. (선택) 병합 모드 — 사전 질문 3번에서 Yes일 때

기존 `~/.claude/settings.json`이 있으면 **덮어쓰지 말고** 아래 키만 병합:
- `hooks.SessionStart` — 위의 sonmat hook 추가
- `enabledPlugins` — `"sonmat@sonmat": true` 추가
- `extraKnownMarketplaces` — sonmat 마켓플레이스 추가

기존 permissions, 다른 hooks 등은 그대로 유지.

## 5. Python 개발 도구 설치 (사전 질문에서 Yes인 경우만)

### uv 설치

먼저 `uv --version`으로 설치 여부 확인. 없으면:

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Mac/Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

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

## 6. 최종 확인

아래 항목 체크해서 결과 알려줘 (해당 항목만):

- [ ] git, Node.js 18+, Claude Code CLI 모두 동작
- [ ] sonmat 플러그인 설치됨 (`~/.claude/plugins/marketplaces/sonmat` 존재)
- [ ] ~/.claude/CLAUDE.md 생성됨
- [ ] ~/.claude/settings.json 생성됨 (hooks, enabledPlugins, extraKnownMarketplaces 포함)
- [ ] (Python 선택 시) uv 설치됨
- [ ] (Python 선택 시) ruff 설치됨

전부 완료되면 "세팅 완료! 이제 시작하세요." 라고 알려줘.
