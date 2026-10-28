// Короткие нарезки 30–45 с из готовых серий: node tools/shorts.mjs
// Плашки рисует Remotion (прозрачный PNG), склейку и наложение делает ffmpeg.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('../output/shorts');
const TMP = process.env.TMPDIR_SHORTS ?? path.join(OUT, '.tmp');
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const SHORTS = JSON.parse(fs.readFileSync(path.resolve('tools/shorts.json'), 'utf8'));
fs.mkdirSync(OUT, {recursive: true});
fs.mkdirSync(TMP, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const still = async (props, file) => {
  const composition = await selectComposition({serveUrl, id: 'ShortOverlay', inputProps: props, browserExecutable});
  await renderStill({serveUrl, composition, inputProps: props, output: file, imageFormat: 'png', browserExecutable});
};

for (const s of SHORTS) {
  const hook = path.join(TMP, `${s.name}_hook.png`);
  const end = path.join(TMP, `${s.name}_end.png`);
  await still({text: s.hook, kind: 'hook'}, hook);
  await still({text: 'ПОЛНАЯ СЕРИЯ', kind: 'end', series: s.series}, end);
  // отрезки: каждый — отдельный вход с перемоткой (без буферизации кадров между далёкими кусками)
  const n = s.cuts.length;
  const total = s.cuts.reduce((t, [a, b]) => t + b - a, 0);
  const inputs = s.cuts.flatMap(([a, b]) => ['-ss', String(a), '-to', String(b), '-i', path.resolve('..', 'output', s.src)]);
  const H = n;
  const E = n + 1;
  const fc = [
    ...s.cuts.map(([a, b], i) => `[${i}:v]setpts=PTS-STARTPTS[v${i}];[${i}:a]asetpts=PTS-STARTPTS,afade=t=in:d=0.12,afade=t=out:st=${(b - a - 0.15).toFixed(2)}:d=0.15[a${i}]`),
    `${s.cuts.map((_, i) => `[v${i}][a${i}]`).join('')}concat=n=${n}:v=1:a=1[cv][ca]`,
    `[${H}:v]format=rgba[hk];[cv][hk]overlay=0:0:eof_action=pass[hv]`,
    `[${E}:v]fps=30,format=yuv420p,setsar=1[ev]`,
    `anullsrc=r=48000:cl=stereo,atrim=0:2.5[ea]`,
    `[hv][ca][ev][ea]concat=n=2:v=1:a=1[outv][outa]`,
  ].join(';');
  const dst = path.join(OUT, `${s.name}.mp4`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-loop', '1', '-framerate', '30', '-t', String(s.hookDur ?? 3.5), '-i', hook, '-loop', '1', '-framerate', '30', '-t', '2.5', '-i', end,
    '-filter_complex', fc, '-map', '[outv]', '-map', '[outa]', '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', dst]);
  console.log(s.name, (total + 2.5).toFixed(1) + 's');
}
fs.rmSync(TMP, {recursive: true, force: true});
