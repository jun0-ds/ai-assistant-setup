# 5. Paseo 준비

## 입력

| 자료 | 범위 | 이유 |
|---|---|---|
| [Paseo 시작 안내](https://paseo.sh/docs) | Desktop·Prerequisites | 데스크톱 앱과 CLI 구분 |
| [Windows 경로](../../references/windows-paths.md) | Paseo에서만 못 찾을 때 | 데몬의 실행 환경 확인 |
| `state/setup-status.md` | 경로·버전·작업공간 | 이미 성공한 환경과 비교 |

## 진행

1. 기존 Paseo의 버전·구동 방식·호스트·포트를 읽습니다. Paseo가 없으면 [공식 Windows 앱](https://paseo.sh/download)을 설치합니다. 데스크톱 앱에 데몬이 들어 있으므로 CLI 데몬을 따로 설치하지 않습니다.
2. 앱에서 localhost 호스트에 연결합니다. 기본 예시는 `127.0.0.1:6767`이지만 기존에 쓰던 포트가 있으면 그대로 씁니다.
3. 선택한 제공자를 실행합니다. 인식하지 못하면 Providers → Diagnostic의 Resolved path·Daemon PATH·Version을 3단계 결과와 비교합니다. CLI가 있으면 `paseo --host 127.0.0.1:<포트> provider diagnostic <agent> --json`도 씁니다.
4. PATH·바이너리·프로세스 중 무엇이 다른지 가려서 고칩니다. 필요하면 검증한 절대경로를 해당 제공자의 command에 병합합니다. 다른 계정이나 제공자로 우회하지 않습니다.
5. 설정은 필요한 키만 바꾸고 공식 reload 결과를 읽습니다. 시작 설정이나 프로세스 환경을 바꿔 재실행이 필요하면 현재 대화에 미치는 영향과 재개 방법을 먼저 안내합니다. 자기 에이전트를 띄운 데몬을 함부로 재시작하지 않습니다.
6. 앱에서 실제 작업 폴더를 고르고 답변을 받습니다. 폴더 안의 확인용 파일도 읽게 합니다. TCP 연결이나 버전 표시만으로는 통과시키지 않습니다.
7. 새 PowerShell에서도 처음 설치한 에이전트가 계속 실행되는지 확인합니다. 로컬 사용이 다른 기기 연결 방식에 의존하지 않게 합니다.
8. 사용자에게 Claude와 ChatGPT 계정이 모두 있으면 [Claude·Codex 함께 쓰기](../../references/claude-codex.md)를 적용합니다. Claude 설정 폴더에 규칙을 써야 하므로 아래 권한 조정보다 먼저 합니다.
9. Paseo에서 실제 응답을 확인했으면 설치용으로 열어 둔 권한을 평소 수준으로 조정합니다. 바꾸기 전에 무엇이 달라지는지 사용자에게 알립니다.
   - Claude: `~/.claude/settings.json`의 `permissions.defaultMode`를 `auto`로 바꾸고, `permissions.allow`에 `Read`·`Write`·`Edit`·`Glob`·`Grep`·`WebSearch`·`WebFetch`·`Bash`·`PowerShell`·`Skill`을 더합니다. 기존 allow·deny 항목과 다른 키는 그대로 둡니다. `auto`에서는 일상 작업은 묻지 않고, 판정 모델이 위험한 작업만 걸러 냅니다.
   - Codex: `approval_policy = 'never'`·`sandbox_mode = 'danger-full-access'`를 그대로 둡니다.
   - 새 세션에서 Claude가 `auto` 모드로 시작하는지 확인합니다. 계정·모델 조건으로 `auto`를 쓸 수 없어 매번 묻는 모드로 시작하면 사용자에게 알리고, 어떤 수준으로 둘지 추천과 함께 묻습니다. Paseo에서 에이전트별 권한 모드를 고를 수 있으면 같은 수준으로 맞춥니다.

## 출력

localhost 주소와 실제 포트, 앱·데몬 구동 방식, Paseo가 찾은 바이너리, 인증·실제 응답·작업 파일 접근 결과, CLI로 복구하는 방법, 조정한 권한 상태, Claude·Codex 역할 분담 적용 여부를 기록합니다.

다른 기기가 필요하면 [6. 모바일](../04-mobile/CONTEXT.md)로 가고, 필요 없으면 건너뜀으로 기록한 뒤 [7. 첫 작업](../05-first-task/CONTEXT.md)으로 갑니다.
