import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        watch: resolve(__dirname, 'watch.html'),
      },
    },
  },
  server: {
    open: true,
    port: 3000,
  },
});
