import { dirname, resolve } from 'path';
import { globSync } from 'glob';

/**
 * Custom plugin for MPA dev server router
 * @param {string} config.indexName - Default index folder name
 * @param {string} config.pagesDir - Pages folder
 * @returns {PluginOption}
 */
export const mpa = (
    config = {
        pagesDir: 'pages',
        pageExt: '.html',
        indexName: 'index',
    },
) => {
    const pages = globSync(`${config.pagesDir}/**/*${config.pageExt}`);
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
                    let route = dirname(page).replace(config.pagesDir, '');
                    if (route == `/${config.indexName}`) route = '/';
                    routes[route] = page;
                });
                viteDevServer.middlewares.use(async (req, res, next) => {
                    req.url = `/${routes[req.originalUrl]}`;
                    next();
                });
            };
        },
    };
};
