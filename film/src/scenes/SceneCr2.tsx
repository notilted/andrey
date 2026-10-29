import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PaperCloseup} from '../components/Bm';
import {Chip} from '../components/Overlay';
import {Glow, Shake, Toon, ToonLook, ToonPose} from '../components/Toon';
import {C, FONT} from '../theme';
import {mk} from '../timelineCr2';
import {easeOut, ramp} from '../util';
import {Capital, Choice, Ladder} from './SceneCr1';
import {ease01, SVG} from './twkit';

/** «Из низов», серия 2 «Сумка» — тун-стиль, рассказ от первого лица. */

export const HERO: ToonLook = {skin: '#e2b494', skinD: '#c99878', hair: '#171a21', top: '#4a5a78', topD: '#3a4862', legs: '#262b36', legsD: '#1e222c', shoes: '#e8e4da', messy: true, hoodie: true, scale: 0.92};
export const DON: ToonLook = {skin: '#f0c8a8', skinD: '#dcb090', hair: '#e8e4da', top: '#f6f4ee', topD: '#dcd8ce', legs: '#f0eee6', legsD: '#d8d4ca', shoes: '#4a2a1a', mustache: true, bald: true, hat: '#f2f0e8', tie: '#c83030', scale: 1.08};
export const GUARD: ToonLook = {skin: '#d8a888', skinD: '#c09070', hair: '#14110e', top: '#2a2a3a', topD: '#1e1e2c', legs: '#22222e', legsD: '#1a1a24', shoes: '#0a0a10', scale: 1.1};
const GRANNY: ToonLook = {skin: '#f0cdb0', skinD: '#dcb498', hair: '#c8c8c8', top: '#8a4a6a', topD: '#743a58', legs: '#3a2a3a', legsD: '#2e2030', shoes: '#2a1a1a', scarf: '#d86a4a', scale: 0.85};
const SCAR: ToonLook = {skin: '#c89070', skinD: '#b07a5a', hair: '#14110e', top: '#e8e4da', topD: '#c8c4b8', legs: '#3a4a5a', legsD: '#2e3c4a', shoes: '#1a1410', scar: true, mustache: true, scale: 1.12};
const CHINO: ToonLook = {skin: '#c89070', skinD: '#b07a5a', hair: '#14110e', top: '#d84a3a', topD: '#b83a2c', legs: '#2a3446', legsD: '#222a3a', shoes: '#e8e4da', scale: 0.92};

const zoom = (f: number, a: number, b: number, s: number, cx: number, cy: number) => {
  const k = ease01(f, a, b);
  return `translate(${540 + (540 - cx) * k * (s - 1)} ${900 + (900 - cy) * k * (s - 1)}) scale(${1 + k * (s - 1)}) translate(-540 -900)`;
};

/** Сумка (спортивная). */
const Bag: React.FC<{x: number; y: number; s?: number; shake?: number; f: number}> = ({x, y, s = 1, shake = 0, f}) => (
  <g transform={`translate(${x + Math.sin(f * 2.3) * 8 * shake} ${y}) rotate(${Math.sin(f * 1.9) * 6 * shake}) scale(${s})`}>
    <path d="M-60 -60 Q0 -130 60 -60" stroke="#1a1d22" strokeWidth={12} fill="none" />
    <rect x={-110} y={-62} width={220} height={120} rx={40} fill="#2a2e36" />
    <rect x={0} y={-62} width={110} height={120} rx={40} fill="#20242a" />
    <rect x={-110} y={-20} width={220} height={8} fill="#d9b04a" />
  </g>
);

/** Будильник. */
const Clock: React.FC<{x: number; y: number; s?: number; f: number}> = ({x, y, s = 1, f}) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(f * 2.5) * 5}) scale(${s})`}>
    <circle cx={-46} cy={-58} r={26} fill="#c83030" /><circle cx={46} cy={-58} r={26} fill="#c83030" />
    <circle r={70} fill="#d84040" /><circle r={54} fill="#f6f4ee" />
    <path d="M0 0 L0 -36 M0 0 L26 10" stroke="#14171d" strokeWidth={7} strokeLinecap="round" />
    <path d="M-40 66 l-14 20 M40 66 l14 20" stroke="#14171d" strokeWidth={8} strokeLinecap="round" />
  </g>
);

const Garage: React.FC<{f: number; inside: boolean}> = ({f, inside}) => inside ? (
  <g>
    <Glow f={f} c1="#5a4a3a" c2="#120e14" cy={700} id="gin" />
    <polygon points="540,240 280,1300 800,1300" fill="#fff2c8" opacity={0.1} />
    <rect x={530} y={-200} width={20} height={440} fill="#14171d" />
    <path d="M480 240 L600 240 L580 270 L500 270 Z" fill="#3a3a44" />
    <circle cx={540} cy={280} r={18} fill="#fff2c8" />
    <rect x={-200} y={1300} width={1480} height={900} fill="#1e1a1e" />
    <rect x={-200} y={1300} width={1480} height={900} fill="#000" opacity={0.2} />
    {[60, 900].map((x) => <g key={x}><rect x={x} y={1110} width={120} height={190} rx={10} fill="#8a2a24" /><rect x={x + 60} y={1110} width={60} height={190} fill="#000" opacity={0.15} /></g>)}
  </g>
) : (
  <g>
    <Glow f={f} c1="#ffb27a" c2="#5a3a6a" cy={420} id="gout" />
    <rect x={120} y={600} width={840} height={700} fill="#c8a07a" />
    <rect x={540} y={600} width={420} height={700} fill="#000" opacity={0.1} />
    <rect x={200} y={760} width={680} height={540} fill="#6a6a74" />
    {Array.from({length: 12}).map((_, i) => <rect key={i} x={200} y={770 + i * 44} width={680} height={6} fill="#4a4a54" />)}
    <rect x={300} y={650} width={480} height={80} rx={10} fill="#2a2a3a" />
    <text x={540} y={706} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#d9b04a">SANTA ANA</text>
    <rect x={-200} y={1300} width={1480} height={900} fill="#8a6a5a" />
  </g>
);

const Bus: React.FC<{f: number}> = ({f}) => (
  <g transform={`translate(0 ${Math.abs(Math.sin(f / 4)) * 4})`}>
    <Glow f={f} c1="#7ab0c8" c2="#2a3a5a" cy={500} id="gbus" />
    <rect x={-200} y={-200} width={1480} height={520} fill="#3a4a6a" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={-80 + i * 420} y={360} width={360} height={360} rx={30} fill="#bfe4f2" />
        <rect x={-80 + i * 420 - ((f * 14) % 600)} y={560} width={200} height={160} fill="#7aa86a" opacity={0.7} />
        <rect x={-80 + i * 420} y={360} width={360} height={360} rx={30} fill="none" stroke="#2a3a5a" strokeWidth={16} />
      </g>
    ))}
    <rect x={-200} y={720} width={1480} height={1600} fill="#5a6a8a" />
    <rect x={-200} y={1300} width={1480} height={900} fill="#3a4258" />
    {[200, 880].map((x) => <g key={x}><rect x={x - 150} y={900} width={300} height={260} rx={30} fill="#c84a3a" /><rect x={x - 170} y={1120} width={340} height={70} rx={20} fill="#a83a2c" /></g>)}
  </g>
);

const Port: React.FC<{f: number}> = ({f}) => (
  <g>
    <Glow f={f} c1="#ffd08a" c2="#3a5a8a" cy={420} id="gport" />
    <rect x={-200} y={720} width={1480} height={320} fill="#2a6a9a" />
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={-200 + ((i * 220 + f * 2) % 1600)} y={760 + (i % 3) * 70} width={90} height={8} rx={4} fill="#fff" opacity={0.3} />)}
    <path d="M760 720 L760 300 L1000 300 L1000 330 L790 330 L790 720 Z" fill="#d9a03a" />
    <rect x={900} y={330} width={8} height={200} fill="#2a2a2a" />
    {[['#c84a3a', 40], ['#3a7ab0', 300], ['#3a9a6a', 170]].map(([c, x], i) => <rect key={i} x={x as number} y={i === 2 ? 820 : 900} width={240} height={i === 2 ? 80 : 140} fill={c as string} />)}
    <rect x={-200} y={1040} width={1480} height={1100} fill="#8a8a86" />
    <rect x={-200} y={1040} width={1480} height={22} fill="#5a5a56" />
  </g>
);

const Gate: React.FC<{f: number}> = ({f}) => (
  <g>
    <Glow f={f} c1="#ffb27a" c2="#3a2a4a" cy={600} id="ggate" />
    <rect x={-200} y={1300} width={1480} height={900} fill="#8a8a86" />
    {Array.from({length: 13}).map((_, i) => <rect key={i} x={-120 + i * 100} y={640} width={14} height={660} fill="#2a2a32" />)}
    <rect x={-200} y={640} width={1480} height={20} fill="#2a2a32" />
    <rect x={-200} y={960} width={1480} height={14} fill="#2a2a32" />
    <rect x={300} y={540} width={480} height={90} rx={10} fill="#2a2a32" />
    <text x={540} y={602} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#d9b04a">PUERTO</text>
  </g>
);

const Notes: React.FC<{f: number; x: number; y: number}> = ({f, x, y}) => (
  <g>
    {[0, 1, 2].map((i) => {
      const t = ((f + i * 20) % 60) / 60;
      return <text key={i} x={x + i * 40 + Math.sin(t * 6) * 20} y={y - t * 220} fontFamily={FONT} fontWeight={900} fontSize={64} fill="#fff" opacity={1 - t}>♪</text>;
    })}
  </g>
);

export const SceneCr2: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const VO = m('vote'), GA = m('garage'), SM = m('smell'), IN = m('inside'), R1 = m('rule1'), NO = m('nod'), BA = m('bag'), R2 = m('rule2');
  const HO = m('hold'), SH = m('shake'), TI = m('ticking'), EF = m('efm'), BU = m('bus'), GR = m('granny'), CR = m('cross'), R3 = m('rule3'), WH = m('whistle');
  const PO = m('port'), SC = m('scar'), OP = m('open'), CL = m('clock'), NT = m('note'), CA = m('call'), PL = m('plus'), RK = m('rank'), CH = m('chino'), AS = m('ask'), CX = m('choice');
  const P = (o: ToonPose): ToonPose => o;
  let scene: React.ReactNode = null;
  if (f < GA) {
    scene = (
      <g>
        <Glow f={f} c1="#8a5ad8" c2="#1a0e2a" cy={700} id="gvote" />
        <Toon id="h0" x={540} y={2150} s={2.4} f={f} look={HERO} pose={P({eyes: 'half', mouth: f < m('thanks') ? 'line' : 'smirk', talk: f < m('thanks') ? 0.25 + 0.25 * Math.sin(f / 2.5) : 0, brow: -0.6, armL: [10, 0], armR: [10, 0]})} />
      </g>
    );
  } else if (f < IN) {
    scene = (
      <g>
        <Garage f={f} inside={false} />
        <Toon id="h1" x={540} y={1440} s={0.95} f={f} look={HERO} pose={P({eyes: f >= SM ? 'closed' : 'open', mouth: f >= SM ? 'fear' : 'line', armR: f >= SM ? [150, -80] : [18, 8], look: 0.3})} />
        {f >= SM && [0, 1, 2].map((i) => <path key={i} d={`M${600 + i * 40} ${880 - ((f * 2 + i * 30) % 120)} q20 -30 0 -60 q-20 -30 0 -60`} stroke="#9ad87a" strokeWidth={8} fill="none" opacity={0.8} />)}
      </g>
    );
  } else if (f < HO) {
    const nod = f >= NO && f < BA ? Math.sin((f - NO) / 2) * 14 : 0;
    const give = ease01(f, BA, BA + 30);
    scene = (
      <g transform={f >= R1 && f < NO ? zoom(f, R1, R1 + 25, 1.2, 600, 1000) : ''}>
        <Garage f={f} inside />
        <Toon id="g1" x={90} y={1300} f={f} look={GUARD} pose={P({eyes: 'half', mouth: 'line', brow: -1, armL: [10, 30], armR: [10, 30]})} />
        <Toon id="g2" x={1010} y={1300} facing={-1} f={f} look={GUARD} pose={P({eyes: 'half', mouth: 'line', brow: -1, armL: [10, 30], armR: [10, 30]})} />
        <Toon id="don" x={700} y={1320} f={f} facing={-1} look={DON} pose={P({eyes: 'half', mouth: 'smirk', talk: (f >= R1 && f < NO) || (f >= R2 && f < HO) ? 0.2 + 0.25 * Math.sin(f / 2.5) : 0, armR: f >= BA ? [70 - give * 20, -10] : [18, 8]})} />
        <Toon id="h2" x={330 + give * 60} y={1360} f={f} look={HERO} pose={P({eyes: 'wide', mouth: 'fear', sweat: true, lean: nod, armR: f >= BA ? [60, -20] : [18, 8], look: 0.6})} />
        {f >= BA && <Bag x={560 - give * 90} y={1080 + give * 40} s={0.8} f={f} />}
      </g>
    );
  } else if (f < BU) {
    const close = f >= TI;
    scene = (
      <g transform={close ? zoom(f, TI, TI + 20, 1.5, 540, 1150) : ''}>
        <Glow f={f} c1={close ? '#c8404a' : '#5a4a7a'} c2="#120a18" cy={800} id="ghold" />
        {f >= SH && <Shake x={540} y={1100} w={200} f={f} />}
        <Toon id="h3" x={540} y={1500} s={1.15} f={f} look={HERO} pose={P({eyes: f >= EF ? 'wide' : 'open', mouth: f >= EF ? 'open' : 'fear', sweat: f >= TI, shake: f >= SH, armL: [40, -60], armR: [40, -60], brow: f >= TI ? 1 : 0.4})} />
        <Bag x={540} y={1210} s={1.1} shake={f >= SH ? 1 : 0} f={f} />
        {f >= TI && <text x={760} y={1080} fontFamily={FONT} fontWeight={900} fontSize={60} fill="#ffd23a" transform={`rotate(-12 760 1080)`} opacity={Math.floor(f / 8) % 2 ? 1 : 0.4}>ТИК-ТАК</text>}
      </g>
    );
  } else if (f < PO) {
    const cross = f >= CR ? Math.sin((f - CR) / 3) : 0;
    scene = (
      <g transform={f >= GR && f < R3 ? zoom(f, GR, GR + 30, 1.3, 860, 1000) : ''}>
        <Bus f={f} />
        <Toon id="h4" x={200} y={1300} s={0.95} f={f} look={HERO} pose={P({sit: 1, eyes: f >= R3 ? 'half' : 'side', look: 0.7, mouth: f >= WH ? 'open' : 'line', talk: 0, sweat: true, armL: [40, 50], armR: [40, 50]})} />
        <Bag x={300} y={1150} s={0.7} f={f} />
        <Toon id="gr" x={880} y={1300} s={0.95} facing={-1} f={f} look={GRANNY} pose={P({sit: 1, eyes: f >= GR ? 'wide' : 'half', mouth: f >= CR ? 'fear' : 'line', look: f >= GR ? -0.8 : 0, armR: f >= CR ? [150 + cross * 15, -110] : [40, 50], armL: [40, 50]})} />
        {f >= WH && <Notes f={f} x={300} y={760} />}
      </g>
    );
  } else if (f < CA) {
    const open = ease01(f, OP, OP + 15);
    scene = (
      <g transform={f >= CL ? zoom(f, CL, CL + 15, 1.6, 540, 1150) : ''}>
        <Port f={f} />
        <Toon id="sc" x={720} y={1400} f={f} facing={-1} look={SCAR} pose={P({eyes: 'half', mouth: f >= CL ? 'grin' : 'line', brow: -0.8, armR: [70, -20]})} />
        <Toon id="h5" x={300} y={1420} f={f} look={HERO} pose={P({eyes: 'wide', mouth: 'fear', sweat: true})} />
        <Bag x={520} y={1260} s={0.85} f={f} />
        {f >= OP && <rect x={430} y={1190} width={180 * open} height={14} fill="#14171d" />}
        {f >= CL && <Clock x={520} y={1180 - easeOut(ramp(f, CL, CL + 12)) * 100} s={0.9} f={f} />}
      </g>
    );
  } else if (f < CH) {
    scene = (
      <g>
        <Glow f={f} c1="#5ad08a" c2="#0e1a14" cy={760} id="gcall" />
        <Toon id="h6" x={540} y={1650} s={1.6} f={f} look={HERO} pose={P({eyes: f >= RK ? 'half' : 'open', mouth: f >= PL ? 'grin' : 'line', armR: [150, -150], armL: [10, 0]})} />
        <rect x={642} y={690} width={56} height={110} rx={12} fill="#14171d" transform="rotate(15 670 745)" />
      </g>
    );
  } else if (f < CX) {
    scene = (
      <g transform={zoom(f, AS, CX, 1.25, 760, 1000)}>
        <Gate f={f} />
        <Toon id="ch" x={760} y={1380} f={f} facing={-1} look={CHINO} pose={P({eyes: 'side', look: -0.6, mouth: 'line', armL: [10, 20], armR: [150, -40]})} />
        <Toon id="h7" x={260} y={1400} f={f} look={HERO} pose={P({eyes: 'wide', mouth: 'fear', look: 0.8, sweat: true})} />
      </g>
    );
  } else {
    scene = <Gate f={f} />;
  }
  const cash = f < PL ? 500 : 700;
  const step = f < RK ? 0 : 1;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f >= NT && f < CA && <AbsoluteFill><PaperCloseup t={f - NT} kind="note" title="" lines={['Не открыл.', '', 'Добро пожаловать.']} /></AbsoluteFill>}
      {f < CX && <Ladder step={step} opacity={ramp(f, 10, 20)} />}
      {f < CX && <Capital value={cash} up={f >= PL && f < PL + 40} opacity={ramp(f, 10, 20)} />}
      {f < GA && <Chip x={540} y={640} text="ВЫ ВЫБРАЛИ: 1 — ГАРАЖ" kind="yellow" t={ramp(f, 4, 14)} tilt={-2} size={44} />}
      {f >= GA && f < IN && <Chip x={540} y={640} text="06:00 · САНТА-АНА" kind="white" t={ramp(f, GA, GA + 10)} tilt={0} size={40} />}
      {f >= R1 && f < BA && <Chip x={540} y={640} text="ПРАВИЛО №1: НЕ ЗАДАВАЙ ВОПРОСОВ" kind="red" t={ramp(f, R1, R1 + 10)} tilt={-2} size={34} />}
      {f >= R2 && f < TI && <Chip x={540} y={640} text="ПРАВИЛО №2: НЕ ОТКРЫВАЙ" kind="red" t={ramp(f, R2, R2 + 10)} tilt={2} size={38} />}
      {f >= R3 && f < PO && <Chip x={540} y={640} text="ПРАВИЛО №3: ВЫГЛЯДИ СПОКОЙНО" kind="red" t={ramp(f, R3, R3 + 10)} tilt={-2} size={36} />}
      {f >= SC && f < OP && <Chip x={720} y={640} text="МУЖИК СО ШРАМОМ" kind="white" t={ramp(f, SC, SC + 10)} tilt={2} size={36} />}
      {f >= RK && f < CH && <Chip x={540} y={640} text="ТЕПЕРЬ ТЫ — ПОСЫЛЬНЫЙ" kind="yellow" t={ramp(f, RK, RK + 10)} tilt={-2} size={40} />}
      {f >= CH && f < CX && <Chip x={760} y={640} text="ЧИНО ВСЁ ВИДЕЛ" kind="red" t={ramp(f, CH + 10, CH + 20)} tilt={2} size={40} />}
      {f >= CX && <Choice f={f} start={CX} a="СДАТЬ ЧИНО ДОНУ" b="СОВРАТЬ ДОНУ" />}
    </AbsoluteFill>
  );
};

export const _C = C;
