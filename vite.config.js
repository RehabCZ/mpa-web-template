import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import FullReload from 'vite-plugin-full-reload';
import { mpa } from './vite.plugin';

/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [FullReload(['./pages/**/*', 'src/**/*']), mpa(), babel()],
    publicDir: 'assets',
    build: {
        modulePreload: {
            polyfill: false,
        },
        emptyOutDir: true,
        outDir: 'dist',
    },
    server: {
        watch: {
            usePolling: true,
        },
    },
});
