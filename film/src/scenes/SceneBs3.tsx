import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Toon, ToonLook} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineBs3';
import {easeOut, ramp} from '../util';
import {HERO} from './SceneCr2';
import {Kitchen, Yard} from './SceneBs2';
import {SVG} from './twkit';

/** «Без сигнала», часть 3 — финал. */

const GRAN: ToonLook = {skin: '#f0c8a8', skinD: '#d8b090', hair: '#d8d8d8', top: '#8a5a7a', topD: '#724862', legs: '#3a2e38', legsD: '#2e242c', shoes: '#4a2a1a', longHair: true, scarf: '#c83030', scale: 0.92};

const Radio: React.FC<{x: number; y: number; s?: number; f: number; on: boolean}> = ({x, y, s = 1, f, on}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={60} y1={-70} x2={120} y2={-190} stroke="#9aa4b0" strokeWidth={6} />
    <rect x={-110} y={-70} width={220} height={140} rx={18} fill="#8a4a2a" />
    <circle cx={-45} cy={0} r={42} fill="#3a2418" />
    {[0, 1, 2].map((i) => <circle key={i} cx={-45} cy={0} r={12 + i * 10} fill="none" stroke="#5a3a28" strokeWidth={3} />)}
    <rect x={20} y={-34} width={70} height={30} rx={4} fill={on ? '#ffd23a' : '#4a3020'} />
    {on && [0, 1, 2].map((i) => <path key={i} d={`M${130 + i * 30} -40 q20 40 0 80`} fill="none" stroke="#ffd23a" strokeWidth={6} opacity={(Math.sin(f / 5 - i) + 1) / 2} />)}
  </g>
);

const Night: React.FC<{f: number; children?: React.ReactNode}> = ({f, children}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#070910" />
    <rect x={-200} y={1250} width={1480} height={900} fill="#0c0e14" />
    <circle cx={540} cy={1000} r={420} fill="#ffb03a" opacity={0.08 + 0.02 * Math.sin(f / 7)} />
    {children}
  </g>
);

export const SceneBs3: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const NI = m('night'), GR = m('gran'), QU = m('queue'), TA = m('table'), CA = m('cash'), RA = m('radio'), NE = m('news'), MO = m('morning');
  const SIX = m('six'), FR = m('fridge'), LA = m('lamp'), NO = m('notif'), KIT = m('kit'), END = m('end'), SUB = m('sub');
  let scene: React.ReactNode = null;
  if (f < GR) scene = <Yard f={f} gen />;
  else if (f < CA) {
    scene = (
      <Night f={f}>
        <rect x={560} y={1060} width={460} height={24} rx={8} fill="#6a4a2a" opacity={ramp(f, TA, TA + 10)} />
        {f >= TA && [0, 1, 2, 3].map((i) => <ellipse key={i} cx={620 + i * 110} cy={1050} rx={44} ry={16} fill={['#f2c860', '#e8e4da', '#ff8a5a', '#3ac87a'][i]} opacity={ramp(f, TA + i * 6, TA + i * 6 + 8)} />)}
        <g transform="translate(250 1250)"><rect x={-90} y={-110} width={180} height={110} rx={10} fill="#c83030" /><rect x={-70} y={-90} width={140} height={60} rx={6} fill="#2a2a2a" /></g>
        {f >= QU && Array.from({length: 6}).map((_, i) => (
          <g key={i} transform={`translate(${80 + i * 80} 1270)`} opacity={ramp(f, QU + i * 5, QU + i * 5 + 8)}>
            <rect x={-26} y={-50} width={52} height={90} rx={8} fill="#14171d" /><rect x={-20} y={-42} width={40} height={74} rx={4} fill={i === Math.floor(f / 20) % 6 ? '#3ac87a' : '#1e2a3a'} />
          </g>
        ))}
        <Toon id="gr" x={700} y={1240} s={1.05} f={f} look={GRAN} facing={-1} pose={{eyes: 'open', mouth: 'open', talk: 0.5 + 0.5 * Math.sin(f / 3), armR: [80, -40], brow: -0.2}} />
      </Night>
    );
  } else if (f < NE) {
    scene = (
      <Night f={f}>
        <Toon id="gr2" x={380} y={1240} s={1.1} f={f} look={GRAN} facing={1} pose={{eyes: 'open', mouth: 'smirk', armR: [100, -60]}} />
        <g transform="translate(560 860) rotate(-8)" opacity={ramp(f, CA, CA + 10)}>{[0, 1, 2].map((i) => <rect key={i} x={i * 12} y={-i * 10} width={150} height={74} rx={6} fill="#7ac88a" stroke="#4a8a5a" strokeWidth={4} />)}<text x={85} y={20} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={34} fill="#2a5a3a">₽</text></g>
        {f >= RA && <Radio x={780} y={1150} f={f} on={false} />}
      </Night>
    );
  } else if (f < SIX) {
    scene = <Night f={f}><Radio x={540} y={900} s={2.1} f={f} on /></Night>;
  } else if (f < KIT) {
    const light = f >= LA ? ramp(f, LA, LA + 10) : 0;
    scene = (
      <g>
        <Kitchen f={f} mode="fridge" drip={0} />
        <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={0.55 * (1 - light)} />
        {light > 0 && <g><circle cx={540} cy={140} r={60} fill="#fff2c8" opacity={light} /><circle cx={540} cy={140} r={300} fill="#fff2c8" opacity={0.12 * light} /></g>}
        {f >= FR && f < LA && <circle cx={780} cy={420} r={14} fill="#3ac87a" />}
      </g>
    );
  } else if (f < END) {
    scene = <g><Glow f={f} c1="#2a2a3a" c2="#08080c" cy={800} id="gkit" /><Toon id="mk5" x={240} y={1200} s={0.9} f={f} look={HERO} facing={1} pose={{eyes: 'open', mouth: 'smile', armR: [110, -50]}} /></g>;
  } else scene = <Glow f={f} c1="#3a2a5a" c2="#0a0810" cy={700} id="gend" />;
  const notifs = Math.min(127, Math.round(127 * easeOut(ramp(f, NO + 10, NO + 50))));
  const items: [string, string, string][] = [['💵', 'НАЛИЧНЫЕ', 'k1'], ['🔦', 'ФОНАРИК', 'k2'], ['🔋', 'ПАУЭРБАНК', 'k3'], ['💧', 'ВОДА', 'k4'], ['📻', 'РАДИО', 'k5']];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < GR && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 170, gap: 20}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 92, color: C.white, textAlign: 'center', lineHeight: 1.02, textShadow: '0 6px 0 #000'}}>БЕЗ СИГНАЛА<br /><span style={{color: '#ffd23a'}}>ЧАСТЬ 3 · ФИНАЛ</span></div>
          {f >= NI && <div style={{padding: '12px 30px', borderRadius: 18, background: '#ff4f6a', fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#fff', opacity: ramp(f, NI, NI + 8)}}>1 ГЕНЕРАТОР · 20 СОСЕДЕЙ</div>}
        </AbsoluteFill>
      )}
      {f >= QU && f < CA && <Chip x={540} y={260} text={f < TA ? 'ЗАРЯДКА ПО ОЧЕРЕДИ' : 'ЕДА — НА ОБЩИЙ СТОЛ'} kind="yellow" t={ramp(f, f < TA ? QU : TA, (f < TA ? QU : TA) + 8)} tilt={-2} size={46} />}
      {f >= CA && f < NE && <Chip x={540} y={260} text={f < RA ? 'НАЛИЧНЫЕ' : '+ РАДИО НА БАТАРЕЙКАХ'} kind="white" t={ramp(f, f < RA ? CA : RA, (f < RA ? CA : RA) + 8)} tilt={2} size={48} />}
      {f >= NE && f < SIX && <Chip x={540} y={300} text={f < MO ? 'ПЕРВАЯ НОВОСТЬ ЗА СУТКИ' : 'СВЕТ ДАДУТ К УТРУ'} kind={f < MO ? 'white' : 'yellow'} t={ramp(f, f < MO ? NE : MO, (f < MO ? NE : MO) + 8)} tilt={-2} size={46} />}
      {f >= SIX && f < KIT && <Chip x={540} y={330} text="06:00" kind="white" t={ramp(f, SIX, SIX + 8)} tilt={0} size={60} />}
      {f >= NO && f < KIT && (
        <div style={{position: 'absolute', left: 140, top: 560, width: 380, padding: 24, borderRadius: 34, background: '#14171d', border: '6px solid #2a2e38', transform: `rotate(-6deg) scale(${1 + 0.03 * Math.sin(f)})`, opacity: ramp(f, NO, NO + 8)}}>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{margin: '8px 0', padding: '10px 14px', borderRadius: 12, background: '#2a3040', fontFamily: FONT, fontWeight: 800, fontSize: 24, color: '#fff', opacity: ramp(f, NO + 8 + i * 5, NO + 14 + i * 5)}}>{['📩 Мама (12)', '💬 Чат дома (48)', '🏦 Банк: связь восстановлена', '📰 Новости (31)'][i]}</div>)}
          <div style={{textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 48, color: '#ff4f6a', marginTop: 8}}>{notifs}+</div>
        </div>
      )}
      {f >= KIT && f < END && (
        <AbsoluteFill style={{alignItems: 'flex-end', paddingTop: 260, paddingRight: 60, gap: 16}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 50, color: '#ffd23a', marginBottom: 10, opacity: ramp(f, KIT, KIT + 8)}}>ЯЩИК «НА ВСЯКИЙ СЛУЧАЙ»</div>
          {items.map(([e, t, k]) => <div key={k} style={{width: 520, padding: '16px 26px', borderRadius: 18, background: 'rgba(20,23,29,0.92)', border: '3px solid #3a3e48', fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#fff', opacity: ramp(f, m(k), m(k) + 6), transform: `translateX(${(1 - easeOut(ramp(f, m(k), m(k) + 8))) * 60}px)`}}>{e} {t}</div>)}
        </AbsoluteFill>
      )}
      {f >= END && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 110, color: C.white, opacity: ramp(f - END, 0, 10)}}>КОНЕЦ</div>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.grey, opacity: ramp(f - END, 6, 14)}}>«БЕЗ СИГНАЛА» · 3 ЧАСТИ</div>
          {f >= SUB && <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SUB) / 4)})`, opacity: ramp(f - SUB, 0, 8)}}>+ ПОДПИСАТЬСЯ</div>}
          {f >= SUB && <div style={{padding: '12px 30px', borderRadius: 20, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 38, color: '#14171d', opacity: ramp(f - SUB, 10, 18)}}>ЗАВТРА — НОВАЯ ИСТОРИЯ</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
