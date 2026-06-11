import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No manualChunks: forcing three/recharts into named chunks colocated
// shared deps (react itself) inside them, which made the entry import
// from both heavy chunks and download ~1.3MB eagerly. Natural splitting
// keeps them behind the lazy HeroScene / F1 / DJ boundaries.
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
  },
})
