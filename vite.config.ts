import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: false,
  },
  preview: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('react') || id.includes('scheduler')) {
              return 'vendor';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
