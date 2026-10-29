import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Torch} from '../components/Tw2';
import {CityStreet, ME, P, Soldier, Stadium, Yard, ZSKIN, Zombie} from '../components/Zm';
import {C} from '../theme';
import {mk} from '../timelineZm3';
import {ramp, rand} from '../util';
import {ease01, SVG} from './twkit';
import {ZmCard} from './SceneZm1';

const zoom = (f: number, a: number, b: number, s: number, cx: number, cy: number) => {
  const k = ease01(f, a, b);
  return `translate(${540 + (540 - cx) * k * (s - 1)} ${900 + (900 - cy) * k * (s - 1)}) scale(${1 + k * (s - 1)}) translate(-540 -900)`;
};
const BG = (c: string) => <rect x={-200} y={-200} width={1480} height={2400} fill={c} />;
const RUN = {armF: [60, -60] as [number, number], armB: [-50, -40] as [number, number], brow: 1};

/** Бегущие ты и Соня (или Соня на спине). */
const Runners: React.FC<{f: number; x: number; y: number; carry?: boolean; s?: number; skin?: number}> = ({f, x, y, carry, s = 1, skin = 0}) => (
  <g>
    {carry ? (
      <g>
        <P who="sonya" x={x - 30 * s} y={y - 170 * s} size={0.95 * s} facing={1} f={f} seed={3} pose={{sit: 1, lean: 20, armF: [100, -20], brow: 1, blink: 1}} />
        <P who="mark" x={x} y={y} size={1.1 * s} facing={1} f={f} look={ME} pose={{step: f / 2.6, lean: 14, armF: [-20, -90], armB: [-30, -80], brow: 1}} />
      </g>
    ) : (
      <g>
        <P who="sonya" x={x - 110 * s} y={y} size={1.05 * s} facing={1} f={f} seed={3} pose={{...RUN, step: f / 2.2, mouth: 0.5}} />
        <P who="mark" x={x} y={y} size={1.1 * s} facing={1} f={f} look={skin ? {...ME, skin: '#b4a08c'} : ME} pose={{...RUN, step: f / 2.5}} />
      </g>
    )}
  </g>
);

/** Мост с пробкой и фурой. */
const Bridge: React.FC<{f: number; scroll: number}> = ({f, scroll}) => (
  <g>
    {BG('#5a5560')}
    <rect x={-200} y={-200} width={1480} height={700} fill="#6a6470" />
    <rect x={-200} y={600} width={1480} height={300} fill="#3a4450" />
    <g transform={`translate(${-scroll % 160} 0)`}>
      <rect x={-200} y={780} width={1800} height={18} fill="#8a8f98" />
      {Array.from({length: 14}).map((_, i) => <rect key={i} x={-200 + i * 160} y={780} width={10} height={160} fill="#8a8f98" />)}
    </g>
    <rect x={-200} y={940} width={1480} height={1300} fill="#2c2e32" />
    <g transform={`translate(${-scroll} 0)`}>
      <g transform="translate(800 1080)">
        <rect x={-380} y={-300} width={620} height={300} fill="#c8c8c0" />
        <rect x={240} y={-220} width={180} height={220} rx={16} fill="#2a4a6a" />
        <rect x={-380} y={0} width={800} height={30} fill="#1a1c20" />
        <circle cx={-280} cy={36} r={44} fill="#111" /><circle cx={-150} cy={36} r={44} fill="#111" /><circle cx={330} cy={36} r={44} fill="#111" />
      </g>
      {[-300, 1500, 2100].map((x, i) => (
        <g key={x} transform={`translate(${x} 1070) rotate(${i % 2 ? 5 : -3})`}>
          <rect x={-170} y={-80} width={340} height={90} rx={20} fill={['#4a4a4a', '#5a2a2a', '#2a3a5a'][i]} />
          <path d="M-110 -80 L-60 -140 L70 -140 L120 -80 Z" fill="#1a1f28" />
          <circle cx={-100} cy={14} r={30} fill="#111" /><circle cx={100} cy={14} r={30} fill="#111" />
        </g>
      ))}
    </g>
  </g>
);

/** Нога крупно: укус, штанина опускается. */
const Ankle: React.FC<{f: number; bite: number; cover: number}> = ({f, bite, cover}) => (
  <g transform={`translate(${Math.sin(f / 2) * 2} 0)`}>
    {BG('#2c2e32')}
    <rect x={380} y={-200} width={320} height={900 + (1 - cover) * 0 + cover * 520} fill="#2a3446" />
    <rect x={380} y={700} width={320} height={520} fill="#c29479" />
    <rect x={380} y={-200 + 900} width={320} height={cover * 520} fill="#2a3446" />
    <path d="M360 1220 L760 1220 L860 1340 L360 1340 Z" fill="#1d2129" />
    <g opacity={bite * (1 - cover)}>
      {Array.from({length: 8}).map((_, i) => {
        const a = Math.PI * (0.1 + i * 0.11);
        return <ellipse key={i} cx={540 + Math.cos(a) * 70} cy={960 + Math.sin(a) * 40} rx={8} ry={12} fill="#8a1a14" />;
      })}
      <ellipse cx={540} cy={980} rx={80} ry={50} fill="#8a1a14" opacity={0.2} />
    </g>
  </g>
);

/** Очередь людей у ворот. */
const Queue: React.FC<{f: number; n: number; x0: number; y: number; s: number; shift?: number}> = ({f, n, x0, y, s, shift = 0}) => (
  <g>
    {Array.from({length: n}).map((_, i) => (
      <P key={i} who={(['mark', 'galina', 'lev', 'vika', 'evgeny', 'palych'] as const)[i % 6]} x={x0 + i * 70 * s + shift} y={y + (i % 2) * 6} size={s} facing={-1} f={f + i * 5} seed={i}
        look={{top: ['#4a5a6a', '#6b2f38', '#3a3a44', '#5a4a3a', '#2a4a5a', '#4a4a36'][i % 6], topShade: '#2a2a30'}} pose={{rim: 0.6, rimColor: '#fff6d8'}} />
    ))}
  </g>
);

export const SceneZm3: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const OU = m('out'), FI = m('five'), STR = m('street'), CA = m('carry'), BR = m('bridge'), HA = m('hand'), FA = m('fall'), BI = m('bite'), HI = m('hide');
  const STA = m('stadium'), QU = m('queue'), CH = m('check'), MA = m('man'), WA = m('wall'), SH = m('shot'), MO = m('move'), FE = m('fever');
  const KN = m('kneel'), GO = m('go'), AS = m('ask'), LI = m('lie'), LF = m('lift'), WV = m('wave'), GA = m('gate'), CU = m('curb'), LG = m('lights'), FO = m('forget');
  const NA = m('name'), DK = m('dark'), CP = m('camp'), BRO = m('brother'), Q = m('q'), TI = m('title');
  let scene: React.ReactNode = null;
  if (f < STR) {
    const x = ease01(f, OU, STR) * 500;
    scene = (
      <g transform="translate(540 900) scale(1.25) translate(-540 -900)">
        <Yard f={f} />
        {Array.from({length: f >= FI ? 5 : 1}).map((_, i) => <Zombie key={i} who={i === 0 ? 'galina' : (['lev', 'mark', 'palych', 'vika'] as const)[i - 1]} x={250 + x * 0.7 - i * 90} y={900 + (i % 2) * 20} size={0.65} f={f} seed={i * 3} />)}
        <Runners f={f} x={560 + x} y={920} s={0.65} />
      </g>
    );
  } else if (f < BR) {
    scene = (
      <g>
        <CityStreet f={f} scroll={(f - STR) * 9} />
        <Runners f={f} x={500} y={1240} s={1} carry={f >= CA} />
      </g>
    );
  } else if (f < BI) {
    const grab = f >= HA && f < FA;
    const scroll = (f - BR) * (grab ? 0 : 6) + (f >= FA ? 0 : 0);
    const sc = f < HA ? (f - BR) * 6 : (HA - BR) * 6 + Math.max(0, f - FA) * 6;
    scene = (
      <g transform={grab ? zoom(f, HA, HA + 15, 1.4, 500, 1150) : ''}>
        <Bridge f={f} scroll={sc + scroll * 0} />
        <Runners f={f} x={500} y={1240} carry={f < FA || f > FA + 40} />
        {f >= HA && f < FA + 20 && (
          <g>
            <path d={`M760 1200 Q620 ${1230 + Math.sin(f) * 6} 520 1232`} stroke={ZSKIN.skin} strokeWidth={30} strokeLinecap="round" fill="none" />
            <circle cx={515} cy={1232} r={24} fill={ZSKIN.skinShade} />
          </g>
        )}
        {f >= FA && f < FA + 12 && <rect x={-200} y={-200} width={1480} height={2400} fill="#fff" opacity={0.3} />}
      </g>
    );
  } else if (f < STA) {
    scene = <g transform={zoom(f, BI, BI + 40, 1.15, 540, 980)}><Ankle f={f} bite={ramp(f, BI, BI + 10)} cover={ease01(f, HI + 20, HI + 70)} /></g>;
  } else if (f < CH) {
    scene = (
      <g transform={zoom(f, QU, CH, 1.2, 540, 1000)}>
        <Stadium f={f} gate={0} />
        <Soldier x={330} y={1120} s={0.75} facing={1} f={f} />
        <Soldier x={760} y={1120} s={0.75} facing={-1} f={f} />
        <Queue f={f} n={10} x0={620} y={1300} s={0.7} />
        <Runners f={f} x={1000} y={1320} s={0.7} carry />
      </g>
    );
  } else if (f < MA) {
    scene = (
      <g>
        <Stadium f={f} gate={0} />
        <Soldier x={300} y={1300} s={1.1} facing={1} f={f} />
        <P who="palych" x={620} y={1300} size={1.1} facing={-1} f={f} look={{top: '#c29479', topShade: '#9c7461'}} pose={{armF: [170, 0], armB: [170, 0], brow: 1, rim: 0.8, rimColor: '#fff6d8'}} />
        <Torch x={360} y={950} ang={10 + Math.sin(f / 8) * 12} len={500} k={1} />
      </g>
    );
  } else if (f < MO) {
    const lead = ease01(f, WA, SH);
    scene = (
      <g>
        {BG('#1a1d22')}
        <rect x={-200} y={500} width={1480} height={800} fill="#5a5c58" />
        {Array.from({length: 6}).map((_, i) => <rect key={i} x={-200 + i * 260} y={500} width={6} height={800} fill="#4a4c48" />)}
        <rect x={-200} y={1300} width={1480} height={900} fill="#2a2c2e" />
        {f < SH + 3 && <g transform={`translate(${-lead * 520} 0)`}>
          <Soldier x={500} y={1320} s={1.05} facing={-1} f={f} />
          <P who="palych" x={700} y={1320} size={1.05} facing={-1} f={f} look={{top: '#c29479', topShade: '#9c7461'}} pose={{step: f >= WA ? f / 5 : 0, brow: 1, headTilt: 18, armF: [10, 0]}} />
          <Soldier x={900} y={1320} s={1.05} facing={-1} f={f} />
        </g>}
        {f >= SH && f < SH + 8 && <rect x={-200} y={-200} width={1480} height={2400} fill="#fff" opacity={0.7 * (1 - (f - SH) / 8)} />}
      </g>
    );
  } else if (f < KN) {
    const wob = f >= FE ? Math.sin(f / 5) * 1.5 : 0;
    scene = (
      <g transform={`rotate(${wob} 540 900)`}>
        <Stadium f={f} gate={0} />
        <Queue f={f} n={8} x0={560 - ease01(f, MO, MO + 40) * 140} y={1300} s={0.85} />
        <P who="mark" x={900} y={1310} size={0.95} facing={-1} f={f} look={{...ME, skin: f >= FE ? '#b4a08c' : undefined} as never} pose={{brow: 1, lean: f >= FE ? 6 : 0}} />
        <P who="sonya" x={990} y={1310} size={0.9} facing={-1} f={f} seed={3} />
        {f >= FE && <rect x={-200} y={-200} width={1480} height={2400} fill="#5a7a4a" opacity={0.08 + 0.05 * Math.sin(f / 6)} />}
      </g>
    );
  } else if (f < LF) {
    const close = f >= AS;
    scene = (
      <g transform={close ? zoom(f, AS, AS + 25, 1.5, 560, 980) : ''}>
        <Stadium f={f} gate={0} />
        <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={0.3} />
        <P who="mark" x={420} y={1300} size={1.15} facing={1} f={f} look={{...ME, skin: '#b4a08c', skinShade: '#94806c'}} pose={{sit: 1, lean: 10, armF: [90, -40], brow: 0.8, mouth: f >= GO && f < AS ? 0.25 + 0.2 * Math.sin(f / 3) : 0, look: 0.5, lookUp: 0.2}} />
        <P who="sonya" x={680} y={1300} size={1.15} facing={-1} f={f} seed={3} pose={{brow: 0.8, look: -0.4, mouth: f >= AS && f < LI ? 0.4 : 0}} />
      </g>
    );
  } else if (f < GA) {
    scene = (
      <g>
        <Stadium f={f} gate={0} />
        <Soldier x={540} y={1300} s={1.1} facing={1} f={f} />
        <P who="sonya" x={600} y={1060} size={0.95} facing={1} f={f} seed={3} pose={{sit: 1, armF: [f >= WV - 40 ? 170 + Math.sin(f / 3) * 20 : 60, -20], look: 0.8, brow: 0.6}} />
      </g>
    );
  } else if (f < DK) {
    if (f < CU) {
      scene = <g transform={zoom(f, GA, CU, 1.15, 540, 800)}><Stadium f={f} gate={ease01(f, GA + 10, GA + 70)} /></g>;
    } else {
      const lights = 1 - ramp(f, LG, NA + 40);
      const z = ramp(f, FO, NA + 60);
      scene = (
        <g transform={zoom(f, CU, DK, 1.25, 540, 1250)}>
          <Stadium f={f} gate={1} lights={lights} />
          <rect x={-200} y={1330} width={1480} height={40} fill="#3a3c40" />
          <P who="mark" x={540} y={1340} size={1.1} facing={1} f={f} look={{...ME, skin: z > 0.5 ? ZSKIN.skin : '#b4a08c', skinShade: z > 0.5 ? ZSKIN.skinShade : '#94806c'}} pose={{sit: 1, lean: 16, headTilt: 10 + z * 14, brow: -z, blink: z > 0.8 ? 1 : undefined, look: 0.3}} />
          <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={0.6 * (1 - lights)} />
        </g>
      );
    }
  } else if (f < CP) {
    scene = BG('#000');
  } else if (f < Q) {
    scene = (
      <g>
        {BG('#9aa6b2')}
        <rect x={-200} y={900} width={1480} height={1300} fill="#6a7066" />
        <path d="M40 1100 L300 640 L560 1100 Z" fill="#5a6a4a" /><path d="M560 1100 L820 640 L1080 1100 Z" fill="#4a5a3a" />
        <rect x={-200} y={1100} width={1480} height={1100} fill="#5a6058" />
        <P who="vika" x={720} y={1300} size={1.15} facing={-1} f={f} look={{top: '#3a4430', topShade: '#2c3424'}} pose={{look: -0.4, brow: 0.3}} />
        <P who="sonya" x={420} y={1300} size={1.15} facing={1} f={f} seed={3} look={{top: '#8a5a4a', topShade: '#6a4a3a'}} pose={{look: 0.4, lookUp: 0.5, mouth: f >= BRO ? 0.3 + 0.2 * Math.sin(f / 3) : 0, smile: f >= BRO ? 0.4 : 0}} />
      </g>
    );
  } else {
    scene = BG('#000');
  }
  const clock = f >= STA && f < CU ? (f < GA ? '17:40' : '18:00') : f >= CU && f < DK ? '19:30' : '';
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {clock && <Chip x={540} y={150} text={clock} kind="white" t={1} tilt={0} size={44} />}
      {f >= FI && f < STR && <Chip x={540} y={330} text="ИХ ПЯТЕРО" kind="red" t={ramp(f, FI, FI + 10)} tilt={-2} size={44} />}
      {f >= CA && f < BR && <Chip x={540} y={330} text="6 КМ" kind="white" t={ramp(f, m('km'), m('km') + 10)} tilt={2} size={48} />}
      {f >= BI && f < HI && <Chip x={540} y={330} text="УКУС" kind="red" t={ramp(f, BI + 20, BI + 30)} tilt={-3} size={56} />}
      {f >= CH && f < MA && <Chip x={540} y={330} text="ИЩУТ УКУСЫ" kind="yellow" t={ramp(f, CH + 10, CH + 20)} tilt={-2} size={42} />}
      {f >= GO && f < AS && <Chip x={540} y={330} text="«Я ДОГОНЮ»" kind="white" t={ramp(f, GO + 60, GO + 70)} tilt={2} size={44} />}
      {f >= LI && f < LF && <Chip x={540} y={330} text="ВТОРАЯ ЛОЖЬ" kind="red" t={ramp(f, LI, LI + 10)} tilt={-2} size={44} />}
      {f >= NA && f < DK && <Chip x={540} y={330} text="СОНЯ" kind="yellow" t={ramp(f, NA + 10, NA + 20)} tilt={-2} size={60} />}
      {f >= BRO && f < Q && <Chip x={540} y={330} text="«ОН СКОРО ПРИДЁТ»" kind="white" t={ramp(f, BRO + 20, BRO + 30)} tilt={2} size={42} />}
      {f >= TI && <AbsoluteFill style={{background: C.void}}><ZmCard f={f} start={TI} ep={3} teaser="ПОСВЯЩАЕТСЯ ВСЕМ СТАРШИМ БРАТЬЯМ" final /></AbsoluteFill>}
    </AbsoluteFill>
  );
};

export const _rand = rand;
