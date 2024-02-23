import { defineConfig } from 'vite';
import { resolve } from 'path';
import { globSync } from 'glob';
import babel from 'vite-plugin-babel';
import { middleware } from './vite.plugin';

const _pages = globSync(`./pages/**/*.html`);

/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [middleware(_pages, 'pages'), babel()],
    publicDir: false,
    build: {
        modulePreload: {
            polyfill: false,
        },
        emptyOutDir: true,
        outDir: 'dist',
        rollupOptions: {
            input: _pages.map(f => resolve(f)),
            output: {
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name.split('.').at(1);
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        extType = 'img';
                    }
                    return `assets/${extType}/[name]-[hash][extname]`;
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
            }
        },
    },
});