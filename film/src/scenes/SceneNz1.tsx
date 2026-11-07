import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Toon, ToonLook} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineNz1';
import {easeOut, ramp} from '../util';
import {DON, HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «Нет завещания — кому всё?» Факты: ГК РФ ст. 1142, 1143, 1151, 1154, 1155. */

const base = {skinD: '#c99878', legs: '#262b36', legsD: '#1e222c', shoes: '#e8e4da'};
const KID: ToonLook = {...base, skin: '#e8c0a0', hair: '#6a3a1a', top: '#3ac87a', topD: '#2ea866', messy: true, scale: 0.8};
const WIFE: ToonLook = {...base, skin: '#f0c8a8', hair: '#2a1a14', top: '#c8506a', topD: '#a83e56', longHair: true, scale: 0.95};
const MOM: ToonLook = {...base, skin: '#f0c8a8', hair: '#8a8a8a', top: '#7a5ac8', topD: '#6248a8', longHair: true, scale: 0.95};
const BRO: ToonLook = {...base, skin: '#e2b494', hair: '#3a2a1a', top: '#3a7ac8', topD: '#2e62a8', scale: 0.95};
const SIS: ToonLook = {...base, skin: '#f0c8a8', hair: '#c88a3a', top: '#ffb03a', topD: '#e09a2a', longHair: true, scale: 0.9};
const GRAN: ToonLook = {...base, skin: '#f0c8a8', hair: '#d8d8d8', top: '#8a6a4a', topD: '#725638', longHair: true, scarf: '#c83030', scale: 0.9};
const PARTNER: ToonLook = {...base, skin: '#f0c8a8', hair: '#4a2a1a', top: '#5ab0b0', topD: '#489090', longHair: true, scale: 0.95};

const House: React.FC<{x: number; y: number; s?: number; tint?: string}> = ({x, y, s = 1, tint = '#e8d8b8'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-220} y={-260} width={440} height={260} fill={tint} />
    <path d="M-260 -250 L0 -450 L260 -250 Z" fill="#c8503a" />
    <rect x={-50} y={-130} width={100} height={130} fill="#6a4a2a" />
    <rect x={-180} y={-210} width={90} height={80} fill="#7ac8ff" /><rect x={90} y={-210} width={90} height={80} fill="#7ac8ff" />
  </g>
);

const Stamp: React.FC<{text: string; t: number; x: number; y: number; size?: number}> = ({text, t, x, y, size = 64}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(-12deg) scale(${1.6 - 0.6 * easeOut(t)})`, opacity: t, padding: '10px 26px', border: '8px solid #ff3a4a', borderRadius: 14, fontFamily: FONT, fontWeight: 900, fontSize: size, color: '#ff3a4a', background: 'rgba(10,8,12,0.75)', whiteSpace: 'nowrap'}}>{text}</div>
);

const Head: React.FC<{title: string; sub?: string; f: number; at: number; color?: string}> = ({title, sub, f, at, color = '#ffd23a'}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 170, opacity: ramp(f, at, at + 8)}}>
    <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 76, color, textShadow: '0 5px 0 #000'}}>{title}</div>
    {sub && <div style={{marginTop: 8, fontFamily: MONO, fontWeight: 800, fontSize: 28, color: C.grey}}>{sub}</div>}
  </AbsoluteFill>
);

export const SceneNz1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const FL = m('flat'), LAW = m('law'), Q1 = m('q1'), EQ = m('equal'), Q2 = m('q2'), Q2L = m('q2list'), CO = m('couple'), NO = m('nope');
  const TE = m('term'), SIX = m('six'), CT = m('court'), ST = m('state'), GOV = m('gov'), SUB = m('sub'), TN = m('tonight');
  let scene: React.ReactNode = null;
  if (f < LAW) {
    scene = (
      <g>
        <Glow f={f} c1="#2a2440" c2="#06060c" cy={900} id="gh" />
        <House x={540} y={1100} s={1.1 + 0.05 * ramp(f, 0, 100)} />
        <text x={540} y={560 + Math.sin(f / 6) * 10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={200} fill="#ffd23a">?</text>
      </g>
    );
  } else if (f < Q2) {
    const people: [ToonLook, string, number][] = [[KID, 'ДЕТИ', 230], [WIFE, 'СУПРУГ', 540], [DON, 'РОДИТЕЛИ', 850]];
    scene = (
      <g>
        <Glow f={f} c1="#1a2a3a" c2="#05070c" cy={800} id="gq1" />
        <rect x={60} y={1120} width={960} height={30} rx={10} fill="#ffd23a" opacity={ramp(f, Q1, Q1 + 10)} />
        {people.map(([lk, , x], i) => (
          <g key={i} opacity={ramp(f, Q1 + i * 8, Q1 + i * 8 + 8)}>
            <Toon id={`q1${i}`} x={x} y={1120} s={0.6} f={f} look={i === 2 ? {...lk, hat: undefined, tie: undefined, scale: 1} : lk} pose={{eyes: 'open', mouth: f >= EQ ? 'smile' : 'line', armR: [20, 10], armL: [20, 10]}} />
          </g>
        ))}
      </g>
    );
  } else if (f < CO) {
    const people: [ToonLook, number][] = [[BRO, 160], [SIS, 410], [GRAN, 670], [DON, 920]];
    scene = (
      <g>
        <Glow f={f} c1="#1a2a3a" c2="#05070c" cy={800} id="gq2" />
        <rect x={60} y={1120} width={960} height={30} rx={10} fill="#7ac8ff" />
        {people.map(([lk, x], i) => (
          <g key={i} opacity={ramp(f, Q2L + i * 7, Q2L + i * 7 + 8)}>
            <Toon id={`q2${i}`} x={x} y={1120} s={0.52} f={f} look={i === 3 ? {...lk, hat: undefined, tie: undefined, scale: 1} : lk} pose={{eyes: 'open', mouth: 'line'}} />
          </g>
        ))}
      </g>
    );
  } else if (f < TE) {
    scene = (
      <g>
        <Glow f={f} c1="#2a1a2a" c2="#07050a" cy={800} id="gco" />
        <House x={540} y={760} s={0.55} />
        <Toon id="cp1" x={360} y={1150} s={0.8} f={f} look={HERO} facing={1} pose={{eyes: 'open', mouth: 'line', armR: [30, 20]}} />
        <Toon id="cp2" x={720} y={1150} s={0.8} f={f} look={PARTNER} facing={-1} pose={{eyes: f >= NO ? 'wide' : 'open', mouth: f >= NO ? 'fear' : 'smile', brow: f >= NO ? 1 : 0, sweat: f >= NO}} />
      </g>
    );
  } else if (f < ST) {
    const k = ramp(f, SIX, CT);
    scene = (
      <g>
        <Glow f={f} c1="#1a2a2a" c2="#05080a" cy={800} id="gte" />
        <g transform="translate(540 760)">
          <circle r={250} fill="none" stroke="#1e2a30" strokeWidth={40} />
          <circle r={250} fill="none" stroke={f >= CT ? '#ff3a4a' : '#3ac87a'} strokeWidth={40} strokeDasharray={`${2 * Math.PI * 250 * (1 - k)} 9999`} transform="rotate(-90)" strokeLinecap="round" />
        </g>
      </g>
    );
  } else if (f < SUB) {
    scene = (
      <g>
        <Glow f={f} c1="#2a1a1a" c2="#0a0606" cy={800} id="gst" />
        <House x={540} y={1100} s={1.1} tint={f >= GOV ? '#b8b8b8' : '#e8d8b8'} />
      </g>
    );
  } else {
    scene = <Glow f={f} c1="#3a2a5a" c2="#0a0810" cy={700} id="gsub" />;
  }
  const months = Math.max(0, Math.ceil(6 * (1 - ramp(f, SIX, CT))));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < LAW && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 150}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.white, textAlign: 'center', lineHeight: 1.02, textShadow: '0 6px 0 #000'}}>ЗАВЕЩАНИЯ НЕТ.<br /><span style={{color: '#ffd23a'}}>КОМУ ВСЁ?</span></div>
        </AbsoluteFill>
      )}
      {f >= FL && f < LAW && <Chip x={300} y={1210} text="КВАРТИРА" kind="white" t={ramp(f, FL, FL + 8)} tilt={-4} size={44} />}
      {f >= FL + 12 && f < LAW && <Chip x={780} y={1210} text="ДЕНЬГИ" kind="yellow" t={ramp(f, FL + 12, FL + 20)} tilt={4} size={44} />}
      {f >= LAW && f < Q2 && <Head title="ОЧЕРЕДЬ №1" sub="ГК РФ, ст. 1142" f={f} at={LAW} />}
      {f >= Q1 && f < Q2 && (
        <AbsoluteFill>
          {[['ДЕТИ', 230], ['СУПРУГ', 540], ['РОДИТЕЛИ', 850]].map(([t, x], i) => (
            <div key={i} style={{position: 'absolute', left: (x as number) - 150, width: 300, top: 1165, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.white, opacity: ramp(f, Q1 + i * 8, Q1 + i * 8 + 8)}}>{t}</div>
          ))}
          {f >= EQ && [230, 540, 850].map((x, i) => <div key={i} style={{position: 'absolute', left: x - 70, top: 420, width: 140, padding: '10px 0', borderRadius: 20, background: '#ffd23a', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 52, color: '#14171d', opacity: ramp(f, EQ + i * 5, EQ + i * 5 + 8)}}>⅓</div>)}
        </AbsoluteFill>
      )}
      {f >= Q2 && f < CO && (
        <AbsoluteFill>
          <Head title="ОЧЕРЕДЬ №2" sub="ГК РФ, ст. 1143" f={f} at={Q2} color="#7ac8ff" />
          <div style={{position: 'absolute', top: 360, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.grey, textDecoration: 'line-through'}}>очередь №1 — никого</div>
          {['БРАТЬЯ', 'СЁСТРЫ', 'БАБУШКИ', 'ДЕДУШКИ'].map((t, i) => (
            <div key={t} style={{position: 'absolute', left: 160 + i * 255 - 130, width: 260, top: 1165, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.white, opacity: ramp(f, Q2L + i * 7, Q2L + i * 7 + 8)}}>{t}</div>
          ))}
        </AbsoluteFill>
      )}
      {f >= CO && f < TE && (
        <AbsoluteFill>
          <Head title="20 ЛЕТ БЕЗ ШТАМПА" f={f} at={CO} color={C.white} />
          {f >= NO && <Stamp text="НЕ НАСЛЕДНИК" t={ramp(f, NO + 10, NO + 18)} x={720} y={560} size={54} />}
        </AbsoluteFill>
      )}
      {f >= TE && f < ST && (
        <AbsoluteFill>
          <Head title="СРОК ПРИНЯТИЯ" sub="ГК РФ, ст. 1154" f={f} at={TE} color={C.white} />
          <div style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 170, color: f >= CT ? '#ff3a4a' : C.white}}>{months}</div>
          <div style={{position: 'absolute', top: 830, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.grey}}>{months === 1 ? 'МЕСЯЦ' : months >= 2 && months <= 4 ? 'МЕСЯЦА' : 'МЕСЯЦЕВ'}</div>
          {f >= CT && <Chip x={540} y={1130} text="ДАЛЬШЕ — ЧЕРЕЗ СУД" kind="red" t={ramp(f, CT + 30, CT + 38)} tilt={-2} size={44} />}
        </AbsoluteFill>
      )}
      {f >= ST && f < SUB && (
        <AbsoluteFill>
          <Head title="НАСЛЕДНИКОВ НЕТ?" sub="ГК РФ, ст. 1151" f={f} at={ST} color={C.white} />
          {f >= GOV && <Stamp text="ГОСУДАРСТВУ" t={ramp(f, GOV, GOV + 8)} x={540} y={860} size={78} />}
        </AbsoluteFill>
      )}
      {f >= SUB && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 62, color: C.white, textAlign: 'center', opacity: ramp(f - SUB, 0, 10)}}>КАЖДЫЙ ДЕНЬ<br />НОВЫЕ ИСТОРИИ</div>
          <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SUB) / 4)})`, opacity: ramp(f - SUB, 6, 14)}}>+ ПОДПИСАТЬСЯ</div>
          {f >= TN && <div style={{marginTop: 20, padding: '14px 30px', borderRadius: 20, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 38, color: '#14171d', opacity: ramp(f - TN, 0, 10)}}>19:00 — «БЕЗ СИГНАЛА» · ЧАСТЬ 2</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
