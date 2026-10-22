import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

import { seoPlugin } from './scripts/seo-plugin.ts'
import { DEFAULT_SITE_URL } from './src/data/site-url.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [
      react(),
      tailwindcss(),
      seoPlugin(env.VITE_SITE_URL || DEFAULT_SITE_URL),
    ],
    build: {
      rolldownOptions: {
        output: {
          // Libraries change less often than app code, so split them out
          // for better caching.
          codeSplitting: {
            groups: [
              { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/ },
              { name: 'ui', test: /node_modules[\\/](@base-ui|@floating-ui|cmdk|motion|framer-motion|motion-dom|motion-utils)[\\/]/ },
              { name: 'icons', test: /node_modules[\\/]@hugeicons[\\/]/ },
              { name: 'forms', test: /node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/ },
            ],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  }
})
