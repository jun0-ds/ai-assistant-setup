# 에이전트 하나부터 시작해요

Windows에서 Claude Code와 Codex 중 사용할 계정이 있는 하나를 고르세요. WSL이나 VS Code를 먼저 준비할 필요는 없어요. 두 회사의 로그인과 이용 요금은 별개예요. 이용 가능 여부는 각 공식 안내에서 확인해요.

## PowerShell 열기

시작 메뉴에서 Windows PowerShell을 검색해 일반 창으로 열어요. `PS C:\…>`가 보이면 맞아요. 처음부터 관리자 창을 열지는 않아요.

아래에서 고른 설치 명령 하나만 실행해요. 공식 서버에서 설치 프로그램을 받아 실행하므로 주소를 확인하세요.

<a id="claude"></a>
## Claude Code

```powershell
irm https://claude.ai/install.ps1 | iex
```

설치가 끝나면 **PowerShell을 닫고 새로 열어서** 확인해요.

```powershell
Get-Command claude -All
claude --version
claude
```

화면 안내에 따라 본인의 Claude 계정으로 로그인해요. 브라우저 로그인은 직접 완료해요. 설치 중 다운로드 표시가 잠시 없을 수 있어요. [공식 설치 안내](https://code.claude.com/docs/en/setup)

<a id="codex"></a>
## Codex

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

공식 Windows 설치 명령이에요. 실행 정책 옵션은 해당 프로세스에 적용돼요. 컴퓨터 전체 실행 정책을 변경할 필요는 없어요.

설치가 끝나면 **PowerShell을 닫고 새로 열어서** 확인해요.

```powershell
Get-Command codex -All
codex --version
codex
```

제공되는 인증 방법에서 본인의 계정으로 로그인해요. 브라우저 로그인과 필요한 최초 권한 설정은 직접 완료해요. [공식 CLI 안내](https://developers.openai.com/codex/cli) · [Windows 안내](https://developers.openai.com/codex/windows)

## 첫 답변 받기

실행한 에이전트에 이렇게 보내요.

```text
Windows 네이티브에서 처음 쓰고 있어요. 지금은 파일을 바꾸지 말고, 대화할 준비가 됐는지 짧게 답해줘요.
```

실제 답변을 받으면 [첫 요청](../prompts/start.md)을 이어서 보내세요. 이후 환경 진단과 설치 준비는 에이전트가 진행해요. 직접 할 일은 한 번에 하나씩 알려줄 거예요.

## 실행 명령을 못 찾으면

설치를 반복하기 전에 새 PowerShell을 열었는지 확인해요. 설치 완료 메시지의 실행파일 위치가 있으면 `& '실제 경로\에이전트.exe'`처럼 실행할 수 있어요. [경로 진단](../references/windows-paths.md)에 기본 위치와 확인법이 있어요.

절대경로로 실행되면 에이전트에게 “이 경로로만 실행돼요. PowerShell과 Paseo에서도 찾도록 진단해줘요”라고 알려주세요. 설치 자체가 실패해 열 수 없다면 평소 쓰던 웹 AI에 사용한 명령·오류 문장과 [오류 안내](../references/troubleshooting.md)를 보내도 돼요. 로그인 코드·키·토큰·비밀번호는 보내지 마세요.
