import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves this repo at https://y1ji3.github.io/seedling/, so the
  // build (and `npm run preview` of it) need that prefix. The dev server stays at /.
  base: command === 'build' || isPreview ? '/seedling/' : '/',
}))
