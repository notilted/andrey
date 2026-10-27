import React from 'react';
import {interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {easeOut, ramp} from '../util';
import {Character} from './Character';
import {fmt} from './Overlay';

const fade = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Корпус телефона; содержимое экрана — children (координаты экрана 532×1032). */
export const PhoneFrame: React.FC<{x: number; y: number; scale?: number; tilt?: number; glow?: string; glowK?: number; shake?: number; f?: number; children: React.ReactNode}> = ({x, y, scale = 1, tilt = -2, glow = C.red, glowK = 0.4, shake = 0, f = 0, children}) => {
  const sx = shake * Math.sin(f * 2.7) * 4;
  const sy = shake * Math.cos(f * 3.1) * 3;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) translate(${sx}px,${sy}px) scale(${scale}) rotate(${tilt}deg)`}}>
      <div style={{width: 560, height: 1060, borderRadius: 70, background: '#0c0e13', border: '6px solid #2b303b', boxShadow: `0 0 120px ${glow}${Math.round(glowK * 255).toString(16).padStart(2, '0')}`, position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 14, borderRadius: 56, overflow: 'hidden', background: '#0e1016'}}>
          <div style={{position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 120, height: 32, borderRadius: 16, background: '#000', zIndex: 5}} />
          {children}
        </div>
      </div>
    </div>
  );
};

/** Входящее сообщение с собственного номера. */
export const MessageScreen: React.FC<{f: number; start: number; text: string; time: string; remaining?: number}> = ({f, start, text, time, remaining}) => {
  const local = f - start;
  const pop = easeOut(ramp(local, 4, 16));
  const chars = Math.floor(interpolate(local, [14, 14 + text.length * 1.2], [0, text.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#121722,#0b0e14)'}}>
      <div style={{position: 'absolute', top: 80, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 92, color: 'rgba(255,255,255,0.2)'}}>{time}</div>
      {remaining !== undefined && (
        <div style={{position: 'absolute', top: 196, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 30, color: C.red}}>ДО УДАРА {fmt(remaining)}</div>
      )}
      <div style={{position: 'absolute', left: 26, right: 26, top: 300, opacity: pop, transform: `translateY(${(1 - pop) * -30}px)`, borderRadius: 30, background: 'rgba(242,242,238,0.96)', padding: '24px 28px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 64, height: 64, borderRadius: 32, background: '#3d4a5f', color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>М</div>
          <div style={{fontFamily: FONT, color: '#14171d'}}>
            <div style={{fontWeight: 900, fontSize: 30}}>Марк</div>
            <div style={{fontWeight: 700, fontSize: 20, color: C.red}}>ВАШ НОМЕР · сейчас</div>
          </div>
        </div>
        <div style={{marginTop: 22, fontFamily: FONT, fontWeight: 900, fontSize: 44, lineHeight: 1.12, color: '#14171d', minHeight: 100}}>
          {text.slice(0, chars)}
          {chars < text.length && <span style={{opacity: Math.floor(local / 6) % 2 ? 1 : 0}}>|</span>}
        </div>
      </div>
    </div>
  );
};

/** Экран таймера (для пары телефонов в сцене 3). */
export const TimerScreen: React.FC<{owner: string; remaining: number; color: string}> = ({owner, remaining, color}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#1a0d10,#0e0a0c)'}}>
    <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}>
      <span style={{padding: '10px 26px', borderRadius: 26, background: C.white, color: '#14171d', fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 2}}>{owner}</span>
    </div>
    <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 30, color: '#c9c2b6'}}>ДО УДАРА</div>
    <div style={{position: 'absolute', top: 350, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 150, color}}>{fmt(remaining)}</div>
    <div style={{position: 'absolute', top: 560, left: 60, right: 60, height: 14, borderRadius: 7, background: '#2a1c1f'}}>
      <div style={{width: `${(remaining / 1020) * 100}%`, height: '100%', borderRadius: 7, background: color}} />
    </div>
  </div>
);

/** Финальный экран: «ЭТАП 1 ЗАВЕРШЁН». */
export const StageScreen: React.FC<{f: number; start: number; copies: number}> = ({f, start, copies}) => {
  const local = f - start;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#e8e4da', fontFamily: FONT, color: '#14171d'}}>
      <div style={{position: 'absolute', top: 120, left: 40, right: 40, padding: '16px 0', borderRadius: 18, background: '#14171d', color: C.white, textAlign: 'center', fontWeight: 900, fontSize: 30, letterSpacing: 2}}>00:00</div>
      <div style={{position: 'absolute', top: 290, width: '100%', textAlign: 'center', fontWeight: 900, fontSize: 64, lineHeight: 1.05, opacity: fade(local, 6, 12)}}>
        ЭТАП 1<br />
        <span style={{color: C.red}}>ЗАВЕРШЁН</span>
      </div>
      <div style={{position: 'absolute', top: 520, width: '100%', textAlign: 'center', fontWeight: 800, fontSize: 26, color: '#555b66', opacity: fade(local, 26, 32)}}>ОБНАРУЖЕНО КОПИЙ:</div>
      <div style={{position: 'absolute', top: 566, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 70, color: C.red, opacity: fade(local, 26, 32)}}>
        {Math.round(copies).toLocaleString('ru-RU').replace(/,/g, ' ')}
      </div>
    </div>
  );
};

/** Изображение с камеры наблюдения: коридор за дверью и двойник Марка. */
export const CctvView: React.FC<{f: number; mouth: number; approach: number; blink: number}> = ({f, mouth, approach, blink}) => {
  const roll = (f * 7) % 1400;
  return (
    <svg viewBox="0 0 1000 760" width={1000} height={760} style={{display: 'block'}}>
      <defs>
        <filter id="mono">
          <feColorMatrix type="matrix" values="0.25 0.5 0.1 0 0.02  0.3 0.6 0.12 0 0.05  0.25 0.5 0.1 0 0.03  0 0 0 1 0" />
        </filter>
        <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="2" fill="#000" opacity={0.35} />
        </pattern>
        <radialGradient id="crtVig" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0.6" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.8} />
        </radialGradient>
      </defs>
      <g filter="url(#mono)">
        {/* коридор в перспективе */}
        <rect width={1000} height={760} fill="#2a2f36" />
        <polygon points="0,0 1000,0 700,250 300,250" fill="#20242a" />
        <polygon points="0,760 1000,760 700,520 300,520" fill="#3a3f46" />
        <polygon points="0,0 300,250 300,520 0,760" fill="#30353c" />
        <polygon points="1000,0 700,250 700,520 1000,760" fill="#30353c" />
        <rect x={300} y={250} width={400} height={270} fill="#15181c" />
        <rect x={420} y={300} width={160} height={220} fill="#2a2e34" />
        <rect x={470} y={258} width={60} height={20} fill="#d8d8c8" />
        {/* двойник */}
        <g transform={`translate(${500} ${700 + approach * 60}) scale(${1.25 + approach * 0.5})`}>
          <Character who="mark" x={0} y={0} size={1} frame={f} pose={{look: -1.6, lookUp: 0.3, mouth, blink, brow: -0.2, rim: 0, armF: [4, -6], armB: [-4, -6]}} />
        </g>
      </g>
      <rect width={1000} height={760} fill="url(#scan)" />
      <rect x={0} y={roll - 200} width={1000} height={60} fill="#fff" opacity={0.04} />
      <rect width={1000} height={760} fill="url(#crtVig)" />
      <text x={30} y={50} fontFamily={MONO} fontWeight={800} fontSize={30} fill="#e6f0e8" opacity={0.85}>CAM 02 · КОРИДОР</text>
      <circle cx={890} cy={40} r={10} fill={C.red} opacity={Math.floor(f / 15) % 2 ? 1 : 0.2} />
      <text x={910} y={50} fontFamily={MONO} fontWeight={800} fontSize={30} fill="#e6f0e8" opacity={0.85}>REC</text>
    </svg>
  );
};

/** Финальный титр в духе референса. */
export const EndCard: React.FC<{f: number; start: number}> = ({f, start}) => {
  const local = f - start;
  const a = easeOut(ramp(local, 0, 18));
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: a, transform: `scale(${0.96 + 0.04 * a})`}}>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.grey, fontStyle: 'italic', marginBottom: 14, opacity: ramp(local, 20, 34)}}>конец первой части</div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 132, color: C.white, letterSpacing: 2, lineHeight: 1}}>
        17 <span style={{color: C.red}}>МИНУТ</span>
      </div>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.warm, marginTop: 26, letterSpacing: 3, opacity: ramp(local, 30, 46)}}>КАКОЙ ИЗ НИХ НАСТОЯЩИЙ?</div>
    </div>
  );
};
