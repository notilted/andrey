import React from 'react';
import {C} from '../theme';
import {rand} from '../util';

/** Ночное небо: градиент, мерцающие звёзды, луна. */
export const Sky: React.FC<{f: number; w?: number; h?: number; moon?: [number, number]}> = ({f, w = 1080, h = 1300, moon = [860, 230]}) => (
  <g>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.sky0} />
        <stop offset="0.65" stopColor={C.sky1} />
        <stop offset="1" stopColor={C.sky2} />
      </linearGradient>
      <radialGradient id="moonGlow">
        <stop offset="0" stopColor={C.moon} stopOpacity={0.22} />
        <stop offset="1" stopColor={C.moon} stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={-2000} y={-1000} width={w + 4000} height={h + 1000} fill="url(#sky)" />
    {Array.from({length: 150}).map((_, i) => {
      const x = rand(i) * (w + 1400) - 700;
      const y = rand(i + 500) * h * 0.85 - 200;
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / (18 + rand(i + 9) * 30) + i));
      return <circle key={i} cx={x} cy={y} r={0.8 + rand(i + 77) * 1.6} fill="#cfd6e6" opacity={0.25 + 0.5 * tw * rand(i + 3)} />;
    })}
    <circle cx={moon[0]} cy={moon[1]} r={150} fill="url(#moonGlow)" />
    <circle cx={moon[0]} cy={moon[1]} r={46} fill={C.moon} />
    <circle cx={moon[0] - 14} cy={moon[1] - 10} r={9} fill="#9d988a" />
    <circle cx={moon[0] + 16} cy={moon[1] + 8} r={6} fill="#a29d90" />
    <circle cx={moon[0] - 4} cy={moon[1] + 20} r={5} fill="#a29d90" />
  </g>
);

/** Дальний силуэт Москвы: Останкинская башня, сталинская высотка, коробки. */
export const FarSkyline: React.FC<{f: number; base: number}> = ({f, base}) => {
  const blocks = Array.from({length: 34}).map((_, i) => {
    const x = -700 + i * 75 + rand(i + 40) * 30;
    const hgt = 90 + rand(i + 41) * 170;
    return {x, w: 50 + rand(i + 42) * 60, h: hgt, i};
  });
  const blinkOn = Math.floor(f / 20) % 2 === 0;
  return (
    <g>
      {blocks.map((b) => (
        <g key={b.i}>
          <rect x={b.x} y={base - b.h} width={b.w} height={b.h} fill={C.far} />
          {Array.from({length: 6}).map((_, k) =>
            rand(b.i * 13 + k) > 0.72 ? (
              <rect key={k} x={b.x + 8 + (k % 3) * 14} y={base - b.h + 14 + Math.floor(k / 3) * 22 + rand(k + b.i) * 40} width={6} height={7} fill={C.warm} opacity={0.45} />
            ) : null,
          )}
        </g>
      ))}
      {/* сталинская высотка */}
      <g fill={C.far}>
        <rect x={-260} y={base - 300} width={160} height={300} />
        <rect x={-230} y={base - 380} width={100} height={80} />
        <rect x={-205} y={base - 450} width={50} height={70} />
        <polygon points={`${-190},${base - 450} ${-180},${base - 560} ${-170},${base - 450}`} />
        <circle cx={-180} cy={base - 565} r={6} />
      </g>
      {/* Останкинская башня */}
      <g fill={C.far}>
        <polygon points={`1270,${base} 1330,${base} 1306,${base - 260} 1294,${base - 260}`} />
        <rect x={1293} y={base - 520} width={14} height={262} />
        <rect x={1284} y={base - 400} width={32} height={22} rx={4} />
        <rect x={1297} y={base - 640} width={6} height={122} />
        <circle cx={1300} cy={base - 642} r={4} fill={C.red} opacity={blinkOn ? 1 : 0.25} />
        <circle cx={1300} cy={base - 420} r={3} fill={C.red} opacity={blinkOn ? 0.25 : 0.9} />
      </g>
    </g>
  );
};

/** Средний план: высотки с сеткой окон. */
export const MidTowers: React.FC<{f: number; base: number}> = ({f, base}) => {
  const towers = [
    {x: -520, w: 300, h: 760},
    {x: -160, w: 250, h: 560},
    {x: 950, w: 280, h: 820},
    {x: 1290, w: 300, h: 600},
  ];
  return (
    <g>
      {towers.map((t, ti) => (
        <g key={ti}>
          <rect x={t.x} y={base - t.h} width={t.w} height={t.h} fill={C.mid} />
          <rect x={t.x} y={base - t.h} width={10} height={t.h} fill={C.midHi} />
          {Array.from({length: Math.floor(t.h / 46) - 1}).map((_, r) =>
            Array.from({length: Math.floor(t.w / 46)}).map((__, c) => {
              const s = rand(ti * 1000 + r * 31 + c);
              const lit = s > 0.82;
              const flick = lit && s > 0.97 ? 0.6 + 0.4 * Math.sin(f / 3 + r) : 1;
              return (
                <rect key={`${r}-${c}`} x={t.x + 18 + c * 46} y={base - t.h + 22 + r * 46} width={24} height={26}
                  fill={lit ? (s > 0.95 ? C.tv : C.warm) : C.winDark} opacity={lit ? 0.75 * flick : 1} />
              );
            }),
          )}
          <rect x={t.x + t.w / 2 - 2} y={base - t.h - 40} width={4} height={40} fill={C.mid} />
          <circle cx={t.x + t.w / 2} cy={base - t.h - 42} r={4} fill={C.red} opacity={Math.floor(f / 24 + ti) % 2 ? 0.9 : 0.2} />
        </g>
      ))}
    </g>
  );
};

/** Ночная улица: тротуар, дорога, фонари, машины со светом фар. */
export const Street: React.FC<{f: number; y: number; w?: number}> = ({f, y, w = 1080}) => {
  const cars = [
    {speed: 4.2, off: 0, dir: 1, lane: 0, col: '#2a3140'},
    {speed: 3.1, off: 900, dir: -1, lane: 1, col: '#343041'},
    {speed: 5.0, off: 1600, dir: 1, lane: 0, col: '#26303a'},
  ];
  const span = w + 1800;
  return (
    <g>
      <defs>
        <radialGradient id="lampHalo">
          <stop offset="0" stopColor={C.lamp} stopOpacity={0.35} />
          <stop offset="1" stopColor={C.lamp} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-1500} y={y} width={w + 3000} height={2000} fill={C.ground} />
      <rect x={-1500} y={y} width={w + 3000} height={26} fill="#151a24" />
      <rect x={-1500} y={y + 40} width={w + 3000} height={110} fill="#0d1018" />
      {Array.from({length: 40}).map((_, i) => (
        <rect key={i} x={-1500 + i * 120 - ((f * 0) % 120)} y={y + 93} width={60} height={4} fill="#2a2f3a" />
      ))}
      {/* фонари */}
      {[-300, 160, 620, 1080, 1540].map((lx, i) => (
        <g key={i}>
          <rect x={lx} y={y - 210} width={6} height={212} fill="#1c212b" />
          <path d={`M${lx + 3} ${y - 210} q 0 -14 26 -14`} stroke="#1c212b" strokeWidth={6} fill="none" />
          <ellipse cx={lx + 34} cy={y - 222} rx={12} ry={5} fill={C.lamp} />
          <circle cx={lx + 34} cy={y - 222} r={60} fill="url(#lampHalo)" />
          <ellipse cx={lx + 34} cy={y + 12} rx={80} ry={12} fill="url(#lampHalo)" />
        </g>
      ))}
      {cars.map((c, i) => {
        const px = ((c.off + f * c.speed) % span) - 900;
        const x = c.dir > 0 ? px : w - px;
        const cy = y + 70 + c.lane * 46;
        return (
          <g key={i} transform={`translate(${x} ${cy}) scale(${c.dir} 1)`}>
            <polygon points="58,6 260,-14 260,30 58,18" fill={C.lamp} opacity={0.13} />
            <path d="M-50 18 L-50 2 Q-48 -6 -36 -8 L-22 -24 Q-18 -28 -8 -28 L22 -28 Q30 -28 34 -22 L44 -8 Q56 -6 58 4 L58 18 Z" fill={c.col} />
            <path d="M-18 -10 L-8 -23 L8 -23 L8 -10 Z M14 -10 L14 -23 L24 -23 L34 -10 Z" fill="#11151d" />
            <circle cx={-30} cy={19} r={9} fill="#0b0d12" />
            <circle cx={36} cy={19} r={9} fill="#0b0d12" />
            <rect x={52} y={0} width={7} height={6} rx={2} fill={C.lamp} />
            <rect x={-51} y={0} width={5} height={6} rx={2} fill={C.red} />
          </g>
        );
      })}
    </g>
  );
};
