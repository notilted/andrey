import React from 'react';
import {interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {easeOut, ramp} from '../util';
import {Character} from './Character';
import {T} from './Tw';

const YARN = '#7a3440';

/** Вязаный заяц из шарфа бабы Гали; k — насколько связан (0..1). */
export const KnitBunny: React.FC<{x: number; y: number; s?: number; k?: number; rot?: number}> = ({x, y, s = 1, k = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={0.2 + 0.8 * k}>
    <g transform={`scale(${0.4 + 0.6 * k})`}>
      <ellipse cx={-10} cy={-58} rx={7} ry={20} fill={YARN} transform="rotate(-12 -10 -58)" />
      <ellipse cx={10} cy={-58} rx={7} ry={20} fill={YARN} transform="rotate(12 10 -58)" />
      <circle cx={0} cy={-30} r={16} fill={YARN} />
      <ellipse cx={0} cy={0} rx={20} ry={18} fill={YARN} />
      <circle cx={-5} cy={-32} r={2.2} fill="#1a1012" />
      <circle cx={6} cy={-32} r={2.2} fill="#1a1012" />
      <path d="M-14 -6 Q0 0 14 -6 M-16 4 Q0 10 16 4" stroke="#5a2430" strokeWidth={2} fill="none" />
    </g>
  </g>
);

/** Спицы в руках (качаются). */
export const Needles: React.FC<{x: number; y: number; f: number; s?: number}> = ({x, y, f, s = 1}) => {
  const a = Math.sin(f / 3) * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0 0 l${40} ${-20 + a}`} stroke="#c9c3b2" strokeWidth={3} />
      <path d={`M6 4 l${40} ${-6 - a}`} stroke="#c9c3b2" strokeWidth={3} />
      <path d="M10 2 Q30 30 60 40" stroke={YARN} strokeWidth={4} fill="none" />
    </g>
  );
};

/** Рисунок Сони: пятеро и кот, проявляются по ходу (t — кадры). */
export const DrawingFive: React.FC<{t: number}> = ({t}) => {
  const k = (i: number) => ramp(t, 10 + i * 14, 22 + i * 14);
  const fig = (x: number, h: number, col: string, i: number, hair = false) => (
    <g opacity={k(i)} stroke={col} strokeWidth={6} fill="none" strokeLinecap="round">
      <circle cx={x} cy={760 - h} r={h * 0.16} />
      <path d={`M${x} ${760 - h * 0.84} V${760 - h * 0.35} M${x} ${760 - h * 0.35} l-24 ${h * 0.35} M${x} ${760 - h * 0.35} l24 ${h * 0.35} M${x - 34} ${760 - h * 0.65} h68`} />
      {hair && <path d={`M${x - h * 0.16} ${760 - h} l-14 10 M${x + h * 0.16} ${760 - h} l14 10`} />}
    </g>
  );
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute'}}>
      <rect width={1080} height={1920} fill="#0b0d12" />
      <g transform={`translate(540 700) rotate(-3) scale(${1 + t / 900}) translate(-540 -700)`}>
        <rect x={110} y={330} width={860} height={640} fill="#e9e4d6" />
        <circle cx={860} cy={420} r={50} fill="none" stroke={C.warm} strokeWidth={6} opacity={k(0)} />
        {fig(250, 250, '#3c4a6a', 1)}
        {fig(390, 160, '#c0503f', 2, true)}
        {fig(530, 230, '#4d4a36', 3)}
        {fig(680, 210, '#6b2f38', 4)}
        <g opacity={k(5)} stroke="#3b3c42" strokeWidth={6} fill="none" strokeLinecap="round">
          <ellipse cx={820} cy={730} rx={40} ry={22} />
          <circle cx={868} cy={700} r={18} />
          <path d="M856 686 l4 -16 l8 12 M874 684 l8 -12 l2 16 M780 724 q-30 -20 -20 -50" />
        </g>
        <text x={540} y={920} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill="#3c4a6a" opacity={k(6)}>МЫ</text>
      </g>
      {/* карандаш */}
      <g transform={`translate(${300 + (t % 60) * 6} ${880 - Math.abs(Math.sin(t / 8)) * 30}) rotate(-35)`}>
        <rect x={0} y={0} width={240} height={22} fill="#c98a36" />
        <polygon points="240,0 270,11 240,22" fill="#e0c9a0" />
      </g>
    </svg>
  );
};

/** Старая фотография: мальчик лет десяти. */
export const PhotoCloseup: React.FC<{f: number; t: number; tilt?: number}> = ({f, t, tilt = -4}) => {
  const a = easeOut(ramp(t, 0, 14));
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute'}}>
      <rect width={1080} height={1920} fill="#07080b" opacity={0.92} />
      <g transform={`translate(540 760) rotate(${tilt}) scale(${0.9 + 0.1 * a + t / 1500}) translate(-540 -760)`} opacity={a}>
        <rect x={250} y={380} width={580} height={720} fill="#e8e0cc" />
        <rect x={286} y={416} width={508} height={560} fill="#8a8676" />
        <rect x={286} y={790} width={508} height={186} fill="#6a6a5c" />
        <g filter="url(#sepia)">
          <Character who="mark" x={540} y={976} size={1.25} frame={f} override={{scale: 0.7, headScale: 1.2, top: '#5a6a7a', topShade: '#4a5a6a', hair: '#3a2e24'}} pose={{smile: 0.8, blink: 1, rim: 0}} />
        </g>
        <text x={540} y={1060} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontStyle="italic" fontSize={34} fill="#5a5448">Дима, 10 лет</text>
      </g>
      <defs>
        <filter id="sepia"><feColorMatrix type="matrix" values="0.39 0.77 0.19 0 0  0.35 0.69 0.17 0 0  0.27 0.53 0.13 0 0  0 0 0 1 0" /></filter>
      </defs>
    </svg>
  );
};

/** Записка: сложенная или раскрытая с текстом. */
export const NoteCloseup: React.FC<{t: number; open: boolean; lines?: string[]}> = ({t, open, lines = []}) => {
  const a = easeOut(ramp(t, 0, 12));
  const unfold = open ? easeOut(ramp(t, 4, 22)) : 0;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute'}}>
      <rect width={1080} height={1920} fill="#07080b" opacity={0.9} />
      <g transform={`translate(540 760) rotate(-3) scale(${0.92 + 0.08 * a + t / 1600}) translate(-540 -760)`} opacity={a}>
        <rect x={240} y={420 + (1 - unfold) * 250} width={600} height={240 + unfold * 500} fill="#ece6d4" />
        <path d={`M240 ${660 - (1 - unfold) * 0} H840`} stroke="#cfc7b0" strokeWidth={3} opacity={unfold} />
        {!open && <path d="M240 540 H840" stroke="#cfc7b0" strokeWidth={4} />}
        {lines.map((l, i) => (
          <text key={i} x={300} y={540 + i * 110} fontFamily={FONT} fontWeight={700} fontStyle="italic" fontSize={54} fill="#2a2e45" opacity={unfold * ramp(t, 18 + i * 14, 30 + i * 14)}>{l}</text>
        ))}
      </g>
    </svg>
  );
};

/** Экран «ОБНАРУЖЕН НОВЫЙ ОБЪЕКТ». */
export const NewObjectScreen: React.FC<{f: number; start: number}> = ({f, start}) => {
  const local = f - start;
  const pop = easeOut(ramp(local, 0, 12));
  const op = (a: number) => interpolate(local, [a, a + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const blinkOn = Math.floor(local / 10) % 2 === 0;
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#160c0c,#0b0809)'}}>
      <div style={{position: 'absolute', top: 80, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 96, color: 'rgba(255,255,255,0.22)'}}>06:12</div>
      <div style={{position: 'absolute', left: 26, right: 26, top: 250, transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop, borderRadius: 30, background: C.white, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
        <div style={{background: C.red, padding: '22px 26px', fontFamily: FONT, fontWeight: 900, fontSize: 25, color: C.white, letterSpacing: 1, whiteSpace: 'nowrap'}}>⚠ ЭКСТРЕННОЕ ОПОВЕЩЕНИЕ</div>
        <div style={{padding: '26px 30px 30px', fontFamily: FONT, color: '#14171d'}}>
          <div style={{fontWeight: 900, fontSize: 50, lineHeight: 1.04, opacity: op(8)}}>ОБНАРУЖЕН<br /><span style={{color: C.red}}>НОВЫЙ ОБЪЕКТ</span></div>
          <div style={{marginTop: 18, fontWeight: 700, fontSize: 21, color: '#4a4f5a', opacity: op(18)}}>ДО УДАРА:</div>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 76, whiteSpace: 'nowrap', color: C.red, opacity: op(18) * (blinkOn ? 1 : 0.35)}}>--:--:--</div>
          <div style={{marginTop: 8, display: 'inline-block', padding: '8px 16px', borderRadius: 14, background: '#14171d', color: C.white, fontWeight: 900, fontSize: 22, letterSpacing: 1, opacity: op(30)}}>РАСЧЁТ ТРАЕКТОРИИ…</div>
        </div>
      </div>
    </div>
  );
};

/** Искры у рук (ремонт механизма). */
export const Sparks: React.FC<{x: number; y: number; f: number; k?: number}> = ({x, y, f, k = 1}) => (
  <g opacity={k}>
    {Array.from({length: 10}).map((_, i) => {
      const p = ((f / 12 + i / 10) % 1);
      const burst = Math.floor(f / 12 + i / 10) % 3 === 0;
      if (!burst) return null;
      return <circle key={i} cx={x + Math.cos(i * 2.1) * p * 90} cy={y - Math.sin(i * 1.3) * p * 40 + p * p * 120} r={3} fill={T.fireHot} opacity={1 - p} />;
    })}
  </g>
);
