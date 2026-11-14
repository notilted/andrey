import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Toon} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineLf1';
import {easeOut, ramp, rand} from '../util';
import {HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «Застрял в лифте: 5 правил». */

const RULES: [string, string, string, string][] = [
  ['r1', '1', 'НЕ ПАНИКУЙ И НЕ ПРЫГАЙ', '🚫🦘'],
  ['r2', '2', 'КНОПКА ДИСПЕТЧЕРА', '🔔'],
  ['r3', '3', 'НЕТ ОТВЕТА — 112', '📞'],
  ['r4', '4', 'НЕ РАЗЖИМАЙ ДВЕРИ, НЕ ЛЕЗЬ В ЛЮК', '🚪⛔'],
  ['r5', '5', 'БЕРЕГИ ЗАРЯД И ЖДИ', '🔋⏳'],
];

export const SceneLf1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const FI = m('five'), R1 = m('r1'), SU = m('sub');
  const cur = [...RULES].reverse().find(([k]) => f >= m(k));
  const flick = f < R1 && rand(Math.floor(f / 3)) > 0.82 ? 0.5 : 0;
  const shake = f < 20 ? Math.sin(f * 2.3) * (20 - f) : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>
        <g transform={`translate(${shake} 0)`}>
          <rect x={-200} y={-200} width={1480} height={2400} fill="#1a1c22" />
          <rect x={140} y={260} width={800} height={1100} fill="#9aa0aa" />
          <rect x={160} y={280} width={760} height={1060} fill="#b8bec8" />
          <rect x={160} y={280} width={760} height={30} fill="#fff8e0" opacity={0.9} />
          <g transform="translate(830 700)"><rect x={-60} y={-120} width={120} height={240} rx={10} fill="#5a6070" />{[0, 1, 2].map((i) => <circle key={i} cx={0} cy={-70 + i * 60} r={20} fill="#2a2e38" />)}<circle cx={0} cy={110 - 10} r={0} fill="none" /></g>
          <g transform="translate(830 860)"><circle r={30} fill={cur && cur[0] === 'r2' ? '#ffd23a' : '#4a4e58'} /><text y={12} textAnchor="middle" fontSize={34}>🔔</text></g>
          <rect x={420} y={320} width={240} height={110} rx={10} fill="#0a0b10" />
          <text x={540} y={402} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={70} fill="#ff3a4a">{Math.floor(f / 15) % 2 ? '7' : '—'}</text>
          <Toon id="mk" x={430} y={1340} s={1.0} f={f} look={HERO} pose={{eyes: f < R1 ? 'wide' : 'open', mouth: f < R1 ? 'fear' : f >= SU ? 'smile' : 'line', armR: cur && cur[0] === 'r3' ? [150, -150] : [20, 0], brow: f < R1 ? 1 : 0.2, sweat: f < R1}} />
          <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={flick} />
        </g>
      </SVG>
      {f < R1 && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 140, gap: 20}}>
          <div style={{padding: '14px 30px', borderRadius: 20, background: 'rgba(10,12,20,0.9)', fontFamily: FONT, fontWeight: 900, fontSize: 72, color: C.white, textAlign: 'center', lineHeight: 1.05}}>ЗАСТРЯЛ<br /><span style={{color: '#ff3a4a'}}>В ЛИФТЕ?</span></div>
          {f >= FI && <div style={{padding: '12px 30px', borderRadius: 18, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 48, color: '#14171d', opacity: ramp(f, FI, FI + 8)}}>5 ПРАВИЛ</div>}
        </AbsoluteFill>
      )}
      {cur && f < SU && (() => {
        const [k, n, t, e] = cur;
        const tt = easeOut(ramp(f, m(k), m(k) + 10));
        return (
          <AbsoluteFill style={{alignItems: 'center', paddingTop: 120}}>
            <div style={{width: 940, display: 'flex', alignItems: 'center', gap: 22, padding: '22px 28px', borderRadius: 24, background: 'rgba(10,12,20,0.92)', border: '4px solid #ffd23a', opacity: tt, transform: `translateY(${(1 - tt) * -40}px)`}}>
              <div style={{width: 96, height: 96, borderRadius: 48, background: '#ffd23a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 60, color: '#14171d'}}>{n}</div>
              <div style={{flex: 1, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#fff', lineHeight: 1.05}}>{t}</div>
              <div style={{fontSize: 64}}>{e}</div>
            </div>
            {k === 'r3' && f >= m('free') && <div style={{marginTop: 18, padding: '10px 24px', borderRadius: 14, background: '#3ac87a', fontFamily: FONT, fontWeight: 900, fontSize: 36, color: '#0a0e14', opacity: ramp(f, m('free'), m('free') + 8)}}>БЕСПЛАТНО С МОБИЛЬНОГО</div>}
          </AbsoluteFill>
        );
      })()}
      {f >= SU && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 160, gap: 26}}>
          <div style={{padding: '16px 34px', borderRadius: 20, background: 'rgba(10,12,20,0.92)', fontFamily: FONT, fontWeight: 900, fontSize: 52, color: '#fff', opacity: ramp(f - SU, 0, 10)}}>📌 СОХРАНИ</div>
          <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 6, 14)}}>+ ПОДПИСАТЬСЯ</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
