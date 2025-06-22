import { rmSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'
import pkg from './package.json'
import { ConfigResolvePlugin } from './agora-plugin'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        'agora-electron-sdk': 'agora-electron-sdk/js/AgoraSdk.js',
      },
    },
    // optimizeDeps: {
    //   include: [
    //     'agora-electron-sdk' // 显式包含 SDK 进行依赖优化
    //   ],
    //   esbuildOptions: {
    //     // 添加 CommonJS 支持
    //     mainFields: ['module', 'jsnext:main', 'jsnext', 'main']
    //   }
    // },
    // build: {
    //   commonjsOptions: {
    //     transformMixedEsModules: true, // 转换混合模块
    //     include: [/node_modules\/agora-electron-sdk/] // 包含特定模块
    //   },
    //   rollupOptions: {
    //     external: ['agora-electron-sdk'],
    //   }
    // },
    build: {
      // 确保原生模块被正确打包
      rollupOptions: {
        external: ['agora-electron-sdk'],
      }
    },
    optimizeDeps: {
      exclude: ['agora-electron-sdk', 'electron'], // 禁止 Vite 处理原生模块
    },
    plugins: [
      react(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: 'electron/main/index.ts',
          onstart(args) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            } else {
              args.startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: {},
      }),
      // ConfigResolvePlugin(),
    ],
    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
      return {
        host: url.hostname,
        port: +url.port,
      }
    })(),
    clearScreen: false,
  }
})
