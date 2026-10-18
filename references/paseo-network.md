# localhost와 다른 기기의 연결

이 컴퓨터에서 쓸 때는 이 컴퓨터의 localhost에, 다른 기기에서는 PC의 Tailnet IP에 접속하는 경로를 함께 유지해요. 폰의 `127.0.0.1`은 폰 자신이에요.

```text
같은 PC의 Paseo ── 127.0.0.1:실제포트 ── PC의 데몬
다른 기기의 Paseo ── PC의 Tailnet IP:전달포트 ── Tailscale TCP 전달 ── 같은 데몬
```

아래 TCP 전달은 Tailscale의 공식 기능을 조합한 설정안이에요. Paseo 공식 문서의 Tailnet IP 단독 bind 예시와는 달라요. 실제 Windows·다른 기기에서 두 경로가 작동하는지는 설치 단계에서 검증해야 해요.

## Tailscale로 연결하기

1. PC와 다른 기기에 공식 Tailscale·Paseo 앱을 준비하고 같은 tailnet에 로그인해요. 이미 허용된 기기 공유나 접근 정책이 있다면 그 범위를 사용해요.
2. 먼저 PC에서 localhost로 실제 에이전트 응답을 받아요. 데몬의 실제 bind·포트를 확인해요. 예시는 `127.0.0.1:6767`이에요.
3. 다른 기기에 접근을 열기 전 Paseo의 비밀번호 인증과 tailnet 접근 범위를 확인해요. 비밀번호 설정은 사용자가 직접 하고 문서·채팅·명령 인자에 넣지 않아요. 기존 비밀번호를 초기화하지 않아요. 인증을 추가하면 로컬 앱도 새 인증을 확인해야 해요. [Paseo 보안 안내](https://paseo.sh/docs/security)
4. 기존 Serve 설정과 Tailnet IP를 확인해요.

```powershell
tailscale ip -4
tailscale serve status --json
```

5. 같은 Tailnet 포트가 이미 사용 중이면 덮지 말고 그 용도를 확인해요. Paseo가 이미 `0.0.0.0`에 bind했다면 소켓·공개 범위를 확인하고 기존 연결을 보존할 안부터 정해요. localhost 주소를 Tailnet IP 하나로 치환하는 것은 두 경로 유지의 통과 조건을 충족하지 않아요.
6. 추가할 규칙과 범위를 설명하고 Windows 관리자 터미널에서 실행해요. 아래는 **PC의 로컬 데몬 포트도 6767이고 Tailnet 포트도 비어 있을 때**의 예시예요.

```powershell
tailscale serve --bg --tcp=6767 tcp://127.0.0.1:6767
tailscale serve status
```

로컬 포트가 다르면 대상 URL을, Tailnet 포트가 다르면 `--tcp` 값을 바꿔요. 전체 Serve reset, Funnel, 공인 포트 개방은 이 경로에 필요하지 않아요. `--bg`는 이 전달을 백그라운드로 유지하는 옵션이에요. 명령 성공이 앱 원격 성공을 뜻하지는 않아요.

7. 다른 기기에서 Tailscale을 연결하고 Paseo의 Direct connection에 **PC의 Tailnet IP와 전달 포트**를 넣어요. 이 raw TCP 예시에서는 앱의 SSL 옵션을 끄고 Tailnet의 암호화 경로를 사용해요. PC의 앱은 기존 localhost 호스트를 유지해요.
8. 다른 기기에서 실제 에이전트 답변과 작업 파일 접근을 확인하고 PC localhost에서도 다시 답변을 받아요. 같은 PC에서 Tailnet IP로 열어본 결과만으로 원격 성공을 보고하지 않아요.
9. Tailscale이 끊긴 상태에서도 PC의 localhost 접속이 되는지 확인해요. 재부팅·절전·앱 종료 이후의 상태는 실제 시험한 범위만 기록해요.

## 되돌리기

이번에 새로 추가한 포트 전달만 해제해요. 아래는 예시의 6767을 새로 추가했을 때예요.

```powershell
tailscale serve --bg --tcp=6767 off
```

기존 설정이 있었으면 기록한 원래 설정을 복원해요. `tailscale serve reset`은 다른 전달까지 지우므로 사용하지 않아요. 해제 후 PC localhost 응답을 다시 확인해요.

## 릴레이를 선택할 때

Tailscale을 쓰지 않기로 선택하면 Paseo의 공식 Pair Device·암호화 릴레이 경로를 사용할 수 있어요. 이 경우 Tailnet IP 연결은 검사 대상이 아니며 릴레이 사용으로 기록해요. Tailscale 구성을 요청했는데 실패했다고 몰래 릴레이로 바꿔 통과시키지 않아요. [Paseo 연결 안내](https://paseo.sh/docs/connectivity)

## 원격 사용 중 기억할 것

PC 전원·네트워크·Paseo 데몬이 유지돼야 해요. 앱이 관리하는 데몬과 별도로 등록한 서비스는 시작/종료 방식이 다르므로 실제 구동 방식을 안내해요. 절전 모드에서는 원격 접속이 끊길 수 있어요. Tailscale 경로는 양쪽 Tailscale 연결도 필요해요. PC에서 선택한 작업 폴더의 파일을 수정하며, 폰에 파일이 자동 복사되는 것은 아니에요.

[선택 모바일 단계](../stages/04-mobile/CONTEXT.md) · [Tailscale TCP 전달 공식 문서](https://tailscale.com/docs/reference/tailscale-cli/serve) · [Windows 예제](https://tailscale.com/docs/reference/examples/serve)
