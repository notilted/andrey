import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ApartmentBack, ApartmentFront} from '../components/Apartment';
import {Chip} from '../components/Overlay';
import {Hall, ME, P, PAPA, ZSKIN, Zombie} from '../components/Zm';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineZm2';
import {ramp, rand} from '../util';
import {ease01, SVG} from './twkit';
import {ZmCard} from './SceneZm1';

const zoom = (f: number, a: number, b: number, s: number, cx: number, cy: number) => {
  const k = ease01(f, a, b);
  return `translate(${540 + (540 - cx) * k * (s - 1)} ${900 + (900 - cy) * k * (s - 1)}) scale(${1 + k * (s - 1)}) translate(-540 -900)`;
};
const BG = (c: string) => <rect x={-200} y={-200} width={1480} height={2400} fill={c} />;

/** Рука с бинтом и следами зубов. */
const Bandage: React.FC<{f: number; teeth: number}> = ({f, teeth}) => (
  <g transform={`translate(80 800) rotate(-12) translate(${Math.sin(f / 2) * 3} 0)`}>
    {BG('#14171d')}
    <rect x={-700} y={-110} width={1100} height={220} rx={100} fill="#3a4a3a" />
    <rect x={300} y={-90} width={420} height={180} rx={90} fill="#c99f88" />
    <rect x={380} y={-96} width={300} height={192} rx={40} fill="#ece8de" />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${390 + i * 60} -96 l40 192`} stroke="#cfc9bc" strokeWidth={8} />)}
    <g opacity={teeth}>
      {Array.from({length: 9}).map((_, i) => {
        const a = Math.PI * (0.15 + i * 0.087);
        return <ellipse key={i} cx={530 + Math.cos(a) * 80} cy={-10 + Math.sin(a) * 60 - 20} rx={10} ry={14} fill="#8a1a14" opacity={0.8} />;
      })}
      <ellipse cx={530} cy={20} rx={90} ry={60} fill="#8a1a14" opacity={0.18} />
    </g>
    <ellipse cx={760} cy={0} rx={70} ry={80} fill="#c99f88" />
  </g>
);

/** Радиоприёмник крупно. */
const Radio: React.FC<{f: number}> = ({f}) => (
  <g>
    {BG('#0e1118')}
    <rect x={160} y={560} width={760} height={460} rx={40} fill="#3a3230" />
    <rect x={200} y={600} width={420} height={380} rx={24} fill="#1a1d22" />
    {Array.from({length: 10}).map((_, r) => Array.from({length: 12}).map((__, c) => <circle key={`${r}${c}`} cx={230 + c * 33} cy={630 + r * 34} r={8} fill="#0a0c10" />))}
    <rect x={660} y={620} width={220} height={90} rx={10} fill="#d9b04a" opacity={0.85} />
    {Array.from({length: 9}).map((_, i) => <rect key={i} x={672 + i * 23} y={640} width={3} height={30} fill="#3a3230" />)}
    <rect x={720 + Math.sin(f / 40) * 6} y={630} width={6} height={70} fill={C.red} />
    <circle cx={720} cy={850} r={60} fill="#2a2420" stroke="#5a4a3a" strokeWidth={8} />
    <circle cx={850} cy={850} r={40} fill="#2a2420" stroke="#5a4a3a" strokeWidth={8} />
    <circle cx={880} cy={590} r={12} fill={C.redHot} opacity={0.6 + 0.4 * Math.sin(f / 4)} />
    <path d="M780 560 L860 380" stroke="#8a8a80" strokeWidth={8} />
  </g>
);

/** Карта: дом — стадион, 6 км, красные точки. */
const RouteMap: React.FC<{f: number; t: number; danger: number}> = ({f, t, danger}) => {
  const prog = Math.min(1, t / 60);
  return (
    <g>
      {BG('#0e1218')}
      <rect x={90} y={300} width={900} height={1000} rx={24} fill="#1c222c" />
      {Array.from({length: 9}).map((_, i) => <rect key={i} x={90} y={340 + i * 110} width={900} height={14} fill="#2a3240" />)}
      {Array.from({length: 7}).map((_, i) => <rect key={`v${i}`} x={130 + i * 140} y={300} width={14} height={1000} fill="#2a3240" />)}
      <path d="M90 900 Q400 820 600 980 T990 940" stroke="#2a4a6a" strokeWidth={50} fill="none" />
      <path d="M250 1180 L250 950 L540 950 L540 700 L820 700 L820 480" stroke={C.red} strokeWidth={12} strokeDasharray="30 20" fill="none" pathLength={1} strokeDashoffset={0} opacity={0.9} style={{strokeDasharray: `${prog} 1`}} />
      <rect x={210} y={1160} width={80} height={80} rx={10} fill={C.white} />
      <text x={250} y={1214} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#14171d">⌂</text>
      <ellipse cx={820} cy={460} rx={110} ry={70} fill="none" stroke="#d9b04a" strokeWidth={14} />
      <text x={820} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#d9b04a">СТАДИОН</text>
      {Array.from({length: 26}).map((_, i) => (
        <circle key={i} cx={120 + rand(i) * 840} cy={330 + rand(i + 50) * 940} r={10 + 3 * Math.sin(f / 5 + i)} fill={C.redHot} opacity={danger * (0.6 + 0.4 * Math.sin(f / 6 + i))} />
      ))}
      <text x={560} y={1260} fontFamily={MONO} fontWeight={800} fontSize={44} fill={C.white}>6 КМ · ПЕШКОМ</text>
    </g>
  );
};

/** Ванная: плитка, зеркало, папа спиной. */
const Bathroom: React.FC<{f: number; scratch: number}> = ({f, scratch}) => (
  <g>
    {BG('#2c3a40')}
    {Array.from({length: 14}).map((_, r) => Array.from({length: 10}).map((__, c) => <rect key={`${r}${c}`} x={-40 + c * 120} y={200 + r * 90} width={116} height={86} fill={(r + c) % 2 ? '#3a4a50' : '#34444a'} />))}
    <rect x={300} y={360} width={480} height={520} rx={16} fill="#7a8a90" stroke="#c8c8c0" strokeWidth={14} />
    <rect x={320} y={380} width={440} height={480} fill="#5a6a70" />
    <ellipse cx={540} cy={560} rx={60} ry={70} fill={ZSKIN.skin} opacity={0.6} />
    <ellipse cx={520} cy={550} rx={7} ry={4} fill="#fff" opacity={0.7} /><ellipse cx={560} cy={550} rx={7} ry={4} fill="#fff" opacity={0.7} />
    {Array.from({length: 8}).map((_, i) => <path key={i} d={`M${400 + i * 40} ${420 + (i % 3) * 20} l${10 + i * 2} ${180 * Math.min(1, scratch * 1.6 - i * 0.08)}`} stroke="#e8e8e0" strokeWidth={4} opacity={Math.min(1, scratch * 1.6 - i * 0.08) > 0 ? 0.8 : 0} />)}
    <rect x={340} y={960} width={400} height={60} rx={20} fill="#e8e8e0" />
    <rect x={520} y={1020} width={40} height={260} fill="#c8c8c0" />
    <rect x={-200} y={1280} width={1480} height={900} fill="#22282c" />
    <Zombie who="evgeny" x={540} y={1300} size={1.3} facing={1} f={f} walk={false} look={{...PAPA, ...ZSKIN}}
      pose={{lean: 8, headTilt: 6, armF: [150 + Math.sin(f / 3) * 8, -20], armB: [20, 0], look: 1, rim: 0.3}} />
  </g>
);

/** Рюкзак и вещи сверху. */
const Pack: React.FC<{f: number; t: number}> = ({t}) => (
  <g>
    {BG('#2a2420')}
    {Array.from({length: 12}).map((_, i) => <rect key={i} x={-200} y={i * 180} width={1480} height={4} fill="#221c18" />)}
    <g transform={`translate(540 760) scale(${1 + Math.min(1, t / 30) * 0.05})`}>
      <rect x={-200} y={-240} width={400} height={480} rx={80} fill="#3a4a5a" />
      <rect x={-150} y={0} width={300} height={180} rx={40} fill="#2e3c4a" />
      <rect x={-60} y={-280} width={120} height={60} rx={30} fill="none" stroke="#2e3c4a" strokeWidth={18} />
    </g>
    <g opacity={ramp(t, 10, 20)}><rect x={150} y={1100} width={90} height={240} rx={30} fill="#6aa0c8" opacity={0.85} /><rect x={170} y={1070} width={50} height={40} rx={8} fill="#2a4a6a" /></g>
    <g opacity={ramp(t, 25, 35)} transform="translate(800 1200) rotate(-30)"><rect x={-40} y={-140} width={80} height={240} rx={20} fill="#2a2e36" /><rect x={-56} y={-180} width={112} height={60} rx={16} fill="#3a404b" /><circle cx={0} cy={-150} r={20} fill="#fff6d8" /></g>
    <g opacity={ramp(t, 40, 50)} transform="translate(480 1240)"><rect x={-90} y={-50} width={180} height={100} rx={10} fill="#d85445" /><text x={0} y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">+</text></g>
  </g>
);

/** Лестничная площадка: открытая дверь, ступени вниз. */
const Landing: React.FC<{f: number}> = ({f}) => (
  <g>
    {BG('#3a4a40')}
    <rect x={-200} y={-200} width={1480} height={900} fill="#c8c4b0" />
    <rect x={-200} y={690} width={1480} height={16} fill="#2a3430" />
    <rect x={-200} y={1240} width={1480} height={940} fill="#4a4440" />
    <polygon points="620,1240 1280,1240 1280,1900 1100,1900" fill="#3a3430" />
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={640 + i * 70} y={1240 + i * 80} width={700} height={14} fill="#2a2420" />)}
    <rect x={120} y={420} width={330} height={820} fill="#0a0c10" />
    <rect x={450} y={420} width={60} height={820} fill="#5a463a" transform="skewY(-8) translate(0 60)" />
    <text x={285} y={390} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#4a4a40">31</text>
    <rect x={500} y={240} width={80} height={20} fill="#e8e0b0" opacity={rand(Math.floor(f / 3)) > 0.1 ? 0.9 : 0.2} />
  </g>
);

export const SceneZm2: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const EN = m('enter'), PU = m('push'), AR = m('arm'), BA = m('bandage'), TE = m('teeth'), TL = m('tell'), RA = m('radio'), TM = m('time'), RO = m('route'), TH = m('they');
  const N0 = m('night0'), NI = m('night'), CA = m('call'), TA = m('talk'), PR = m('promise'), KE = m('key'), BT = m('bath'), SC = m('scratch'), LO = m('lock'), T2 = m('tell2');
  const PK = m('pack'), SX = m('six'), STa = m('stairs'), GA = m('galya'), TU = m('turn'), RU = m('run'), TI = m('title');
  let scene: React.ReactNode = null;
  if (f < AR) {
    scene = (
      <g>
        <Hall f={f} barricade={f < PU ? 2 - ease01(f, EN, EN + 30) * 0.6 : 1.4 + ease01(f, PU, PU + 40) * 0.6} light={0.55} />
        <P who="evgeny" x={300 + ease01(f, EN, EN + 40) * 120} y={1180} size={1.2} facing={1} f={f} look={PAPA} pose={{lean: 12, brow: 1, armF: [70, -30], armB: [-30, -40], mouth: 0.3}} />
        <P who="mark" x={820} y={1180} size={1.2} facing={-1} f={f} look={ME} pose={{brow: 0.8, look: -0.5}} />
      </g>
    );
  } else if (f < BA) {
    scene = (
      <g transform={zoom(f, AR, AR + 20, 1.6, 420, 760)}>
        <ApartmentBack f={f} lamp={0.4} />
        <P who="evgeny" x={420} y={1084} size={1.15} facing={1} f={f} look={PAPA} pose={{armB: [-40, -60], brow: 0.6, mouth: f >= m('answer') ? 0.25 + 0.2 * Math.sin(f / 3) : 0, look: 0.4}} />
        <P who="mark" x={720} y={1084} size={1.15} facing={-1} f={f} look={ME} pose={{brow: 0.9, mouth: f < m('answer') ? 0.3 : 0}} />
      </g>
    );
  } else if (f < TL) {
    scene = <g transform={zoom(f, TE, TE + 30, 1.25, 600, 800)}><Bandage f={f} teeth={ramp(f, TE - 10, TE + 10)} /></g>;
  } else if (f < RA) {
    scene = (
      <g>
        <ApartmentBack f={f} lamp={0.5} />
        <P who="evgeny" x={360} y={1084} size={1.1} facing={1} f={f} look={PAPA} pose={{sit: 1, mouth: 0.25 + 0.2 * Math.sin(f / 3), brow: 0.6, look: 0.4}} />
        <P who="mark" x={720} y={1084} size={1.1} facing={-1} f={f} look={ME} pose={{sit: 1, brow: 0.8}} />
        <P who="sonya" x={880} y={1084} size={1.05} facing={-1} f={f} seed={3} pose={{blink: 0, sit: 1, headTilt: 20, lean: -10}} />
        <ApartmentFront f={f} lamp={0.5} steam={0} />
      </g>
    );
  } else if (f < RO) {
    scene = <g transform={zoom(f, RA, RO, 1.12, 540, 800)}><Radio f={f} /></g>;
  } else if (f < N0) {
    scene = <RouteMap f={f} t={f - RO} danger={ramp(f, TH, TH + 20)} />;
  } else if (f < KE) {
    const close = f >= TA;
    scene = (
      <g transform={close ? zoom(f, TA, TA + 30, 1.5, 420, 780) : ''}>
        <ApartmentBack f={f} lamp={f < CA ? 0.12 : 0.2} />
        <P who="evgeny" x={420} y={1084} size={1.15} facing={1} f={f} look={{...PAPA, skin: '#b0a090', skinShade: '#8a7a6a'}}
          pose={{sit: 1, lean: 8 + Math.sin(f * 1.7) * (f > m('chill') ? 1.5 : 0), brow: 0.9, look: 0.9, mouth: f >= TA ? 0.2 + 0.2 * Math.sin(f / 3) : 0}} />
        {f >= CA && <P who="mark" x={760} y={1084} size={1.15} facing={-1} f={f} look={ME} pose={{sit: 1, brow: 1}} />}
        <ApartmentFront f={f} lamp={0.15} steam={0} />
        <rect x={-200} y={-200} width={1480} height={2400} fill="#05070c" opacity={1 - ramp(f, N0, N0 + 30) * 0.6} />
      </g>
    );
  } else if (f < BT) {
    scene = (
      <g>
        {BG('#0e1118')}
        <g transform="translate(540 900) rotate(-8)">
          <ellipse cx={0} cy={60} rx={330} ry={180} fill="#c29479" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={-260 + i * 120} y={-110} width={90} height={200} rx={44} fill="#b88a72" />)}
          <g opacity={ramp(f, KE + 10, KE + 24)}>
            <circle cx={60} cy={0} r={60} fill="none" stroke="#d9b04a" strokeWidth={22} />
            <rect x={110} y={-14} width={200} height={28} fill="#d9b04a" />
            <rect x={240} y={14} width={22} height={34} fill="#d9b04a" /><rect x={280} y={14} width={22} height={24} fill="#d9b04a" />
          </g>
        </g>
      </g>
    );
  } else if (f < LO) {
    scene = <g transform={zoom(f, SC, SC + 40, 1.3, 540, 600)}><Bathroom f={f} scratch={ramp(f, SC, LO)} /></g>;
  } else if (f < PK) {
    scene = (
      <g>
        {BG('#343842')}
        <rect x={-200} y={1180} width={1480} height={1000} fill="#1a1d24" />
        <rect x={300} y={360} width={360} height={820} fill="#e8e4da" stroke="#a8a8a0" strokeWidth={8} />
        <rect x={600} y={760} width={22} height={50} rx={6} fill="#8a8a80" />
        <rect x={300 + Math.sin(f * 2.3) * (f > T2 ? 3 : 0)} y={360} width={360} height={820} fill="none" />
        <P who="mark" x={760} y={1180} size={1.15} facing={-1} f={f} look={ME} pose={{armF: [70, -40], brow: 1}} />
        {f >= T2 && <P who="sonya" x={930} y={1180} size={1.1} facing={-1} f={f} seed={3} pose={{look: -0.5, lookUp: 0.6, brow: 0.6}} />}
      </g>
    );
  } else if (f < STa) {
    scene = <Pack f={f} t={f - PK} />;
  } else if (f < RU) {
    const turn = ease01(f, TU, TU + 20);
    scene = (
      <g transform={f >= GA ? zoom(f, GA, GA + 30, 1.35, 300, 900) : ''}>
        <Landing f={f} />
        <Zombie who="galina" x={300 + turn * 40} y={1240} size={1.15} facing={turn > 0.5 ? 1 : -1} f={f} walk={f > TU + 20} pose={{headTilt: 20 - turn * 30}} />
        <P who="mark" x={900} y={1240} size={1.15} facing={-1} f={f} look={ME} pose={{brow: 1, armB: [40, -20]}} />
        <P who="sonya" x={1010} y={1240} size={1.1} facing={-1} f={f} seed={3} pose={{brow: 1}} />
      </g>
    );
  } else if (f < TI) {
    const x = ease01(f, RU, RU + 70);
    scene = (
      <g>
        <Landing f={f} />
        <Zombie who="galina" x={420 + x * 300} y={1240} size={1.15} facing={1} f={f} />
        <P who="mark" x={900 + x * 400} y={1240 + x * 300} size={1.15} facing={1} f={f} look={ME} pose={{step: f / 2.5, armF: [60, -60], armB: [-50, -40], brow: 1}} />
        <P who="sonya" x={780 + x * 420} y={1240 + x * 300} size={1.1} facing={1} f={f} seed={3} pose={{step: f / 2.2, armF: [60, -60], brow: 1, mouth: 0.6}} />
      </g>
    );
  }
  const clock = f >= N0 && f < BT ? (f < CA ? '01:20' : '03:00') : f >= BT && f < PK ? '09:00' : f >= PK && f < TI ? '12:00' : '';
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {clock && <Chip x={540} y={150} text={clock} kind="white" t={1} tilt={0} size={44} />}
      {f >= AR && f < BA && <Chip x={540} y={330} text="«ПОРЕЗАЛСЯ О СТЕКЛО»" kind="white" t={ramp(f, m('answer'), m('answer') + 10)} tilt={2} size={38} />}
      {f >= TE && f < TL && <Chip x={540} y={330} text="СЛЕДЫ ЗУБОВ" kind="red" t={ramp(f, TE, TE + 10)} tilt={-3} size={48} />}
      {f >= TL && f < RA && <Chip x={540} y={330} text={f < m('bridges') ? 'ГОРОД ЗАКРЫТ' : f < m('mama') ? 'МОСТЫ ПЕРЕКРЫТЫ' : 'МАМА — В БОЛЬНИЦЕ'} kind={f < m('mama') ? 'white' : 'red'} t={1} tilt={-2} size={38} />}
      {f >= TM && f < RO && <Chip x={540} y={330} text="СТАДИОН · ЗАВТРА 18:00" kind="yellow" t={ramp(f, TM, TM + 10)} tilt={-2} size={40} />}
      {f >= PR && f < KE && <Chip x={540} y={330} text="«ОБЕЩАЙ»" kind="white" t={ramp(f, PR + 60, PR + 70)} tilt={2} size={46} />}
      {f >= SX && f < STa && <Chip x={540} y={330} text="ДО ТРАНСПОРТА 6 ЧАСОВ" kind="red" t={ramp(f, SX, SX + 10)} tilt={-2} size={40} />}
      {f >= RU && f < TI && <Chip x={540} y={330} text="«БЕГИ»" kind="red" t={ramp(f, RU, RU + 8)} tilt={-3} size={60} />}
      {f >= TI && <AbsoluteFill style={{background: C.void}}><ZmCard f={f} start={TI} ep={2} teaser="ШЕСТЬ КИЛОМЕТРОВ ДО СТАДИОНА" /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
