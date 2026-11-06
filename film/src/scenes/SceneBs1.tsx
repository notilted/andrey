import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Shake, Toon, ToonLook} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineBs1';
import {easeOut, ramp, rand} from '../util';
import {HERO} from './SceneCr2';
import {ease01, SVG} from './twkit';

/** «Без сигнала», часть 1 — магнитная буря как в 1859 году. */

const OPER: ToonLook = {skin: '#f0c8a8', skinD: '#dcb090', hair: '#5a3a24', top: '#6a4a3a', topD: '#563a2c', legs: '#3a2e28', legsD: '#2e2420', shoes: '#1a1410', mustache: true, scale: 1};

const zoom = (f: number, a: number, b: number, s: number, cx: number, cy: number) => {
  const k = ease01(f, a, b);
  return `translate(${540 + (540 - cx) * k * (s - 1)} ${900 + (900 - cy) * k * (s - 1)}) scale(${1 + k * (s - 1)}) translate(-540 -900)`;
};

const Sun: React.FC<{f: number; x: number; y: number; flare: number}> = ({f, x, y, flare}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={260} fill="#ffb03a" opacity={0.15} />
    <circle r={170} fill="#ffb03a" />
    <circle r={170} fill="#ff7a1a" opacity={0.4 + 0.2 * Math.sin(f / 6)} />
    {flare > 0 && <path d={`M120 -60 Q${300 + flare * 300} ${-200 - flare * 100} ${200 + flare * 600} ${60 + flare * 300}`} stroke="#ffdd6a" strokeWidth={50 * flare} fill="none" strokeLinecap="round" opacity={0.85} />}
  </g>
);

const Telegraph: React.FC<{f: number; spark: number}> = ({f, spark}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#3a2a1e" />
    <rect x={-200} y={-200} width={1480} height={2400} fill="#c8a070" opacity={0.25} />
    <rect x={120} y={380} width={840} height={400} fill="#5a4030" />
    {[0, 1, 2].map((i) => <rect key={i} x={160 + i * 270} y={420} width={220} height={320} fill="#e8d0a0" opacity={0.5} />)}
    <path d="M-200 300 L1280 260" stroke="#2a1a10" strokeWidth={6} />
    {spark > 0 && Array.from({length: 6}).map((_, i) => {
      const x = 100 + i * 170, y = 300 - i * 6;
      const on = rand(Math.floor(f / 2) + i * 7) > 0.4;
      return on ? <path key={i} d={`M${x} ${y} l20 30 l-14 6 l24 34`} stroke="#ffe46a" strokeWidth={6} fill="none" /> : null;
    })}
    <rect x={160} y={1160} width={760} height={40} fill="#6a4a2a" />
    <g transform="translate(560 1140)"><rect x={-60} y={-20} width={120} height={20} fill="#2a2a2a" /><rect x={-10} y={-50} width={60} height={14} fill="#c8a03a" /></g>
    {spark > 0 && <Shake x={400} y={760} w={180} f={f} />}
    <Toon id="op" x={400} y={1400} s={1.05} f={f} look={OPER} pose={{sit: 1, eyes: spark > 0 ? 'wide' : 'half', mouth: spark > 0 ? 'open' : 'line', shake: spark > 0, brow: spark > 0 ? 1 : 0, armR: [80, -40], sweat: spark > 0}} />
    <rect x={-200} y={-200} width={1480} height={2400} fill="#704a20" opacity={0.18} />
  </g>
);

const Aurora: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#060a1a" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M-200 ${400 + i * 120} Q${200 + Math.sin(f / 20 + i) * 120} ${200 + i * 80} 540 ${420 + i * 100} T1280 ${360 + i * 110} L1280 ${700 + i * 100} Q540 ${600 + i * 90} -200 ${760 + i * 100} Z`} fill={['#2affa0', '#7a6aff', '#ff6ab8'][i]} opacity={0.22 + 0.08 * Math.sin(f / 10 + i)} />
    ))}
    {Array.from({length: 40}).map((_, i) => <circle key={i} cx={rand(i) * 1080} cy={rand(i + 9) * 700} r={2 + rand(i + 3) * 2} fill="#fff" opacity={0.6} />)}
    <rect x={-200} y={1150} width={1480} height={900} fill="#0a1a2a" />
    <path d="M-200 1150 Q540 1100 1280 1150" fill="#0e2a3a" />
    {[160, 900].map((x, k) => (
      <g key={x} transform={`translate(${x} 1160)`}>
        <path d="M-8 0 Q-4 -220 8 -400 L16 -400 Q10 -220 10 0 Z" fill="#0a0e14" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M12 -400 q${-130 + i * 65} ${-40 + Math.abs(i - 2) * 30} ${-180 + i * 90} ${50 + Math.abs(i - 2) * 30}`} stroke="#0a0e14" strokeWidth={24} fill="none" strokeLinecap="round" transform={`rotate(${Math.sin(f / 30 + i + k) * 3} 12 -400)`} />)}
      </g>
    ))}
  </g>
);

const Bedroom: React.FC<{f: number; lightOff: boolean}> = ({f, lightOff}) => (
  <g>
    <Glow f={f} c1={lightOff ? '#1a1e2e' : '#3a4a6a'} c2="#05060c" cy={600} id="gbed" />
    <rect x={640} y={420} width={300} height={360} fill="#0e1424" stroke="#2a2420" strokeWidth={18} />
    {!lightOff && <circle cx={540} cy={330} r={30} fill="#fff2c8" />}
    <rect x={-200} y={1200} width={1480} height={900} fill="#141820" />
    <rect x={80} y={1050} width={760} height={160} rx={30} fill="#3a4a6a" />
    <rect x={80} y={1000} width={200} height={90} rx={40} fill="#e8e4da" />
    <Toon id="hb" x={420} y={1130} s={1.0} f={f} look={HERO} pose={{sit: 1, eyes: 'wide', mouth: 'line', look: 0.6, armR: [120, -80], brow: 0.6}} />
    <g transform="translate(630 760) rotate(10)"><rect x={-40} y={-70} width={80} height={140} rx={12} fill="#14171d" /><rect x={-32} y={-60} width={64} height={120} rx={8} fill="#1e2a3a" opacity={0.4 + 0.3 * Math.sin(f / 4)} /></g>
  </g>
);

const City: React.FC<{f: number; off: number}> = ({f, off}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#06080e" />
    {Array.from({length: 9}).map((_, i) => {
      const x = -120 + i * 150, h = 500 + (i % 3) * 180;
      return (
        <g key={i}>
          <rect x={x} y={1250 - h} width={140} height={h} fill="#141a24" />
          {Array.from({length: Math.floor(h / 70) * 2}).map((__, k) => {
            const lit = rand(i * 31 + k) > off;
            return <rect key={k} x={x + 20 + (k % 2) * 60} y={1250 - h + 30 + Math.floor(k / 2) * 70} width={40} height={40} fill={lit ? C.warm : '#0a0e16'} opacity={lit ? 0.85 : 1} />;
          })}
        </g>
      );
    })}
    <rect x={-200} y={1250} width={1480} height={900} fill="#0a0c12" />
  </g>
);

export const SceneBs1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const Y = m('y1859'), RE = m('real'), CM = m('cme'), TE = m('tele'), SP = m('spark'), AU = m('aurora'), NO = m('now'), WA = m('wake'), NN = m('nonet'), NL = m('nolight');
  const QU = m('quebec'), PE = m('people'), OU = m('ours'), SI = m('silence'), NX = m('next'), SU = m('sub');
  let scene: React.ReactNode = null;
  if (f < RE) {
    scene = (
      <g>
        <Glow f={f} c1="#5a1a10" c2="#0a0604" cy={760} id="ghook" />
        <Sun f={f} x={540} y={1050} flare={f >= Y ? ramp(f, Y, Y + 30) : 0} />
      </g>
    );
  } else if (f < TE) {
    scene = (
      <g>
        <rect x={-200} y={-200} width={1480} height={2400} fill="#05060c" />
        {Array.from({length: 50}).map((_, i) => <circle key={i} cx={rand(i) * 1080} cy={rand(i + 5) * 1900} r={2} fill="#fff" opacity={0.5} />)}
        <Sun f={f} x={150} y={700} flare={f >= CM ? ramp(f, CM, CM + 40) : 0} />
        <g transform="translate(880 1150)"><circle r={110} fill="#2a6aaa" /><path d="M-60 -60 Q0 -20 40 -80 Q80 0 20 40 Q-40 80 -80 20 Z" fill="#3a9a5a" /><circle r={140} fill="none" stroke="#7ac8ff" strokeWidth={6} opacity={0.5} /></g>
      </g>
    );
  } else if (f < AU) {
    scene = <g transform={f >= SP ? zoom(f, SP, SP + 20, 1.25, 400, 900) : ''}><Telegraph f={f} spark={f >= SP ? 1 : 0.5} /></g>;
  } else if (f < NO) {
    scene = <Aurora f={f} />;
  } else if (f < WA) {
    scene = <Glow f={f} c1="#1a2a4a" c2="#05060c" cy={800} id="gnow" />;
  } else if (f < QU) {
    scene = <Bedroom f={f} lightOff={f >= NL} />;
  } else if (f < OU) {
    scene = <Glow f={f} c1="#1a2a4a" c2="#05060c" cy={700} id="gqu" />;
  } else if (f < NX) {
    scene = <City f={f} off={f < SI ? ramp(f, OU, SI) * 1.05 : 1.05} />;
  } else {
    scene = <Glow f={f} c1="#3a2a5a" c2="#0a0810" cy={700} id="gnx" />;
  }
  const kp = Math.min(9, interpolate(f, [0, 40], [2, 9], {extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < RE && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 200}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 92, color: C.white, textAlign: 'center', lineHeight: 1.02, textShadow: '0 6px 0 #000'}}>МАГНИТНАЯ БУРЯ<br /><span style={{color: '#ffb03a'}}>КАК В 1859-м</span></div>
          <div style={{marginTop: 40, width: 760, padding: '20px 30px', borderRadius: 20, background: 'rgba(5,7,12,0.7)', border: '2px solid #3a2a20'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.grey}}><span>ИНДЕКС Kp</span><span style={{fontFamily: MONO, color: kp > 7 ? C.redHot : '#ffd23a'}}>{kp.toFixed(0)} / 9</span></div>
            <div style={{marginTop: 12, height: 26, borderRadius: 13, background: '#1a1d24'}}><div style={{width: `${(kp / 9) * 100}%`, height: '100%', borderRadius: 13, background: `linear-gradient(90deg,#3ac87a,#ffd23a,${C.redHot})`}} /></div>
          </div>
        </AbsoluteFill>
      )}
      {f >= RE && f < CM && <Chip x={540} y={330} text="1859 · ЭТО БЫЛО НА САМОМ ДЕЛЕ" kind="white" t={ramp(f, RE, RE + 10)} tilt={-2} size={36} />}
      {f >= TE && f < AU && <Chip x={540} y={330} text="ТЕЛЕГРАФ ИСКРИТ" kind="yellow" t={ramp(f, TE, TE + 10)} tilt={-2} size={42} />}
      {f >= AU && f < NO && <Chip x={540} y={330} text="СИЯНИЕ У КАРИБСКИХ ОСТРОВОВ" kind="white" t={ramp(f, AU, AU + 10)} tilt={2} size={36} />}
      {f >= NO && f < WA && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40, paddingBottom: 300}}>
          {[['1859', 'ИНТЕРНЕТА НЕТ', C.grey, 0], ['2026', 'ВСЁ НА ИНТЕРНЕТЕ', C.redHot, 14]].map(([y, t, c, d]) => (
            <div key={y as string} style={{display: 'flex', gap: 30, alignItems: 'baseline', opacity: ramp(f - NO, d as number, (d as number) + 10)}}>
              <span style={{fontFamily: MONO, fontWeight: 800, fontSize: 96, color: c as string}}>{y}</span>
              <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 48, color: C.white}}>{t}</span>
            </div>
          ))}
        </AbsoluteFill>
      )}
      {f >= NN && f < QU && <Chip x={540} y={330} text={f < NL ? 'НЕТ СЕТИ · НЕТ WI-FI' : 'НЕТ СВЕТА'} kind="red" t={ramp(f, NN, NN + 10)} tilt={-2} size={42} />}
      {f >= QU && f < OU && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 260, gap: 22}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: '#ffd23a', opacity: ramp(f - QU, 0, 10)}}>1989 · КВЕБЕК, КАНАДА</div>
          {[['90 секунд', 'до обесточивания', 8], ['6 000 000', 'человек без света', PE - QU], ['9 часов', 'темноты', PE - QU + 30]].map(([v, l, d]) => (
            <div key={v as string} style={{width: 820, padding: '22px 34px', borderRadius: 18, background: 'rgba(22,26,30,0.92)', borderLeft: `8px solid ${C.redHot}`, opacity: easeOut(ramp(f - QU, d as number, (d as number) + 10))}}>
              <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 64, color: C.white}}>{v}</div>
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.grey}}>{l}</div>
            </div>
          ))}
        </AbsoluteFill>
      )}
      {f >= SI && f < NX && <Chip x={540} y={330} text="ТИШИНА" kind="white" t={ramp(f, SI + 20, SI + 30)} tilt={0} size={52} />}
      {f >= NX && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 100, color: C.white, letterSpacing: 2, opacity: ramp(f - NX, 0, 10)}}>БЕЗ СИГНАЛА</div>
          <div style={{padding: '12px 30px', borderRadius: 20, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#14171d', opacity: ramp(f - NX, 8, 18)}}>ЧАСТЬ 2 — ЗАВТРА В 19:00</div>
          {f >= SU && <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 0, 8)}}>+ ПОДПИСАТЬСЯ</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
