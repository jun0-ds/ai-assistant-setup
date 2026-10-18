# 익숙해진 뒤 WSL로 옮기기

처음에는 Windows에서 설치·로그인·작업을 끝낼 수 있어요. Linux 도구가 필요해지면 사용 중인 에이전트에게 이 문서를 읽고 현재 작업공간에서 WSL 이관 계획을 세워 달라고 해요. 처음부터 다시 시작할 필요는 없어요.

## 이관 전에 읽을 입력

현재 setup-status, Windows 작업공간의 활성 작업·문턱 데이터·기존 지침, 운영 중 앱/데몬과 경로 의존을 확인해요. [Microsoft WSL 설치](https://learn.microsoft.com/windows/wsl/install), [Codex WSL](https://developers.openai.com/codex/windows), [Claude WSL 설치](https://code.claude.com/docs/en/setup#install-in-wsl)의 현재 안내를 읽어요.

## 진행 순서

1. Linux가 필요한 작업과 옮길 범위를 정해요. 자료만 공유할지, 프로젝트를 Linux 파일시스템으로 옮길지, Paseo 데몬도 옮길지 구분해요.
2. 사용자에게 WSL 설치·재부팅 등 직접 할 일을 안내해요. Windows의 기존 환경은 작동하는 복구 경로로 남겨요.
3. WSL 안에 Linux용 에이전트를 설치하고 그 환경에서 직접 로그인해요. Windows `.exe`·설정 홈·인증 토큰을 그대로 복사하지 않아요.
4. 실제 경로로 자료와 프로젝트를 연결해요. Windows `C:\…`와 WSL `/mnt/c/…`·Linux 홈을 구분하고 동시에 같은 파일을 수정하는 작업을 피하도록 운영 방법을 정해요.
5. 문턱 설치기는 플랫폼별 지원 범위를 읽어요. Windows PowerShell 설치기를 Linux 설치기라고 실행하지 않아요. 기존 Bash 설치기는 이번 Windows판과 기능이 동등하다고 가정하지 말고 agent가 필요한 로컬 scaffold·진입 지침을 확인해요.
6. 새 환경에서 일반 폴더 작업·문맥 로딩·쓰기·업데이트 확인·기존 기록 재조회를 다시 검사해요. 손맛/대화 로그의 절대경로 연결도 확인해요.
7. Paseo를 Windows에서 유지할지 WSL 데몬에 붙일지 구분하고, 실제 provider 진단·로컬 응답·원격 응답을 다시 확인해요. 두 데몬을 무심코 같은 포트·다른 데이터로 띄우지 않아요.

## 출력

옮긴 자료와 유지한 자료, 새 경로·인증 환경·Paseo 호스트, 실제 검증과 미확인, Windows로 돌아가는 방법을 남겨요. WSL 전체 자동 이관은 이 가이드가 보장하는 기능이 아니며 기존 자료 삭제는 검증 뒤 별도 판단해요.
