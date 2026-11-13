import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Shake, Toon} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineFr1';
import {easeOut, ramp, rand} from '../util';
import {HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «Пятница, 13-е» (13.11.2026). */

const RED = '#ff3a4a';

export const SceneFr1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const TH = m('third'), PH = m('phob'), WO = m('word'), FL = m('floor'), SK = m('skip'), PL = m('plane'), NF = m('nextf'), AU = m('aug');
  const LI = m('lift'), PR = m('press'), RI = m('ride'), ST = m('stop'), SU = m('sub'), TN = m('tonight');
  const flick = rand(Math.floor(f / 3)) > 0.85 ? 0.4 : 0;
  const floorNum = f < RI ? 1 : f < ST + 30 ? Math.min(13, 1 + Math.floor((f - RI) / 2.2)) : 13;
  let scene: React.ReactNode = null;
  if (f < LI) {
    scene = <g><Glow f={f} c1="#3a0a14" c2="#050306" cy={760} id="gfr" /><rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={flick} /></g>;
  } else if (f < SU) {
    const dark = f >= ST + 30;
    scene = (
      <g>
        <rect x={-200} y={-200} width={1480} height={2400} fill="#1a1c22" />
        <rect x={140} y={260} width={800} height={1100} fill="#9aa0aa" />
        <rect x={160} y={280} width={760} height={1060} fill="#b8bec8" />
        <rect x={160} y={280} width={760} height={30} fill="#fff8e0" opacity={dark ? 0 : 0.9} />
        <g transform="translate(830 700)"><rect x={-60} y={-120} width={120} height={240} rx={10} fill="#5a6070" />{[0, 1, 2, 3].map((i) => <circle key={i} cx={0} cy={-80 + i * 52} r={18} fill={i === 0 && f >= PR ? '#ffd23a' : '#2a2e38'} />)}</g>
        <rect x={420} y={320} width={240} height={110} rx={10} fill="#0a0b10" />
        <text x={540} y={402} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={80} fill={floorNum === 13 ? RED : '#3ac87a'}>{floorNum}</text>
        {f >= ST && <Shake x={430} y={760} w={180} f={f} />}
        <Toon id="mk" x={430} y={1340} s={1.0} f={f} look={HERO} pose={{eyes: f >= ST ? 'wide' : 'open', mouth: f >= ST ? 'fear' : 'smirk', armR: f >= PR && f < RI ? [100, -20] : [20, 0], brow: f >= ST ? 1 : -0.2, sweat: f >= ST, shake: f >= ST}} />
        <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={dark ? 0.65 + (rand(Math.floor(f / 4)) > 0.8 ? 0.25 : 0) : 0} />
      </g>
    );
  } else scene = <Glow f={f} c1="#3a0a14" c2="#0a0306" cy={700} id="gsub" />;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < PH && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 220, gap: 24}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.white, textShadow: '0 6px 0 #000'}}>ПЯТНИЦА</div>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 300, color: RED, lineHeight: 0.9, textShadow: '0 8px 0 #000'}}>13</div>
          {f >= TH && <div style={{display: 'flex', gap: 16, opacity: ramp(f, TH, TH + 8)}}>{['ФЕВ', 'МАР', 'НОЯ'].map((t, i) => <div key={t} style={{padding: '10px 22px', borderRadius: 14, background: i === 2 ? RED : 'rgba(255,255,255,0.12)', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff'}}>{t} 2026</div>)}</div>}
        </AbsoluteFill>
      )}
      {f >= PH && f < FL && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 300, gap: 24}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.grey}}>СТРАХ ПЯТНИЦЫ 13-ГО:</div>
          <div style={{maxWidth: 960, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#ffd23a', textAlign: 'center', lineHeight: 1.05, opacity: ramp(f, WO, WO + 10), wordBreak: 'break-all'}}>ПАРАСКАВЕДЕКАТРИАФОБИЯ</div>
          {f >= m('say') && <div style={{fontSize: 90, opacity: ramp(f, m('say'), m('say') + 8)}}>🤯</div>}
        </AbsoluteFill>
      )}
      {f >= FL && f < NF && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 240, gap: 20}}>
          <div style={{display: 'flex', flexDirection: 'column-reverse', gap: 10}}>
            {[11, 12, 13, 14, 15].map((n) => {
              const gone = n === 13 && f >= SK;
              return <div key={n} style={{width: 420, padding: '16px 0', borderRadius: 14, textAlign: 'center', background: gone ? 'transparent' : 'rgba(255,255,255,0.1)', border: gone ? `4px dashed ${RED}` : 'none', fontFamily: MONO, fontWeight: 800, fontSize: 56, color: gone ? RED : '#fff', textDecoration: gone ? 'line-through' : 'none'}}>{n} ЭТАЖ</div>;
            })}
          </div>
          {f >= PL && <div style={{marginTop: 20, padding: '12px 28px', borderRadius: 16, background: 'rgba(10,12,20,0.9)', fontFamily: FONT, fontWeight: 900, fontSize: 42, color: '#fff', opacity: ramp(f, PL, PL + 8)}}>✈️ РЯД 12 → РЯД 14</div>}
        </AbsoluteFill>
      )}
      {f >= NF && f < LI && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 300, gap: 20}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.grey}}>СЛЕДУЮЩАЯ</div>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 130, color: '#ffd23a', opacity: easeOut(ramp(f, AU, AU + 10))}}>13.08.2027</div>
        </AbsoluteFill>
      )}
      {f >= ST + 20 && f < SU && <Chip x={540} y={200} text="13-Й ЭТАЖ" kind="red" t={ramp(f, ST + 20, ST + 28)} tilt={-3} size={60} />}
      {f >= SU && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 62, color: C.white, textAlign: 'center', opacity: ramp(f - SU, 0, 10)}}>КАЖДЫЙ ДЕНЬ<br />НОВЫЕ ИСТОРИИ</div>
          <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 6, 14)}}>+ ПОДПИСАТЬСЯ</div>
          {f >= TN && <div style={{padding: '12px 30px', borderRadius: 20, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 36, color: '#14171d', opacity: ramp(f - TN, 0, 10)}}>19:00 — «БАБУШКИНЫ 2 МИЛЛИОНА» · ЧАСТЬ 2</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
