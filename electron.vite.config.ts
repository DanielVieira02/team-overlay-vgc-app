import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    root: "./",
    publicDir: resolve(__dirname, "public"),
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: [{ find: "@", replacement: resolve(__dirname, "./") }]
    },
    plugins: [react()],
  }
})
