import { defineConfig } from 'vite';

export default defineConfig({
  json: { stringify: true },
  build: { target: 'esnext' },
  worker: { format: 'es' },
});
