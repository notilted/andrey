import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Character} from '../components/Character';
import {FarSkyline} from '../components/City';
import {Chip} from '../components/Overlay';
import {PhoneFrame} from '../components/Phone';
import {EXTRAS, SH, ShelterBack, ShelterLight} from '../components/Shelter';
import {Cat, Crate, Crater, Fire, fmtH, OrangeSky, RuinedBlock, Smoke, T, WaveAlertScreen, WaveCard} from '../components/Tw';
import {AbandonedCar, BigTimer, Clipboard, DEPOT, Depot, DoorMechCloseup, MapScreen, Rifle, RuinStreet, SchoolRemnant, Torch} from '../components/Tw2';
import {C} from '../theme';
import {mk} from '../timelineTw2';
import {blink, ramp, rand} from '../util';
import {camera, ease01, shakeXY, SVG} from './twkit';

/** Таймер второй волны, секунды: 12:00:00 → 0 с монтажными скачками. */
export const timerTw2 = (f: number) => {
  const k: [number, number][] = [[mk('h_timer'), 43200], [mk('map'), 43150], [mk('walk'), 42600], [mk('school'), 39600], [mk('map_red'), 39400], [mk('galya_sit'), 38000], [mk('km8'), 28800],
    [mk('shoulders'), 27500], [mk('galya_limp'), 16000], [mk('depot'), 3600], [mk('list'), 3300], [mk('let_in'), 2400], [mk('roar2'), 20], [mk('hit2'), 0]];
  if (f < k[0][0]) return 43200;
  return interpolate(f, k.map((x) => x[0]), k.map((x) => x[1]), {extrapolateRight: 'clamp'});
};

const GUARD = {top: '#3d4a3a', topShade: '#2f3a2c', bottom: '#2a3328', hair: '#1a1612', skin: '#c8987c', skinShade: '#a37a64'};
const GY = 1500;

/** Наша четвёрка + кот. carry — Соня на плечах у Евгения. */
const Group: React.FC<{f: number; gx: number; walking: boolean; carry?: number; limp?: boolean; smile?: number; rim?: string}> = ({f, gx, walking, carry = 0, limp = false, smile = 0, rim = T.fire}) => {
  const st = (ph: number, k = 2.8) => (walking ? (f + ph) / k : 0);
  const bob = limp && walking ? Math.abs(Math.sin(f / 5)) * 6 : 0;
  const evX = gx + 260;
  return (
    <g>
      <Cat x={gx - 180} y={GY} f={f} s={0.6} run={walking} />
      <Character who="galina" x={gx - 90} y={GY + bob} size={0.95} facing={1} frame={f}
        pose={{step: limp ? st(3, 3.6) : st(3), lean: limp ? 10 : 0, blink: blink(f, 9), brow: 0.8, look: 0.3, smile: limp ? 0.5 : 0, rimColor: rim, rim: 0.9}} />
      {carry < 0.5 && (
        <Character who="sonya" x={gx + 30} y={GY} size={0.95} facing={1} frame={f}
          pose={{step: st(6, 2.4), armF: [-60, -10], blink: blink(f, 4), brow: 0.7, lookUp: 0.3, rimColor: rim, rim: 0.9}} />
      )}
      <Character who="mark" x={gx + 120} y={GY} size={1.0} facing={1} frame={f}
        pose={{step: st(0), armB: carry < 0.5 ? [-40, -10] : [-10, -10], blink: blink(f, 1), brow: 0.7, look: 0.3, rimColor: rim, rim: 0.9}} />
      <Character who="evgeny" x={evX} y={GY} size={1.0} facing={1} frame={f}
        pose={{step: st(2, 3), armF: carry > 0.5 ? [160, -20] : [10, -14], armB: carry > 0.5 ? [-170, 20] : [-8, -14], blink: blink(f, 3), brow: 0.2, smile, look: 0.4, rimColor: rim, rim: 0.9}} />
      {carry > 0.5 && (
        <Character who="sonya" x={evX + 6} y={GY - 262} size={0.95} facing={1} frame={f}
          pose={{sit: 1, armF: [150, -30], armB: [-150, 30], blink: blink(f, 4), brow: 0.2, smile: 0.4, look: 0.4, rimColor: rim, rim: 0.9}} />
      )}
    </g>
  );
};

/* ───────── зацеп: руины и таймер ───────── */
const Hook: React.FC<{f: number}> = ({f}) => {
  const FAM = mk('h_family');
  const cam = camera(f, [[0, 540, 1000, 0.9], [FAM, 540, 1100, 1.0], [FAM + 40, 520, 1330, 1.7], [mk('map'), 520, 1330, 1.8]]);
  return (
    <SVG>
      <g transform={cam}>
        <OrangeSky k={1} h={1500} />
        <Smoke x={900} y={1450} f={f + 200} scale={1.6} seed={3} />
        <FarSkyline f={f} base={1330} />
        <RuinedBlock f={f} x={80} base={1450} seed={2} />
        <rect x={-800} y={1440} width={2800} height={1200} fill="#141012" />
        <Crater x={980} y={1520} f={f} w={760} />
        <g transform="translate(260 0)"><Group f={f} gx={0} walking={false} /></g>
      </g>
    </SVG>
  );
};

/* ───────── дорога ───────── */
const Walk: React.FC<{f: number; from: number; to: number; x0: number; dusk: number; carry?: number; limp?: number; smile?: number}> = ({f, from, to, x0, dusk, carry = 0, limp = -1, smile = 0}) => {
  const gx = x0 + (f - from) * 4;
  const limping = limp >= 0 && f >= limp;
  const cam = limping
    ? `translate(540 860) scale(1.9) translate(${-(gx - 60)} ${-1320})`
    : `translate(540 860) scale(1.15) translate(${-(gx + 160)} ${-1260})`;
  return (
    <SVG>
      <g transform={cam}>
        <g transform={`translate(${(gx + 160) * 0.6} 0)`}>
          <OrangeSky k={1 - dusk * 0.5} h={1500} />
          <Smoke x={600} y={1400} f={f} scale={2} seed={11} opacity={0.7} />
          <FarSkyline f={f} base={1300} />
        </g>
        <RuinStreet f={f} dusk={dusk} />
        {[[1060, 1650, '#2f3644', false], [1520, 1610, '#3a3040', true], [2700, 1650, '#2a3a40', false], [3400, 1620, '#40362f', true]].map(([x, y, c, fl], i) => (
          <AbandonedCar key={i} x={x as number} y={y as number} s={1} col={c as string} flip={fl as boolean} />
        ))}
        <Fire x={1800} y={1430} f={f} w={70} />
        <Fire x={3000} y={1430} f={f + 30} w={60} seed={2} />
        <Group f={f} gx={gx} walking={f < to} carry={carry} limp={limping} smile={smile} rim={dusk > 0.5 ? '#7fa6e8' : T.fire} />
      </g>
    </SVG>
  );
};

/* ───────── школа, которой нет ───────── */
const School: React.FC<{f: number}> = ({f}) => {
  const S = mk('school');
  const NO = mk('no_school');
  const GS = mk('galya_sit');
  const EV = mk('evgeny_says');
  const ID = mk('bunker_idea');
  const KM = mk('km8');
  const sit = ease01(f, GS + 4, GS + 24);
  const cam = camera(f, [[S, 330, 1300, 1.7], [NO, 360, 1290, 1.6], [NO + 40, 640, 1150, 0.85], [mk('map_red'), 640, 1150, 0.85], [GS - 1, 300, 1330, 1.6], [GS + 30, 260, 1340, 1.8], [EV - 1, 260, 1340, 1.8], [EV + 20, 440, 1280, 2.0], [KM, 440, 1280, 2.1]]);
  return (
    <SVG>
      <g transform={cam}>
        <OrangeSky k={1} h={1500} />
        <Smoke x={760} y={1500} f={f} scale={2.2} seed={5} />
        <FarSkyline f={f} base={1330} />
        <rect x={-800} y={1440} width={2800} height={1200} fill="#141012" />
        <Crater x={820} y={1560} f={f} w={1100} />
        <SchoolRemnant x={620} y={1500} />
        <Crate x={-80} y={GY} w={160} h={60} />
        <Cat x={0} y={GY} f={f} s={0.6} facing={-1} />
        <Character who="galina" x={-90} y={GY - sit * 30} size={0.95} facing={1} frame={f}
          pose={{sit, lean: sit * 18, headTilt: sit * 10, blink: blink(f, 9), brow: 1, look: 0.2, lookUp: sit ? -0.5 : 0.3, rimColor: T.fire, rim: 0.9}} />
        <Character who="sonya" x={160} y={GY} size={0.95} facing={1} frame={f} pose={{armF: [-60, -10], blink: blink(f, 4), brow: 1, lookUp: 0.3, rimColor: T.fire, rim: 0.9}} />
        <Character who="mark" x={250} y={GY} size={1.0} facing={1} frame={f} pose={{armB: [-40, -10], blink: blink(f, 1), brow: 1, look: 0.4, rimColor: T.fire, rim: 0.9}} />
        <Character who="evgeny" x={420} y={GY} size={1.0} facing={f >= EV ? -1 : 1} frame={f}
          pose={{blink: blink(f, 3), brow: f >= EV ? 0.5 : 0.2, look: 0.3, armF: f >= ID ? [70, -60] : [10, -14], rimColor: T.fire, rim: 0.9}} />
      </g>
    </SVG>
  );
};

/* ───────── депо и охрана ───────── */
const DepotShot: React.FC<{f: number}> = ({f}) => {
  const D = mk('depot');
  const G = mk('guard');
  const L = mk('list');
  const NO = mk('no_you');
  const ST = mk('stare');
  const AS = mk('aside');
  const IN = mk('let_in');
  const arrive = ease01(f, D, D + 70);
  const gx = 260 + arrive * 360;
  const aside = ease01(f, AS + 10, AS + 50) * (1 - ease01(f, IN - 30, IN));
  const enter = ease01(f, IN + 10, IN + 70);
  const guardX = DEPOT.bunker - 10 + aside * 260;
  const evX = gx + 260 + aside * 200 + enter * 260;
  const cam = camera(f, [[D, 640, 1150, 0.82], [G - 1, 700, 1180, 0.9], [G + 30, 1000, 1280, 1.5], [L, 1050, 1260, 2.3], [ST - 1, 1050, 1260, 2.3], [ST + 16, 900, 1250, 2.2], [AS + 30, 1100, 1250, 1.4], [IN, 1000, 1250, 1.2], [IN + 60, 1060, 1250, 1.4]]);
  return (
    <SVG>
      <g transform={cam}>
        <OrangeSky k={0.55} h={1400} />
        <rect x={-2000} y={-1000} width={5000} height={2400} fill="#0a0c18" opacity={0.4} />
        <Depot f={f} />
        {/* очередь у бункера */}
        {EXTRAS.map((e, i) => (
          <Character key={i} who="mark" hair={e.style} x={DEPOT.bunker + 190 + i * 72} y={GY - 20 - (i % 2) * 14} size={0.85 * e.scale} facing={-1} frame={f + i * 9}
            override={{top: e.top, topShade: e.top, hair: e.hair, bottom: '#202329'}} pose={{blink: blink(f, i + 20), rim: 0.3, rimColor: C.redHot, brow: 0.8, lookUp: 0.2}} opacity={1 - enter * 0.0} />
        ))}
        <Character who="mark" x={guardX} y={GY} size={1.0} facing={aside > 0.05 && aside < 0.95 ? 1 : -1} frame={f} override={GUARD}
          pose={{step: aside > 0.05 && aside < 0.95 ? f / 3 : 0, armF: f >= L && f < ST ? [70, -60] : [40, -60], armB: [30, -50], blink: blink(f, 12), brow: f >= ST ? 0.8 : -0.3, look: 0.3, mouth: 0, rim: 0.5, rimColor: C.redHot}} />
        <Rifle x={guardX + 6} y={GY - 210} s={1.0} facing={-1} />
        {f >= L && f < AS && <Clipboard x={guardX - 70} y={GY - 230} s={1.1} />}
        <g opacity={1 - enter}>
          <Cat x={gx - 180 + enter * 500} y={GY} f={f} s={0.6} run={arrive < 1 || enter > 0} />
          <Character who="galina" x={gx - 90 + enter * 500} y={GY} size={0.95} facing={1} frame={f} pose={{step: arrive < 1 || enter > 0 ? f / 3.4 : 0, blink: blink(f, 9), brow: 1, look: 0.3, rimColor: C.redHot, rim: 0.6}} />
          <Character who="sonya" x={gx + 30 + enter * 500} y={GY} size={0.95} facing={1} frame={f} pose={{step: arrive < 1 || enter > 0 ? f / 2.4 : 0, armF: [-60, -10], blink: blink(f, 4), brow: 1, lookUp: 0.3, rimColor: C.redHot, rim: 0.6}} />
          <Character who="mark" x={gx + 120 + enter * 500} y={GY} size={1.0} facing={1} frame={f} pose={{step: arrive < 1 || enter > 0 ? f / 2.8 : 0, armB: [-40, -10], blink: blink(f, 1), brow: 1, look: 0.3, rimColor: C.redHot, rim: 0.6}} />
          <Character who="evgeny" x={evX} y={GY} size={1.0} facing={1} frame={f}
            pose={{step: arrive < 1 || (aside > 0.05 && aside < 0.95) || enter > 0 ? f / 3 : 0, blink: f >= ST && f < AS ? 1 : blink(f, 3), brow: f >= ST ? 1 : 0.3, look: 0.6, armF: aside > 0.3 && aside < 1 ? [60, -40] : [10, -14], rimColor: C.redHot, rim: 0.6}} />
        </g>
      </g>
      {f >= IN + 60 && <rect width={1080} height={1920} fill="#000" opacity={ramp(f, IN + 60, IN + 90)} />}
    </SVG>
  );
};

/* ───────── бункер: вторая волна, сорванная дверь ───────── */
const Bunker: React.FC<{f: number}> = ({f}) => {
  const R = mk('roar2');
  const H = mk('hit2');
  const DK = mk('dark');
  const TO = mk('torch');
  const PA = mk('pale');
  const fl = f - DK;
  const lamps = f < DK - 8 ? 1 : fl < 30 ? ([0.2, 1, 0, 0.6, 0, 0, 0.3, 0, 0][Math.floor((fl + 8) / 4)] ?? 0) : 0;
  const light: ShelterLight = {lamps, red: 0, monitor: 0};
  const shake = f < R ? 0 : f < H ? 2 + 6 * ramp(f, R, H) : 24 * Math.exp(-(f - H) / 24);
  const dark = f >= DK ? 0.82 * ramp(f, DK, DK + 30) : 0;
  const cam = camera(f, [[R, 380, 820, 1.0], [H, 380, 820, 1.05], [TO, 200, 820, 1.3], [PA - 1, 120, 830, 1.35], [PA + 12, 165, 770, 2.8], [mk('broken'), 165, 770, 2.9]]);
  return (
    <SVG>
      <g transform={`${shakeXY(f, shake)} ${cam}`}>
        <ShelterBack f={f} light={light} sign="ОБЪЕКТ ГО № 3" />
        {EXTRAS.map((e, i) => (
          <Character key={i} who="mark" hair={e.style} x={e.x + 200} y={SH.floor - 60} size={1.05 * e.scale} facing={e.facing} frame={f + i * 11}
            override={{top: e.top, topShade: e.top, hair: e.hair, bottom: '#202329'}} pose={{sit: 1, armF: [55, -95], armB: [-10, -10], lookUp: -0.4, blink: blink(f, i + 20), rim: 0.25, brow: 0.7}} />
        ))}
        <Cat x={470} y={SH.floor} f={f} s={0.8} />
        <Character who="galina" x={420} y={SH.floor} size={1.1} facing={-1} frame={f} pose={{blink: blink(f, 9), brow: 1, look: 0.3}} />
        <Character who="sonya" x={330} y={SH.floor} size={1.1} facing={-1} frame={f} pose={{blink: blink(f, 4), brow: 1, lookUp: 0.3}} />
        <Character who="mark" x={420 - 160} y={SH.floor} size={1.15} facing={-1} frame={f} pose={{blink: blink(f, 1), brow: 1, look: 0.3}} />
        <Character who="evgeny" x={160} y={SH.floor} size={1.15} facing={-1} frame={f}
          pose={{armF: f >= TO ? [80, -10] : [10, -14], blink: f >= PA ? 1 : blink(f, 3), brow: f >= PA ? 1 : 0.4, look: 0.5, lookUp: f >= PA ? -0.2 : 0}} />
        <rect x={-1200} y={-800} width={3600} height={3600} fill="#000" opacity={dark} />
        {f >= TO && <Torch x={0} y={805} ang={183} len={480} k={ramp(f, TO, TO + 6)} />}
        {f >= PA && (
          <g opacity={ramp(f, PA, PA + 8)}>
            <defs>
              <radialGradient id="faceLit">
                <stop offset="0" stopColor="#fff6d8" stopOpacity={0.22} />
                <stop offset="1" stopColor="#fff6d8" stopOpacity={0} />
              </radialGradient>
            </defs>
            <circle cx={165} cy={SH.floor - 360} r={160} fill="url(#faceLit)" />
            <g opacity={0.7}>
              <Character who="evgeny" x={160} y={SH.floor} size={1.15} facing={-1} frame={f} pose={{armF: [80, -10], blink: 1, brow: 1, look: 0.5, lookUp: -0.2, rim: 0}} />
            </g>
          </g>
        )}
        {f >= H && f < H + 60 && Array.from({length: 40}).map((_, i) => (
          <circle key={i} cx={rand(i) * 1500 - 250} cy={SH.ceil + ((f - H) * (3 + rand(i + 4) * 4)) % 800} r={2 + rand(i + 2) * 3} fill="#c9bfae" opacity={0.5} />
        ))}
      </g>
    </SVG>
  );
};

/* ───────── сцена целиком ───────── */
export const SceneTw2: React.FC<{f: number}> = ({f}) => {
  const MAP = mk('map');
  const WALK = mk('walk');
  const SCH = mk('school');
  const MR = mk('map_red');
  const GS = mk('galya_sit');
  const KM = mk('km8');
  const SH2 = mk('shoulders');
  const DEP = mk('depot');
  const R2 = mk('roar2');
  const BR = mk('broken');
  const A3 = mk('alert3');
  const TITLE = mk('title');
  const ID = mk('bunker_idea');
  const remain = timerTw2(f);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f < MAP && <Hook f={f} />}
      {f >= MAP && f < WALK && (
        <AbsoluteFill style={{background: '#0b0d12'}}>
          <PhoneFrame x={540} y={720} scale={0.95} tilt={-2} f={f} glow={C.warm} glowK={0.25}><MapScreen f={f} start={MAP} target="УБЕЖИЩЕ · ШКОЛА № 14" km="3,2 км" /></PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= WALK && f < SCH && <Walk f={f} from={WALK} to={SCH} x0={300} dusk={0} />}
      {f >= SCH && f < MR && <School f={f} />}
      {f >= MR && f < GS && (
        <AbsoluteFill style={{background: '#0b0d12'}}>
          <PhoneFrame x={540} y={720} scale={0.95} tilt={-2} f={f} glow={C.red} glowK={0.35}><MapScreen f={f + 40} start={MR} target="УБЕЖИЩЕ · ШКОЛА № 14" km="0 км" danger={ramp(f, MR + 10, MR + 40)} /></PhoneFrame>
          <Chip x={540} y={1240} text="ТОЧКА ПЕРВОГО УДАРА" kind="red" t={ramp(f, MR + 30, MR + 42)} tilt={-2} size={32} />
        </AbsoluteFill>
      )}
      {f >= GS && f < KM && <School f={f} />}
      {f >= ID && f < KM && <Chip x={540} y={330} text="ДЕПО · СОВЕТСКИЙ БУНКЕР" kind="yellow" t={ramp(f, ID + 20, ID + 32)} tilt={2} size={30} />}
      {f >= KM && f < SH2 && (
        <AbsoluteFill style={{background: '#0b0d12'}}>
          <PhoneFrame x={540} y={720} scale={0.95} tilt={2} f={f} glow={C.warm} glowK={0.25}><MapScreen f={f} start={KM} target="ТРАМВАЙНОЕ ДЕПО № 3" km="8 км" route="depot" /></PhoneFrame>
          <Chip x={540} y={1240} text="8 КМ · 8 ЧАСОВ" kind="yellow" t={ramp(f, KM + 20, KM + 32)} tilt={-2} size={34} />
        </AbsoluteFill>
      )}
      {f >= SH2 && f < DEP && <Walk f={f} from={SH2} to={DEP} x0={2100} dusk={ramp(f, SH2, SH2 + 120)} carry={1} limp={mk('galya_limp')} smile={ramp(f, mk('smile'), mk('smile') + 12)} />}
      {f >= DEP && f < R2 && <DepotShot f={f} />}
      {f >= R2 && f < BR && <Bunker f={f} />}
      {f >= BR && f < A3 && <DoorMechCloseup f={f} t={f - BR} />}
      {f >= A3 && f < TITLE && (
        <AbsoluteFill style={{background: '#050608'}}>
          <PhoneFrame x={540} y={720} scale={interpolate(f, [A3, TITLE], [0.92, 1.0])} tilt={-1} f={f} shake={f < A3 + 20 ? 0.6 : 0} glowK={0.45}>
            <WaveAlertScreen f={f} start={A3} wave={3} head="ВТОРАЯ ВОЛНА ПРОШЛА." time="15:31" remaining={48 * 3600 - Math.max(0, f - A3) / 30} note="ОСНОВНОЕ ТЕЛО" />
          </PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= TITLE && (
        <AbsoluteFill style={{background: C.void}}>
          <WaveCard f={f} start={TITLE} wave={2} next="ДО ТРЕТЬЕЙ ВОЛНЫ" remaining={48 * 3600 - 8 - (f - TITLE) / 30} />
        </AbsoluteFill>
      )}
      {f < MAP && <BigTimer text={fmtH(remain)} label="ВТОРАЯ ВОЛНА" k={ramp(f, 4, 14) * (1 - ramp(f, mk('h_family') + 20, mk('h_family') + 34))} />}
    </AbsoluteFill>
  );
};
