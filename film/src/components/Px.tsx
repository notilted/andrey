import React from 'react';
import {C, FONT} from '../theme';
import {rand} from '../util';
import {Character, Look} from './Character';

/**
 * Пиксельный стиль: сцена рисуется векторно, затем фильтр берёт по одной точке из блока size×size
 * (крупный пиксель) и квантует цвета в ограниченную палитру (ступенчатые переходы, как в 16-бит).
 */
export const PixelFilter: React.FC<{id: string; size?: number; levels?: number}> = ({id, size = 6, levels = 7}) => {
  const table = Array.from({length: levels}).map((_, i) => (i / (levels - 1)).toFixed(3)).join(' ');
  const half = Math.floor(size / 2);
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feFlood x={half - 1} y={half - 1} width={2} height={2} floodColor="#000" floodOpacity={1} />
      <feComposite width={size} height={size} />
      <feTile result="grid" />
      <feComposite in="SourceGraphic" in2="grid" operator="in" />
      <feMorphology operator="dilate" radius={half} result="px" />
      <feComponentTransfer in="px">
        <feFuncR type="discrete" tableValues={table} />
        <feFuncG type="discrete" tableValues={table} />
        <feFuncB type="discrete" tableValues={table} />
      </feComponentTransfer>
    </filter>
  );
};

/** Обёртка: всё внутри становится пиксель-артом. */
export const Pixel: React.FC<{size?: number; levels?: number; children: React.ReactNode}> = ({size = 6, levels = 7, children}) => {
  const id = 'px' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute'}}>
      <defs><PixelFilter id={id} size={size} levels={levels} /></defs>
      <g filter={`url(#${id})`}>{children}</g>
    </svg>
  );
};

export const SUIT: Partial<Look> = {top: '#1f2a44', topShade: '#141c30', bottom: '#1a2236', shoes: '#0d0f12', skin: '#e0b090', skinShade: '#b88a6e', hair: '#2a1a10'};
export const BROKER = (i: number): Partial<Look> => ({top: ['#e8e4da', '#cfd8e8', '#e8dcc8'][i % 3], topShade: '#b8b4aa', bottom: ['#1a2236', '#2a2a2a', '#3a2e25'][i % 3], hair: ['#1a1410', '#5a4030', '#2a1a14', '#8a6a40'][i % 4], skin: ['#e0b090', '#c99a7a', '#d8a888'][i % 3]});

/** Торговый зал Stratton Oakmont: столы, мониторы с зелёными котировками, брокеры с трубками. */
export const TradingFloor: React.FC<{f: number; roar?: number}> = ({f, roar = 0.5}) => (
  <g>
    <defs>
      <linearGradient id="tfWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3550" /><stop offset="1" stopColor="#4a5a7a" /></linearGradient>
      <linearGradient id="tfFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a4a3a" /><stop offset="1" stopColor="#2a2018" /></linearGradient>
      <radialGradient id="tfLamp" cx="0.5" cy="0" r="0.8"><stop offset="0" stopColor="#ffe9b0" stopOpacity={0.5} /><stop offset="1" stopColor="#ffe9b0" stopOpacity={0} /></radialGradient>
    </defs>
    <rect x={-200} y={0} width={1500} height={1100} fill="url(#tfWall)" />
    {[150, 540, 930].map((x, i) => <g key={i}><rect x={x - 60} y={60} width={120} height={20} fill="#c9c3b2" /><ellipse cx={x} cy={400} rx={380} ry={420} fill="url(#tfLamp)" /></g>)}
    {/* табло котировок */}
    <rect x={40} y={180} width={1000} height={200} fill="#0a0f0a" />
    {Array.from({length: 4}).map((_, r) => (
      <text key={r} x={60 - ((f * 3 + r * 140) % 400)} y={230 + r * 44} fontFamily="JetBrains Mono" fontWeight={800} fontSize={34} fill={r % 2 ? '#5ad08a' : '#ffd24a'}>
        STRT +4.25 ▲  DOLE +2.10 ▲  SMAD +18.75 ▲  AERO +3.80 ▲  STRT +4.25 ▲  DOLE +2.10 ▲
      </text>
    ))}
    <rect x={-200} y={1100} width={1500} height={900} fill="url(#tfFloor)" />
    {/* ряды столов с брокерами */}
    {[0, 1, 2].map((row) => {
      const y = 1180 + row * 230;
      const s = 0.7 + row * 0.2;
      return (
        <g key={row}>
          {Array.from({length: 5 - row}).map((_, i) => {
            const x = -40 + i * (1180 / (5 - row)) + row * 60;
            const k = row * 7 + i;
            const shout = Math.sin(f / (4 + rand(k) * 3) + k) > 0.2 ? roar : 0;
            return (
              <g key={i}>
                <Character who="mark" hair={(['lev', 'mark', 'lev'] as const)[k % 3]} x={x + 70 * s} y={y} size={s} facing={rand(k + 3) > 0.5 ? 1 : -1} frame={f + k * 9} override={BROKER(k)}
                  pose={{armF: shout ? [150, -40] : [120, -140], armB: [30, -60], mouth: shout * (0.5 + 0.4 * Math.sin(f / 2 + k)), brow: shout ? 0.6 : 0, blink: 1, rim: 0.6, rimColor: '#ffe9b0'}} />
                <rect x={x} y={y - 120 * s} width={230 * s} height={22 * s} fill="#6a4a30" />
                <rect x={x + 20 * s} y={y - 98 * s} width={190 * s} height={98 * s} fill="#4a3424" />
                <rect x={x + 130 * s} y={y - 210 * s} width={90 * s} height={80 * s} fill="#2a2e35" />
                <rect x={x + 138 * s} y={y - 202 * s} width={74 * s} height={60 * s} fill="#1a4a2a" />
                <rect x={x + 142 * s} y={y - 180 * s} width={(30 + 30 * rand(k + f % 30)) * s} height={6 * s} fill="#5ad08a" />
              </g>
            );
          })}
        </g>
      );
    })}
  </g>
);

/** Яхта ночью в море. */
export const YachtNight: React.FC<{f: number; storm?: number; sink?: number}> = ({f, storm = 0, sink = 0}) => (
  <g>
    <defs>
      <linearGradient id="ynSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0e1e" /><stop offset="0.6" stopColor="#1a2a4a" /><stop offset="1" stopColor="#2a4a6a" /></linearGradient>
      <radialGradient id="ynNeb" cx="0.6" cy="0.3" r="0.5"><stop offset="0" stopColor="#3a8a6a" stopOpacity={0.7} /><stop offset="0.6" stopColor="#2a4a8a" stopOpacity={0.4} /><stop offset="1" stopColor="#2a4a8a" stopOpacity={0} /></radialGradient>
      <linearGradient id="ynSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a3a5a" /><stop offset="1" stopColor="#0a1424" /></linearGradient>
    </defs>
    <rect x={-200} y={-200} width={1500} height={1400} fill="url(#ynSky)" />
    <ellipse cx={680} cy={420} rx={700} ry={420} fill="url(#ynNeb)" opacity={1 - storm} />
    {Array.from({length: 80}).map((_, i) => <rect key={i} x={rand(i) * 1080} y={rand(i + 5) * 900} width={6} height={6} fill="#cfe0ff" opacity={(0.4 + 0.6 * Math.abs(Math.sin(f / 20 + i))) * (1 - storm)} />)}
    <circle cx={820} cy={260} r={70} fill="#e8e0c0" opacity={1 - storm} />
    <rect x={-200} y={1050} width={1500} height={1000} fill="url(#ynSea)" />
    {Array.from({length: 30}).map((_, i) => <rect key={i} x={((rand(i) * 1400 + f * (1 + storm * 3)) % 1400) - 200} y={1070 + (i % 10) * 70} width={80 + rand(i + 2) * 120} height={8} fill="#4a7a9a" opacity={0.6} />)}
    {/* яхта */}
    <g transform={`translate(540 ${1080 + sink * 260 + Math.sin(f / 15) * (6 + storm * 20)}) rotate(${Math.sin(f / 20) * (1 + storm * 6) + sink * 14})`}>
      <path d="M-420 0 L380 0 Q440 -10 460 -60 L-380 -60 Z" fill="#f2f2ee" />
      <path d="M-420 0 L380 0 Q420 -6 440 -30 L-400 -30 Z" fill="#c9c3b8" />
      <rect x={-300} y={-150} width={520} height={90} rx={10} fill="#e8e4da" />
      <rect x={-200} y={-220} width={320} height={70} rx={10} fill="#dcd6c8" />
      {Array.from({length: 7}).map((_, i) => <rect key={i} x={-280 + i * 70} y={-130} width={46} height={30} fill="#ffd98a" />)}
      <rect x={-100} y={-300} width={10} height={80} fill="#9aa0a8" />
      <text x={200} y={-18} fontFamily={FONT} fontWeight={900} fontSize={30} fill="#1f2a44">NADINE</text>
    </g>
    {storm > 0 && Array.from({length: 120}).map((_, i) => <rect key={i} x={rand(i) * 1200 - 60} y={(rand(i + 3) * 2000 + f * 30) % 2000 - 100} width={4} height={40} fill="#9ab0d0" opacity={storm * 0.6} transform="rotate(12)" />)}
  </g>
);

/** Тюремная камера. */
export const Cell: React.FC<{f: number}> = ({f}) => (
  <g>
    <defs>
      <linearGradient id="clWall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a3e44" /><stop offset="1" stopColor="#5a5e64" /></linearGradient>
      <linearGradient id="clBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff2c8" stopOpacity={0.55} /><stop offset="1" stopColor="#fff2c8" stopOpacity={0} /></linearGradient>
    </defs>
    <rect x={-200} y={0} width={1500} height={1300} fill="url(#clWall)" />
    {Array.from({length: 14}).map((_, r) => Array.from({length: 8}).map((__, c) => <rect key={`${r}-${c}`} x={-60 + c * 160 + (r % 2) * 80} y={r * 90} width={150} height={82} fill="none" stroke="#2e3238" strokeWidth={6} />))}
    <rect x={680} y={260} width={220} height={160} fill="#9ab0c8" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={700 + i * 56} y={260} width={14} height={160} fill="#2a2e35" />)}
    <polygon points="680,420 900,420 760,1300 200,1300" fill="url(#clBeam)" />
    <rect x={-200} y={1300} width={1500} height={700} fill="#2a2e34" />
    <rect x={60} y={1000} width={460} height={60} fill="#5a5048" />
    <rect x={60} y={1060} width={460} height={240} fill="#3a342e" />
    <Character who="mark" hair="lev" x={330} y={1300} size={1.3} facing={1} frame={f} override={{...SUIT, top: '#c86a2a', topShade: '#a85a22', bottom: '#c86a2a'}}
      pose={{sit: 1, lean: 20, headTilt: 12, armF: [70, -80], blink: 1, brow: 0.6, lookUp: -0.4, rim: 0.8, rimColor: '#fff2c8'}} />
    {/* решётка камеры спереди */}
    {Array.from({length: 9}).map((_, i) => <rect key={i} x={-20 + i * 140} y={0} width={22} height={1400} fill="#1d2127" />)}
    <rect x={-200} y={600} width={1500} height={22} fill="#1d2127" />
  </g>
);

export const PxCaption: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', left: 50, right: 50, top: 1290, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 76, color: C.white, textTransform: 'uppercase', textShadow: '6px 6px 0 #000'}}>{text}</div>
);
