import React from 'react';
import {FONT, MONO} from '../theme';
import {rand} from '../util';
import {Character} from './Character';
import {BROKER} from './Px';

/** «Ты — Джордан Белфорт»: роскошь, деньги, Уолл-стрит. Мир 1080×1920, пол y=1500. */
export const J = {floor: 1500, gold: '#e8b830', goldHi: '#ffe27a', cash: '#5aa86a', cashHi: '#8ad89a', cashDk: '#2f6a3a', wood: '#5a3020', woodHi: '#7a4428'};

export const usd = (n: number) => `${n < 0 ? '−' : ''}$${Math.abs(Math.round(n)).toLocaleString('en-US').replace(/,/g, ' ')}`;

/** Пачка денег с бандеролью. */
export const Stack: React.FC<{x: number; y: number; s?: number; h?: number}> = ({x, y, s = 1, h = 4}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({length: h}).map((_, i) => (
      <g key={i} transform={`translate(${(i % 2) * 3} ${-i * 16})`}>
        <rect x={-60} y={-16} width={120} height={16} fill={J.cash} />
        <rect x={-60} y={-16} width={120} height={4} fill={J.cashHi} />
        <rect x={-14} y={-16} width={28} height={16} fill="#e8e0c0" />
      </g>
    ))}
  </g>
);

/** Летящие купюры (k — плотность). */
export const MoneyRain: React.FC<{f: number; k?: number; seed?: number}> = ({f, k = 1, seed = 0}) => (
  <g opacity={k}>
    {Array.from({length: 70}).map((_, i) => {
      const p = ((f * (2.5 + rand(i + seed) * 2) + rand(i + seed + 9) * 2200) % 2200) - 200;
      const x = rand(i + seed + 3) * 1200 - 60 + Math.sin(f / 15 + i) * 40;
      return <g key={i} transform={`translate(${x} ${p}) rotate(${(f * 3 + i * 40) % 360})`}><rect x={-34} y={-15} width={68} height={30} fill={J.cash} /><rect x={-10} y={-15} width={20} height={30} fill={J.cashHi} /></g>;
    })}
  </g>
);

/** Ночной Манхэттен в окне. */
export const Skyline: React.FC<{f: number; x?: number; y?: number; w?: number; h?: number}> = ({f, x = 0, y = 0, w = 1080, h = 900}) => (
  <g>
    <defs><linearGradient id="nySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0e1028" /><stop offset="1" stopColor="#4a2a5a" /></linearGradient></defs>
    <rect x={x} y={y} width={w} height={h} fill="url(#nySky)" />
    {Array.from({length: 16}).map((_, i) => {
      const bw = 60 + rand(i) * 70;
      const bh = 200 + rand(i + 4) * (h - 260);
      const bx = x + i * (w / 15) - 20;
      return (
        <g key={i}>
          <rect x={bx} y={y + h - bh} width={bw} height={bh} fill={i % 2 ? '#1a1838' : '#221e44'} />
          {Array.from({length: Math.floor(bh / 30)}).map((__, r) => Array.from({length: 3}).map((___, c) => rand(i * 50 + r * 3 + c) > 0.55 ? <rect key={`${r}-${c}`} x={bx + 8 + c * (bw / 3)} y={y + h - bh + 12 + r * 30} width={8} height={10} fill="#ffd98a" opacity={0.8} /> : null))}
        </g>
      );
    })}
  </g>
);

/** Кабинет-люкс: панели из дерева, окно на Манхэттен, стол с деньгами. */
export const LuxOffice: React.FC<{f: number; mad?: number; stacks?: number}> = ({f, mad = 0, stacks = 1}) => (
  <g>
    <rect x={-300} y={0} width={1700} height={1500} fill={J.wood} />
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={-260 + i * 210} y={60} width={180} height={1380} fill={J.woodHi} opacity={0.35} />)}
    <rect x={120} y={220} width={840} height={620} fill="#1d1410" />
    <g><Skyline f={f} x={140} y={240} w={800} h={580} /></g>
    {[340, 540, 740].map((x) => <rect key={x} x={x - 6} y={240} width={12} height={580} fill="#1d1410" />)}
    <rect x={-300} y={1500} width={1700} height={500} fill="#3a1e18" />
    {Array.from({length: 10}).map((_, i) => <rect key={i} x={-300 + i * 180} y={1500} width={90} height={500} fill="#4a2620" opacity={0.6} />)}
    {/* золотая лампа */}
    <rect x={810} y={1080} width={14} height={120} fill={J.gold} />
    <path d="M760 1080 L874 1080 L850 1020 L784 1020 Z" fill={J.goldHi} />
    <ellipse cx={817} cy={1150} rx={220} ry={160} fill="#ffe27a" opacity={0.12} />
    <Character who="jordan" x={540} y={J.floor} size={1.35} facing={1} frame={f} pose={{armF: mad ? [100, -20] : [60, -60], armB: [40, -60], brow: mad ? 1 : -0.4, smile: mad ? 0 : 0.6, mouth: mad ? 0.3 : 0, blink: 1, look: 0.4, rim: 1, rimColor: J.goldHi}} />
    {/* стол */}
    <rect x={140} y={1200} width={800} height={34} fill={J.woodHi} />
    <rect x={160} y={1234} width={760} height={266} fill={J.wood} />
    <rect x={200} y={1270} width={680} height={14} fill={J.gold} opacity={0.6} />
    {stacks > 0 && [220, 330, 440, 640, 750].map((x, i) => <Stack key={i} x={x} y={1200} s={0.8} h={3 + (i % 3)} />)}
  </g>
);

/** Детство: Квинс, кирпичные домики. */
export const Queens: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={1900} fill="#8ab0d8" />
    {Array.from({length: 6}).map((_, i) => (
      <g key={i}>
        <rect x={-200 + i * 260} y={900} width={240} height={600} fill={['#9a4a3a', '#8a3a2e', '#a85a44'][i % 3]} />
        <polygon points={`${-210 + i * 260},900 ${-80 + i * 260},780 ${50 + i * 260},900`} fill="#3a2a2a" />
        <rect x={-160 + i * 260} y={1000} width={60} height={70} fill="#ffe9b0" />
        <rect x={-60 + i * 260} y={1000} width={60} height={70} fill="#ffe9b0" />
        <rect x={-110 + i * 260} y={1340} width={60} height={160} fill="#3a2a24" />
      </g>
    ))}
    <rect x={-300} y={1500} width={1700} height={500} fill="#5a5f68" />
  </g>
);

/** Пляж с сумкой-холодильником. */
export const Beach2: React.FC<{f: number; buyers?: number}> = ({f, buyers = 1}) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={1300} fill="#6ab0e8" />
    <circle cx={860} cy={300} r={110} fill="#ffe27a" />
    <rect x={-300} y={1000} width={1700} height={260} fill="#2a7ab0" />
    {Array.from({length: 14}).map((_, i) => <rect key={i} x={((i * 160 + f * 1.5) % 1700) - 300} y={1020 + (i % 4) * 56} width={90} height={10} fill="#8ad0f0" />)}
    <rect x={-300} y={1260} width={1700} height={800} fill="#e8c890" />
    <path d="M760 1500 L780 1160" stroke="#5a4a3a" strokeWidth={10} /><path d="M640 1180 Q780 1080 920 1180 Z" fill="#c8302a" />
    <Character who="jordan" x={420} y={J.floor} size={1.1} facing={1} frame={f} override={{top: '#e8e4da', topShade: '#c8c4b8', bottom: '#4a6a9a', scale: 0.86}} pose={{armF: [80, -40], smile: 0.8, blink: 1, look: 0.4}} />
    <rect x={460} y={1410} width={140} height={90} rx={10} fill="#4a8ad0" /><rect x={460} y={1410} width={140} height={26} rx={8} fill="#f2f2ee" />
    {buyers > 0 && [700, 800, 900].map((x, i) => (
      <Character key={i} who={(['sonya', 'misha', 'alisa'] as const)[i]} x={x} y={J.floor + 10} size={1.0} facing={-1} frame={f + i * 7} pose={{armF: [70, -30], smile: 0.6, blink: 1}} />
    ))}
  </g>
);

/** Лекционный зал стоматологов. */
export const DentalHall: React.FC<{f: number; leave?: number}> = ({f, leave = 0}) => (
  <g>
    <rect x={-300} y={0} width={1700} height={1600} fill="#d8cdb6" />
    <rect x={100} y={250} width={880} height={420} fill="#2a4a3a" />
    <text x={540} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#e8e4da">СТОМАТОЛОГИЯ</text>
    <text x={540} y={540} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#e8e4da">«Золотой век закончился»</text>
    <rect x={380} y={1120} width={320} height={380} fill={J.wood} />
    <Character who="evgeny" x={540} y={J.floor - 280} size={1.1} facing={-1} frame={f} override={{top: '#3a3a44', topShade: '#2a2a33'}} pose={{armF: [100, -30], brow: 0.3, mouth: 0.3 + 0.2 * Math.sin(f / 3), blink: 1}} />
    <rect x={380} y={1120} width={320} height={40} fill={J.woodHi} />
    <rect x={900} y={900} width={180} height={600} fill="#5a4a3a" />
    <Character who="jordan" x={260 + leave * 700} y={J.floor + 20} size={1.15} facing={1} frame={f} override={{top: '#4a6a9a', topShade: '#3a5a8a', scale: 0.92}} pose={{step: leave > 0 && leave < 1 ? f / 3 : 0, blink: 1, brow: 0.6, look: 0.4}} />
    {Array.from({length: 6}).map((_, i) => <Character key={i} who="mark" hair={(['lev', 'alisa', 'mark'] as const)[i % 3]} x={-100 + i * 120} y={J.floor + 120} size={1.0} facing={1} frame={f + i * 5} override={BROKER(i + 3)} pose={{sit: 1, blink: 1, lookUp: 0.3}} />)}
  </g>
);

/** Фургон «мясо и морепродукты» + штамп «БАНКРОТ». */
export const MeatVan: React.FC<{f: number; stamp?: number}> = ({f, stamp = 0}) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={1800} fill="#8aa0b8" />
    <rect x={-300} y={1500} width={1700} height={500} fill="#4a4f58" />
    <rect x={120} y={1000} width={760} height={420} rx={20} fill="#f2f2ee" />
    <rect x={780} y={1100} width={200} height={320} rx={16} fill="#e8e4da" />
    <rect x={810} y={1130} width={140} height={110} fill="#4a6a8a" />
    <text x={450} y={1170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#c8302a">МЯСО</text>
    <text x={450} y={1240} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#2a4a8a">и морепродукты</text>
    {[260, 820].map((x) => <circle key={x} cx={x} cy={1440} r={70} fill="#1d2129" />)}
    {stamp > 0 && (
      <g transform={`translate(540 900) rotate(-12) scale(${1 + (1 - stamp) * 1.5})`} opacity={stamp}>
        <rect x={-330} y={-90} width={660} height={180} fill="none" stroke="#c8302a" strokeWidth={22} />
        <text x={0} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#c8302a">БАНКРОТ</text>
      </g>
    )}
  </g>
);

/** Уолл-стрит: колонны, флаг, толпа в костюмах. */
export const WallSt: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={1800} fill="#a8b4c4" />
    <rect x={40} y={500} width={1000} height={1000} fill="#d8d0c0" />
    <polygon points="0,500 540,300 1080,500" fill="#c8c0b0" />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={90 + i * 170} y={560} width={70} height={900} fill="#e8e2d4" />)}
    <rect x={20} y={1460} width={1040} height={40} fill="#b8b0a0" />
    <rect x={520} y={160} width={8} height={160} fill="#5a5f68" />
    <rect x={528} y={170} width={140} height={84} fill="#c8302a" />{Array.from({length: 3}).map((_, i) => <rect key={i} x={528} y={184 + i * 24} width={140} height={10} fill="#f2f2ee" />)}<rect x={528} y={170} width={60} height={44} fill="#2a3a6a" />
    <text x={540} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#5a5048">WALL ST · 1987</text>
    <rect x={-300} y={1500} width={1700} height={500} fill="#6a6f78" />
    {Array.from({length: 9}).map((_, i) => <Character key={i} who="mark" hair="lev" x={-60 + i * 140 + ((f * (i % 2 ? 2 : -2)) % 140)} y={J.floor + 40} size={0.95} facing={i % 2 ? 1 : -1} frame={f + i * 7} override={{...BROKER(i), top: '#2a3040', topShade: '#1d2230'}} pose={{step: f / 3 + i, blink: 1}} />)}
  </g>
);

/** Табло котировок: зелёное (k=0) → красное с −22% (k=1). */
export const Board: React.FC<{f: number; red: number; title?: string}> = ({f, red, title}) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={2400} fill="#0a0c10" />
    {Array.from({length: 12}).map((_, r) => (
      <text key={r} x={40 - ((f * 4 + r * 90) % 300)} y={200 + r * 90} fontFamily={MONO} fontWeight={800} fontSize={56} fill={red > 0.5 ? (r % 3 ? '#ff5a4a' : '#ff9a4a') : r % 2 ? '#5ad08a' : '#ffd24a'}>
        {red > 0.5 ? 'DOW −508 ▼ IBM −31 ▼ GE −25 ▼ XON −22 ▼ DOW −508 ▼' : 'DOW +12 ▲ IBM +2 ▲ GE +1 ▲ XON +3 ▲ DOW +12 ▲ IBM +2 ▲'}
      </text>
    ))}
    {title && <text x={540} y={1420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={red > 0.5 ? '#ff4a3a' : '#5ad08a'}>{title}</text>}
  </g>
);

/** График «накачки»: цена взлетает, потом рушится. */
export const PumpChart: React.FC<{f: number; t: number}> = ({t}) => {
  const pts = Array.from({length: 60}).map((_, i) => {
    const x = 80 + i * 15.5;
    const k = i / 59;
    const v = k < 0.7 ? 0.05 + Math.pow(k / 0.7, 3) * 0.9 : 0.95 - (k - 0.7) / 0.3 * 0.9;
    return [x, 1300 - v * 900];
  });
  const shown = Math.max(2, Math.floor(t * 60));
  return (
    <g>
      <rect x={-300} y={-300} width={1700} height={2400} fill="#0e1118" />
      {Array.from({length: 8}).map((_, i) => <rect key={i} x={60} y={400 + i * 130} width={960} height={3} fill="#1e2433" />)}
      <path d={pts.slice(0, shown).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} stroke={shown > 42 ? '#ff5a4a' : '#5ad08a'} strokeWidth={14} fill="none" strokeLinejoin="round" />
      <text x={90} y={340} fontFamily={MONO} fontWeight={800} fontSize={54} fill="#e8e4da">ACME ИНК · $0.10 → $8.00</text>
    </g>
  );
};

/** Гараж автосалона с раскладными столами и телефонами. */
export const Garage: React.FC<{f: number; sign?: string}> = ({f, sign = 'STRATTON OAKMONT'}) => (
  <g>
    <rect x={-300} y={0} width={1700} height={1500} fill="#7a7f88" />
    {Array.from({length: 5}).map((_, i) => <rect key={i} x={-200 + i * 330} y={180} width={300} height={8} fill="#5a5f68" />)}
    <rect x={160} y={300} width={760} height={150} fill="#1f2a44" />
    <text x={540} y={400} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={66} fill={J.goldHi}>{sign}</text>
    <rect x={-300} y={1500} width={1700} height={500} fill="#5a5f68" />
    {[200, 540, 880].map((x, i) => (
      <g key={i}>
        <Character who={i === 1 ? 'jordan' : 'mark'} hair={i === 1 ? undefined : 'lev'} x={x} y={J.floor} size={1.0} facing={1} frame={f + i * 9} override={i === 1 ? undefined : BROKER(i)} pose={{armF: [150, -150], blink: 1, mouth: 0.3 + 0.3 * Math.sin(f / 3 + i), brow: 0.4}} />
        <rect x={x - 100} y={1330} width={220} height={16} fill="#c9c3b2" />
        <rect x={x - 90} y={1346} width={8} height={154} fill="#5a5f68" /><rect x={x + 100} y={1346} width={8} height={154} fill="#5a5f68" />
        <rect x={x + 30} y={1300} width={60} height={30} fill="#1d2129" />
      </g>
    ))}
  </g>
);

/** Белый Lamborghini (клин 80-х). */
export const Lambo: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={330} ry={20} fill="#000" opacity={0.35} />
    <path d="M-320 -20 L-300 -90 L-80 -150 L120 -150 L300 -80 L330 -30 L320 0 L-320 0 Z" fill="#f2f2ee" />
    <path d="M-60 -140 L100 -140 L210 -90 L-110 -90 Z" fill="#2a3a4a" />
    <path d="M-320 -30 L330 -30" stroke="#c9c3b8" strokeWidth={8} />
    {[-200, 200].map((cx) => <g key={cx}><circle cx={cx} cy={-6} r={56} fill="#14171d" /><circle cx={cx} cy={-6} r={26} fill="#9aa3ad" /></g>)}
    <rect x={290} y={-70} width={30} height={14} fill="#ffe27a" />
  </g>
);

/** Особняк с колоннами и бассейном. */
export const Mansion: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={1600} fill="#f0a868" />
    <circle cx={540} cy={520} r={160} fill="#ffe27a" opacity={0.8} />
    <rect x={60} y={760} width={960} height={600} fill="#f2ead8" />
    <polygon points="20,760 540,560 1060,760" fill="#c8b898" />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={110 + i * 160} y={800} width={56} height={560} fill="#fffaf0" />)}
    {Array.from({length: 5}).map((_, i) => <rect key={i} x={190 + i * 160} y={880} width={70} height={110} fill="#ffd98a" />)}
    <rect x={-300} y={1360} width={1700} height={700} fill="#3a7a3a" />
    <rect x={160} y={1420} width={760} height={220} rx={20} fill="#4ac0e8" />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={200 + i * 120 + Math.sin(f / 8 + i) * 10} y={1470 + (i % 2) * 60} width={60} height={8} fill="#c8f0ff" />)}
  </g>
);

/** Вертолёт. */
export const Heli: React.FC<{x: number; y: number; f: number; s?: number}> = ({x, y, f, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260 + Math.sin(f) * 40} y={-150} width={520} height={10} fill="#2a2e35" opacity={0.8} />
    <rect x={-6} y={-150} width={12} height={40} fill="#2a2e35" />
    <path d="M-160 -110 Q-200 -20 -120 10 L80 10 Q140 -40 100 -110 Z" fill="#1f2a44" />
    <path d="M-150 -96 Q-170 -40 -120 -20 L-60 -20 L-60 -96 Z" fill="#8ac8f0" />
    <path d="M100 -70 L320 -60 L330 -90 L300 -90 L280 -75 L110 -95 Z" fill="#1f2a44" />
    <rect x={-150} y={30} width={240} height={10} fill="#2a2e35" />
  </g>
);

/** Вечеринка: стробоскопы, конфетти, башня из бокалов. */
export const Party: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={-300} y={0} width={1700} height={1500} fill="#1a0e2a" />
    {[0, 1, 2, 3].map((i) => <polygon key={i} points={`${200 + i * 230},0 ${120 + i * 230 + Math.sin(f / 10 + i) * 200},1500 ${300 + i * 230 + Math.sin(f / 10 + i) * 200},1500`} fill={['#ff4aa8', '#4ac8ff', '#ffe27a', '#8a4aff'][i]} opacity={0.18} />)}
    <rect x={-300} y={1500} width={1700} height={500} fill="#2a1a3a" />
    {Array.from({length: 7}).map((_, i) => (
      <Character key={i} who={i === 3 ? 'jordan' : 'mark'} hair={i === 3 ? undefined : (['lev', 'alisa', 'mark'] as const)[i % 3]} x={-40 + i * 190} y={J.floor + (i % 2) * 30} size={1.0 + (i === 3 ? 0.2 : 0)} facing={i < 3 ? 1 : -1} frame={f + i * 5}
        override={i === 3 ? undefined : BROKER(i)} pose={{armF: [160 + Math.sin(f / 4 + i) * 20, -20], armB: [-160, 20], smile: 0.9, mouth: 0.4, blink: 1, rim: 1, rimColor: ['#ff4aa8', '#4ac8ff'][i % 2]}} />
    ))}
    {/* башня из бокалов */}
    {[0, 1, 2, 3].map((r) => Array.from({length: 4 - r}).map((_, c) => (
      <g key={`${r}-${c}`} transform={`translate(${430 + c * 60 + r * 30} ${1330 - r * 70})`}>
        <path d="M-22 -60 L22 -60 L8 -20 L-8 -20 Z" fill={J.goldHi} opacity={0.85} /><rect x={-3} y={-20} width={6} height={20} fill="#e8e4da" />
      </g>
    )))}
    {Array.from({length: 90}).map((_, i) => <rect key={i} x={rand(i) * 1100} y={((f * (3 + rand(i + 2) * 3) + rand(i + 5) * 1600) % 1600)} width={12} height={20} fill={['#ff4aa8', '#4ac8ff', '#ffe27a', '#5ad08a'][i % 4]} transform={`rotate(${f * 5 + i * 30} ${rand(i) * 1100} ${(f * 3 + rand(i + 5) * 1600) % 1600})`} />)}
  </g>
);

/** ФБР: агенты в куртках, папка. */
export const Fbi: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={-300} y={0} width={1700} height={1500} fill="#2a3040" />
    <rect x={200} y={300} width={680} height={420} fill="#1a1e28" />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={240 + (i % 3) * 210} y={340 + Math.floor(i / 3) * 190} width={180} height={160} fill="#e8e4da" opacity={0.85} />)}
    <rect x={-300} y={1500} width={1700} height={500} fill="#1d2129" />
    {[260, 540, 820].map((x, i) => (
      <g key={i}>
        <Character who="mark" hair={(['mark', 'lev', 'galina'] as const)[i]} x={x} y={J.floor} size={1.15} facing={i === 2 ? -1 : 1} frame={f + i * 9} override={{top: '#1d2a44', topShade: '#141d33', bottom: '#2a2e38', hair: '#2a1a14'}} pose={{armF: [40, -60], brow: -0.4, blink: 1}} />
        <text x={x} y={J.floor - 230} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={J.goldHi}>FBI</text>
      </g>
    ))}
  </g>
);

/** Сцена семинара: прожектор, экран, зал. */
export const Stage: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={-300} y={0} width={1700} height={2000} fill="#0e0a18" />
    <rect x={140} y={380} width={800} height={440} fill="#1f2a44" />
    <text x={540} y={590} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={72} fill={J.goldHi}>STRAIGHT LINE</text>
    <text x={540} y={680} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill="#e8e4da">SELLING SYSTEM</text>
    <polygon points="540,0 340,1400 740,1400" fill="#fff6d8" opacity={0.18} />
    <rect x={-300} y={1400} width={1700} height={120} fill="#3a2a4a" />
    <Character who="jordan" x={540} y={1400} size={1.2} facing={1} frame={f} override={{scale: 1.02}} pose={{armF: [120, -40], smile: 0.6, mouth: 0.3 + 0.3 * Math.sin(f / 3), blink: 1, look: 0.3, rim: 1, rimColor: '#fff6d8'}} />
    {Array.from({length: 24}).map((_, i) => <circle key={i} cx={-100 + (i % 12) * 110} cy={1640 + Math.floor(i / 12) * 140} r={50} fill="#0a0812" />)}
  </g>
);

/** Ручка крупно. */
export const Pen: React.FC<{f: number; t: number}> = ({t}) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={2400} fill="#0a0812" />
    
    <g transform={`translate(540 900) rotate(${-30 + t * 0.05}) scale(${2.2 + t / 500})`}>
      <rect x={-260} y={-18} width={440} height={36} rx={18} fill="#1d2129" />
      <rect x={-160} y={-18} width={40} height={36} fill={J.gold} />
      <path d="M180 -18 L260 0 L180 18 Z" fill={J.goldHi} />
      <rect x={-240} y={-30} width={160} height={8} fill="#9aa3ad" />
    </g>
  </g>
);

/** Пострадавшие: ряды силуэтов. */
export const Victims: React.FC<{f: number; t: number}> = ({f, t}) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={2400} fill="#0e0f14" />
    {Array.from({length: 7}).map((_, r) => Array.from({length: 9}).map((__, c) => {
      const i = r * 9 + c;
      return (
        <g key={i} opacity={Math.min(1, Math.max(0, t / 4 - i * 0.03))}>
          <Character who="mark" hair={(['mark', 'galina', 'alisa', 'lev', 'evgeny'] as const)[i % 5]} x={40 + c * 125 + (r % 2) * 60} y={700 + r * 150} size={0.5 + r * 0.04} facing={1} frame={f + i * 3}
            override={{top: '#3a3e48', topShade: '#30343c', bottom: '#2a2e36', skin: '#7a7470', skinShade: '#6a6460', hair: '#2a2a2e'}} pose={{blink: 1, brow: 0.8, rim: 0}} />
        </g>
      );
    }))}
  </g>
);

