# 4. 작업공간 준비

## 입력

| 자료 | 범위 | 이유 |
|---|---|---|
| `state/setup-status.md` | 환경·기존 경로 | 같은 계정·환경에서 이어 가기 |
| [문턱 v0.2.0](https://github.com/jun0-ds/munteok/tree/v0.2.0) | README·setup.ps1·VERSION | 사용할 설치 계약 |
| [작업공간](../../references/workspace.md) | 전체 | 공통 문맥과 프로젝트 문맥 구분 |

## 진행

1. 업무·개인 파일을 둘 작업공간 위치를 정합니다. 처음 만들 때 기본 위치는 C 드라이브 바로 아래의 `C:\AgentWorkspace`입니다. 문서 폴더는 OneDrive 동기화나 한글·공백 경로가 섞이기 쉬워서 쓰지 않습니다. 사용자가 이미 알려 준 경로나 기존 작업공간이 있으면 그대로 씁니다. 회사 PC 정책 등으로 `C:\` 바로 아래에 폴더를 만들 수 없으면 그 사실을 설명하고 사용자와 다른 위치를 정합니다.
2. [문턱 v0.2.0 ZIP](https://github.com/jun0-ds/munteok/archive/refs/tags/v0.2.0.zip)을 준비 폴더의 `source/`에 받고 VERSION·setup.ps1을 읽습니다. 재귀 clone이나 SSH 키 등록은 필요 없습니다.
3. `powershell -NoProfile -ExecutionPolicy Bypass -File <munteok-source>/setup.ps1 -WorkspaceRoot C:\AgentWorkspace`로 설치합니다. 1번에서 다른 위치를 정했다면 그 절대경로를 넣습니다. 소스와 작업공간은 분리하며, 컴퓨터 전체의 실행 정책은 바꾸지 않습니다.
4. root AGENTS·CLAUDE adapter·CONTEXT, `.munteok`, 업무·개인·보관 폴더가 생겼는지 확인합니다. 기존 파일은 초기화하지 않습니다. 관리되지 않는 CLAUDE 파일과 충돌하면 자동으로 옮기지 말고 기존 지침부터 확인합니다.
5. 호칭·협업 방식은 공통 core에, 회사·개인 자료는 해당 범위에 두도록 안내합니다. 필요 이상으로 긴 사용자 프로필을 수집하지 않습니다.
6. 손맛은 [해당 에이전트 설치 경로](https://github.com/jun0-ds/sonmat#install)로, 더듬이는 [검색 방법론](https://github.com/jun0-ds/deodeumi)으로 연결합니다. 손맛 훅이 Bash에 의존하면 Git for Windows가 있는지만 따로 확인합니다. 보부상·사랑채·자동 동기화는 기본으로 설치하지 않습니다.
7. 새 작업공간에서 에이전트를 열어 AGENTS/CLAUDE → CONTEXT → 선택한 범위의 문맥을 실제로 읽는지 확인합니다. 폴더가 있다는 것만으로 통과시키지 않습니다. 새 세션이 필요하면 상태부터 저장합니다.

## 출력

작업공간 위치, 문턱 소스·데이터 위치와 버전, 인덱스 위치, 기존 파일 보존 여부, 손맛·더듬이 연결과 미확인 항목을 기록합니다.

통과하면 [5. Paseo](../03-paseo/CONTEXT.md)로 갑니다. 릴리스나 설치 계약이 다르면 임의의 다른 버전을 성공으로 보지 말고 [버전 오류](../../references/troubleshooting.md#버전과-다운로드)를 확인합니다.
