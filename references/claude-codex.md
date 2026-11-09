# Claude와 Codex 함께 쓰기

사용자에게 Claude 계정과 ChatGPT 계정이 모두 있으면 두 에이전트를 함께 설치해 역할을 나눕니다. Claude는 디렉터로서 요청을 해석하고 설계·검토·보고를 맡고, Codex는 실무자로서 코드를 고치고 테스트를 돌립니다. 사용자는 평소처럼 Claude와 대화하면 되고, Claude가 필요할 때 Codex에게 일을 맡깁니다.

계정이 하나뿐이면 이 문서는 건너뜁니다. 두 계정이 모두 있는지 모르면 “Claude와 ChatGPT 유료 계정이 둘 다 있나요?”처럼 한 번만 묻습니다.

## 준비할 것

| 항목 | 위치 | 통과 증거 |
|---|---|---|
| 두 번째 에이전트 설치·로그인 | [최초 설치](../guides/first-agent.md)의 해당 에이전트 절 | 새 PowerShell에서 `claude --version`·`codex --version` 둘 다 성공, 각각 실제 답변 |
| Codex 권한 | `~/.codex/config.toml` | `approval_policy = 'never'`·`sandbox_mode = 'danger-full-access'` |
| Claude 위임 허용 | `~/.claude/settings.json` | `permissions.allow`에 `PowerShell(codex-delegate *)` |
| 위임 명령 | `%USERPROFILE%\.local\bin\codex-delegate.ps1` | Claude의 PowerShell에서 `Get-Command codex-delegate`가 이 파일을 가리킴 |
| 디렉터 규칙 | `%USERPROFILE%\.claude\rules\claude-codex-director.md` | 새 Claude 세션이 역할 분담을 설명할 수 있음 |

## 진행

1. 아직 설치하지 않은 쪽을 [최초 설치](../guides/first-agent.md)와 같은 순서(설치 → PATH 등록 → 확인)로 설치합니다. 로그인은 사용자가 브라우저에서 직접 마치도록 한 번에 하나씩 안내합니다.
2. 새로 설치한 쪽의 권한은 설치가 끝난 뒤의 수준으로 바로 맞춥니다. Codex는 `approval_policy = 'never'`·`sandbox_mode = 'danger-full-access'`, Claude는 [5. Paseo](../stages/03-paseo/CONTEXT.md)의 권한 조정과 같은 `auto` 설정입니다. 기존 설정 파일의 다른 내용은 그대로 둡니다. 어느 쪽을 새로 설치했든 Claude의 `permissions.allow`에 `PowerShell(codex-delegate *)`를 더합니다. `auto` 모드는 `PowerShell` 같은 넓은 허용 규칙은 무시하지만 이렇게 좁은 규칙은 그대로 적용하므로, 위임 명령이 판정 모델에 막히지 않습니다. Codex는 `never`로 묻지 않고 실행되므로 위임받은 작업 중에 확인 창이 뜨지 않습니다.
3. 가이드 소스의 `scripts/codex-delegate.ps1`을 `%USERPROFILE%\.local\bin\codex-delegate.ps1`로 복사합니다. 이 폴더는 Claude 설치 때 PATH에 들어가 있습니다. 파일은 ASCII로만 돼 있으므로 내용을 고칠 때도 한글을 넣지 않습니다.
4. 가이드 소스의 `templates/claude-codex-director.md`를 `%USERPROFILE%\.claude\rules\claude-codex-director.md`로 복사합니다. 이 폴더의 규칙은 모든 프로젝트의 Claude 세션에 자동으로 실립니다. 같은 이름의 파일이 있으면 덮지 말고 차이를 확인합니다.
5. 작업공간에 임시 확인 폴더를 만들고, 새 Claude 세션에서 작은 코드 작업 하나(예: 두 수를 더하는 스크립트와 그 테스트)를 맡겨 봅니다. Claude가 직접 고치지 않고 `codex-delegate`로 맡긴 뒤 결과를 확인해 보고하면 통과입니다. 확인이 끝나면 임시 폴더를 정리합니다.
6. Paseo에서 Claude와 Codex가 모두 제공자로 보이는지 확인합니다. 사용자에게는 평소에는 Paseo에서 Claude를 열어 대화하면 되고, Codex를 직접 열 필요는 없다고 안내합니다.

## 출력

두 에이전트의 경로·버전·로그인 확인, 권한 상태, `codex-delegate.ps1`과 디렉터 규칙의 위치, 위임 시험 결과(Codex `session`·종료 코드·Claude의 확인 내용)를 로컬 상태에 기록합니다.

## 되돌리기

역할 분담을 그만두려면 `%USERPROFILE%\.claude\rules\claude-codex-director.md`를 지웁니다. 그러면 Claude는 다시 직접 작업합니다. `codex-delegate.ps1`은 남아 있어도 쓰이지 않습니다.

[가이드 라우터](../CONTEXT.md) · [Claude 사용자 규칙](https://code.claude.com/docs/en/memory#user-level-rules) · [Claude PowerShell 도구](https://code.claude.com/docs/en/tools-reference#powershell-tool)
