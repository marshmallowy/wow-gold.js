import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  platform: 'node',
  target: 'esnext',
  dts: true,
  splitting: false,
  sourcemap: true,
  outDir: 'dist',
  clean: true
})