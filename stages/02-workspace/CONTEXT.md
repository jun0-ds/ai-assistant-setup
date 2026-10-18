# 02 · 문턱과 작업공간

## 입력

| 자료 | 범위 | 이유 |
|---|---|---|
| `state/setup-status.md` | 환경·기존 경로 | 같은 계정·환경에서 이어가요. |
| [문턱 v0.2.0](https://github.com/jun0-ds/munteok/tree/v0.2.0) | README·setup.ps1·VERSION | 사용하는 설치 계약이에요. |
| [작업공간](../../references/workspace.md) | 전체 | 공통/프로젝트 문맥을 나눠요. |

## 진행

1. 업무·개인 파일을 둘 작업공간 위치를 정해요. 기본 제안은 실제 Windows 문서 폴더의 `AgentWorkspace`예요. 이미 알려준 경로는 유지하고 OneDrive 등 실제 문서 경로를 확인해요.
2. [문턱 v0.2.0 ZIP](https://github.com/jun0-ds/munteok/archive/refs/tags/v0.2.0.zip)을 준비 폴더 `source/`에 받아 VERSION·setup.ps1을 읽어요. 재귀 clone·SSH 키 등록은 필요 없어요.
3. `powershell -NoProfile -ExecutionPolicy Bypass -File <munteok-source>/setup.ps1 -WorkspaceRoot <절대경로>`로 설치해요. 소스와 작업공간을 분리해요. 컴퓨터 전체 실행 정책은 바꾸지 않아요.
4. root AGENTS·CLAUDE adapter·CONTEXT, `.munteok`, 업무·개인·보관을 확인해요. 기존 파일을 초기화하지 않아요. 비관리 CLAUDE 충돌이 있으면 자동 이관 대신 기존 지침을 확인해요.
5. 호칭·협업 방식은 공통 core, 회사·개인 자료는 해당 범위에 두도록 안내해요. 불필요하게 긴 사용자 프로필을 수집하지 않아요.
6. 손맛은 [해당 에이전트 설치 경로](https://github.com/jun0-ds/sonmat#install)로 연결하고 더듬이는 [검색 방법론](https://github.com/jun0-ds/deodeumi)을 연결해요. 손맛 훅의 Bash 의존성이 있으면 Git for Windows만 별도 확인해요. 보부상·사랑채·자동 동기화는 기본 설치하지 않아요.
7. 새 작업공간에서 에이전트를 열어 AGENTS/CLAUDE→CONTEXT→선택한 범위의 문맥을 실제 읽는지 확인해요. 폴더가 존재한다고 통과시키지 않아요. 새 세션이 필요하면 상태를 먼저 저장해요.

## 출력

작업공간·문턱 소스/데이터·버전·인덱스 위치, 기존 파일 보존, 손맛/더듬이 연결과 미확인을 기록해요.

통과하면 [03 Paseo](../03-paseo/CONTEXT.md)로 가요. 릴리스·설치 계약이 다르면 임의의 다른 버전을 성공으로 간주하지 말고 [버전 오류](../../references/troubleshooting.md#버전과-다운로드)를 확인해요.
