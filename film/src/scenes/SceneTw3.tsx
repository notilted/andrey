import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Character} from '../components/Character';
import {Chip} from '../components/Overlay';
import {PhoneFrame} from '../components/Phone';
import {EXTRAS, SH, ShelterBack, ShelterLight} from '../components/Shelter';
import {Cat, fmtH, OrangeSky, Smoke, T, WaveCard} from '../components/Tw';
import {BigTimer, DEPOT, Depot, Rifle} from '../components/Tw2';
import {DrawingFive, KnitBunny, Needles, NewObjectScreen, NoteCloseup, PhotoCloseup, Sparks} from '../components/Tw3';
import {C} from '../theme';
import {mk} from '../timelineTw3';
import {blink, ramp} from '../util';
import {camera, ease01, shakeXY, SVG} from './twkit';

/** Таймер третьей волны, секунды: 48:00:00 → 0. */
export const timerTw3 = (f: number) => {
  const k: [number, number][] = [[mk('h_door'), 172800], [mk('repair'), 172000], [mk('knit'), 140000], [mk('draw'), 120000], [mk('night'), 90000], [mk('guard_look'), 60000],
    [mk('hour'), 3600], [mk('step'), 3400], [mk('note'), 1500], [mk('close'), 600], [mk('impact3') + 24, 0]];
  if (f < k[0][0]) return 172800;
  return interpolate(f, k.map((x) => x[0]), k.map((x) => x[1]), {extrapolateRight: 'clamp'});
};

const GUARD = {top: '#3d4a3a', topShade: '#2f3a2c', bottom: '#2a3328', hair: '#1a1612', skin: '#c8987c', skinShade: '#a37a64'};
const FL = SH.floor;

/* ───────── бункер: всё, что внутри ───────── */
const Inside: React.FC<{f: number}> = ({f}) => {
  const HD = mk('h_door');
  const OO = mk('only_out');
  const RE = mk('repair');
  const KN = mk('knit');
  const NI = mk('night');
  const ST = mk('son_talk');
  const GL = mk('guard_look');
  const RZ = mk('realize');
  const HR = mk('hour');
  const MA = mk('manual');
  const STEP = mk('step');
  const PU = mk('push');
  const NO = mk('note');
  const BG = mk('bunny_give');
  const SM = mk('smile2');
  const CL = mk('close');
  const WH = mk('wheel');
  const STOP = mk('stop');
  const IM = mk('impact3');
  const night = f >= NI && f < HR;
  const light: ShelterLight = {lamps: night ? 0.35 : 1, red: f >= HR ? 0.6 : 0, monitor: 0};
  // дверь: приоткрыта (не закрывается) → Евгений выходит → закрывается снаружи
  const doorOpen = f < CL ? 0.08 : interpolate(f, [CL, CL + 20, WH - 4, WH + 10], [0.08, 0.3, 0.3, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wheel = interpolate(f, [WH + 10, STOP], [0, 160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) + (f > STOP - 8 && f < STOP ? Math.sin(f) * 3 : 0);
  // Евгений
  const evSit = night ? 1 : 0;
  const evX = f < CL ? (f >= PU && f < NO ? 230 : f >= HR ? 150 : night ? 120 : 110) : interpolate(f, [CL, CL + 20], [150, -60], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const evOn = f < CL + 20;
  const repairing = f >= RE && f < KN;
  // герой
  const heroX = night && f < HR ? 260 : f >= STEP && f < PU ? interpolate(f, [STEP, STEP + 20], [420, 270], {extrapolateRight: 'clamp'}) : f >= PU && f < NO ? interpolate(f, [PU, PU + 14], [270, 380], {extrapolateRight: 'clamp'}) : 420;
  const sonX = 520;
  const smile = f >= SM ? ease01(f, SM, SM + 14) * 0.9 : 0;
  const bunnyX = f < BG + 20 ? sonX + 40 : interpolate(f, [BG + 20, BG + 40], [sonX + 40, evX + 40], {extrapolateRight: 'clamp'});
  const shake = f < IM ? 0 : f < IM + 24 ? 3 + 4 * ramp(f, IM, IM + 24) : 30 * Math.exp(-(f - IM - 24) / 20);
  const cam = camera(f, [
    [HD, -10, 860, 1.7], [OO + 20, 40, 840, 1.45], [RE - 1, 40, 840, 1.45], [RE + 10, 40, 760, 2.0],
    [KN - 1, 40, 760, 2.0], [KN, 700, 900, 2.0], [mk('draw') - 1, 700, 900, 2.0],
    [NI, 200, 860, 1.6], [ST, 200, 860, 1.7], [GL - 1, 220, 860, 1.7], [GL, 1060, 860, 1.9], [RZ - 1, 1060, 860, 1.9], [RZ, 270, 760, 2.4],
    [HR, 300, 820, 1.05], [MA, 60, 820, 1.4], [STEP, 220, 820, 1.25], [PU + 30, 270, 820, 1.4],
    [BG, 380, 860, 1.6], [SM, 140, 740, 2.6], [CL - 1, 140, 740, 2.6], [CL + 10, 40, 820, 1.4], [WH + 20, -35, 860, 2.0], [IM, -35, 860, 2.1],
  ]);
  return (
    <SVG>
      <g transform={`${shakeXY(f, shake)} ${cam}`}>
        <ShelterBack f={f} light={light} sign="ОБЪЕКТ ГО № 3" doorOpen={doorOpen} doorWheel={wheel} />
        {EXTRAS.slice(0, 5).map((ex, i) => (
          <Character key={i} who="mark" hair={ex.style} x={[700, 820, 1190, 1290, 600][i]} y={FL - 60} size={1.0 * ex.scale} facing={i < 2 || i === 4 ? 1 : -1} frame={f + i * 11}
            override={{top: ex.top, topShade: ex.top, hair: ex.hair, bottom: '#202329'}} pose={{sit: 1, armF: [55, -95], armB: [-10, -10], lookUp: -0.4, blink: blink(f, i + 20), rim: 0.25, brow: 0.6}} />
        ))}
        {/* охранник — сын Евгения */}
        <Character who="mark" x={1060} y={FL - 60} size={1.05} facing={-1} frame={f} override={GUARD}
          pose={{sit: 1, armF: [60, -60], blink: f >= GL && f < HR ? 1 : blink(f, 12), brow: f >= GL ? 0.9 : 0.2, look: 0.5, rim: 0.3}} />
        <Rifle x={1090} y={FL - 150} s={0.9} facing={-1} />
        {/* баба Галя вяжет */}
        <Character who="galina" x={640} y={FL - 60} size={1.05} facing={-1} frame={f} pose={{sit: 1, armF: [70, -80], armB: [40, -70], headTilt: 12, lookUp: -0.6, blink: blink(f, 9), brow: 0.3, smile: 0.3}} />
        {f < HR && <Needles x={590} y={FL - 150} f={f} />}
        <KnitBunny x={600} y={FL - 112} s={0.9} k={f < KN ? 0 : Math.min(1, (f - KN) / 120)} />
        <Cat x={760} y={FL - 140} f={f} s={0.6} facing={-1} />
        {/* Соня */}
        <Character who="sonya" x={sonX} y={FL} size={1.1} facing={-1} frame={f}
          pose={{sit: f >= mk('draw') && f < HR ? 1 : 0, armF: f >= BG && f < BG + 30 ? [90, -10] : [20, -10], blink: blink(f, 4), brow: f >= HR ? 1 : 0.4, lookUp: 0.3, look: 0.4}} />
        {f >= BG - 10 && f < CL && <KnitBunny x={bunnyX} y={FL - 150} s={0.9} k={1} />}
        {/* герой */}
        <Character who="mark" x={heroX} y={FL} size={1.15} facing={-1} frame={f}
          pose={{sit: night && f < HR ? 1 : 0, step: (f > STEP && f < STEP + 20) || (f > PU && f < PU + 14) ? f / 2.6 : 0, blink: f >= RZ && f < RZ + 30 ? 1 : blink(f, 1), brow: f >= HR ? 1 : 0.5, look: f >= GL && f < HR ? 0.8 : 0.3}} />
        {/* Евгений */}
        {evOn && (
          <Character who="evgeny" x={evX} y={FL} size={1.15} facing={f >= CL ? -1 : 1} frame={f}
            pose={{sit: evSit, step: f >= CL ? f / 2.8 : 0, armF: repairing ? [-110 + Math.sin(f / 4) * 20, -40] : f >= PU && f < PU + 30 ? [100, -10] : f >= NO && f < NO + 50 ? [80, -20] : night ? [70, -90] : [10, -14],
              blink: blink(f, 3), brow: f >= SM ? -0.4 : 0.6, smile, look: 0.5, lookUp: night ? -0.5 : 0}} />
        )}
        {repairing && <Sparks x={40} y={FL - 230} f={f} />}
        {night && f < GL && <rect x={evX + 40} y={FL - 230} width={36} height={46} rx={3} fill="#e8e0cc" transform={`rotate(-14 ${evX + 58} ${FL - 207})`} />}
        {night && <rect x={-1200} y={-800} width={3600} height={3600} fill="#0a1228" opacity={0.35} />}
      </g>
      {f >= IM + 22 && f < IM + 30 && <rect width={1080} height={1920} fill="#fff6e8" opacity={1 - ramp(f, IM + 24, IM + 30)} />}
      {f >= IM + 28 && <rect width={1080} height={1920} fill="#000" />}
    </SVG>
  );
};

/* ───────── снаружи: через три дня ───────── */
const After: React.FC<{f: number}> = ({f}) => {
  const O = mk('out3');
  const BF = mk('bunny_found');
  const GN = mk('give_note');
  const NT = mk('note_text');
  const CS = mk('cry_son');
  const HA = mk('hand');
  const PO = mk('phone_on');
  const GY = 1500;
  const b = DEPOT.bunker;
  const out = ease01(f, O + 10, O + 80);
  const sonCry = f >= CS;
  const cam = camera(f, [[O, b - 80, 1200, 0.95], [BF - 1, b - 60, 1220, 1.05], [BF + 20, b - 20, 1440, 3.0], [GN - 1, b - 20, 1440, 3.0], [GN, b - 120, 1300, 1.7], [CS - 1, b - 120, 1300, 1.7], [CS + 10, b + 20, 1360, 2.3], [HA - 1, b + 20, 1360, 2.3], [HA, b - 300, 1260, 1.5], [PO, b - 300, 1300, 1.9]]);
  const guardX = sonCry ? b + 80 : b + 120;
  return (
    <SVG>
      <g transform={cam}>
        <OrangeSky k={1} h={1400} />
        <Smoke x={b - 600} y={1400} f={f} scale={2.2} seed={21} opacity={0.75} />
        <Smoke x={b + 700} y={1400} f={f + 90} scale={1.8} seed={22} opacity={0.7} />
        <Depot f={f} />
        <rect x={-2000} y={-1000} width={5000} height={2400} fill="#2a1410" opacity={0.35} />
        <KnitBunny x={b - 40} y={GY - 4} s={1.1} rot={-70} />
        <Character who="mark" x={guardX} y={GY} size={1.0} facing={-1} frame={f} override={GUARD}
          pose={{sit: sonCry ? 0.9 : 0, lean: sonCry ? 30 : 0, headTilt: sonCry ? 20 : 0, armF: f >= GN && f < CS ? [70, -40] : sonCry ? [80, -100] : [20, -10], blink: sonCry ? 0.1 : blink(f, 12), brow: 1, rimColor: T.fire, rim: 1}} />
        <g transform={`translate(${-(1 - out) * 140} 0)`} opacity={out}>
          <Cat x={b - 560} y={GY} f={f} s={0.6} />
          <Character who="galina" x={b - 480} y={GY} size={0.95} facing={1} frame={f} pose={{blink: blink(f, 9), brow: 1, lookUp: 0.6, rimColor: T.fire, rim: 1}} />
          <Character who="sonya" x={b - 350} y={GY} size={0.95} facing={1} frame={f} pose={{armF: f >= HA ? [-50, -10] : [10, -10], blink: blink(f, 4), brow: 1, lookUp: f >= HA ? 0.8 : 0.3, rimColor: T.fire, rim: 1}} />
          <Character who="mark" x={f >= GN && f < CS ? b - 60 : b - 250} y={GY} size={1.0} facing={1} frame={f}
            pose={{armF: f >= GN && f < CS ? [80, -20] : f >= PO ? [60, -80] : [10, -14], armB: f >= HA ? [-40, -10] : [-8, -14], blink: blink(f, 1), brow: 0.8, look: 0.3, lookUp: f >= PO ? -0.5 : 0.2, rimColor: T.fire, rim: 1}} />
        </g>
        
      </g>
    </SVG>
  );
};

/* ───────── сцена целиком ───────── */
export const SceneTw3: React.FC<{f: number}> = ({f}) => {
  const DR = mk('draw');
  const NI = mk('night');
  const PH = mk('photo');
  const ST = mk('son_talk');
  const RV = mk('son_reveal');
  const HR = mk('hour');
  const NO = mk('note');
  const BG = mk('bunny_give');
  const O3 = mk('out3');
  const NT = mk('note_text');
  const CS = mk('cry_son');
  const NEW = mk('new_obj');
  const TITLE = mk('title');
  const OO = mk('only_out');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f < O3 && <Inside f={f} />}
      {f >= O3 && f < NEW && <After f={f} />}
      {f >= DR && f < NI && <AbsoluteFill style={{opacity: ramp(f, DR, DR + 5) * (1 - ramp(f, NI - 5, NI))}}><DrawingFive t={f - DR} /></AbsoluteFill>}
      {f >= PH && f < ST && <AbsoluteFill style={{opacity: 1 - ramp(f, ST - 5, ST)}}><PhotoCloseup f={f} t={f - PH} /></AbsoluteFill>}
      {f >= RV && f < HR && (
        <AbsoluteFill style={{opacity: 1 - ramp(f, HR - 5, HR)}}>
          <PhotoCloseup f={f} t={f - RV} tilt={5} />
          <Chip x={540} y={1240} text="ЕГО СЫН" kind="red" t={ramp(f, RV + 16, RV + 28)} tilt={-2} size={40} />
        </AbsoluteFill>
      )}
      {f >= NO && f < BG && <AbsoluteFill style={{opacity: 1 - ramp(f, BG - 5, BG)}}><NoteCloseup t={f - NO} open={false} /></AbsoluteFill>}
      {f >= NT && f < CS && (
        <AbsoluteFill style={{opacity: 1 - ramp(f, CS - 5, CS)}}><NoteCloseup t={f - NT} open lines={['Прости меня.', 'Я горжусь тобой.', 'Папа.']} /></AbsoluteFill>
      )}
      {f >= NEW && f < TITLE && (
        <AbsoluteFill style={{background: '#050608'}}>
          <PhoneFrame x={540} y={720} scale={interpolate(f, [NEW, TITLE], [0.92, 1.0])} tilt={-1} f={f} shake={f < NEW + 20 ? 0.6 : 0} glowK={0.45}>
            <NewObjectScreen f={f} start={NEW} />
          </PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= TITLE && (
        <AbsoluteFill style={{background: C.void}}>
          <WaveCard f={f} start={TITLE} wave={3} next="ОБНАРУЖЕН НОВЫЙ ОБЪЕКТ" remaining={0} remainingText="??:??:??" />
        </AbsoluteFill>
      )}
      {f < mk('repair') && <BigTimer text={fmtH(timerTw3(f))} label="ТРЕТЬЯ ВОЛНА" k={ramp(f, 4, 14)} y={300} />}
      {f >= OO && f < mk('repair') && <Chip x={540} y={1180} text="ЗАКРЫТЬ МОЖНО ТОЛЬКО СНАРУЖИ" kind="red" t={ramp(f, OO + 20, OO + 32)} tilt={-2} size={30} />}
      {f >= HR && f < mk('manual') + 40 && <BigTimer text="01:00:00" label="ДО УДАРА" k={ramp(f, HR, HR + 8) * (1 - ramp(f, mk('manual') + 30, mk('manual') + 40))} y={300} />}
    </AbsoluteFill>
  );
};
