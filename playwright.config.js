import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 45000,
  expect: { timeout: 10000 },
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:5175',
    viewport: { width: 1440, height: 960 },
    channel: process.env.BROWSER_CHANNEL || (process.platform === 'win32' ? 'chrome' : undefined),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5175 --strictPort',
    url: 'http://127.0.0.1:5175',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
