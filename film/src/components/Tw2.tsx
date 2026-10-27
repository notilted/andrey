import React from 'react';
import {interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {easeOut, ramp, rand} from '../util';
import {T} from './Tw';

/** Карта на телефоне: сетка улиц, «ВЫ», цель и маршрут. danger — красный круг поражения у цели. */
export const MapScreen: React.FC<{f: number; start: number; target: string; km: string; danger?: number; route?: 'school' | 'depot'}> = ({f, start, target, km, danger = 0, route = 'school'}) => {
  const local = f - start;
  const draw = ramp(local, 6, 40);
  const you = [130, 760];
  const to = route === 'school' ? [360, 430] : [420, 170];
  const mid = route === 'school' ? [130, 520] : [250, 600];
  const path = `M${you[0]} ${you[1]} L${mid[0]} ${mid[1]} L${to[0]} ${mid[1]} L${to[0]} ${to[1]}`;
  const len = 1400;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#1c2029'}}>
      <svg viewBox="0 0 532 1032" width={532} height={1032} style={{position: 'absolute', inset: 0}}>
        <rect width={532} height={1032} fill="#20252f" />
        {Array.from({length: 12}).map((_, i) => <rect key={`h${i}`} x={0} y={60 + i * 86} width={532} height={i % 3 ? 6 : 14} fill="#2c323e" />)}
        {Array.from({length: 7}).map((_, i) => <rect key={`v${i}`} x={20 + i * 86} y={0} width={i % 2 ? 6 : 14} height={1032} fill="#2c323e" />)}
        <path d="M0 880 Q200 820 532 900 L532 1032 L0 1032 Z" fill="#1d2c3a" />
        <rect x={300} y={600} width={120} height={90} rx={8} fill="#24302a" />
        {/* место первого удара */}
        <circle cx={250} cy={560} r={150} fill={T.fire} opacity={0.15} />
        <circle cx={250} cy={560} r={70} fill="#2a1c1a" />
        {danger > 0 && (
          <g opacity={danger}>
            <circle cx={to[0]} cy={to[1]} r={40 + 80 * easeOut(danger)} fill={C.red} opacity={0.25} />
            <circle cx={to[0]} cy={to[1]} r={40 + 80 * easeOut(danger)} fill="none" stroke={C.red} strokeWidth={6} />
          </g>
        )}
        <path d={path} fill="none" stroke={C.warm} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${len * draw} ${len}`} />
        <circle cx={you[0]} cy={you[1]} r={16} fill="#5aa0ff" stroke="#fff" strokeWidth={5} />
        <g transform={`translate(${to[0]} ${to[1]})`}>
          <path d="M0 0 C-22 -26 -22 -56 0 -60 C22 -56 22 -26 0 0 Z" fill={danger > 0.5 ? C.red : C.warm} />
          <circle cx={0} cy={-38} r={9} fill="#1c2029" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 24, right: 24, top: 70, padding: '18px 22px', borderRadius: 24, background: 'rgba(242,242,238,0.96)', fontFamily: FONT, color: '#14171d'}}>
        <div style={{fontWeight: 900, fontSize: 30}}>{target}</div>
        <div style={{fontWeight: 800, fontSize: 22, color: '#4a4f5a', marginTop: 4}}>пешком · {km}</div>
      </div>
      <div style={{position: 'absolute', left: 140, top: 740, fontFamily: FONT, fontWeight: 900, fontSize: 22, color: C.white}}>ВЫ</div>
    </div>
  );
};

/** Брошенная машина с открытыми дверями. */
export const AbandonedCar: React.FC<{x: number; y: number; s?: number; col?: string; flip?: boolean}> = ({x, y, s = 1, col = '#2f3644', flip = false}) => (
  <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`}>
    <ellipse cx={0} cy={4} rx={150} ry={10} fill="#000" opacity={0.35} />
    <path d="M-140 -10 L-140 -44 Q-136 -58 -116 -60 L-80 -100 Q-72 -108 -56 -108 L40 -108 Q56 -108 64 -98 L92 -62 Q130 -58 138 -44 L140 -10 Z" fill={col} />
    <path d="M-70 -66 L-48 -98 L-4 -98 L-4 -66 Z M6 -66 L6 -98 L44 -98 L72 -66 Z" fill="#11151d" />
    {/* открытая дверь */}
    <path d="M6 -66 L-26 -120 L-30 -40 L4 -14 Z" fill={col} opacity={0.9} />
    <path d="M2 -70 L-20 -110 L-22 -66 Z" fill="#11151d" />
    <circle cx={-90} cy={-8} r={22} fill="#0b0d12" />
    <circle cx={90} cy={-8} r={22} fill="#0b0d12" />
    <rect x={128} y={-50} width={12} height={10} rx={3} fill={C.lamp} opacity={0.8} />
    <rect x={-142} y={-50} width={8} height={10} rx={3} fill={C.red} />
  </g>
);

/** Фон дороги через город: руины, дым, брошенные машины. Мир шириной ~4000 px. */
export const RuinStreet: React.FC<{f: number; dusk?: number}> = ({f, dusk = 0}) => (
  <g>
    {Array.from({length: 9}).map((_, i) => {
      const x = -400 + i * 520 + rand(i) * 120;
      const h = 360 + rand(i + 4) * 420;
      const broken = rand(i + 7) > 0.4;
      const d = broken ? `M${x} 1400 L${x} ${1400 - h} L${x + 120} ${1400 - h + 40} L${x + 200} ${1400 - h + 180} L${x + 320} ${1400 - h + 120} L${x + 380} 1400 Z` : `M${x} 1400 L${x} ${1400 - h} L${x + 380} ${1400 - h} L${x + 380} 1400 Z`;
      return (
        <g key={i}>
          <path d={d} fill={i % 2 ? '#1d2029' : '#22262f'} />
          {Array.from({length: 8}).map((_, k) => {
            const wx = x + 30 + (k % 4) * 86;
            const wy = 1400 - h + 70 + Math.floor(k / 4) * 120 + 60;
            const burn = rand(i * 9 + k) > 0.78;
            return <rect key={k} x={wx} y={wy} width={48} height={40} fill={burn ? T.fire : '#12151c'} opacity={burn ? 0.6 + 0.4 * Math.sin(f / 4 + k) : 1} />;
          })}
        </g>
      );
    })}
    <rect x={-1000} y={1400} width={6000} height={1200} fill="#16131a" />
    <rect x={-1000} y={1400} width={6000} height={20} fill="#2a2630" />
    <rect x={-1000} y={1560} width={6000} height={180} fill="#100e13" />
    {Array.from({length: 40}).map((_, i) => <rect key={i} x={-1000 + i * 160} y={1646} width={80} height={6} fill="#2a2630" opacity={0.7} />)}
    {Array.from({length: 30}).map((_, i) => (
      <rect key={`d${i}`} x={rand(i + 30) * 4600 - 600} y={1420 + rand(i + 31) * 120} width={20 + rand(i + 32) * 50} height={8 + rand(i + 33) * 16} fill="#2c2830" transform={`rotate(${rand(i + 34) * 40 - 20})`} />
    ))}
    <rect x={-1000} y={-1000} width={6000} height={4000} fill="#0a0c18" opacity={dusk * 0.45} />
  </g>
);

/** Остатки школы: забор, табличка на земле. */
export const SchoolRemnant: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g>
    {Array.from({length: 14}).map((_, i) => (
      <rect key={i} x={x - 520 + i * 28} y={y - 90 + (i > 9 ? (i - 9) * 18 : 0)} width={6} height={90 - (i > 9 ? (i - 9) * 18 : 0)} fill="#3a3f48" transform={i > 10 ? `rotate(${(i - 10) * 12} ${x - 520 + i * 28} ${y})` : undefined} />
    ))}
    <rect x={x - 520} y={y - 80} width={290} height={6} fill="#3a3f48" />
    <g transform={`translate(${x - 160} ${y - 6}) rotate(-12)`}>
      <rect x={-110} y={-44} width={220} height={52} rx={6} fill="#c9c3b2" />
      <text x={0} y={-8} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#2a2e35">ШКОЛА № 14</text>
    </g>
  </g>
);

/** Трамвайное депо: кирпичный корпус с воротами, трамвай, вход в бункер. */
export const DEPOT = {x: -200, w: 1500, base: 1400, bunker: 1150};

export const Depot: React.FC<{f: number}> = ({f}) => {
  const {x, w, base, bunker} = DEPOT;
  return (
    <g>
      <defs>
        <pattern id="redBrick" width="60" height="30" patternUnits="userSpaceOnUse">
          <rect width="60" height="30" fill="#3a2522" />
          <rect x="1" y="1" width="28" height="13" fill="#432a26" />
          <rect x="31" y="1" width="28" height="13" fill="#40292a" />
          <rect x="-14" y="16" width="28" height="13" fill="#40292a" />
          <rect x="16" y="16" width="28" height="13" fill="#452c27" />
          <rect x="46" y="16" width="28" height="13" fill="#3d2724" />
        </pattern>
      </defs>
      <rect x={x} y={base - 560} width={w} height={560} fill="url(#redBrick)" />
      <polygon points={`${x - 30},${base - 560} ${x + w + 30},${base - 560} ${x + w - 40},${base - 640} ${x + 40},${base - 640}`} fill="#2a1e1c" />
      <rect x={x + 180} y={base - 700} width={640} height={70} rx={8} fill="#1d2129" />
      <text x={x + 500} y={base - 652} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.warm} opacity={0.85}>ТРАМВАЙНОЕ ДЕПО № 3</text>
      {/* арочные ворота */}
      {[0, 1].map((i) => {
        const gx = x + 120 + i * 420;
        return (
          <g key={i}>
            <path d={`M${gx} ${base} L${gx} ${base - 300} Q${gx + 170} ${base - 420} ${gx + 340} ${base - 300} L${gx + 340} ${base} Z`} fill="#0c0d11" />
            {i === 0 && (
              <g>
                <rect x={gx + 40} y={base - 250} width={300} height={200} rx={20} fill="#8a3a2e" />
                <rect x={gx + 60} y={base - 230} width={70} height={70} fill="#1a1e26" />
                <rect x={gx + 150} y={base - 230} width={70} height={70} fill="#1a1e26" />
                <rect x={gx + 240} y={base - 230} width={70} height={70} fill="#1a1e26" />
                <rect x={gx + 40} y={base - 120} width={300} height={14} fill="#c9b458" opacity={0.8} />
              </g>
            )}
          </g>
        );
      })}
      {/* рельсы */}
      <rect x={x - 400} y={base + 30} width={w + 800} height={6} fill="#4a4f58" />
      <rect x={x - 400} y={base + 60} width={w + 800} height={6} fill="#4a4f58" />
      {/* вход в бункер: бетонный оголовок */}
      <g>
        <rect x={bunker - 150} y={base - 260} width={300} height={260} fill="#3a3e46" />
        <rect x={bunker - 170} y={base - 280} width={340} height={30} fill="#4a4e56" />
        <rect x={bunker - 90} y={base - 210} width={180} height={210} fill="#0b0c10" />
        <circle cx={bunker} cy={base - 300} r={10} fill={C.redHot} opacity={0.5 + 0.5 * Math.sin(f / 6)} />
        <rect x={bunker - 70} y={base - 250} width={140} height={28} rx={4} fill="#d9d4c7" />
        <text x={bunker} y={base - 229} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={18} fill="#2a2e35">ОБЪЕКТ ГО № 3</text>
      </g>
      <rect x={-2000} y={base} width={5000} height={1500} fill="#17141a" />
    </g>
  );
};

/** Автомат за спиной/в руках охранника (рисуется поверх персонажа). */
export const Rifle: React.FC<{x: number; y: number; s?: number; facing?: 1 | -1}> = ({x, y, s = 1, facing = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s * facing} ${s}) rotate(-28)`}>
    <rect x={-40} y={-6} width={130} height={12} rx={3} fill="#15171b" />
    <rect x={-62} y={-8} width={30} height={18} rx={3} fill="#3a2e25" />
    <path d="M10 6 L16 36 L28 36 L24 6 Z" fill="#15171b" />
    <rect x={88} y={-3} width={30} height={6} fill="#15171b" />
  </g>
);

/** Планшет со списком в руке. */
export const Clipboard: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-8)`}>
    <rect x={-30} y={-42} width={60} height={84} rx={5} fill="#7a5a3a" />
    <rect x={-25} y={-34} width={50} height={72} fill="#e9e4d6" />
    {Array.from({length: 7}).map((_, i) => <rect key={i} x={-20} y={-26 + i * 9} width={i % 3 ? 36 : 28} height={3} fill="#6a6f7a" />)}
    <rect x={-10} y={-46} width={20} height={8} rx={2} fill="#9aa1ad" />
  </g>
);

/** Луч фонарика из точки (x,y) в направлении ang (градусы). */
export const Torch: React.FC<{x: number; y: number; ang: number; len?: number; k?: number}> = ({x, y, ang, len = 900, k = 1}) => {
  const a = (ang * Math.PI) / 180;
  const spread = 0.2;
  const p1 = [x + Math.cos(a - spread) * len, y + Math.sin(a - spread) * len];
  const p2 = [x + Math.cos(a + spread) * len, y + Math.sin(a + spread) * len];
  return (
    <g opacity={k}>
      <defs>
        <radialGradient id="torchG" cx={x} cy={y} r={len} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff6d8" stopOpacity={0.55} />
          <stop offset="1" stopColor="#fff6d8" stopOpacity={0} />
        </radialGradient>
      </defs>
      <polygon points={`${x},${y} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} fill="url(#torchG)" />
      <circle cx={x} cy={y} r={8} fill="#fffbe8" />
    </g>
  );
};

/** Крупный план механизма гермодвери: колесо, сорванный шток, искры. */
export const DoorMechCloseup: React.FC<{f: number; t: number}> = ({f, t}) => {
  const zoom = 1 + t / 600;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute'}}>
      <rect width={1080} height={1920} fill="#050608" />
      <g transform={`translate(540 760) scale(${zoom}) translate(-540 -760)`}>
        <rect x={60} y={200} width={960} height={1150} rx={30} fill="#3b4048" />
        <rect x={100} y={240} width={880} height={1070} rx={24} fill="none" stroke="#2e333a" strokeWidth={14} />
        <g transform="rotate(14 540 760)">
          <circle cx={540} cy={760} r={250} fill="none" stroke="#5a606a" strokeWidth={34} />
          <path d="M290 760 H790 M540 510 V1010" stroke="#5a606a" strokeWidth={26} />
          <circle cx={540} cy={760} r={50} fill="#4a5058" />
        </g>
        {/* шток задвижки сорван */}
        <rect x={830} y={720} width={190} height={60} fill="#5a606a" />
        <rect x={760} y={700} width={60} height={100} fill="#2a2e35" />
        <path d="M820 700 L836 724 L826 748 L840 770 L828 800" stroke="#0b0d11" strokeWidth={8} fill="none" />
        <rect x={700} y={880} width={150} height={36} fill="#5a606a" transform="rotate(32 775 898)" />
        <path d="M640 600 L700 640 L680 700 L740 760" stroke="#0b0d11" strokeWidth={6} fill="none" />
        {/* искры */}
        {Array.from({length: 14}).map((_, i) => {
          const p = ((f / 18 + rand(i) ) % 1);
          return <circle key={i} cx={830 + Math.cos(i) * p * 160} cy={740 + p * p * 300 - p * 120 * rand(i + 3)} r={4} fill={T.fireHot} opacity={(1 - p) * (rand(i + 9) > 0.4 ? 1 : 0)} />;
        })}
      </g>
      <rect width={1080} height={1920} fill="url(#torchVig)" />
      <defs>
        <radialGradient id="torchVig" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0.4" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.9} />
        </radialGradient>
      </defs>
    </svg>
  );
};

/** Огромный таймер в кадре (зацеп серии). */
export const BigTimer: React.FC<{text: string; label: string; k: number; y?: number}> = ({text, label, k, y = 420}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: k, transform: `scale(${0.9 + 0.1 * k})`}}>
    <div style={{display: 'inline-block', padding: '8px 22px', borderRadius: 22, background: C.red, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 3}}>{label}</div>
    <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 168, color: C.white, textShadow: '0 6px 30px rgba(0,0,0,0.8)'}}>{text}</div>
  </div>
);

export const fadeIn = (f: number, a: number, d = 6) => interpolate(f, [a, a + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
