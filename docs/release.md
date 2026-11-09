# 검증과 버전 교체

## 제품 계약

이번 개편의 대상은 Windows에서 처음 에이전트를 쓰는 사람이에요. 직접 할 준비는 CLI 설치·로그인·첫 응답까지이고 이후 가이드 자체를 에이전트에 전달해요. 웹은 최소 설치와 첫 요청을 중심으로 구성해요. 긴 단계 전체를 첫 화면에 펼치는 안은 처음 해야 할 일을 고르기 어려워 제외했어요.

ICM 단계·참고 문서가 내용의 정본이고 웹은 이를 생성해요. 문턱이 사용자 작업공간과 문맥·파일 수명주기를 맡고 가이드는 설치를 조율해요. 독자적인 계정·권한 정책이나 새 동기화 시스템을 만들지 않아요. 사용자 설정과 소스의 거주지를 분리해요.

## 자동 검사

```sh
npm ci
npm run build
npm run check
npm test
npm run test:browser
```

Markdown 링크·생성 결과·GitHub Pages 하위 경로·공급자 선택·첫 요청·문서 이동을 확인해요. Windows 진단 스크립트는 `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tests\Test-Diagnostics.ps1`로 격리 검사해요. 문턱 설치기는 문턱 저장소의 Windows 테스트로 별도 확인해요.

## 실제 기기 확인

| 표본 | 완료 증거 |
|---|---|
| Windows·Claude 신규 | 설치·로그인·새 PowerShell·Paseo provider·실제 응답 |
| Windows·Codex 신규 | 같은 흐름·실제 계정 로그인 |
| 기존 환경 | 사용자 AGENTS/CLAUDE·설정·메모리·Paseo 제공자/플러그인 보존 |
| 일반 작업 폴더 | Git 없이 문맥 선택·첫 작업·정리·보관·재조회 |
| 휴대폰 QR 연결 | QR 스캔·실제 다른 기기 응답·PC localhost 재검사 |
| Tailscale 다른 기기〔선택〕 | 실제 다른 기기 응답·PC localhost 재검사·선택한 전달 되돌림 |
| 유지 | 오프라인·당일 중복 확인·업데이트 후 개인 자료 보존 |

실행하지 못한 항목은 미확인으로 보고해요. 제작자가 실행한 자동 브라우저 검사는 초보자의 실제 이해 검증이 아니에요. 휴대폰이나 테스트 계정이 없으면 통과를 만들어내지 않아요.

## 공개 순서

이 버전은 가이드 `v1.2.0`에서 문턱 `v0.2.0` 계약을 사용해요. 공개 첫 요청과 ZIP 링크는 tag를 고정해요.

1. 문턱 설치기·템플릿·보존 테스트를 검토하고 문턱 `v0.2.0`을 먼저 공개해요.
2. 공개된 문턱 tag의 VERSION·setup.ps1과 ZIP 접근을 확인해요.
3. 가이드의 build/check/test와 변경 내용을 검토해요. VERSION·VERSIONING·CHANGELOG를 맞춰요.
4. 가이드 `v1.2.0`을 공개하고 GitHub Pages의 새 index·설치 문서·첫 요청·고정 ZIP을 확인해요.
5. 실제 기기 확인에서 빠진 표본과 사용자가 해야 할 일을 보고해요.

로컬 코드 작성과 테스트는 공개 완료가 아니에요. shared branch push·tag/release·Pages 공개는 해당 대상과 효과가 승인된 범위에서 수행해요. 확인되지 않은 설치판을 안내에서 사용 가능하다고 쓰지 않아요.

## 되돌림

현재 버전의 소스·tag를 보존하고 Pages가 배포하는 commit을 이전 검증된 commit으로 되돌려요. 사용자 작업공간의 자료·계정·권한을 되돌림 명목으로 초기화하지 않아요. 기존 URL 연결은 유지해요. 이전 문서는 [v0.5.0](https://github.com/jun0-ds/ai-assistant-setup/tree/v0.5.0)에 있어요.
