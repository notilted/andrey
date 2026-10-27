import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Character, Who} from '../components/Character';
import {Beach, Building, Cap, CoastSky, D, DmCard, Flood, G, Promenade, Rod, roofY, SirenSign} from '../components/Dm';
import {Chip} from '../components/Overlay';
import {along, BuildingSection, floorY, SEC, stairPath} from '../components/Section';
import {C} from '../theme';
import {mk} from '../timelineDm1';
import {blink, ramp, rand} from '../util';
import {camera, ease01, shakeXY, SVG} from './twkit';

/** Таймер до волны (секунды): 9:00 с момента, как море ушло. */
export const timerDm1 = (f: number) => {
  const k: [number, number][] = [[mk('recede'), 540], [mk('palych'), 490], [mk('hotel'), 480], [mk('reception'), 430], [mk('stairs'), 250], [mk('roof'), 60], [mk('horizon'), 30], [mk('hit'), 0]];
  if (f < k[0][0]) return 540;
  return interpolate(f, k.map((x) => x[0]), k.map((x) => x[1]), {extrapolateRight: 'clamp'});
};

const LAND = 1300;
const LIFT = LAND - G.ground; // сдвиг зданий на уровень пляжа
const EXTRA_LOOK = [
  {top: '#c95a4a', hair: '#2a1a14', style: 'alisa'}, {top: '#4a8a6a', hair: '#1a1a1a', style: 'mark'}, {top: '#d9b04a', hair: '#5a4030', style: 'galina'},
  {top: '#5a6aa0', hair: '#151515', style: 'lev'}, {top: '#e8e4da', hair: '#3a2a20', style: 'alisa'}, {top: '#a04a6a', hair: '#202020', style: 'mark'},
] as const;

/** Отдыхающие на пляже / на дне. */
const Tourists: React.FC<{f: number; xs: number[]; y: number; laugh?: number; phones?: boolean; s?: number}> = ({f, xs, y, laugh = 0, phones, s = 0.6}) => (
  <g>
    {xs.map((x, i) => {
      const e = EXTRA_LOOK[i % EXTRA_LOOK.length];
      return (
        <Character key={i} who="mark" hair={e.style as Who} x={x} y={y} size={s} facing={rand(i + 3) > 0.5 ? 1 : -1} frame={f + i * 9}
          override={{top: e.top, topShade: e.top, hair: e.hair, bottom: '#3a4050'}}
          pose={{armF: phones ? [120, -100] : [20, -20], smile: laugh * 0.8, mouth: laugh ? 0.3 + 0.3 * Math.sin(f / 3 + i) : 0, blink: blink(f, i + 30), rim: 0.3}} />
      );
    })}
  </g>
);

/** Гостиница «Прибой» на уровне пляжа. */
const Hotel: React.FC<{f: number; x?: number}> = ({f, x = -620}) => (
  <g transform={`translate(0 ${LIFT})`}>
    <Building f={f} x={x} w={500} floors={5} color="#d8cfbf" sign="ГОСТИНИЦА «ПРИБОЙ»" />
    <Building f={f} x={x - 640} w={540} floors={9} color="#9aa0a8" />
  </g>
);

/* ───────── пляж: зацеп, отдых, море уходит ───────── */
const BeachShot: React.FC<{f: number}> = ({f}) => {
  const BE = mk('beach');
  const QU = mk('quake');
  const LA = mk('laugh');
  const RE = mk('recede');
  const SB = mk('seabed');
  const PA = mk('palych');
  const SH = mk('shout');
  const MO = mk('mock');
  const SI = mk('siren');
  const hook = f < BE;
  const recede = hook ? interpolate(f, [0, BE], [0, 0.85]) : f < RE ? 0 : interpolate(f, [RE, SB + 60], [0, 0.9], {extrapolateRight: 'clamp'});
  const shake = f >= QU && f < QU + 40 ? 6 * (1 - (f - QU) / 40) : 0;
  const onBed = ease01(f, SB, SB + 60);
  const rodDrop = f >= SH ? ease01(f, SH, SH + 14) : 0;
  const cam = hook
    ? camera(f, [[0, 900, 1150, 0.8], [BE, 1100, 1180, 0.85]])
    : camera(f, [[BE, 520, 1180, 1.25], [mk('cap') - 1, 520, 1180, 1.25], [mk('cap') + 15, 470, 1220, 2.6], [QU - 1, 470, 1220, 2.6], [QU, 600, 1150, 1.1], [LA + 30, 640, 1150, 1.15],
      [RE, 900, 1150, 0.95], [SB, 1300, 1180, 1.0], [PA - 1, 1300, 1180, 1.0], [PA + 10, 760, 1180, 2.2], [MO - 1, 760, 1180, 2.2], [MO, 1300, 1200, 1.5], [SI - 1, 1300, 1200, 1.5], [SI + 10, 300, 1000, 2.0], [mk('grab'), 300, 1000, 2.0]]);
  return (
    <>
    <SVG>
      <g transform={`${shakeXY(f, shake)} ${cam}`}>
        <CoastSky k={f >= RE ? ramp(f, RE, SB) * 0.5 : 0} />
        <circle cx={1500} cy={560} r={70} fill="#fff1c8" opacity={0.9} />
        <Beach f={f} recede={recede} horizon={1000} calm={f < RE} />
        <Hotel f={f} />
        <Promenade f={f} x={0} y={LAND} />
        {/* герой с Мишей у песочного замка */}
        <path d="M430 1300 l20 -40 l20 40 Z M460 1300 l14 -26 l14 26 Z" fill={D.sandDark} />
        <Character who="mark" x={380} y={LAND} size={0.9} facing={1} frame={f} pose={{sit: f < QU ? 0.6 : 0, lean: f < QU ? 20 : 0, blink: blink(f, 1), brow: f >= RE ? 0.8 : 0, smile: f < QU ? 0.6 : 0, look: 0.4}} />
        <Character who="misha" x={520} y={LAND} size={0.9} facing={-1} frame={f} pose={{sit: f < QU ? 1 : 0, armF: [60, -30], blink: blink(f, 4), smile: f < RE ? 0.8 : 0, look: 0.4, lookUp: 0.3}} />
        {/* Палыч с удочкой у старой кромки */}
        <Character who="palych" x={740} y={LAND} size={0.95} facing={1} frame={f}
          pose={{armF: rodDrop ? [150, -10] : [70, -50], armB: rodDrop ? [-150, 10] : [-10, -10], blink: blink(f, 7), brow: f >= PA ? 1 : 0, mouth: f >= SH && f < MO ? 0.6 + 0.3 * Math.sin(f / 3) : 0, look: 0.6}} />
        <Rod x={760 + rodDrop * 30} y={LAND - 180 + rodDrop * 170} ang={-50 + rodDrop * 50} />
        {/* отдыхающие: сначала на пляже, потом выходят на дно */}
        <Tourists f={f} xs={[900, 1010, 1120, 1240, 1380, 1490].map((x, i) => x + onBed * (i * 30))} y={LAND - onBed * 110} s={0.6 - onBed * 0.15} laugh={f >= LA && f < RE ? 1 : f >= MO && f < SI ? 1 : 0} phones={f >= SB} />
      </g>
    </SVG>
      {hook && <Chip x={540} y={330} text="9 МИНУТ" kind="red" t={ramp(f, mk('h_nine'), mk('h_nine') + 10)} tilt={-2} size={46} />}
    </>
  );
};

/* ───────── бег: Мишу на руки, гостиница, ресепшен ───────── */
const Carry: React.FC<{f: number; x: number; y: number; facing: 1 | -1; size: number; run: boolean}> = ({f, x, y, facing, size, run}) => (
  <g>
    <Character who="mark" x={x} y={y} size={size} facing={facing} frame={f} pose={{step: run ? f / 2.4 : 0, armF: [60, -90], armB: [40, -70], blink: blink(f, 1), brow: 1, look: 0.4}} />
    <Character who="misha" x={x + facing * 26 * size} y={y - 150 * size} size={size} facing={facing} frame={f} pose={{sit: 1, armF: [120, -60], blink: blink(f, 4), brow: 1, look: -0.3}} />
  </g>
);

const RunShot: React.FC<{f: number}> = ({f}) => {
  const GR = mk('grab');
  const HO = mk('hotel');
  const run = ease01(f, GR + 10, HO + 60);
  const hx = interpolate(run, [0, 1], [380, -330]);
  const cam = camera(f, [[GR, 420, 1150, 2.0], [HO, 100, 1100, 1.0], [mk('reception'), -330, 1050, 1.1]]);
  return (
    <SVG>
      <g transform={cam}>
        <CoastSky k={0.6} />
        <Beach f={f} recede={0.9} horizon={1000} />
        <Hotel f={f} />
        <Promenade f={f} x={0} y={LAND} />
        <Carry f={f} x={hx} y={LAND} facing={-1} size={0.9} run={run > 0 && run < 1} />
        <Character who="palych" x={hx + 260 - run * 60} y={LAND} size={0.95} facing={-1} frame={f} pose={{step: run > 0.1 && run < 1 ? f / 2.8 : 0, blink: blink(f, 7), brow: 1, look: 0.5}} />
        <Tourists f={f} xs={[1500, 1620, 1760]} y={LAND - 110} s={0.45} phones />
      </g>
    </SVG>
  );
};

const Lobby: React.FC<{f: number}> = ({f}) => {
  const RC = mk('reception');
  const VR = mk('vika_run');
  const vx = f < VR ? 640 : 640 + (f - VR) * 9;
  const hx = f < VR + 10 ? interpolate(f, [RC, RC + 40], [120, 380], {extrapolateRight: 'clamp'}) : 380 + (f - VR - 10) * 8;
  const cam = camera(f, [[RC, 420, 1050, 1.4], [RC + 50, 520, 980, 1.8], [VR, 560, 1000, 1.5], [mk('stairs'), 760, 1000, 1.3]]);
  return (
    <SVG>
      <g transform={cam}>
        <rect x={-600} y={300} width={2400} height={1200} fill="#cfc4ae" />
        <rect x={-600} y={1100} width={2400} height={600} fill="#8a7a62" />
        {Array.from({length: 6}).map((_, i) => <rect key={i} x={-400 + i * 360} y={420} width={8} height={680} fill="#b8ac94" />)}
        <rect x={140} y={380} width={300} height={70} rx={8} fill="#1d2129" />
        <text x={290} y={426} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill={C.warm}>РЕСЕПШЕН</text>
        <path d="M1000 1100 L1000 560 L1180 560 L1180 1100 Z" fill="#2a2e35" />
        <text x={1090} y={540} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={26} fill="#2a2e35">ЛЕСТНИЦА ↑</text>
        <Character who="vika" x={vx} y={1100} size={1.1} facing={1} frame={f}
          pose={{step: f >= VR ? f / 2.2 : 0, blink: blink(f, 5), brow: f >= RC + 40 ? 1 : 0, look: f < VR ? -0.6 : 0.5, armF: f < VR ? [40, -60] : [60, -20]}} />
        {/* стойка с табличкой про сирену */}
        <rect x={420} y={880} width={460} height={220} fill="#7a5a3a" />
        <rect x={400} y={860} width={500} height={30} fill="#8a6a46" />
        <SirenSign x={760} y={834} s={0.42} rot={-4} />
        <Carry f={f} x={hx} y={1100} facing={1} size={1.1} run={f < RC + 40 || f >= VR + 10} />
        <Character who="palych" x={hx - 180} y={1100} size={1.1} facing={1} frame={f} pose={{step: f < RC + 40 || f >= VR + 14 ? f / 2.8 : 0, blink: blink(f, 7), brow: 1}} />
      </g>
    </SVG>
  );
};

/* ───────── лестница вверх и запертая дверь ───────── */
const StairsUp: React.FC<{f: number}> = ({f}) => {
  const ST = mk('stairs');
  const LO = mk('locked');
  const KI = mk('kick');
  const up = (from: number, delay: number) => {
    const pts = stairPath(1, 5).slice().reverse();
    return along(pts, Math.max(0, f - from - delay) * 9);
  };
  const v = up(ST, 0);
  const h = up(ST, 10);
  const p = up(ST, 18);
  const top = floorY(1);
  const doorOpen = f >= KI + 16 ? 1 : 0;
  const cam = f < LO ? camera(f, [[ST, 860, 1200, 0.9], [LO, 860, 760, 1.1]]) : camera(f, [[LO, 900, top - 120, 2.3], [KI + 30, 900, top - 120, 2.3]]);
  const atTop = f >= LO;
  return (
    <>
    <SVG>
      <g transform={`${shakeXY(f, f >= KI + 10 && f < KI + 24 ? 8 : 0)} ${cam}`}>
        <BuildingSection f={f} lights={1} labelTop={6}>
          {/* дверь на крышу на верхней площадке */}
          <rect x={SEC.stairR - 70} y={top - 220} width={70} height={220} fill={doorOpen ? '#e8d8b0' : '#5a4a3a'} />
          {!doorOpen && <rect x={SEC.stairR - 62} y={top - 120} width={10} height={20} fill="#c9b458" />}
          {doorOpen && <rect x={SEC.stairR - 70} y={top - 220} width={18} height={220} fill="#5a4a3a" transform={`rotate(-70 ${SEC.stairR - 70} ${top - 220})`} />}
          {atTop ? (
            <g>
              <Character who="vika" x={SEC.stairR - 280} y={top} size={0.6} facing={1} frame={f} pose={{blink: blink(f, 5), brow: 1, look: 0.4}} />
              <Carry f={f} x={SEC.stairR - 200} y={top} facing={1} size={0.6} run={false} />
              <Character who="palych" x={f >= KI ? interpolate(f, [KI, KI + 16], [SEC.stairR - 130, SEC.stairR - 80], {extrapolateRight: 'clamp'}) : SEC.stairR - 130} y={top} size={0.62} facing={1} frame={f}
                pose={{lean: f >= KI && f < KI + 20 ? 30 : 0, armF: [20, -10], blink: blink(f, 7), brow: 1}} />
            </g>
          ) : (
            <g>
              <Character who="vika" x={v.x} y={v.y} size={0.56} facing={v.dir} frame={f} pose={{step: v.moving ? f / 2.2 : 0, blink: blink(f, 5), brow: 1}} />
              <Carry f={f} x={h.x} y={h.y} facing={h.dir} size={0.56} run={h.moving} />
              <Character who="palych" x={p.x} y={p.y} size={0.58} facing={p.dir} frame={f} pose={{step: p.moving ? f / 2.8 : 0, blink: blink(f, 7), brow: 1}} />
            </g>
          )}
        </BuildingSection>
      </g>
    </SVG>
      {f >= LO && f < KI + 10 && <Chip x={540} y={330} text="ЗАПЕРТО" kind="red" t={ramp(f, LO + 8, LO + 18)} tilt={-2} size={40} />}
    </>
  );
};

/* ───────── крыша: горизонт поднимается, удар, пустые руки ───────── */
const RoofShot: React.FC<{f: number}> = ({f}) => {
  const RO = mk('roof');
  const HZ = mk('horizon');
  const R = mk('roar');
  const HI = mk('hit');
  const SHK = mk('shake');
  const SIL = mk('silence');
  const EM = mk('empty');
  const wall = ramp(f, HZ, HI + 10);
  const shake = f < R ? 0 : f < HI ? 4 * ramp(f, R, HI) : f < SIL ? 14 * Math.exp(-(f - HI) / 40) + 4 : 0;
  const spray = f >= HI && f < SIL ? 1 - ramp(f, SHK + 40, SIL) : 0;
  const lost = f >= SIL;
  const roof = 1100;
  const cam = camera(f, [[RO, 560, 900, 0.9], [HZ, 700, 900, 0.85], [HI, 700, 950, 0.9], [SHK, 380, 950, 2.0], [SIL, 380, 950, 2.0], [EM, 380, 900, 2.6], [mk('cap_float'), 380, 900, 2.7]]);
  return (
    <>
    <SVG>
      <g transform={`${shakeXY(f, shake)} ${cam}`}>
        <CoastSky k={0.8} />
        <g transform="translate(0 -200)">
          <Beach f={f} recede={f < HI ? 0.9 : 0} wall={wall} horizon={900} />
        </g>
        {f >= HI && <Flood f={f} level={interpolate(f, [HI, HI + 90], [1500, 1180], {extrapolateRight: 'clamp'})} drift={1} />}
        {/* крыша гостиницы */}
        <rect x={-400} y={roof} width={1300} height={900} fill="#bfb6a6" />
        <rect x={-400} y={roof - 40} width={1300} height={40} fill="#a8a090" />
        <rect x={-300} y={roof - 300} width={200} height={260} fill="#9a9284" />
        <rect x={-260} y={roof - 250} width={80} height={210} fill="#e8d8b0" />
        <Character who="vika" x={180} y={roof} size={1.05} facing={1} frame={f} pose={{blink: blink(f, 5), brow: 1, lookUp: 0.3, rim: 0.4}} />
        <Character who="palych" x={600} y={roof} size={1.1} facing={1} frame={f} pose={{blink: blink(f, 7), brow: 1, lookUp: 0.2, rim: 0.4}} />
        {!lost ? (
          <Carry f={f} x={380} y={roof} facing={1} size={1.1} run={false} />
        ) : (
          <Character who="mark" x={380} y={roof} size={1.1} facing={1} frame={f} pose={{armF: [70, -60], armB: [60, -60], blink: f >= EM ? 1 : 0.4, brow: 1, lookUp: f >= EM ? -0.8 : 0, look: 0.2}} />
        )}
        {spray > 0 && Array.from({length: 50}).map((_, i) => {
          const p = ((f / 25 + rand(i)) % 1);
          return <circle key={i} cx={rand(i + 3) * 1300 - 400 + p * 200} cy={roof - p * 500 + p * p * 400} r={4 + rand(i + 5) * 10} fill={D.foam} opacity={spray * (1 - p) * 0.8} />;
        })}
      </g>
    </SVG>
      {f >= HZ && f < R + 10 && <Chip x={540} y={330} text="ГОРИЗОНТ ПОДНИМАЕТСЯ" kind="red" t={ramp(f, HZ + 6, HZ + 16)} tilt={-2} size={32} />}
    </>
  );
};

/* ───────── снаружи: волна накрывает пляж и гостиницу ───────── */
const WaveShot: React.FC<{f: number}> = ({f}) => {
  const HI = mk('hit');
  const FL = mk('flood');
  const wall = 1 + ramp(f, HI, HI + 40) * 0.35;
  const level = interpolate(f, [HI + 20, FL + 40], [LAND + 100, LAND - 3.6 * G.fl], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cam = camera(f, [[HI, 600, 1100, 0.7], [FL, 0, 1000, 0.8], [mk('shake'), -200, 900, 0.9]]);
  return (
    <SVG>
      <g transform={`${shakeXY(f, 6 * Math.exp(-(f - HI) / 40))} ${cam}`}>
        <CoastSky k={0.85} />
        <Hotel f={f} />
        <Promenade f={f} x={0} y={LAND} />
        <Beach f={f} recede={0} wall={Math.min(1, wall)} horizon={1000} />
        {f >= HI + 20 && <Flood f={f} level={level} drift={2} x0={-2000} x1={3000} />}
        {f >= FL && [-480, -400, -320].map((x, i) => <circle key={i} cx={x} cy={roofY(5) + LIFT - 30} r={10} fill="#1a1e26" />)}
      </g>
    </SVG>
  );
};

/* ───────── кепка в воде ───────── */
const CapFloat: React.FC<{f: number}> = ({f}) => {
  const CF = mk('cap_float');
  const cam = camera(f, [[CF, 540, 1000, 1.2], [mk('title'), 560, 1020, 1.6]]);
  return (
    <SVG>
      <g transform={cam}>
        <rect x={-1000} y={-1000} width={3000} height={4000} fill="#26332c" />
        <Flood f={f} level={700} drift={0.4} />
        <Cap x={560 + Math.sin(f / 20) * 20} y={1010 + Math.sin(f / 9) * 6} s={2.2} kind="yellow" rot={Math.sin(f / 14) * 12} />
      </g>
      <rect width={1080} height={1920} fill="url(#capVig)" />
      <defs>
        <radialGradient id="capVig" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0.5" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.8} />
        </radialGradient>
      </defs>
    </SVG>
  );
};

/* ───────── сцена целиком ───────── */
export const SceneDm1: React.FC<{f: number}> = ({f}) => {
  const GR = mk('grab');
  const RC = mk('reception');
  const ST = mk('stairs');
  const RO = mk('roof');
  const HI = mk('hit');
  const SHK = mk('shake');
  const CF = mk('cap_float');
  const TITLE = mk('title');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f < GR && <BeachShot f={f} />}
      {f >= GR && f < RC && <RunShot f={f} />}
      {f >= RC && f < ST && <Lobby f={f} />}
      {f >= ST && f < RO && <StairsUp f={f} />}
      {f >= RO && f < HI && <RoofShot f={f} />}
      {f >= HI && f < SHK && <WaveShot f={f} />}
      {f >= SHK && f < CF && <RoofShot f={f} />}
      {f >= CF && f < TITLE && <CapFloat f={f} />}
      {f >= TITLE && <AbsoluteFill style={{background: C.void}}><DmCard f={f} start={TITLE} ep={1} teaser="ГДЕ МИША?" /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
