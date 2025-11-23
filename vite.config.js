import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'spirit-engine': ['./src/spirits/spiritDefinitions.js'],
          'vendor': ['react', 'react-dom']
        }
      }
    }
  }
})
