import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        watch: resolve(__dirname, 'watch.html'),
        slides: resolve(__dirname, 'slides.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        catering: resolve(__dirname, 'catering.html'),
        'catering-thank-you': resolve(__dirname, 'catering-thank-you.html'),
      },
    },
  },
  server: {
    open: true,
    port: 3000,
  },
});
