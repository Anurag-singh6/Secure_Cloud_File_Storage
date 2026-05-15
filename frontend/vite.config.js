import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
      },
      '/files': {
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
      },
      '/user': {
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
      },
      '/mfa': {
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
