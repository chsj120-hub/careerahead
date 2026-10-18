import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('qrcode') || id.includes('canvas-confetti') || id.includes('html-to-image')) {
              return 'utilities';
            }
            return 'vendor';
          }
        },
      },
    },
  },
})
