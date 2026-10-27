import React from 'react';
import {interpolate} from 'remotion';
import {ease, keys} from '../util';

/** Общие приёмы сцен «Трёх волн»: камера по ключам, тряска, SVG-кадр. */
export type Cam = [number, number, number, number];
export const camera = (f: number, list: Cam[]) => {
  const k = (i: 1 | 2 | 3) => keys(f, list.map((c) => [c[0], c[i]] as [number, number]), ease);
  return `translate(540 860) scale(${k(3)}) translate(${-k(1)} ${-k(2)})`;
};
export const ease01 = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
export const shakeXY = (f: number, amp: number) => (amp ? `translate(${Math.sin(f * 2.9) * amp} ${Math.cos(f * 3.7) * amp * 0.7})` : '');

/** Положение глаза стоящего персонажа (для слёз) — повторяет геометрию Character. */
export const eye = (x: number, y: number, size: number, facing: 1 | -1, scale: number, hs: number, torso: number) => {
  const headY = -(82 + 78) - 6 - torso - 40 * hs;
  const k = size * scale;
  return {x: x + facing * (4 + 9 * hs) * k, y: y + (headY - 4 * hs) * k};
};

export const SVG: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute'}}>{children}</svg>
);

