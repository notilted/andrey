import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {ApartmentBack, ROOM} from '../components/Apartment';
import {Character} from '../components/Character';
import {FarSkyline, MidTowers, Sky, Street} from '../components/City';
import {Chip} from '../components/Overlay';
import {BLD, PanelBuilding} from '../components/PanelBuilding';
import {PhoneFrame} from '../components/Phone';
import {along, BuildingSection, floorY, SEC, stairPath} from '../components/Section';
import {Blanket, Cat, CEL, CellarBack, Crate, Crater, Fire, Meteor, MeteorAlertScreen, OrangeSky, RuinedBlock, Smoke, T, Tear, WaveAlertScreen, WaveCard} from '../components/Tw';
import {C, MONO} from '../theme';
import {mk} from '../timelineTw1';
import {blink, ease, ramp, rand} from '../util';
import {camera, ease01, eye, shakeXY, SVG} from './twkit';

/** Таймер первой волны: 2:00 с момента оповещения до вспышки (с монтажными скачками). */
export const timerTw1 = (f: number) => {
  const k: [number, number][] = [[mk('h_alert'), 120], [mk('h_two'), 116], [mk('stairs'), 90], [mk('t40'), 40], [mk('cover'), 10], [mk('t5'), 5], [mk('flash'), 0]];
  if (f < k[0][0]) return 120;
  return interpolate(f, k.map((x) => x[0]), k.map((x) => x[1]), {extrapolateRight: 'clamp'});
};

/* ───────── 1. Зацеп: телефон загорается в темноте ───────── */
const Hook: React.FC<{f: number}> = ({f}) => {
  const A = mk('h_alert');
  const TWO = mk('h_two');
  const grow = ease01(f, A - 4, A + 16);
  const buzz = f < A ? (Math.floor(f / 8) % 3 === 0 ? 1 : 0) : f < A + 30 ? 0.6 : 0;
  return (
    <AbsoluteFill style={{background: '#030406'}}>
      <div style={{position: 'absolute', left: 540, top: 1080, width: 900, height: 300, transform: 'translate(-50%,-50%)', background: `radial-gradient(ellipse at center, rgba(216,84,69,${0.18 + 0.2 * grow}) 0%, rgba(0,0,0,0) 70%)`}} />
      <PhoneFrame x={540} y={interpolate(grow, [0, 1], [1000, 760])} scale={interpolate(grow, [0, 1], [0.38, 0.95])} tilt={interpolate(grow, [0, 1], [-10, -2])} f={f} shake={buzz} glowK={0.2 + 0.3 * grow}>
        {f < A ? (
          <div style={{position: 'absolute', inset: 0, background: '#0b0d12', opacity: ramp(f, 4, 10)}}>
            <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 150, color: 'rgba(255,255,255,0.85)'}}>03:17</div>
            <div style={{position: 'absolute', top: 470, left: 40, right: 40, height: 120, borderRadius: 28, background: C.red, opacity: ramp(f, 16, 24)}} />
          </div>
        ) : (
          <MeteorAlertScreen f={f} start={A} remaining={timerTw1(f)} />
        )}
      </PhoneFrame>
      <Chip x={540} y={170} text="2 МИНУТЫ" kind="red" t={ramp(f, TWO, TWO + 10)} tilt={-2} size={40} />
    </AbsoluteFill>
  );
};

/* ───────── 2. Город: небо становится оранжевым ───────── */
const Exterior: React.FC<{f: number}> = ({f}) => {
  const E = mk('ext');
  const SKY = mk('sky');
  const R = mk('room');
  const orange = ramp(f, SKY - 20, SKY + 40);
  const s = interpolate(f, [E, R], [1.0, 1.14]);
  return (
    <SVG>
      <g transform={`translate(540 900) scale(${s}) translate(-540 -900)`}>
        <Sky f={f} />
        <OrangeSky k={orange} />
        <Meteor x0={-260} y0={-120} x1={760} y1={1200} p={(f - (SKY - 50)) / 110} size={1.4} />
        <g opacity={1 - orange * 0.25}><FarSkyline f={f} base={1180} /></g>
        <MidTowers f={f} base={1250} />
        <PanelBuilding f={f} special={{}} litBoost={0.15 + 0.75 * ramp(f, E, SKY + 20)} />
        <Street f={f} y={BLD.top + BLD.rows * BLD.rowH} />
        <rect x={-500} y={-500} width={2100} height={2900} fill={T.fire} opacity={0.12 * orange} />
      </g>
    </SVG>
  );
};

/* ───────── 3. Квартира: Соня в одеяле ───────── */
const Room: React.FC<{f: number}> = ({f}) => {
  const R = mk('room');
  const BUN = mk('bunny');
  const GO = mk('no_time');
  const go = f - GO;
  const heroX = 330 + Math.max(0, go) * 7;
  const sonX = 520 + Math.max(0, go - 6) * 7;
  const walking = go > 0;
  const searching = f >= BUN && f < GO;
  const cam = camera(f, [[R, 560, 800, 1.35], [BUN - 10, 520, 790, 1.5], [BUN + 20, 560, 820, 1.75], [GO, 560, 820, 1.75], [GO + 40, 760, 800, 1.3]]);
  return (
    <SVG>
      <g transform={cam}>
        <ApartmentBack f={f} lamp={0.25} alert={1} />
        <rect x={ROOM.left} y={ROOM.ceil} width={ROOM.right - ROOM.left} height={ROOM.floor - ROOM.ceil} fill={T.fire} opacity={0.08 + 0.03 * Math.sin(f / 5)} />
        {/* кровать */}
        <rect x={100} y={1010} width={300} height={70} rx={10} fill="#3a4254" />
        <rect x={100} y={990} width={90} height={30} rx={10} fill="#c9c3b8" />
        <rect x={100} y={1080} width={12} height={30} fill={C.wood} />
        <rect x={388} y={1080} width={12} height={30} fill={C.wood} />
        <Character who="mark" x={heroX} y={ROOM.floor} size={1.2} facing={1} frame={f}
          pose={{step: walking ? f / 2.6 : 0, armF: walking ? [70, -10] : [40, -40], armB: [-20, -10], blink: blink(f, 1), brow: 1, look: 0.3}} />
        <Character who="sonya" x={sonX} y={ROOM.floor} size={1.2} facing={walking ? 1 : -1} frame={f}
          pose={{step: walking ? f / 2.4 : 0, look: searching ? Math.sin((f - BUN) / 7) * 1.4 : 0.3, lookUp: searching ? -0.4 : 0.5, blink: blink(f, 4), brow: 0.8}} />
        <Blanket x={sonX} y={ROOM.floor} s={1.2} facing={walking ? 1 : -1} />
      </g>
    </SVG>
  );
};

/* ───────── 4. Подъезд в разрезе ───────── */
const doorX = (apt: 0 | 1) => SEC.left + 10 + apt * 335 + 320 - 26;
const RES = Array.from({length: 8}).map((_, i) => ({
  floor: [0, 1, 2, 3, 1, 2, 4, 0][i],
  apt: ([0, 1, 0, 1, 0, 1, 0, 1] as const)[i],
  delay: [0, 8, 20, 4, 40, 30, 14, 60][i],
  top: ['#4a3a48', '#3a4a3e', '#4a4236', '#36404a', '#4a3434', '#2f3a4a', '#3c3c46', '#40463a'][i],
  hair: ['#5a4030', '#1a1a1a', '#9a9a9a', '#2a1a14', '#151515', '#6b5a40', '#202020', '#3a2a20'][i],
  style: (['galina', 'mark', 'lev', 'alisa', 'mark', 'lev', 'mark', 'evgeny'] as const)[i],
}));

const Stairs: React.FC<{f: number}> = ({f}) => {
  const S = mk('stairs');
  const G = mk('galya');
  const GO = mk('galya_go');
  const CAT = mk('cat_jump');
  const lf = f - S;
  const y6 = floorY(6);
  const galX = doorX(0) - 10;
  // герой с Соней сбегают с последнего марша и останавливаются у двери бабы Гали
  const pts: [number, number][] = [[SEC.stairL + 40, floorY(5) + SEC.floorH / 2], [SEC.stairR - 40, y6], [galX + 90, y6]];
  const hero = along(pts, lf * 6.5);
  const son = along(pts, Math.max(0, lf - 8) * 6.5);
  const go = Math.max(0, f - GO);
  const hx = f >= GO ? galX + 90 + go * 5 : hero.x;
  const sx = f >= GO ? galX + 150 + go * 5 : Math.min(son.x, galX + 150 + (son.moving ? 200 : 0));
  const gx = f >= GO ? galX + Math.max(0, go - 6) * 5 : galX;
  const catJ = ease01(f, CAT, CAT + 18);
  const catX = f < CAT ? galX - 90 : galX - 90 + catJ * 150 + Math.max(0, f - CAT - 18) * 5.6;
  const catY = y6 - Math.sin(catJ * Math.PI) * 70;
  const cam = camera(f, [[S, 560, 1250, 0.98], [G - 20, 560, 1450, 1.15], [G + 6, 420, 1720, 2.1], [GO + 30, 520, 1720, 2.0], [mk('cellar'), 760, 1730, 1.9]]);
  return (
    <SVG>
      <g transform={cam}>
        <BuildingSection f={f} lights={1}>
          {RES.map((r, i) => {
            const rp: [number, number][] = [[doorX(r.apt), floorY(r.floor)], [SEC.stairR - 40, floorY(r.floor)], ...stairPath(r.floor, 6).slice(1), [1200, y6]];
            const p = along(rp, Math.max(0, lf - r.delay) * 7);
            if (lf < r.delay || p.x > 1100) return null;
            return (
              <Character key={i} who="mark" hair={r.style} x={p.x} y={p.y} size={0.56} facing={p.dir} frame={f + i * 13}
                override={{top: r.top, topShade: r.top, hair: r.hair, bottom: '#23262d'}}
                pose={{step: p.moving ? (f + i * 5) / 2.6 : 0, armF: [40, -20], armB: [-30, -10], blink: blink(f, i + 7), rim: 0.3, brow: 0.8}} />
            );
          })}
          {/* баба Галя в дверях, кот в квартире */}
          <Cat x={catX} y={catY} f={f} s={0.5} facing={1} run={f > CAT + 18} />
          <Character who="galina" x={gx} y={y6} size={0.56} facing={1} frame={f}
            pose={{step: f >= GO + 6 ? f / 2.8 : 0, armF: f >= G && f < GO ? [150, -30] : [50, -20], blink: blink(f, 9), brow: 1, look: 0.4, lookUp: 0.2}} />
          <Character who="sonya" x={sx} y={son.y} size={0.56} facing={f >= GO ? 1 : son.moving ? son.dir : -1} frame={f}
            pose={{step: son.moving || f >= GO ? f / 2.4 : 0, blink: blink(f, 4), brow: 0.9, look: 0.4}} />
          <Blanket x={sx} y={son.y} s={0.56} facing={f >= GO ? 1 : son.moving ? son.dir : -1} />
          <Character who="mark" x={hx} y={hero.y} size={0.56} facing={f >= GO ? 1 : hero.moving ? hero.dir : -1} frame={f}
            pose={{step: hero.moving || f >= GO ? f / 2.6 : 0, armF: f >= GO - 10 && f < GO + 20 ? [-80, -10] : [50, -20], armB: [-40, -10], blink: blink(f, 1), brow: 1, look: 0.3}} />
        </BuildingSection>
      </g>
    </SVG>
  );
};

/* ───────── 5. Подвал: удар ───────── */
const Dust: React.FC<{f: number; k: number}> = ({f, k}) => (
  <g opacity={k}>
    {Array.from({length: 70}).map((_, i) => {
      const p = ((f * (0.004 + rand(i) * 0.006) + rand(i + 50)) % 1);
      return <circle key={i} cx={rand(i + 9) * 1240 - 80} cy={CEL.ceil + p * 640} r={1.5 + rand(i + 3) * 3} fill="#c9bfae" opacity={0.5 * (1 - p)} />;
    })}
    <rect x={-200} y={CEL.ceil} width={1500} height={700} fill="#8a7f70" opacity={0.12} />
  </g>
);

const Cellar: React.FC<{f: number}> = ({f}) => {
  const CE = mk('cellar');
  const EV = mk('evgeny');
  const LIE = mk('lie');
  const COV = mk('cover');
  const ROAR = mk('roar');
  const FL = mk('flash');
  const HIT = mk('hit');
  const BL = mk('black');
  const DU = mk('dust');
  const enter = (d: number, to: number) => interpolate(f, [CE + d, CE + d + 50], [40, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const walking = (d: number) => f > CE + d && f < CE + d + 50;
  const down = ease01(f, LIE + 6, LIE + 26) * (1 - ease01(f, DU + 10, DU + 60));
  const cover = ease01(f, COV, COV + 18) * (1 - ease01(f, DU + 10, DU + 60));
  const outside = f < ROAR ? 0.15 + 0.1 * ramp(f, CE, ROAR) : f < FL ? 0.25 + 0.75 * ramp(f, ROAR, FL) : f < DU ? 1 : 0.5;
  const crack = f >= HIT ? 1 : 0;
  const bulb = f < HIT ? 1 : f < HIT + 20 ? (Math.floor(f / 3) % 2 ? 0.8 : 0) : 0;
  const shake = f < ROAR ? 0 : f < HIT ? 2 + 6 * ramp(f, ROAR, FL) : 26 * Math.exp(-(f - HIT) / 22);
  const evX = 900;
  const heroX = enter(0, 640) - cover * 40;
  const sonX = enter(6, 540);
  const galX = enter(14, 300);
  const catX = enter(22, 410);
  const cam = camera(f, [[CE, 520, 900, 1.05], [EV - 10, 560, 900, 1.05], [EV + 10, 860, 880, 1.7], [LIE + 20, 860, 880, 1.6], [LIE + 40, 620, 960, 1.25], [COV, 600, 960, 1.35], [COV + 30, 580, 1000, 1.9], [ROAR + 40, 600, 960, 1.4], [DU, 600, 940, 1.2]]);
  const rim = f >= ROAR && f < DU ? T.fire : C.lamp;
  return (
    <SVG>
      <g transform={`${shakeXY(f, shake)} ${cam}`}>
        <CellarBack f={f - HIT} bulb={bulb} outside={outside} crack={crack} />
        <Crate x={evX + 10} y={CEL.floor} w={130} h={96} />
        <Character who="evgeny" x={evX} y={CEL.floor} size={1.15} facing={-1} frame={f}
          pose={{sit: 1, lean: 4 + down * 14, armF: [60, -70], armB: [20, -40], blink: blink(f, 3), brow: f > LIE ? 0.6 : -0.2, look: 0.5, rim: 0.6, rimColor: rim}} />
        {/* сигарета */}
        {f < LIE + 10 && (
          <g>
            <circle cx={evX - 34} cy={CEL.floor - 302} r={4} fill={T.fireHot} opacity={0.7 + 0.3 * Math.sin(f / 6)} />
            {[0, 1].map((i) => {
              const p = (f / 60 + i / 2) % 1;
              return <circle key={i} cx={evX - 34 + Math.sin(p * 5) * 8} cy={CEL.floor - 310 - p * 80} r={4 + p * 10} fill="#9a9aa0" opacity={0.25 * (1 - p)} />;
            })}
          </g>
        )}
        <Cat x={catX} y={CEL.floor} f={f} s={0.9} facing={1} run={walking(22)} />
        <Character who="galina" x={galX} y={CEL.floor} size={1.1} facing={1} frame={f}
          pose={{step: walking(14) ? f / 2.8 : 0, sit: down * 0.6, lean: down * 14, blink: blink(f, 9), brow: 1, look: 0.4, rim: 0.6, rimColor: rim}} />
        <Character who="sonya" x={sonX} y={CEL.floor} size={1.15} facing={1} frame={f}
          pose={{step: walking(6) ? f / 2.4 : 0, sit: down * 0.7, lean: down * 20, headTilt: cover * 10, blink: f >= COV ? 0.1 : blink(f, 4), brow: 1, rim: 0.6, rimColor: rim}} />
        <Blanket x={sonX} y={CEL.floor - down * 50} s={1.15} />
        <Character who="mark" x={heroX} y={CEL.floor} size={1.2} facing={-1} frame={f}
          pose={{step: walking(0) ? f / 2.6 : 0, sit: down * 0.6, lean: down * 18 + cover * 16, armF: cover > 0.1 ? [100, -30] : [20, -14], armB: cover > 0.1 ? [80, -30] : [-10, -10], blink: blink(f, 1), brow: 1, look: 0.2, rim: 0.6, rimColor: rim}} />
        <Dust f={f} k={f >= HIT ? 0.6 + 0.4 * ramp(f, HIT, HIT + 30) : 0} />
        {f >= DU && <rect x={-200} y={-200} width={1500} height={2400} fill="#000" opacity={0.3} />}
      </g>
      {/* вспышка и чернота */}
      {f >= FL - 2 && f < HIT + 14 && <rect width={1080} height={1920} fill="#fff6e8" opacity={ramp(f, FL - 2, FL + 3) * (1 - ramp(f, HIT, HIT + 14))} />}
      {f >= BL && f < DU + 12 && <rect width={1080} height={1920} fill="#000" opacity={ramp(f, BL, BL + 4) * (1 - ramp(f, DU, DU + 12))} />}
    </SVG>
  );
};

/* ───────── 6. Снаружи: руины и кратер ───────── */
const Outside: React.FC<{f: number}> = ({f}) => {
  const O = mk('out');
  const CR = mk('crater');
  const REL = mk('relief');
  const CRY = mk('cry');
  const PH = mk('phones');
  const gy = 1560;
  const hug = ease01(f, REL + 10, REL + 30);
  const sonFacing: 1 | -1 = -1;
  const e = eye(600, gy, 1.0, sonFacing, 0.64, 1.24, 118);
  const cam = camera(f, [[O, 520, 1050, 0.95], [CR - 10, 560, 1100, 1.0], [CR + 30, 860, 1300, 1.35], [REL - 10, 860, 1300, 1.35], [REL + 20, 560, 1380, 1.7], [CRY, 570, 1380, 1.7], [CRY + 24, 610, 1380, 2.6], [PH, 615, 1375, 2.7]]);
  return (
    <SVG>
      <g transform={`${shakeXY(f, 0)} ${cam}`}>
        <OrangeSky k={1} h={1500} />
        <Smoke x={980} y={1450} f={f} scale={1.6} seed={3} />
        <Smoke x={-60} y={1350} f={f + 60} scale={1.2} seed={7} />
        <g opacity={0.9}><FarSkyline f={f} base={1330} /></g>
        <rect x={-600} y={900} width={2400} height={600} fill="#1a0f0d" opacity={0.35} />
        <RuinedBlock f={f} x={80} base={1450} seed={2} />
        <rect x={-800} y={1440} width={2800} height={1200} fill="#141012" />
        <Crater x={980} y={1520} f={f} w={760} />
        {[[-40, 1480], [240, 1500], [720, 1470]].map(([x, y], i) => <Fire key={i} x={x} y={y} f={f + i * 9} w={60} seed={i} />)}
        {Array.from({length: 18}).map((_, i) => (
          <rect key={i} x={rand(i) * 1300 - 150} y={1460 + rand(i + 3) * 160} width={20 + rand(i + 5) * 60} height={10 + rand(i + 7) * 20} fill="#2a2628" transform={`rotate(${rand(i + 9) * 40 - 20})`} />
        ))}
        <Cat x={320} y={gy} f={f} s={0.7} facing={1} />
        <Character who="galina" x={260} y={gy} size={1.0} facing={1} frame={f} pose={{blink: blink(f, 9), brow: 1, lookUp: 0.6, look: 0.2, rimColor: T.fire, rim: 1}} />
        <Character who="evgeny" x={400} y={gy} size={1.0} facing={1} frame={f} pose={{blink: blink(f, 3), brow: 0.6, lookUp: 0.4, armF: [10, -10], rimColor: T.fire, rim: 1}} />
        <Character who="mark" x={540 - hug * 10} y={gy} size={1.05} facing={1} frame={f}
          pose={{sit: hug * 0.45, lean: hug * 20, armF: hug > 0.2 ? [95, -50] : [10, -14], blink: blink(f, 1), brow: 0.8, look: 0.4, rimColor: T.fire, rim: 1}} />
        <Character who="sonya" x={600} y={gy} size={1.0} facing={sonFacing} frame={f}
          pose={{blink: f >= CRY ? blink(f, 4) * 0.6 : blink(f, 4), brow: 1, lookUp: f >= CRY ? 0.9 : 0.3, look: 0.4, mouth: f >= CRY ? 0.25 + 0.15 * Math.sin(f / 4) : 0, rimColor: T.fire, rim: 1}} />
        {f >= CRY + 10 && [0, 1].map((i) => <Tear key={i} x={e.x - 2} y={e.y + 6} t={((f - CRY) / 40 + i / 2) % 1} s={1} />)}
        <rect x={-800} y={-800} width={2800} height={3600} fill={T.fire} opacity={0.06} />
      </g>
    </SVG>
  );
};

/* ───────── сцена целиком ───────── */
export const SceneTw1: React.FC<{f: number}> = ({f}) => {
  const EXT = mk('ext');
  const ROOMm = mk('room');
  const ST = mk('stairs');
  const CE = mk('cellar');
  const OUT = mk('out');
  const PH = mk('phones');
  const MSG = mk('msg');
  const TITLE = mk('title');
  const wave2 = 12 * 3600 - Math.max(0, f - MSG) / 30;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f < EXT && <Hook f={f} />}
      {f >= EXT && f < ROOMm && <Exterior f={f} />}
      {f >= ROOMm && f < ST && <Room f={f} />}
      {f >= ST && f < CE && <Stairs f={f} />}
      {f >= CE && f < OUT && <Cellar f={f} />}
      {f >= OUT && f < TITLE && <Outside f={f} />}
      {/* телефоны вибрируют у всех разом */}
      {f >= PH && f < TITLE && (
        <AbsoluteFill style={{background: 'rgba(6,8,13,0.88)', opacity: ramp(f, PH, PH + 6)}}>
          {f < MSG ? (
            <>
              <PhoneFrame x={250} y={760} scale={0.6} tilt={-8} f={f} shake={0.8} glowK={0.3}><WaveAlertScreen f={f} start={PH + 6} wave={2} remaining={12 * 3600} note="" /></PhoneFrame>
              <PhoneFrame x={830} y={790} scale={0.6} tilt={7} f={f + 5} shake={0.8} glowK={0.3}><WaveAlertScreen f={f} start={PH + 10} wave={2} remaining={12 * 3600} note="" /></PhoneFrame>
              <PhoneFrame x={540} y={720} scale={0.82} tilt={-1} f={f + 9} shake={0.9} glowK={0.4}><WaveAlertScreen f={f} start={PH} wave={2} remaining={12 * 3600} note="" /></PhoneFrame>
            </>
          ) : (
            <PhoneFrame x={540} y={720} scale={interpolate(f, [MSG, TITLE], [0.92, 1.0])} tilt={-1} f={f} shake={f < MSG + 20 ? 0.6 : 0} glowK={0.45}>
              <WaveAlertScreen f={f + 30} start={MSG} wave={2} remaining={wave2} note="ОБЪЕКТ В 40 РАЗ БОЛЬШЕ" />
            </PhoneFrame>
          )}
        </AbsoluteFill>
      )}
      {f >= TITLE && (
        <AbsoluteFill style={{background: C.void}}>
          <WaveCard f={f} start={TITLE} wave={1} next="ДО ВТОРОЙ ВОЛНЫ" remaining={12 * 3600 - 7 - (f - TITLE) / 30} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
