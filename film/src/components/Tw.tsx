import React from 'react';
import {interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {easeOut, ramp, rand} from '../util';
import {fmt} from './Overlay';

/** Палитра «Трёх волн»: к ночному синему добавлен огонь. */
export const T = {
  fire: '#ff7a2e',
  fireHot: '#ffc04a',
  ember: '#c2461f',
  smoke: '#2a2526',
  ash: '#3a3333',
  skyOr0: '#2a1410',
  skyOr1: '#6a2a16',
  skyOr2: '#c2521f',
};

/** Чч:мм:сс — для таймеров волн. */
export const fmtH = (sec: number) => {
  const s = Math.max(0, Math.ceil(sec));
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
};

/** Оранжевое небо поверх ночного (k 0..1 — насколько разгорелось). */
export const OrangeSky: React.FC<{k: number; w?: number; h?: number}> = ({k, w = 1080, h = 1400}) => (
  <g opacity={k}>
    <defs>
      <linearGradient id="orSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={T.skyOr0} />
        <stop offset="0.6" stopColor={T.skyOr1} />
        <stop offset="1" stopColor={T.skyOr2} />
      </linearGradient>
    </defs>
    <rect x={-2000} y={-1000} width={w + 4000} height={h + 1000} fill="url(#orSky)" />
  </g>
);

/** Метеорит: раскалённая голова и хвост; летит из (x0,y0) в (x1,y1), p 0..1. */
export const Meteor: React.FC<{x0: number; y0: number; x1: number; y1: number; p: number; size?: number}> = ({x0, y0, x1, y1, p, size = 1}) => {
  if (p <= 0 || p >= 1.05) return null;
  const x = x0 + (x1 - x0) * p;
  const y = y0 + (y1 - y0) * p;
  const ang = Math.atan2(y1 - y0, x1 - x0);
  const tail = 520 * size * Math.min(1, p * 3);
  const tx = x - Math.cos(ang) * tail;
  const ty = y - Math.sin(ang) * tail;
  const nx = -Math.sin(ang);
  const ny = Math.cos(ang);
  const r = 22 * size;
  return (
    <g>
      <defs>
        <linearGradient id="metTail" x1={tx} y1={ty} x2={x} y2={y} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={T.fire} stopOpacity={0} />
          <stop offset="0.7" stopColor={T.fire} stopOpacity={0.6} />
          <stop offset="1" stopColor={T.fireHot} stopOpacity={1} />
        </linearGradient>
        <radialGradient id="metGlow">
          <stop offset="0" stopColor="#fff3d0" stopOpacity={0.9} />
          <stop offset="0.3" stopColor={T.fireHot} stopOpacity={0.5} />
          <stop offset="1" stopColor={T.fire} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 9} fill="url(#metGlow)" opacity={0.6} />
      <polygon points={`${tx},${ty} ${x + nx * r},${y + ny * r} ${x - nx * r},${y - ny * r}`} fill="url(#metTail)" />
      <circle cx={x} cy={y} r={r} fill="#fff6dc" />
    </g>
  );
};

/** Дым: столб поднимающихся клубов. */
export const Smoke: React.FC<{x: number; y: number; f: number; scale?: number; seed?: number; color?: string; opacity?: number}> = ({x, y, f, scale = 1, seed = 0, color = T.smoke, opacity = 0.85}) => (
  <g opacity={opacity}>
    {Array.from({length: 12}).map((_, i) => {
      const p = ((f / 140 + i / 12 + rand(seed + i) * 0.1) % 1);
      const cx = x + Math.sin(p * 4 + i + seed) * 40 * scale + p * 160 * scale;
      const cy = y - p * 700 * scale;
      return <circle key={i} cx={cx} cy={cy} r={(40 + p * 140) * scale} fill={color} opacity={(1 - p) * 0.8} />;
    })}
  </g>
);

/** Языки огня (k — сила). */
export const Fire: React.FC<{x: number; y: number; f: number; w?: number; k?: number; seed?: number}> = ({x, y, f, w = 80, k = 1, seed = 0}) => (
  <g opacity={k}>
    <ellipse cx={x} cy={y - 10} rx={w * 1.6} ry={w * 0.9} fill={T.fire} opacity={0.18} />
    {Array.from({length: 5}).map((_, i) => {
      const h = w * (0.9 + 0.5 * Math.abs(Math.sin(f / 4 + i * 1.7 + seed)));
      const fx = x - w / 2 + (i * w) / 4;
      return <path key={i} d={`M${fx - w * 0.18} ${y} Q${fx} ${y - h} ${fx + w * 0.18} ${y} Z`} fill={i % 2 ? T.fireHot : T.fire} />;
    })}
  </g>
);

/** Кот Барсик: сидит (jump 0) или в прыжке по дуге (jump 0..1 на участке). */
export const Cat: React.FC<{x: number; y: number; f: number; s?: number; facing?: 1 | -1; run?: boolean}> = ({x, y, f, s = 1, facing = 1, run = false}) => {
  const tail = Math.sin(f / 9) * 10;
  const leg = run ? Math.sin(f / 2) * 8 : 0;
  const col = '#3b3c42';
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      <ellipse cx={0} cy={0} rx={34} ry={5} fill="#000" opacity={0.3} />
      <path d={`M-30 -26 Q${-56} ${-40 + tail} ${-48} ${-78 + tail}`} stroke={col} strokeWidth={8} strokeLinecap="round" fill="none" />
      <ellipse cx={-6} cy={-26} rx={30} ry={20} fill={col} />
      <rect x={-26 + leg} y={-14} width={9} height={14} rx={4} fill={col} />
      <rect x={10 - leg} y={-14} width={9} height={14} rx={4} fill={col} />
      <circle cx={24} cy={-46} r={17} fill={col} />
      <path d="M12 -58 L14 -76 L24 -62 Z M28 -62 L38 -76 L38 -56 Z" fill={col} />
      <ellipse cx={22} cy={-48} rx={3.2} ry={4} fill={C.warm} />
      <ellipse cx={33} cy={-48} rx={3.2} ry={4} fill={C.warm} />
      <path d="M8 -38 L-4 -40 M8 -36 L-4 -34 M38 -38 L50 -40 M38 -36 L50 -34" stroke="#8a8c92" strokeWidth={1.2} />
    </g>
  );
};

/** Одеяло, накинутое на ребёнка (рисуется поверх персонажа ростом ~0.64). */
export const Blanket: React.FC<{x: number; y: number; s?: number; facing?: 1 | -1}> = ({x, y, s = 1, facing = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
    <path d="M-26 -190 Q0 -200 28 -188 L36 -58 Q0 -48 -36 -58 Z" fill="#c9a87a" />
    <path d="M-26 -190 Q-10 -197 2 -195 L-6 -52 Q-22 -54 -36 -58 Z" fill="#a8885e" />
    {[-140, -104].map((yy) => <path key={yy} d={`M-32 ${yy} Q0 ${yy + 6} 34 ${yy}`} stroke="#b5946a" strokeWidth={3} fill="none" />)}
  </g>
);

/** Слеза, стекающая по щеке (t — фаза 0..1). */
export const Tear: React.FC<{x: number; y: number; t: number; s?: number}> = ({x, y, t, s = 1}) => (
  <path d={`M${x} ${y + t * 30 * s} q${-4 * s} ${7 * s} 0 ${10 * s} q${4 * s} ${-3 * s} 0 ${-10 * s} Z`} fill="#bfe0ff" opacity={0.9 * (1 - t)} />
);

/** Подвал: кирпич, трубы под потолком, маленькое окно у потолка (источник вспышки). */
export const CEL = {left: -80, right: 1160, ceil: 520, floor: 1130, win: {x: 860, y: 560, w: 190, h: 90}};

export const CellarBack: React.FC<{f: number; bulb: number; outside: number; crack: number}> = ({f, bulb, outside, crack}) => {
  const {left, right, ceil, floor, win} = CEL;
  return (
    <g>
      <defs>
        <pattern id="brick" width="96" height="44" patternUnits="userSpaceOnUse">
          <rect width="96" height="44" fill="#262a31" />
          <rect x="2" y="2" width="44" height="18" fill="#2d3139" />
          <rect x="50" y="2" width="44" height="18" fill="#2b2f37" />
          <rect x="-22" y="24" width="44" height="18" fill="#2b2f37" />
          <rect x="26" y="24" width="44" height="18" fill="#2e323a" />
          <rect x="74" y="24" width="44" height="18" fill="#2a2e36" />
        </pattern>
        <radialGradient id="bulbPool" cx="0.5" cy="0.1" r="0.8">
          <stop offset="0" stopColor={C.lamp} stopOpacity={0.35} />
          <stop offset="1" stopColor={C.lamp} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="winBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={T.fire} stopOpacity={0.35} />
          <stop offset="1" stopColor={T.fire} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={-600} y={-600} width={2400} height={3600} fill={C.facade} />
      <rect x={left} y={ceil} width={right - left} height={floor - ceil} fill="url(#brick)" />
      {/* окно у потолка: ночь → оранжевое небо → вспышка */}
      <rect x={win.x} y={win.y} width={win.w} height={win.h} fill="#0d121b" />
      <rect x={win.x} y={win.y} width={win.w} height={win.h} fill={T.fire} opacity={outside} />
      <rect x={win.x + win.w / 2 - 3} y={win.y} width={6} height={win.h} fill="#15181e" />
      <rect x={win.x - 8} y={win.y - 8} width={win.w + 16} height={win.h + 16} fill="none" stroke="#1a1e26" strokeWidth={12} />
      <polygon points={`${win.x},${win.y + win.h} ${win.x + win.w},${win.y + win.h} ${win.x + win.w - 200},${floor} ${win.x - 380},${floor}`} fill="url(#winBeam)" opacity={outside} />
      {/* трубы */}
      <rect x={left} y={ceil + 26} width={right - left} height={22} fill="#3a3f48" />
      <rect x={left} y={ceil + 60} width={right - left} height={14} fill="#33373f" />
      {Array.from({length: 8}).map((_, i) => <rect key={i} x={left + 60 + i * 160} y={ceil + 20} width={10} height={60} fill="#2a2e35" />)}
      <rect x={120} y={ceil + 74} width={16} height={floor - ceil - 74} fill="#353a43" />
      <circle cx={128} cy={760} r={22} fill="#7a3a34" />
      {/* стеллаж с банками */}
      <g transform="translate(560 860)">
        <rect x={0} y={0} width={220} height={8} fill={C.woodHi} />
        <rect x={0} y={110} width={220} height={8} fill={C.woodHi} />
        <rect x={0} y={0} width={8} height={270} fill={C.wood} />
        <rect x={212} y={0} width={8} height={270} fill={C.wood} />
        {Array.from({length: 6}).map((_, i) => (
          <rect key={i} x={14 + i * 34} y={-46} width={26} height={46} rx={6} fill={['#6a4a2a', '#5a2a2a', '#4a5a2a'][i % 3]} opacity={0.9} />
        ))}
        {Array.from({length: 5}).map((_, i) => <rect key={i} x={18 + i * 40} y={64} width={30} height={46} rx={6} fill="#5a3a2a" />)}
      </g>
      {/* трещины после удара */}
      <g stroke="#0b0d11" strokeWidth={5} fill="none" strokeLinecap="round" opacity={crack}>
        <path d="M300 520 L330 600 L310 660 L360 760 L340 840" />
        <path d="M330 600 L400 630" />
        <path d="M720 520 L700 590 L740 650 L720 720" />
        <path d="M1000 700 L960 760 L990 820 L950 900" />
      </g>
      {/* лампочка на проводе — качается после удара */}
      <g transform={`rotate(${crack ? Math.sin(f / 9) * 10 * Math.exp(-0.002 * f) * crack : 0} 520 ${ceil})`}>
        <rect x={518} y={ceil} width={3} height={130} fill="#15181e" />
        <circle cx={520} cy={ceil + 140} r={11} fill={bulb > 0.1 ? C.lamp : '#3a3a34'} />
        <circle cx={520} cy={ceil + 140} r={90} fill={C.lamp} opacity={0.18 * bulb} />
      </g>
      <rect x={left} y={ceil} width={right - left} height={floor - ceil} fill="url(#bulbPool)" opacity={bulb} />
      <rect x={left} y={floor} width={right - left} height={300} fill="#1a1d23" />
      <rect x={left - 40} y={ceil - 40} width={right - left + 80} height={40} fill={C.facadeHi} />
      {/* лестница вниз, слева */}
      <polygon points={`${left},${ceil + 40} ${left + 170},${ceil + 40} ${left + 170},${floor} ${left},${floor}`} fill="#1d2027" />
      {Array.from({length: 8}).map((_, i) => <rect key={i} x={left + 10 + i * 20} y={ceil + 60 + i * 66} width={150 - i * 18} height={10} fill="#343943" />)}
    </g>
  );
};

/** Ящик (на нём сидит Евгений). */
export const Crate: React.FC<{x: number; y: number; w?: number; h?: number}> = ({x, y, w = 120, h = 80}) => (
  <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} fill="#4a3c30" />
    <rect x={x - w / 2} y={y - h} width={w} height={8} fill="#5a4a3a" />
    <path d={`M${x - w / 2 + 6} ${y - 6} L${x + w / 2 - 6} ${y - h + 10}`} stroke="#3a2e25" strokeWidth={8} />
  </g>
);

/** Руины дома: половина панельки обрушена; огонь в окнах на изломе. */
export const RuinedBlock: React.FC<{f: number; x: number; base: number; seed?: number}> = ({f, x, base, seed = 0}) => {
  const cols = 6;
  const rows = 10;
  const cw = 110;
  const rh = 78;
  const W = cols * cw;
  const top = base - rows * rh;
  // излом: правая половина ниже
  const edge = Array.from({length: cols + 1}).map((_, i) => [x + i * cw, top + (i < 2 ? 0 : (i - 1) * rh * 1.6 + rand(seed + i) * 60)] as [number, number]);
  const clip = `M${x} ${base} L${x} ${top} ${edge.map(([a, b]) => `L${a} ${b}`).join(' ')} L${x + W} ${base} Z`;
  const id = `ruin${seed}`;
  return (
    <g>
      <clipPath id={id}><path d={clip} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={x} y={top} width={W} height={rows * rh} fill={C.facade} />
        {Array.from({length: rows}).map((_, r) =>
          Array.from({length: cols}).map((__, c) => {
            const s = rand(seed * 100 + r * 13 + c);
            const nearEdge = edge[c][1] + rh * 1.4 > top + r * rh;
            const burning = nearEdge && s > 0.35;
            return (
              <g key={`${r}-${c}`}>
                <rect x={x + c * cw + 20} y={top + r * rh + 12} width={70} height={50} fill={burning ? T.fire : s > 0.8 ? '#2a2020' : '#141820'} opacity={burning ? 0.7 + 0.3 * Math.sin(f / 3 + s * 9) : 1} />
                {burning && <rect x={x + c * cw + 20} y={top + r * rh + 12} width={70} height={18} fill={T.fireHot} opacity={0.5} />}
              </g>
            );
          }),
        )}
        {Array.from({length: rows + 1}).map((_, r) => <rect key={r} x={x} y={top + r * rh - 1} width={W} height={3} fill={C.seam} />)}
      </g>
      {/* арматура и обломки по излому */}
      <path d={edge.map(([a, b], i) => `${i ? 'L' : 'M'}${a} ${b}`).join(' ')} stroke="#11141a" strokeWidth={10} fill="none" />
      {edge.slice(1).map(([a, b], i) => (
        <path key={i} d={`M${a - 30} ${b + 4} l-6 -26 M${a - 60} ${b + 6} l4 -20`} stroke="#5a5f68" strokeWidth={3} />
      ))}
      <polygon points={`${x + W * 0.35},${base} ${x + W * 0.55},${base - 120} ${x + W * 0.8},${base - 70} ${x + W * 1.15},${base}`} fill="#2a2e36" />
      <polygon points={`${x + W * 0.55},${base} ${x + W * 0.7},${base - 60} ${x + W * 0.95},${base}`} fill="#343841" />
    </g>
  );
};

/** Кратер с раскалёнными краями. */
export const Crater: React.FC<{x: number; y: number; f: number; w?: number}> = ({x, y, f, w = 900}) => {
  const glow = 0.75 + 0.25 * Math.sin(f / 7);
  return (
    <g>
      <ellipse cx={x} cy={y} rx={w * 0.75} ry={w * 0.16} fill={T.fire} opacity={0.15 * glow} />
      <ellipse cx={x} cy={y} rx={w / 2} ry={w * 0.1} fill="#120c0b" />
      <ellipse cx={x} cy={y - 8} rx={w / 2} ry={w * 0.1} fill="none" stroke={T.ember} strokeWidth={14} opacity={glow} />
      <ellipse cx={x} cy={y + 4} rx={w * 0.32} ry={w * 0.05} fill={T.fire} opacity={0.35 * glow} />
      {Array.from({length: 7}).map((_, i) => (
        <Fire key={i} x={x - w * 0.45 + (i * w * 0.9) / 6} y={y - w * 0.07 * Math.sin((i / 6) * Math.PI) - 4} f={f + i * 7} w={36 + rand(i) * 30} seed={i} />
      ))}
    </g>
  );
};

/** Экран оповещения о метеорите. */
export const MeteorAlertScreen: React.FC<{f: number; start: number; remaining: number}> = ({f, start, remaining}) => {
  const local = f - start;
  const pop = easeOut(ramp(local, 0, 12));
  const pulse = 0.5 + 0.5 * Math.sin((local / 30) * 2 * Math.PI * 2.2);
  const op = (a: number) => interpolate(local, [a, a + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, #1a0d10 0%, #2a1311 ${40 + pulse * 10}%, #120a0c 100%)`}}>
      <div style={{position: 'absolute', top: 80, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 96, color: 'rgba(255,255,255,0.22)'}}>03:17</div>
      <div style={{position: 'absolute', left: 26, right: 26, top: 250, transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop, borderRadius: 30, background: C.white, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
        <div style={{background: C.red, padding: '22px 26px', fontFamily: FONT, fontWeight: 900, fontSize: 25, color: C.white, letterSpacing: 1, whiteSpace: 'nowrap'}}>⚠ ЭКСТРЕННОЕ ОПОВЕЩЕНИЕ</div>
        <div style={{padding: '26px 30px 30px', fontFamily: FONT, color: '#14171d'}}>
          <div style={{fontWeight: 900, fontSize: 50, lineHeight: 1.04, opacity: op(8)}}>ПАДЕНИЕ<br />МЕТЕОРИТА</div>
          <div style={{marginTop: 16, fontWeight: 800, fontSize: 24, color: '#4a4f5a', opacity: op(14)}}>РАДИУС ПОРАЖЕНИЯ: <span style={{color: C.red}}>25 КМ</span></div>
          <div style={{marginTop: 14, fontWeight: 700, fontSize: 21, color: '#4a4f5a', opacity: op(18)}}>ДО УДАРА:</div>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 118, color: C.red, letterSpacing: 2, opacity: op(18)}}>{fmt(remaining)}</div>
          <div style={{marginTop: 4, display: 'inline-block', padding: '8px 16px', borderRadius: 14, background: '#14171d', color: C.white, fontWeight: 800, fontSize: 22, letterSpacing: 1, opacity: op(22)}}>СПУСТИТЕСЬ В ПОДВАЛ</div>
        </div>
      </div>
    </div>
  );
};

/** Экран «ВТОРАЯ ВОЛНА». */
export const WaveAlertScreen: React.FC<{f: number; start: number; wave: number; remaining: number; note: string; head?: string; time?: string}> = ({f, start, wave, remaining, note, head = 'ЭТО БЫЛ ОСКОЛОК.', time = '03:24'}) => {
  const local = f - start;
  const pop = easeOut(ramp(local, 0, 12));
  const op = (a: number) => interpolate(local, [a, a + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#160c0c,#0b0809)'}}>
      <div style={{position: 'absolute', top: 80, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 96, color: 'rgba(255,255,255,0.22)'}}>{time}</div>
      <div style={{position: 'absolute', left: 26, right: 26, top: 250, transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop, borderRadius: 30, background: C.white, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
        <div style={{background: C.red, padding: '22px 26px', fontFamily: FONT, fontWeight: 900, fontSize: 25, color: C.white, letterSpacing: 1, whiteSpace: 'nowrap'}}>⚠ ЭКСТРЕННОЕ ОПОВЕЩЕНИЕ</div>
        <div style={{padding: '26px 30px 30px', fontFamily: FONT, color: '#14171d'}}>
          <div style={{fontWeight: 900, fontSize: 30, color: '#4a4f5a', opacity: op(6)}}>{head}</div>
          <div style={{marginTop: 8, fontWeight: 900, fontSize: 56, lineHeight: 1.04, opacity: op(12)}}>ВОЛНА <span style={{color: C.red}}>{wave}</span></div>
          <div style={{marginTop: 14, fontWeight: 700, fontSize: 21, color: '#4a4f5a', opacity: op(18)}}>ДО УДАРА:</div>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 92, color: C.red, letterSpacing: 1, opacity: op(18)}}>{fmtH(remaining)}</div>
          <div style={{marginTop: 8, display: 'inline-block', padding: '8px 16px', borderRadius: 14, background: C.red, color: C.white, fontWeight: 900, fontSize: 24, letterSpacing: 1, opacity: note ? op(34) : 0}}>{note}</div>
        </div>
      </div>
    </div>
  );
};

/** Финальный титр серии «Три волны». */
export const WaveCard: React.FC<{f: number; start: number; wave: number; next: string; remaining: number; remainingText?: string}> = ({f, start, wave, next, remaining, remainingText}) => {
  const local = f - start;
  const a = easeOut(ramp(local, 0, 14));
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: a, transform: `scale(${0.96 + 0.04 * a})`}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 124, color: C.white, letterSpacing: 2, lineHeight: 1}}>
        ТРИ <span style={{color: T.fire}}>ВОЛНЫ</span>
      </div>
      <div style={{marginTop: 22, padding: '8px 22px', borderRadius: 22, background: C.white, color: '#14171d', fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 3}}>ВОЛНА {wave} ИЗ 3</div>
      <div style={{marginTop: 40, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.grey, letterSpacing: 3, opacity: ramp(local, 16, 28)}}>{next}</div>
      <div style={{marginTop: 6, fontFamily: MONO, fontWeight: 800, fontSize: 96, color: C.red, opacity: ramp(local, 16, 28)}}>{remainingText ?? fmtH(remaining)}</div>
    </div>
  );
};
