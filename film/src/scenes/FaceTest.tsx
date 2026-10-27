import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character, Who} from '../components/Character';
import {C} from '../theme';

/** Контроль лиц: поворот взгляда × открытие рта, крупно. */
export const FaceTest: React.FC = () => {
  const whos: Who[] = ['mark', 'alisa', 'galina', 'lev'];
  const cells: [number, number][] = [[-0.3, 0], [0.6, 0.5], [0.9, 1]];
  return (
    <AbsoluteFill style={{background: C.wall}}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        {whos.map((w, r) =>
          cells.map(([look, mouth], c) => (
            <g key={`${r}${c}`}>
              <clipPath id={`c${r}${c}`}><rect x={c * 360} y={r * 480} width={360} height={480} /></clipPath>
              <g clipPath={`url(#c${r}${c})`}>
                <Character who={w} x={c * 360 + 150} y={r * 480 + (w === 'alisa' ? 1150 : 1080)} size={w === 'alisa' ? 4.2 : 3.2} pose={{look, mouth, brow: 0.6}} />
              </g>
            </g>
          )),
        )}
      </svg>
    </AbsoluteFill>
  );
};
