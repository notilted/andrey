import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Character} from '../components/Character';
import {Beach2, Board, DentalHall, Fbi, Garage, Heli, J, Lambo, LuxOffice, Mansion, MeatVan, MoneyRain, Party, Pen, PumpChart, Queens, Stack, Stage, Victims, WallSt} from '../components/Jb';
import {Chip} from '../components/Overlay';
import {Cell, Pixel, TradingFloor, YachtNight} from '../components/Px';
import {C, FONT} from '../theme';
import {mk} from '../timelineJb';
import {easeOut, ramp} from '../util';
import {ease01} from './twkit';

/** Сколько «заработано» в кадре f (для счётчика). */
export const moneyJb = (f: number) => {
  const k: [number, number][] = [[mk('h_office'), 0], [mk('h_office') + 60, 49000000], [mk('nothing') - 1, 49000000], [mk('nothing'), 0], [mk('summer'), 0], [mk('summer') + 30, 20000],
    [mk('meat'), 20000], [mk('bankrupt'), 0], [mk('thousand'), 0], [mk('river') + 30, 49000000], [mk('gavel'), 49000000], [mk('restitution'), -110000000]];
  if (f < k[0][0]) return 0;
  return interpolate(f, k.map((x) => x[0]), k.map((x) => x[1]), {extrapolateRight: 'clamp'});
};

const push = (f: number, a: number, b: number, s0 = 1.0, s1 = 1.15, cx = 540, cy = 960) => `translate(540 860) scale(${interpolate(f, [a, b], [s0, s1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}) translate(${-cx} ${-cy})`;

const Px: React.FC<{children: React.ReactNode}> = ({children}) => <Pixel size={7} levels={10}>{children}</Pixel>;

export const SceneJb: React.FC<{f: number}> = ({f}) => {
  const m = (k: string) => mk(k);
  const shot = (a: string, b: string) => f >= m(a) && f < m(b);
  const TITLE = m('title');
  let scene: React.ReactNode = null;
  if (f < m('name')) scene = <g transform={push(f, 0, m('name'), 1.0, 1.12, 540, 1000)}><LuxOffice f={f} mad={f >= m('h_mad') ? 1 : 0} /><MoneyRain f={f} k={0.6} /></g>;
  else if (shot('name', 'nothing')) scene = <g transform={push(f, m('name'), m('nothing'), 2.0, 2.2, 545, 1050)}><LuxOffice f={f} /></g>;
  else if (shot('nothing', 'queens')) scene = (
    <g transform={push(f, m('nothing'), m('queens'), 1.6, 1.8, 540, 1150)}>
      <rect x={-300} y={-300} width={1700} height={2400} fill="#0a0a0e" />
      <circle cx={540} cy={700} r={300} fill="#ffe9b0" opacity={0.08} /><circle cx={540} cy={700} r={14} fill="#ffe9b0" />
      <rect x={-300} y={1500} width={1700} height={500} fill="#141418" />
      <Character who="jordan" x={540} y={1500} size={1.2} facing={1} frame={f} override={{top: '#5a5f68', topShade: '#4a4f58', bottom: '#3a4050', scale: 0.92}} pose={{sit: 1, lean: 20, headTilt: 12, blink: 1, brow: 0.6, lookUp: -0.5}} />
    </g>
  );
  else if (shot('queens', 'beach')) scene = <g transform={push(f, m('queens'), m('beach'), 1.0, 1.1, 540, 1150)}><Queens f={f} /></g>;
  else if (shot('beach', 'dental')) scene = <g transform={push(f, m('beach'), m('dental'), 1.3, 1.5, 560, 1250)}><Beach2 f={f} /></g>;
  else if (shot('dental', 'meat')) scene = <g transform={push(f, m('dental'), m('meat'), 1.0, 1.1, 540, 1050)}><DentalHall f={f} leave={ease01(f, m('leave'), m('leave') + 60)} /></g>;
  else if (shot('meat', 'wallst')) scene = <g transform={push(f, m('meat'), m('wallst'), 1.0, 1.08, 540, 1100)}><MeatVan f={f} stamp={easeOut(ramp(f, m('bankrupt'), m('bankrupt') + 10))} /></g>;
  else if (shot('wallst', 'exam')) scene = <g transform={push(f, m('wallst'), m('exam'), 1.0, 1.15, 540, 1050)}><WallSt f={f} /></g>;
  else if (shot('exam', 'penny')) scene = <g transform={push(f, m('exam'), m('penny'), 1.0, 1.1, 540, 900)}><Board f={f} red={f >= m('crash') ? 1 : 0} title={f >= m('crash') ? '−22%' : '19.10.1987'} /></g>;
  else if (shot('penny', 'garage')) scene = <g transform={f < m('phone') ? push(f, m('penny'), m('phone'), 1.0, 1.1, 540, 1100) : push(f, m('phone'), m('garage'), 2.2, 2.4, 545, 1180)}><Garage f={f} sign="INVESTOR CENTER · $0.10" /></g>;
  else if (shot('garage', 'thousand')) scene = <g transform={push(f, m('garage'), m('thousand'), 1.0, 1.1, 540, 1050)}><Garage f={f} /></g>;
  else if (shot('thousand', 'pump') || shot('river', 'lambo')) scene = <g transform={push(f, m('thousand'), m('lambo'), 1.05, 1.25, 540, 1050)}><TradingFloor f={f} roar={1} /><MoneyRain f={f} k={f >= m('river') ? 1 : 0.35} /></g>;
  else if (shot('pump', 'river')) scene = <PumpChart f={f} t={ramp(f, m('pump'), m('river') - 10)} />;
  else if (shot('lambo', 'mansion')) scene = <g transform={push(f, m('lambo'), m('mansion'), 1.3, 1.4, 540, 1300)}><Mansion f={f} /><Lambo x={interpolate(f, [m('lambo'), m('mansion')], [200, 560])} y={1560} s={1.1} /></g>;
  else if (shot('mansion', 'yacht')) scene = <g transform={push(f, m('mansion'), m('yacht'), 1.0, 1.08, 540, 1000)}><Mansion f={f} />{f >= m('heli') && <Heli x={interpolate(f, [m('heli'), m('yacht')], [1200, 700])} y={420} f={f} s={1.0} />}</g>;
  else if (shot('yacht', 'party')) scene = f < m('swiss') ? <g transform={push(f, m('yacht'), m('swiss'), 1.0, 1.1, 540, 1000)}><YachtNight f={f} /></g> : (
    <g transform={push(f, m('swiss'), m('party'), 2.0, 2.2, 545, 1150)}>
      <rect x={-300} y={-300} width={1700} height={2400} fill="#3a2a2a" />
      <Character who="jordan" x={540} y={1500} size={1.2} facing={1} frame={f} override={{top: '#f2f2ee', topShade: '#d8d4c8'}} pose={{armF: [100, -20], armB: [-100, -20], blink: 1, smile: 0.3}} />
      {[[490, 1180], [590, 1180], [490, 1260], [590, 1260]].map(([x, y], i) => <Stack key={i} x={x} y={y} s={0.6} h={2} />)}
      <rect x={430} y={1150} width={220} height={10} fill="#c9c3b2" /><rect x={430} y={1250} width={220} height={10} fill="#c9c3b2" />
    </g>
  );
  else if (shot('party', 'storm')) scene = <g transform={push(f, m('party'), m('storm'), 1.0, 1.15, 540, 1100)}><Party f={f} /><MoneyRain f={f} k={0.8} seed={5} /></g>;
  else if (shot('storm', 'fbi')) scene = (
    <g transform={push(f, m('storm'), m('fbi'), 1.0, 1.1, 540, 1000)}>
      <YachtNight f={f} storm={1} sink={ramp(f, m('storm'), m('fbi'))} />
      {f >= m('navy') && <g><Heli x={interpolate(f, [m('navy'), m('fbi')], [1200, 760])} y={700} f={f} s={0.9} /><polygon points={`${interpolate(f, [m('navy'), m('fbi')], [1200, 760])},740 ${interpolate(f, [m('navy'), m('fbi')], [1100, 660])},1700 ${interpolate(f, [m('navy'), m('fbi')], [1400, 960])},1700`} fill="#fff6d8" opacity={0.2} /></g>}
    </g>
  );
  else if (shot('fbi', 'wire')) scene = <g transform={push(f, m('fbi'), m('wire'), 1.0, 1.1, 540, 1050)}><Fbi f={f} /></g>;
  else if (shot('wire', 'gavel')) scene = (
    <g transform={push(f, m('wire'), m('gavel'), 2.2, 2.4, 545, 1160)}>
      <rect x={-300} y={-300} width={1700} height={2400} fill="#1a1d24" />
      <Character who="jordan" x={540} y={1500} size={1.2} facing={1} frame={f} override={{top: '#f2f2ee', topShade: '#d8d4c8'}} pose={{blink: 1, brow: 0.8, look: -0.6}} />
      <rect x={520} y={1180} width={40} height={24} rx={4} fill="#1d2129" /><path d="M540 1204 Q520 1260 560 1320" stroke="#1d2129" strokeWidth={4} fill="none" />
      <rect x={500} y={1172} width={80} height={10} fill="#c9c3b2" opacity={0.8} />
    </g>
  );
  else if (shot('gavel', 'cell')) scene = (
    <g transform={push(f, m('gavel'), m('cell'), 1.4, 1.5, 540, 1200)}>
      <rect x={-300} y={-300} width={1700} height={2400} fill={J.wood} />
      <rect x={140} y={1100} width={800} height={400} fill={J.woodHi} />
      <Character who="mark" hair="evgeny" x={540} y={1150} size={1.1} facing={-1} frame={f} override={{top: '#14171d', topShade: '#0d0f12', hair: '#c9c3b8', skin: '#d8a888', skinShade: '#b08870'}} pose={{armF: [120, f % 30 < 10 ? -80 : -40], brow: -0.4, blink: 1}} />
      <rect x={140} y={1100} width={800} height={30} fill="#3a2010" />
    </g>
  );
  else if (shot('cell', 'stage')) scene = <g transform={push(f, m('cell'), m('stage'), 1.0, 1.12, 540, 960)}><Cell f={f} /></g>;
  else if (shot('stage', 'pen')) scene = <g transform={push(f, m('stage'), m('pen'), 1.0, 1.2, 540, 1100)}><Stage f={f} /></g>;
  else if (shot('pen', 'victims')) scene = <Pen f={f} t={f - m('pen')} />;
  else if (shot('victims', 'title')) scene = <Victims f={f} t={(f - m('victims')) / 6} />;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f < TITLE && <Px>{scene}</Px>}
      {shot('name', 'nothing') && <Chip x={540} y={330} text="ДЖОРДАН БЕЛФОРТ" kind="yellow" t={ramp(f, m('name') + 6, m('name') + 16)} tilt={-2} size={46} />}
      {shot('closed', 'penny') && <Chip x={540} y={330} text="ФИРМА ЗАКРЫТА" kind="red" t={ramp(f, m('closed'), m('closed') + 10)} tilt={-2} size={40} />}
      {shot('fifty', 'phone') && <Chip x={540} y={330} text="КОМИССИЯ 50%" kind="yellow" t={ramp(f, m('fifty'), m('fifty') + 10)} tilt={2} size={44} />}
      {shot('thousand', 'pump') && <Chip x={540} y={330} text="1 000 БРОКЕРОВ" kind="yellow" t={ramp(f, m('thousand'), m('thousand') + 10)} tilt={-2} size={44} />}
      {shot('swiss', 'party') && <Chip x={540} y={330} text="НАЛИЧНЫЕ → ШВЕЙЦАРИЯ" kind="white" t={ramp(f, m('swiss') + 6, m('swiss') + 16)} tilt={-2} size={36} />}
      {shot('navy', 'fbi') && <Chip x={540} y={330} text="САРДИНИЯ · 1996" kind="white" t={ramp(f, m('navy'), m('navy') + 10)} tilt={2} size={40} />}
      {shot('charge', 'wire') && <Chip x={540} y={330} text="МОШЕННИЧЕСТВО · ОТМЫВАНИЕ" kind="red" t={ramp(f, m('charge'), m('charge') + 10)} tilt={-2} size={34} />}
      {shot('wire', 'gavel') && <Chip x={540} y={330} text="ПРОСЛУШКА" kind="red" t={ramp(f, m('wire') + 10, m('wire') + 20)} tilt={2} size={44} />}
      {shot('gavel', 'cell') && <Chip x={540} y={1180} text="4 ГОДА" kind="red" t={ramp(f, m('gavel') + 8, m('gavel') + 18)} tilt={-2} size={56} />}
      {shot('cell', 'restitution') && <Chip x={540} y={330} text="22 МЕСЯЦА" kind="white" t={ramp(f, m('cell') + 10, m('cell') + 20)} tilt={-2} size={50} />}
      {shot('victims', 'title') && <Chip x={540} y={330} text="≈ 1 500 ПОСТРАДАВШИХ" kind="red" t={ramp(f, m('victims') + 20, m('victims') + 30)} tilt={-2} size={40} />}
      {f >= TITLE && (
        <AbsoluteFill style={{background: '#0a0812', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, opacity: easeOut(ramp(f, TITLE, TITLE + 14))}}>
          <div style={{fontWeight: 900, fontSize: 96, color: C.white, textAlign: 'center', lineHeight: 1.05, textShadow: '8px 8px 0 #3a1e18'}}>ДЖОРДАН<br /><span style={{color: J.goldHi}}>БЕЛФОРТ</span></div>
          <div style={{marginTop: 30, padding: '8px 22px', background: C.white, color: '#14171d', fontWeight: 900, fontSize: 30, letterSpacing: 3}}>РЕАЛЬНАЯ ИСТОРИЯ</div>
          <div style={{marginTop: 34, fontWeight: 800, fontSize: 30, color: C.grey, opacity: ramp(f, TITLE + 20, TITLE + 34)}}>Цена этих денег — чужие сбережения</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

