import { dirname } from 'path';

/**
 * Custom middleware for MPA dev server router
 * @param {string[]} pages - Globbed html files
 * @param {string} dir - Root folder
 * @returns {PluginOption}
 */
export const middleware = (pages, dir) => {
    const routes = {};
    pages.forEach((page) => {
        let route = dirname(page).replace(dir, '');
        if (route == '/index') route = '/';
        routes[route] = page;
    });
    return {
        name: 'middleware',
        apply: 'serve',
        configureServer(viteDevServer) {
            return () => {
                viteDevServer.middlewares.use(async (req, res, next) => {
                    req.url = `/${routes[req.originalUrl]}`;
                    next();
                });
            };
        }
    }
}