import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "site.browser.mjs",
  use: {
    baseURL: "http://127.0.0.1:4178/ai-assistant-setup/",
    browserName: "chromium",
  },
  webServer: {
    command: "node scripts/serve-site.mjs",
    wait: { stdout: /Setup site ready/ },
    reuseExistingServer: false,
  },
  reporter: "list",
});
