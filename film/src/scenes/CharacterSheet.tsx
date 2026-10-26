import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Character} from '../components/Character';
import {C, FONT} from '../theme';

/** Лист персонажей — контроль единообразия внешности. */
export const CharacterSheet: React.FC = () => {
  const f = useCurrentFrame();
  const label = (x: number, t: string) => (
    <text x={x} y={1020} fill={C.white} fontFamily={FONT} fontWeight={900} fontSize={34} textAnchor="middle">{t}</text>
  );
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <rect x={0} y={960} width={1080} height={960} fill={C.ground} />
        <Character who="mark" x={150} y={960} size={1.25} frame={f} />
        <Character who="alisa" x={390} y={960} size={1.25} frame={f} pose={{smile: 0.6}} />
        <Character who="galina" x={620} y={960} size={1.25} frame={f} pose={{brow: 0.5, mouth: 0.5}} />
        <Character who="lev" x={880} y={960} size={1.25} frame={f} facing={-1} pose={{look: -0.3}} />
        {label(150, 'МАРК')}{label(390, 'АЛИСА')}{label(620, 'ГАЛИНА')}{label(880, 'ЛЕВ')}
        <Character who="mark" x={250} y={1600} size={1.25} frame={f} pose={{sit: 1, armF: [70, -60], brow: 0.8, look: 0.5}} />
        <Character who="alisa" x={700} y={1600} size={1.25} frame={f} pose={{sit: 1, armF: [60, -40], lean: 10, headTilt: 12, blink: 0.1}} />
      </svg>
    </AbsoluteFill>
  );
};
