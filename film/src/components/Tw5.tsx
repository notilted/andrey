import React from 'react';
import {C, FONT, MONO} from '../theme';
import {easeOut, ramp, rand} from '../util';
import {T} from './Tw';

/** Голосовое сообщение Евгения: «не доставлено» → «доставлено», волна воспроизведения. */
export const VoiceMessageScreen: React.FC<{f: number; start: number; delivered: number; play: number}> = ({f, start, delivered, play}) => {
  const local = f - start;
  const pop = easeOut(ramp(local, 0, 12));
  const bars = 34;
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#151a24,#0b0d12)', fontFamily: FONT, color: C.white}}>
      <div style={{position: 'absolute', top: 90, left: 40, right: 40, display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{width: 84, height: 84, borderRadius: 42, background: '#4d4a36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 44}}>Е</div>
        <div>
          <div style={{fontWeight: 900, fontSize: 36}}>Евгений</div>
          <div style={{fontWeight: 700, fontSize: 20, color: C.grey}}>голосовое · записано 6 дней назад, 18:59</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 330, transform: `scale(${0.9 + 0.1 * pop})`, opacity: pop, padding: '28px 26px', borderRadius: 30, background: '#232a38'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 70, height: 70, borderRadius: 35, background: C.warm, color: '#14171d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 900}}>▶</div>
          <svg width={360} height={80} viewBox="0 0 360 80">
            {Array.from({length: bars}).map((_, i) => {
              const h = 10 + rand(i + 7) * 56 * (0.6 + 0.4 * Math.sin(i / 3));
              const on = i / bars < play;
              const live = on && Math.abs(i / bars - play) < 0.06 ? 1 + 0.3 * Math.sin(f / 2 + i) : 1;
              return <rect key={i} x={i * 10.5} y={40 - (h * live) / 2} width={6} height={h * live} rx={3} fill={on ? C.warm : '#4a5160'} />;
            })}
          </svg>
        </div>
        <div style={{marginTop: 14, fontFamily: MONO, fontWeight: 800, fontSize: 24, color: C.grey}}>0:{String(Math.floor(play * 41)).padStart(2, '0')} / 0:41</div>
      </div>
      <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center'}}>
        <span style={{padding: '10px 24px', borderRadius: 22, background: delivered > 0.5 ? '#3aa25a' : C.red, fontWeight: 900, fontSize: 26, letterSpacing: 2, transform: `scale(${1 + 0.1 * Math.sin(delivered * Math.PI)})`, display: 'inline-block'}}>
          {delivered > 0.5 ? '✓ ДОСТАВЛЕНО' : '✕ НЕ ДОСТАВЛЕНО'}
        </span>
      </div>
    </div>
  );
};

/** Письмо на всех экранах: строки печатаются по очереди; lines — [текст, кадр начала, выделить]. */
export const LetterScreen: React.FC<{f: number; lines: [string, number, boolean?][]}> = ({f, lines}) => (
  <div style={{position: 'absolute', inset: 0, background: '#05070b', fontFamily: FONT, color: C.white, padding: '120px 44px'}}>
    <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 22, color: '#9fb8ff', letterSpacing: 3, marginBottom: 40}}>ОТПРАВИТЕЛЬ НЕИЗВЕСТЕН</div>
    {lines.map(([t, at, hl], i) => {
      const n = Math.max(0, Math.min(t.length, Math.floor((f - at) * 1.6)));
      if (f < at) return null;
      return (
        <div key={i} style={{fontWeight: hl ? 900 : 700, fontSize: hl ? 52 : 34, lineHeight: 1.25, marginBottom: 26, color: hl ? C.warm : C.white}}>
          {t.slice(0, n)}{n < t.length && <span style={{opacity: Math.floor(f / 6) % 2 ? 1 : 0}}>▍</span>}
        </div>
      );
    })}
  </div>
);

/** Ясное небо (k — насколько прояснилось). */
export const BlueSky: React.FC<{k: number; sun?: [number, number]}> = ({k, sun = [820, 420]}) => (
  <g opacity={k}>
    <defs>
      <linearGradient id="blueSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2f5a9a" />
        <stop offset="0.7" stopColor="#7fa6d8" />
        <stop offset="1" stopColor="#d8c9a8" />
      </linearGradient>
      <radialGradient id="sunG">
        <stop offset="0" stopColor="#fff6d8" stopOpacity={1} />
        <stop offset="0.25" stopColor="#ffe9a8" stopOpacity={0.6} />
        <stop offset="1" stopColor="#ffe9a8" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={-2000} y={-1000} width={5000} height={2450} fill="url(#blueSky)" />
    <circle cx={sun[0]} cy={sun[1]} r={260} fill="url(#sunG)" />
    <circle cx={sun[0]} cy={sun[1]} r={56} fill="#fffbe8" />
  </g>
);

/** Звёздное небо с одной движущейся звездой. */
export const StarSky: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={-2000} y={-1000} width={5000} height={2450} fill="#070a14" />
    {Array.from({length: 160}).map((_, i) => (
      <circle key={i} cx={rand(i) * 3000 - 900} cy={rand(i + 300) * 1300 - 200} r={0.8 + rand(i + 9) * 1.8} fill="#dfe6f5" opacity={0.3 + 0.5 * Math.abs(Math.sin(f / 30 + i))} />
    ))}
    <circle cx={200 + f * 0.6} cy={260 - f * 0.08} r={4} fill="#cfe0ff" />
    <circle cx={200 + f * 0.6} cy={260 - f * 0.08} r={20} fill="#9fb8ff" opacity={0.25} />
  </g>
);

/** Финальный титр сериала. */
export const FinalCard: React.FC<{f: number; start: number}> = ({f, start}) => {
  const local = f - start;
  const a = easeOut(ramp(local, 0, 18));
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: a, transform: `scale(${0.96 + 0.04 * a})`}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 124, color: C.white, letterSpacing: 2, lineHeight: 1}}>
        ТРИ <span style={{color: T.fire}}>ВОЛНЫ</span>
      </div>
      <div style={{marginTop: 26, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.warm, letterSpacing: 8, opacity: ramp(local, 14, 26)}}>КОНЕЦ</div>
      <div style={{marginTop: 34, fontFamily: FONT, fontWeight: 700, fontStyle: 'italic', fontSize: 30, color: C.grey, opacity: ramp(local, 30, 44)}}>памяти тех, кто закрыл дверь за других</div>
    </div>
  );
};
