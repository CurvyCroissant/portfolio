import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321/portfolio/',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
          args: JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS ?? '[]'),
        } : {},
      },
    },
    {
      name: 'webkit',
      testMatch: '**/material-motion.spec.ts',
      use: {
        browserName: 'webkit',
        launchOptions: process.env.PLAYWRIGHT_WEBKIT_EXECUTABLE_PATH ? {
          executablePath: process.env.PLAYWRIGHT_WEBKIT_EXECUTABLE_PATH,
        } : {},
      },
    },
  ],
  webServer: { command: 'npm run preview', url: 'http://127.0.0.1:4321/portfolio/', reuseExistingServer: !process.env.CI, timeout: 30_000 },
});
