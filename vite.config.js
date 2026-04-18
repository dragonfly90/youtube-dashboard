import { defineConfig } from 'vite';

export default defineConfig({
  base: '/youtube-dashboard/',
  json: { stringify: true },
  build: { target: 'esnext' },
  worker: { format: 'es' },
  server: {
    proxy: {
      '/api/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
      },
    },
  },
});
