import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/user': 'http://localhost:3000',
      '/messages': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
    },
  },
})
