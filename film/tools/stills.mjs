// Рендер набора кадров за один запуск: node tools/stills.mjs out_dir frame1 frame2 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [out, ...frames] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: process.env.COMP ?? 'Film', browserExecutable});
for (const fr of frames) {
  await renderStill({serveUrl, composition, frame: Number(fr), output: path.join(out, `f${String(fr).padStart(5, '0')}.jpg`), imageFormat: 'jpeg', jpegQuality: 80, browserExecutable, scale: 0.5});
  process.stdout.write(fr + ' ');
}
console.log('done');
