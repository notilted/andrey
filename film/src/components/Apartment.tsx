import React from 'react';
import {C} from '../theme';
import {rand} from '../util';

/** Квартира Марка в разрезе. Координаты: пол y=1110, потолок y=330, стены x=70…1010. */
export const ROOM = {left: 70, right: 1010, ceil: 330, floor: 1110, tableTop: 930, tableL: 330, tableR: 730};

const MiniCity: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={0} y={0} width={300} height={340} fill="#0c111b" />
    {Array.from({length: 40}).map((_, i) => (
      <circle key={i} cx={rand(i + 3) * 300} cy={rand(i + 8) * 200} r={0.6 + rand(i) * 1.2} fill="#cfd6e6" opacity={0.3 + 0.4 * Math.abs(Math.sin(f / 25 + i))} />
    ))}
    <circle cx={226} cy={70} r={22} fill={C.moon} />
    {[[0, 170, 70], [60, 120, 60], [110, 200, 50], [150, 90, 70], [210, 150, 50], [250, 110, 60]].map(([x, h, w], i) => (
      <g key={i}>
        <rect x={x} y={340 - h} width={w} height={h} fill={i % 2 ? '#151b28' : '#18202d'} />
        {Array.from({length: 8}).map((_, k) =>
          rand(i * 9 + k) > 0.6 ? <rect key={k} x={x + 8 + (k % 3) * 16} y={340 - h + 14 + Math.floor(k / 3) * 24} width={8} height={10} fill={C.warm} opacity={0.65} /> : null,
        )}
      </g>
    ))}
    {/* Останкинская башня вдали */}
    <rect x={40} y={60} width={5} height={130} fill="#151b28" />
    <circle cx={42.5} cy={58} r={2.5} fill={C.red} opacity={Math.floor(f / 20) % 2 ? 1 : 0.3} />
  </g>
);

export const ApartmentBack: React.FC<{f: number; alert?: number; lamp?: number}> = ({f, alert = 0, lamp = 1}) => {
  const {left, right, ceil, floor} = ROOM;
  return (
    <g>
      <defs>
        <radialGradient id="lampPool" cx="0.5" cy="0.35" r="0.6">
          <stop offset="0" stopColor={C.lamp} stopOpacity={0.32 * lamp} />
          <stop offset="0.5" stopColor={C.lamp} stopOpacity={0.1 * lamp} />
          <stop offset="1" stopColor={C.lamp} stopOpacity={0} />
        </radialGradient>
        <pattern id="wallpaper" width="64" height="64" patternUnits="userSpaceOnUse">
          <rect width="64" height="64" fill={C.wall} />
          <rect x="30" width="4" height="64" fill="#30353f" />
          <circle cx="12" cy="20" r="2.5" fill="#31363f" />
          <circle cx="52" cy="52" r="2.5" fill="#31363f" />
        </pattern>
      </defs>
      {/* фасад-разрез и соседние этажи */}
      <rect x={-200} y={-400} width={1480} height={2600} fill={C.facade} />
      <rect x={left} y={60} width={right - left} height={240} fill="#161b24" />
      <rect x={140} y={150} width={120} height={150} fill="#1b202a" />
      <rect x={720} y={190} width={180} height={110} fill={C.winDim} />
      <rect x={760} y={210} width={60} height={70} fill={C.warm} opacity={0.25} />
      <rect x={left} y={floor + 40} width={right - left} height={260} fill="#141920" />
      <rect x={300} y={floor + 40} width={6} height={60} fill="#1f252f" />
      <ellipse cx={303} cy={floor + 112} rx={30} ry={14} fill="#3a3a2c" />
      <ellipse cx={303} cy={floor + 140} rx={120} ry={50} fill={C.lamp} opacity={0.05} />
      {/* комната */}
      <rect x={left} y={ceil} width={right - left} height={floor - ceil} fill="url(#wallpaper)" />
      <rect x={left} y={floor - 26} width={right - left} height={26} fill="#252a33" />
      <rect x={left} y={floor - 30} width={right - left} height={5} fill="#363c48" />
      {/* окно с ночной Москвой */}
      <g transform="translate(640 430)">
        <MiniCity f={f} />
        <rect x={0} y={0} width={300} height={340} fill={C.red} opacity={alert * 0.18} />
        <rect x={-10} y={-10} width={320} height={360} fill="none" stroke="#1a1e26" strokeWidth={20} />
        <rect x={146} y={0} width={8} height={340} fill="#1a1e26" />
        <rect x={0} y={110} width={300} height={8} fill="#1a1e26" />
        <rect x={-24} y={350} width={348} height={16} fill="#3a404b" />
        <path d="M250 -26 Q290 140 270 380 L340 380 L340 -26 Z" fill="#4b3a3a" />
        <path d="M262 -26 Q296 140 282 380" stroke="#3a2c2d" strokeWidth={6} fill="none" />
      </g>
      {/* батарея */}
      <g transform="translate(680 820)">
        {Array.from({length: 9}).map((_, i) => <rect key={i} x={i * 26} y={0} width={20} height={90} rx={6} fill="#3a404b" />)}
      </g>
      {/* полка с книгами */}
      <g transform="translate(110 470)">
        <rect x={0} y={110} width={220} height={10} fill={C.woodHi} />
        <rect x={0} y={240} width={220} height={10} fill={C.woodHi} />
        {Array.from({length: 9}).map((_, i) => (
          <rect key={i} x={8 + i * 23} y={110 - (60 + rand(i) * 34)} width={18} height={60 + rand(i) * 34} fill={['#5a3a34', '#3c4a5c', '#6b5a3a', '#2f3a33', '#4a3550'][i % 5]} />
        ))}
        {Array.from({length: 6}).map((_, i) => (
          <rect key={i} x={10 + i * 22} y={240 - (52 + rand(i + 20) * 30)} width={18} height={52 + rand(i + 20) * 30} fill={['#3c4a5c', '#5a3a34', '#2f3a33'][i % 3]} />
        ))}
        <rect x={160} y={190} width={44} height={50} rx={6} fill="#3a404b" />
        <path d="M168 190 Q182 160 196 190" fill="#2f4a3a" />
      </g>
      {/* детский рисунок на стене */}
      <g transform="translate(360 372) rotate(-3)">
        <rect width={150} height={110} fill="#e9e4d6" />
        <path d="M20 90 L20 55 L55 30 L90 55 L90 90 Z" fill="none" stroke="#c0503f" strokeWidth={4} />
        <circle cx={120} cy={28} r={14} fill={C.warm} />
        <path d="M100 95 l8 -16 l8 16 M125 95 l6 -12 l6 12" stroke="#3c6a4a" strokeWidth={3} fill="none" />
        <rect x={70} y={-6} width={14} height={14} fill="#d9c27a" opacity={0.8} />
      </g>
      {/* лампа: провод и свет */}
      <rect x={528} y={ceil} width={3} height={210} fill="#15181e" />
      <rect x={left} y={ceil} width={right - left} height={floor - ceil} fill="url(#lampPool)" />
      {/* межэтажные плиты (разрез) */}
      <rect x={left - 30} y={ceil - 34} width={right - left + 60} height={34} fill={C.facadeHi} />
      <rect x={left - 30} y={floor} width={right - left + 60} height={40} fill={C.facadeHi} />
      <rect x={left - 30} y={60} width={30} height={floor + 300} fill={C.facadeHi} />
      <rect x={right} y={60} width={30} height={floor + 300} fill={C.facadeHi} />
    </g>
  );
};

/** Стул (спинкой в сторону back). */
export const Chair: React.FC<{x: number; facing: 1 | -1; seat?: number}> = ({x, facing, seat = 1004}) => (
  <g transform={`translate(${x} 0) scale(${facing} 1)`}>
    <rect x={-50} y={seat} width={100} height={12} rx={3} fill={C.woodHi} />
    <rect x={-46} y={seat + 12} width={8} height={ROOM.floor - seat - 12} fill={C.wood} />
    <rect x={38} y={seat + 12} width={8} height={ROOM.floor - seat - 12} fill={C.wood} />
    <rect x={-54} y={seat - 150} width={10} height={162} rx={3} fill={C.wood} />
    <rect x={-54} y={seat - 150} width={22} height={40} rx={4} fill={C.woodHi} />
  </g>
);

/** Стол с предметами + свет абажура. phone — свечение экранов (0..1), shake — вибрация. */
export const ApartmentFront: React.FC<{f: number; phone?: number; shake?: number; drawn?: number; lamp?: number; steam?: number}> = ({f, phone = 0, shake = 0, drawn = 1, lamp = 1, steam = 1}) => {
  const {tableTop, tableL, tableR, floor} = ROOM;
  const jx = shake ? Math.sin(f * 2.9) * 3 * shake : 0;
  return (
    <g>
      <defs>
        <radialGradient id="phoneGlow">
          <stop offset="0" stopColor={C.redHot} stopOpacity={0.45} />
          <stop offset="1" stopColor={C.redHot} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* абажур */}
      <path d="M470 540 L590 540 L566 490 L494 490 Z" fill="#2a2f38" />
      <ellipse cx={530} cy={542} rx={60} ry={8} fill={C.lamp} opacity={0.9 * lamp} />
      <polygon points={`470,542 590,542 ${tableR + 60},${tableTop} ${tableL - 60},${tableTop}`} fill={C.lamp} opacity={0.07 * lamp} />
      {/* стол */}
      <rect x={tableL - 20} y={tableTop} width={tableR - tableL + 40} height={18} rx={4} fill={C.woodHi} />
      <rect x={tableL - 20} y={tableTop + 18} width={tableR - tableL + 40} height={10} fill={C.wood} />
      <rect x={tableL} y={tableTop + 28} width={14} height={floor - tableTop - 28} fill={C.wood} />
      <rect x={tableR - 14} y={tableTop + 28} width={14} height={floor - tableTop - 28} fill={C.wood} />
      {/* кружка с паром */}
      <g transform={`translate(${tableL + 60} ${tableTop})`}>
        <rect x={0} y={-40} width={36} height={40} rx={5} fill="#d9d4c7" />
        <path d="M36 -32 q14 0 14 12 q0 12 -14 12" stroke="#d9d4c7" strokeWidth={6} fill="none" />
        {[0, 1, 2].map((i) => {
          const p = (f / 50 + i / 3) % 1;
          return <path key={i} d={`M${12 + i * 6} ${-46 - p * 60} q${6 + Math.sin(p * 6) * 4} -10 0 -20`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.3 * (1 - p) * steam} />;
        })}
      </g>
      {/* телефон Марка */}
      <g transform={`translate(${tableL + 150 + jx} ${tableTop - 6})`}>
        <rect x={0} y={0} width={70} height={8} rx={3} fill="#0d0f14" />
        <rect x={4} y={-2} width={62} height={4} rx={2} fill={phone ? C.redHot : '#1c2230'} opacity={phone ? 0.6 + 0.4 * phone : 1} />
        {phone > 0 && <ellipse cx={35} cy={-20} rx={110} ry={70} fill="url(#phoneGlow)" opacity={phone} />}
      </g>
      {/* рисунок Алисы и карандаши */}
      <g transform={`translate(${tableR - 170} ${tableTop - 4})`}>
        <polygon points="0,4 120,4 128,0 8,0" fill="#e9e4d6" />
        <rect x={20} y={-1} width={80 * drawn} height={2} fill="#6a6f7a" opacity={0.8} />
        <rect x={-30} y={-2} width={26} height={4} fill={C.red} />
        <rect x={-62} y={-2} width={26} height={4} fill="#3c6a4a" />
      </g>
      {/* планшет Алисы */}
      <g transform={`translate(${tableR - 20 - jx} ${tableTop - 6})`}>
        <rect x={0} y={0} width={56} height={7} rx={2} fill="#0d0f14" />
        {phone > 0 && <ellipse cx={28} cy={-18} rx={90} ry={60} fill="url(#phoneGlow)" opacity={phone * 0.8} />}
      </g>
    </g>
  );
};
