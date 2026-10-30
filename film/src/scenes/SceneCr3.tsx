import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Toon, ToonLook} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineCr3';
import {easeOut, ramp} from '../util';
import {Capital, Choice, Ladder} from './SceneCr1';
import {DON, GUARD, HERO} from './SceneCr2';
import {ease01, SVG} from './twkit';

/** «Из низов», серия 3 «Апельсин» — ветка «сдать Чино». */

const CHINO: ToonLook = {skin: '#c89070', skinD: '#b07a5a', hair: '#14110e', top: '#d84a3a', topD: '#b83a2c', legs: '#2a3446', legsD: '#222a3a', shoes: '#e8e4da', scale: 0.92};
const KID_H: ToonLook = {...HERO, scale: 0.7};
const KID_C: ToonLook = {...CHINO, scale: 0.7};

const zoom = (f: number, a: number, b: number, s: number, cx: number, cy: number) => {
  const k = ease01(f, a, b);
  return `translate(${540 + (540 - cx) * k * (s - 1)} ${900 + (900 - cy) * k * (s - 1)}) scale(${1 + k * (s - 1)}) translate(-540 -900)`;
};

/** Итоги голосования. */
const Results: React.FC<{f: number; start: number; one: number}> = ({f, start, one}) => {
  const l = f - start;
  const bar = (label: string, pct: number, votes: string, col: string, d: number) => (
    <div style={{width: 860, marginTop: 26, opacity: ramp(l, d, d + 10)}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white}}><span>{label}</span><span style={{fontFamily: MONO}}>{votes}</span></div>
      <div style={{marginTop: 10, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.12)'}}>
        <div style={{width: `${pct * easeOut(ramp(l, d + 6, d + 30))}%`, height: '100%', borderRadius: 22, background: col}} />
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 260}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#ffd23a', letterSpacing: 2, opacity: ramp(l, 0, 10)}}>ИТОГИ ГОЛОСОВАНИЯ</div>
      {bar('1 — СДАТЬ ЧИНО', 100, '1 голос', '#ffd23a', 10)}
      {bar('2 — СОВРАТЬ ДОНУ', 0, '0', C.white, 22)}
      <div style={{marginTop: 46, padding: '14px 34px', borderRadius: 26, background: C.red, fontFamily: FONT, fontWeight: 900, fontSize: 48, color: C.white, opacity: ramp(f, one, one + 8), transform: `rotate(-3deg) scale(${1 + 0.15 * (1 - ramp(f, one, one + 10))})`}}>ЯВКА: 1 ЧЕЛОВЕК</div>
    </AbsoluteFill>
  );
};

/** Карточка единственного голосовавшего. */
const Voter: React.FC<{f: number; start: number}> = ({f, start}) => {
  const l = f - start;
  const a = easeOut(ramp(l, 0, 14));
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#ffd23a', letterSpacing: 3, opacity: a}}>ЕДИНСТВЕННЫЙ ГОЛОС</div>
      <div style={{marginTop: 30, padding: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#ffd23a,#ff6a3a)', transform: `scale(${0.8 + 0.2 * a}) rotate(${Math.sin(l / 10) * 3}deg)`}}>
        <Img src={staticFile('img/voter.png')} style={{width: 380, height: 380, borderRadius: '50%', display: 'block'}} />
      </div>
      <div style={{marginTop: 30, fontFamily: FONT, fontWeight: 900, fontSize: 72, color: C.white, opacity: a}}>даннасть</div>
      <div style={{marginTop: 6, fontFamily: MONO, fontWeight: 700, fontSize: 32, color: C.grey, opacity: a}}>@user556723748509</div>
      <div style={{marginTop: 30, padding: '12px 30px', borderRadius: 24, background: C.white, color: '#14171d', fontFamily: FONT, fontWeight: 900, fontSize: 36, opacity: ramp(l, 20, 30)}}>РЕШАЕТ СУДЬБУ ЧИНО</div>
    </AbsoluteFill>
  );
};

/** Кабинет дона: стол, лампа. */
export const Office: React.FC<{f: number}> = ({f}) => (
  <g>
    <Glow f={f} c1="#8a5a3a" c2="#1a0e12" cy={700} id="goff" />
    <rect x={-200} y={1320} width={1480} height={900} fill="#2a1a16" />
    <rect x={160} y={360} width={760} height={420} fill="#3a2420" opacity={0.6} />
    {[0, 1, 2].map((i) => <rect key={i} x={200 + i * 250} y={400} width={200} height={340} fill="#5a3a2a" opacity={0.6} />)}
  </g>
);
export const Desk: React.FC = () => (
  <g>
    <rect x={380} y={1080} width={660} height={60} rx={10} fill="#6a3a24" />
    <rect x={710} y={1080} width={330} height={60} rx={10} fill="#000" opacity={0.15} />
    <rect x={420} y={1140} width={580} height={200} fill="#4a2818" />
    <rect x={900} y={980} width={14} height={100} fill="#2a2a2a" /><path d="M860 980 L960 980 L930 940 L890 940 Z" fill="#2a6a4a" />
  </g>
);
export const Orange: React.FC<{x: number; y: number; peel: number; f: number}> = ({x, y, peel, f}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={34} fill={peel > 0.5 ? '#f6c28a' : '#f28a2a'} />
    {peel <= 0.5 && <circle r={34} fill="none" stroke="#e0701a" strokeWidth={4} />}
    {peel > 0 && peel < 1 && <path d={`M30 -10 q${30 + Math.sin(f / 3) * 6} 20 10 50 q-20 30 10 50`} stroke="#f28a2a" strokeWidth={10} fill="none" strokeLinecap="round" />}
    <path d="M-50 -40 L-6 4" stroke="#c8c8d0" strokeWidth={8} strokeLinecap="round" transform={`rotate(${Math.sin(f / 4) * 12})`} />
  </g>
);

/** Фото из почтового ящика: лицом / оборотом. */
export const Photo: React.FC<{f: number; back: boolean; t: number}> = ({f, back, t}) => {
  const flip = back ? Math.cos(Math.min(1, t / 10) * Math.PI) : 1;
  return (
    <g>
      <Glow f={f} c1="#4a3a6a" c2="#0e0a14" cy={760} id="gph" />
      <g transform={`translate(540 860) scale(${Math.abs(flip)} 1) rotate(-4)`}>
        <rect x={-330} y={-400} width={660} height={780} fill="#f2ede0" />
        {flip > 0 ? (
          <g>
            <rect x={-290} y={-360} width={580} height={560} fill="#e8b878" />
            <circle cx={180} cy={-260} r={60} fill="#fff2c8" />
            <rect x={-290} y={60} width={580} height={140} fill="#c8805a" />
            <Toon id="kh" x={-90} y={190} s={0.62} f={0} look={KID_H} pose={{mouth: 'grin', armR: [140, -20], eyes: 'closed'}} />
            <Toon id="kc" x={110} y={190} s={0.62} facing={-1} f={0} look={KID_C} pose={{mouth: 'grin', armR: [140, -20], eyes: 'closed'}} />
            <text x={0} y={310} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#5a4a3a">1973</text>
          </g>
        ) : (
          <g transform="scale(-1 1)">
            <text x={0} y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill="#2a2a3a" transform="scale(-1 1)">Я жив.</text>
            <text x={0} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill="#c83030" transform="scale(-1 1)">Я всё знаю.</text>
          </g>
        )}
      </g>
    </g>
  );
};

export const SceneCr3: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const RE = m('results'), ON = m('one'), VO = m('voter'), OF = m('office'), Q = m('q'), SA = m('say'), NO = m('nod'), GU = m('guard'), OR = m('orange'), NE = m('never');
  const NI = m('night'), MO = m('morning'), BO = m('box'), WE = m('week'), PL = m('plus'), RK = m('rank'), MA = m('mail'), PH = m('photo'), BA = m('back'), EF = m('efm'), CX = m('choice'), FR = m('friends');
  let scene: React.ReactNode = null;
  if (f < VO) {
    scene = (
      <g>
        <Glow f={f} c1="#5a3aa8" c2="#120a20" cy={700} id="gres" />
        <Toon id="h0" x={540} y={2080} s={2.0} f={f} look={HERO} pose={{eyes: 'half', mouth: f >= ON ? 'line' : 'smirk', brow: -0.5, armL: [10, 0], armR: [10, 0]}} />
      </g>
    );
  } else if (f < OF) {
    scene = (
      <g>
        <Glow f={f} c1="#ff9a5a" c2="#3a1a3a" cy={600} id="gvot" />
        {Array.from({length: 30}).map((_, i) => <rect key={i} x={(i * 137) % 1080} y={((i * 211 + (f - VO) * (6 + (i % 4))) % 1900) - 100} width={18} height={10} fill={['#ffd23a', '#ff6a3a', '#5ad08a', '#7ab0ff'][i % 4]} transform={`rotate(${i * 40 + f * 3} ${(i * 137) % 1080} ${((i * 211 + (f - VO) * (6 + (i % 4))) % 1900) - 100})`} />)}
      </g>
    );
  } else if (f < NI) {
    const close = f >= NE;
    const gw = ease01(f, GU, GU + 60);
    scene = (
      <g transform={close ? zoom(f, NE, NE + 20, 1.6, 300, 900) : f >= Q && f < NO ? zoom(f, Q, Q + 25, 1.25, 700, 950) : ''}>
        <Office f={f} />
        {f < GU + 60 && <Toon id="gd" x={1000 + gw * 400} y={1320} s={1} facing={gw > 0 ? 1 : -1} f={f} look={GUARD} pose={{eyes: 'half', mouth: 'line', brow: -1, step: gw > 0 && gw < 1 ? f / 4 : undefined}} />}
        <Toon id="don" x={720} y={1340} s={1} facing={-1} f={f} look={DON} pose={{sit: 1, eyes: 'half', mouth: 'smirk', talk: f >= Q && f < m('rule4') ? 0.2 + 0.25 * Math.sin(f / 2.5) : 0, armR: [80, -60], armL: [60, -40]}} />
        <Desk />
        <Orange x={640} y={1050} peel={ramp(f, OF, OR)} f={f} />
        <Toon id="h1" x={260} y={1360} s={1} f={f} look={HERO} pose={{eyes: f >= SA ? 'closed' : 'wide', mouth: f >= SA && f < NO ? 'open' : 'fear', sweat: true, look: 0.6, brow: 1}} />
        {close && <g transform="translate(300 600)"><circle r={60} fill="#f28a2a" /><path d="M-70 -70 L70 70 M70 -70 L-70 70" stroke={C.red} strokeWidth={18} strokeLinecap="round" /></g>}
      </g>
    );
  } else if (f < WE) {
    if (f < MO) {
      scene = (
        <g>
          <Glow f={f} c1="#2a3a6a" c2="#05060c" cy={500} id="gnight" />
          <circle cx={820} cy={380} r={70} fill="#e8e4da" opacity={0.7} />
          <rect x={160} y={1180} width={760} height={160} rx={20} fill="#3a4a6a" />
          <Toon id="h2" x={420} y={1240} s={1} f={f} look={HERO} pose={{sit: 1, eyes: 'wide', mouth: 'line', look: 0.4, armL: [30, 40], armR: [30, 40]}} />
        </g>
      );
    } else {
      scene = (
        <g transform={f >= BO ? zoom(f, BO, BO + 30, 1.4, 640, 1250) : ''}>
          <Glow f={f} c1="#c8b8a8" c2="#5a5a7a" cy={500} id="gmorn" />
          {['#c87a6a', '#d8b46a', '#6a9a9a', '#b88aa0'].map((c, i) => <rect key={i} x={-100 + i * 300} y={500 + (i % 2) * 60} width={280} height={720} fill={c} opacity={0.7} />)}
          <rect x={-200} y={1220} width={1480} height={900} fill="#a8886a" />
          <g transform="translate(640 1300)"><rect x={-80} y={-110} width={160} height={110} rx={14} fill="#8a4a2a" /><rect x={-80} y={-110} width={80} height={110} rx={14} fill="#a85a32" /></g>
          <Toon id="h3" x={300} y={1320} s={0.95} f={f} look={HERO} pose={{eyes: 'side', look: 1, mouth: 'line', brow: 0.8}} />
        </g>
      );
    }
  } else if (f < MA) {
    scene = (
      <g>
        <Office f={f} />
        <Toon id="don2" x={640} y={1360} s={1.05} facing={-1} f={f} look={DON} pose={{eyes: 'half', mouth: 'smirk', talk: f < PL ? 0.2 + 0.25 * Math.sin(f / 2.5) : 0, armR: [80, -10]}} />
        <Toon id="h4" x={380} y={1370} s={1} f={f} look={HERO} pose={{eyes: f >= PL ? 'half' : 'open', mouth: f >= RK ? 'smirk' : 'line', armR: [80, -10]}} />
      </g>
    );
  } else if (f < EF) {
    scene = <Photo f={f} back={f >= BA} t={f - BA} />;
  } else if (f < CX) {
    scene = (
      <g>
        <Glow f={f} c1="#c8404a" c2="#120a0e" cy={760} id="gefm" />
        <Toon id="h5" x={540} y={2050} s={2.0} f={f} look={HERO} pose={{eyes: 'wide', mouth: 'open', sweat: true, shake: true, brow: 1, armL: [10, 0], armR: [10, 0]}} />
      </g>
    );
  } else {
    scene = <Glow f={f} c1="#3a2a5a" c2="#0a0810" cy={700} id="gch" />;
  }
  const cash = f < PL ? 700 : 1700;
  const step = f < RK ? 1 : 2;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < VO && <Results f={f} start={RE} one={ON} />}
      {f >= VO && f < OF && <Voter f={f} start={VO} />}
      {f >= OF && f < CX && <Ladder step={step} opacity={ramp(f, OF, OF + 10)} />}
      {f >= OF && f < CX && <Capital value={cash} up={f >= PL && f < PL + 40} opacity={ramp(f, OF, OF + 10)} />}
      {f >= m('rule4') && f < NO && <Chip x={540} y={640} text="ПРАВИЛО №4: ДОНУ НЕ ВРУТ" kind="red" t={ramp(f, m('rule4'), m('rule4') + 10)} tilt={-2} size={38} />}
      {f >= SA && f < NO && <Chip x={300} y={760} text="«ЧИНО»" kind="white" t={ramp(f, SA, SA + 8)} tilt={3} size={44} />}
      {f >= BO && f < WE && <Chip x={640} y={640} text="ЧИНО НЕТ" kind="red" t={ramp(f, BO, BO + 10)} tilt={-2} size={46} />}
      {f >= RK && f < MA && <Chip x={540} y={640} text="ТЕПЕРЬ ТЫ — КУРЬЕР" kind="yellow" t={ramp(f, RK, RK + 10)} tilt={-2} size={42} />}
      {f >= CX && <Choice f={f} start={CX} a="РАССКАЗАТЬ ДОНУ" b="НАЙТИ ЧИНО САМОМУ" />}
      {f >= FR && <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center'}}><span style={{padding: '12px 30px', borderRadius: 24, background: C.red, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 38, opacity: ramp(f, FR, FR + 8)}}>ПРИВЕДИ ДРУЗЕЙ, НАС ТРОЕ</span></div>}
    </AbsoluteFill>
  );
};
