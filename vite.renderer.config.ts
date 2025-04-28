import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { pluginExposeRenderer } from './vite.base.config';

// https://vitejs.dev/config
export default defineConfig((env) => {
    const forgeEnv = env as ConfigEnv<'renderer'>;
    const { root, mode, forgeConfigSelf } = forgeEnv;
    const name = forgeConfigSelf.name ?? '';

    return {
        root,
        mode,
        base: './',
        build: {
            rollupOptions: {
                input: {
                    ["index"]: "./index.html",
                }
            },
            outDir: `.vite/renderer/${name}`,
        },
        plugins: [pluginExposeRenderer(name)],
        server: {
            port: 3000,
            strictPort: true,
            watch: {
                usePolling: true, // ✅ Enables live-reload in Electron
            },
        },
        resolve: {
            preserveSymlinks: true,
        },
        clearScreen: false,
    } as UserConfig;
});
