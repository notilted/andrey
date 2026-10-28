import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {ApartmentBack, ROOM} from '../components/Apartment';
import {B, BankScreen, Block, DaySky, GrannyPhoto, Kiosk, lerp, PaperCloseup, rub, Spit, Street} from '../components/Bm';
import {Character, Look, Who} from '../components/Character';
import {Chip} from '../components/Overlay';
import {PhoneFrame} from '../components/Phone';
import {C, FONT} from '../theme';
import {mk} from '../timelineBm1';
import {blink, easeOut, ramp, rand} from '../util';
import {camera, ease01, SVG} from './twkit';

/** Траты: [название, сумма, кадр-сдвиг от melt]. */
export const SPEND: [string, number][] = [['Ремонт', 400000], ['Оборудование', 600000], ['Вытяжка', 180000], ['Аренда + залог', 330000], ['Вывеска', 85000], ['Касса', 35000], ['Разрешения', 60000], ['Мясо, лаваш', 90000], ['Посуда, упаковка', 30000]];
export const spendStep = () => (mk('hire') - mk('melt') - 20) / SPEND.length;

/** Сколько на счёте в кадре f. */
export const moneyBm1 = (f: number) => {
  const ME = mk('melt');
  const st = spendStep();
  let v = 2000000;
  SPEND.forEach(([, s], i) => { if (f >= ME + 10 + i * st) v -= s; });
  return v;
};

export const MAMA: Partial<Look> = {scale: 0.92, headScale: 1.0, torso: 128, width: 76, top: '#6b4a5a', topShade: '#5a3a4a', hair: '#4a3020'};
export const RUSTAM: Partial<Look> = {top: '#f2f2ee', topShade: '#d8d4c8', skin: '#b07a5e', skinShade: '#8a5e48', hair: '#1a1410', bottom: '#2a2e38'};
export const LENA: Partial<Look> = {top: '#c95a4a', topShade: '#a84a3a', hair: '#7a4a2a'};
const KNAME = 'ШАУРМА У КОЛЛЕДЖА';

/** Прохожие (студенты, механики). */
export const Walkers: React.FC<{f: number; n: number; y: number; speed?: number; s?: number; seed?: number; span?: [number, number]}> = ({f, n, y, speed = 3, s = 0.75, seed = 0, span = [-600, 1700]}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const dir = rand(i + seed) > 0.5 ? 1 : -1;
      const L = span[1] - span[0];
      const p = ((rand(i + seed + 7) * L + f * speed * (0.8 + rand(i + seed) * 0.4)) % L);
      const x = dir > 0 ? span[0] + p : span[1] - p;
      const tops = ['#4a6a9a', '#3a3a44', '#6a8a5a', '#c95a4a', '#2a4a6a', '#d9b04a', '#5a4a6a'];
      const styles: Who[] = ['mark', 'alisa', 'lev', 'mark', 'galina', 'lev', 'alisa'];
      return (
        <Character key={i} who="mark" hair={styles[i % 7]} x={x} y={y + (i % 3) * 8} size={s * (0.9 + rand(i + seed + 3) * 0.15)} facing={dir as 1 | -1} frame={f + i * 7}
          override={{top: tops[i % 7], topShade: tops[i % 7], hair: ['#1a1a1a', '#5a4030', '#2a1a14'][i % 3], bottom: '#2a2e38'}} pose={{step: f / 3 + i, blink: blink(f, i + 40), rim: 0.2}} />
      );
    })}
  </g>
);

/** Велосипед курьера. */
const Bike: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => (
  <g transform={`translate(${x} ${y})`}>
    {[-90, 90].map((d) => (
      <g key={d}>
        <circle cx={d} cy={-50} r={50} fill="none" stroke="#1d2129" strokeWidth={8} />
        <path d={`M${d} -50 l${Math.cos(f / 3) * 44} ${Math.sin(f / 3) * 44}`} stroke="#5a606a" strokeWidth={3} />
      </g>
    ))}
    <path d="M-90 -50 L-10 -50 L40 -130 L-40 -130 Z M-10 -50 L-40 -130 M40 -130 L90 -50 M40 -130 L50 -160" stroke="#c8302a" strokeWidth={8} fill="none" />
    <rect x={-150} y={-260} width={110} height={100} rx={8} fill="#f2c230" />
    <text x={-95} y={-200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={18} fill="#14171d">ЕДА</text>
  </g>
);

/* ───────── кадры ───────── */
const Photo: React.FC<{f: number}> = ({f}) => (
  <SVG>
    <rect width={1080} height={1920} fill="#1a1612" />
    <rect x={0} y={1100} width={1080} height={820} fill="#3a2e25" />
    <g transform={`translate(540 860) scale(${2.2 + f / 900}) translate(-540 -900)`}>
      <GrannyPhoto x={540} y={900} s={1}>
        <Character who="galina" x={4} y={260} size={1.1} facing={1} frame={f} pose={{smile: 0.8, blink: 1, look: 0.2, rim: 0}} />
      </GrannyPhoto>
      <rect x={430} y={1010} width={220} height={40} fill="#14171d" />
    </g>
    <rect x={0} y={0} width={1080} height={1920} fill="#000" opacity={0.15} />
  </SVG>
);

const Courier: React.FC<{f: number}> = ({f}) => {
  const CO = mk('courier');
  const off = (f - CO) * 6;
  return (
    <SVG>
      <g transform="translate(540 860) scale(1.3) translate(-540 -1250)">
        <DaySky />
        <g transform={`translate(${-off * 0.4} 0)`}>
          {Array.from({length: 10}).map((_, i) => <Block key={i} x={-600 + i * 380} w={340} h={420 + rand(i) * 380} color={['#b8a890', '#9aa0a8', '#c9b49a', '#8a909a'][i % 4]} />)}
        </g>
        <g transform={`translate(${-off} 0)`}><Street /></g>
        <Bike x={520} y={B.ground + 120} f={f} />
        <Character who="mark" x={500} y={B.ground - 20} size={0.95} facing={1} frame={f} pose={{sit: 0.8, lean: 20, armF: [100, -20], blink: blink(f, 1), brow: 0.3, look: 0.4}} />
      </g>
    </SVG>
  );
};

const Kitchen: React.FC<{f: number}> = ({f}) => {
  const AD = mk('advice');
  const FR = mk('friend');
  const UN = mk('uncle');
  const talk = (a: number, b: number) => (f >= a && f < b ? 0.4 + 0.3 * Math.sin(f / 2.5) : 0);
  const cam = camera(f, [[AD, 360, 820, 1.7], [FR - 1, 360, 820, 1.7], [FR, 600, 820, 1.7], [UN - 1, 600, 820, 1.7], [UN, 830, 820, 1.7], [mk('memory'), 560, 820, 1.2]]);
  return (
    <SVG>
      <g transform={cam}>
        <ApartmentBack f={f} lamp={1} />
        <rect x={250} y={930} width={700} height={18} rx={4} fill={C.woodHi} />
        <Character who="alisa" x={340} y={ROOM.floor} size={1.15} facing={1} frame={f} override={MAMA} pose={{armF: f < FR ? [70, -60] : [20, -20], blink: blink(f, 3), brow: 0.4, mouth: talk(AD, FR), look: 0.4}} />
        <Character who="mark" x={520} y={ROOM.floor} size={1.15} facing={-1} frame={f} pose={{sit: 1, blink: blink(f, 1), brow: 0.6, look: 0.4, lookUp: 0.2}} />
        <Character who="mark" hair="lev" x={680} y={ROOM.floor} size={1.15} facing={-1} frame={f} override={{top: '#3a4a3a', topShade: '#2a3a2a', hair: '#2a1a14'}} pose={{armF: f >= FR && f < UN ? [80, -40] : [20, -20], blink: blink(f, 5), smile: 0.4, mouth: talk(FR, UN), look: 0.4}} />
        <Character who="evgeny" x={850} y={ROOM.floor} size={1.15} facing={-1} frame={f} override={{top: '#5a3a3a', topShade: '#4a2a2a'}} pose={{armF: f >= UN ? [130, -30] : [20, -20], blink: blink(f, 7), smile: f >= UN ? 0.7 : 0, mouth: talk(UN, UN + 60), look: 0.4}} />
      </g>
    </SVG>
  );
};

const Memory: React.FC<{f: number}> = ({f}) => (
  <SVG>
    <defs>
      <filter id="bmSep"><feColorMatrix type="matrix" values="0.45 0.7 0.18 0 0.02  0.38 0.62 0.16 0 0.01  0.28 0.48 0.12 0 0  0 0 0 1 0" /></filter>
      <radialGradient id="bmVig" cx="0.5" cy="0.45" r="0.6"><stop offset="0.45" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.85} /></radialGradient>
    </defs>
    <g filter="url(#bmSep)" transform={`translate(540 860) scale(${1.4 + (f - mk('memory')) / 1500}) translate(-540 -1280)`}>
      <DaySky />
      <Block x={-200} w={600} h={900} color="#c9b49a" />
      <Block x={500} w={700} h={800} color="#b8a890" />
      <rect x={-1000} y={B.ground} width={3000} height={800} fill="#8a8a6a" />
      <Character who="galina" x={460} y={B.ground} size={1.1} facing={1} frame={f} pose={{armF: [70, -60], smile: 0.8, blink: blink(f, 9), look: 0.4}} />
      <ellipse cx={560} cy={B.ground - 250} rx={80} ry={14} fill="#8a6a4a" />
      {[-40, 0, 40].map((d, i) => <ellipse key={i} cx={560 + d} cy={B.ground - 262} rx={22} ry={10} fill="#d9a860" />)}
      {(['sonya', 'misha', 'alisa'] as Who[]).map((w, i) => (
        <Character key={i} who={w} x={680 + i * 90} y={B.ground} size={1.0} facing={-1} frame={f + i * 9} pose={{armF: [60 + i * 20, -20], smile: 0.8, blink: blink(f, i + 3), lookUp: 0.5}} />
      ))}
    </g>
    <rect width={1080} height={1920} fill="url(#bmVig)" />
  </SVG>
);

const Decide: React.FC<{f: number}> = ({f}) => (
  <SVG>
    <g transform={`translate(540 860) scale(${2.6 + (f - mk('decide')) / 900}) translate(-520 -900)`}>
      <ApartmentBack f={f} lamp={0.6} />
      <Character who="mark" x={520} y={ROOM.floor} size={1.2} facing={1} frame={f} pose={{blink: blink(f, 1), brow: -0.3, smile: 0.3, look: 0.5, lookUp: 0.2}} />
    </g>
  </SVG>
);

const MapShot: React.FC<{f: number}> = ({f}) => {
  const MA = mk('map');
  const pins: [number, number, string][] = [[380, 640, '1 · ЦЕНТР'], [760, 940, '2 · СПАЛЬНЫЙ'], [460, 1140, '3 · КОЛЛЕДЖ']];
  return (
    <SVG>
      <rect width={1080} height={1920} fill="#20252f" />
      {Array.from({length: 18}).map((_, i) => <rect key={`h${i}`} x={0} y={200 + i * 80} width={1080} height={i % 4 ? 6 : 16} fill="#2c323e" />)}
      {Array.from({length: 12}).map((_, i) => <rect key={`v${i}`} x={40 + i * 90} y={0} width={i % 3 ? 6 : 16} height={1920} fill="#2c323e" />)}
      <path d="M0 1300 Q500 1180 1080 1320 L1080 1500 L0 1500 Z" fill="#1d2c3a" />
      {pins.map(([x, y, t], i) => {
        const k = easeOut(ramp(f, MA + i * 12, MA + i * 12 + 12));
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
            <path d="M0 0 C-30 -36 -30 -78 0 -84 C30 -78 30 -36 0 0 Z" fill={C.warm} />
            <circle cx={0} cy={-54} r={12} fill="#1c2029" />
            <rect x={36} y={-80} width={250} height={50} rx={10} fill="#f2f2ee" />
            <text x={52} y={-45} fontFamily={FONT} fontWeight={900} fontSize={26} fill="#14171d">{t}</text>
          </g>
        );
      })}
    </SVG>
  );
};

/** Точки 1–3: центр, спальный район, колледж. */
const Spot: React.FC<{f: number; which: 1 | 2 | 3}> = ({f, which}) => {
  const st = mk(['p1', 'p2', 'p3'][which - 1]);
  const pan = (f - st) * 0.8;
  const dusk = which === 2 ? ramp(f, mk('p2_empty'), mk('p2_empty') + 40) : 0;
  const counting = which === 3 && f >= mk('count');
  return (
    <SVG>
      <g transform={`translate(540 860) scale(${which === 3 && counting ? 1.6 : 1.0}) translate(${-(540 + pan + (counting ? -140 : 0))} ${counting ? -1300 : -1150})`}>
        <DaySky dusk={dusk} night={dusk * 0.6} />
        {which === 1 && (
          <g>
            {Array.from({length: 9}).map((_, i) => <Block key={i} x={-700 + i * 330} w={300} h={900 + rand(i) * 600} color={['#7a8090', '#8a909a', '#6a7080'][i % 3]} lit={0.15} />)}
            {['ШАУРМА', 'ШАВЕРМА', 'ДОНЕР', 'ШАУРМА 24', 'ЛАВАШ'].map((n, i) => (
              <g key={i}><rect x={-560 + i * 400} y={B.ground - 140} width={200} height={140} fill={['#c8302a', '#e8a030', '#3a6a3a', '#5a3a6a', '#2a5a8a'][i]} />
                <text x={-460 + i * 400} y={B.ground - 100} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#fff">{n}</text></g>
            ))}
            <Street />
            <Walkers f={f} n={22} y={B.ground + 30} speed={4} s={0.7} seed={1} />
          </g>
        )}
        {which === 2 && (
          <g>
            {Array.from({length: 6}).map((_, i) => <Block key={i} x={-700 + i * 520} w={460} h={1100} color={['#9aa0a8', '#a8aeb6'][i % 2]} lit={0.1 + dusk * 0.5} />)}
            <Street />
            <rect x={380} y={B.ground - 300} width={300} height={300} fill="#6a7080" />
            <rect x={400} y={B.ground - 270} width={260} height={110} fill="#1e2633" />
            <text x={530} y={B.ground - 200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.warm}>СДАЁТСЯ</text>
            {dusk < 0.5 && <Walkers f={f} n={3} y={B.ground + 30} speed={2} s={0.7} seed={5} />}
          </g>
        )}
        {which === 3 && (
          <g>
            <Block x={-700} w={900} h={1000} color="#b88a6a" lit={0.2} sign="КОЛЛЕДЖ ТЕХНОЛОГИЙ" signColor="#2a4a8a" />
            <Block x={760} w={900} h={520} color="#8a909a" sign="АВТОСЕРВИС" signColor="#c8302a" />
            <rect x={300} y={B.ground - 300} width={360} height={300} fill="#c9b49a" />
            <rect x={320} y={B.ground - 270} width={320} height={110} fill="#1e2633" />
            <text x={480} y={B.ground - 200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.warm}>СДАЁТСЯ</text>
            <Street />
            <Walkers f={f} n={16} y={B.ground + 30} speed={3.5} s={0.7} seed={9} />
            {counting && <Character who="mark" x={720} y={B.ground + 20} size={0.8} facing={-1} frame={f} pose={{armF: [80, -80], armB: [60, -60], blink: blink(f, 1), brow: 0.4, lookUp: -0.4}} />}
          </g>
        )}
      </g>
    </SVG>
  );
};

/** Ларёк изнутри: вертел, прилавок, повар и кассир. */
export const KioskInside: React.FC<{f: number; staff?: boolean; hero?: number; lights?: number; children?: React.ReactNode}> = ({f, staff = true, hero = -1, lights = 1, children}) => (
  <g>
    <rect x={-400} y={300} width={1900} height={1300} fill="#d8cdb6" />
    <rect x={-400} y={1100} width={1900} height={500} fill="#8a7a62" />
    <rect x={60} y={420} width={420} height={240} rx={10} fill="#1d2129" />
    <text x={270} y={480} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={C.warm}>МЕНЮ</text>
    {['Шаурма классика  280', 'Шаурма XL  350', 'Чай / кофе  80'].map((t, i) => <text key={i} x={90} y={540 + i * 44} fontFamily={FONT} fontWeight={800} fontSize={26} fill="#f2f2ee">{t}</text>)}
    <Spit x={720} y={1060} f={f} s={1} />
    <rect x={560} y={600} width={60} height={14} fill="#5a606a" />
    {staff && <Character who="mark" hair="lev" x={620} y={1100} size={1.15} facing={1} frame={f} override={RUSTAM} pose={{armF: [80, -40 + Math.sin(f / 4) * 20], blink: blink(f, 6), brow: 0.2, look: 0.6}} />}
    {staff && <Character who="vika" x={260} y={1100} size={1.1} facing={1} frame={f} override={LENA} pose={{armF: [70, -60], blink: blink(f, 5), smile: 0.3, look: 0.4}} />}
    {hero >= 0 && <Character who="mark" x={hero} y={1100} size={1.15} facing={1} frame={f} pose={{blink: blink(f, 1), brow: 0.6, look: 0.4}} />}
    {children}
    {/* прилавок */}
    <rect x={-400} y={940} width={1900} height={30} fill="#6a5a46" />
    <rect x={-400} y={970} width={1900} height={140} fill="#7a6a52" />
    <rect x={120} y={890} width={120} height={50} rx={6} fill="#1d2129" />
    <rect x={130} y={898} width={70} height={24} fill="#5ad08a" opacity={0.6} />
    <rect x={-400} y={300} width={1900} height={1300} fill="#05070e" opacity={(1 - lights) * 0.6} />
  </g>
);

const Hire: React.FC<{f: number}> = ({f}) => (
  <SVG>
    <g transform={`translate(540 860) scale(1.5) translate(-460 -860)`}>
      <KioskInside f={f} hero={440} />
    </g>
  </SVG>
);

/** Снаружи: открытие, ожидание, ноль. */
const Outside: React.FC<{f: number}> = ({f}) => {
  const OP = mk('open');
  const OH = mk('open_hold');
  const WA = mk('wait');
  const PA = mk('pass');
  const ZE = mk('zero');
  const flip = f >= OH;
  const night = f >= ZE ? ramp(f, ZE, ZE + 40) : 0;
  const cam = camera(f, [[OP, 640, 1250, 1.3], [OH, 760, 1250, 1.8], [WA, 600, 1200, 1.0], [PA, 600, 1200, 1.0], [ZE, 560, 1250, 1.5], [mk('title'), 540, 1250, 1.7]]);
  return (
    <SVG>
      <g transform={cam}>
        <DaySky dusk={night} night={night} />
        <Block x={-700} w={900} h={1000} color="#b88a6a" lit={0.2 + night * 0.5} sign="КОЛЛЕДЖ ТЕХНОЛОГИЙ" signColor="#2a4a8a" />
        <Block x={900} w={900} h={520} color="#8a909a" sign="АВТОСЕРВИС" signColor="#c8302a" />
        <Kiosk x={540} f={f} name={KNAME} open={flip} balloons={1} />
        <Street />
        {f >= PA && f < ZE && <Walkers f={f} n={18} y={B.ground + 40} speed={4} s={0.75} seed={13} />}
        <Character who="mark" x={f >= ZE ? 420 : 760} y={f >= ZE ? B.ground + 40 : B.ground} size={0.85} facing={f >= ZE ? 1 : -1} frame={f}
          pose={{sit: f >= ZE ? 1 : 0, armF: f >= OH - 10 && f < OH + 20 ? [100, -20] : [10, -14], blink: blink(f, 1), brow: f >= PA ? 0.9 : 0, smile: f < WA ? 0.6 : 0, look: 0.4, headTilt: f >= ZE ? 14 : 0, lookUp: f >= ZE ? -0.6 : 0}} />
        <rect x={-2000} y={-2000} width={6000} height={6000} fill="#05070e" opacity={night * 0.35} />
      </g>
    </SVG>
  );
};

/* ───────── сцена целиком ───────── */
export const SceneBm1: React.FC<{f: number}> = ({f}) => {
  const NO = mk('note');
  const CO = mk('courier');
  const CA = mk('card');
  const AD = mk('advice');
  const FR = mk('friend');
  const UN = mk('uncle');
  const ME = mk('memory');
  const QU = mk('quote');
  const DE = mk('decide');
  const MA = mk('map');
  const P1 = mk('p1');
  const P1C = mk('p1_comp');
  const P2 = mk('p2');
  const P2E = mk('p2_empty');
  const P3 = mk('p3');
  const TA = mk('tally');
  const PE = mk('people');
  const SI = mk('sign');
  const ML = mk('melt');
  const HI = mk('hire');
  const OP = mk('open');
  const WA = mk('wait');
  const ZE = mk('zero');
  const TITLE = mk('title');
  const st = spendStep();
  const clock = f >= WA && f < ZE ? (f < WA + 50 ? '08:00' : f < WA + 100 ? '09:00' : f < WA + 150 ? '12:00' : '15:00') : '';
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f < CO && <Photo f={f} />}
      {f >= NO && f < CO && <AbsoluteFill style={{opacity: ramp(f, NO, NO + 6) * (1 - ramp(f, CO - 5, CO))}}><PaperCloseup t={f - NO} kind="note" title="Внуку" lines={['', 'Не трать на ерунду.']} /></AbsoluteFill>}
      {f >= CO && f < AD && <Courier f={f} />}
      {f >= CA && f < AD && (
        <AbsoluteFill style={{background: 'rgba(6,8,13,0.85)', opacity: ramp(f, CA, CA + 6)}}>
          <PhoneFrame x={540} y={720} scale={0.9} tilt={-2} f={f} glow="#5ad08a" glowK={0.3}><BankScreen value={2000000} items={[['Наследство', 2000000]]} t={f - CA} /></PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= AD && f < ME && <Kitchen f={f} />}
      {f >= AD && f < FR && <Chip x={540} y={330} text="«ЗАКРОЙ ИПОТЕКУ»" kind="white" t={ramp(f, AD + 6, AD + 16)} tilt={-2} size={34} />}
      {f >= FR && f < UN && <Chip x={540} y={330} text="«КУПИ МАШИНУ»" kind="white" t={ramp(f, FR + 6, FR + 16)} tilt={2} size={34} />}
      {f >= UN && f < ME && <Chip x={540} y={330} text="«КРИПТА, БРАТИШКА»" kind="yellow" t={ramp(f, UN + 6, UN + 16)} tilt={-2} size={34} />}
      {f >= ME && f < DE && <Memory f={f} />}
      {f >= DE && f < MA && <Decide f={f} />}
      {f >= DE && f < MA && <Chip x={540} y={1180} text="ШАУРМИЧНАЯ" kind="red" t={ramp(f, DE + 6, DE + 16)} tilt={-2} size={46} />}
      {f >= MA && f < P1 && <MapShot f={f} />}
      {f >= P1 && f < P2 && <Spot f={f} which={1} />}
      {f >= P2 && f < P3 && <Spot f={f} which={2} />}
      {f >= P3 && f < TA && <Spot f={f} which={3} />}
      {f >= P1 && f < P2 && <Chip x={540} y={330} text={f < P1C ? 'АРЕНДА 350 000 ₽/МЕС' : '5 КОНКУРЕНТОВ РЯДОМ'} kind={f < P1C ? 'white' : 'red'} t={ramp(f, f < P1C ? P1 + 20 : P1C, (f < P1C ? P1 + 20 : P1C) + 10)} tilt={-2} size={32} />}
      {f >= P2 && f < P3 && <Chip x={540} y={330} text={f < P2E ? 'АРЕНДА 60 000 ₽/МЕС' : 'ВЕЧЕРОМ — НИКОГО'} kind={f < P2E ? 'white' : 'red'} t={ramp(f, f < P2E ? P2 + 20 : P2E, (f < P2E ? P2 + 20 : P2E) + 10)} tilt={2} size={32} />}
      {f >= P3 && f < TA && <Chip x={540} y={330} text="АРЕНДА 110 000 ₽/МЕС" kind="yellow" t={ramp(f, P3 + 20, P3 + 30)} tilt={-2} size={32} />}
      {f >= TA && f < SI && <PaperCloseup t={f - TA} kind="tally" lines={[]} tally={interpolate(f, [TA, PE + 20], [0, 140], {extrapolateRight: 'clamp'})} />}
      {f >= PE && f < SI && <Chip x={540} y={1180} text="1 400 ЧЕЛОВЕК" kind="red" t={ramp(f, PE, PE + 10)} tilt={-2} size={40} />}
      {f >= SI && f < ML && <PaperCloseup t={f - SI} kind="note" title="ДОГОВОР АРЕНДЫ" lines={['Арендная плата: 110 000 ₽', 'Срок: 11 месяцев', '', '__________ подпись']} />}
      {f >= ML && f < HI && (
        <AbsoluteFill style={{background: '#06080d'}}>
          <PhoneFrame x={540} y={760} scale={0.95} tilt={-2} f={f} glow={C.red} glowK={0.25}>
            <BankScreen value={moneyBm1(f)} t={f - ML - 10} items={SPEND.filter((_, i) => f >= ML + 10 + i * st).slice(-7).map(([n, v]) => [n, -v])} />
          </PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= HI && f < OP && <Hire f={f} />}
      {f >= HI && f < OP && <Chip x={540} y={330} text={f < HI + 90 ? 'ПОВАР РУСТАМ' : 'КАССИР ЛЕНА'} kind="white" t={ramp(f, f < HI + 90 ? HI + 10 : HI + 90, (f < HI + 90 ? HI + 10 : HI + 90) + 10)} tilt={-2} size={32} />}
      {f >= OP && f < TITLE && <Outside f={f} />}
      {clock && <Chip x={540} y={330} text={clock} kind="white" t={1} tilt={0} size={56} />}
      {f >= ZE + 30 && f < TITLE && <Chip x={540} y={330} text={`КАССА: ${rub(0)}`} kind="red" t={ramp(f, ZE + 30, ZE + 40)} tilt={-2} size={46} />}
      {f >= TITLE && <AbsoluteFill style={{background: C.void}}><BmCard f={f} start={TITLE} ep={1} teaser="НИ ОДНОГО ПОКУПАТЕЛЯ" /></AbsoluteFill>}
    </AbsoluteFill>
  );
};

/** Титр сериала. */
export const BmCard: React.FC<{f: number; start: number; ep: number; teaser: string; final?: boolean}> = ({f, start, ep, teaser, final}) => {
  const local = f - start;
  const a = easeOut(ramp(local, 0, 14));
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: a, transform: `scale(${0.96 + 0.04 * a})`}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.white, letterSpacing: 1, lineHeight: 1.05, textAlign: 'center'}}>
        БАБУШКИНЫ<br /><span style={{color: C.warm}}>2 МИЛЛИОНА</span>
      </div>
      <div style={{marginTop: 26, padding: '8px 22px', borderRadius: 22, background: C.white, color: '#14171d', fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 3}}>{final ? 'КОНЕЦ' : `СЕРИЯ ${ep} ИЗ 3`}</div>
      <div style={{marginTop: 40, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: final ? C.grey : C.red, letterSpacing: 2, opacity: ramp(local, 16, 28)}}>{teaser}</div>
    </div>
  );
};
