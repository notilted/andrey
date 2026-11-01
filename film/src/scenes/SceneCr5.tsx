import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Toon, ToonLook} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineCr5';
import {easeOut, ramp, rand} from '../util';
import {Capital, Choice, Ladder} from './SceneCr1';
import {HERO} from './SceneCr2';
import {ease01, SVG} from './twkit';

/** «Из низов», серия 5 «Вспышка» — ветка «взять Лусию». */

const LUCIA: ToonLook = {skin: '#f0c8a8', skinD: '#dcb090', hair: '#3a1a14', top: '#c8304a', topD: '#a8243a', legs: '#2a2a3a', legsD: '#22222e', shoes: '#14110e', longHair: true, scale: 0.9};
const MENDOSA: ToonLook = {skin: '#c89070', skinD: '#b07a5a', hair: '#14110e', top: '#2a6a5a', topD: '#1e544a', legs: '#1e2a2a', legsD: '#162020', shoes: '#0a0a0a', shades: true, chain: true, mustache: true, scale: 1.1};
const CHINO: ToonLook = {skin: '#c89070', skinD: '#b07a5a', hair: '#14110e', top: '#d84a3a', topD: '#b83a2c', legs: '#2a3446', legsD: '#222a3a', shoes: '#e8e4da', scale: 0.92};
const LADDER = ['ЧИСТИЛЬЩИК', 'ПОСЫЛЬНЫЙ', 'КУРЬЕР', 'ВОДИТЕЛЬ', 'ПРАВАЯ РУКА', 'НАСЛЕДНИК', 'БОСС'];

const zoom = (f: number, a: number, b: number, s: number, cx: number, cy: number) => {
  const k = ease01(f, a, b);
  return `translate(${540 + (540 - cx) * k * (s - 1)} ${900 + (900 - cy) * k * (s - 1)}) scale(${1 + k * (s - 1)}) translate(-540 -900)`;
};

/** Ночная улица за лобовым стеклом (огни уезжают). */
const NightStreet: React.FC<{f: number; speed: number}> = ({f, speed}) => (
  <g>
    <Glow f={f} c1="#2a2a5a" c2="#05060c" cy={600} id="gns" />
    {Array.from({length: 14}).map((_, i) => {
      const x = ((i * 173 - f * speed * 6) % 1500 + 1500) % 1500 - 200;
      return <g key={i}><rect x={x} y={300 + (i % 4) * 60} width={120} height={500} fill={['#1a1a30', '#22223a', '#14142a'][i % 3]} />{[0, 1, 2].map((r) => <rect key={r} x={x + 20} y={340 + (i % 4) * 60 + r * 120} width={30} height={40} fill={rand(i * 3 + r) > 0.5 ? C.warm : '#0e0e1e'} opacity={0.7} />)}</g>;
    })}
    {Array.from({length: 8}).map((_, i) => <circle key={`l${i}`} cx={((i * 260 - f * speed * 10) % 1400 + 1400) % 1400 - 100} cy={260} r={10} fill="#fff2c8" opacity={0.8} />)}
  </g>
);

/** Салон машины спереди: водитель слева, пассажир справа. */
const CarInside: React.FC<{f: number; driver: 'hero' | 'lucia'; speed: number; hero?: object; lucia?: object; bump?: number}> = ({f, driver, speed, hero = {}, lucia = {}, bump = 0}) => {
  const b = Math.sin(f * 1.7) * bump * 6;
  const left = driver === 'hero' ? 'hero' : 'lucia';
  const who = (side: 'hero' | 'lucia', x: number) => side === 'hero'
    ? <Toon id={`h${x}`} x={x} y={1430 + b} s={1.15} f={f} look={HERO} pose={{sit: 1, armL: [70, -60], armR: [70, -60], ...hero}} />
    : <Toon id={`l${x}`} x={x} y={1430 + b} s={1.2} f={f} facing={-1} look={LUCIA} pose={{sit: 1, armL: [70, -60], armR: [70, -60], ...lucia}} />;
  return (
    <g>
      <NightStreet f={f} speed={speed} />
      <rect x={-200} y={-200} width={1480} height={2400} fill="#0a0c14" opacity={0.35} />
      {who(left, 330)}
      {who(left === 'hero' ? 'lucia' : 'hero', 770)}
      <g transform={`translate(330 ${1300 + b})`}><circle r={110} fill="none" stroke="#2a2e36" strokeWidth={22} /><path d="M-110 0 L110 0 M0 0 L0 110" stroke="#2a2e36" strokeWidth={16} /></g>
      <rect x={-200} y={1250 + b} width={1480} height={700} fill="#1a1d24" />
      <rect x={-200} y={1250 + b} width={1480} height={30} fill="#2a2e36" />
      <path d={`M-200 120 L1280 120 L1280 -200 L-200 -200 Z`} fill="#0e1016" />
      <rect x={-200} y={110} width={1480} height={20} fill="#2a2e36" />
    </g>
  );
};

/** Прачечная Мендосы. */
const Laundry: React.FC<{f: number; flash: number}> = ({f, flash}) => (
  <g>
    <Glow f={f} c1="#2a2a5a" c2="#05060c" cy={500} id="glau" />
    <rect x={80} y={420} width={920} height={900} fill="#2a2a3a" />
    <rect x={540} y={420} width={460} height={900} fill="#000" opacity={0.15} />
    <rect x={160} y={480} width={760} height={110} rx={10} fill="#3a2a4a" />
    <text x={540} y={555} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#7ac8f0" opacity={0.5 + 0.5 * (Math.floor(f / 7) % 2)}>LAVANDERÍA</text>
    <defs><clipPath id="win5"><rect x={180} y={680} width={720} height={480} /></clipPath></defs>
    <rect x={180} y={680} width={720} height={480} fill="#f2d890" />
    <g clipPath="url(#win5)">
      {[0, 1, 2].map((i) => <g key={i}><rect x={220 + i * 230} y={940} width={180} height={220} rx={20} fill="#d8d4cc" /><circle cx={310 + i * 230} cy={1050} r={60} fill="#9ab8c8" /></g>)}
      <Toon id="ch5" x={420} y={1360} s={0.9} f={f} look={CHINO} pose={{eyes: 'side', look: 0.6, mouth: 'line', armR: [70, -40]}} />
      <Toon id="me5" x={700} y={1360} s={0.9} facing={-1} f={f} look={MENDOSA} pose={{eyes: 'half', mouth: 'smirk', armL: [60, -30]}} />
    </g>
    <rect x={180} y={680} width={720} height={480} fill="none" stroke="#1a1a2a" strokeWidth={18} />
    <rect x={-200} y={1320} width={1480} height={900} fill="#14141e" />
    <rect x={-200} y={-200} width={1480} height={2400} fill="#fff" opacity={flash} />
  </g>
);

/** Погоня: машина сбоку, фары сзади. */
const Chase: React.FC<{f: number; lost: number}> = ({f, lost}) => (
  <g>
    <NightStreet f={f} speed={4} />
    <rect x={-200} y={1150} width={1480} height={900} fill="#1a1a24" />
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={((i * 220 - f * 40) % 1600 + 1600) % 1600 - 200} y={1260} width={110} height={12} fill="#d9b04a" opacity={0.6} />)}
    <g transform={`translate(${-160 - lost * 500} 1140)`} opacity={1 - lost}>
      <polygon points="200,-30 900,-160 900,100" fill="#fff6d8" opacity={0.15} />
      <rect x={-200} y={-80} width={380} height={110} rx={30} fill="#2a2a32" />
      <circle cx={180} cy={-20} r={20} fill="#fff6d8" />
    </g>
    <g transform={`translate(${620 + Math.sin(f / 3) * 10} 1140)`}>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-380 - i * 30} y={-60 + i * 28} width={140} height={8} rx={4} fill="#fff" opacity={0.5} />)}
      <rect x={-220} y={-110} width={440} height={130} rx={40} fill="#c8a03a" />
      <path d="M-140 -110 L-90 -190 L120 -190 L170 -110 Z" fill="#a8842a" />
      <rect x={-80} y={-180} width={90} height={60} rx={8} fill="#1a1d24" /><rect x={20} y={-180} width={90} height={60} rx={8} fill="#1a1d24" />
      <circle cx={-130} cy={30} r={44} fill="#111" /><circle cx={130} cy={30} r={44} fill="#111" />
    </g>
  </g>
);

export const SceneCr5: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const NI = m('night'), ST = m('stall'), SR = m('stare'), MV = m('move'), R6 = m('rule6'), AD = m('addr'), CH = m('chino'), ME = m('mendosa');
  const CA = m('camera'), FL = m('flash'), EF = m('efm'), DO = m('door'), GO = m('go'), LI = m('lights'), CS = m('chase'), SC = m('scream'), LO = m('lost');
  const HO = m('house'), WH = m('whisper'), R4 = m('rule4'), CX = m('choice');
  let scene: React.ReactNode = null;
  if (f < NI) {
    scene = <Glow f={f} c1="#5a2a6a" c2="#0a0810" cy={700} id="gres5" />;
  } else if (f < AD) {
    const stalled = f >= ST && f < MV;
    scene = (
      <g transform={f >= SR && f < MV ? zoom(f, SR, SR + 20, 1.35, 770, 900) : ''}>
        <CarInside f={f} driver={f < MV + 15 ? 'hero' : 'lucia'} speed={stalled ? 0 : 1}
          hero={{eyes: stalled ? 'wide' : 'open', mouth: stalled ? 'fear' : 'line', sweat: stalled, look: f >= SR ? 0.8 : 0}}
          lucia={{eyes: 'half', mouth: f >= MV && f < R6 ? 'open' : 'line', brow: -0.6, look: f >= SR ? 0.8 : 0}} />
      </g>
    );
  } else if (f < CA) {
    scene = <g transform={f >= CH ? zoom(f, CH, CH + 30, 1.4, 540, 960) : ''}><Laundry f={f} flash={0} /></g>;
  } else if (f < DO) {
    const fl = f >= FL ? Math.max(0, 1 - (f - FL) / 12) : 0;
    scene = (
      <g>
        {f < FL ? (
          <g>
            <Glow f={f} c1="#2a2a5a" c2="#05060c" cy={700} id="gcam" />
            <g transform="translate(540 980)">
              <rect x={-260} y={-170} width={520} height={340} rx={40} fill="#e8e4da" />
              <rect x={-260} y={60} width={520} height={110} rx={20} fill="#2a2a32" />
              <circle r={110} fill="#1a1d22" /><circle r={70} fill="#3a4a6a" /><circle cx={-20} cy={-20} r={20} fill="#fff" opacity={0.5} />
              <rect x={150} y={-140} width={70} height={50} rx={8} fill="#2a2a32" />
              <rect x={-230} y={-140} width={100} height={40} rx={8} fill={C.red} />
            </g>
          </g>
        ) : <Laundry f={f} flash={fl} />}
              </g>
    );
  } else if (f < CS) {
    scene = f < GO ? <Laundry f={f} flash={0} /> : (
      <CarInside f={f} driver="lucia" speed={3} bump={1} hero={{eyes: 'wide', mouth: 'fear', sweat: true, brow: 1}} lucia={{eyes: 'half', mouth: 'line', brow: -1}} />
    );
  } else if (f < HO) {
    scene = f < SC ? <Chase f={f} lost={0} /> : f < LO ? (
      <CarInside f={f} driver="lucia" speed={4} bump={1.5} hero={{eyes: 'closed', mouth: 'open', talk: 0.8, sweat: true, armR: [160, -30], armL: [160, -30]}} lucia={{eyes: 'half', mouth: 'smirk', brow: -1}} />
    ) : <Chase f={f} lost={ease01(f, LO, LO + 40)} />;
  } else if (f < CX) {
    scene = (
      <g transform={f >= WH ? zoom(f, WH, WH + 30, 1.6, 330, 950) : ''}>
        <CarInside f={f} driver="lucia" speed={0} hero={{eyes: f >= R4 ? 'wide' : 'open', mouth: f >= R4 ? 'fear' : 'line', look: -0.8, sweat: f >= R4}} lucia={{eyes: 'half', mouth: f >= WH && f < R4 ? 'open' : 'line', brow: 0.6, look: 0.8, talk: f >= WH && f < R4 ? 0.15 + 0.15 * Math.sin(f / 3) : 0}} />
      </g>
    );
  } else {
    scene = <Glow f={f} c1="#3a2a5a" c2="#0a0810" cy={700} id="gch5" />;
  }
  const l = f - 4;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < NI && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#ffd23a', letterSpacing: 2, opacity: ramp(l, 0, 10)}}>ИТОГИ ГОЛОСОВАНИЯ</div>
          {[['1 — ПОЕХАТЬ ОДНОМУ', 46, '6', C.white, 8], ['2 — ВЗЯТЬ ЛУСИЮ', 54, '7', '#ffd23a', 18]].map(([lab, pct, v, col, d]) => (
            <div key={lab as string} style={{width: 860, marginTop: 30, opacity: ramp(l, d as number, (d as number) + 10)}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white}}><span>{lab}</span><span style={{fontFamily: MONO}}>{v}</span></div>
              <div style={{marginTop: 10, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.12)'}}><div style={{width: `${(pct as number) * easeOut(ramp(l, (d as number) + 6, (d as number) + 30))}%`, height: '100%', borderRadius: 22, background: col as string}} /></div>
            </div>
          ))}
          <div style={{marginTop: 46, padding: '14px 34px', borderRadius: 26, background: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#14171d', opacity: ramp(l, 40, 50), transform: 'rotate(-2deg)'}}>ПОЧТИ ВНИЧЬЮ</div>
        </AbsoluteFill>
      )}
      {f >= NI && f < CX && <Ladder step={3} labels={LADDER} opacity={ramp(f, NI, NI + 10)} />}
      {f >= NI && f < CX && <Capital value={1700} opacity={ramp(f, NI, NI + 10)} />}
      {f >= ST && f < MV && <Chip x={540} y={640} text="ЗАГЛОХ" kind="red" t={ramp(f, ST + 15, ST + 25)} tilt={-3} size={48} />}
      {f >= R6 && f < AD && <Chip x={540} y={640} text="ПРАВИЛО №6: НЕ СПОРЬ С ДОЧЕРЬЮ ДОНА" kind="red" t={ramp(f, R6, R6 + 10)} tilt={-2} size={32} />}
      {f >= AD && f < CH && <Chip x={540} y={330} text="САН-МИГЕЛЬ, 14" kind="white" t={ramp(f, AD, AD + 10)} tilt={0} size={40} />}
      {f >= ME && f < CA && <Chip x={700} y={640} text="МЕНДОСА" kind="red" t={ramp(f, ME + 10, ME + 20)} tilt={2} size={46} />}
      {f >= LI && f < CS && <Chip x={540} y={640} text="ЗА НАМИ ФАРЫ" kind="red" t={ramp(f, LI, LI + 8)} tilt={-2} size={46} />}
      {f >= R4 && f < CX && <Chip x={540} y={640} text="ПРАВИЛО №4: ДОНУ НЕ ВРУТ" kind="red" t={ramp(f, R4, R4 + 8)} tilt={-2} size={40} />}
      {f >= CX && <Choice f={f} start={CX} a="РАССКАЗАТЬ ДОНУ" b="СОХРАНИТЬ СЕКРЕТ ЛУСИИ" />}
    </AbsoluteFill>
  );
};
