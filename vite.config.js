import { defineConfig } from 'vite';

export default defineConfig({
  base: '/youtube-dashboard/',
  json: { stringify: true },
  build: { target: 'esnext' },
  worker: { format: 'es' },
});
