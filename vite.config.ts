import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: '.vite/build', // ✅ Matches your `main` entry in package.json
        emptyOutDir: true,
    },
});