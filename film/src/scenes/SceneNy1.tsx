import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Toon} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineNy1';
import {easeOut, ramp, rand} from '../util';
import {HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «11 дней каникул» — план против реальности (тренд: каникулы 2027, 31.12–10.01). */

const DAYS = ['31', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const Snow: React.FC<{f: number}> = ({f}) => <g>{Array.from({length: 40}).map((_, i) => <circle key={i} cx={(rand(i) * 1080 + Math.sin(f / 20 + i) * 20) % 1080} cy={(rand(i + 7) * 1920 + f * (1 + rand(i + 3) * 2)) % 1920} r={3 + rand(i + 1) * 4} fill="#fff" opacity={0.5} />)}</g>;

const Sofa: React.FC<{f: number; tv: boolean; pose: 'eat' | 'lazy' | 'sad'}> = ({f, tv, pose}) => (
  <g>
    <Glow f={f} c1={tv ? '#24305a' : '#2a1e3a'} c2="#06050c" cy={600} id="gsofa" />
    <rect x={-200} y={1150} width={1480} height={900} fill="#141820" />
    {tv && <g transform="translate(540 420)"><rect x={-300} y={-170} width={600} height={340} rx={14} fill="#0a0b10" stroke="#2a2e38" strokeWidth={8} /><rect x={-284} y={-154} width={568} height={308} fill="#1a3a6a" opacity={0.6 + 0.3 * Math.sin(f / 5)} /></g>}
    <path d="M180 780 L180 640 L210 610 L240 640 L240 780 Z" fill="#2e8a4a" />
    <circle cx={210} cy={610} r={8} fill="#ffd23a" />
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={190 + i * 10} cy={680 + i * 25} r={7} fill={['#ff4f6a', '#ffd23a', '#5ad1ff', '#ff4f6a'][i]} opacity={0.6 + 0.4 * Math.sin(f / 6 + i)} />)}
    <rect x={250} y={1000} width={580} height={200} rx={50} fill="#5a3a4a" />
    <rect x={250} y={880} width={110} height={300} rx={40} fill="#4e3240" /><rect x={720} y={880} width={110} height={300} rx={40} fill="#4e3240" />
    <Toon id="mk" x={540} y={1150} s={1.0} f={f} look={HERO} pose={{sit: 1, eyes: pose === 'sad' ? 'wide' : 'half', mouth: pose === 'eat' ? 'open' : pose === 'sad' ? 'fear' : 'smile', talk: pose === 'eat' ? 0.5 + 0.5 * Math.sin(f / 3) : 0, armR: [70, -100], brow: pose === 'sad' ? 1 : 0, sweat: pose === 'sad'}} />
    {pose === 'eat' && <g transform="translate(700 1000)"><ellipse rx={90} ry={30} fill="#e8e4da" /><ellipse cy={-12} rx={70} ry={22} fill="#f2c860" /><circle cx={-20} cy={-20} r={10} fill="#3ac87a" /><circle cx={20} cy={-16} r={9} fill="#ff4f6a" /></g>}
  </g>
);

export const SceneNy1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const RA = m('range'), PL = m('plan'), D1 = m('d1'), D2 = m('d2'), D3 = m('d3'), J7 = m('jan7'), S1 = m('st1'), S2 = m('st2'), S3 = m('st3'), EV = m('eve'), BU = m('busy'), WO = m('work'), SU = m('sub');
  let scene: React.ReactNode = null;
  if (f < PL) scene = <g><Glow f={f} c1="#1a2a5a" c2="#05070e" cy={800} id="gh" /><Snow f={f} /></g>;
  else if (f < D1) scene = <g><Glow f={f} c1="#1a2a3a" c2="#05070c" cy={800} id="gp" /><Toon id="mkp" x={830} y={1180} s={0.9} f={f} look={HERO} facing={-1} pose={{eyes: 'open', mouth: 'grin', armR: [140, -40], brow: -0.3}} /></g>;
  else if (f < J7) scene = <Sofa f={f} tv={false} pose="eat" />;
  else if (f < EV) scene = <Sofa f={f} tv pose="lazy" />;
  else if (f < WO) scene = <g><Sofa f={f} tv={false} pose={f >= BU ? 'sad' : 'lazy'} /><rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={0.35} /></g>;
  else scene = <g><Glow f={f} c1="#3a2a5a" c2="#0a0810" cy={700} id="gw" /><Snow f={f} /></g>;
  const lit = Math.floor(ramp(f, 10, RA) * 11);
  const day = f < D2 ? 1 : f < D3 ? 2 : 3;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < PL && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 170, gap: 30}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 110, color: C.white, textAlign: 'center', lineHeight: 1, textShadow: '0 6px 0 #000'}}>11 ДНЕЙ<br /><span style={{color: '#ffd23a'}}>КАНИКУЛ</span></div>
          <div style={{display: 'flex', flexWrap: 'wrap', width: 900, justifyContent: 'center', gap: 14, marginTop: 20}}>
            {DAYS.map((d, i) => <div key={d} style={{width: 150, height: 130, borderRadius: 18, background: i < lit ? (i === 0 ? '#ff4f6a' : '#3ac87a') : 'rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${i < lit ? 1 : 0.9})`}}>
              <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 56, color: '#fff'}}>{d}</div>
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 22, color: 'rgba(255,255,255,0.8)'}}>{i === 0 ? 'ДЕК' : 'ЯНВ'}</div>
            </div>)}
          </div>
          {f >= RA && <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.grey, opacity: ramp(f, RA, RA + 10)}}>31.12.2026 — 10.01.2027</div>}
        </AbsoluteFill>
      )}
      {f >= PL && f < D1 && (
        <AbsoluteFill style={{paddingTop: 200, paddingLeft: 70}}>
          <div style={{width: 640, padding: '40px 46px', borderRadius: 26, background: '#f4efe2', transform: 'rotate(-2deg)'}}>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 58, color: '#14171d', marginBottom: 20}}>ПЛАН НА КАНИКУЛЫ</div>
            {[['💪 спортзал', 'gym'], ['🇬🇧 английский', 'eng'], ['😴 выспаться', 'sleep'], ['✅ закрыть все дела', 'todo']].map(([t, k]) => (
              <div key={k} style={{fontFamily: FONT, fontWeight: 800, fontSize: 46, color: '#14171d', margin: '14px 0', opacity: ramp(f, m(k), m(k) + 8)}}>☐ {t}</div>
            ))}
          </div>
        </AbsoluteFill>
      )}
      {f >= D1 && f < J7 && <Chip x={540} y={240} text={f < D3 ? `ДЕНЬ ${day}: САЛАТЫ` : 'ДЕНЬ… КАКОЙ?'} kind={f < D3 ? 'yellow' : 'white'} t={ramp(f, [D1, D2, D3][day - 1], [D1, D2, D3][day - 1] + 8)} tilt={-3} size={54} />}
      {f >= J7 && f < EV && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 140}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 54, color: '#ffd23a', marginBottom: 18}}>7 ЯНВАРЯ · ИТОГИ</div>
          {[['💪 спортзал', '0', S1], ['🇬🇧 английский', '0', S2], ['📺 сериал', `${Math.round(48 * easeOut(ramp(f, S3, S3 + 30)))} серий`, S3]].map(([t, v, a]) => (
            <div key={t as string} style={{width: 760, display: 'flex', justifyContent: 'space-between', padding: '14px 30px', margin: 8, borderRadius: 18, background: 'rgba(10,12,20,0.85)', opacity: ramp(f, a as number, (a as number) + 8)}}>
              <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: '#fff'}}>{t}</span>
              <span style={{fontFamily: MONO, fontWeight: 800, fontSize: 48, color: v === '0' ? '#ff4f6a' : '#3ac87a'}}>{v}</span>
            </div>
          ))}
        </AbsoluteFill>
      )}
      {f >= EV && f < WO && <Chip x={540} y={240} text={f < BU ? '10 ЯНВАРЯ, ВЕЧЕР' : 'БЫЛ ЗАНЯТ ОТДЫХОМ'} kind={f < BU ? 'white' : 'red'} t={ramp(f, f < BU ? EV : BU, (f < BU ? EV : BU) + 8)} tilt={-2} size={50} />}
      {f >= WO && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 74, color: C.white, textAlign: 'center', opacity: ramp(f - WO, 0, 10)}}>11 ЯНВАРЯ —<br /><span style={{color: '#ff4f6a'}}>НА РАБОТУ</span></div>
          {f >= SU && <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 0, 8)}}>+ ПОДПИСАТЬСЯ</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
