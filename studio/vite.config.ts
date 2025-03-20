import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        '@sanity/client',
        'sanity',
        '@sanity/vision',
        'sanity-plugin-media',
        '@sanity/code-input',
        '@sanity/table',
        'sanity-plugin-asset-source-unsplash',
        'styled-components'
      ]
    }
  }
})