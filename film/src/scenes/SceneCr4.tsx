import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Toon, ToonLook} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineCr4';
import {easeOut, ramp} from '../util';
import {Capital, Choice, Ladder} from './SceneCr1';
import {DON, HERO} from './SceneCr2';
import {Desk, Office, Orange, Photo} from './SceneCr3';
import {ease01, SVG} from './twkit';

/** «Из низов», серия 4 «Мендоса» — ветка «рассказать дону». */

const LUCIA: ToonLook = {skin: '#f0c8a8', skinD: '#dcb090', hair: '#3a1a14', top: '#c8304a', topD: '#a8243a', legs: '#2a2a3a', legsD: '#22222e', shoes: '#14110e', longHair: true, scale: 0.9};
const MENDOSA: ToonLook = {skin: '#c89070', skinD: '#b07a5a', hair: '#14110e', top: '#2a6a5a', topD: '#1e544a', legs: '#1e2a2a', legsD: '#162020', shoes: '#0a0a0a', shades: true, chain: true, mustache: true, scale: 1.1};
const VOTERS = ['Архип', 'slkz', 'Alisik', 'meow', 'mederbekov.0012', 'Vikiww', 'амбасадор колбасы', 'bratush', 'Arina', 'Автономная Керпография'];

const zoom = (f: number, a: number, b: number, s: number, cx: number, cy: number) => {
  const k = ease01(f, a, b);
  return `translate(${540 + (540 - cx) * k * (s - 1)} ${900 + (900 - cy) * k * (s - 1)}) scale(${1 + k * (s - 1)}) translate(-540 -900)`;
};

/** Итоги: 8:2, явка ×10, бегущая строка ников. */
const Results: React.FC<{f: number; start: number; turnout: number}> = ({f, start, turnout}) => {
  const l = f - start;
  const bar = (label: string, pct: number, votes: string, col: string, d: number) => (
    <div style={{width: 860, marginTop: 26, opacity: ramp(l, d, d + 10)}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white}}><span>{label}</span><span style={{fontFamily: MONO}}>{votes}</span></div>
      <div style={{marginTop: 10, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.12)'}}>
        <div style={{width: `${pct * easeOut(ramp(l, d + 6, d + 30))}%`, height: '100%', borderRadius: 22, background: col}} />
      </div>
    </div>
  );
  const ticker = VOTERS.map((v) => `★ ${v}`).join('     ');
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 260}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#ffd23a', letterSpacing: 2, opacity: ramp(l, 0, 10)}}>ИТОГИ ГОЛОСОВАНИЯ</div>
      {bar('1 — РАССКАЗАТЬ ДОНУ', 80, '8', '#ffd23a', 10)}
      {bar('2 — НАЙТИ ЧИНО САМОМУ', 20, '2', C.white, 22)}
      <div style={{marginTop: 46, padding: '14px 34px', borderRadius: 26, background: '#3ac87a', fontFamily: FONT, fontWeight: 900, fontSize: 48, color: '#0b1a12', opacity: ramp(f, turnout, turnout + 8), transform: `rotate(-3deg) scale(${1 + 0.15 * (1 - ramp(f, turnout, turnout + 10))})`}}>ЯВКА ×10 · +900%</div>
      <div style={{position: 'absolute', top: 1000, left: 0, right: 0, overflow: 'hidden', whiteSpace: 'nowrap', opacity: ramp(l, 30, 40)}}>
        <div style={{display: 'inline-block', transform: `translateX(${1080 - l * 9}px)`, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.white}}>{ticker}     {ticker}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Ориентировка на Мендосу. */
const Wanted: React.FC<{f: number; t: number}> = ({f, t}) => (
  <g>
    <Glow f={f} c1="#3a8a6a" c2="#0a1410" cy={700} id="gmen" />
    <g transform={`translate(540 860) rotate(${-3 + Math.sin(t / 20)}) scale(${0.9 + 0.1 * easeOut(Math.min(1, t / 14))})`}>
      <rect x={-330} y={-460} width={660} height={860} fill="#efe6cc" />
      <rect x={-290} y={-420} width={580} height={540} fill="#c8b890" />
      <defs><clipPath id="menclip"><rect x={-290} y={-420} width={580} height={540} /></clipPath></defs><g clipPath="url(#menclip)"><Toon id="men" x={0} y={430} s={1.0} f={f} look={MENDOSA} pose={{eyes: 'half', mouth: 'smirk', armL: [10, 0], armR: [10, 0]}} /></g>
      <text x={0} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill="#2a1a14">МЕНДОСА</text>
      <text x={0} y={270} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#8a2a24">ВТОРОЙ КАРТЕЛЬ ГОРОДА</text>
    </g>
  </g>
);

/** Ключи от машины. */
const Keys: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={22} fill="none" stroke="#c8c8d0" strokeWidth={8} />
    <rect x={18} y={-6} width={70} height={12} rx={4} fill="#c8c8d0" />
    <rect x={-80} y={-26} width={60} height={52} rx={12} fill="#1a1d22" />
  </g>
);

export const SceneCr4: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const RE = m('results'), TU = m('turnout'), KO = m('kolbasa'), OF = m('office'), FL = m('flip'), SI = m('silence'), ME = m('mendosa');
  const RI = m('rival'), OR = m('oranges'), KN = m('knows'), YO = m('you'), DR = m('drawer'), R5 = m('rule5'), DV = m('driver'), BK = m('bike'), RK = m('rank');
  const LU = m('lucia'), WY = m('withyou'), LO = m('look'), CO = m('coffin'), CX = m('choice');
  let scene: React.ReactNode = null;
  if (f < OF) {
    scene = (
      <g>
        <Glow f={f} c1={f < KO ? '#3a8a5a' : '#c87a3a'} c2="#0a0e14" cy={700} id="gres" />
        {f >= KO && <Toon id="h0" x={540} y={2080} s={2.0} f={f} look={HERO} pose={{eyes: 'half', mouth: 'grin', armR: [150, -110], armL: [10, 0]}} />}
        {f >= KO && <g transform="translate(540 560)"><rect x={-260} y={-60} width={520} height={120} rx={60} fill="#c8604a" /><path d="M-260 0 Q-300 -20 -300 0 Q-300 20 -260 0 M260 0 Q300 -20 300 0 Q300 20 260 0" fill="#a84a3a" /><text x={0} y={18} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#fff">КОЛБАСА</text></g>}
      </g>
    );
  } else if (f < SI) {
    scene = <Photo f={f} back={f >= FL} t={f - FL} />;
  } else if (f < RI) {
    scene = (
      <g transform={f >= ME ? zoom(f, ME, ME + 25, 1.5, 700, 900) : ''}>
        <Office f={f} />
        <Toon id="don" x={720} y={1340} s={1} facing={-1} f={f} look={DON} pose={{sit: 1, eyes: f >= ME ? 'half' : 'open', mouth: f >= ME ? 'open' : 'line', brow: -1, armR: [60, -40], armL: [60, -40]}} />
        <Desk />
        <Toon id="h1" x={260} y={1360} s={1} f={f} look={HERO} pose={{eyes: 'wide', mouth: 'fear', sweat: true, look: 0.6}} />
      </g>
    );
  } else if (f < KN) {
    scene = f < OR ? <Wanted f={f} t={f - RI} /> : (
      <g transform={zoom(f, OR, OR + 20, 1.5, 640, 1000)}>
        <Office f={f} />
        <Toon id="don2" x={720} y={1340} s={1} facing={-1} f={f} look={DON} pose={{sit: 1, eyes: 'half', mouth: 'line', brow: -1, armR: [80, -60], armL: [60, -40], shake: true}} />
        <Desk />
        <Orange x={640} y={1050} peel={0.6} f={f * 3} />
      </g>
    );
  } else if (f < DV) {
    const keys = ease01(f, DR + 20, DR + 45);
    scene = (
      <g transform={f >= YO && f < DR ? zoom(f, YO, YO + 15, 1.6, 300, 900) : ''}>
        <Office f={f} />
        <Toon id="don3" x={720} y={1340} s={1} facing={-1} f={f} look={DON} pose={{sit: 1, eyes: 'half', mouth: 'line', talk: f < YO + 20 || (f >= R5 && f < DV) ? 0.2 + 0.25 * Math.sin(f / 2.5) : 0, armR: f >= DR ? [80, -10] : [60, -40]}} />
        <Desk />
        {f >= DR && <Keys x={720 - keys * 200} y={1060} />}
        {f >= DR && <text x={360} y={1000} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#e8e4da" opacity={keys}>ул. Сан-Мигель, 14</text>}
        <Toon id="h2" x={260} y={1360} s={1} f={f} look={HERO} pose={{eyes: 'wide', mouth: f >= YO ? 'open' : 'fear', sweat: true, look: 0.6, brow: 1}} />
      </g>
    );
  } else if (f < LU) {
    scene = (
      <g>
        <Glow f={f} c1="#3a6ac8" c2="#0a0e1a" cy={700} id="gdrv" />
        {f >= BK && f < RK ? (
          <g transform="translate(540 1200)">
            <circle cx={-150} cy={0} r={90} fill="none" stroke="#14171d" strokeWidth={16} /><circle cx={150} cy={0} r={90} fill="none" stroke="#14171d" strokeWidth={16} />
            <path d="M-150 0 L-20 0 L60 -140 L-60 -140 Z M60 -140 L150 0" stroke="#c83030" strokeWidth={14} fill="none" />
            <path d="M-200 -200 L200 200 M200 -200 L-200 200" stroke={C.red} strokeWidth={24} strokeLinecap="round" opacity={0.85} />
          </g>
        ) : (
          <Toon id="h3" x={540} y={1550} s={1.4} f={f} look={HERO} pose={{eyes: f >= RK ? 'half' : 'open', mouth: f >= RK ? 'smirk' : 'line', armR: [150, -120]}} />
        )}
        {f >= RK && <g transform="translate(700 640) rotate(-10)"><Keys x={0} y={0} /></g>}
      </g>
    );
  } else if (f < CX) {
    const close = f >= LO;
    scene = (
      <g transform={close ? zoom(f, LO, LO + 25, 1.5, 720, 950) : ''}>
        <Office f={f} />
        <rect x={60} y={560} width={260} height={780} fill="#1a0e0a" />
        <Toon id="lu" x={190} y={1340} s={1} f={f} look={LUCIA} pose={{eyes: 'half', mouth: f >= WY && f < LO ? 'open' : 'smirk', armL: [30, 60], look: 0.8}} />
        <Toon id="don4" x={720} y={1340} s={1} facing={-1} f={f} look={DON} pose={{sit: 1, eyes: f >= LO ? 'half' : 'wide', mouth: 'line', brow: f >= LO ? -1 : 0.6, look: f >= CO ? 0.6 : -0.6, armR: [60, -40], armL: [60, -40]}} />
        <Desk />
        <Toon id="h4" x={430} y={1360} s={1} f={f} look={HERO} pose={{eyes: 'wide', mouth: 'fear', sweat: true, look: -0.8, brow: 1}} />
      </g>
    );
  } else {
    scene = <Glow f={f} c1="#3a2a5a" c2="#0a0810" cy={700} id="gch" />;
  }
  const step = f < RK ? 2 : 3;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < KO && <Results f={f} start={RE} turnout={TU} />}
      {f >= KO && f < OF && <Chip x={540} y={330} text="ПРИВЕТ, АМБАСАДОР КОЛБАСЫ" kind="yellow" t={ramp(f, KO, KO + 10)} tilt={-2} size={40} />}
      {f >= OF && f < CX && <Ladder step={step} labels={['ЧИСТИЛЬЩИК', 'ПОСЫЛЬНЫЙ', 'КУРЬЕР', 'ВОДИТЕЛЬ', 'ПРАВАЯ РУКА', 'НАСЛЕДНИК', 'БОСС']} opacity={ramp(f, OF, OF + 10)} />}
      {f >= OF && f < CX && <Capital value={1700} opacity={ramp(f, OF, OF + 10)} />}
      {f >= ME && f < RI && <Chip x={700} y={640} text="«МЕНДОСА»" kind="red" t={ramp(f, ME + 20, ME + 30)} tilt={-2} size={52} />}
      {f >= R5 && f < DV && <Chip x={540} y={640} text="ПРАВИЛО №5: НАЗАД ДОРОГИ НЕТ" kind="red" t={ramp(f, R5, R5 + 10)} tilt={-2} size={36} />}
      {f >= RK && f < LU && <Chip x={540} y={640} text="ТЕПЕРЬ ТЫ — ВОДИТЕЛЬ" kind="yellow" t={ramp(f, RK, RK + 10)} tilt={2} size={42} />}
      {f >= LU && f < LO && <Chip x={190} y={640} text="ЛУСИЯ" kind="white" t={ramp(f, LU, LU + 10)} tilt={-3} size={42} />}
      {f >= CX && <Choice f={f} start={CX} a="ПОЕХАТЬ ОДНОМУ" b="ВЗЯТЬ ЛУСИЮ" />}
    </AbsoluteFill>
  );
};
