import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Toon} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineNs1';
import {easeOut, ramp} from '../util';
import {HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «Что будет, если не спать сутки» (Dawson & Reid, Nature 1997: 17 ч ≈ 0,5‰, 24 ч ≈ 1‰). */

export const SceneNs1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const DR = m('drunk'), H17 = m('h17'), H24 = m('h24'), CAR = m('car'), MI = m('micro'), BL = m('blink'), FO = m('food'), SL = m('sleep'), NC = m('nocoffee'), SU = m('sub');
  const hours = f < H17 ? Math.round(17 * ramp(f, 0, H17)) : f < H24 ? 17 : 24;
  const prom = f < H17 ? 0 : f < H24 ? 0.5 : 1.0;
  const tired = Math.min(1, hours / 24);
  const blinkClosed = f >= BL && f < FO && Math.floor((f - BL) / 18) % 3 === 1;
  const asleep = f >= SL && f < SU;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>
        <Glow f={f} c1={asleep ? '#1a2a4a' : '#2a1e3a'} c2="#06050c" cy={700} id="gns" />
        <rect x={-200} y={1200} width={1480} height={900} fill="#12141a" />
        <g transform={`rotate(${f >= DR && f < SL ? Math.sin(f / 12) * 4 * tired : 0} 540 1200)`}>
          <Toon id="mk" x={540} y={1250} s={1.1} f={f} look={HERO} pose={{eyes: asleep || blinkClosed ? 'closed' : tired > 0.6 ? 'half' : 'open', mouth: f >= FO && f < SL ? 'open' : asleep ? 'smile' : 'line', talk: f >= FO && f < SL ? 0.5 + 0.5 * Math.sin(f / 3) : 0, brow: tired * 0.6, sweat: f >= H24 && f < SL}} />
        </g>
        {f >= FO && f < SL && <text x={760} y={900} fontSize={110}>🍩🍔</text>}
        {asleep && [0, 1, 2].map((i) => <text key={i} x={680 + i * 40} y={620 - i * 60 - ((f / 2) % 40)} fontFamily={FONT} fontWeight={900} fontSize={60 + i * 10} fill="#7ac8ff" opacity={0.8}>Z</text>)}
        {blinkClosed && <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={0.85} />}
      </SVG>
      {f < H17 && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 150, gap: 14}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 80, color: C.white, textAlign: 'center', lineHeight: 1.02, textShadow: '0 6px 0 #000'}}>НЕ СПАТЬ<br /><span style={{color: '#ffd23a'}}>СУТКИ?</span></div>
          {f >= DR && <div style={{padding: '12px 28px', borderRadius: 16, background: '#ff3a4a', fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#fff', opacity: ramp(f, DR, DR + 8)}}>= КАК ПЬЯНЫЙ</div>}
        </AbsoluteFill>
      )}
      {f >= H17 && f < MI && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 140, gap: 18}}>
          <div style={{display: 'flex', gap: 24}}>
            <div style={{padding: '18px 28px', borderRadius: 20, background: 'rgba(10,12,20,0.9)', textAlign: 'center'}}><div style={{fontFamily: MONO, fontWeight: 800, fontSize: 90, color: '#fff'}}>{hours} ч</div><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.grey}}>БЕЗ СНА</div></div>
            <div style={{padding: '18px 28px', borderRadius: 20, background: 'rgba(10,12,20,0.9)', textAlign: 'center', border: `4px solid ${prom >= 1 ? '#ff3a4a' : '#ffd23a'}`}}><div style={{fontFamily: MONO, fontWeight: 800, fontSize: 90, color: prom >= 1 ? '#ff3a4a' : '#ffd23a'}}>≈{prom.toFixed(1)}‰</div><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.grey}}>КАК АЛКОГОЛЬ</div></div>
          </div>
          {f >= CAR && <div style={{padding: '12px 28px', borderRadius: 16, background: '#ff3a4a', fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#fff', opacity: ramp(f, CAR, CAR + 8)}}>🚗 ЗА РУЛЬ — НЕЛЬЗЯ</div>}
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.grey}}>исследование Nature, 1997</div>
        </AbsoluteFill>
      )}
      {f >= MI && f < FO && <AbsoluteFill style={{alignItems: 'center', paddingTop: 170}}><div style={{padding: '16px 30px', borderRadius: 18, background: 'rgba(10,12,20,0.92)', fontFamily: FONT, fontWeight: 900, fontSize: 52, color: '#fff', textAlign: 'center'}}>МИКРОСОН<br /><span style={{color: '#7ac8ff', fontSize: 40}}>2–3 секунды «выключения»</span></div></AbsoluteFill>}
      {f >= FO && f < SL && <AbsoluteFill style={{alignItems: 'center', paddingTop: 170}}><div style={{padding: '16px 30px', borderRadius: 18, background: 'rgba(10,12,20,0.92)', fontFamily: FONT, fontWeight: 900, fontSize: 52, color: '#ffd23a'}}>ТЯНЕТ НА СЛАДКОЕ</div></AbsoluteFill>}
      {f >= SL && f < SU && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 170, gap: 16}}>
          <div style={{display: 'flex', gap: 16, opacity: ramp(f, NC, NC + 8)}}>{['☕', '⚡'].map((e) => <div key={e} style={{position: 'relative', fontSize: 80}}>{e}<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110, color: '#ff3a4a'}}>✕</div></div>)}</div>
          <div style={{padding: '14px 34px', borderRadius: 18, background: '#3ac87a', fontFamily: FONT, fontWeight: 900, fontSize: 60, color: '#0a0e14', transform: `scale(${0.9 + 0.1 * easeOut(ramp(f, SL, SL + 12))})`}}>😴 ТОЛЬКО СОН</div>
        </AbsoluteFill>
      )}
      {f >= SU && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 170, gap: 26}}>
          <div style={{padding: '16px 34px', borderRadius: 20, background: 'rgba(10,12,20,0.92)', fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#fff', textAlign: 'center', opacity: ramp(f - SU, 0, 10)}}>📤 ОТПРАВЬ ТОМУ,<br />КТО СИДИТ ДО УТРА</div>
          <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 6, 14)}}>+ ПОДПИСАТЬСЯ</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
