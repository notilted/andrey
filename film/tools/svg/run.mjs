import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
await build({entryPoints: ['tools/svg/export.tsx'], bundle: true, platform: 'node', format: 'esm', outfile: 'tools/svg/.export.mjs', jsx: 'automatic', loader: {'.woff2': 'empty'}, external: ['react', 'react-dom', 'remotion']});
execFileSync('node', ['tools/svg/.export.mjs', ...process.argv.slice(2)], {stdio: 'inherit'});
