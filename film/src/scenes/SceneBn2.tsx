import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Toon, ToonLook} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineBn2';
import {easeOut, ramp} from '../util';
import {HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «Бабушкины 2 миллиона», сезон 2, часть 2 — доказательства и пропавшая тетрадь. */

const LAWYER: ToonLook = {skin: '#f0c8a8', skinD: '#d8b090', hair: '#3a2a1a', top: '#2a3a5a', topD: '#1e2c48', legs: '#1e222c', legsD: '#16191f', shoes: '#0a0a10', longHair: true, scale: 0.95};

const Shop: React.FC<{f: number; doorOpen: number; night?: boolean}> = ({f, doorOpen, night}) => (
  <g transform="translate(540 1200)">
    <rect x={-320} y={-560} width={640} height={560} fill={night ? '#1e1814' : '#3a2a24'} />
    <rect x={-340} y={-660} width={680} height={110} rx={14} fill={night ? '#3a1a14' : '#c8503a'} />
    <text x={0} y={-588} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={night ? '#6a4a3a' : '#ffe8c0'}>БАБУШКИНЫ</text>
    <rect x={-270} y={-500} width={300} height={250} fill={night ? '#0a0a0e' : '#ffd88a'} />
    <rect x={80} y={-330} width={180} height={330} fill="#140e0a" />
    <rect x={80} y={-330} width={180 * (1 - doorOpen * 0.75)} height={330} fill="#4a2e1e" />
    {doorOpen > 0 && <path d={`M${80 + 180 * (1 - doorOpen * 0.75)} -330 L260 -330 L260 0 L${80 + 180 * (1 - doorOpen * 0.75)} 0 Z`} fill="#ffd88a" opacity={0.08 + 0.04 * Math.sin(f / 4)} />}
  </g>
);

export const SceneBn2: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const LAW = m('law'), FI = m('first'), PA = m('paths'), P1 = m('p1'), P2 = m('p2'), EV = m('ev'), RE = m('rem'), VI = m('vid'), SI = m('sign'), DA = m('date');
  const RL = m('relief'), NI = m('night'), DO = m('door'), GO = m('gone'), BO = m('book'), NX = m('next'), SU = m('sub');
  let scene: React.ReactNode = null;
  if (f < EV) {
    scene = (
      <g>
        <Glow f={f} c1="#1e2a3a" c2="#05070c" cy={700} id="gl" />
        <rect x={-200} y={1150} width={1480} height={900} fill="#14161c" />
        <rect x={120} y={1000} width={840} height={30} fill="#5a3a24" /><rect x={160} y={1030} width={30} height={170} fill="#4a2e1c" /><rect x={890} y={1030} width={30} height={170} fill="#4a2e1c" />
        <Toon id="lw" x={760} y={1190} s={0.95} f={f} look={LAWYER} facing={-1} pose={{eyes: 'open', mouth: 'open', talk: f < PA + 120 ? 0.4 + 0.4 * Math.sin(f / 3) : 0, armR: [70, -60]}} />
        <Toon id="mk" x={320} y={1190} s={0.95} f={f} look={HERO} facing={1} pose={{eyes: 'wide', mouth: 'line', brow: 0.7, sweat: f >= FI}} />
      </g>
    );
  } else if (f < RE) {
    scene = <g><Glow f={f} c1="#2a2a1a" c2="#08080a" cy={700} id="ge" /></g>;
  } else if (f < RL) {
    scene = (
      <g>
        <Glow f={f} c1="#2a1e3a" c2="#08060c" cy={700} id="gv" />
        <g transform="translate(540 820)">
          <rect x={-290} y={-520} width={580} height={1040} rx={50} fill="#0a0b10" stroke="#2a2e38" strokeWidth={10} />
          <g opacity={ramp(f, VI - 40, VI)}><g transform="translate(0 250) scale(0.72) translate(-540 -1200)"><Shop f={f} doorOpen={0} /></g></g>
          {f >= SI && <rect x={-260} y={-240} width={520} height={105} rx={10} fill="none" stroke="#ffd23a" strokeWidth={8} opacity={(Math.sin(f / 4) + 1) / 2} />}
        </g>
      </g>
    );
  } else if (f < GO) {
    scene = (
      <g>
        <rect x={-200} y={-200} width={1480} height={2400} fill={f < NI ? '#14121c' : '#05060a'} />
        <rect x={-200} y={1200} width={1480} height={900} fill="#0a0a0e" />
        <Shop f={f} doorOpen={f >= DO ? easeOut(ramp(f, DO, DO + 30)) : 0} night={f >= NI} />
        <Toon id="mk3" x={170} y={1290} s={0.8} f={f} look={HERO} facing={1} pose={{eyes: f >= DO ? 'wide' : 'half', mouth: f >= DO ? 'fear' : 'smile', brow: f >= DO ? 1 : 0}} />
      </g>
    );
  } else if (f < NX) {
    scene = (
      <g>
        <rect x={-200} y={-200} width={1480} height={2400} fill="#06050a" />
        <circle cx={540} cy={820} r={360} fill="#ffd88a" opacity={0.07} />
        <rect x={160} y={900} width={760} height={30} fill="#3a2a1e" />
        <rect x={380} y={830} width={320} height={70} rx={6} fill="none" stroke="#8a7a6a" strokeWidth={5} strokeDasharray="20 14" />
        <g transform="translate(250 870)"><rect x={-70} y={-50} width={140} height={50} rx={6} fill="#2a2a2a" /><rect x={-60} y={-44} width={120} height={20} fill="#7ac88a" /></g>
      </g>
    );
  } else scene = <Glow f={f} c1="#3a2a1a" c2="#0a0806" cy={700} id="gnx" />;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < PA && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 170, gap: 18}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.white, textAlign: 'center', lineHeight: 1.02, textShadow: '0 6px 0 #000'}}>БАБУШКИНЫ<br /><span style={{color: '#ffd23a'}}>2 МИЛЛИОНА</span></div>
          <div style={{padding: '10px 28px', borderRadius: 16, background: '#c8503a', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff'}}>СЕЗОН 2 · ЧАСТЬ 2</div>
          {f >= FI && <div style={{marginTop: 16, padding: '12px 26px', borderRadius: 16, background: 'rgba(10,12,20,0.85)', fontFamily: FONT, fontWeight: 900, fontSize: 40, maxWidth: 880, textAlign: 'center', color: '#fff', opacity: ramp(f, FI, FI + 8)}}>ЗНАК — У ТОГО, КТО <span style={{color: '#ff4f6a'}}>ПЕРВЫМ</span> ЗАРЕГИСТРИРОВАЛ</div>}
        </AbsoluteFill>
      )}
      {f >= PA && f < EV && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 170, gap: 22}}>
          {[['1', 'СМЕНИТЬ НАЗВАНИЕ И ВЫВЕСКИ', P1, '#5a5e6a'], ['2', 'БОРОТЬСЯ: ДОКАЗАТЬ, ЧТО ИМЯ БЫЛО РАНЬШЕ', P2, '#3ac87a']].map(([n, t, a, c]) => (
            <div key={n as string} style={{width: 900, display: 'flex', gap: 20, alignItems: 'center', padding: '20px 26px', borderRadius: 20, background: 'rgba(10,12,20,0.9)', border: `4px solid ${c}`, opacity: ramp(f, a as number, (a as number) + 8)}}>
              <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 60, color: c as string}}>{n}</div>
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff'}}>{t}</div>
            </div>
          ))}
        </AbsoluteFill>
      )}
      {f >= EV && f < RE && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 260, gap: 26}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 60, color: '#ffd23a'}}>НУЖНЫ ДОКАЗАТЕЛЬСТВА</div>
          {[['🧾 ЧЕКИ', 'e1'], ['📄 ДОГОВОРЫ', 'e2'], ['📸 ФОТО ВЫВЕСКИ — С ДАТАМИ', 'e3']].map(([t, k]) => <div key={k} style={{width: 820, padding: '18px 28px', borderRadius: 18, background: 'rgba(255,255,255,0.08)', fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#fff', opacity: ramp(f, m(k), m(k) + 8)}}>{t}</div>)}
        </AbsoluteFill>
      )}
      {f >= RE && f < RL && (
        <AbsoluteFill>
          <div style={{position: 'absolute', top: 1180, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 52, color: '#fff', opacity: ramp(f, VI, VI + 8)}}>👁 1 000 000</div>
          {f >= DA && <div style={{position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center'}}><span style={{padding: '12px 30px', borderRadius: 16, background: '#3ac87a', fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#0a0e14', opacity: ramp(f, DA, DA + 8)}}>ОПУБЛИКОВАНО ГОД НАЗАД ✓</span></div>}
        </AbsoluteFill>
      )}
      {f >= RL && f < NI && <Chip x={540} y={260} text="ВПЕРВЫЕ ЗА НЕДЕЛЮ — ВЫДОХ" kind="white" t={ramp(f, RL, RL + 8)} tilt={-2} size={44} />}
      {f >= DO && f < GO && <Chip x={540} y={260} text="ДВЕРЬ ПРИОТКРЫТА" kind="red" t={ramp(f, DO + 20, DO + 28)} tilt={-2} size={54} />}
      {f >= GO && f < NX && <Chip x={540} y={300} text={f < BO ? 'ДЕНЬГИ НА МЕСТЕ' : 'ПРОПАЛА ТЕТРАДЬ'} kind={f < BO ? 'white' : 'red'} t={ramp(f, f < BO ? GO : BO, (f < BO ? GO : BO) + 8)} tilt={-2} size={56} />}
      {f >= NX && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.white, textAlign: 'center', lineHeight: 1.02, opacity: ramp(f - NX, 0, 10)}}>БАБУШКИНЫ<br />2 МИЛЛИОНА</div>
          <div style={{padding: '12px 30px', borderRadius: 20, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#14171d', opacity: ramp(f - NX, 8, 18)}}>ФИНАЛ — ЗАВТРА В 19:00</div>
          {f >= SU && <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 0, 8)}}>+ ПОДПИСАТЬСЯ</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
