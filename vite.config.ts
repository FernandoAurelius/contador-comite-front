import path from "node:path"

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      "localhost", "127.0.0.1", "formatura.floresdev.com.br"
    ],
    proxy: {
      "/api": {
        target: "https://api.formatura.floresdev.com.br",
        changeOrigin: true,
        secure: true
      }
    }
  }
})
