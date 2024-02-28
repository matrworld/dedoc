/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/web',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },
  resolve: {
		alias: {
			process: "process/browser",
			path: "path-browserify",
			os: "os-browserify",
      crypto: 'crypto-browserify',

		},
	},
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: 'window',

  },

  plugins: [react(), nxViteTsPaths(), nodePolyfills(
    {
			// To exclude specific polyfills, add them to this list.
			exclude: [
			],
			// Whether to polyfill specific globals.
			globals: {
				Buffer: true,
				global: true,
				process: true,
			},
			// Whether to polyfill `node:` protocol imports.
			protocolImports: true,
		}
  ),  
  [NodeGlobalsPolyfillPlugin({ buffer: true, process: true })]],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/apps/web',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/web',
      provider: 'v8',
    },
  },
});
