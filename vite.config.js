import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default {
  build: {
    chunkSizeWarningLimit: 1000, // raise the limit
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@tanstack/react-query', 'react-router-dom']
        }
      }
    }
  }
}

