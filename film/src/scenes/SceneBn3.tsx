import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Toon} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineBn3';
import {easeOut, ramp} from '../util';
import {HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «Бабушкины 2 миллиона», сезон 2 — финал. */

const Shop: React.FC<{x: number; s: number; f: number; dim?: boolean; label?: string}> = ({x, s, f, dim, label = 'БАБУШКИНЫ'}) => (
  <g transform={`translate(${x} 1150) scale(${s})`}>
    <rect x={-160} y={-300} width={320} height={300} fill={dim ? '#2a2a30' : '#3a2a24'} />
    <rect x={-170} y={-360} width={340} height={70} rx={10} fill={dim ? '#4a4a55' : '#c8503a'} />
    <text x={0} y={-313} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={dim ? '#9a9aa5' : '#ffe8c0'}>{label}</text>
    <rect x={-130} y={-260} width={260} height={150} fill={dim ? '#3a3e48' : '#ffd88a'} opacity={dim ? 1 : 0.85 + 0.1 * Math.sin(f / 9)} />
    <rect x={-40} y={-100} width={80} height={100} fill="#1a120e" />
  </g>
);

export const SceneBn3: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const ST = m('stolen'), HA = m('hands'), YE = m('year'), IY = m('inyou'), YO = m('you'), RI = m('rival'), ZE = m('zero'), WH = m('why'), CO = m('court'), AN = m('annul'), PA = m('parcel'), BO = m('book'), NO = m('note'), END = m('end'), SU = m('sub');
  const ings: [string, string, number][] = [['🥛', 'КЕФИР', m('i1')], ['🌿', 'ЗИРА', m('i2')], ['🧄', 'ЧЕСНОК', m('i3')], ['🍷', 'ГРАНАТОВЫЙ СОК', m('i4')]];
  let scene: React.ReactNode = null;
  if (f < HA) {
    scene = (
      <g>
        <rect x={-200} y={-200} width={1480} height={2400} fill="#06050a" />
        <circle cx={540} cy={820} r={360} fill="#ffd88a" opacity={0.06} />
        <rect x={160} y={900} width={760} height={30} fill="#3a2a1e" />
        <rect x={380} y={830} width={320} height={70} rx={6} fill="none" stroke="#8a7a6a" strokeWidth={5} strokeDasharray="20 14" />
        <Toon id="mk0" x={540} y={1300} s={0.85} f={f} look={HERO} pose={{eyes: 'half', mouth: 'line', brow: 0.8}} />
      </g>
    );
  } else if (f < RI) {
    scene = (
      <g>
        <Glow f={f} c1={f >= IY ? '#5a3a1a' : '#3a2a1a'} c2="#0a0806" cy={600} id="gk" />
        <rect x={-200} y={1000} width={1480} height={1000} fill="#2a2420" />
        <rect x={100} y={980} width={880} height={30} fill="#7a6a5a" />
        <g transform="translate(540 960)"><ellipse rx={170} ry={44} fill="#c8c0b0" /><ellipse cy={-14} rx={140} ry={30} fill="#e8dcc0" />{f >= YE && [0, 1, 2, 3].map((i) => <ellipse key={i} cx={-60 + i * 40} cy={-22} rx={22} ry={10} fill="#a84a3a" />)}</g>
        <Toon id="mk1" x={540} y={1230} s={1.0} f={f} look={{...HERO, hat: '#f2f0e8'}} pose={{eyes: f >= YO ? 'open' : 'half', mouth: f >= YO ? 'smile' : 'line', armR: [60, -40], armL: [60, -40]}} />
      </g>
    );
  } else if (f < PA) {
    const court = f >= CO;
    scene = court ? (
      <g>
        <Glow f={f} c1="#2a2a3a" c2="#08080c" cy={700} id="gc" />
        <rect x={-200} y={1150} width={1480} height={900} fill="#14141a" />
        <rect x={220} y={820} width={640} height={330} fill="#5a3a24" /><rect x={200} y={800} width={680} height={30} fill="#6a4a2e" />
        <g transform={`translate(700 ${f >= AN ? 780 : 740}) rotate(${f >= AN ? 0 : -30})`}><rect x={-14} y={-10} width={28} height={110} fill="#8a5a2a" /><rect x={-50} y={-40} width={100} height={44} rx={8} fill="#6a3a1a" /></g>
      </g>
    ) : (
      <g>
        <Glow f={f} c1="#2a1e3a" c2="#08060c" cy={700} id="gr" />
        <rect x={-200} y={1150} width={1480} height={900} fill="#16141c" />
        <Shop x={280} s={0.9} f={f} />
        <Shop x={800} s={0.9} f={f} dim label="БАБУШКИНЫ?" />
        {Array.from({length: 7}).map((_, i) => <g key={i} transform={`translate(${60 + i * 60} 1290)`}><circle cy={-110} r={24} fill={['#e2b494', '#c99878', '#f0c8a8'][i % 3]} /><rect x={-26} y={-88} width={52} height={88} rx={18} fill={['#3a7ac8', '#c8506a', '#3ac87a', '#ffb03a'][i % 4]} /></g>)}
      </g>
    );
  } else if (f < END) {
    const open = f >= BO ? easeOut(ramp(f, BO, BO + 20)) : 0;
    scene = (
      <g>
        <Glow f={f} c1="#3a2a1a" c2="#0a0806" cy={760} id="gp" />
        <g transform="translate(540 900)">
          <rect x={-240} y={-140} width={480} height={280} rx={10} fill="#b08050" />
          <rect x={-240} y={-140 - 120 * open} width={480} height={40} fill="#c09060" />
          <line x1={0} y1={-140} x2={0} y2={140} stroke="#8a6030" strokeWidth={8} />
          {open > 0 && <g transform={`translate(0 ${-140 - 160 * open})`}><rect x={-120} y={-80} width={240} height={160} rx={6} fill="#e8dcc0" /><line x1={0} y1={-80} x2={0} y2={80} stroke="#b8a888" strokeWidth={4} /><text x={60} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} fill="#6a5a8a">Внуку</text></g>}
        </g>
      </g>
    );
  } else scene = <Glow f={f} c1="#3a2a1a" c2="#0a0806" cy={700} id="gend" />;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < HA && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 170, gap: 18}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.white, textAlign: 'center', lineHeight: 1.02, textShadow: '0 6px 0 #000'}}>БАБУШКИНЫ<br /><span style={{color: '#ffd23a'}}>2 МИЛЛИОНА</span></div>
          <div style={{padding: '10px 28px', borderRadius: 16, background: '#c8503a', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff'}}>СЕЗОН 2 · ФИНАЛ</div>
          {f >= ST && <div style={{marginTop: 10, fontFamily: FONT, fontWeight: 900, fontSize: 48, color: '#ff4f6a', opacity: ramp(f, ST, ST + 8)}}>ТЕТРАДЬ УКРАДЕНА</div>}
        </AbsoluteFill>
      )}
      {f >= HA && f < IY && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 160, gap: 14}}>
          {ings.map(([e, t, a]) => <div key={t} style={{width: 640, padding: '14px 26px', borderRadius: 18, background: 'rgba(10,12,20,0.85)', fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#fff', opacity: ramp(f, a, a + 6), transform: `translateX(${(1 - easeOut(ramp(f, a, a + 8))) * -60}px)`}}>{e} {t}</div>)}
          {f >= YE && <div style={{marginTop: 8, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#ffd23a', opacity: ramp(f, YE, YE + 8)}}>КАЖДЫЙ ДЕНЬ · ЦЕЛЫЙ ГОД</div>}
        </AbsoluteFill>
      )}
      {f >= IY && f < RI && <Chip x={540} y={260} text={f < YO ? 'РЕЦЕПТ БЫЛ НЕ В ТЕТРАДИ' : 'ОН БЫЛ В ТЕБЕ'} kind={f < YO ? 'white' : 'yellow'} t={ramp(f, f < YO ? IY : YO, (f < YO ? IY : YO) + 8)} tilt={-2} size={54} />}
      {f >= RI && f < CO && <Chip x={540} y={260} text={f < ZE ? 'ЧУЖАЯ ТОЧКА НАПРОТИВ' : f < WH ? 'ОЧЕРЕДЬ — 0' : 'МЯСО ДОЛЖНО НОЧЕВАТЬ'} kind={f < ZE ? 'white' : f < WH ? 'red' : 'yellow'} t={ramp(f, f < ZE ? RI : f < WH ? ZE : WH, (f < ZE ? RI : f < WH ? ZE : WH) + 8)} tilt={-2} size={50} />}
      {f >= CO && f < PA && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 200, gap: 20}}>
          <div style={{padding: '12px 28px', borderRadius: 16, background: 'rgba(10,12,20,0.9)', fontFamily: FONT, fontWeight: 900, fontSize: 42, color: '#fff', opacity: ramp(f, CO, CO + 8)}}>📱 ВИДЕО ГОДИЧНОЙ ДАВНОСТИ</div>
          {f >= AN && <div style={{padding: '14px 34px', border: '8px solid #3ac87a', borderRadius: 14, fontFamily: FONT, fontWeight: 900, fontSize: 60, color: '#3ac87a', transform: `rotate(-6deg) scale(${1.5 - 0.5 * easeOut(ramp(f, AN, AN + 10))})`, opacity: ramp(f, AN, AN + 6), background: 'rgba(10,12,20,0.8)'}}>ЗНАК АННУЛИРОВАН</div>}
        </AbsoluteFill>
      )}
      {f >= PA && f < END && <Chip x={540} y={260} text={f < BO ? 'ПОСЫЛКА БЕЗ ОБРАТНОГО АДРЕСА' : f < NO ? 'БАБУШКИНА ТЕТРАДЬ' : '«НЕ ПОЛУЧИЛОСЬ. ИЗВИНИ»'} kind={f < NO ? 'white' : 'yellow'} t={ramp(f, f < BO ? PA : f < NO ? BO : NO, (f < BO ? PA : f < NO ? BO : NO) + 8)} tilt={-2} size={44} />}
      {f >= END && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 30, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.white, opacity: ramp(f - END, 0, 10)}}>КОНЕЦ</div>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.grey, opacity: ramp(f - END, 6, 14)}}>«БАБУШКИНЫ 2 МИЛЛИОНА» · СЕЗОН 2</div>
          {f >= SU && <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 0, 8)}}>+ ПОДПИСАТЬСЯ</div>}
          {f >= SU && <div style={{padding: '12px 30px', borderRadius: 20, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 38, color: '#14171d', opacity: ramp(f - SU, 10, 18)}}>ЗАВТРА — НОВАЯ ИСТОРИЯ</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
