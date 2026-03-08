import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  if (mode === 'sdk') {
    return {
      plugins: [vue({ template: { transformAssetUrls } }), quasar()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src')
        }
      },
      build: {
        sourcemap: true,
        lib: {
          entry: path.resolve(__dirname, 'src/sdk/index.ts'),
          name: 'EnterpriseChatbotSdk',
          formats: ['es', 'umd'],
          fileName: (format) => (format === 'es' ? 'sdk.esm.js' : 'sdk.umd.js')
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue'
            }
          }
        }
      }
    };
  }

  if (mode === 'webcomponent') {
    return {
      plugins: [vue({ template: { transformAssetUrls } }), quasar()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src')
        }
      },
      build: {
        sourcemap: true,
        lib: {
          entry: path.resolve(__dirname, 'src/web-component.ts'),
          name: 'EnterpriseChatbotElement',
          formats: ['iife'],
          fileName: () => 'chatbot-element.js'
        }
      }
    };
  }

  return {
    plugins: [vue({ template: { transformAssetUrls } }), quasar()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: Number(env.VITE_PORT ?? 5173)
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts']
    }
  };
});
