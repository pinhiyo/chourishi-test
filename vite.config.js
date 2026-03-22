import { defineConfig } from 'vite'

export default defineConfig({
  // Setting base to './' ensures the app works correctly on GitHub Pages
  // regardless of the repository name.
  base: './',
  build: {
    outDir: 'dist',
  }
})
