import { defineConfig } from 'vite';
import { mpa } from './vite.plugin.js';
import FullReload from 'vite-plugin-full-reload';
import babel from 'vite-plugin-babel';

/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [mpa(), FullReload(['src/**/*']), babel()],
    publicDir: 'assets',
    base: '/',
    build: {
        modulePreload: {
            polyfill: false,
        },
        emptyOutDir: true,
        outDir: 'dist',
    },
    server: {
        host: '0.0.0.0',
        open: true,
        port: 5173,
        watch: {
            usePolling: true,
        },
    },
});
