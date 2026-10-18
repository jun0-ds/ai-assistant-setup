# 5. Paseo 준비

## 입력

| 자료 | 범위 | 이유 |
|---|---|---|
| [Paseo 시작 안내](https://paseo.sh/docs) | Desktop·Prerequisites | 데스크톱 앱과 CLI를 구분해요. |
| [Windows 경로](../../references/windows-paths.md) | Paseo에서만 못 찾을 때 | 데몬의 실행 환경을 확인해요. |
| `state/setup-status.md` | 경로·버전·작업공간 | 이미 성공한 환경과 비교해요. |

## 진행

1. 기존 Paseo의 버전·구동 방식·호스트·포트를 읽어요. 없으면 [공식 Windows 앱](https://paseo.sh/download)을 설치해요. 데스크톱 앱이 데몬을 포함하므로 별도 CLI 데몬을 중복 설치하지 않아요.
2. 앱에서 localhost 호스트에 연결해요. 기본 예시는 `127.0.0.1:6767`이지만 실제 기존 포트를 유지해요.
3. 선택한 제공자를 실행해요. 인식 실패 시 Providers → Diagnostic의 Resolved path·Daemon PATH·Version을 3단계와 비교해요. CLI가 있으면 `paseo --host 127.0.0.1:<포트> provider diagnostic <agent> --json`도 사용해요.
4. PATH·바이너리·프로세스가 다른지 구분해 고쳐요. 필요하면 검증한 절대경로를 해당 제공자의 command에 병합해요. 다른 계정이나 제공자로 우회하지 않아요.
5. 설정은 필요한 키만 변경하고 공식 reload 결과를 읽어요. 시작 설정·프로세스 환경 변경에 재실행이 필요하면 현재 대화 영향과 재개 방법을 먼저 안내해요. 자기 에이전트를 띄운 데몬을 무작정 재시작하지 않아요.
6. 앱에서 실제 작업 폴더를 선택하고 답변을 받아요. 폴더의 확인용 파일도 읽게 해요. TCP 연결·버전 표시만으로 통과하지 않아요.
7. 새 PowerShell에서도 최초 에이전트가 계속 실행되는지 확인해요. 로컬 사용은 Tailscale 연결에 의존하지 않도록 해요.

## 출력

localhost 주소·실제 포트, 앱/데몬 구동 방식, Paseo가 찾은 바이너리, 인증·실제 응답·작업 파일 접근, CLI 복구 방법을 기록해요.

다른 기기가 필요하면 [6. 모바일](../04-mobile/CONTEXT.md), 아니면 건너뜀을 기록하고 [7. 첫 작업](../05-first-task/CONTEXT.md)으로 가요.
