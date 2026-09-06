import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  globalSetup: "./playwright/helpers/global-setup.ts",
  testDir: "./playwright",
  testMatch: "*.e2e.ts",
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 4 : 1,
  // A spec that only passes on retry is a failure in CI. Locally a retry still
  // absorbs a dev-machine hiccup and reports the spec as flaky.
  retries: process.env.CI ? 0 : 1,
  reporter: process.env.CI
    ? [["list"], ["github"], ["json", { outputFile: "test-results/results.json" }]]
    : "list",
  timeout: 30_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: "http://localhost:5173",
    // There is no retry in CI, so the trace has to come off the failure itself.
    trace: process.env.CI ? "retain-on-failure" : "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: process.env.CI ? "bun run preview --port 5173" : "bun run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
