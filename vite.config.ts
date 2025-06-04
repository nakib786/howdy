import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize for Netlify
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for production
    rollupOptions: {
      output: {
        // Split chunks for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          utils: ['lucide-react', 'react-scroll', 'react-helmet-async']
        }
      }
    },
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
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
