import * as esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'cjs',
  outfile: 'dist/index.js',
  sourcemap: true,
  // Allow bundling ESM-only packages (like @actions/github v9) by including
  // the 'import' condition. Prefer 'module' field so packages like jsonc-parser
  // use their ESM output (static imports) instead of UMD (dynamic requires).
  conditions: ['import', 'require', 'node', 'default'],
  mainFields: ['module', 'main'],
  // Inject a shim for import.meta.url so ESM code bundled as CJS works
  define: {
    'import.meta.url': 'IMPORT_META_URL',
  },
  banner: {
    js: 'const IMPORT_META_URL = require("url").pathToFileURL(__filename).href;',
  },
}).then(() => {
  console.log('Build complete: dist/index.js')
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
