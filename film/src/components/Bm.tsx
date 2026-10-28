import React from 'react';
import {interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {easeOut, ramp, rand} from '../util';

/** «Бабушкины 2 миллиона»: городские декорации, ларёк, счётчик денег, бумажки. */
export const B = {
  ground: 1500,
  asphalt: '#2a2e36',
  walk: '#5a5f68',
  red: '#c8302a',
  meat: '#a8622e',
  meatHi: '#c98a4a',
  lavash: '#e8d2a0',
  steel: '#9aa3ad',
};

export const rub = (n: number) => `${Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ').replace(/ /g, ' ')} ₽`;

/** Счётчик денег в углу кадра: «НА СЧЁТЕ 2 000 000 ₽». delta — последний сдвиг (цвет). */
export const MoneyCounter: React.FC<{value: number; trend: number; opacity?: number; label?: string}> = ({value, trend, opacity = 1, label = 'НА СЧЁТЕ'}) => (
  <div style={{position: 'absolute', right: 40, top: 64, opacity, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 40, background: 'rgba(5,7,12,0.6)', fontFamily: MONO, fontWeight: 800, fontSize: 34, color: trend < 0 ? '#ff6a5a' : trend > 0 ? '#5ad08a' : C.white}}>
    <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 22, color: C.grey, letterSpacing: 1.5}}>{label}</span>
    <span>{rub(value)}</span>
  </div>
);

/** Дневное небо (k — вечер). */
export const DaySky: React.FC<{dusk?: number; night?: number}> = ({dusk = 0, night = 0}) => (
  <g>
    <defs>
      <linearGradient id="bmDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6d93bf" /><stop offset="1" stopColor="#cfd8de" /></linearGradient>
      <linearGradient id="bmDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2e3656" /><stop offset="1" stopColor="#d08a6a" /></linearGradient>
    </defs>
    <rect x={-3000} y={-2000} width={8000} height={4000} fill="url(#bmDay)" />
    <rect x={-3000} y={-2000} width={8000} height={4000} fill="url(#bmDusk)" opacity={dusk} />
    <rect x={-3000} y={-2000} width={8000} height={4000} fill="#070a14" opacity={night * 0.92} />
    {night > 0.5 && Array.from({length: 60}).map((_, i) => <circle key={i} cx={rand(i) * 3000 - 900} cy={rand(i + 9) * 900 - 200} r={1 + rand(i + 3)} fill="#dfe6f5" opacity={0.6} />)}
  </g>
);

/** Простой дом с окнами (низ — B.ground). */
export const Block: React.FC<{x: number; w: number; h: number; color: string; lit?: number; sign?: string; signColor?: string}> = ({x, w, h, color, lit = 0, sign, signColor = '#1d2129'}) => {
  const top = B.ground - h;
  const cols = Math.max(1, Math.floor((w - 40) / 90));
  const rows = Math.max(1, Math.floor((h - 60) / 110));
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={color} />
      {Array.from({length: rows}).map((_, r) => Array.from({length: cols}).map((__, c) => {
        const on = rand(r * 13 + c + x) < lit;
        return <rect key={`${r}-${c}`} x={x + 30 + c * ((w - 60) / cols)} y={top + 40 + r * 110} width={(w - 60) / cols - 30} height={64} fill={on ? C.warm : '#1e2633'} opacity={on ? 0.85 : 1} />;
      }))}
      {sign && (
        <g>
          <rect x={x + 20} y={B.ground - 210} width={w - 40} height={56} rx={6} fill={signColor} />
          <text x={x + w / 2} y={B.ground - 172} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill="#fff">{sign}</text>
        </g>
      )}
    </g>
  );
};

/** Улица: тротуар, дорога, разметка. */
export const Street: React.FC<{y?: number}> = ({y = B.ground}) => (
  <g>
    <rect x={-3000} y={y} width={8000} height={60} fill={B.walk} />
    <rect x={-3000} y={y + 60} width={8000} height={260} fill={B.asphalt} />
    {Array.from({length: 40}).map((_, i) => <rect key={i} x={-3000 + i * 200} y={y + 186} width={110} height={8} fill="#c9c3b2" opacity={0.7} />)}
    <rect x={-3000} y={y + 320} width={8000} height={1200} fill={B.walk} />
  </g>
);

/** Ларёк-павильон снаружи. name — вывеска, price — цена на баннере, closed — табличка. */
export const Kiosk: React.FC<{x: number; f: number; name: string; color?: string; price?: string; open?: boolean; balloons?: number; queue?: number; dark?: number; seal?: boolean}> = ({x, f, name, color = '#e8d2a0', price, open = true, balloons = 0, queue = 0, dark = 0, seal}) => {
  const y = B.ground;
  return (
    <g>
      <rect x={x - 220} y={y - 360} width={440} height={360} fill={color} />
      <rect x={x - 240} y={y - 420} width={480} height={70} rx={8} fill={color === B.red ? '#8a1e1a' : '#3a2e25'} />
      <text x={x} y={y - 372} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={name.length > 12 ? 30 : 38} fill={color === B.red ? '#ffd24a' : C.warm}>{name}</text>
      {/* окно выдачи */}
      <rect x={x - 170} y={y - 300} width={240} height={150} fill={dark ? '#14171d' : '#ffe6b0'} opacity={0.95} />
      <rect x={x - 180} y={y - 150} width={260} height={16} fill="#6a5a46" />
      {!dark && (
        <g>
          <path d={`M${x - 120} ${y - 280} L${x - 100} ${y - 170} L${x - 80} ${y - 280} Z`} fill={B.meat} />
          <rect x={x - 102} y={y - 290} width={4} height={140} fill={B.steel} />
        </g>
      )}
      {/* дверь */}
      <rect x={x + 100} y={y - 280} width={90} height={280} fill="#4a4f58" />
      <rect x={x + 112} y={y - 200} width={66} height={30} rx={4} fill={open ? '#3aa25a' : C.red} />
      <text x={x + 145} y={y - 179} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={15} fill="#fff">{open ? 'ОТКРЫТО' : 'ЗАКРЫТО'}</text>
      {seal && <g transform={`translate(${x + 145} ${y - 120}) rotate(-12)`}><rect x={-70} y={-24} width={140} height={48} fill="#f2f2ee" /><text x={0} y={6} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={16} fill={C.red}>ОПЕЧАТАНО</text></g>}
      {price && (
        <g transform={`translate(${x - 50} ${y - 470}) rotate(-3)`}>
          <rect x={-170} y={-80} width={340} height={80} rx={10} fill="#ffd24a" />
          <text x={0} y={-24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={B.red}>{price}</text>
        </g>
      )}
      {balloons > 0 && [0, 1, 2].map((i) => (
        <g key={i} opacity={balloons}>
          <path d={`M${x - 240 + i * 14} ${y - 330} q${Math.sin(f / 20 + i) * 10} -60 ${-10 + i * 12} -110`} stroke="#888" strokeWidth={2} fill="none" />
          <ellipse cx={x - 250 + i * 26} cy={y - 460 + Math.sin(f / 15 + i) * 5} rx={22} ry={28} fill={[C.red, C.warm, '#4f8fbf'][i]} />
        </g>
      ))}
      {dark > 0 && <rect x={x - 240} y={y - 420} width={480} height={420} fill="#05070e" opacity={dark * 0.5} />}
    </g>
  );
};

/** Вертел с мясом (крупно), вращается. */
export const Spit: React.FC<{x: number; y: number; f: number; s?: number}> = ({x, y, f, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-6} y={-330} width={12} height={360} fill={B.steel} />
    <path d="M-70 -300 Q-80 -150 -50 0 L50 0 Q80 -150 70 -300 Z" fill={B.meat} />
    {Array.from({length: 7}).map((_, i) => <path key={i} d={`M${-70 + ((f * 2 + i * 22) % 140)} -290 q6 140 2 280`} stroke={B.meatHi} strokeWidth={6} fill="none" opacity={0.6} />)}
    <rect x={90} y={-320} width={40} height={320} rx={8} fill="#c85a2a" opacity={0.6 + 0.3 * Math.sin(f / 4)} />
  </g>
);

/** Бумажный лист/тетрадь крупно с рукописным текстом. */
export const PaperCloseup: React.FC<{t: number; lines: string[]; title?: string; tilt?: number; kind?: 'note' | 'notebook' | 'tally'; tally?: number}> = ({t, lines, title, tilt = -3, kind = 'note', tally = 0}) => {
  const a = easeOut(ramp(t, 0, 12));
  const W = kind === 'note' ? 640 : 760;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute'}}>
      <rect width={1080} height={1920} fill="#07080b" opacity={0.92} />
      <g transform={`translate(540 760) rotate(${tilt}) scale(${0.92 + 0.08 * a + t / 1800}) translate(-540 -760)`} opacity={a}>
        <rect x={540 - W / 2} y={380} width={W} height={kind === 'note' ? 420 : 760} fill={kind === 'notebook' ? '#e9ecf2' : '#ece6d4'} />
        {kind !== 'note' && Array.from({length: 22}).map((_, i) => <rect key={i} x={540 - W / 2} y={420 + i * 34} width={W} height={2} fill="#b8c4d8" />)}
        {kind === 'notebook' && <rect x={540 - W / 2 + 70} y={380} width={3} height={760} fill="#d88a8a" />}
        {title && <text x={540} y={450} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontStyle="italic" fontSize={44} fill="#2a2e45">{title}</text>}
        {lines.map((l, i) => (
          <text key={i} x={540 - W / 2 + 90} y={(title ? 540 : 480) + i * 74} fontFamily={FONT} fontWeight={700} fontStyle="italic" fontSize={40} fill="#2a2e45" opacity={ramp(t, 8 + i * 12, 18 + i * 12)}>{l}</text>
        ))}
        {kind === 'tally' && Array.from({length: Math.floor(tally)}).map((_, i) => {
          const g = Math.floor(i / 5);
          const k = i % 5;
          const gx = 540 - W / 2 + 60 + (g % 9) * 76;
          const gy = 480 + Math.floor(g / 9) * 70;
          return k < 4 ? <path key={i} d={`M${gx + k * 12} ${gy} v44`} stroke="#2a2e45" strokeWidth={4} /> : <path key={i} d={`M${gx - 6} ${gy + 34} L${gx + 46} ${gy + 8}`} stroke="#2a2e45" strokeWidth={4} />;
        })}
      </g>
    </svg>
  );
};

/** Экран телефона (банк / объявление / звонок / видео). */
export const BankScreen: React.FC<{value: number; items?: [string, number][]; t: number}> = ({value, items = [], t}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#14261e,#0b100d)', fontFamily: FONT, color: C.white}}>
    <div style={{position: 'absolute', top: 90, left: 40, fontWeight: 800, fontSize: 24, color: C.grey}}>Счёт ••4417</div>
    <div style={{position: 'absolute', top: 130, left: 40, fontFamily: MONO, fontWeight: 800, fontSize: 64}}>{rub(value)}</div>
    <div style={{position: 'absolute', top: 260, left: 30, right: 30}}>
      {items.map(([n, v], i) => (
        <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '18px 14px', borderBottom: '1px solid #2a3a32', opacity: ramp(t, i * 10, i * 10 + 8), fontWeight: 800, fontSize: 26}}>
          <span>{n}</span><span style={{color: v < 0 ? '#ff6a5a' : '#5ad08a', fontFamily: MONO}}>{v < 0 ? '−' : '+'}{rub(Math.abs(v))}</span>
        </div>
      ))}
    </div>
  </div>
);

export const AdScreen: React.FC<{t: number; publish: number}> = ({t, publish}) => (
  <div style={{position: 'absolute', inset: 0, background: '#f2f2ee', fontFamily: FONT, color: '#14171d'}}>
    <div style={{position: 'absolute', top: 80, left: 30, right: 30, fontWeight: 900, fontSize: 30}}>Новое объявление</div>
    <div style={{position: 'absolute', top: 150, left: 30, right: 30, padding: 20, borderRadius: 18, background: '#fff', fontWeight: 800, fontSize: 34, lineHeight: 1.2}}>
      {'Продаётся готовый бизнес. Шаурмичная. Недорого.'.slice(0, Math.floor(t * 1.4))}
      <span style={{opacity: Math.floor(t / 6) % 2 ? 1 : 0}}>|</span>
    </div>
    <div style={{position: 'absolute', bottom: 120, left: 40, right: 40, padding: '26px 0', borderRadius: 24, background: '#3aa25a', color: '#fff', textAlign: 'center', fontWeight: 900, fontSize: 32, transform: `scale(${1 + publish * 0.04})`}}>Опубликовать</div>
  </div>
);

export const CallScreen2: React.FC<{name: string; t: number}> = ({name, t}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#1a1f2b,#0c0e14)', fontFamily: FONT, color: C.white}}>
    <div style={{position: 'absolute', top: 180, width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 26, color: C.grey}}>входящий вызов</div>
    <div style={{position: 'absolute', top: 260, left: '50%', transform: `translateX(-50%) scale(${1 + 0.05 * Math.sin(t / 5)})`, width: 200, height: 200, borderRadius: 100, background: '#6b2f38', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 90}}>М</div>
    <div style={{position: 'absolute', top: 500, width: '100%', textAlign: 'center', fontWeight: 900, fontSize: 64}}>{name}</div>
    <div style={{position: 'absolute', bottom: 110, left: 70, right: 70, display: 'flex', justifyContent: 'space-between'}}>
      <div style={{width: 130, height: 130, borderRadius: 65, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56}}>✕</div>
      <div style={{width: 130, height: 130, borderRadius: 65, background: '#3aa25a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56}}>✆</div>
    </div>
  </div>
);

export const ViralScreen: React.FC<{t: number; views: number}> = ({t, views}) => (
  <div style={{position: 'absolute', inset: 0, background: '#000', fontFamily: FONT, color: C.white}}>
    <div style={{position: 'absolute', top: 160, left: 20, right: 20, height: 560, borderRadius: 20, background: 'linear-gradient(90deg,#c8302a 0 50%,#e8d2a0 50% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontWeight: 900, fontSize: 60}}>
      <span>99 ₽</span><span style={{fontSize: 40}}>vs</span><span style={{color: '#3a2e25'}}>280 ₽</span>
    </div>
    <div style={{position: 'absolute', top: 760, left: 30, right: 30, fontWeight: 800, fontSize: 30}}>Шаурма за 99 против шаурмы за 280. Честно.</div>
    <div style={{position: 'absolute', top: 860, left: 30, fontFamily: MONO, fontWeight: 800, fontSize: 52, color: C.warm}}>▶ {Math.round(views).toLocaleString('ru-RU').replace(/,/g, ' ')}</div>
    <div style={{position: 'absolute', top: 940, left: 30, fontWeight: 700, fontSize: 24, color: C.grey}}>просмотров</div>
    <div style={{position: 'absolute', right: 30, top: 600, fontSize: 60, transform: `scale(${1 + 0.15 * Math.abs(Math.sin(t / 6))})`}}>❤</div>
  </div>
);

/** Камера наблюдения: касса, Лена отменяет чек. */
export const CctvShop: React.FC<{t: number; children?: React.ReactNode}> = ({t, children}) => (
  <svg viewBox="0 0 1000 760" width={1000} height={760} style={{display: 'block'}}>
    <defs><filter id="cctvG"><feColorMatrix type="matrix" values="0.25 0.5 0.1 0 0.02  0.3 0.6 0.12 0 0.05  0.25 0.5 0.1 0 0.03  0 0 0 1 0" /></filter></defs>
    <g filter="url(#cctvG)">{children}</g>
    <text x={30} y={50} fontFamily={MONO} fontWeight={800} fontSize={30} fill="#e6f0e8" opacity={0.85}>CAM 01 · КАССА</text>
    <circle cx={890} cy={40} r={10} fill={C.red} opacity={Math.floor(t / 15) % 2 ? 1 : 0.2} />
    <text x={910} y={50} fontFamily={MONO} fontWeight={800} fontSize={30} fill="#e6f0e8">REC</text>
  </svg>
);

/** Визитка на прилавке. */
export const BizCard: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-6)`}>
    <rect x={-120} y={-70} width={240} height={140} rx={8} fill="#14171d" />
    <rect x={-100} y={-40} width={120} height={8} fill={C.warm} />
    <rect x={-100} y={-20} width={180} height={5} fill="#5a606a" />
    <rect x={-100} y={-6} width={140} height={5} fill="#5a606a" />
    <text x={70} y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={18} fill={C.warm}>FOOD GROUP</text>
  </g>
);

/** Фото бабушки в рамке. */
export const GrannyPhoto: React.FC<{x: number; y: number; s?: number; children?: React.ReactNode}> = ({x, y, s = 1, children}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-140} width={220} height={280} fill="#5a4030" />
    <rect x={-92} y={-122} width={184} height={244} fill="#cfc4ae" />
    <clipPath id={`gp${x}${y}`}><rect x={-92} y={-122} width={184} height={244} /></clipPath>
    <g clipPath={`url(#gp${x}${y})`}>{children}</g>
  </g>
);

export const lerp = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
