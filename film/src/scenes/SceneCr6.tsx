import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Toon, ToonLook} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineCr6';
import {easeOut, ramp} from '../util';
import {Capital, Choice, Ladder} from './SceneCr1';
import {DON, HERO} from './SceneCr2';
import {Desk, Office} from './SceneCr3';
import {ease01, SVG} from './twkit';

/** «Из низов», серия 6 «Карта» — ветка «рассказать дону». */

const LUCIA: ToonLook = {skin: '#f0c8a8', skinD: '#dcb090', hair: '#3a1a14', top: '#c8304a', topD: '#a8243a', legs: '#2a2a3a', legsD: '#22222e', shoes: '#14110e', longHair: true, scale: 0.9};
const MENDOSA: ToonLook = {skin: '#c89070', skinD: '#b07a5a', hair: '#14110e', top: '#2a6a5a', topD: '#1e544a', legs: '#1e2a2a', legsD: '#162020', shoes: '#0a0a0a', shades: true, chain: true, mustache: true, scale: 1.1};
const CHINO: ToonLook = {skin: '#c89070', skinD: '#b07a5a', hair: '#14110e', top: '#d84a3a', topD: '#b83a2c', legs: '#2a3446', legsD: '#222a3a', shoes: '#e8e4da', scale: 0.92};
const LADDER = ['ЧИСТИЛЬЩИК', 'ПОСЫЛЬНЫЙ', 'КУРЬЕР', 'ВОДИТЕЛЬ', 'ПРАВАЯ РУКА', 'НАСЛЕДНИК', 'БОСС'];

const zoom = (f: number, a: number, b: number, s: number, cx: number, cy: number) => {
  const k = ease01(f, a, b);
  return `translate(${540 + (540 - cx) * k * (s - 1)} ${900 + (900 - cy) * k * (s - 1)}) scale(${1 + k * (s - 1)}) translate(-540 -900)`;
};

/** Снимок из прачечной: Чино, Мендоса и карта порта на столе. */
const Snapshot: React.FC<{f: number; map: number; cross: number; loupe: number}> = ({f, map, cross, loupe}) => (
  <g>
    <Glow f={f} c1="#4a3a2a" c2="#0e0a08" cy={760} id="gsnap" />
    <g transform="translate(540 880) rotate(-3)">
      <rect x={-400} y={-470} width={800} height={900} fill="#f2ede0" />
      <defs><clipPath id="snap6"><rect x={-360} y={-430} width={720} height={720} /></clipPath></defs>
      <g clipPath="url(#snap6)">
        <rect x={-360} y={-430} width={720} height={720} fill="#e8d088" />
        <Toon id="sc6" x={-180} y={420} s={1.0} f={0} look={CHINO} pose={{eyes: 'side', look: 0.6, mouth: 'line', armR: [70, -40]}} />
        <Toon id="sm6" x={180} y={420} s={1.0} facing={-1} f={0} look={MENDOSA} pose={{eyes: 'half', mouth: 'smirk', armL: [60, -30]}} />
        <rect x={-300} y={110} width={600} height={180} fill="#6a4a2a" />
        <g opacity={map}>
          <rect x={-220} y={130} width={440} height={140} fill="#d8e4e8" transform="rotate(-2)" />
          <path d="M-200 220 Q-60 160 40 210 T200 190" stroke="#4a7aa8" strokeWidth={10} fill="none" />
          {[-150, -60, 30, 120].map((x) => <rect key={x} x={x} y={150} width={50} height={30} fill="#8a8a86" />)}
          <g opacity={cross} transform="translate(55 165)"><path d="M-22 -22 L22 22 M22 -22 L-22 22" stroke={C.redHot} strokeWidth={9} strokeLinecap="round" /></g>
        </g>
      </g>
      <text x={0} y={380} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill="#5a4a3a">САН-МИГЕЛЬ, 14 · НОЧЬ</text>
    </g>
    {loupe > 0 && (
      <g opacity={loupe} transform={`translate(${600} ${1040})`}>
        <circle r={150} fill="none" stroke="#2a2a2a" strokeWidth={22} />
        <circle r={140} fill="#fff" opacity={0.08} />
        <rect x={100} y={100} width={40} height={200} rx={14} fill="#2a2a2a" transform="rotate(-45 120 200)" />
      </g>
    )}
  </g>
);

/** Ночь: окно комнаты, под фонарём Чино. */
const NightWindow: React.FC<{f: number; below: boolean; tap: number}> = ({f, below, tap}) => (
  <g>
    <Glow f={f} c1="#2a3a6a" c2="#05060c" cy={500} id="gnw" />
    {!below ? (
      <g>
        <rect x={180} y={360} width={720} height={860} fill="#0e1220" stroke="#3a2e28" strokeWidth={30} />
        <rect x={525} y={360} width={30} height={860} fill="#3a2e28" />
        <circle cx={760} cy={520} r={60} fill="#e8e4da" opacity={0.7} />
        {tap > 0 && <g><circle cx={420} cy={760} r={14} fill="#8a8a86" /><g opacity={1 - tap}>{[0, 1, 2].map((i) => <path key={i} d={`M${420 + Math.cos(i * 2.1) * 30} ${760 + Math.sin(i * 2.1) * 30} l${Math.cos(i * 2.1) * 30} ${Math.sin(i * 2.1) * 30}`} stroke="#fff" strokeWidth={5} />)}</g></g>}
        <rect x={-200} y={1220} width={1480} height={900} fill="#1a1620" />
        <Toon id="hn" x={760} y={1560} s={1.15} f={f} facing={-1} look={HERO} pose={{eyes: 'wide', mouth: 'line', look: -0.6, armL: [30, 30]}} />
      </g>
    ) : (
      <g>
        <rect x={-200} y={1240} width={1480} height={900} fill="#1a1a24" />
        <rect x={780} y={560} width={12} height={700} fill="#2a2f38" />
        <circle cx={786} cy={560} r={20} fill="#fff2c8" />
        <polygon points="786,560 560,1260 1010,1260" fill="#fff2c8" opacity={0.1} />
        <Toon id="cn" x={760} y={1250} s={1.0} f={f} facing={-1} look={CHINO} pose={{eyes: 'open', look: 0.4, mouth: 'line', armR: [160, -20], brow: 0.6}} />
      </g>
    )}
  </g>
);

export const SceneCr6: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const OF = m('office'), LU = m('lucia'), LO = m('look'), LP = m('loupe'), MP = m('map'), CR = m('cross'), FR = m('friday'), R7 = m('rule7');
  const PR = m('praise'), PL = m('plus'), RK = m('rank'), HA = m('hall'), EF = m('efm'), OR = m('order'), AL = m('alive'), NI = m('night'), BE = m('below'), CX = m('choice');
  let scene: React.ReactNode = null;
  if (f < OF) {
    scene = <Glow f={f} c1="#2a5a4a" c2="#0a0e0c" cy={700} id="gres6" />;
  } else if (f < LO) {
    scene = (
      <g transform={f >= LU ? zoom(f, LU, LU + 25, 1.4, 160, 950) : ''}>
        <Office f={f} />
        <rect x={20} y={560} width={260} height={780} fill="#1a0e0a" />
        <Toon id="lu" x={150} y={1340} s={1} f={f} look={LUCIA} pose={{eyes: 'half', mouth: 'line', brow: -0.8, look: 0.8}} />
        <Toon id="don" x={760} y={1340} s={1} facing={-1} f={f} look={DON} pose={{sit: 1, eyes: 'half', mouth: 'line', armR: [60, -40], armL: [60, -40]}} />
        <Desk />
        <rect x={560} y={1040} width={90} height={60} fill="#f2ede0" transform="rotate(-6 605 1070)" />
        <Toon id="h1" x={440} y={1360} s={1} f={f} look={HERO} pose={{eyes: 'open', mouth: 'line', sweat: true, look: f >= LU ? -0.8 : 0.6}} />
      </g>
    );
  } else if (f < FR) {
    scene = <g transform={f >= MP ? zoom(f, MP, MP + 30, 1.5, 560, 1050) : ''}><Snapshot f={f} map={ramp(f, MP - 10, MP + 5)} cross={ramp(f, CR, CR + 8)} loupe={ramp(f, LP, LP + 10)} /></g>;
  } else if (f < HA) {
    scene = (
      <g transform={f >= FR && f < PR ? zoom(f, FR, FR + 25, 1.35, 760, 950) : ''}>
        <Office f={f} />
        <Toon id="don2" x={760} y={1340} s={1} facing={-1} f={f} look={DON} pose={{sit: 1, eyes: f >= PR ? 'half' : 'open', mouth: f < PL ? 'open' : 'smirk', talk: f < PL ? 0.2 + 0.25 * Math.sin(f / 2.5) : 0, brow: f < PR ? -1 : 0, armR: f >= PR ? [80, -10] : [60, -40], armL: [60, -40]}} />
        <Desk />
        <Toon id="h2" x={440} y={1360} s={1} f={f} look={HERO} pose={{eyes: f >= RK ? 'half' : 'wide', mouth: f >= RK ? 'smirk' : 'fear', sweat: f < PL, look: 0.6}} />
      </g>
    );
  } else if (f < OR) {
    const walk = ease01(f, HA, HA + 60);
    scene = (
      <g transform={f >= EF ? zoom(f, EF, EF + 15, 1.5, 300, 900) : ''}>
        <Glow f={f} c1="#5a3a2a" c2="#120a08" cy={700} id="ghall" />
        <rect x={-200} y={1320} width={1480} height={900} fill="#2a1a14" />
        {[100, 500, 900].map((x) => <rect key={x} x={x - 60} y={500} width={120} height={180} rx={10} fill="#3a2418" stroke="#d9b04a" strokeWidth={6} />)}
        <Toon id="lu2" x={1000 - walk * 500} y={1330} s={1} facing={-1} f={f} look={LUCIA} pose={{eyes: 'half', mouth: f >= HA + 30 && f < EF ? 'open' : 'line', brow: -1, step: walk < 1 ? f / 4 : undefined, look: -0.6}} />
        <Toon id="h3" x={300} y={1350} s={1} f={f} look={HERO} pose={{eyes: 'wide', mouth: f >= EF ? 'open' : 'fear', sweat: true, look: 0.8, brow: 1}} />
      </g>
    );
  } else if (f < NI) {
    scene = (
      <g transform={f >= AL ? zoom(f, AL, AL + 20, 1.4, 760, 950) : ''}>
        <Office f={f} />
        <Toon id="don3" x={760} y={1340} s={1} facing={-1} f={f} look={DON} pose={{sit: 1, eyes: 'half', mouth: 'line', talk: 0.2 + 0.25 * Math.sin(f / 2.5), brow: -1, armR: [60, -40], armL: [60, -40]}} />
        <Desk />
        <Toon id="h4" x={440} y={1360} s={1} f={f} look={HERO} pose={{eyes: 'wide', mouth: 'line', sweat: true, look: 0.6}} />
      </g>
    );
  } else if (f < CX) {
    scene = <NightWindow f={f} below={f >= BE} tap={f >= NI + 18 ? ramp(f, NI + 18, NI + 40) : 0} />;
  } else {
    scene = <Glow f={f} c1="#3a2a5a" c2="#0a0810" cy={700} id="gch6" />;
  }
  const l = f - 4;
  const cash = f < PL ? 1700 : 6700;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < OF && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#ffd23a', letterSpacing: 2, opacity: ramp(l, 0, 10)}}>ИТОГИ ГОЛОСОВАНИЯ</div>
          {[['1 — РАССКАЗАТЬ ДОНУ', 67, '2', '#ffd23a', 8], ['2 — СОХРАНИТЬ СЕКРЕТ', 33, '1', C.white, 18]].map(([lab, pct, v, col, d]) => (
            <div key={lab as string} style={{width: 860, marginTop: 30, opacity: ramp(l, d as number, (d as number) + 10)}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white}}><span>{lab}</span><span style={{fontFamily: MONO}}>{v}</span></div>
              <div style={{marginTop: 10, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.12)'}}><div style={{width: `${(pct as number) * easeOut(ramp(l, (d as number) + 6, (d as number) + 30))}%`, height: '100%', borderRadius: 22, background: col as string}} /></div>
            </div>
          ))}
        </AbsoluteFill>
      )}
      {f >= OF && f < CX && <Ladder step={f < RK ? 3 : 4} labels={LADDER} opacity={ramp(f, OF, OF + 10)} />}
      {f >= OF && f < CX && <Capital value={cash} up={f >= PL && f < PL + 40} opacity={ramp(f, OF, OF + 10)} />}
      {f >= CR && f < FR && <Chip x={540} y={330} text="КАРТА ПОРТА" kind="red" t={ramp(f, CR, CR + 10)} tilt={-2} size={44} />}
      {f >= FR && f < R7 && <Chip x={540} y={640} text="«ОНИ ПРИДУТ В ПЯТНИЦУ»" kind="white" t={ramp(f, FR + 20, FR + 30)} tilt={2} size={38} />}
      {f >= R7 && f < PR && <Chip x={540} y={640} text="ПРАВИЛО №7: КТО ПРЕДУПРЕЖДЁН — ТОТ ВООРУЖЁН" kind="red" t={ramp(f, R7, R7 + 10)} tilt={-2} size={28} />}
      {f >= RK && f < HA && <Chip x={540} y={640} text="ТЕПЕРЬ ТЫ — ПРАВАЯ РУКА" kind="yellow" t={ramp(f, RK, RK + 10)} tilt={-2} size={40} />}
      {f >= HA + 30 && f < EF && <Chip x={760} y={640} text="«ТЫ МЕНЯ СДАЛ»" kind="red" t={ramp(f, HA + 30, HA + 40)} tilt={2} size={42} />}
      {f >= AL && f < NI && <Chip x={540} y={640} text="«ПРИВЕЗИ ЕГО ЖИВЫМ»" kind="white" t={ramp(f, AL, AL + 10)} tilt={-2} size={40} />}
      {f >= BE && f < CX && <Chip x={760} y={640} text="ЧИНО" kind="red" t={ramp(f, BE, BE + 10)} tilt={2} size={46} />}
      {f >= CX && <Choice f={f} start={CX} a="СХВАТИТЬ ЧИНО" b="ПРЕДУПРЕДИТЬ ДРУГА" />}
    </AbsoluteFill>
  );
};
