import { defineConfig } from 'vite';

export default defineConfig({
  // Files in the 'public' directory are served at root and copied to dist as-is
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
});
