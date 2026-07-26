import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      // Auto-import dei componenti PrimeVue: <Button />, <DataTable />, ... senza import espliciti
      Components({
        resolvers: [PrimeVueResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      // Cloudflare Pages serve la cartella dist/ cosi' com'e'
      outDir: 'dist',
      sourcemap: mode !== 'production',
    },
    server: {
      host: '0.0.0.0',
      // Proxy opzionale: utile per evitare CORS in locale.
      // Attivo solo se VITE_PROXY_TARGET e' valorizzato nel .env
      proxy: env.VITE_PROXY_TARGET
        ? {
            '/api': {
              target: env.VITE_PROXY_TARGET,
              changeOrigin: true,
            },
          }
        : undefined,
    },
  }
})
