import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  timeout: 15000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5174',
    browserName: 'chromium',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name:'mobile', use:{ viewport:{ width:375, height:812 } } },
    { name:'tablet', use:{ viewport:{ width:768, height:1024 } } },
    { name:'desktop', use:{ viewport:{ width:1440, height:900 } } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5174',
    reuseExistingServer: true,
  },
})
