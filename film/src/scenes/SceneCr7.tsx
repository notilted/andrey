import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Toon, ToonLook} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineCr7';
import {easeOut, ramp} from '../util';
import {Capital, Choice, Ladder} from './SceneCr1';
import {DON, GUARD, HERO} from './SceneCr2';
import {ease01, SVG} from './twkit';

/** «Из низов», серия 7 «Пятница» — ветка «схватить Чино». */

const CHINO: ToonLook = {skin: '#c89070', skinD: '#b07a5a', hair: '#14110e', top: '#d84a3a', topD: '#b83a2c', legs: '#2a3446', legsD: '#222a3a', shoes: '#e8e4da', scale: 0.92};
const LUCIA: ToonLook = {skin: '#f0c8a8', skinD: '#dcb090', hair: '#3a1a14', top: '#c8304a', topD: '#a8243a', legs: '#2a2a3a', legsD: '#22222e', shoes: '#14110e', longHair: true, scale: 0.9};
const MENDOSA: ToonLook = {skin: '#c89070', skinD: '#b07a5a', hair: '#14110e', top: '#2a6a5a', topD: '#1e544a', legs: '#1e2a2a', legsD: '#162020', shoes: '#0a0a0a', shades: true, chain: true, mustache: true, scale: 1.1};
const LADDER = ['ЧИСТИЛЬЩИК', 'ПОСЫЛЬНЫЙ', 'КУРЬЕР', 'ВОДИТЕЛЬ', 'ПРАВАЯ РУКА', 'НАСЛЕДНИК', 'БОСС'];

const zoom = (f: number, a: number, b: number, s: number, cx: number, cy: number) => {
  const k = ease01(f, a, b);
  return `translate(${540 + (540 - cx) * k * (s - 1)} ${900 + (900 - cy) * k * (s - 1)}) scale(${1 + k * (s - 1)}) translate(-540 -900)`;
};

/** Ночной порт в тумане. */
const FogPort: React.FC<{f: number; fog?: number}> = ({f, fog = 1}) => (
  <g>
    <Glow f={f} c1="#2a3a4a" c2="#06080c" cy={500} id="gfog" />
    <path d="M820 1180 L820 380 L1120 380 L1120 410 L850 410 L850 1180 Z" fill="#141a22" />
    <rect x={980} y={410} width={8} height={260} fill="#141a22" />
    <rect x={-200} y={1000} width={1480} height={200} fill="#0e1824" />
    {[['#5a2a24', -60, 980], ['#24405a', 200, 1020], ['#2a4a34', 460, 990], ['#5a4a24', 700, 1030]].map(([c, x, y], i) => (
      <g key={i}><rect x={x as number} y={y as number} width={240} height={170} fill={c as string} />{[0, 1, 2, 3, 4].map((k) => <rect key={k} x={(x as number) + 16 + k * 46} y={(y as number) + 12} width={8} height={146} fill="#000" opacity={0.25} />)}</g>
    ))}
    <rect x={-200} y={1180} width={1480} height={1000} fill="#1a1e24" />
    <circle cx={180} cy={620} r={16} fill="#fff2c8" /><circle cx={180} cy={620} r={160} fill="#fff2c8" opacity={0.06} />
    {[0, 1, 2, 3].map((i) => {
      const x = ((f * (0.8 + i * 0.3) + i * 400) % 1800) - 600;
      return <ellipse key={i} cx={x} cy={1000 + i * 90} rx={600} ry={90} fill="#c8d4e0" opacity={0.1 * fog} />;
    })}
  </g>
);

/** Фото с подлогом: вспышка, Лусия рядом с Мендосой. */
const Flashback: React.FC<{f: number}> = ({f}) => (
  <g>
    <Glow f={f} c1="#5a2a3a" c2="#0a0608" cy={760} id="gfb" />
    <g transform="translate(540 880) rotate(3)">
      <rect x={-380} y={-440} width={760} height={840} fill="#f2ede0" />
      <defs><clipPath id="fb7"><rect x={-340} y={-400} width={680} height={660} /></clipPath></defs>
      <g clipPath="url(#fb7)">
        <rect x={-340} y={-400} width={680} height={660} fill="#3a2a3a" />
        <Toon id="fl7" x={-150} y={420} s={1.0} f={0} look={LUCIA} pose={{eyes: 'half', mouth: 'smirk', armR: [80, -40]}} />
        <Toon id="fm7" x={170} y={420} s={1.0} facing={-1} f={0} look={MENDOSA} pose={{eyes: 'half', mouth: 'grin', armL: [80, -40]}} />
        <rect x={-30} y={60} width={60} height={40} fill="#d8e4e8" />
      </g>
      <text x={0} y={350} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#5a4a3a">ВЕРСИЯ ЧИНО</text>
    </g>
  </g>
);

export const SceneCr7: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const WI = m('window'), TR = m('trust'), PO = m('port'), HI = m('hide'), CH = m('chino'), BG = m('bag'), R8 = m('rule8'), LK = m('look');
  const GU = m('guards'), SA = m('says'), LU = m('lucia'), PH = m('photo'), DO = m('don'), AS = m('ask'), CX = m('choice');
  let scene: React.ReactNode = null;
  if (f < WI) {
    scene = <Glow f={f} c1="#2a3a6a" c2="#0a0c14" cy={700} id="gres7" />;
  } else if (f < PO) {
    scene = (
      <g>
        <Glow f={f} c1="#2a3a6a" c2="#05060c" cy={500} id="gwin7" />
        <rect x={-200} y={1240} width={1480} height={900} fill="#1a1a24" />
        <rect x={780} y={560} width={12} height={700} fill="#2a2f38" /><circle cx={786} cy={560} r={20} fill="#fff2c8" />
        <polygon points="786,560 460,1260 1110,1260" fill="#fff2c8" opacity={0.08} />
        <Toon id="h1" x={420} y={1260} s={1.0} f={f} look={HERO} pose={{eyes: 'side', look: 0.8, mouth: f < TR ? 'open' : 'line', talk: f < TR ? 0.2 + 0.2 * Math.sin(f / 2.5) : 0}} />
        <Toon id="c1" x={760} y={1260} s={1.0} f={f} facing={-1} look={CHINO} pose={{eyes: 'open', mouth: f >= TR ? 'smile' : 'line', look: -0.4}} />
      </g>
    );
  } else if (f < GU) {
    const walk = ease01(f, CH, CH + 60);
    const close = f >= R8;
    scene = (
      <g transform={close ? zoom(f, R8, R8 + 30, 1.5, 420, 950) : ''}>
        <FogPort f={f} />
        {f >= HI && f < CH + 30 && [80, 980].map((x, i) => <g key={x} opacity={0.6 * ramp(f, HI, HI + 15)}><Toon id={`gh${i}`} x={x} y={1200} s={0.8} f={f} facing={i ? -1 : 1} look={GUARD} pose={{eyes: 'half', mouth: 'line', brow: -1}} /></g>)}
        <Toon id="h2" x={380} y={1360} s={1.0} f={f} look={HERO} pose={{eyes: close ? 'wide' : 'open', mouth: close ? 'fear' : 'line', sweat: close, look: 0.8, brow: close ? 1 : 0}} />
        {f >= CH && (
          <g>
            <Toon id="c2" x={1100 - walk * 400} y={1360} s={1.0} f={f} facing={-1} look={CHINO} pose={{eyes: 'open', mouth: 'smile', step: walk < 1 ? f / 4 : undefined, armR: [70, -60]}} />
            {f >= BG && <rect x={590 - (1 - walk) * 0} y={1090} width={70} height={80} rx={10} fill="#c8a06a" transform={`translate(${(1 - walk) * 400} 0)`} />}
          </g>
        )}
      </g>
    );
  } else if (f < LU) {
    const close = f >= SA;
    scene = (
      <g transform={close ? zoom(f, SA, SA + 25, 1.5, 700, 950) : ''}>
        <FogPort f={f} />
        {[60, 220, 900, 1060].map((x, i) => {
          const g = ease01(f, GU + i * 6, GU + 40 + i * 6);
          return <g key={x} opacity={g}><Toon id={`g${i}`} x={x} y={1360} s={0.95} f={f} facing={x < 540 ? 1 : -1} look={GUARD} pose={{eyes: 'half', mouth: 'line', brow: -1, armL: [40, -40], armR: [40, -40]}} /></g>;
        })}
        <Toon id="h3" x={420} y={1360} s={1.0} f={f} look={HERO} pose={{eyes: 'wide', mouth: 'line', sweat: true, look: 0.8}} />
        <Toon id="c3" x={700} y={1360} s={1.0} f={f} facing={-1} look={CHINO} pose={{eyes: 'half', mouth: f >= SA ? 'open' : 'line', talk: f >= SA ? 0.15 + 0.15 * Math.sin(f / 3) : 0, brow: 0.4, look: -0.6}} />
      </g>
    );
  } else if (f < DO) {
    scene = <Flashback f={f} />;
  } else if (f < CX) {
    const enter = ease01(f, DO, DO + 50);
    scene = (
      <g transform={f >= AS ? zoom(f, AS, AS + 25, 1.35, 560, 950) : ''}>
        <FogPort f={f} fog={1 - enter * 0.5} />
        <g opacity={enter}><Toon id="don" x={560} y={1300} s={1.05} f={f} look={DON} pose={{eyes: 'half', mouth: f >= AS ? 'open' : 'line', talk: f >= AS ? 0.2 + 0.25 * Math.sin(f / 2.5) : 0, brow: -1, step: enter < 1 ? f / 4 : undefined}} /></g>
        <Toon id="h4" x={260} y={1380} s={1.0} f={f} look={HERO} pose={{eyes: 'wide', mouth: 'fear', sweat: true, look: 0.6, brow: 1}} />
        <Toon id="c4" x={860} y={1380} s={1.0} f={f} facing={-1} look={CHINO} pose={{eyes: 'open', mouth: 'line', look: -0.8}} />
      </g>
    );
  } else {
    scene = <Glow f={f} c1="#3a2a5a" c2="#0a0810" cy={700} id="gch7" />;
  }
  const l = f - 4;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < WI && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#ffd23a', letterSpacing: 2, opacity: ramp(l, 0, 10)}}>ИТОГИ ОПРОСА</div>
          {[['1 — СХВАТИТЬ ЧИНО', 80, '80%', '#ffd23a', 8], ['2 — ПРЕДУПРЕДИТЬ', 20, '20%', C.white, 18]].map(([lab, pct, v, col, d]) => (
            <div key={lab as string} style={{width: 860, marginTop: 30, opacity: ramp(l, d as number, (d as number) + 10)}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white}}><span>{lab}</span><span style={{fontFamily: MONO}}>{v}</span></div>
              <div style={{marginTop: 10, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.12)'}}><div style={{width: `${(pct as number) * easeOut(ramp(l, (d as number) + 6, (d as number) + 30))}%`, height: '100%', borderRadius: 22, background: col as string}} /></div>
            </div>
          ))}
          <div style={{marginTop: 40, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.grey, opacity: ramp(l, 34, 44)}}>10 голосов</div>
        </AbsoluteFill>
      )}
      {f >= WI && f < CX && <Ladder step={4} labels={LADDER} opacity={ramp(f, WI, WI + 10)} />}
      {f >= WI && f < CX && <Capital value={6700} opacity={ramp(f, WI, WI + 10)} />}
      {f >= WI && f < PO && <Chip x={540} y={640} text="«ПЯТНИЦА. ПОРТ. ПОЛНОЧЬ»" kind="white" t={ramp(f, WI + 20, WI + 30)} tilt={-2} size={38} />}
      {f >= PO && f < CH && <Chip x={540} y={330} text="ПЯТНИЦА · 00:00" kind="white" t={ramp(f, PO, PO + 10)} tilt={0} size={40} />}
      {f >= R8 && f < GU && <Chip x={540} y={640} text="ПРАВИЛО №8: НЕ СМОТРИ В ГЛАЗА" kind="red" t={ramp(f, R8, R8 + 10)} tilt={-2} size={36} />}
      {f >= SA && f < LU && <Chip x={700} y={640} text="«Я НЕ НА МЕНДОСУ РАБОТАЮ»" kind="white" t={ramp(f, SA + 30, SA + 40)} tilt={2} size={34} />}
      {f >= LU && f < DO && <Chip x={540} y={330} text="ЛУСИЯ РАБОТАЕТ НА МЕНДОСУ?" kind="red" t={ramp(f, LU + 10, LU + 20)} tilt={-2} size={38} />}
      {f >= AS && f < CX && <Chip x={560} y={640} text="«ЧТО СКАЖЕШЬ?»" kind="white" t={ramp(f, AS + 10, AS + 20)} tilt={2} size={42} />}
      {f >= CX && <Choice f={f} start={CX} a="СДАТЬ ЧИНО" b="РАССКАЗАТЬ ПРО ЛУСИЮ" />}
    </AbsoluteFill>
  );
};
