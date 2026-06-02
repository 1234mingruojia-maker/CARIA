import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths'; // 1. import เพิ่มเข้ามา

export default defineConfig({
  plugins: [tsconfigPaths()], // 2. ใส่ในบล็อก plugins แบบนี้
  test: {
    include: ['src/tests/**/*.live.test.ts'],
    exclude: ['**/node_modules/**', '**/.git/**'],
    env: loadEnv('live', process.cwd(), ''), 
  },
});