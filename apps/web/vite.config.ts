import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    fs: {
      // Allow serving files from the monorepo root and its parent (useful in monorepos)
      allow: [path.resolve(__dirname, '..'), path.resolve(__dirname, '../../..')],
    },
  }
})
