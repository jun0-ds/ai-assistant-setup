document.querySelectorAll("[data-copy], .agent-choice").forEach((element) => {
  element.hidden = false;
});

const status = document.querySelector(".copy-status");

async function copyText(element, button) {
  try {
    await navigator.clipboard.writeText(element.textContent);
    const previous = button.textContent;
    button.textContent = "복사했어요 ✓";
    if (status) status.textContent = "에이전트 대화창에 붙여넣어 주세요.";
    window.setTimeout(() => {
      button.textContent = previous;
    }, 2200);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
    if (status)
      status.textContent =
        "복사를 허용하지 않는 환경이에요. 선택된 글을 Ctrl+C 또는 길게 눌러 복사하세요.";
    else button.textContent = "선택한 글을 직접 복사하세요";
  }
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () =>
    copyText(document.getElementById(button.dataset.copy), button),
  );
});

document.querySelectorAll('input[name="agent"]').forEach((input) => {
  input.addEventListener("change", () => {
    const name = input.value === "codex" ? "Codex" : "Claude Code";
    const link = document.querySelector(".install-link");
    link.href = `guide/first-agent.html#${input.value}`;
    link.textContent = `${name} 설치 안내 ↗`;
  });
});

// The documents remain readable and linked with JavaScript disabled.
document.querySelectorAll(".document pre > code").forEach((code) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "code-copy";
  button.textContent = "복사";
  button.setAttribute("aria-label", "이 코드 또는 요청 복사");
  code.tabIndex = 0;
  code.parentElement.prepend(button);
  button.addEventListener("click", () => copyText(code, button));
});

const documentMenu = document.querySelector(".reader-nav details");
if (documentMenu && window.matchMedia("(min-width: 821px)").matches)
  documentMenu.open = true;
