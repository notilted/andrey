import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Toon} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineLp1';
import {easeOut, ramp} from '../util';
import {HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «Потерял телефон: 4 шага». */

const RULES: [string, string, string, string][] = [
  ['r1', '1', 'ПОЗВОНИ НА СВОЙ НОМЕР', '📞'],
  ['r2', '2', '«НАЙТИ УСТРОЙСТВО» / «ЛОКАТОР»', '🗺️'],
  ['r3', '3', 'ЗАБЛОКИРУЙ КАРТЫ В БАНКЕ', '🏦🔒'],
  ['r4', '4', 'ОПЕРАТОР: БЛОК СИМ-КАРТЫ', '📶'],
];

export const SceneLp1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const FO = m('four'), R1 = m('r1'), IM = m('imei'), SU = m('sub');
  const cur = [...RULES].reverse().find(([k]) => f >= m(k));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>
        <Glow f={f} c1="#1a2a3a" c2="#05070c" cy={760} id="glp" />
        <rect x={-200} y={1250} width={1480} height={900} fill="#12141a" />
        <Toon id="mk" x={540} y={1300} s={1.1} f={f} look={HERO} pose={{eyes: f < R1 ? 'wide' : 'open', mouth: f < R1 ? 'fear' : 'line', armR: cur && (cur[0] === 'r1' || cur[0] === 'r3' || cur[0] === 'r4') ? [150, -150] : [20, 0], brow: f < R1 ? 1 : 0.2, sweat: f < R1}} />
        {f < R1 && <g transform={`translate(800 1240) rotate(${Math.sin(f) * 4})`}><rect x={-50} y={-90} width={100} height={180} rx={14} fill="#14171d" /><text x={0} y={10} textAnchor="middle" fontSize={60}>❓</text></g>}
      </SVG>
      {f < R1 && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 160, gap: 20}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.white, textAlign: 'center', lineHeight: 1.02, textShadow: '0 6px 0 #000'}}>ПОТЕРЯЛ<br /><span style={{color: '#ff3a4a'}}>ТЕЛЕФОН?</span></div>
          {f >= FO && <div style={{padding: '12px 30px', borderRadius: 18, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 48, color: '#14171d', opacity: ramp(f, FO, FO + 8)}}>4 ШАГА ЗА 10 МИНУТ</div>}
        </AbsoluteFill>
      )}
      {cur && f < IM && (() => {
        const [k, n, t, e] = cur;
        const tt = easeOut(ramp(f, m(k), m(k) + 10));
        return (
          <AbsoluteFill style={{alignItems: 'center', paddingTop: 160}}>
            <div style={{width: 940, display: 'flex', alignItems: 'center', gap: 22, padding: '22px 28px', borderRadius: 24, background: 'rgba(10,12,20,0.92)', border: '4px solid #ffd23a', opacity: tt, transform: `translateY(${(1 - tt) * -40}px)`}}>
              <div style={{width: 96, height: 96, borderRadius: 48, background: '#ffd23a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 60, color: '#14171d'}}>{n}</div>
              <div style={{flex: 1, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#fff', lineHeight: 1.05}}>{t}</div>
              <div style={{fontSize: 64}}>{e}</div>
            </div>
          </AbsoluteFill>
        );
      })()}
      {f >= IM && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 160, gap: 24}}>
          <div style={{padding: '16px 34px', borderRadius: 20, background: 'rgba(10,12,20,0.92)', fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#fff', textAlign: 'center', opacity: ramp(f - IM, 0, 10)}}>📦 СОХРАНИ IMEI С КОРОБКИ</div>
          {f >= SU && <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 0, 8)}}>+ ПОДПИСАТЬСЯ</div>}
          {f >= SU && <div style={{padding: '12px 30px', borderRadius: 20, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 36, color: '#14171d', opacity: ramp(f - SU, 10, 18)}}>19:00 — НОВЫЙ СЕРИАЛ «ЧУЖОЙ ТЕЛЕФОН»</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
