// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 🔥 CHÍNH XÁC LÀ BACKEND BẠN
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // ⚠️ KHÔNG XÓA /api
      },
    },
  },
})