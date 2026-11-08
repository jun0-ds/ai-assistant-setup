# 1. 첫 에이전트 설치

Windows에서 Claude Code와 Codex 중 사용할 계정이 있는 하나를 고르세요. WSL이나 VS Code를 먼저 준비할 필요는 없어요. 두 회사의 로그인과 이용 요금은 별개예요. 이용 가능 여부는 각 공식 안내에서 확인해요.

이 문서는 전체 안내의 1단계예요. **1-1. PowerShell 열기 → 1-2. 하나만 설치·로그인 → 1-3. 첫 답변 확인**까지 마친 뒤 [2. 첫 요청](../prompts/start.md)을 보내요.

## 1-1. PowerShell 열기

시작 메뉴에서 Windows PowerShell을 검색해 일반 창으로 열어요. `PS C:\…>`가 보이면 맞아요. 처음부터 관리자 창을 열지는 않아요.

## 1-2. 에이전트 하나만 설치하고 로그인하기

Claude Code와 Codex 중 **고른 쪽의 설치·확인·로그인만** 따라가요. 둘 다 설치할 필요는 없어요. 공식 서버에서 설치 프로그램을 받아 실행하므로 주소를 확인하세요.

<a id="claude"></a>
### Claude Code

**설치 명령 실행하기**

```powershell
irm https://claude.ai/install.ps1 | iex
```

다운로드 표시 없이 한동안 멈춘 듯 보일 수 있어요. 끝나면 마지막 `Installation complete!`만 보지 말고 그 위의 `Setup notes:`도 읽어요.

**`Setup notes`에 `… is not in your PATH`가 보이면**

설치는 된 거예요. 이 설치기는 실행 위치(`C:\Users\사용자\.local\bin`)를 PATH에 직접 넣지 않아요. 그대로 두면 새 창에서도 `claude`를 찾지 못해요. 아래 [실행 명령을 못 찾으면](#실행-명령을-못-찾으면)의 2번 Claude Code 두 줄을 실행해요.

**설치 명령이 빨간 오류로 끝나면**

같은 명령을 반복하지 말고 공식 대안인 WinGet으로 설치해요. 오류 문장은 나중에 에이전트에게 보여 줄 수 있게 남겨 둬요.

```powershell
winget install Anthropic.ClaudeCode
```

WinGet 설치는 자동 업데이트되지 않아요. 가끔 `winget upgrade Anthropic.ClaudeCode`를 실행해요.

**PowerShell을 모두 닫고 새로 열어 설치 확인하기**

열려 있는 PowerShell·터미널 창을 모두 닫은 뒤 시작 메뉴에서 다시 열어요. 설치한 창에서는 바뀐 설정이 반영되지 않아요. 명령을 찾지 못한다는 오류가 나오면 [실행 명령을 못 찾으면](#실행-명령을-못-찾으면)으로 가요.

```powershell
Get-Command claude -All
claude --version
```

**실행하고 로그인하기**

```powershell
claude
```

화면 안내에 따라 본인의 Claude 계정으로 로그인해요. 브라우저 로그인은 직접 완료해요. [공식 설치 안내](https://code.claude.com/docs/en/setup)

<a id="codex"></a>
### Codex

**설치 명령 실행하기**

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

공식 Windows 설치 명령이에요. 실행 정책 옵션은 해당 프로세스에 적용돼요. 컴퓨터 전체 실행 정책을 변경할 필요는 없어요. 이 설치기는 PATH 등록까지 시도해요. 끝에 `Current PowerShell session: codex`라고 나와도 이 명령은 별도 PowerShell에서 돌기 때문에 지금 창에서는 `codex`를 찾지 못해요. 아래처럼 새로 열어 확인해요.

설치 중에 `[y/N]` 질문이 나올 수 있어요.

- `Start Codex now? [y/N]`: Enter를 눌러 넘어가요. 아래처럼 새 창에서 확인한 뒤 실행해요.
- `Uninstall the existing npm-managed Codex now? [y/N]`: 예전에 npm으로 설치한 Codex가 있다는 뜻이에요. 지금은 Enter를 눌러 그대로 두고, 3단계 진단에서 에이전트와 어느 쪽을 쓸지 정해요.
- `Replace it with the current Codex setup now? [y/N]`: 예전 방식 설치가 있다는 뜻이에요. `y`를 입력하면 예전 폴더를 `.backup`이 붙은 이름으로 옮겨 보존하고 설치를 이어가요. Enter면 설치가 멈춰요.
- 그 밖의 질문은 Enter로 넘기고 질문 문장을 남겨 둬요.

**PowerShell을 모두 닫고 새로 열어 설치 확인하기**

열려 있는 PowerShell·터미널 창을 모두 닫은 뒤 시작 메뉴에서 다시 열어요. 설치한 창에서는 바뀐 설정이 반영되지 않아요. 명령을 찾지 못한다는 오류가 나오면 [실행 명령을 못 찾으면](#실행-명령을-못-찾으면)으로 가요.

```powershell
Get-Command codex -All
codex --version
```

**실행하고 로그인하기**

```powershell
codex
```

제공되는 인증 방법에서 본인의 계정으로 로그인해요. 브라우저 로그인과 필요한 최초 권한 설정은 직접 완료해요. [공식 CLI 안내](https://developers.openai.com/codex/cli) · [Windows 안내](https://developers.openai.com/codex/windows)

## 1-3. 첫 답변 확인하기

실행한 에이전트에 이렇게 보내요.

```text
Windows 네이티브에서 처음 쓰고 있어요. 지금은 파일을 바꾸지 말고, 대화할 준비가 됐는지 짧게 답해줘요.
```

실제 답변이 돌아오면 2. 첫 요청으로 가요. 실행이나 로그인이 안 됐다면 아래 문제 해결 안내부터 확인해요.

## 다음은 2. 첫 요청이에요

[첫 요청](../prompts/start.md)을 복사해 지금 답변한 에이전트에 이어서 보내세요. 이후 환경 진단과 설치 준비는 에이전트가 진행해요. 직접 할 일은 한 번에 하나씩 알려줄 거예요.

## 실행 명령을 못 찾으면

`'claude' 용어가 … 인식되지 않습니다`나 `'codex' … is not recognized` 오류는 Claude Code와 Codex 모두에서 나올 수 있어요. 설치가 실패했다는 뜻은 아니에요.

PATH는 Windows가 명령을 찾아보는 폴더 목록이에요. 프로그램이 있는 폴더가 이 목록에 없거나, 열려 있는 터미널이 바뀐 목록을 아직 모르면 이 오류가 나요. 설치를 다시 해도 해결되지 않으니 아래 순서로 확인해요.

**1. 터미널을 완전히 닫고 다시 열기**

열려 있는 PowerShell·터미널 창을 모두 닫고 시작 메뉴에서 새로 열어요. 이미 열려 있던 창은 켜질 때 읽은 목록을 계속 써요. 터미널 버전이나 설정에 따라 새 탭도 예전 목록을 쓸 수 있어서 모두 닫는 쪽이 확실해요. 다시 열면 `claude --version`이나 `codex --version`을 실행해요. 버전이 나오면 끝이에요.

**2. 그래도 못 찾으면 사용자 PATH에 폴더 추가하기**

고른 에이전트 쪽만 따라가요. 내 계정의 목록만 바꾸므로 관리자 창은 필요 없어요. 먼저 첫 줄로 폴더가 이미 목록에 있는지 봐요. 경로가 한 줄 나오면 이미 들어 있으니 3번으로 가요. 아무것도 안 나올 때만 아래 두 줄을 실행해요.

Claude Code — [공식 PATH 해결 안내](https://code.claude.com/docs/en/troubleshoot-install#verify-your-path)의 명령 그대로예요.

```powershell
$env:PATH -split ';' | Select-String '\.local\\bin'
```

```powershell
$currentPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
[Environment]::SetEnvironmentVariable('PATH', "$currentPath;$env:USERPROFILE\.local\bin", 'User')
```

Codex — 공식 문서에는 PATH 추가 명령이 없어요. 설치기가 직접 등록하는데 빠졌을 때 쓰도록 위와 같은 방식에 Codex 폴더만 바꿨어요.

```powershell
$env:PATH -split ';' | Select-String 'OpenAI\\Codex\\bin'
```

```powershell
$currentPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
[Environment]::SetEnvironmentVariable('PATH', "$currentPath;$env:LOCALAPPDATA\Programs\OpenAI\Codex\bin", 'User')
```

실행한 뒤 1번처럼 터미널을 모두 닫고 다시 열어 버전을 확인해요.

**3. 그래도 안 되면 실행파일 위치로 직접 실행하기**

설치 완료 메시지의 실행파일 위치가 있으면 `& '실제 경로\에이전트.exe'`처럼 실행할 수 있어요. [경로 진단](../references/windows-paths.md)에 기본 위치와 확인법이 있어요.

절대경로로 실행되면 에이전트에게 “이 경로로만 실행돼요. PowerShell과 Paseo에서도 찾도록 진단해줘요”라고 알려주세요. 설치 자체가 실패해 열 수 없다면 평소 쓰던 웹 AI에 사용한 명령·오류 문장과 [오류 안내](../references/troubleshooting.md)를 보내도 돼요. 로그인 코드·키·토큰·비밀번호는 보내지 마세요.
