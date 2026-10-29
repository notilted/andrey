import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {easeOut, ramp} from '../util';

/** Статус-строка в левом верхнем углу (как «23:41 • СВЯЗИ НЕТ» в референсе). */
export const StatusBar: React.FC<{time: string; label: string; labelColor?: string; opacity?: number}> = ({time, label, labelColor = C.red, opacity = 1}) => (
  <div style={{position: 'absolute', left: 48, top: 64, opacity, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 40, background: 'rgba(5,7,12,0.55)', fontFamily: MONO, fontWeight: 800, fontSize: 30, color: C.white, letterSpacing: 1}}>
    <span>{time}</span>
    <span style={{width: 8, height: 8, borderRadius: 4, background: C.grey, opacity: 0.6}} />
    <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 26, color: labelColor, letterSpacing: 1.5}}>{label}</span>
  </div>
);

/** Плашка-ярлык: жёлтая / красная / белая, с лёгким наклоном и «выпрыгиванием». */
export const Chip: React.FC<{x: number; y: number; text: string; kind?: 'yellow' | 'red' | 'white'; t: number; tilt?: number; size?: number}> = ({x, y, text, kind = 'yellow', t, tilt = 0, size = 26}) => {
  const k = easeOut(Math.max(0, Math.min(1, t)));
  const bg = kind === 'yellow' ? C.warm : kind === 'red' ? C.red : C.white;
  const fg = kind === 'red' ? C.white : '#14171d';
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${tilt}deg) scale(${0.6 + 0.4 * k})`, opacity: k, background: bg, color: fg, fontFamily: FONT, fontWeight: 900, fontSize: size, padding: `${size * 0.3}px ${size * 0.7}px`, borderRadius: size * 0.6, whiteSpace: 'nowrap', letterSpacing: 0.5, boxShadow: '0 6px 18px rgba(0,0,0,0.35)'}}>
      {text}
    </div>
  );
};

/**
 * Субтитры: крупный жирный шрифт, не более двух строк, слова «загораются» по ходу речи,
 * слова в *звёздочках* выделяются жёлтым.
 */
export const Subtitle: React.FC<{text: string; who?: string; f: number; start: number; dur: number; y?: number}> = ({text, who, f, start, dur, y = 1290}) => {
  const words = text.split(' ');
  let hl = false;
  const parsed = words.map((w) => {
    const open = w.startsWith('*');
    if (open) hl = true;
    const res = {w: w.replace(/\*/g, ''), hl};
    if (w.replace(/[.,!?…]+$/, '').endsWith('*')) hl = false;
    return res;
  });
  const total = parsed.reduce((s, p) => s + p.w.length + 2, 0);
  const local = f - start;
  const appear = ramp(local, -4, 4, easeOut);
  const vanish = 1 - ramp(local, dur + 6, dur + 12);
  if (local < -4 || local > dur + 12) return null;
  let acc = 0;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: y, opacity: appear * vanish, transform: `translateY(${(1 - appear) * 14}px)`, textAlign: 'center'}}>
      {who && (
        <div style={{display: 'inline-block', marginBottom: 18, padding: '7px 18px', borderRadius: 22, background: 'rgba(242,242,238,0.92)', color: '#14171d', fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 2}}>
          {who}
        </div>
      )}
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 64, lineHeight: 1.12, textTransform: 'uppercase', color: C.white, textShadow: '0 4px 20px rgba(0,0,0,0.7)'}}>
        {parsed.map((p, i) => {
          const at = (acc / total) * dur * 0.92;
          acc += p.w.length + 2;
          const on = ramp(local, at - 2, at + 4);
          const base = p.hl ? C.warm : C.white;
          return (
            <span key={i} style={{color: base, opacity: 0.32 + 0.68 * on}}>
              {p.w}
              {i < parsed.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Плёночное зерно (8 заранее сгенерированных текстур шума, смена каждый кадр) + виньетка. */
export const Grain: React.FC<{f: number; strength?: number}> = ({f, strength = 0.07}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <Img src={staticFile(`fx/grain_${f % 8}.png`)} style={{position: 'absolute', width: '100%', height: '100%', opacity: strength * 1.6, mixBlendMode: 'overlay', imageRendering: 'pixelated'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 70% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
  </AbsoluteFill>
);

/** Тёмная подложка под субтитры: нижняя треть уходит в черноту (как в референсе). */
export const BottomFade: React.FC<{from?: number}> = ({from = 1080}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: from, bottom: 0, background: `linear-gradient(to bottom, rgba(6,8,13,0) 0%, rgba(6,8,13,0.92) 26%, ${C.void} 100%)`}} />
);

/** Обратный отсчёт мм:сс. */
export const fmt = (sec: number) => {
  const s = Math.max(0, Math.ceil(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

/** Экран телефона с экстренным оповещением. */
export const AlertPhone: React.FC<{f: number; start: number; remaining: number; x?: number; y?: number; scale?: number; shake?: number}> = ({f, start, remaining, x = 540, y = 700, scale = 1, shake = 0}) => {
  const local = f - start;
  const pop = easeOut(Math.max(0, Math.min(1, local / 12)));
  const pulse = 0.5 + 0.5 * Math.sin((local / 30) * 2 * Math.PI * 2.2);
  const sx = shake * Math.sin(f * 2.7) * 4;
  const sy = shake * Math.cos(f * 3.1) * 3;
  const lines = [
    {t: 'РАКЕТНАЯ УГРОЗА', at: 10, size: 58, color: C.white},
  ];
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) translate(${sx}px,${sy}px) scale(${scale}) rotate(-2deg)`}}>
      {/* корпус */}
      <div style={{width: 560, height: 1060, borderRadius: 70, background: '#0c0e13', border: '6px solid #2b303b', boxShadow: `0 0 ${80 + pulse * 60}px rgba(216,84,69,${0.25 + pulse * 0.25})`, position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 14, borderRadius: 56, background: `linear-gradient(180deg, #1a0d10 0%, #2a1013 ${40 + pulse * 10}%, #120a0c 100%)`, overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 120, height: 32, borderRadius: 16, background: '#000'}} />
          <div style={{position: 'absolute', top: 80, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 92, color: 'rgba(255,255,255,0.18)'}}>23:41</div>
          {/* карточка оповещения */}
          <div style={{position: 'absolute', left: 26, right: 26, top: 250, transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop, borderRadius: 30, background: C.white, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
            <div style={{background: C.red, padding: '22px 26px', display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontWeight: 900, fontSize: 25, whiteSpace: 'nowrap', color: C.white, letterSpacing: 1}}>
              <svg width={40} height={36} viewBox="0 0 40 36"><path d="M20 2 L38 34 H2 Z" fill="none" stroke="#fff" strokeWidth={4} strokeLinejoin="round" /><rect x={18} y={13} width={4} height={11} fill="#fff" /><rect x={18} y={27} width={4} height={4} fill="#fff" /></svg>
              ЭКСТРЕННОЕ ОПОВЕЩЕНИЕ
            </div>
            <div style={{padding: '28px 30px 30px', fontFamily: FONT, color: '#14171d'}}>
              {lines.map((l) => (
                <div key={l.t} style={{fontWeight: 900, fontSize: 52, lineHeight: 1.05, opacity: interpolate(local, [l.at, l.at + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
                  {l.t}
                </div>
              ))}
              <div style={{marginTop: 18, fontWeight: 700, fontSize: 21, whiteSpace: 'nowrap', color: '#4a4f5a', opacity: interpolate(local, [12, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
                ПРЕДПОЛАГАЕМОЕ ВРЕМЯ ДО УДАРА:
              </div>
              <div style={{marginTop: 6, fontFamily: MONO, fontWeight: 800, fontSize: 118, color: C.red, letterSpacing: 2, opacity: interpolate(local, [14, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
                {fmt(remaining)}
              </div>
              <div style={{marginTop: 4, display: 'inline-block', padding: '8px 16px', borderRadius: 14, background: '#14171d', color: C.white, fontWeight: 800, fontSize: 22, letterSpacing: 1}}>
                ПРОЙДИТЕ В УКРЫТИЕ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Субтитры рассказчика, как в референсе: по 2–4 слова, крупно, ключевые слова (*слово*) жёлтым,
 * кадр сменяется вместе с речью (время — по доле символов).
 */
export const NarrationCaption: React.FC<{text: string; f: number; start: number; dur: number; y?: number}> = ({text, f, start, dur, y = 1290}) => {
  const local = f - start;
  if (local < 0 || local > dur + 6) return null;
  // слова с пометкой выделения
  let hl = false;
  const words = text.split(/\s+/).filter(Boolean).map((w) => {
    if (w.startsWith('*') || w.startsWith('«*')) hl = true;
    const res = {w: w.replace(/\*/g, ''), hl};
    if (/\*[.,!?…:;»—]*$/.test(w)) hl = false;
    return res;
  });
  // группы по 2–4 слова, не длиннее ~22 символов, разрыв после точки
  const groups: (typeof words)[] = [];
  let g: typeof words = [];
  for (const w of words) {
    const len = g.reduce((a, x) => a + x.w.length + 1, 0) + w.w.length;
    if (g.length && (len > 22 || g.length >= 4)) { groups.push(g); g = []; }
    g.push(w);
    if (/[.!?»…]$/.test(w.w) && g.length >= 2) { groups.push(g); g = []; }
  }
  if (g.length) groups.push(g);
  const total = groups.reduce((a, x) => a + x.reduce((b, y) => b + y.w.length + 1, 0), 0);
  let acc = 0;
  let idx = groups.length - 1;
  let gStart = 0;
  for (let i = 0; i < groups.length; i++) {
    const l = groups[i].reduce((b, y) => b + y.w.length + 1, 0);
    const t0 = (acc / total) * dur;
    acc += l;
    if (local < (acc / total) * dur) { idx = i; gStart = t0; break; }
    gStart = t0;
  }
  const k = Math.min(1, (local - gStart) / 4);
  const out = local > dur ? 1 - (local - dur) / 6 : 1;
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: y, textAlign: 'center', opacity: out, transform: `scale(${0.94 + 0.06 * k})`}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 76, lineHeight: 1.1, textTransform: 'uppercase', color: C.white, textShadow: '0 4px 20px rgba(0,0,0,0.7)', opacity: 0.4 + 0.6 * k}}>
        {groups[idx].map((w, i) => (
          <span key={i} style={{color: w.hl ? C.warm : C.white}}>{w.w}{i < groups[idx].length - 1 ? ' ' : ''}</span>
        ))}
      </div>
    </div>
  );
};

/** Только виньетка, без зерна (зерно с overlay-смешиванием вдвое замедляет рендер). */
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 85% 70% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
);
