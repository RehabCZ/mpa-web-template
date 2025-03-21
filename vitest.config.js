import { defineConfig } from 'vitest/config';

/** @type {import('vitest/node').UserConfig} */
export default defineConfig({
    test: {
        dir: './tests/',
        passWithNoTests: true,
    },
});
