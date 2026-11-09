# localhost와 다른 기기의 연결

이 컴퓨터에서 쓸 때는 이 컴퓨터의 localhost에 접속합니다. 휴대폰 같은 다른 기기는 Paseo의 QR 연결을 기본으로 씁니다. Tailscale은 필수가 아닙니다. 휴대폰에서 `127.0.0.1`은 휴대폰 자신을 가리킵니다.

```text
같은 PC의 Paseo ── 127.0.0.1:실제포트 ── PC의 데몬
휴대폰의 Paseo ── QR로 연결 ── Paseo 암호화 릴레이 ── 같은 데몬
〔선택〕 다른 기기의 Paseo ── PC의 Tailnet IP:전달포트 ── Tailscale TCP 전달 ── 같은 데몬
```

## QR로 연결하기

릴레이는 PC와 휴대폰 사이를 이어 주는 Paseo의 중계 서버입니다. 공식 문서에 따르면 Tailscale·포트 포워딩·네트워크 설정 없이 동작합니다. 내용은 종단 간 암호화되며, 릴레이가 볼 수 있는 것은 IP 주소·시각·메시지 크기·세션 ID뿐입니다. 릴레이는 사용자가 켜기 전까지 꺼져 있습니다. [Paseo 연결 안내](https://paseo.sh/docs/connectivity) · [보안 안내](https://paseo.sh/docs/security)

1. 먼저 PC의 localhost에서 실제 에이전트 응답을 받습니다.
2. PC의 Paseo 앱에서 설정 → 해당 host → Pair a device를 열고 Enable relay를 선택합니다. 앱 없이 CLI로 구동한다면 `paseo daemon pair`를 실행합니다.
3. 휴대폰의 Paseo 앱으로 QR을 스캔합니다. 스캔할 수 없으면 페어링 링크를 복사해 앱의 Paste pairing link에 붙여 넣습니다.
4. QR과 페어링 링크는 비밀번호처럼 다룹니다. 채팅·사진·공유 문서로 보내지 않습니다. Paseo 비밀번호를 설정하지 않았다면 이것을 가진 사람은 누구나 연결할 수 있고, 공식 문서에는 유출 뒤 무효화하는 절차가 없습니다. 더 단단히 막으려면 사용자가 직접 비밀번호를 설정합니다. 비밀번호를 설정하면 릴레이로 연결하는 기기도 비밀번호를 입력해야 합니다.
5. 휴대폰에서 실제 에이전트 답변과 작업 파일 접근을 확인합니다. 가능하면 휴대폰의 Wi-Fi를 끄고 모바일 데이터로도 확인합니다. PC의 localhost에서도 다시 답변을 받습니다.

## Tailscale로 연결하기

이미 Tailscale을 쓰고 있거나 사용자가 직접 원할 때 고르는 선택 경로입니다. 아래 TCP 전달은 Tailscale의 공식 기능을 조합한 설정안으로, Paseo 공식 문서에 나온 Tailnet IP 단독 bind 예시와는 다릅니다. 실제 Windows와 다른 기기에서 두 경로가 모두 작동하는지는 설치 단계에서 검증합니다. 사용자가 Tailscale 구성을 요청했는데 실패했다면 몰래 QR로 바꿔 통과시키지 말고 사용자에게 설명한 뒤 함께 정합니다.

1. PC와 다른 기기에 공식 Tailscale·Paseo 앱을 준비하고 같은 tailnet에 로그인합니다. 이미 허용된 기기 공유나 접근 정책이 있으면 그 범위 안에서 씁니다.
2. 먼저 PC의 localhost에서 실제 에이전트 응답을 받고, 데몬의 실제 bind 주소와 포트를 확인합니다. 예시는 `127.0.0.1:6767`입니다.
3. 다른 기기에 접근을 열기 전에 Paseo 비밀번호 인증과 tailnet 접근 범위를 확인합니다. 비밀번호는 사용자가 직접 설정하며 문서·채팅·명령 인자에 넣지 않습니다. 기존 비밀번호는 초기화하지 않습니다. 인증을 추가하면 로컬 앱에서도 새 인증이 되는지 확인해야 합니다. [Paseo 보안 안내](https://paseo.sh/docs/security)
4. 기존 Serve 설정과 Tailnet IP를 확인합니다.

```powershell
tailscale ip -4
tailscale serve status --json
```

5. 같은 Tailnet 포트를 이미 쓰고 있으면 덮어쓰지 말고 어떤 용도인지 확인합니다. Paseo가 이미 `0.0.0.0`에 bind돼 있다면 소켓과 공개 범위를 확인하고 기존 연결을 보존할 방안부터 정합니다. localhost 주소를 Tailnet IP 하나로 바꾸면 두 경로를 모두 유지한다는 통과 조건을 채우지 못합니다.
6. 추가할 규칙과 범위를 설명한 뒤 Windows 관리자 터미널에서 실행합니다. 아래는 **PC의 로컬 데몬 포트가 6767이고 Tailnet 포트 6767도 비어 있을 때**의 예시입니다.

```powershell
tailscale serve --bg --tcp=6767 tcp://127.0.0.1:6767
tailscale serve status
```

로컬 포트가 다르면 대상 URL을, Tailnet 포트가 다르면 `--tcp` 값을 바꿉니다. 이 경로에는 Serve 전체 reset, Funnel, 공인 포트 개방이 필요 없습니다. `--bg`는 이 전달을 백그라운드에서 유지하는 옵션입니다. 명령이 성공했다고 앱에서 원격 연결이 된다는 뜻은 아닙니다.

7. 다른 기기에서 Tailscale을 연결하고 Paseo의 Direct connection에 **PC의 Tailnet IP와 전달 포트**를 넣습니다. 이 raw TCP 예시에서는 앱의 SSL 옵션을 끄고 Tailnet의 암호화 경로를 씁니다. PC의 앱은 기존 localhost 호스트를 그대로 씁니다.
8. 다른 기기에서 실제 에이전트 답변과 작업 파일 접근을 확인하고, PC의 localhost에서도 다시 답변을 받습니다. 같은 PC에서 Tailnet IP로 열어 본 결과만으로 원격 연결에 성공했다고 보고하지 않습니다.
9. Tailscale이 끊긴 상태에서도 PC의 localhost 접속이 되는지 확인합니다. 재부팅·절전·앱 종료 이후의 상태는 실제로 시험한 범위만 기록합니다.

## Tailscale 전달 되돌리기

이번에 새로 추가한 포트 전달만 해제합니다. 아래는 예시의 6767을 새로 추가했을 때의 명령입니다.

```powershell
tailscale serve --bg --tcp=6767 off
```

기존 설정이 있었다면 기록해 둔 원래 설정으로 복원합니다. `tailscale serve reset`은 다른 전달까지 지우므로 쓰지 않습니다. 해제한 뒤 PC의 localhost 응답을 다시 확인합니다.

## 원격 사용 중 기억할 것

PC 전원·네트워크·Paseo 데몬이 계속 살아 있어야 합니다. 앱이 관리하는 데몬과 따로 등록한 서비스는 시작·종료 방식이 다르므로 실제 구동 방식에 맞춰 안내합니다. 절전 모드에서는 원격 접속이 끊길 수 있습니다. QR 연결은 PC와 휴대폰 양쪽의 인터넷이, Tailscale 경로는 양쪽의 Tailscale 연결까지 필요합니다. 휴대폰에서 작업해도 수정되는 것은 PC에서 고른 작업 폴더의 파일이며, 파일이 휴대폰으로 자동 복사되지는 않습니다.

[선택 모바일 단계](../stages/04-mobile/CONTEXT.md) · [Tailscale TCP 전달 공식 문서](https://tailscale.com/docs/reference/tailscale-cli/serve) · [Windows 예제](https://tailscale.com/docs/reference/examples/serve)
