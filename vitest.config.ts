import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    exclude: ['e2e/**', 'test-results/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: { lines:60, branches:50, functions:60, statements:58 },
    },
  },
})
