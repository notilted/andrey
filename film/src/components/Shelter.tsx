import React from 'react';
import {C} from '../theme';
import {rand} from '../util';

/** Убежище в подвале дома. Пол y=1110, потолок y=330, мир шире кадра: x −260…1340. */
export const SH = {left: -260, right: 1340, ceil: 330, floor: 1110, door: {x: -150, w: 230}, table: {x: 800, w: 270, top: 930}, monitor: {x: 1270, y: 760}};

export type ShelterLight = {
  lamps: number; // аварийные жёлтые лампы 0..1
  red: number; // красная аварийная 0..1
  monitor: number; // свечение монитора 0..1
};

const Lamp: React.FC<{x: number; y: number; on: number; color: string}> = ({x, y, on, color}) => (
  <g>
    <circle cx={x} cy={y} r={170} fill={`url(#shLampHalo${color === C.lamp ? 'Y' : 'R'})`} opacity={on} />
    <rect x={x - 22} y={y - 30} width={44} height={10} fill="#1d2129" />
    <ellipse cx={x} cy={y} rx={18} ry={16} fill={on > 0.05 ? color : '#2a2e35'} opacity={0.4 + 0.6 * on} />
    {/* решётка */}
    <g stroke="#14171c" strokeWidth={3} fill="none">
      <ellipse cx={x} cy={y} rx={20} ry={18} />
      <path d={`M${x - 20} ${y} H${x + 20} M${x} ${y - 18} V${y + 18}`} />
    </g>
  </g>
);

export const ShelterBack: React.FC<{f: number; light: ShelterLight; doorShake?: number}> = ({f, light, doorShake = 0}) => {
  const {left, right, ceil, floor, door} = SH;
  const dj = doorShake ? Math.sin(f * 3.3) * 3 * doorShake : 0;
  return (
    <g>
      <defs>
        <radialGradient id="shLampHaloY">
          <stop offset="0" stopColor={C.lamp} stopOpacity={0.3} />
          <stop offset="1" stopColor={C.lamp} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="shLampHaloR">
          <stop offset="0" stopColor={C.redHot} stopOpacity={0.4} />
          <stop offset="1" stopColor={C.redHot} stopOpacity={0} />
        </radialGradient>
        <pattern id="concrete" width="160" height="120" patternUnits="userSpaceOnUse">
          <rect width="160" height="120" fill="#262b33" />
          <rect width="160" height="2" fill="#1f232a" />
          <rect width="2" height="120" fill="#1f232a" />
          <circle cx="40" cy="30" r="2" fill="#2c3139" />
          <circle cx="120" cy="90" r="2" fill="#2c3139" />
        </pattern>
      </defs>
      <rect x={-1200} y={-800} width={3600} height={3600} fill={C.facade} />
      {/* земля над подвалом */}
      <rect x={-1200} y={ceil - 220} width={3600} height={190} fill="#141922" />
      <rect x={-1200} y={ceil - 34} width={3600} height={34} fill={C.facadeHi} />
      <rect x={left} y={ceil} width={right - left} height={floor - ceil} fill="url(#concrete)" />
      <rect x={left} y={floor - 60} width={right - left} height={60} fill="#20252c" />
      {/* трубы под потолком */}
      <rect x={left} y={ceil + 30} width={right - left} height={26} rx={13} fill="#363c46" />
      <rect x={left} y={ceil + 66} width={right - left} height={14} rx={7} fill="#2e333c" />
      {Array.from({length: 9}).map((_, i) => (
        <rect key={i} x={left + 80 + i * 180} y={ceil + 26} width={14} height={34} fill="#2a2f37" />
      ))}
      {/* гермодверь */}
      <g transform={`translate(${door.x + dj} 0)`}>
        <rect x={-14} y={floor - 470} width={door.w + 28} height={470} fill="#1b1f26" />
        <rect x={0} y={floor - 456} width={door.w} height={456} rx={8} fill="#3b4048" />
        <rect x={14} y={floor - 440} width={door.w - 28} height={424} rx={6} fill="none" stroke="#2e333a" strokeWidth={6} />
        <circle cx={door.w / 2} cy={floor - 230} r={46} fill="none" stroke="#5a606a" strokeWidth={8} />
        <path d={`M${door.w / 2 - 46} ${floor - 230} H${door.w / 2 + 46} M${door.w / 2} ${floor - 276} V${floor - 184}`} stroke="#5a606a" strokeWidth={6} />
        {Array.from({length: 4}).map((_, i) => (
          <rect key={i} x={door.w - 16} y={floor - 400 + i * 110} width={18} height={30} rx={4} fill="#2c3036" />
        ))}
      </g>
      {/* табличка */}
      <g transform={`translate(${door.x + door.w / 2} ${floor - 520})`}>
        <rect x={-130} y={-26} width={260} height={52} rx={6} fill="#d9d4c7" />
        <text x={0} y={10} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={28} fill="#2a2e35">УБЕЖИЩЕ № 17</text>
      </g>
      {/* громкоговоритель */}
      <g transform="translate(560 420)">
        <rect x={-8} y={-30} width={16} height={30} fill="#1d2129" />
        <path d="M-30 0 L30 0 L54 54 L-54 54 Z" fill="#3a3f48" />
        <ellipse cx={0} cy={54} rx={54} ry={12} fill="#15181d" />
      </g>
      {/* скамьи вдоль стены */}
      {[[120, 520], [700, 380]].map(([x, w], i) => (
        <g key={i}>
          <rect x={x} y={floor - 150} width={w} height={14} rx={4} fill="#3a3230" />
          <rect x={x + 10} y={floor - 136} width={10} height={76} fill="#2a2422" />
          <rect x={x + w - 20} y={floor - 136} width={10} height={76} fill="#2a2422" />
        </g>
      ))}
      {/* вентиляционная решётка, огнетушитель */}
      <g transform="translate(380 520)">
        <rect width={110} height={70} fill="#1f232a" />
        {Array.from({length: 6}).map((_, i) => <rect key={i} x={8} y={8 + i * 10} width={94} height={4} fill="#2e333b" />)}
      </g>
      <g transform="translate(1260 900)">
        <rect x={0} y={0} width={34} height={90} rx={14} fill="#8a2e2a" />
        <rect x={8} y={-16} width={18} height={18} fill="#1c1f24" />
      </g>
      {/* лампы */}
      <Lamp x={300} y={ceil + 140} on={light.lamps * (0.9 + 0.1 * Math.sin(f / 5))} color={C.lamp} />
      <Lamp x={820} y={ceil + 140} on={light.lamps * (0.92 + 0.08 * Math.sin(f / 6 + 2))} color={C.lamp} />
      <Lamp x={1160} y={ceil + 140} on={light.lamps} color={C.lamp} />
      <Lamp x={560} y={ceil + 110} on={light.red * (0.7 + 0.3 * Math.sin(f / 9))} color={C.redHot} />
    </g>
  );
};

/** Мелкие фигуры: силуэт пьесы. */
const Piece: React.FC<{x: number; y: number; k: 'p' | 'k' | 'q' | 'n' | 'r'; white: boolean; s?: number}> = ({x, y, k, white, s = 1}) => {
  const c = white ? '#e6e0d2' : '#15181d';
  const top = {p: <circle cx={0} cy={-26} r={7} />, k: <path d="M-2 -46 h4 v6 h6 v4 h-6 v6 h-4 v-6 h-6 v-4 h6 Z" />, q: <circle cx={0} cy={-36} r={6} />, n: <path d="M-8 -20 L-6 -40 L8 -34 L6 -26 L2 -28 L4 -20 Z" />, r: <rect x={-8} y={-34} width={16} height={12} />}[k];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={c}>
      <path d="M-11 0 L11 0 L8 -6 L-8 -6 Z" />
      <path d={k === 'p' ? 'M-5 -6 L5 -6 L3 -20 L-3 -20 Z' : 'M-6 -6 L6 -6 L4 -30 L-4 -30 Z'} />
      {top}
    </g>
  );
};

/** Шахматная доска сбоку (на столе Льва). moveT — 0..1 перемещение белого коня. */
export const ChessSide: React.FC<{x: number; y: number; moveT?: number}> = ({x, y, moveT = 0}) => (
  <g transform={`translate(${x} ${y})`}>
    <polygon points="-110,0 110,0 96,-16 -96,-16" fill="#4a3f36" />
    {Array.from({length: 8}).map((_, i) => (
      <polygon key={i} points={`${-96 + i * 24},-16 ${-96 + (i + 1) * 24},-16 ${-110 + (i + 1) * 27.5},0 ${-110 + i * 27.5},0`} fill={i % 2 ? '#c9bea8' : '#5a4a3c'} />
    ))}
    <rect x={-110} y={0} width={220} height={8} fill="#2e2620" />
    {[-80, -50, -20, 30, 60].map((px, i) => <Piece key={i} x={px} y={-8} k={(['r', 'p', 'k', 'p', 'q'] as const)[i]} white={false} s={0.7} />)}
    {[-66, 6, 44].map((px, i) => <Piece key={i} x={px} y={-4} k={(['p', 'p', 'r'] as const)[i]} white s={0.8} />)}
    <Piece x={-30 + moveT * 50} y={-4 - Math.sin(moveT * Math.PI) * 24} k="n" white s={0.8} />
  </g>
);

/** Крупный план доски сверху-сбоку с рукой Льва. */
export const ChessCloseup: React.FC<{f: number; moveT: number}> = ({moveT}) => {
  const sq = 96;
  const ox = 540 - sq * 4;
  const oy = 380;
  const sk = (x: number, y: number) => [ox + x * sq * (0.86 + (y / 8) * 0.14) + (1 - (0.86 + (y / 8) * 0.14)) * sq * 4, oy + y * sq * 0.62] as const;
  const pieces: [number, number, 'p' | 'k' | 'q' | 'n' | 'r', boolean][] = [
    [0, 1, 'r', false], [4, 0, 'k', false], [3, 1, 'q', false], [5, 2, 'p', false], [6, 2, 'p', false], [2, 3, 'p', false],
    [3, 4, 'p', true], [4, 5, 'p', true], [6, 6, 'p', true], [4, 7, 'k', true], [7, 7, 'r', true],
  ];
  const [nx0, ny0] = sk(2.5, 6.5);
  const [nx1, ny1] = sk(3.5, 4.5);
  const nx = nx0 + (nx1 - nx0) * moveT;
  const ny = ny0 + (ny1 - ny0) * moveT - Math.sin(moveT * Math.PI) * 60;
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1300} fill="#1a1d22" />
      <rect x={0} y={0} width={1080} height={1300} fill={C.lamp} opacity={0.05} />
      {Array.from({length: 8}).map((_, y) =>
        Array.from({length: 8}).map((__, x) => {
          const [a, b] = sk(x, y);
          const [c, d] = sk(x + 1, y);
          const [e, g] = sk(x + 1, y + 1);
          const [h, i] = sk(x, y + 1);
          return <polygon key={`${x}${y}`} points={`${a},${b} ${c},${d} ${e},${g} ${h},${i}`} fill={(x + y) % 2 ? '#5a4a3c' : '#c9bea8'} />;
        }),
      )}
      {pieces.map(([x, y, k, w], i) => {
        const [px, py] = sk(x + 0.5, y + 0.5);
        return <Piece key={i} x={px} y={py + 20} k={k} white={w} s={1.9 + y * 0.08} />;
      })}
      <Piece x={nx} y={ny + 20} k="n" white s={2.3} />
      {/* рука Льва держит коня: рукав свитера сверху справа, кисть */}
      {moveT < 1 && (
        <g transform={`translate(${nx + 26} ${ny - 64})`}>
          <path d="M-10 -10 C30 -60 120 -170 260 -420 L380 -360 C250 -160 120 -40 40 30 Z" fill="#2c3834" />
          <path d="M-10 -10 C30 -60 120 -170 260 -420 L290 -405 C160 -170 60 -50 10 10 Z" fill="#202a27" />
          <path d="M-30 6 C-34 -22 -6 -38 22 -30 C46 -22 52 8 34 30 C18 46 -20 40 -30 6 Z" fill="#b98e78" />
          <path d="M-34 10 C-46 18 -50 34 -38 40 C-28 44 -20 34 -18 26" fill="#93705f" />
          <path d="M-14 34 C-18 52 -8 60 2 54" stroke="#93705f" strokeWidth={9} strokeLinecap="round" fill="none" />
        </g>
      )}
    </g>
  );
};

/** Стол Льва + монитор видеонаблюдения (перед персонажами). */
export const ShelterFront: React.FC<{f: number; light: ShelterLight; chessT?: number; monitorOn?: number}> = ({f, light, chessT = 0, monitorOn = 0}) => {
  const {table, floor, monitor} = SH;
  const noise = 0.85 + 0.15 * Math.sin(f * 1.7);
  return (
    <g>
      <rect x={table.x} y={table.top} width={table.w} height={16} rx={3} fill="#4a3f3a" />
      <rect x={table.x + 14} y={table.top + 16} width={12} height={floor - table.top - 16} fill="#3a3230" />
      <rect x={table.x + table.w - 26} y={table.top + 16} width={12} height={floor - table.top - 16} fill="#3a3230" />
      <ChessSide x={table.x + 140} y={table.top} moveT={chessT} />
      {/* монитор на стойке у стены */}
      <g transform={`translate(${monitor.x} ${monitor.y})`}>
        <rect x={-10} y={70} width={20} height={floor - monitor.y - 70} fill="#1d2129" />
        <rect x={-80} y={-60} width={160} height={130} rx={12} fill="#1b1e24" />
        <rect x={-66} y={-48} width={132} height={100} rx={8} fill={monitorOn ? '#9fb3a6' : '#0d1013'} opacity={monitorOn ? 0.35 + 0.65 * monitorOn * noise : 1} />
        {monitorOn > 0 && <circle cx={0} cy={0} r={160} fill="#9fb3a6" opacity={0.12 * monitorOn} />}
        <circle cx={58} cy={60} r={3} fill={monitorOn ? C.red : '#333'} />
      </g>
      {/* общее освещение помещения */}
      <rect x={-1200} y={-800} width={3600} height={3600} fill="#05070b" opacity={0.55 * (1 - Math.max(light.lamps, light.red * 0.7, monitorOn * 0.4))} />
      <rect x={-1200} y={-800} width={3600} height={3600} fill={C.redHot} opacity={0.08 * light.red} style={{mixBlendMode: 'screen'}} />
    </g>
  );
};

/** Клетка с попугаем. flap — фаза взмаха крыльев (рад), 0 — сидит. */
export const Cage: React.FC<{x: number; y: number; f: number; flap?: number; s?: number}> = ({x, y, f, flap = 0, s = 1}) => {
  const w = Math.sin(flap) * 18;
  const bob = Math.sin(f / 6) * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-50 0 L-50 -90 Q-50 -140 0 -140 Q50 -140 50 -90 L50 0 Z" fill="#000" opacity={0.15} />
      {/* попугай */}
      <g transform={`translate(0 ${-30 + bob})`}>
        <rect x={-26} y={4} width={52} height={4} fill="#8a7a5a" />
        <path d="M-12 4 Q-16 -30 0 -40 Q16 -30 12 4 Z" fill="#4f8a6a" />
        <path d={`M-10 -24 Q${-30 - w} ${-14 - w} -14 0 Z`} fill="#3c6f55" />
        <path d={`M10 -24 Q${30 + w} ${-14 - w} 14 0 Z`} fill="#3c6f55" />
        <circle cx={0} cy={-44} r={11} fill="#5a9a76" />
        <path d="M6 -46 Q16 -44 10 -36 Z" fill={C.warm} />
        <circle cx={2} cy={-47} r={2} fill="#111" />
        <path d="M-2 4 L-6 22 M2 4 L6 22" stroke="#c9a03a" strokeWidth={3} />
        <path d="M-4 4 L-10 30 L2 30 Z" fill="#c0503f" />
      </g>
      {/* прутья */}
      <g stroke="#c9b98a" strokeWidth={2.5} fill="none">
        {Array.from({length: 9}).map((_, i) => {
          const xx = -50 + i * 12.5;
          return <path key={i} d={`M${xx} 0 L${xx} -90 Q${xx} ${-130 + Math.abs(xx) * 0.3} 0 -140`} />;
        })}
        <path d="M-50 -90 H50 M-50 -45 H50" />
        <path d="M-8 -140 Q0 -160 8 -140" strokeWidth={4} />
      </g>
      <rect x={-56} y={-4} width={112} height={10} rx={3} fill="#a08a5a" />
    </g>
  );
};

/** Массовка в убежище: сидящие силуэты с телефонами. */
export const EXTRAS = Array.from({length: 7}).map((_, i) => ({
  x: [170, 270, 380, 520, 740, 860, 990][i],
  facing: (rand(i + 4) > 0.5 ? 1 : -1) as 1 | -1,
  top: ['#3a4a3e', '#4a3a48', '#2f3a4a', '#4a4236', '#36404a', '#4a3434', '#3a3a44'][i],
  hair: ['#1a1a1a', '#5a4030', '#9a9a9a', '#2a1a14', '#151515', '#6b5a40', '#202020'][i],
  style: (['mark', 'galina', 'lev', 'alisa', 'mark', 'lev', 'galina'] as const)[i],
  scale: 0.86 + rand(i + 9) * 0.12,
}));
