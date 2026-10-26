import {Easing, interpolate} from 'remotion';

export const ease = Easing.bezier(0.45, 0, 0.25, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/** Кусочная интерполяция по ключам [кадр, значение] с плавными переходами. */
export const keys = (f: number, k: [number, number][], e = ease) => {
  if (f <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    if (f <= k[i][0]) {
      return interpolate(f, [k[i - 1][0], k[i][0]], [k[i - 1][1], k[i][1]], {easing: e});
    }
  }
  return k[k.length - 1][1];
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const ramp = (f: number, a: number, b: number, e = ease) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

/** Детерминированный псевдослучайный генератор. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Моргание: короткое закрытие глаз раз в ~3–4 секунды. */
export const blink = (f: number, seed = 0) => {
  const period = 95 + Math.floor(rand(seed) * 40);
  const p = (f + seed * 37) % period;
  return p < 4 ? [0.15, 0.05, 0.05, 0.4][p] : 1;
};
