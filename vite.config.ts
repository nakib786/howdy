import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize for Netlify
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split chunks for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          utils: ['lucide-react', 'react-scroll']
        }
      }
    }
  },
  // Optimize dev server
  server: {
    port: 3000,
    host: true
  },
  // Optimize preview
  preview: {
    port: 4173,
    host: true
  }
})
