import { basename, dirname, extname, resolve } from 'node:path';
import { globSync } from 'node:fs';

/**
 * Custom plugin for MPA dev server router
 * @param {string} config.indexName - Default index folder name
 * @param {string} config.pagesDir - Pages folder
 * @returns {PluginOption}
 */
export const mpa = (
    config = {
        pagePattern: './src/pages/**/*.html',
        indexName: 'index',
    },
) => {
    const pages = globSync(config.pagePattern);
    return {
        name: 'mpa',
        config(config) {
            return {
                appType: 'mpa',
                clearScreen: config.clearScreen ?? false,
                optimizeDeps: {
                    entries: pages.map((v) => v.entry).filter((v) => !!v),
                },
                build: {
                    rollupOptions: {
                        input: pages.map((f) => resolve(f)),
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
                        },
                    },
                },
            };
        },
        configureServer(viteDevServer) {
            return () => {
                const routes = {};
                pages.forEach((page) => {
                    let route = '/' + basename(dirname(page));
                    if (route == `/${config.indexName}`) route = '/';
                    routes[route] = page.replace(/\\/g, '/');
                });
                viteDevServer.middlewares.use(async (req, res, next) => {
                    req.url = `/${routes[req.originalUrl]}`;
                    next();
                });
            };
        },
    };
};
