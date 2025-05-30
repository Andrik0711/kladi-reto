import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/__tests__/setupTests.ts',
        include: ['src/__tests__/**/*.test.tsx'],
    },
});
