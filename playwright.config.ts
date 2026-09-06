import { defineConfig, devices } from "@playwright/test";

// `scripts/e2e.sh` sets this to a free port derived from the checkout's path.
// Without it two checkouts running the suite at once would both want :5173 and
// `reuseExistingServer` would hand the second one the first one's server —
// a browser on backend A while the helpers seed backend B. The port is claimed
// free, so there is nothing there to reuse and reuse is off; a bare
// `bunx playwright test` keeps the old behaviour on :5173.
const port = process.env.E2E_WEB_PORT;
const url = `http://localhost:${port ?? 5173}`;

export default defineConfig({
  globalSetup: "./playwright/helpers/global-setup.ts",
  testDir: "./playwright",
  testMatch: "*.e2e.ts",
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 4 : 1,
  retries: 1,
  reporter: process.env.CI
    ? [["list"], ["github"], ["json", { outputFile: "test-results/results.json" }]]
    : "list",
  timeout: 30_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: url,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: process.env.CI
      ? `bun run preview --port ${port ?? 5173} --strictPort`
      : `bun run dev --port ${port ?? 5173} --strictPort`,
    url,
    reuseExistingServer: !process.env.CI && !port,
    timeout: 120_000,
  },
});
