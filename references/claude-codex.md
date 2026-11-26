# Claude와 Codex 함께 쓰기

사용자에게 Claude 계정과 ChatGPT 계정이 모두 있으면 두 에이전트를 함께 설치해 역할을 나눕니다. Claude는 디렉터로서 요청을 해석하고 설계·검토·보고를 맡고, Codex는 실무자로서 코드를 고치고 테스트를 돌립니다. 사용자는 평소처럼 Claude와 대화하면 되고, Claude가 필요할 때 Codex에게 일을 맡깁니다.

계정이 하나뿐이면 이 문서는 건너뜁니다. 두 계정이 모두 있는지 모르면 “Claude와 ChatGPT 유료 계정이 둘 다 있나요?”처럼 한 번만 묻습니다.

## 준비할 것

| 항목 | 위치 | 통과 증거 |
|---|---|---|
| 두 번째 에이전트 설치·로그인 | [최초 설치](../guides/first-agent.md)의 해당 에이전트 절 | 새 PowerShell에서 `claude --version`·`codex --version` 둘 다 성공, 각각 실제 답변 |
| Codex 권한 | `~/.codex/config.toml` | `approval_policy = 'never'`·`sandbox_mode = 'danger-full-access'` |
| 새 에이전트의 문턱 연결 | 문턱 `setup.ps1` 재실행 | Codex는 `~/.codex/AGENTS.md`에 `munteok:codex` 블록이 있고, 작업공간 안 하위 폴더에서 연 새 세션이 작업공간 규칙을 설명함 |
| 새 에이전트의 손맛 | [손맛 설치](https://github.com/jun0-ds/sonmat#install) | Claude는 `/plugin` 목록에, Codex는 `codex plugin list`에 sonmat이 보임. Codex는 새 세션 시작 때 훅 검토 경고가 나오지 않음 |
| Claude 위임 허용 | `~/.claude/settings.json` | `permissions.allow`에 `PowerShell(codex-delegate *)` |
| 위임 명령 | `%USERPROFILE%\.local\bin\codex-delegate.ps1` | Claude의 PowerShell에서 `Get-Command codex-delegate`가 이 파일을 가리킴 |
| 디렉터 규칙 | `%USERPROFILE%\.claude\rules\claude-codex-director.md` | 새 Claude 세션이 역할 분담을 설명할 수 있음 |

## 진행

1. 아직 설치하지 않은 쪽을 [최초 설치](../guides/first-agent.md)와 같은 순서(설치 → PATH 등록 → 확인)로 설치합니다. 로그인은 사용자가 브라우저에서 직접 마치도록 한 번에 하나씩 안내합니다.
2. 새로 설치한 쪽의 권한은 설치가 끝난 뒤의 수준으로 바로 맞춥니다. Codex는 `approval_policy = 'never'`·`sandbox_mode = 'danger-full-access'`, Claude는 [5. Paseo](../stages/03-paseo/CONTEXT.md)의 권한 조정과 같은 `auto` 설정입니다. 기존 설정 파일의 다른 내용은 그대로 둡니다. 어느 쪽을 새로 설치했든 Claude의 `permissions.allow`에 `PowerShell(codex-delegate *)`를 더합니다. `auto` 모드는 `PowerShell` 같은 넓은 허용 규칙은 무시하지만 이렇게 좁은 규칙은 그대로 적용하므로, 위임 명령이 판정 모델에 막히지 않습니다. Codex는 `never`로 묻지 않고 실행되므로 위임받은 작업 중에 확인 창이 뜨지 않습니다.
3. 새로 설치한 쪽에도 문턱을 연결합니다. [4. 작업공간](../stages/02-workspace/CONTEXT.md)에서 쓴 문턱 소스의 `setup.ps1`을 같은 `-WorkspaceRoot`로 한 번 더 실행합니다. 사용자 파일은 그대로 두고 관리 블록만 갱신합니다. Codex가 설치돼 있으면 이때 `~/.codex/AGENTS.md`에 작업공간 안내 블록이 들어갑니다. Codex는 git 저장소가 아닌 상위 폴더의 `AGENTS.md`를 스스로 읽지 않으므로, 이 블록이 없으면 작업공간 안의 프로젝트 폴더에서 연 Codex가 문턱 문맥 없이 시작합니다. Claude는 작업공간의 `CLAUDE.md`를 상위 폴더에서도 읽으므로 따로 할 일이 없습니다.
4. 새로 설치한 쪽에 손맛을 설치합니다. 설치 방식이 에이전트마다 다릅니다.
   - Claude: Claude 세션에서 `/plugin marketplace add jun0-ds/sonmat`, `/plugin install sonmat@sonmat`을 실행합니다. 다음 세션부터 규율이 실립니다.
   - Codex: PowerShell에서 `codex plugin marketplace add jun0-ds/sonmat`, `codex plugin add sonmat@sonmat`을 실행합니다. 설치만으로는 손맛이 켜지지 않습니다. Codex는 플러그인 훅을 사용자가 검토하고 신뢰해야 실행하기 때문입니다. 사용자에게 새 PowerShell에서 `codex`를 열고 `/hooks`를 입력한 뒤, 목록에서 sonmat의 SessionStart 훅을 골라 신뢰하도록 안내합니다. 성공하면 다음에 Codex를 열 때 훅을 검토하라는 경고가 나오지 않습니다. 이어서 새 Codex 세션에서 훅이 알려 주는 에이전트 설치 명령(`bash …/install-codex-agents.sh`)을 내용을 확인한 뒤 실행합니다. 이 훅과 설치기는 bash로 돌아가므로 Git for Windows가 있어야 합니다. 훅이 실행되지 않거나 bash 오류가 나면 그 메시지를 상태에 남기고 미확인으로 기록합니다.
5. 가이드 소스의 `scripts/codex-delegate.ps1`을 `%USERPROFILE%\.local\bin\codex-delegate.ps1`로 복사합니다. 이 폴더는 Claude 설치 때 PATH에 들어가 있습니다. 파일은 ASCII로만 돼 있으므로 내용을 고칠 때도 한글을 넣지 않습니다.
6. 가이드 소스의 `templates/claude-codex-director.md`를 `%USERPROFILE%\.claude\rules\claude-codex-director.md`로 복사합니다. 이 폴더의 규칙은 모든 프로젝트의 Claude 세션에 자동으로 실립니다. 같은 이름의 파일이 있으면 덮지 말고 차이를 확인합니다.
7. 작업공간에 임시 확인 폴더를 만들고, 새 Claude 세션에서 작은 코드 작업 하나(예: 두 수를 더하는 스크립트와 그 테스트)를 맡겨 봅니다. Claude가 직접 고치지 않고 `codex-delegate`로 맡긴 뒤 결과를 확인해 보고하면 통과입니다. 확인이 끝나면 임시 폴더를 정리합니다.
8. Paseo에서 Claude와 Codex가 모두 제공자로 보이는지 확인합니다. 사용자에게는 평소에는 Paseo에서 Claude를 열어 대화하면 되고, Codex를 직접 열 필요는 없다고 안내합니다.

## 출력

두 에이전트의 경로·버전·로그인 확인, 권한 상태, 문턱 재실행 결과와 Codex 안내 블록 위치, 손맛 설치·Codex 훅 신뢰·에이전트 설치 결과, `codex-delegate.ps1`과 디렉터 규칙의 위치, 위임 시험 결과(Codex `session`·종료 코드·Claude의 확인 내용)를 로컬 상태에 기록합니다.

## 되돌리기

역할 분담을 그만두려면 `%USERPROFILE%\.claude\rules\claude-codex-director.md`를 지웁니다. 그러면 Claude는 다시 직접 작업합니다. `codex-delegate.ps1`은 남아 있어도 쓰이지 않습니다.

[가이드 라우터](../CONTEXT.md) · [Claude 사용자 규칙](https://code.claude.com/docs/en/memory#user-level-rules) · [Claude PowerShell 도구](https://code.claude.com/docs/en/tools-reference#powershell-tool)
