import { test, expect } from "@playwright/test";

test("agent choice opens its installation section under a project subpath", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByText("Codex", { exact: true }).click();
  await expect(
    page.getByRole("radio", { name: "Codex ChatGPT 계정" }),
  ).toBeChecked();
  await page.getByRole("link", { name: "Codex 설치 안내" }).click();
  await expect(page).toHaveURL(
    /\/ai-assistant-setup\/guide\/first-agent.html#codex$/,
  );
  await expect(page.locator("#codex")).toBeAttached();
  await expect
    .poll(() =>
      page
        .locator("#codex")
        .evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThan(100);
  await page.goBack();
  await page.getByText("Claude Code", { exact: true }).click();
  await expect(
    page.getByRole("radio", { name: "Claude Code Claude 계정" }),
  ).toBeChecked();
  await page.getByRole("link", { name: "Claude Code 설치 안내" }).click();
  await expect(page.locator("#claude")).toBeAttached();
});

test("copies the exact shared request and explains a blocked clipboard", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("./#handoff");
  const prompt = await page.locator("#start-prompt").textContent();
  await page.getByRole("button", { name: "첫 요청 복사" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    prompt,
  );
  await page.reload();
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("blocked")) },
    }),
  );
  await page.getByRole("button", { name: "첫 요청 복사" }).click();
  await expect(page.getByRole("status")).toContainText("Ctrl+C");
  expect(await page.evaluate(() => window.getSelection().toString())).toBe(
    prompt,
  );
});

test("reader links, heading history and mobile menu work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("guide/first-agent.html#codex");
  await expect(page.locator("#codex")).toBeAttached();
  await expect
    .poll(() =>
      page
        .locator("#codex")
        .evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThan(100);
  await page.getByText("안내 목록", { exact: true }).click();
  await page
    .getByRole("navigation", { name: "문서 목록" })
    .getByRole("link", { name: "문제 해결", exact: true })
    .click();
  await expect(page).toHaveURL(/troubleshooting.html$/);
  await page.goBack();
  await expect(page).toHaveURL(/first-agent.html#codex$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("first install and prompt remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4178/ai-assistant-setup/");
  await expect(page.locator("#start-prompt")).not.toBeEmpty();
  await page.getByRole("link", { name: "Codex 설치 안내 바로 열기" }).click();
  await expect(page.locator("#codex")).toBeAttached();
  await expect
    .poll(() =>
      page
        .locator("#codex")
        .evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThan(100);
  await context.close();
});
