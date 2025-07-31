import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Important for Electron to load resources correctly
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Ensure proper module loading in Electron
      external: ['electron']
    }
  }
})
