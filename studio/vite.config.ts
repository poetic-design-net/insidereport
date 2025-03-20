import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: ['@sanity/client']
  },
  ssr: {
    noExternal: ['@sanity/client']
  }
})