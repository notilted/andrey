import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Character} from '../components/Character';
import {Beach, Building, CoastSky, D, DmCard, Flood, G, Raft, roofY, SirenSign} from '../components/Dm';
import {Chip} from '../components/Overlay';
import {C} from '../theme';
import {mk} from '../timelineDm2';
import {blink, ramp} from '../util';
import {camera, ease01, SVG} from './twkit';

/** Таймер до второй волны (секунды). */
export const timerDm2 = (f: number) => {
  const k: [number, number][] = [[mk('forty'), 2400], [mk('tower'), 2330], [mk('raft'), 2200], [mk('paddle'), 1500], [mk('sign'), 1100], [mk('close'), 700], [mk('pull'), 560], [mk('recede2'), 120]];
  if (f < k[0][0]) return 2400;
  return interpolate(f, k.map((x) => x[0]), k.map((x) => x[1]), {extrapolateRight: 'clamp'});
};

/** Затопленный квартал: гостиница слева, девятиэтажка справа, море за ними. */
export const HOTEL = {x: 100, w: 420, floors: 5};
export const TOWER = {x: 900, w: 520, floors: 9};
export const ROOF = roofY(HOTEL.floors);
export const SILL = roofY(TOWER.floors) + 3 * G.fl + 122; // подоконник 6-го этажа
export const WIN_X = TOWER.x + 30;

export const FloodWorld: React.FC<{f: number; level: number; drift?: number; seaRecede?: number; wall?: number; k?: number; night?: number; dawn?: number; children?: React.ReactNode}> = ({f, level, drift = 0.3, seaRecede = 0, wall = 0, k = 0.8, night = 0, dawn = 0, children}) => (
  <g>
    <CoastSky k={k} night={night} dawn={dawn} />
    <g transform="translate(0 -560)"><Beach f={f} recede={seaRecede} wall={wall} horizon={1000} sand={false} /></g>
    <Building f={f} x={-700} w={500} floors={7} color="#8a909a" />
    <Building f={f} x={HOTEL.x} w={HOTEL.w} floors={HOTEL.floors} color="#d8cfbf" />
    <Building f={f} x={TOWER.x} w={TOWER.w} floors={TOWER.floors} color="#9aa0a8" ladder={6} />
    {/* крыша гостиницы — площадка */}
    <rect x={HOTEL.x - 10} y={ROOF - 26} width={HOTEL.w + 20} height={26} fill="#a8a090" />
    {children}
    <Flood f={f} level={level} drift={drift} x0={-1500} x1={3000} />
    {/* провода над водой */}
    <path d={`M${HOTEL.x + HOTEL.w} ${ROOF + 140} Q${(HOTEL.x + HOTEL.w + TOWER.x) / 2} ${ROOF + 260} ${TOWER.x} ${ROOF + 160}`} stroke="#111" strokeWidth={3} fill="none" />
  </g>
);

/* ───────── всё на крыше и на воде ───────── */
const Main: React.FC<{f: number}> = ({f}) => {
  const PS = mk('palych_says');
  const SHO = mk('shout');
  const VO = mk('voice');
  const MI = mk('misha');
  const VI = mk('vika');
  const GA = mk('gap');
  const FO = mk('forty');
  const TO = mk('tower');
  const RA = mk('raft');
  const RD = mk('raft_done');
  const PA = mk('paddle');
  const VP = mk('vika_pale');
  const CL = mk('close');
  const PU = mk('pull');
  const level = interpolate(f, [0, GA, PU, PU + 120], [1230, 1450, 1460, 1640], {extrapolateRight: 'clamp'});
  const drift = f < GA ? -1.5 : f < PU ? 0.2 : 3;
  // плот: на крыше → на воде → к дому → течение уносит
  const onWater = f >= RD + 20;
  const raftX = !onWater ? 300 : interpolate(f, [RD + 20, CL, PU, PU + 150], [560, 820, 820, 1200], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const raftY = onWater ? level - 4 : ROOF - 8;
  const onRaft = f >= RD + 10;
  const heroX = onRaft ? raftX - 40 : 330;
  const palX = onRaft ? raftX + 70 : 450;
  const sz = 0.42;
  const reach = f >= CL ? ease01(f, CL, CL + 20) : 0;
  const cam = camera(f, [
    [0, 700, 1150, 0.7], [PS, 460, 1030, 2.4], [SHO - 1, 460, 1030, 2.4], [SHO, 350, 1030, 2.6], [VO, 350, 1030, 2.6], [VO + 30, 960, 1010, 2.6],
    [MI, 960, 1010, 3.0], [VI, 975, 1020, 3.4], [GA - 1, 975, 1020, 3.4], [GA, 700, 1150, 0.95], [FO - 1, 700, 1150, 0.95], [FO, 460, 1030, 2.4],
    [TO - 1, 460, 1030, 2.4], [TO, 1100, 1050, 1.3], [TO + 90, 1100, 560, 1.2], [RA - 1, 1100, 560, 1.2], [RA, 360, 1060, 2.0], [RD + 20, 520, 1250, 1.6],
    [PA, 640, 1300, 1.7], [VP - 1, 760, 1300, 1.6], [VP, 975, 1020, 3.4], [CL - 1, 975, 1020, 3.4], [CL, 880, 1250, 1.8], [PU + 20, 950, 1280, 1.5], [mk('recede2'), 1100, 1300, 1.2],
  ]);
  return (
    <SVG>
      <g transform={cam}>
        <FloodWorld f={f} level={level} drift={drift}>
          {/* Миша и Вика на подоконнике 6-го этажа */}
          <rect x={WIN_X - 6} y={SILL} width={80} height={10} fill="#5a5f68" />
          <Character who="vika" x={WIN_X + 46} y={SILL} size={sz} facing={-1} frame={f} pose={{armF: [70, -30], blink: blink(f, 5), brow: f >= VP ? 1 : 0.7, look: 0.4, mouth: f >= VP && f < CL ? 0.2 : 0}} />
          <Character who="mark" x={WIN_X + 22} y={SILL} size={sz * 0.62 / 1} facing={-1} frame={f} override={{scale: 1, headScale: 1.26, torso: 116, width: 66, top: '#4f8fbf', topShade: '#3d7099', skin: '#d6a88a', skinShade: '#b0846c', hair: '#6a4a30'}}
            pose={{armF: reach > 0 ? [90 + reach * 60, -10] : f >= VO && f < MI + 40 ? [150, -20] : [20, -10], blink: blink(f, 4), brow: 1, mouth: f >= VO && f < MI ? 0.5 + 0.3 * Math.sin(f / 3) : 0, look: 0.3}} />
          {!onWater && f >= RA && <Raft x={raftX} y={raftY} f={f} s={0.7} />}
          {!onRaft && (
            <g>
              <Character who="mark" x={heroX} y={ROOF} size={sz} facing={1} frame={f}
                pose={{armF: f >= SHO && f < VO ? [150, -10] : f >= RA ? [50, -40] : [10, -14], lean: f >= RA ? 25 : 0, blink: blink(f, 1), brow: 1, mouth: f >= SHO && f < VO + 20 ? 0.6 + 0.3 * Math.sin(f / 2.5) : 0, look: 0.4}} />
              <Character who="palych" x={palX} y={ROOF} size={sz * 1.02} facing={1} frame={f} pose={{blink: blink(f, 7), brow: 0.8, lookUp: 0.1, look: 0.6, lean: f >= RA ? 25 : 0}} />
            </g>
          )}
        </FloodWorld>
        {onWater && (
          <g>
            <Raft x={raftX} y={raftY} f={f} s={0.7} />
            <Character who="mark" x={heroX} y={raftY - 8} size={sz} facing={1} frame={f}
              pose={{sit: f < CL ? 0.5 : 0, armF: reach > 0 ? [100 + reach * 40, -10] : [60, -40], blink: blink(f, 1), brow: 1, look: 0.4, lookUp: f >= CL ? 0.5 : 0}} />
            <Character who="palych" x={palX} y={raftY - 8} size={sz * 1.02} facing={1} frame={f} pose={{sit: 0.4, armF: [60 + Math.sin(f / 8) * 30, -30], blink: blink(f, 7), brow: 0.6, look: 0.5}} />
            <rect x={palX + 10} y={raftY - 120} width={8} height={130} fill="#6a5a46" transform={`rotate(${20 + Math.sin(f / 8) * 20} ${palX + 14} ${raftY - 60})`} />
          </g>
        )}
      </g>
    </SVG>
  );
};

/* ───────── воспоминание Палыча: 1952 ───────── */
const Flashback: React.FC<{f: number}> = ({f}) => {
  const FB = mk('flashback');
  const MA = mk('mama');
  const run = (f - FB) * 3;
  const cam = camera(f, [[FB, 540, 1150, 1.0], [MA, 820, 1150, 1.6], [mk('sign'), 860, 1140, 1.8]]);
  return (
    <SVG>
      <defs>
        <filter id="sep52"><feColorMatrix type="matrix" values="0.45 0.7 0.18 0 0.02  0.38 0.62 0.16 0 0.01  0.28 0.48 0.12 0 0  0 0 0 1 0" /></filter>
        <radialGradient id="vig52" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0.45" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.85} />
        </radialGradient>
      </defs>
      <g filter="url(#sep52)" transform={cam}>
        <CoastSky k={0.3} />
        <Beach f={f} recede={0.85} horizon={1000} />
        <Character who="mark" x={460 - run} y={1300} size={0.85} facing={-1} frame={f} override={{scale: 0.62, headScale: 1.26, torso: 116, width: 66, top: '#6a6a5a', topShade: '#5a5a4a', hair: '#3a2a20'}}
          pose={{step: f / 2.2, brow: 1, blink: blink(f, 2)}} />
        <Character who="alisa" x={880} y={1140} size={0.75} facing={1} frame={f} override={{scale: 0.92, headScale: 1.0, torso: 128, width: 76, top: '#5a4a5a', topShade: '#4a3a4a'}}
          pose={{lookUp: 0.2, blink: blink(f, 8), armF: [10, -14]}} opacity={1 - ramp(f, MA + 30, mk('sign') - 5) * 0.7} />
      </g>
      <rect width={1080} height={1920} fill="url(#vig52)" />
      <text x={540} y={260} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={44} fill="#e8dcc0" opacity={0.85}>СЕВЕРО-КУРИЛЬСК · 1952</text>
    </SVG>
  );
};

/* ───────── табличка в воде ───────── */
const SignFloat: React.FC<{f: number}> = ({f}) => (
  <SVG>
    <g transform={`translate(540 980) scale(${1.6 + (f - mk('sign')) / 600}) translate(-540 -980)`}>
      <rect x={-1000} y={-1000} width={3000} height={4000} fill="#26332c" />
      <Flood f={f} level={700} drift={0.3} />
      <SirenSign x={540} y={1000 + Math.sin(f / 10) * 6} s={1.6} rot={-8 + Math.sin(f / 16) * 4} />
    </g>
  </SVG>
);

/* ───────── море уходит снова ───────── */
const Recede2: React.FC<{f: number}> = ({f}) => {
  const R2 = mk('recede2');
  return (
    <SVG>
      <g transform={`translate(540 860) scale(1.15) translate(-700 ${-1080})`}>
        <CoastSky k={0.9} />
        <Beach f={f} recede={interpolate(f, [R2 - 20, mk('title')], [0, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} horizon={800} />
        <rect x={-1000} y={1300} width={3000} height={800} fill={D.flood} />
      </g>
    </SVG>
  );
};

/* ───────── сцена целиком ───────── */
export const SceneDm2: React.FC<{f: number}> = ({f}) => {
  const VI = mk('vika');
  const GA = mk('gap');
  const FO = mk('forty');
  const FB = mk('flashback');
  const SI = mk('sign');
  const VP = mk('vika_pale');
  const R2 = mk('recede2');
  const TITLE = mk('title');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {(f < FB || (f >= VP && f < R2)) && <Main f={f} />}
      {f >= FB && f < SI && <Flashback f={f} />}
      {f >= SI && f < VP && <SignFloat f={f} />}
      {f >= R2 && f < TITLE && <Recede2 f={f} />}
      {f >= VI && f < GA && <Chip x={540} y={330} text="ВИКА, 16 ЛЕТ" kind="white" t={ramp(f, VI + 6, VI + 16)} tilt={-2} size={34} />}
      {f >= GA && f < FO && <Chip x={540} y={330} text="20 МЕТРОВ ВОДЫ" kind="yellow" t={ramp(f, GA + 10, GA + 20)} tilt={2} size={34} />}
      {f >= SI + 20 && f < VP && <Chip x={540} y={330} text="ХОЗЯИН ОТКЛЮЧИЛ СИРЕНУ" kind="red" t={ramp(f, VP - 70, VP - 58)} tilt={-2} size={30} />}
      {f >= TITLE && <AbsoluteFill style={{background: C.void}}><DmCard f={f} start={TITLE} ep={2} teaser="МОРЕ СНОВА УХОДИТ" /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
