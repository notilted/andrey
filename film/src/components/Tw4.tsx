import React from 'react';
import {interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {easeOut, ramp, rand} from '../util';
import {Fire, T} from './Tw';

/** Небо рассвета: холодный верх, тёплая полоса у горизонта. */
export const DawnSky: React.FC<{k?: number}> = ({k = 1}) => (
  <g>
    <defs>
      <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d1222" />
        <stop offset="0.55" stopColor="#3a3350" />
        <stop offset="0.8" stopColor="#a4605a" />
        <stop offset="1" stopColor="#e09a6a" />
      </linearGradient>
    </defs>
    <rect x={-2000} y={-1000} width={5000} height={2450} fill="url(#dawn)" opacity={k} />
  </g>
);

/** Поле за рекой: дальние руины, река, трава. */
export const Field: React.FC<{f: number; horizon?: number}> = ({f, horizon = 1250}) => (
  <g>
    {Array.from({length: 24}).map((_, i) => {
      const x = -900 + i * 170 + rand(i) * 60;
      const h = 40 + rand(i + 3) * 120;
      return <rect key={i} x={x} y={horizon - h} width={90 + rand(i + 5) * 60} height={h} fill="#1d1b26" />;
    })}
    <rect x={-2000} y={horizon} width={5000} height={60} fill="#2a2a3a" />
    <rect x={-2000} y={horizon + 60} width={5000} height={70} fill="#5a6a8a" opacity={0.55} />
    {Array.from({length: 20}).map((_, i) => (
      <rect key={i} x={-1500 + i * 220 + ((f * 0.4) % 220)} y={horizon + 80 + (i % 3) * 16} width={90} height={3} fill="#c9d4e8" opacity={0.3} />
    ))}
    <rect x={-2000} y={horizon + 130} width={5000} height={1500} fill="#151a1a" />
    {Array.from({length: 80}).map((_, i) => {
      const x = rand(i) * 4000 - 1500;
      const y = horizon + 140 + rand(i + 9) * 500;
      const h = 14 + rand(i + 2) * 30;
      const sway = Math.sin(f / 20 + i) * 4;
      return <path key={i} d={`M${x} ${y} q${sway} ${-h / 2} ${sway * 1.5} ${-h}`} stroke="#2a3330" strokeWidth={3} fill="none" />;
    })}
  </g>
);

/** Чёрный камень. slit 0..1 — щель со светом, hum 0..1 — кольца гула, cx/base — низ по центру. */
export const Monolith: React.FC<{cx: number; base: number; w?: number; h?: number; f: number; slit?: number; hum?: number; touch?: [number, number]}> = ({cx, base, w = 520, h = 720, f, slit = 0, hum = 0, touch}) => {
  const x = cx - w / 2;
  const top = base - h;
  return (
    <g>
      <defs>
        <linearGradient id="monoG" x1="0" x2="1">
          <stop offset="0" stopColor="#0a0b0f" />
          <stop offset="0.35" stopColor="#1a1c24" />
          <stop offset="0.5" stopColor="#0d0e13" />
          <stop offset="1" stopColor="#050608" />
        </linearGradient>
        <radialGradient id="slitGlow">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.9} />
          <stop offset="0.4" stopColor="#dfe8ff" stopOpacity={0.35} />
          <stop offset="1" stopColor="#dfe8ff" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={base + 6} rx={w * 0.75} ry={30} fill="#000" opacity={0.5} />
      <path d={`M${x} ${base} L${x + 30} ${top + 120} Q${x + 60} ${top} ${cx} ${top} Q${x + w - 60} ${top} ${x + w - 30} ${top + 120} L${x + w} ${base} Z`} fill="url(#monoG)" />
      <path d={`M${x + 70} ${base - 40} L${x + 96} ${top + 150} Q${x + 110} ${top + 60} ${cx - 60} ${top + 40}`} stroke="#3a3e4a" strokeWidth={4} fill="none" opacity={0.6} />
      {slit > 0 && (
        <g>
          <ellipse cx={cx} cy={base - h * 0.45} rx={160 + 260 * slit} ry={h * 0.7} fill="url(#slitGlow)" opacity={slit} />
          <rect x={cx - 3 - 22 * slit} y={top + 90} width={6 + 44 * slit} height={h - 120} fill="#fbfdff" />
          <polygon points={`${cx - 25 * slit},${base} ${cx + 25 * slit},${base} ${cx + 420 * slit},${base + 260} ${cx - 420 * slit},${base + 260}`} fill="#eef3ff" opacity={0.25 * slit} />
        </g>
      )}
      {hum > 0 && touch && [0, 1, 2].map((i) => {
        const p = ((f / 40 + i / 3) % 1);
        return <circle key={i} cx={touch[0]} cy={touch[1]} r={20 + p * 260} fill="none" stroke="#9fb8ff" strokeWidth={4} opacity={hum * (1 - p) * 0.7} />;
      })}
    </g>
  );
};

/** Объект в небе без хвоста: тёмная капля с холодным ободком. */
export const SkyObject: React.FC<{x: number; y: number; s?: number; f: number}> = ({x, y, s = 1, f}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={150} ry={70} fill="#9fb8ff" opacity={0.08 + 0.04 * Math.sin(f / 10)} />
    <ellipse cx={0} cy={0} rx={70} ry={38} fill="#08090c" />
    <path d="M-66 -10 Q0 -44 66 -10" stroke="#9fb8ff" strokeWidth={3} fill="none" opacity={0.6} />
  </g>
);

/** Костёр со сковородкой и лепёшками. */
export const Campfire: React.FC<{x: number; y: number; f: number; cakes?: number}> = ({x, y, f, cakes = 3}) => (
  <g>
    <ellipse cx={x} cy={y} rx={160} ry={30} fill={T.fire} opacity={0.12} />
    {[-30, 0, 30].map((d, i) => <rect key={i} x={x - 50} y={y - 10 - i * 4} width={100} height={12} rx={5} fill="#3a2a20" transform={`rotate(${d} ${x} ${y})`} />)}
    <Fire x={x} y={y - 8} f={f} w={70} />
    <path d={`M${x - 70} ${y - 90} L${x - 60} ${y - 10} M${x + 70} ${y - 90} L${x + 60} ${y - 10} M${x - 70} ${y - 90} L${x + 70} ${y - 90}`} stroke="#2a2e35" strokeWidth={6} />
    <ellipse cx={x} cy={y - 78} rx={70} ry={12} fill="#1d2027" />
    {Array.from({length: cakes}).map((_, i) => <ellipse key={i} cx={x - 34 + i * 34} cy={y - 86} rx={18} ry={6} fill="#d9b070" />)}
  </g>
);

const fadeOp = (local: number, a: number) => interpolate(local, [a, a + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** «РАСЧЁТ ТРАЕКТОРИИ…» → «ОБЪЕКТ СНИЖАЕТ СКОРОСТЬ» (slow=1). */
export const TrajectoryScreen: React.FC<{f: number; start: number; slow: number}> = ({f, start, slow}) => {
  const local = f - start;
  const pop = easeOut(ramp(local, 0, 12));
  const spin = (local * 8) % 360;
  const speed = slow ? interpolate(local, [10, 70], [72.4, 0.3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 72.4;
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#10131c,#0a0b10)'}}>
      <div style={{position: 'absolute', top: 80, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 96, color: 'rgba(255,255,255,0.22)'}}>{slow ? '02:46' : '09:15'}</div>
      <div style={{position: 'absolute', left: 26, right: 26, top: 250, transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop, borderRadius: 30, background: C.white, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
        <div style={{background: slow ? C.red : '#3d4a5f', padding: '22px 26px', fontFamily: FONT, fontWeight: 900, fontSize: 25, color: C.white, letterSpacing: 1, whiteSpace: 'nowrap'}}>⚠ ОБНАРУЖЕН НОВЫЙ ОБЪЕКТ</div>
        <div style={{padding: '26px 30px 30px', fontFamily: FONT, color: '#14171d'}}>
          {!slow ? (
            <>
              <div style={{display: 'flex', alignItems: 'center', gap: 18, fontWeight: 900, fontSize: 40, lineHeight: 1.05}}>
                <svg width={48} height={48} viewBox="0 0 48 48" style={{transform: `rotate(${spin}deg)`}}><circle cx={24} cy={24} r={18} stroke="#c9c3b8" strokeWidth={6} fill="none" /><path d="M24 6 A18 18 0 0 1 42 24" stroke={C.red} strokeWidth={6} fill="none" /></svg>
                РАСЧЁТ ТРАЕКТОРИИ…
              </div>
              <div style={{marginTop: 18, fontWeight: 700, fontSize: 21, color: '#4a4f5a'}}>ДО УДАРА:</div>
              <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 76, whiteSpace: 'nowrap', color: '#9aa1ad'}}>--:--:--</div>
            </>
          ) : (
            <>
              <div style={{fontWeight: 900, fontSize: 46, lineHeight: 1.04, opacity: fadeOp(local, 4)}}>ОБЪЕКТ<br /><span style={{color: C.red}}>СНИЖАЕТ СКОРОСТЬ</span></div>
              <div style={{marginTop: 18, fontWeight: 700, fontSize: 21, color: '#4a4f5a', opacity: fadeOp(local, 10)}}>СКОРОСТЬ:</div>
              <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 76, whiteSpace: 'nowrap', color: C.red, opacity: fadeOp(local, 10)}}>{speed.toFixed(1)} км/с</div>
              <svg width={470} height={90} viewBox="0 0 470 90" style={{marginTop: 6, opacity: fadeOp(local, 14)}}>
                <path d={`M0 10 Q${200} 12 ${Math.min(470, 60 + local * 6)} ${Math.min(80, 10 + local * 1.2)}`} stroke={C.red} strokeWidth={5} fill="none" />
              </svg>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/** Входящий звонок без сети. */
export const CallScreen: React.FC<{f: number; start: number; name: string; hl?: number}> = ({f, start, name, hl = 0}) => {
  const local = f - start;
  const pulse = 0.5 + 0.5 * Math.sin(local / 5);
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#1a1f2b,#0c0e14)', fontFamily: FONT, color: C.white}}>
      <div style={{position: 'absolute', top: 70, left: 40, right: 40, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 22, color: C.grey}}>
        <span>НЕТ СЕТИ</span>
        <span style={{color: C.red}}>✕ ▂▄▆</span>
      </div>
      <div style={{position: 'absolute', top: 180, width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 26, color: C.grey}}>входящий вызов</div>
      <div style={{position: 'absolute', top: 260, left: '50%', transform: `translate(-50%,0) scale(${1 + pulse * 0.05})`, width: 200, height: 200, borderRadius: 100, background: '#4d4a36', boxShadow: `0 0 ${40 + pulse * 40}px rgba(201,180,88,0.5)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 96}}>Е</div>
      <div style={{position: 'absolute', top: 500, width: '100%', textAlign: 'center', fontWeight: 900, fontSize: 64, color: hl ? C.warm : C.white, transform: `scale(${1 + hl * 0.08})`}}>{name}</div>
      <div style={{position: 'absolute', top: 590, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.grey}}>+7 916 ••• •• 42</div>
      <div style={{position: 'absolute', bottom: 110, left: 70, right: 70, display: 'flex', justifyContent: 'space-between'}}>
        <div style={{width: 130, height: 130, borderRadius: 65, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56}}>✕</div>
        <div style={{width: 130, height: 130, borderRadius: 65, background: '#3aa25a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, transform: `translateY(${-pulse * 10}px)`}}>✆</div>
      </div>
    </div>
  );
};

/** Финальный титр сезона 2. */
export const SeasonCard: React.FC<{f: number; start: number; episode: number; teaser: string}> = ({f, start, episode, teaser}) => {
  const local = f - start;
  const a = easeOut(ramp(local, 0, 14));
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: a, transform: `scale(${0.96 + 0.04 * a})`}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 124, color: C.white, letterSpacing: 2, lineHeight: 1}}>
        ТРИ <span style={{color: T.fire}}>ВОЛНЫ</span>
      </div>
      <div style={{marginTop: 22, padding: '8px 22px', borderRadius: 22, background: C.white, color: '#14171d', fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 3}}>СЕЗОН 2 · СЕРИЯ {episode}</div>
      <div style={{marginTop: 40, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.warm, letterSpacing: 3, opacity: ramp(local, 16, 28)}}>{teaser}</div>
    </div>
  );
};
