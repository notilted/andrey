import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Toon, ToonLook} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineBs2';
import {ramp, rand} from '../util';
import {DON, HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «Без сигнала», часть 2 — сутки без света, связи и денег на карте. */

const base = {skinD: '#c99878', legs: '#262b36', legsD: '#1e222c', shoes: '#e8e4da'};
const N1: ToonLook = {...base, skin: '#f0c8a8', hair: '#8a8a8a', top: '#7a5ac8', topD: '#6248a8', longHair: true, scarf: '#c83030', scale: 0.95};
const N2: ToonLook = {...base, skin: '#d8a888', hair: '#14110e', top: '#3a7a4a', topD: '#2e6a3a', mustache: true, scale: 1.05};
const N3: ToonLook = {...base, skin: '#e8c0a0', hair: '#c88a3a', top: '#ffb03a', topD: '#e09a2a', longHair: true, scale: 0.9};

const DarkCity: React.FC = () => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#070910" />
    {Array.from({length: 7}).map((_, i) => {
      const x = -60 + i * 165, h = 560 + ((i * 37) % 3) * 170;
      return (
        <g key={i}>
          <rect x={x} y={1250 - h} width={150} height={h} fill="#121722" />
          {Array.from({length: Math.floor(h / 80) * 2}).map((__, k) => <rect key={k} x={x + 22 + (k % 2) * 62} y={1250 - h + 34 + Math.floor(k / 2) * 80} width={44} height={46} fill={rand(i * 13 + k) > 0.96 ? '#ffb03a' : '#0a0e16'} opacity={rand(i * 13 + k) > 0.96 ? 0.5 : 1} />)}
        </g>
      );
    })}
    <rect x={-200} y={1250} width={1480} height={900} fill="#0a0c12" />
  </g>
);

const Shop: React.FC<{f: number; sad: boolean}> = ({f, sad}) => (
  <g>
    <Glow f={f} c1="#1a1e2a" c2="#05060a" cy={700} id="gshop" />
    <rect x={-200} y={1150} width={1480} height={900} fill="#151820" />
    {[0, 1, 2].map((r) => <rect key={r} x={60} y={300 + r * 190} width={420} height={18} fill="#2a2e38" />)}
    {[0, 1, 2].map((r) => Array.from({length: 6}).map((_, k) => <rect key={`${r}${k}`} x={80 + k * 66} y={230 + r * 190} width={48} height={70} rx={6} fill={['#c8503a', '#3a7ac8', '#ffd23a', '#3ac87a'][(r + k) % 4]} opacity={0.45} />))}
    <rect x={620} y={820} width={400} height={330} fill="#2a2420" />
    <g transform="translate(820 790)"><rect x={-70} y={-110} width={140} height={110} rx={10} fill="#0a0b10" /><rect x={-58} y={-98} width={116} height={86} fill="#05060a" /></g>
    <Toon id="mk2" x={420} y={1160} s={0.95} f={f} look={HERO} facing={1} pose={{eyes: sad ? 'wide' : 'open', mouth: sad ? 'fear' : 'line', armR: [70, -60], brow: sad ? 1 : 0.3, sweat: sad}} />
  </g>
);

const Atm: React.FC<{f: number}> = ({f}) => (
  <g>
    <DarkCity />
    <g transform="translate(700 1250)">
      <rect x={-170} y={-620} width={340} height={620} rx={14} fill="#2a2e38" />
      <rect x={-120} y={-560} width={240} height={180} rx={8} fill="#05060a" />
      <rect x={-90} y={-330} width={180} height={18} rx={6} fill="#0a0b10" />
      {Array.from({length: 9}).map((_, k) => <rect key={k} x={-80 + (k % 3) * 56} y={-280 + Math.floor(k / 3) * 46} width={44} height={34} rx={6} fill="#3a3e48" />)}
    </g>
    <Toon id="mk3" x={300} y={1250} s={1.0} f={f} look={HERO} facing={1} pose={{eyes: 'wide', mouth: 'line', armR: [90, -30], brow: 0.8}} />
  </g>
);

export const Kitchen: React.FC<{f: number; mode: 'tap' | 'fridge'; drip: number}> = ({f, mode, drip}) => (
  <g>
    <Glow f={f} c1="#1a2230" c2="#05060a" cy={600} id="gkit" />
    <rect x={-200} y={1150} width={1480} height={900} fill="#151a22" />
    <rect x={-200} y={820} width={1480} height={40} fill="#3a3e48" />
    {mode === 'tap' ? (
      <g>
        <path d="M640 560 L640 480 L760 480 L760 520" stroke="#9aa4b0" strokeWidth={26} fill="none" strokeLinecap="round" />
        {drip > 0 && <rect x={754} y={530} width={6} height={260 * drip} fill="#7ac8ff" opacity={0.8} />}
        {Array.from({length: 3}).map((_, i) => { const y = 540 + ((f * 6 + i * 90) % 280); return drip <= 0 ? <circle key={i} cx={757} cy={y} r={7} fill="#7ac8ff" /> : null; })}
        <rect x={560} y={800} width={360} height={30} rx={8} fill="#5a6270" />
      </g>
    ) : (
      <g>
        <rect x={600} y={260} width={360} height={880} rx={20} fill="#d8dce2" />
        <rect x={600} y={560} width={360} height={8} fill="#aab0ba" />
        <rect x={900} y={360} width={14} height={120} rx={6} fill="#8a909a" />
        <ellipse cx={780} cy={1160} rx={240} ry={26} fill="#7ac8ff" opacity={0.35 + 0.1 * Math.sin(f / 8)} />
      </g>
    )}
    <Toon id="mk4" x={330} y={1150} s={0.95} f={f} look={HERO} facing={1} pose={{eyes: 'half', mouth: 'line', armR: mode === 'fridge' ? [120, -110] : [20, 10], brow: 0.6}} />
    {mode === 'fridge' && <g transform="translate(470 930) rotate(-10)"><rect x={-40} y={-70} width={80} height={140} rx={12} fill="#14171d" /><rect x={-32} y={-60} width={64} height={120} rx={8} fill="#1e2a3a" /><rect x={-20} y={-10} width={30} height={14} rx={3} fill="none" stroke="#ff3a4a" strokeWidth={3} /><rect x={-18} y={-8} width={4} height={10} fill="#ff3a4a" /></g>}
  </g>
);

export const Yard: React.FC<{f: number; gen: boolean}> = ({f, gen}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#070910" />
    <rect x={-200} y={200} width={1480} height={1050} fill="#10141c" />
    {Array.from({length: 12}).map((_, k) => <rect key={k} x={60 + (k % 6) * 170} y={300 + Math.floor(k / 6) * 220} width={70} height={90} fill="#0a0e16" />)}
    <rect x={-200} y={1250} width={1480} height={900} fill="#0c0e14" />
    <circle cx={540} cy={1080} r={320} fill="#ffb03a" opacity={0.08} />
    <Toon id="y1" x={180} y={1250} s={0.8} f={f} look={N1} facing={1} pose={{eyes: 'open', mouth: 'line'}} />
    <Toon id="y2" x={400} y={1250} s={0.85} f={f} look={HERO} facing={1} pose={{eyes: gen ? 'wide' : 'open', mouth: 'line', brow: 0.5}} />
    <Toon id="y3" x={700} y={1250} s={0.85} f={f} look={N2} facing={-1} pose={{eyes: 'open', mouth: gen ? 'open' : 'line', talk: gen ? 0.5 + 0.5 * Math.sin(f / 3) : 0, armR: gen ? [60, -40] : [10, 0]}} />
    <Toon id="y4" x={920} y={1250} s={0.75} f={f} look={N3} facing={-1} pose={{eyes: 'open', mouth: 'line'}} />
    {gen && <g transform="translate(560 1250)"><rect x={-90} y={-110} width={180} height={110} rx={10} fill="#c83030" /><rect x={-70} y={-90} width={140} height={60} rx={6} fill="#2a2a2a" /><circle cx={60} cy={-60} r={12} fill="#ffd23a" /></g>}
    <Toon id="y5" x={-40} y={1250} s={0.7} f={f} look={{...DON, hat: undefined, tie: undefined, top: '#5a5a6a', topD: '#4a4a58'}} facing={1} pose={{eyes: 'half', mouth: 'line'}} />
  </g>
);

export const SceneBs2: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const SH = m('shop'), TE = m('term'), CA = m('cash'), ZE = m('zero'), AT = m('atm'), TA = m('tap'), PU = m('pump');
  const FR = m('fridge'), PH = m('phone'), NN = m('nonews'), YA = m('yard'), GE = m('gen'), SO = m('short'), NX = m('next'), SU = m('sub');
  let scene: React.ReactNode = null;
  if (f < SH) scene = <DarkCity />;
  else if (f < ZE) scene = <Shop f={f} sad={f >= CA} />;
  else if (f < AT) scene = <Glow f={f} c1="#2a1a1a" c2="#0a0606" cy={760} id="gzero" />;
  else if (f < TA) scene = <Atm f={f} />;
  else if (f < FR) scene = <Kitchen f={f} mode="tap" drip={f < TA + 25 ? 1 - ramp(f, TA, TA + 25) : 0} />;
  else if (f < YA) scene = <Kitchen f={f} mode="fridge" drip={0} />;
  else if (f < NX) scene = <Yard f={f} gen={f >= GE} />;
  else scene = <Glow f={f} c1="#3a2a5a" c2="#0a0810" cy={700} id="gnx" />;
  const hours = 6 + Math.floor(ramp(f, 0, SH) * 0);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < SH && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 200, gap: 26}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 92, color: C.white, textAlign: 'center', lineHeight: 1.02, textShadow: '0 6px 0 #000'}}>БЕЗ СИГНАЛА<br /><span style={{color: '#ffd23a'}}>ЧАСТЬ 2</span></div>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 64, color: C.redHot, opacity: ramp(f, m('city'), m('city') + 10)}}>+{hours}:00 БЕЗ СВЕТА</div>
        </AbsoluteFill>
      )}
      {f >= TE && f < ZE && <Chip x={700} y={600} text={f < CA ? 'ТЕРМИНАЛ МЁРТВ' : 'ТОЛЬКО НАЛИЧНЫЕ'} kind={f < CA ? 'white' : 'red'} t={ramp(f, f < CA ? TE : CA, (f < CA ? TE : CA) + 8)} tilt={-3} size={44} />}
      {f >= ZE && f < AT && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 300, gap: 20}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 48, color: C.grey}}>НАЛИЧНЫЕ</div>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 200, color: C.redHot}}>0 ₽</div>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.white, opacity: ramp(f, ZE + 40, ZE + 50)}}>ВСЁ — НА КАРТЕ</div>
        </AbsoluteFill>
      )}
      {f >= AT && f < TA && <Chip x={540} y={300} text="БАНКОМАТ НЕ РАБОТАЕТ" kind="red" t={ramp(f, AT, AT + 8)} tilt={2} size={44} />}
      {f >= PU && f < FR && <Chip x={540} y={300} text="НАСОСАМ НУЖЕН СВЕТ" kind="yellow" t={ramp(f, PU, PU + 8)} tilt={-2} size={44} />}
      {f >= PH && f < YA && <Chip x={540} y={240} text={f < NN ? 'ТЕЛЕФОН: 3%' : 'НОВОСТЕЙ НЕТ'} kind={f < NN ? 'red' : 'white'} t={ramp(f, f < NN ? PH : NN, (f < NN ? PH : NN) + 8)} tilt={-2} size={46} />}
      {f >= YA && f < GE && <Chip x={540} y={300} text="ВЕЧЕР. ДВОР." kind="white" t={ramp(f, YA, YA + 8)} tilt={0} size={46} />}
      {f >= GE && f < NX && <Chip x={540} y={300} text={f < SO ? '«У МЕНЯ ЕСТЬ ГЕНЕРАТОР…»' : 'БЕНЗИНА НА ВСЕХ НЕ ХВАТИТ'} kind={f < SO ? 'yellow' : 'red'} t={ramp(f, f < SO ? GE : SO, (f < SO ? GE : SO) + 8)} tilt={-2} size={38} />}
      {f >= NX && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 100, color: C.white, letterSpacing: 2, opacity: ramp(f - NX, 0, 10)}}>БЕЗ СИГНАЛА</div>
          <div style={{padding: '12px 30px', borderRadius: 20, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#14171d', opacity: ramp(f - NX, 8, 18)}}>ЧАСТЬ 3 — ЗАВТРА В 19:00</div>
          {f >= SU && <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 0, 8)}}>+ ПОДПИСАТЬСЯ</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
