import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PaperCloseup} from '../components/Bm';
import {Character, Look} from '../components/Character';
import {Stack, usd} from '../components/Jb';
import {MONO} from '../theme';
import {Chip} from '../components/Overlay';
import {C, FONT} from '../theme';
import {mk} from '../timelineCr1';
import {blink, easeOut, ramp, rand} from '../util';
import {ease01, SVG} from './twkit';

/** «Из низов» — общий вид: жаркий город, площадь, лестница наверх. */

export const KID: Partial<Look> = {scale: 0.86, skin: '#b07a5e', skinShade: '#8a5e48', hair: '#1a1410', top: '#e8e4da', topShade: '#c9c3b8', bottom: '#4a3a2a'};
export const DON: Partial<Look> = {skin: '#c29479', skinShade: '#9c7461', hair: '#d0d0cc', top: '#f2f2ee', topShade: '#d8d4c8', bottom: '#f2f2ee', shoes: '#3a2418'};
export const GUARD: Partial<Look> = {skin: '#a87a60', skinShade: '#86604c', hair: '#14110e', top: '#1d2129', topShade: '#14171d', bottom: '#1d2129'};
export const CHINO: Partial<Look> = {scale: 0.86, skin: '#9a6a50', skinShade: '#7a5040', hair: '#14110e', top: '#c95a4a', topShade: '#a84a3a', bottom: '#2a3446'};

const zoom = (f: number, a: number, b: number, s: number, cx: number, cy: number) => {
  const k = ease01(f, a, b);
  return `translate(${540 + (540 - cx) * k * (s - 1)} ${900 + (900 - cy) * k * (s - 1)}) scale(${1 + k * (s - 1)}) translate(-540 -900)`;
};

/** Площадь: колониальные дома, пальмы, брусчатка. dusk 0..1 — вечер. */
export const Plaza: React.FC<{f: number; dusk?: number}> = ({f, dusk = 0}) => {
  const sky = dusk ? '#2a2446' : '#f0b870';
  const houses = ['#e8c27a', '#d9805a', '#7ab0a8', '#e8a0a0', '#c8b8e0', '#f2d890'];
  return (
    <g>
      <defs><linearGradient id="crsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={dusk ? '#141030' : '#f6d49a'} /><stop offset="1" stopColor={sky} /></linearGradient></defs>
      <rect x={-200} y={-200} width={1480} height={1100} fill="url(#crsky)" />
      <circle cx={820} cy={240} r={dusk ? 60 : 110} fill={dusk ? '#e8e4da' : '#fff2c8'} opacity={dusk ? 0.6 : 0.9} />
      {Array.from({length: 7}).map((_, i) => {
        const x = -160 + i * 200, h = 380 + (i % 3) * 70;
        return (
          <g key={i}>
            <rect x={x} y={900 - h} width={196} height={h} fill={houses[i % 6]} opacity={dusk ? 0.45 : 1} />
            <rect x={x} y={900 - h} width={196} height={18} fill="#8a5a3a" opacity={0.6} />
            {[0, 1].map((r) => [0, 1].map((c) => (
              <g key={`${r}${c}`}>
                <rect x={x + 30 + c * 90} y={900 - h + 60 + r * 140} width={50} height={80} rx={24} fill={dusk && rand(i * 4 + r * 2 + c) > 0.4 ? C.warm : '#3a2a24'} opacity={0.9} />
                <rect x={x + 22 + c * 90} y={900 - h + 140 + r * 140} width={66} height={8} fill="#5a3a2a" />
              </g>
            )))}
          </g>
        );
      })}
      {[120, 960].map((x, k) => (
        <g key={x} transform={`translate(${x} 900)`}>
          <path d="M-8 0 Q-4 -200 6 -380 L14 -380 Q8 -200 8 0 Z" fill="#6a4a2a" />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M10 -380 q${-120 + i * 60} ${-40 + Math.abs(i - 2) * 30} ${-170 + i * 85} ${50 + Math.abs(i - 2) * 30}`} stroke="#3a7a4a" strokeWidth={22} fill="none" strokeLinecap="round" transform={`rotate(${Math.sin(f / 30 + i + k) * 3} 10 -380)`} />)}
        </g>
      ))}
      <rect x={-200} y={900} width={1480} height={1300} fill={dusk ? '#2a2420' : '#c8a878'} />
      {Array.from({length: 14}).map((_, r) => Array.from({length: 12}).map((__, c) => <rect key={`${r}${c}`} x={-200 + c * 130 + (r % 2) * 65} y={910 + r * 70} width={120} height={60} rx={10} fill={dusk ? '#342c26' : '#b89868'} opacity={0.6} />))}
    </g>
  );
};

/** Ящик чистильщика. */
const ShineBox: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-90} width={140} height={90} rx={8} fill="#7a4a2a" />
    <rect x={-56} y={-120} width={112} height={34} rx={6} fill="#5a3a20" />
    <rect x={-20} y={-160} width={40} height={44} rx={6} fill="#3a2418" />
    <rect x={-50} y={-70} width={30} height={40} rx={4} fill="#14110e" /><rect x={20} y={-70} width={30} height={40} rx={4} fill="#c95a4a" />
  </g>
);

/** Ботинки дона и щётка крупно. */
const Shoes: React.FC<{f: number; env: number}> = ({f, env}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#c8a878" />
    <rect x={300} y={-200} width={170} height={980} fill="#f2f2ee" />
    <rect x={600} y={-200} width={170} height={980} fill="#e8e4da" />
    {[[380, 0], [690, 1]].map(([x, k]) => (
      <g key={x} transform={`translate(${x} 860)`}>
        <path d="M-110 -80 Q-120 40 -60 60 L200 60 Q240 30 180 -10 L60 -40 L60 -80 Z" fill="#2a1810" />
        <ellipse cx={20 + Math.sin(f / 3 + k) * 20} cy={-20} rx={60} ry={18} fill="#fff" opacity={0.25 + 0.15 * Math.sin(f / 2)} />
      </g>
    ))}
    <g transform={`translate(${480 + Math.sin(f / 2.2) * 120} ${780}) rotate(${Math.sin(f / 2.2) * 8})`}>
      <rect x={-90} y={-40} width={180} height={50} rx={14} fill="#8a5a3a" />
      <rect x={-84} y={10} width={168} height={30} fill="#3a2418" />
      <ellipse cx={-30} cy={-80} rx={70} ry={50} fill={KID.skin} />
    </g>
    <g opacity={env} transform={`translate(${760} ${1080 - (1 - env) * 200}) rotate(-8)`}>
      <rect x={-150} y={-90} width={300} height={180} rx={10} fill="#e8dcc0" stroke="#c8b898" strokeWidth={4} />
      <path d="M-150 -90 L0 20 L150 -90" fill="none" stroke="#c8b898" strokeWidth={4} />
    </g>
  </g>
);

/** Лестница наверх (HUD): 7 ступеней, ты на step. */
export const Ladder: React.FC<{step: number; opacity?: number; labels?: string[]}> = ({step, opacity = 1, labels = ['ЧИСТИЛЬЩИК', 'ПОСЫЛЬНЫЙ', 'КУРЬЕР', 'ВОДИТЕЛЬ', 'ПРАВАЯ РУКА', 'НАСЛЕДНИК', 'БОСС']}) => (
  <div style={{position: 'absolute', left: 30, top: 230, opacity, display: 'flex', flexDirection: 'column-reverse', gap: 8, padding: '14px 18px', borderRadius: 18, background: 'rgba(5,7,12,0.45)'}}>
    {labels.map((l, i) => (
      <div key={l} style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <div style={{width: 24 + i * 8, height: 14, borderRadius: 4, background: i <= step ? '#d9b04a' : 'rgba(255,255,255,0.22)'}} />
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 1, color: i === step ? '#d9b04a' : 'rgba(255,255,255,0.45)'}}>{i === step ? `▶ ${l}` : l}</div>
      </div>
    ))}
  </div>
);

/** Счётчик капитала в долларах. */
export const Capital: React.FC<{value: number; up?: boolean; opacity?: number}> = ({value, up, opacity = 1}) => (
  <div style={{position: 'absolute', right: 40, top: 64, opacity, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 40, background: 'rgba(5,7,12,0.6)', fontFamily: MONO, fontWeight: 800, fontSize: 38, color: up ? '#5ad08a' : C.white}}>
    <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 22, color: C.grey, letterSpacing: 1.5}}>КАПИТАЛ</span>{usd(value)}
  </div>
);

/** Экран выбора «1 / 2». */
export const Choice: React.FC<{f: number; start: number; a: string; b: string}> = ({f, start, a, b}) => {
  const l = f - start;
  const pa = easeOut(ramp(l, 4, 16)), pb = easeOut(ramp(l, 12, 24));
  const pulse = 1 + 0.03 * Math.sin(l / 4);
  return (
    <AbsoluteFill style={{background: 'rgba(6,8,13,0.82)', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.grey, letterSpacing: 4, opacity: ramp(l, 0, 10)}}>ТВОЙ ВЫБОР</div>
      {[[a, '1', pa, '#d9b04a'], [b, '2', pb, C.white]].map(([t, n, p, col]) => (
        <div key={n as string} style={{width: 860, display: 'flex', alignItems: 'center', gap: 26, padding: '26px 34px', borderRadius: 30, background: 'rgba(242,242,238,0.07)', border: `4px solid ${col}`, opacity: p as number, transform: `translateX(${(1 - (p as number)) * (n === '1' ? -80 : 80)}px) scale(${pulse})`}}>
          <div style={{width: 110, height: 110, borderRadius: 55, background: col as string, color: '#14171d', fontFamily: FONT, fontWeight: 900, fontSize: 70, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.white, lineHeight: 1.05}}>{t}</div>
        </div>
      ))}
      <div style={{marginTop: 20, fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#d9b04a', opacity: ramp(l, 30, 40) * (Math.floor(l / 15) % 2 ? 1 : 0.6)}}>ПИШИ ЦИФРУ В КОММЕНТАРИЯХ 👇</div>
    </AbsoluteFill>
  );
};

export const SceneCr1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const HO = m('hook'), FE = m('fear'), SQ = m('square'), DO = m('don'), BO = m('boss'), SH = m('shine'), EN = m('env'), MO = m('money'), NO = m('note');
  const HM = m('home'), CH = m('chino'), LK = m('look'), CX = m('choice');
  let scene: React.ReactNode = null;
  if (f < DO) {
    const z = f < SQ ? zoom(f, HO, SQ, 1.2, 420, 1100) : '';
    scene = (
      <g transform={z}>
        <Plaza f={f} />
        {Array.from({length: 6}).map((_, i) => {
          const L = 1800, p = (rand(i) * L + f * 3 * (0.8 + rand(i + 3) * 0.4)) % L;
          const dir = i % 2 ? 1 : -1;
          return <Character key={i} who="mark" x={dir > 0 ? -300 + p : 1500 - p} y={1040 + (i % 3) * 14} size={0.8} facing={dir as 1 | -1} frame={f + i * 7}
            override={{top: ['#e8e4da', '#c95a4a', '#4a6a9a', '#d9b04a', '#6a8a5a', '#f2f2ee'][i], skin: '#b07a5e', skinShade: '#8a5e48', hair: '#14110e'}} pose={{step: f / 3 + i, blink: blink(f, i + 30)}} />;
        })}
        <ShineBox x={560} y={1240} />
        <Character who="mark" x={420} y={1240} size={1.05} facing={1} frame={f} override={KID} pose={{sit: 1, lean: 14, armF: [70 + Math.sin(f / 3) * 15, -40], blink: blink(f, 2), look: 0.6, lookUp: f < SQ ? 0.3 : 0}} />
      </g>
    );
  } else if (f < SH) {
    const walk = ease01(f, DO, DO + 60);
    scene = (
      <g transform={zoom(f, BO, BO + 30, 1.25, 640, 1000)}>
        <Plaza f={f} />
        <Character who="lev" x={1060 - walk * 150} y={1180} size={1.05} facing={-1} frame={f} override={GUARD} pose={{step: walk < 1 ? f / 4 : 0, blink: 1, brow: -0.5}} />
        <Character who="evgeny" x={1000 - walk * 260} y={1240} size={1.15} facing={-1} frame={f} override={DON} pose={{step: walk < 1 ? f / 4 : 0, sit: walk >= 1 ? 1 : 0, blink: blink(f, 4), look: -0.3, smile: 0.2}} />
        <ShineBox x={600} y={1240} />
        <Character who="mark" x={460} y={1240} size={1.05} facing={1} frame={f} override={KID} pose={{sit: 1, lean: 10, blink: blink(f, 2), look: 0.8, lookUp: 0.5, brow: 0.6}} />
        <Character who="lev" x={1200} y={1180} size={1.05} facing={-1} frame={f} override={GUARD} pose={{blink: 1}} />
      </g>
    );
  } else if (f < MO) {
    scene = <Shoes f={f} env={ease01(f, EN + 15, EN + 35)} />;
  } else if (f < NO) {
    scene = (
      <g>
        <rect x={-200} y={-200} width={1480} height={2400} fill="#3a2418" />
        <g transform={`translate(540 860) scale(${1 + ease01(f, MO, NO) * 0.15})`}>
          <rect x={-360} y={-200} width={720} height={420} rx={12} fill="#e8dcc0" />
          <path d="M-360 -200 L0 0 L360 -200" fill="#d8ccb0" />
          <g transform={`translate(0 ${-ease01(f, MO, MO + 25) * 160})`}><Stack x={-160} y={-40} s={1.4} h={6} /></g>
        </g>
      </g>
    );
  } else if (f < HM) {
    scene = <rect x={-200} y={-200} width={1480} height={2400} fill="#2a1a12" />;
  } else if (f < CX) {
    scene = (
      <g transform={f >= LK ? zoom(f, LK, CX, 1.3, 420, 1000) : ''}>
        <Plaza f={f} dusk={1} />
        <rect x={250} y={640} width={260} height={600} fill="#1a1410" />
        <rect x={250} y={640} width={260} height={600} fill={C.warm} opacity={0.18} />
        <Character who="mark" x={400} y={1240} size={1.1} facing={1} frame={f} override={KID} pose={{blink: blink(f, 2), look: f >= LK ? -0.3 : 0.8, brow: 0.7, armF: [50, -60], rim: 0.6, rimColor: C.warm}} />
        <rect x={440} y={980} width={70} height={44} rx={4} fill="#e8dcc0" transform="rotate(-10 475 1000)" />
        {f >= CH && <Character who="mark" x={880 - ease01(f, CH, CH + 40) * 120} y={1220} size={1.0} facing={-1} frame={f} override={CHINO} pose={{step: f < CH + 40 ? f / 3 : 0, armF: [150, -10], mouth: 0.4, blink: blink(f, 6)}} />}
      </g>
    );
  } else {
    scene = <Plaza f={f} dusk={1} />;
  }
  const cash = f < MO ? 0 : 500;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f >= NO && f < HM && <AbsoluteFill><PaperCloseup t={f - NO} kind="note" title="" lines={['Завтра. 6:00.', 'Гараж на Санта-Ана.', '', 'Приходи ОДИН.']} /></AbsoluteFill>}
      {f < CX && <Chip x={540} y={150} text="1979 · САН-ЛОРЕНСО" kind="white" t={ramp(f, 0, 8)} tilt={0} size={34} />}
      {f >= FE && f < CX && <Ladder step={0} opacity={ramp(f, FE, FE + 12)} />}
      {f >= FE && f < CX && <Capital value={cash} up={f >= MO && f < MO + 40} opacity={ramp(f, FE, FE + 12)} />}
      {f >= SQ && f < DO && <Chip x={700} y={560} text="50 ПЕСО ЗА ПАРУ" kind="white" t={ramp(f, m('pay'), m('pay') + 10)} tilt={-3} size={36} />}
      {f >= BO && f < SH && <Chip x={760} y={560} text="ДОН ОКТАВИО" kind="red" t={ramp(f, BO, BO + 10)} tilt={-2} size={40} />}
      {f >= MO && f < NO && <Chip x={540} y={1180} text="$500 — ЗАРАБОТОК ЗА ГОД" kind="yellow" t={ramp(f, MO + 10, MO + 20)} tilt={-2} size={40} />}
      {f >= CH && f < LK && <Chip x={800} y={560} text="ЧИНО" kind="white" t={ramp(f, CH, CH + 10)} tilt={3} size={36} />}
      {f >= CX && <Choice f={f} start={CX} a="ПОЙТИ В ГАРАЖ" b="ВЕРНУТЬ КОНВЕРТ" />}
    </AbsoluteFill>
  );
};
