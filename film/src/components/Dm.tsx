import React from 'react';
import {C, FONT, MONO} from '../theme';
import {easeOut, ramp, rand} from '../util';

/**
 * «Девять минут»: побережье. Мир: земля y=1900, этаж 160 px.
 * Гостиница (5 эт.) x 120…620, соседний дом (9 эт.) x 760…1300. Море справа за x>1400 (вид с суши) —
 * на общих планах пляж рисуется отдельно (Beach).
 */
export const G = {ground: 1900, fl: 160, hotel: {x: 120, w: 500, floors: 5}, tower: {x: 760, w: 540, floors: 9}};
export const roofY = (floors: number) => G.ground - floors * G.fl;

export const D = {
  sea: '#1f4a63',
  seaHi: '#2f6a86',
  foam: '#dfeef2',
  mud: '#3a3328',
  mudWet: '#2a2620',
  sand: '#c9a873',
  sandDark: '#a88a5a',
  flood: '#3a4a3e',
  floodHi: '#4e6252',
};

/** Небо: день (golden) → тревожное (k) → ночь (night). */
export const CoastSky: React.FC<{k?: number; night?: number; dawn?: number}> = ({k = 0, night = 0, dawn = 0}) => (
  <g>
    <defs>
      <linearGradient id="dayGold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5f86b0" />
        <stop offset="0.7" stopColor="#c9b48a" />
        <stop offset="1" stopColor="#e8c890" />
      </linearGradient>
      <linearGradient id="dayGrim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a3240" />
        <stop offset="1" stopColor="#6a6658" />
      </linearGradient>
      <linearGradient id="dawnSea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a5a80" />
        <stop offset="0.75" stopColor="#e0b090" />
        <stop offset="1" stopColor="#f0d0a0" />
      </linearGradient>
    </defs>
    <rect x={-2000} y={-1500} width={6000} height={3500} fill="url(#dayGold)" />
    <rect x={-2000} y={-1500} width={6000} height={3500} fill="url(#dayGrim)" opacity={k} />
    <rect x={-2000} y={-1500} width={6000} height={3500} fill="url(#dawnSea)" opacity={dawn} />
    <rect x={-2000} y={-1500} width={6000} height={3500} fill="#070a14" opacity={night} />
    {night > 0.5 && Array.from({length: 90}).map((_, i) => <circle key={i} cx={rand(i) * 3000 - 900} cy={rand(i + 40) * 1200 - 300} r={1 + rand(i + 3)} fill="#dfe6f5" opacity={0.6 * night} />)}
  </g>
);

/**
 * Пляж: суша внизу (y ≥ land), море уходит вглубь к горизонту. recede 0..1 — насколько отступило
 * (линия воды поднимается к горизонту, открывая дно); wall 0..1 — стена волны растёт и идёт к берегу.
 */
export const Beach: React.FC<{f: number; recede: number; wall?: number; horizon?: number; calm?: boolean; sand?: boolean}> = ({f, recede, wall = 0, horizon = 1000, calm, sand = true}) => {
  const land = 1300;
  const shoreY = land - recede * (land - horizon) * 0.75;
  const wBase = horizon + wall * (land - horizon); // основание волны идёт от горизонта к берегу
  const wh = 30 + wall * 520;
  return (
    <g>
      <rect x={-2000} y={horizon} width={7000} height={shoreY - horizon} fill={D.sea} />
      {Array.from({length: 24}).map((_, i) => {
        const y = horizon + 14 + (i % 8) * ((shoreY - horizon) / 8);
        return y < shoreY - 6 ? <rect key={i} x={-1500 + ((i * 260 + f * (calm ? 0.6 : 1.2)) % 4600)} y={y} width={120 + (i % 3) * 40} height={4} fill={D.seaHi} opacity={0.7} /> : null;
      })}
      {/* открывшееся дно */}
      <rect x={-2000} y={shoreY} width={7000} height={land - shoreY + 2} fill={D.mud} />
      {recede > 0.05 && Array.from({length: 40}).map((_, i) => {
        const x = rand(i) * 3600 - 1000;
        const y = shoreY + 10 + rand(i + 4) * (land - shoreY - 20);
        const sc = 0.5 + (y - horizon) / (land - horizon);
        const fish = rand(i + 9) > 0.78;
        return fish ? (
          <path key={i} transform={`translate(${x} ${y}) scale(${sc})`} d={`M0 0 q12 ${-6 - Math.sin(f / 3 + i) * 5} 24 0 l8 -6 v12 l-8 -6 q-12 6 -24 0 Z`} fill="#b8c4cc" />
        ) : (
          <ellipse key={i} cx={x} cy={y} rx={(8 + rand(i + 2) * 18) * sc} ry={(4 + rand(i + 5) * 6) * sc} fill={rand(i + 7) > 0.5 ? '#4a4a40' : '#2f4a30'} />
        );
      })}
      <path d={Array.from({length: 50}).map((_, i) => `${i ? 'L' : 'M'}${-1500 + i * 100} ${shoreY + Math.sin(i + f / 6) * 3}`).join(' ')} stroke={D.foam} strokeWidth={4} fill="none" opacity={0.8} />
      {sand ? <rect x={-2000} y={land} width={7000} height={1400} fill={D.sand} /> : <rect x={-2000} y={land} width={7000} height={1400} fill={D.sea} />}
      {/* стена волны */}
      {wall > 0 && (
        <g>
          <path d={`M-2000 ${wBase} L-2000 ${wBase - wh} ${Array.from({length: 30}).map((_, i) => `L${-2000 + i * 240} ${wBase - wh + Math.sin(i * 1.3 + f / 5) * 16}`).join(' ')} L5000 ${wBase - wh} L5000 ${wBase} Z`} fill="#22465c" />
          <path d={Array.from({length: 30}).map((_, i) => `${i ? 'L' : 'M'}${-2000 + i * 240} ${wBase - wh + Math.sin(i * 1.3 + f / 5) * 16}`).join(' ')} stroke={D.foam} strokeWidth={10 + wall * 14} fill="none" />
          {Array.from({length: 30}).map((_, i) => <circle key={i} cx={rand(i) * 3600 - 1000} cy={wBase - wh + rand(i + 3) * 40} r={6 + rand(i + 5) * 12 * (1 + wall)} fill={D.foam} opacity={0.6} />)}
        </g>
      )}
    </g>
  );
};

/** Набережная: кафе-киоск, зонтики, вышка с громкоговорителем (молчит). */
export const Promenade: React.FC<{f: number; x?: number; y?: number}> = ({f, x = 0, y = 1300}) => (
  <g>
    <g transform={`translate(${x + 300} ${y})`}>
      <rect x={-6} y={-380} width={12} height={380} fill="#3a404b" />
      <path d="M-40 -380 L40 -380 L58 -320 L-58 -320 Z" fill="#4a5060" />
      <rect x={-20} y={-420} width={40} height={40} rx={6} fill="#5a606a" />
      <text x={0} y={-345} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={18} fill={C.red} opacity={Math.floor(f / 20) % 2 ? 1 : 0.3}>OFF</text>
    </g>
    {[520, 640].map((ux, i) => (
      <g key={i} transform={`translate(${x + ux} ${y})`}>
        <rect x={-3} y={-150} width={6} height={150} fill="#5a4a3a" />
        <path d="M-80 -140 Q0 -200 80 -140 Z" fill={i ? '#d85445' : '#e8e4da'} />
      </g>
    ))}
    <g transform={`translate(${x - 200} ${y})`}>
      <rect x={-120} y={-170} width={240} height={170} fill="#c98a36" />
      <rect x={-130} y={-190} width={260} height={30} fill="#a06c2a" />
      <rect x={-90} y={-130} width={180} height={70} fill="#2a2e35" />
      <text x={0} y={-168} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={20} fill="#fff6dc">КУКУРУЗА · ЧАЙ</text>
    </g>
  </g>
);

/** Здание с сеткой окон; sign — вывеска. Возвращает группу, низ — G.ground. */
export const Building: React.FC<{f: number; x: number; w: number; floors: number; color: string; sign?: string; lit?: number; ladder?: number}> = ({f, x, w, floors, color, sign, lit = 0, ladder = -1}) => {
  const top = roofY(floors);
  const cols = Math.floor(w / 100);
  return (
    <g>
      <rect x={x} y={top} width={w} height={floors * G.fl} fill={color} />
      <rect x={x - 10} y={top - 26} width={w + 20} height={26} fill="#3a3f48" />
      {Array.from({length: floors}).map((_, r) =>
        Array.from({length: cols}).map((__, c) => {
          const wx = x + 30 + c * ((w - 60) / cols);
          const wy = top + 40 + r * G.fl;
          const on = rand(r * 7 + c + floors) < lit;
          return <rect key={`${r}-${c}`} x={wx} y={wy} width={(w - 60) / cols - 30} height={80} fill={on ? C.warm : '#1a2230'} opacity={on ? 0.8 : 1} />;
        }),
      )}
      {sign && (
        <g>
          <rect x={x + w / 2 - 170} y={top - 90} width={340} height={56} rx={6} fill="#1d2129" />
          <text x={x + w / 2} y={top - 52} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.warm}>{sign}</text>
        </g>
      )}
      {/* пожарная лестница: от этажа ladder до крыши */}
      {ladder >= 0 && (
        <g stroke="#5a3a2e" strokeWidth={6}>
          <path d={`M${x + 20} ${G.ground - ladder * G.fl} V${top - 30} M${x + 64} ${G.ground - ladder * G.fl} V${top - 30}`} />
          {Array.from({length: Math.floor((G.ground - ladder * G.fl - top + 30) / 26)}).map((_, i) => (
            <path key={i} d={`M${x + 20} ${top - 30 + i * 26} H${x + 64}`} strokeWidth={4} />
          ))}
        </g>
      )}
    </g>
  );
};

/** Вода наводнения до уровня level (y), с волнением и обломками. drift — смещение течения. */
export const Flood: React.FC<{f: number; level: number; drift?: number; debris?: boolean; x0?: number; x1?: number}> = ({f, level, drift = 0, debris = true, x0 = -1500, x1 = 3500}) => (
  <g>
    <rect x={x0} y={level} width={x1 - x0} height={2400} fill={D.flood} opacity={0.96} />
    <path d={Array.from({length: 60}).map((_, i) => `${i ? 'L' : 'M'}${x0 + i * ((x1 - x0) / 59)} ${level + Math.sin(i * 0.9 + f / 7) * 6}`).join(' ')} stroke={D.floodHi} strokeWidth={8} fill="none" />
    {debris && Array.from({length: 16}).map((_, i) => {
      const x = ((rand(i) * 3600 + f * (0.6 + rand(i + 3)) * drift) % 3600) - 900;
      const y = level + 6 + Math.sin(f / 9 + i) * 4;
      const kind = Math.floor(rand(i + 7) * 4);
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${Math.sin(f / 15 + i) * 8})`}>
          {kind === 0 && <rect x={-60} y={-10} width={120} height={14} fill="#6a5a46" />}
          {kind === 1 && <g><rect x={-70} y={-34} width={140} height={34} rx={8} fill="#5a6070" /><rect x={-40} y={-50} width={70} height={18} fill="#2a2e35" /></g>}
          {kind === 2 && <path d="M-50 0 Q0 -40 50 0 Z" fill={rand(i) > 0.5 ? '#d85445' : '#e8e4da'} />}
          {kind === 3 && <rect x={-30} y={-24} width={60} height={24} fill="#c98a36" />}
        </g>
      );
    })}
  </g>
);

/** Кепка: жёлтая (Миши) или рыбацкая (Палыча). */
export const Cap: React.FC<{x: number; y: number; s?: number; kind: 'yellow' | 'fisher'; rot?: number}> = ({x, y, s = 1, kind, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-30 0 C-32 -30 -6 -38 12 -34 C30 -30 34 -14 32 0 Z" fill={kind === 'yellow' ? '#f2c230' : '#3a4a5a'} />
    <path d="M24 -6 L64 -2 Q62 6 38 4 L22 2 Z" fill={kind === 'yellow' ? '#d9a920' : '#2a3644'} />
    {kind === 'fisher' && <rect x={-31} y={-8} width={63} height={6} fill="#2a3644" />}
  </g>
);

/** Плот из двух дверей, связанных шторой. */
export const Raft: React.FC<{x: number; y: number; f: number; s?: number}> = ({x, y, f, s = 1}) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 8) * 4}) rotate(${Math.sin(f / 13) * 2}) scale(${s})`}>
    <rect x={-170} y={-16} width={170} height={22} fill="#7a5a3a" />
    <rect x={0} y={-16} width={170} height={22} fill="#6a4e34" />
    <circle cx={-30} cy={-5} r={4} fill="#c9b458" />
    <path d="M-10 -18 Q0 -26 10 -18 L10 8 Q0 14 -10 8 Z M-110 -18 Q-100 -26 -90 -18 L-90 8 Q-100 14 -110 8 Z M90 -18 Q100 -26 110 -18 L110 8 Q100 14 90 8 Z" fill="#8a3a4a" />
  </g>
);

/** Удочка (целая или сломанная). */
export const Rod: React.FC<{x: number; y: number; ang?: number; broken?: boolean}> = ({x, y, ang = -50, broken}) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`}>
    <rect x={0} y={-3} width={broken ? 110 : 240} height={6} fill="#3a2e25" />
    {broken && <rect x={118} y={-2} width={90} height={4} fill="#3a2e25" transform="rotate(25 118 0)" />}
    <rect x={10} y={-6} width={26} height={12} rx={4} fill="#1a1a1e" />
  </g>
);

/** Табличка «Сирена на техобслуживании». */
export const SirenSign: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-150} y={-60} width={300} height={120} rx={8} fill="#e8e4da" />
    <rect x={-150} y={-60} width={300} height={26} rx={8} fill={C.red} />
    <text x={0} y={-41} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={16} fill="#fff">ВНИМАНИЕ ГОСТЯМ</text>
    <text x={0} y={-4} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={19} fill="#2a2e35">Сирена на техобслуживании.</text>
    <text x={0} y={26} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={17} fill="#4a4f5a">Приносим извинения.</text>
  </g>
);

/** Крупная надпись-таймер серии (до волны). */
export const fmtMS = (sec: number) => {
  const s = Math.max(0, Math.ceil(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

/** Титр серии «Девять минут». */
export const DmCard: React.FC<{f: number; start: number; ep: number; teaser: string; final?: boolean}> = ({f, start, ep, teaser, final}) => {
  const local = f - start;
  const a = easeOut(ramp(local, 0, 14));
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: a, transform: `scale(${0.96 + 0.04 * a})`}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 116, color: C.white, letterSpacing: 2, lineHeight: 1, textAlign: 'center'}}>
        ДЕВЯТЬ <span style={{color: '#4fa3c7'}}>МИНУТ</span>
      </div>
      <div style={{marginTop: 22, padding: '8px 22px', borderRadius: 22, background: C.white, color: '#14171d', fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 3}}>{final ? 'КОНЕЦ' : `СЕРИЯ ${ep} ИЗ 3`}</div>
      <div style={{marginTop: 40, fontFamily: FONT, fontWeight: final ? 700 : 900, fontStyle: final ? 'italic' : 'normal', fontSize: final ? 30 : 40, color: final ? C.grey : C.warm, letterSpacing: final ? 0 : 3, opacity: ramp(local, 16, 28)}}>{teaser}</div>
    </div>
  );
};
