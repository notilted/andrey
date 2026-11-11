import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Shake, Toon, ToonLook} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineBn1';
import {easeOut, ramp, rand} from '../util';
import {DON, HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «Бабушкины 2 миллиона», сезон 2, часть 1 — чужой товарный знак. */

const SUIT: ToonLook = {...DON, top: '#1a1c24', topD: '#12141a', legs: '#1a1c24', legsD: '#12141a', hat: undefined, tie: '#8a1a2a', bald: false, hair: '#2a2a2a', mustache: false, shades: true};

const Shop: React.FC<{x: number; y: number; s?: number; f: number; off?: boolean}> = ({x, y, s = 1, f, off}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-160} y={-300} width={320} height={300} fill="#3a2a24" />
    <rect x={-170} y={-360} width={340} height={70} rx={10} fill={off ? '#2a2a2a' : '#c8503a'} />
    <text x={0} y={-313} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={off ? '#555' : '#ffe8c0'}>БАБУШКИНЫ</text>
    <rect x={-130} y={-260} width={260} height={150} fill={off ? '#1a1a1a' : '#ffd88a'} opacity={off ? 1 : 0.85 + 0.1 * Math.sin(f / 9)} />
    <rect x={-40} y={-100} width={80} height={100} fill="#2a1a14" />
  </g>
);

const Queue: React.FC<{f: number; n: number; x0: number; y: number}> = ({f, n, x0, y}) => <g>{Array.from({length: n}).map((_, i) => <g key={i} transform={`translate(${x0 + i * 70} ${y + Math.sin(f / 8 + i) * 2})`}><circle cy={-120} r={26} fill={['#e2b494', '#c99878', '#f0c8a8'][i % 3]} /><rect x={-28} y={-96} width={56} height={96} rx={20} fill={['#3a7ac8', '#c8506a', '#3ac87a', '#ffb03a', '#7a5ac8'][i % 5]} /></g>)}</g>;

export const SceneBn1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const YE = m('year'), TH = m('three'), MA = m('mar'), NB = m('nobody'), ML = m('mail'), TM = m('tm'), DA = m('days'), CO = m('court'), DO = m('docs'), NA = m('name'), HI = m('him'), NO = m('no'), NX = m('next'), SU = m('sub');
  let scene: React.ReactNode = null;
  if (f < MA) {
    scene = (
      <g>
        <Glow f={f} c1="#2a1e3a" c2="#08060c" cy={700} id="gst" />
        <rect x={-200} y={1150} width={1480} height={900} fill="#16141c" />
        {f >= TH ? [0, 1, 2].map((i) => <g key={i} opacity={ramp(f, TH + i * 10, TH + i * 10 + 10)}><Shop x={200 + i * 340} y={1150} s={0.85} f={f} /></g>) : <Shop x={540} y={1150} s={1.2} f={f} />}
        {f >= TH && <Queue f={f} n={12} x0={60} y={1300} />}
      </g>
    );
  } else if (f < ML) {
    scene = (
      <g>
        <Glow f={f} c1="#3a2a1a" c2="#0a0806" cy={600} id="gk" />
        <rect x={-200} y={1000} width={1480} height={1000} fill="#2a2420" />
        <rect x={100} y={980} width={880} height={30} fill="#7a6a5a" />
        <g transform="translate(720 960)"><ellipse rx={150} ry={40} fill="#c8c0b0" /><ellipse cy={-14} rx={120} ry={28} fill="#c86a4a" />{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={-60 + i * 40} cy={-20} rx={22} ry={10} fill="#a84a3a" />)}</g>
        <g transform="translate(330 900) rotate(-6)"><rect x={-90} y={-60} width={180} height={120} rx={6} fill="#e8dcc0" /><line x1={0} y1={-60} x2={0} y2={60} stroke="#b8a888" strokeWidth={4} />{[0, 1, 2, 3].map((i) => <line key={i} x1={-75} y1={-30 + i * 20} x2={-10} y2={-30 + i * 20} stroke="#6a5a8a" strokeWidth={3} />)}</g>
        <Toon id="mk" x={540} y={1220} s={1.0} f={f} look={{...HERO, hat: '#f2f0e8'}} pose={{eyes: 'half', mouth: 'smile', armR: [60, -40], armL: [60, -40]}} />
      </g>
    );
  } else if (f < HI) {
    scene = (
      <g>
        <Glow f={f} c1="#1a2030" c2="#05060a" cy={700} id="gm" />
        <rect x={-200} y={1150} width={1480} height={900} fill="#12141a" />
        {f >= NA && <Shake x={300} y={720} w={190} f={f} />}
        <Toon id="mk2" x={300} y={1250} s={1.0} f={f} look={HERO} pose={{eyes: f >= DA ? 'wide' : 'open', mouth: f >= CO ? 'fear' : 'line', armR: [120, -90], brow: f >= DA ? 1 : 0.3, sweat: f >= CO, shake: f >= NA}} />
      </g>
    );
  } else if (f < NX) {
    scene = (
      <g>
        <rect x={-200} y={-200} width={1480} height={2400} fill="#060508" />
        <circle cx={540} cy={760} r={420} fill="#8a1a2a" opacity={0.15 + 0.05 * Math.sin(f / 6)} />
        <g transform={`translate(${(rand(Math.floor(f / 3)) - 0.5) * (f >= NO ? 6 : 0)} 0)`}><Toon id="suit" x={540} y={1250} s={1.25} f={f} look={SUIT} pose={{eyes: 'half', mouth: 'smirk', brow: -1, armR: [20, 0], armL: [20, 0]}} /></g>
      </g>
    );
  } else scene = <Glow f={f} c1="#3a2a1a" c2="#0a0806" cy={700} id="gnx" />;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < MA && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 170, gap: 18}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.white, textAlign: 'center', lineHeight: 1.02, textShadow: '0 6px 0 #000'}}>БАБУШКИНЫ<br /><span style={{color: '#ffd23a'}}>2 МИЛЛИОНА</span></div>
          <div style={{padding: '10px 28px', borderRadius: 16, background: '#c8503a', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff'}}>СЕЗОН 2 · ЧАСТЬ 1</div>
          {f >= YE && <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.grey, opacity: ramp(f, YE, YE + 8)}}>ГОД СПУСТЯ · {f >= TH ? '3 ТОЧКИ' : ''}</div>}
        </AbsoluteFill>
      )}
      {f >= MA && f < ML && <Chip x={540} y={240} text={f < NB ? 'МАРИНАД ПО ТЕТРАДИ' : 'РЕЦЕПТ НЕ ЗНАЕТ НИКТО'} kind="yellow" t={ramp(f, f < NB ? MA : NB, (f < NB ? MA : NB) + 8)} tilt={-2} size={46} />}
      {f >= ML && f < HI && (
        <AbsoluteFill style={{alignItems: 'flex-end', paddingTop: 200, paddingRight: 50}}>
          <div style={{width: 620, padding: 34, borderRadius: 20, background: '#f4f1ea', transform: `rotate(2deg) translateY(${(1 - easeOut(ramp(f, ML, ML + 12))) * 80}px)`, opacity: ramp(f, ML, ML + 10)}}>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 30, color: '#8a1a2a'}}>ЮРИДИЧЕСКАЯ ФИРМА · ПРЕТЕНЗИЯ</div>
            <div style={{marginTop: 16, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: '#14171d', lineHeight: 1.25, opacity: ramp(f, TM, TM + 10)}}>Товарный знак «БАБУШКИНЫ» зарегистрирован за нашим клиентом.</div>
            {f >= DA && <div style={{marginTop: 18, fontFamily: MONO, fontWeight: 800, fontSize: 64, color: '#c83030'}}>30 ДНЕЙ</div>}
            {f >= DA && <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: '#14171d'}}>на демонтаж вывесок</div>}
            {f >= CO && <div style={{marginTop: 14, padding: '8px 18px', borderRadius: 10, background: '#c83030', display: 'inline-block', fontFamily: FONT, fontWeight: 900, fontSize: 32, color: '#fff', opacity: ramp(f, CO, CO + 8)}}>ИНАЧЕ — СУД</div>}
            {f >= DO && <div style={{marginTop: 22, borderTop: '3px solid #ccc', paddingTop: 14, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: '#555', opacity: ramp(f, DO, DO + 10)}}>Правообладатель: {f >= NA ? <span style={{color: '#14171d', background: '#14171d'}}>████████</span> : '…'}</div>}
          </div>
        </AbsoluteFill>
      )}
      {f >= HI && f < NX && <Chip x={540} y={260} text={f < NO ? 'ТОТ САМЫЙ' : '«НЕТ» БЫЛО ГОД НАЗАД'} kind="red" t={ramp(f, f < NO ? HI : NO, (f < NO ? HI : NO) + 8)} tilt={-2} size={52} />}
      {f >= NX && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.white, textAlign: 'center', lineHeight: 1.02, opacity: ramp(f - NX, 0, 10)}}>БАБУШКИНЫ<br />2 МИЛЛИОНА</div>
          <div style={{padding: '12px 30px', borderRadius: 20, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#14171d', opacity: ramp(f - NX, 8, 18)}}>ЧАСТЬ 2 — ЗАВТРА В 19:00</div>
          {f >= SU && <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 0, 8)}}>+ ПОДПИСАТЬСЯ</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
