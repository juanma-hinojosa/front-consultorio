import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    include: ['react-pdf', 'pdfjs-dist'] // 👈 necesario para que el visor PDF funcione bien
  },
})
