import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Character, Look} from '../components/Character';
import {Chip} from '../components/Overlay';
import {PhoneFrame} from '../components/Phone';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineEl';
import {blink, easeOut, ramp, rand} from '../util';
import {ease01, SVG} from './twkit';

/** «Последняя электричка»: вагон, проход со спинами, платформа «Пустошь». */

const ME: Partial<Look> = {top: '#3d4a5f', topShade: '#2d374a'};
const WALL = '#1b2431';
const SEAT = '#2f4a52';
const SEAT_HI = '#3c5d66';

/** Мерцание ламп вагона: обычно 1, редкие провалы. */
const flick = (f: number, seed = 0, rate = 0.04) => {
  const r = rand(Math.floor(f / 2) + seed * 977);
  return r < rate ? 0.35 + r * 4 : 1;
};

/** Что за окном. */
const WindowView: React.FC<{f: number; kind: 'night' | 'platform'; w: number; h: number; id: string}> = ({f, kind, w, h, id}) => (
  <g>
    <defs><clipPath id={id}><rect x={0} y={0} width={w} height={h} rx={26} /></clipPath></defs>
    <g clipPath={`url(#${id})`}>
      <rect width={w} height={h} fill="#05070c" />
      {kind === 'night' && Array.from({length: 6}).map((_, i) => {
        const x = ((i * 397 + f * 38) % (w + 600)) - 300;
        return <g key={i}>
          <rect x={w - x} y={h * (0.25 + rand(i) * 0.5)} width={140 + rand(i + 3) * 200} height={3} fill={C.lamp} opacity={0.35} />
          <polygon points={`${w - x - 200},${h} ${w - x - 120},${h * 0.35} ${w - x - 40},${h}`} fill="#0b1018" />
        </g>;
      })}
      {kind === 'platform' && (
        <g>
          <rect y={h * 0.72} width={w} height={h * 0.28} fill="#151a22" />
          <rect x={w * 0.62} y={h * 0.12} width={10} height={h * 0.62} fill="#2a2f38" />
          <circle cx={w * 0.62 + 5} cy={h * 0.12} r={16} fill="#fff2c8" />
          <circle cx={w * 0.62 + 5} cy={h * 0.12} r={150} fill="#fff2c8" opacity={0.08} />
          <polygon points={`${w * 0.62 + 5},${h * 0.12} ${w * 0.62 - 140},${h} ${w * 0.62 + 150},${h}`} fill="#fff2c8" opacity={0.06} />
          <rect x={w * 0.12} y={h * 0.32} width={w * 0.38} height={h * 0.16} fill="#e8e4da" />
          <rect x={w * 0.12 + 6} y={h * 0.32 + 6} width={w * 0.38 - 12} height={h * 0.16 - 12} fill="none" stroke="#14171d" strokeWidth={3} />
          <text x={w * 0.31} y={h * 0.42 + 4} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={Math.round(w * 0.055)} fill="#14171d">ПУСТОШЬ</text>
          <rect x={w * 0.2} y={h * 0.48} width={6} height={h * 0.24} fill="#2a2f38" />
          <rect x={w * 0.42} y={h * 0.48} width={6} height={h * 0.24} fill="#2a2f38" />
        </g>
      )}
      <rect width={w} height={h} fill="url(#glass)" opacity={0.5} />
    </g>
    <rect width={w} height={h} rx={26} fill="none" stroke="#3a4656" strokeWidth={14} />
  </g>
);

/** Вагон сбоку: окно, скамья, ты. */
const Side: React.FC<{f: number; kind: 'night' | 'platform'; sleep: number; look?: number; sway?: number; light?: number; who?: 'me' | 'double'}> = ({f, kind, sleep, look = 0, sway = 1, light = 1, who = 'me'}) => {
  const sx = Math.sin(f / 9) * 3 * sway;
  const sy = Math.abs(Math.sin(f / 4.5)) * 2 * sway;
  return (
    <g transform={`translate(${sx} ${sy})`}>
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8fb0d8" stopOpacity={0.18} /><stop offset="0.5" stopColor="#8fb0d8" stopOpacity={0} /><stop offset="1" stopColor="#8fb0d8" stopOpacity={0.1} /></linearGradient>
      </defs>
      <rect x={-200} y={-200} width={1480} height={2400} fill={WALL} />
      <rect x={-200} y={1240} width={1480} height={900} fill="#141a22" />
      <rect x={-200} y={180} width={1480} height={36} fill="#e8f0ff" opacity={0.75 * light} />
      <rect x={-200} y={216} width={1480} height={260} fill="#e8f0ff" opacity={0.05 * light} />
      <g transform="translate(150 430)"><WindowView f={f} kind={kind} w={780} h={460} id={`w${kind}`} /></g>
      {/* скамья */}
      <rect x={60} y={940} width={960} height={190} rx={22} fill={SEAT_HI} />
      <rect x={40} y={1100} width={1000} height={80} rx={16} fill={SEAT} />
      <rect x={80} y={1180} width={30} height={70} fill="#0f141b" />
      <rect x={970} y={1180} width={30} height={70} fill="#0f141b" />
      {/* рюкзак */}
      <rect x={720} y={1000} width={150} height={110} rx={30} fill={who === 'double' ? '#3a2a2a' : '#3a2a2a'} />
      <rect x={745} y={1020} width={100} height={40} rx={12} fill="#2a1d1d" />
      <Character who="mark" x={480} y={1180} size={1.25} facing={-1} frame={f} override={ME}
        pose={{sit: 1, lean: -6 * sleep, headTilt: -22 * sleep, blink: sleep > 0.6 ? 0 : blink(f, 3), look, rim: 0.5 * light, rimColor: '#cfe0ff'}} />
      <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={(1 - light) * 0.7} />
    </g>
  );
};

/** Спина пассажира: плечи + затылок. */
const Back: React.FC<{x: number; y: number; s: number; i: number; scarf?: boolean; face?: number}> = ({x, y, s, i, scarf, face = 0}) => {
  const coats = ['#2a2f3a', '#3a3030', '#2f3a34', '#40384a', '#2a3444', '#4a4036'];
  const hairs = ['#16181d', '#4a3a2a', '#5a5c62', '#2a1d14', '#6a6660', '#1d1410'];
  const hair = hairs[i % 6];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-62 40 Q-60 -18 0 -22 Q60 -18 62 40 Z" fill={coats[i % 6]} />
      <rect x={-12} y={-40} width={24} height={26} fill="#a88a78" />
      {scarf ? (
        <g>
          <ellipse cx={0} cy={-66} rx={36} ry={40} fill="#2c4f9a" />
          <path d="M-36 -60 Q-40 -10 -14 -16 L14 -16 Q40 -10 36 -60" fill="#2c4f9a" />
          {[[-16, -84], [12, -76], [-6, -54], [20, -50], [-22, -40], [4, -30]].map(([a, b], k) => (
            <g key={k}><circle cx={a} cy={b} r={5} fill="#e8e4da" /><circle cx={a} cy={b} r={2} fill="#d9b04a" /></g>
          ))}
        </g>
      ) : (
        <ellipse cx={0} cy={-66} rx={32} ry={36} fill={hair} />
      )}
      {face > 0 && (
        <g opacity={face}>
          <ellipse cx={(1 - face) * 18} cy={-64} rx={28 * (0.6 + 0.4 * face)} ry={34} fill="#cfc9c0" />
          <ellipse cx={-10 + (1 - face) * 18} cy={-70} rx={6} ry={8} fill="#05070c" />
          <ellipse cx={10 + (1 - face) * 18} cy={-70} rx={6} ry={8} fill="#05070c" />
        </g>
      )}
    </g>
  );
};

/** Вагон в перспективе по проходу: ряды, все сидят спиной. go — продвижение по проходу (0..1). */
const Aisle: React.FC<{f: number; go?: number; reveal?: number; light?: number; push?: number}> = ({f, go = 0, reveal = 1, light = 1, push = 0}) => {
  const VX = 540, VY = 720;
  const rows = 9;
  const depth = (k: number) => 1 / (1 + (k - go * 4.5) * 0.42);
  const P = (x: number, y: number, z: number) => [VX + (x - VX) * z, VY + (y - VY) * z];
  const els: React.ReactNode[] = [];
  for (let k = rows - 1; k >= 0; k--) {
    const z = depth(k);
    if (z <= 0 || z > 2.6) continue;
    for (const side of [-1, 1]) {
      for (const seat of [0, 1]) {
        const bx = 540 + side * (230 + seat * 230);
        const [x, y] = P(bx, 1250, z);
        const i = k * 4 + (side + 1) + seat;
        const scarf = k === 2 && side === -1 && seat === 0;
        els.push(<g key={`${k}${side}${seat}`} opacity={reveal}><Back x={x} y={y - 230 * z} s={z * 1.55} i={i} scarf={scarf} /></g>);
      }
      const [sx, sy] = P(540 + side * 460, 1250, z);
      els.push(<rect key={`s${k}${side}`} x={sx - 240 * z} y={sy - 210 * z} width={480 * z} height={130 * z} rx={18 * z} fill={SEAT_HI} opacity={0.95} />);
    }
  }
  const [lx0, ly0] = P(0, 0, 2.5);
  return (
    <g transform={`translate(540 860) scale(${1 + push * 0.25}) translate(-540 -860)`}>
      <rect x={-200} y={-200} width={1480} height={2400} fill="#0d121a" />
      <polygon points={`${VX - 60},${VY + 60} ${VX + 60},${VY + 60} 1400,2100 -320,2100`} fill="#151b24" />
      <polygon points={`${VX - 60},${VY - 80} ${VX + 60},${VY - 80} 1400,-300 -320,-300`} fill="#18202c" />
      {Array.from({length: 7}).map((_, k) => {
        const z = 1 / (1 + (k - (go * 4.5) % 1) * 0.42);
        const [a, b] = P(540, 120, z);
        return <rect key={k} x={a - 60 * z} y={b} width={120 * z} height={22 * z} fill="#e8f0ff" opacity={0.85 * light * flick(f, k)} />;
      })}
      {[-1, 1].map((side) => Array.from({length: 6}).map((_, k) => {
        const z = 1 / (1 + (k + 0.4 - (go * 4.5) % 1) * 0.42);
        const [a, b] = P(540 + side * 560, 420, z);
        return <rect key={`${side}${k}`} x={side > 0 ? a : a - 120 * z} y={b} width={120 * z} height={260 * z} fill="#05070c" stroke="#2a3444" strokeWidth={6 * z} />;
      }))}
      {els}
      <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={(1 - light) * 0.75} />
      <circle cx={lx0} cy={ly0} r={1} fill="none" />
    </g>
  );
};

/** Динамик под потолком. */
const Speaker: React.FC<{f: number; on: number}> = ({f, on}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#10151d" />
    <rect x={-200} y={-200} width={1480} height={700} fill="#18202c" />
    <rect x={240} y={420} width={600} height={360} rx={40} fill="#2a3240" />
    <rect x={270} y={450} width={540} height={300} rx={26} fill="#1a1f28" />
    {Array.from({length: 9}).map((_, r) => Array.from({length: 16}).map((__, c) => (
      <circle key={`${r}-${c}`} cx={300 + c * 32} cy={475 + r * 32} r={8} fill="#05070c" />
    )))}
    <circle cx={540} cy={600} r={260} fill={C.red} opacity={on * (0.06 + 0.05 * Math.abs(Math.sin(f / 3)))} />
    <circle cx={800} cy={460} r={10} fill={on > 0.5 ? C.redHot : '#3a2020'} />
  </g>
);

/** Схема линии: «Пустоши» на ней нет. */
const RouteMap: React.FC<{f: number; t: number}> = ({f, t}) => {
  const st = ['Москва-Курская', 'Серп и Молот', 'Карачарово', 'Чухлинка', 'Кусково', 'Новогиреево', 'Реутово', 'Никольское'];
  const gap = 4;
  return (
    <g>
      <rect x={-200} y={-200} width={1480} height={2400} fill="#0e1218" />
      <rect x={120} y={260} width={840} height={1100} rx={20} fill="#e8e4da" />
      <text x={540} y={340} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#14171d">СХЕМА ЛИНИИ</text>
      <rect x={300} y={400} width={14} height={900} fill="#c8302a" />
      {st.map((s, i) => {
        const y = 420 + i * 118 + (i >= gap ? 0 : 0);
        return <g key={s}><circle cx={307} cy={y} r={22} fill="#e8e4da" stroke="#c8302a" strokeWidth={10} /><text x={360} y={y + 12} fontFamily={FONT} fontWeight={800} fontSize={36} fill="#14171d">{s}</text></g>;
      })}
      <g opacity={ramp(t, 40, 52) * (Math.floor(f / 8) % 2 ? 1 : 0.6)}>
        <circle cx={307} cy={420 + gap * 118 - 59} r={26} fill={C.redHot} />
        <text x={307} y={420 + gap * 118 - 47} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">?</text>
        <text x={360} y={420 + gap * 118 - 47} fontFamily={FONT} fontWeight={900} fontSize={34} fill={C.redHot}>ПУСТОШЬ — НЕТ НА СХЕМЕ</text>
      </g>
    </g>
  );
};

/** Экран блокировки: 00:41, нет сети. */
const LockScreen: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#141a26,#07090e)'}}>
    <div style={{position: 'absolute', top: 70, left: 40, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.red}}>Нет сети ✕</div>
    <div style={{position: 'absolute', top: 200, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 150, color: C.white}}>00:41</div>
    <div style={{position: 'absolute', top: 390, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.grey}}>четверг, 30 октября</div>
    <div style={{position: 'absolute', top: 520, left: 40, right: 40, borderRadius: 26, background: 'rgba(242,242,238,0.1)', padding: 24, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.grey, opacity: Math.floor(f / 15) % 2 ? 1 : 0.4}}>Поиск сети…</div>
  </div>
);

/** Сообщение от мамы. */
const MomScreen: React.FC<{f: number; start: number}> = ({f, start}) => {
  const text = 'Ты где?! Почему не берёшь? По новостям — про твою электричку…';
  const local = f - start;
  const n = Math.floor(interpolate(local, [10, 10 + text.length * 1.1], [0, text.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const pop = easeOut(ramp(local, 0, 12));
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#141a26,#07090e)'}}>
      <div style={{position: 'absolute', top: 70, left: 40, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.grey}}>▂▄▆ 1 сеть</div>
      <div style={{position: 'absolute', top: 160, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 120, color: 'rgba(255,255,255,0.25)'}}>00:43</div>
      <div style={{position: 'absolute', left: 26, right: 26, top: 340, opacity: pop, transform: `translateY(${(1 - pop) * -30}px)`, borderRadius: 30, background: 'rgba(242,242,238,0.96)', padding: '24px 28px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 64, height: 64, borderRadius: 32, background: '#6b4a5a', color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>М</div>
          <div style={{fontFamily: FONT, color: '#14171d'}}><div style={{fontWeight: 900, fontSize: 30}}>Мама</div><div style={{fontWeight: 700, fontSize: 20, color: C.red}}>14 пропущенных</div></div>
        </div>
        <div style={{marginTop: 22, fontFamily: FONT, fontWeight: 900, fontSize: 42, lineHeight: 1.15, color: '#14171d', minHeight: 150}}>{text.slice(0, n)}</div>
      </div>
    </div>
  );
};

/** Поезд у платформы снаружи; dx — сдвиг (уезжает вправо). */
const Outside: React.FC<{f: number; dx: number; turn: number; close: number}> = ({f, dx, turn, close}) => {
  const s = 1 + close * 1.4;
  const cx = 540 + close * 180;
  return (
    <g transform={`translate(${cx} 900) scale(${s}) translate(-540 -900)`}>
      <rect x={-600} y={-600} width={2400} height={3000} fill="#05070c" />
      <circle cx={180} cy={240} r={240} fill="#fff2c8" opacity={0.05} />
      <g transform={`translate(${dx} 0)`}>
        {[0, 1].map((car) => {
          const x0 = -1300 + car * 1320;
          return (
            <g key={car}>
              <rect x={x0} y={560} width={1300} height={560} rx={30} fill="#5a6a5a" />
              <rect x={x0} y={1000} width={1300} height={40} fill="#c8302a" />
              {[0, 1, 2, 3].map((w) => {
                const wx = x0 + 70 + w * 300;
                const last = car === 1;
                return (
                  <g key={w}>
                    <rect x={wx} y={640} width={250} height={250} rx={18} fill={last ? '#cfd9e8' : '#9fb0c4'} opacity={last ? 0.85 : 0.5} />
                    {last && w < 3 && [0, 1].map((h) => <Back key={h} x={wx + 70 + h * 110} y={880} s={0.95} i={w * 2 + h + 3} face={turn} />)}
                    {last && w === 3 && (
                      <g>
                        <ellipse cx={wx + 120} cy={800} rx={36} ry={40} fill="#c29479" />
                        <path d={`M${wx + 84} 790 q36 -60 74 0`} fill="#171a21" />
                        <path d={`M${wx + 104} 808 l12 0 M${wx + 128} 808 l12 0`} stroke="#14171d" strokeWidth={4} />
                        <path d={`M${wx + 60} 890 Q${wx + 120} 820 ${wx + 180} 890 Z`} fill="#3d4a5f" />
                      </g>
                    )}
                  </g>
                );
              })}
              <rect x={x0} y={1120} width={1300} height={30} fill="#1a1d22" />
            </g>
          );
        })}
      </g>
      <rect x={-600} y={1150} width={2400} height={1200} fill="#151a22" />
      <rect x={-600} y={1150} width={2400} height={14} fill="#d9b04a" opacity={0.6} />
      <rect x={160} y={300} width={10} height={860} fill="#2a2f38" />
      <circle cx={165} cy={300} r={18} fill="#fff2c8" />
      <Character who="mark" x={330} y={1560} size={1.3} facing={1} frame={f} override={ME} pose={{blink: blink(f, 9), look: 0.6, brow: 0.8, rim: 0.4, rimColor: '#fff2c8', armF: [10, 10]}} />
    </g>
  );
};

export const SceneEl: React.FC<{f: number}> = ({f}) => {
  const m = (k: string) => mk(k);
  const RIDE = m('ride'), SL = m('sleep'), DK = m('dark'), WA = m('wake'), SI = m('sign'), MP = m('map'), PH = m('phone');
  const FU = m('full'), BA = m('backs'), CH = m('chime'), ST = m('still'), SC = m('scarf'), GR = m('grave'), WK = m('walk'), NB = m('nobreath');
  const LA = m('last'), MEk = m('me'), DO = m('doors'), EX = m('exit'), DE = m('depart'), TU = m('turn'), VI = m('vibe'), SM = m('sms'), BL = m('black'), TI = m('title');
  let scene: React.ReactNode = null;
  if (f < RIDE + 90) {
    // поезд в ночи снаружи
    const x = interpolate(f, [0, RIDE + 90], [-1500, 600]);
    scene = (
      <g>
        <rect x={-200} y={-200} width={1480} height={2400} fill="#05070c" />
        {Array.from({length: 14}).map((_, i) => <polygon key={i} points={`${i * 90 - 60},1000 ${i * 90 - 10},${640 - rand(i) * 200} ${i * 90 + 40},1000`} fill="#0b1018" />)}
        <g transform={`translate(${x} 0)`}>
          {[0, 1, 2].map((c) => <g key={c}><rect x={c * 820} y={980} width={800} height={260} rx={20} fill="#3a463a" />{[0, 1, 2, 3, 4].map((w) => <rect key={w} x={c * 820 + 40 + w * 150} y={1020} width={110} height={90} rx={10} fill={C.lamp} opacity={c === 1 && w === 2 ? 0.95 : 0.55} />)}</g>)}
          <rect x={2460} y={1000} width={30} height={30} fill="#fff2c8" />
        </g>
        <rect x={-200} y={1250} width={1480} height={20} fill="#2a2f38" />
        <rect x={-200} y={1270} width={1480} height={800} fill="#07090e" />
      </g>
    );
  } else if (f < DK) {
    scene = <g transform={`translate(540 900) scale(${1 + ease01(f, RIDE + 90, DK) * 0.15}) translate(-540 -900)`}><Side f={f} kind="night" sleep={ease01(f, SL, SL + 40)} /></g>;
  } else if (f < WA) {
    scene = <g opacity={f > WA - 20 ? flick(f, 2, 0.5) * ramp(f, WA - 20, WA - 4) : 0}><Side f={f} kind="platform" sleep={1} sway={0} /></g>;
  } else if (f < MP) {
    const z = ease01(f, SI, SI + 50);
    scene = (
      <g transform={`translate(${540 + z * 281} ${900 + z * 345}) scale(${1 + z * 0.9}) translate(-540 -900)`}>
        <Side f={f} kind="platform" sleep={1 - ease01(f, WA, WA + 20)} look={-0.8} sway={0} light={flick(f, 4, 0.08)} />
      </g>
    );
  } else if (f < PH) {
    scene = <RouteMap f={f} t={f - MP} />;
  } else if (f < FU) {
    scene = <g><rect x={-200} y={-200} width={1480} height={2400} fill="#06080d" /></g>;
  } else if (f < CH) {
    const rv = f < BA ? flick(f, 6, 0.3) : 1;
    scene = <Aisle f={f} reveal={ramp(f, FU, FU + 30)} light={rv} push={ease01(f, BA, CH)} />;
  } else if (f < ST) {
    scene = <Speaker f={f} on={f >= m('announce') ? 1 : 0.2} />;
  } else if (f < WK) {
    if (f < SC) scene = <Aisle f={f} light={flick(f, 8)} />;
    else if (f < GR) {
      const z = ease01(f, SC, SC + 40);
      scene = <g transform={`translate(${540 + z * 600} ${900 + z * 120}) scale(${1 + z * 2.2}) translate(-540 -900)`}><Aisle f={f} light={flick(f, 8)} /></g>;
    } else {
      // фото бабушки в том же платке
      const k = ramp(f, GR, GR + 10);
      scene = (
        <g>
          <rect x={-200} y={-200} width={1480} height={2400} fill="#06080d" />
          <g opacity={k} transform="translate(540 760) rotate(-3)">
            <rect x={-280} y={-340} width={560} height={680} fill="#e8e4da" />
            <rect x={-250} y={-310} width={500} height={540} fill="#4a4a48" />
            <rect x={-250} y={-310} width={500} height={540} fill="#7a6a50" opacity={0.35} />
            <ellipse cx={0} cy={-60} rx={120} ry={140} fill="#2c4f9a" />
            <ellipse cx={0} cy={-40} rx={80} ry={98} fill="#c99f88" />
            {[[-70, -150], [60, -160], [-100, -50], [96, -40], [-80, 60], [80, 60]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={10} fill="#e8e4da" />)}
            <path d="M-28 -50 l16 0 M12 -50 l16 0" stroke="#3a2a20" strokeWidth={5} />
            <path d="M-20 10 q20 12 40 0" stroke="#7a4a3a" strokeWidth={5} fill="none" />
            <path d="M-250 230 L-250 120 Q0 40 250 120 L250 230 Z" fill="#3a3030" />
            <rect x={-250} y={-310} width={500} height={540} fill="#000" opacity={0.15} />
            <text x={0} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#14171d">1941 — 2018</text>
            <rect x={-300} y={-360} width={600} height={30} fill="#111" transform="rotate(45)" opacity={0.85} />
          </g>
        </g>
      );
    }
  } else if (f < LA) {
    scene = <Aisle f={f} go={f < NB ? ease01(f, WK, NB) * 0.8 : 0.8} light={flick(f, 11)} />;
  } else if (f < DO) {
    const z = ease01(f, MEk, MEk + 30);
    scene = (
      <g transform={`translate(${540 + z * 108} ${900 + z * 260}) scale(${1 + z * 0.8}) translate(-540 -900)`}>
        <Side f={f} kind="platform" sleep={1} sway={0} light={flick(f, 13, 0.06)} who="double" />
      </g>
    );
  } else if (f < EX) {
    const o = ease01(f, DO + 10, DO + 40);
    scene = (
      <g>
        <rect x={-200} y={-200} width={1480} height={2400} fill={WALL} />
        <rect x={190} y={300} width={700} height={1250} fill="#05070c" />
        <g transform="translate(190 300)"><rect y={900} width={700} height={350} fill="#151a22" /><rect x={480} y={150} width={10} height={760} fill="#2a2f38" /><circle cx={485} cy={150} r={16} fill="#fff2c8" /><circle cx={485} cy={150} r={180} fill="#fff2c8" opacity={0.07} /><rect x={80} y={380} width={300} height={90} fill="#e8e4da" /><text x={230} y={440} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#14171d">ПУСТОШЬ</text></g>
        <rect x={190 - o * 340} y={300} width={350} height={1250} fill="#5a6a5a" stroke="#3a463a" strokeWidth={10} />
        <rect x={540 + o * 340} y={300} width={350} height={1250} fill="#5a6a5a" stroke="#3a463a" strokeWidth={10} />
        <rect x={230 - o * 340} y={400} width={270} height={420} rx={16} fill="#0b1018" />
        <rect x={580 + o * 340} y={400} width={270} height={420} rx={16} fill="#0b1018" />
        <rect x={-200} y={1550} width={1480} height={600} fill="#141a22" />
        <rect x={-200} y={160} width={1480} height={30} fill="#e8f0ff" opacity={0.7 * flick(f, 15)} />
      </g>
    );
  } else if (f < VI) {
    const dx = interpolate(f, [DE, VI], [0, 1700], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t * t});
    const cl = f >= TU - 40 ? ease01(f, TU - 40, TU) : 0;
    scene = <Outside f={f} dx={f < DE ? 0 : dx * (1 - cl * 0.92)} turn={f >= TU ? ease01(f, TU, TU + 50) : 0} close={cl} />;
  } else if (f < BL) {
    scene = <g><rect x={-200} y={-200} width={1480} height={2400} fill="#05070c" /></g>;
  }
  const clock = f < DK ? '23:58' : f >= WA && f < VI ? '00:41' : f >= VI && f < BL ? '00:43' : '';
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f >= PH && f < FU && <PhoneFrame x={540} y={760} scale={0.92} tilt={-2} f={f} glow={C.tv} glowK={0.2}><LockScreen f={f} /></PhoneFrame>}
      {f >= VI && f < BL && <PhoneFrame x={540} y={760} scale={0.92} tilt={2} f={f} glow={C.red} glowK={0.3} shake={f < SM ? 1 : 0}><MomScreen f={f} start={SM} /></PhoneFrame>}
      {clock && !(f >= PH && f < FU) && !(f >= VI) && <Chip x={540} y={150} text={clock} kind="white" t={1} tilt={0} size={44} />}
      {f >= m('announce') && f < ST && <Chip x={540} y={1060} text="«НЕ ОБОРАЧИВАТЬСЯ»" kind="red" t={ramp(f, m('announce') + 60, m('announce') + 70)} tilt={-2} size={44} />}
      {f >= MEk && f < DO && <Chip x={540} y={330} text="ЭТО ТЫ" kind="red" t={ramp(f, MEk + 4, MEk + 14)} tilt={-3} size={52} />}
      {f >= GR && f < WK && <Chip x={540} y={240} text="ПОХОРОНЕНА В 2018" kind="white" t={ramp(f, GR + 30, GR + 40)} tilt={2} size={34} />}
      {f >= m('announce2') && f < EX && <Chip x={540} y={1060} text="ОБРАТНО — НЕЛЬЗЯ" kind="red" t={ramp(f, m('announce2') + 50, m('announce2') + 60)} tilt={2} size={44} />}
      {f >= TI && <AbsoluteFill style={{background: C.void}}><ElCard f={f} start={TI} /></AbsoluteFill>}
    </AbsoluteFill>
  );
};

/** Титр. */
export const ElCard: React.FC<{f: number; start: number}> = ({f, start}) => {
  const a = easeOut(ramp(f - start, 0, 14));
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: a, transform: `scale(${0.96 + 0.04 * a})`}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 92, color: C.white, lineHeight: 1.05, textAlign: 'center'}}>ПОСЛЕДНЯЯ<br /><span style={{color: C.red}}>ЭЛЕКТРИЧКА</span></div>
      <div style={{marginTop: 34, fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.grey, letterSpacing: 2, opacity: ramp(f - start, 16, 28)}}>А ТЫ БЫ ВЫШЕЛ?</div>
    </div>
  );
};
