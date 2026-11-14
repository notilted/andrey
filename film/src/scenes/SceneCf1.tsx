import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Toon, ToonLook} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineCf1';
import {easeOut, ramp, rand} from '../util';
import {HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «Чужой телефон», часть 1. */

const DRIVER: ToonLook = {skin: '#d8a888', skinD: '#c09070', hair: '#1a1410', top: '#2a2a2e', topD: '#1e1e22', legs: '#1e1e22', legsD: '#16161a', shoes: '#0a0a10', mustache: true, hat: '#2a2a2e', scale: 1.05};

const Taxi: React.FC<{f: number; turn: number; dim: number}> = ({f, turn, dim}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#05060a" />
    <g transform={`translate(${-turn * 120} 0)`}>
      {Array.from({length: 10}).map((_, i) => { const x = ((i * 260 - f * (6 + turn * 6)) % 2600 + 2600) % 2600 - 600; return <g key={i}><rect x={x} y={300} width={120} height={360} fill="#141a24" />{[0, 1, 2, 3].map((k) => <rect key={k} x={x + 20 + (k % 2) * 50} y={330 + Math.floor(k / 2) * 90} width={30} height={40} fill={rand(i * 7 + k) > 0.5 ? '#ffd23a' : '#0a0e16'} opacity={0.7} />)}</g>; })}
      {Array.from({length: 6}).map((_, i) => { const x = ((i * 380 - f * 14) % 2280 + 2280) % 2280 - 600; return <circle key={'l' + i} cx={x} cy={260} r={16} fill="#ffb03a" opacity={0.6} />; })}
    </g>
    <rect x={-200} y={660} width={1480} height={1400} fill="#14161c" />
    <rect x={60} y={200} width={960} height={480} rx={30} fill="none" stroke="#14161c" strokeWidth={40} />
    <rect x={640} y={140} width={260} height={70} rx={14} fill="#0a0b10" stroke="#2a2e38" strokeWidth={5} />
    <Toon id="dr" x={780} y={1150} s={1.0} f={f} look={DRIVER} facing={-1} pose={{eyes: f > 0 ? 'half' : 'open', mouth: 'line', armL: [40, -60], armR: [40, -60], brow: -0.4}} />
    <rect x={560} y={680} width={60} height={600} fill="#1e2028" />
    <Toon id="mk" x={330} y={1260} s={0.95} f={f} look={HERO} facing={1} pose={{sit: 1, eyes: 'wide', mouth: 'line', armR: [120, -110], brow: 0.8}} />
    <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={dim} />
  </g>
);

const Phone: React.FC<{f: number; children: React.ReactNode; ring?: boolean}> = ({f, children, ring}) => (
  <div style={{position: 'absolute', left: 240, top: 260, width: 600, height: 1000, borderRadius: 60, background: '#0a0b10', border: '10px solid #2a2e38', padding: 30, transform: ring ? `rotate(${Math.sin(f * 1.7) * 3}deg)` : 'none', display: 'flex', flexDirection: 'column', gap: 20}}>{children}</div>
);

export const SceneCf1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const TA = m('taxi'), RI = m('ring'), DR = m('driver'), PI = m('pick'), SI = m('silence'), NA = m('name'), CU = m('cut'), MS = m('msg');
  const GA = m('gal'), P1 = m('p1'), P2 = m('p2'), TO = m('today'), MI = m('mirror'), TU = m('turn'), NX = m('next'), SU = m('sub');
  const phoneUp = (f >= RI && f < DR) || (f >= PI && f < MI);
  const turn = f >= TU ? easeOut(ramp(f, TU, TU + 40)) : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{f < NX ? <Taxi f={f} turn={turn} dim={phoneUp ? 0.6 : 0} /> : <rect x={-200} y={-200} width={1480} height={2400} fill="#08060c" />}</SVG>
      {f < RI && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 170, gap: 18}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.white, textAlign: 'center', lineHeight: 1.02, textShadow: '0 6px 0 #000'}}>ЧУЖОЙ<br /><span style={{color: '#ff3a4a'}}>ТЕЛЕФОН</span></div>
          <div style={{padding: '10px 28px', borderRadius: 16, background: '#ff3a4a', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff'}}>ЧАСТЬ 1</div>
        </AbsoluteFill>
      )}
      {f >= RI && f < DR && (
        <Phone f={f} ring>
          <div style={{marginTop: 200, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 48, color: '#fff'}}>НЕИЗВЕСТНЫЙ</div>
          <div style={{textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 40, color: C.grey}}>входящий вызов…</div>
          <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-around', marginBottom: 60}}><div style={{width: 130, height: 130, borderRadius: 65, background: '#ff3a4a'}} /><div style={{width: 130, height: 130, borderRadius: 65, background: '#3ac87a', transform: `scale(${1 + 0.08 * Math.sin(f / 3)})`}} /></div>
        </Phone>
      )}
      {f >= DR && f < PI && <Chip x={540} y={240} text="«ПАССАЖИР ЗАБЫЛ»" kind="white" t={ramp(f, DR, DR + 8)} tilt={-2} size={46} />}
      {f >= PI && f < GA && (
        <Phone f={f}>
          {f < CU ? (
            <>
              <div style={{marginTop: 180, textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 60, color: '#3ac87a'}}>00:{String(Math.min(59, Math.floor((f - PI) / 30))).padStart(2, '0')}</div>
              <div style={{textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 42, color: '#fff', opacity: f >= SI && f < NA ? 0.4 : 1}}>{f < NA ? '…' : '«МАРК.»'}</div>
            </>
          ) : (
            <>
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.grey}}>Звонок завершён</div>
              {f >= MS && <div style={{alignSelf: 'flex-start', maxWidth: 480, padding: '20px 24px', borderRadius: 24, background: '#2a3040', fontFamily: FONT, fontWeight: 800, fontSize: 38, color: '#fff', lineHeight: 1.2, opacity: ramp(f, MS, MS + 8)}}>Не выключай. Через 20 минут он позвонит снова.</div>}
            </>
          )}
        </Phone>
      )}
      {f >= GA && f < MI && (
        <Phone f={f}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 34, color: '#fff'}}>Галерея</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{height: 250, borderRadius: 14, background: i === 0 ? '#3a3e48' : i === 1 ? '#2a2e38' : '#1a1d24', opacity: ramp(f, [GA, P1, P2, P2 + 6][i], [GA, P1, P2, P2 + 6][i] + 6), position: 'relative', overflow: 'hidden'}}>
                {i === 0 && <div style={{position: 'absolute', left: 30, top: 60, width: 160, height: 190, background: '#4a3e34'}}><div style={{margin: '60px auto 0', width: 60, height: 130, background: '#1a120e'}} /></div>}
                {i === 1 && <div style={{position: 'absolute', left: 50, top: 50, width: 150, height: 150, background: '#ffd88a', border: '10px solid #4a4e58'}} />}
              </div>
            ))}
          </div>
          {f >= TO && <div style={{padding: '12px 18px', borderRadius: 14, background: '#ff3a4a', fontFamily: FONT, fontWeight: 900, fontSize: 36, color: '#fff', textAlign: 'center', opacity: ramp(f, TO, TO + 6)}}>СЕГОДНЯ, 18:42</div>}
        </Phone>
      )}
      {f >= MI && f < NX && <Chip x={770} y={240} text={f < TU ? 'ВЗГЛЯД В ЗЕРКАЛО' : 'НЕ ТУДА'} kind={f < TU ? 'white' : 'red'} t={ramp(f, f < TU ? MI : TU, (f < TU ? MI : TU) + 8)} tilt={-2} size={48} />}
      {f >= NX && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.white, textAlign: 'center', lineHeight: 1.02, opacity: ramp(f - NX, 0, 10)}}>ЧУЖОЙ<br />ТЕЛЕФОН</div>
          <div style={{padding: '12px 30px', borderRadius: 20, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#14171d', opacity: ramp(f - NX, 8, 18)}}>ЧАСТЬ 2 — ЗАВТРА В 19:00</div>
          {f >= SU && <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 0, 8)}}>+ ПОДПИСАТЬСЯ</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
