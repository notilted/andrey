import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineCf2';
import {easeOut, ramp} from '../util';
import {Phone, Taxi} from './SceneCf1';
import {SVG} from './twkit';

/** «Чужой телефон», часть 2. */

const GreyCar: React.FC<{x: number}> = ({x}) => (
  <g transform={`translate(${x} 420) scale(0.8)`}>
    <rect x={-170} y={-60} width={340} height={80} rx={20} fill="#5a5e68" />
    <path d="M-110 -60 L-70 -120 L80 -120 L120 -60 Z" fill="#4a4e58" />
    <rect x={-60} y={-110} width={110} height={44} fill="#1a1d24" />
    <circle cx={-100} cy={24} r={30} fill="#14161c" /><circle cx={100} cy={24} r={30} fill="#14161c" />
    <rect x={150} y={-40} width={22} height={16} fill="#ff3a4a" opacity={0.8} />
  </g>
);

export const SceneCf2: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const LI = m('lights'), WH = m('whisper'), GR = m('grey'), NV = m('notvillain'), PA = m('pass'), ST = m('stop'), RI = m('ring'), VO = m('voice'), WHO = m('who'), DO = m('door'), OP = m('open'), NX = m('next'), SU = m('sub');
  const dark = f >= LI ? 0.45 : 0;
  const carX = f < PA ? -400 : f < ST ? -400 + 1200 * easeOut(ramp(f, PA, ST)) : 800;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>
        {f < NX ? (
          <g>
            <Taxi f={f < LI ? f : LI} turn={0} dim={dark + (f >= RI && f < DO ? 0.3 : 0)} />
            {f >= PA && f < RI && <GreyCar x={carX} />}
          </g>
        ) : <rect x={-200} y={-200} width={1480} height={2400} fill="#08060c" />}
      </SVG>
      {f < WH && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 170, gap: 18}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.white, textAlign: 'center', lineHeight: 1.02, textShadow: '0 6px 0 #000'}}>ЧУЖОЙ<br /><span style={{color: '#ff3a4a'}}>ТЕЛЕФОН</span></div>
          <div style={{padding: '10px 28px', borderRadius: 16, background: '#ff3a4a', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff'}}>ЧАСТЬ 2</div>
        </AbsoluteFill>
      )}
      {f >= WH && f < PA && <Chip x={540} y={240} text={f < GR ? '«ЗА НАМИ ЕХАЛИ»' : f < NV ? 'СЕРАЯ · БЕЗ НОМЕРОВ' : 'ОН ЗАМЕТИЛ ХВОСТ'} kind={f < NV ? 'white' : 'yellow'} t={ramp(f, f < GR ? WH : f < NV ? GR : NV, (f < GR ? WH : f < NV ? GR : NV) + 8)} tilt={-2} size={46} />}
      {f >= ST && f < RI && <Chip x={540} y={240} text="ОСТАНОВИЛАСЬ В КОНЦЕ УЛИЦЫ" kind="red" t={ramp(f, ST, ST + 8)} tilt={-2} size={42} />}
      {f >= RI && f < DO && (
        <Phone f={f} ring={f < VO}>
          <div style={{marginTop: 120, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#fff'}}>НЕИЗВЕСТНЫЙ</div>
          <div style={{textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 48, color: f >= VO ? '#3ac87a' : C.grey}}>{f >= VO ? '00:0' + Math.min(9, Math.floor((f - VO) / 30)) : 'вызов…'}</div>
          {f >= VO && <div style={{marginTop: 30, padding: '20px 24px', borderRadius: 24, background: '#2a3040', fontFamily: FONT, fontWeight: 800, fontSize: 36, color: '#fff', lineHeight: 1.25, opacity: ramp(f, VO, VO + 8)}}>«Привези телефон к старому мосту.{f >= WHO ? ' Если хочешь узнать, кто тебя фотографировал.»' : '»'}</div>}
        </Phone>
      )}
      {f >= DO && f < NX && <Chip x={540} y={240} text={f < OP ? '«НЕ ЕЗДИ»' : 'ДВЕРЬ ОТКРЫТА'} kind={f < OP ? 'white' : 'red'} t={ramp(f, f < OP ? DO : OP, (f < OP ? DO : OP) + 8)} tilt={-2} size={52} />}
      {f >= NX && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.white, textAlign: 'center', lineHeight: 1.02, opacity: ramp(f - NX, 0, 10)}}>ЧУЖОЙ<br />ТЕЛЕФОН</div>
          <div style={{padding: '12px 30px', borderRadius: 20, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#14171d', opacity: ramp(f - NX, 8, 18)}}>ФИНАЛ — ЗАВТРА В 19:00</div>
          {f >= SU && <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 0, 8)}}>+ ПОДПИСАТЬСЯ</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
