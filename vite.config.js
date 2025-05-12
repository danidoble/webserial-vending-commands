import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        webserialVendingCommands: resolve(__dirname, 'lib/main.ts'),
        arduino: resolve(__dirname, 'lib/arduino.ts'),
        boardroid: resolve(__dirname, 'lib/boardroid.ts'),
        jofemar: resolve(__dirname, 'lib/jofemar.ts'),
        locker: resolve(__dirname, 'lib/locker.ts'),
        pinpax: resolve(__dirname, 'lib/pinpax.ts'),
        relay: resolve(__dirname, 'lib/relay.ts'),
      },
      name: 'webSerialVendingCommands',
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
})