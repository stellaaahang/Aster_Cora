import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({ mode }) => {
  const pages = mode === 'github-pages';
  const pagesBase = process.env.PAGES_BASE_PATH ?? '/stellazzz/';
  return {
    plugins: [react(), tailwindcss()],
    base: pages ? pagesBase.replace(/\/+$/, '') + '/' : '/',
    build: { outDir: pages ? 'dist-pages' : 'dist' },
    server: { port: 5173, strictPort: true },
  };
});
