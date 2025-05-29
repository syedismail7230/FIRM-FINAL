import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    watch: {
      usePolling: false, // Disable polling to prevent refresh loops
      interval: 1000 // Increase the interval between file system checks
    }
  },
  preview: {
    port: 4173,
    host: true,
    strictPort: true
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'recharts',
            'mapbox-gl',
            'react-map-gl'
          ]
        }
      }
    }
  }
});