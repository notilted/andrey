import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Character} from '../components/Character';
import {FarSkyline, Sky} from '../components/City';
import {Chip} from '../components/Overlay';
import {PhoneFrame} from '../components/Phone';
import {Cat, Meteor, OrangeSky, Smoke, T} from '../components/Tw';
import {AbandonedCar, DEPOT, Depot} from '../components/Tw2';
import {KnitBunny, NoteCloseup} from '../components/Tw3';
import {CallScreen, Campfire, DawnSky, Field, Monolith, SeasonCard, SkyObject, TrajectoryScreen} from '../components/Tw4';
import {C} from '../theme';
import {mk} from '../timelineTw4';
import {blink, easeOut, ramp} from '../util';
import {camera, ease01, SVG} from './twkit';

const GUARD = {top: '#3d4a3a', topShade: '#2f3a2c', bottom: '#2a3328', hair: '#1a1612', skin: '#c8987c', skinShade: '#a37a64'};
const GY = 1500;

/* ───────── зацеп: метеорит тормозит ───────── */
const Hook: React.FC<{f: number}> = ({f}) => {
  const BR = mk('h_brake');
  const k = easeOut(Math.min(1, f / (BR + 24)));
  const tail = 1 - ramp(f, BR - 20, BR + 20);
  const s = interpolate(f, [0, mk('camp')], [1, 1.15]);
  return (
    <SVG>
      <g transform={`translate(540 900) scale(${s}) translate(-540 -900)`}>
        <Sky f={f} />
        <Meteor x0={-200} y0={-100} x1={620} y1={620} p={Math.min(1, k)} size={1.2} tailK={tail} />
        {f > BR && <circle cx={620} cy={620} r={40 + 10 * Math.sin(f / 6)} fill="#9fb8ff" opacity={0.15} />}
        <FarSkyline f={f} base={1350} />
        <rect x={-600} y={1350} width={2400} height={900} fill="#0b0d12" />
      </g>
    </SVG>
  );
};

/* ───────── лагерь в депо ───────── */
const Camp: React.FC<{f: number}> = ({f}) => {
  const CA = mk('camp');
  const DI = mk('dima');
  const SO = mk('sonya');
  const GA = mk('galya');
  const CT = mk('cat');
  const b = DEPOT.bunker;
  const fx = b - 420;
  const catRun = ease01(f, CT + 6, CT + 50);
  const cam = camera(f, [[CA, b - 300, 1180, 0.9], [DI - 1, b - 260, 1200, 0.95], [DI + 20, b + 60, 1300, 1.9], [SO - 1, b + 60, 1300, 1.9], [SO + 10, b - 230, 1320, 2.0], [GA - 1, b - 230, 1320, 2.0], [GA + 10, fx, 1340, 1.9], [CT + 50, fx + 60, 1360, 1.6]]);
  return (
    <SVG>
      <g transform={cam}>
        <OrangeSky k={0.45} h={1400} />
        <rect x={-2000} y={-1000} width={5000} height={2400} fill="#3a3a44" opacity={0.35} />
        <Smoke x={b - 900} y={1300} f={f} scale={1.6} seed={31} opacity={0.4} />
        <Depot f={f} />
        <Campfire x={fx} y={GY} f={f} cakes={f >= CT + 10 ? 2 : 3} />
        <Character who="galina" x={fx - 130} y={GY} size={0.95} facing={1} frame={f} pose={{armF: f >= GA ? [80, -40] : [20, -20], blink: blink(f, 9), brow: 0.2, smile: 0.4, look: 0.3, lookUp: -0.3, rimColor: T.fire, rim: 0.9}} />
        <Cat x={fx + 80 + catRun * 420} y={GY} f={f} s={0.6} run={catRun > 0 && catRun < 1} />
        {catRun > 0 && <ellipse cx={fx + 110 + catRun * 420} cy={GY - 30} rx={14} ry={5} fill="#d9b070" />}
        <Character who="sonya" x={b - 230} y={GY} size={0.95} facing={1} frame={f} pose={{armF: [60, -30], blink: blink(f, 4), brow: 0.2, smile: f >= CT ? 0.6 : 0.2, look: 0.3, rimColor: T.fire, rim: 0.9}} />
        <KnitBunny x={b - 186} y={GY - 112} s={0.8} />
        <Character who="mark" x={b - 340} y={GY} size={1.0} facing={1} frame={f} pose={{blink: blink(f, 1), brow: 0.4, look: 0.3, rimColor: T.fire, rim: 0.9}} />
        <Character who="mark" x={b + 60} y={GY} size={1.0} facing={-1} frame={f} override={GUARD} pose={{armF: [70, -70], blink: blink(f, 12), brow: 0.6, look: 0.5, lookUp: -0.5, rimColor: T.fire, rim: 0.6}} />
        <rect x={b + 10} y={GY - 252} width={34} height={42} rx={3} fill="#ece6d4" transform={`rotate(-10 ${b + 27} ${GY - 231})`} />
      </g>
    </SVG>
  );
};

/* ───────── ночь: Дима у телефона ───────── */
const Night: React.FC<{f: number}> = ({f}) => {
  const b = DEPOT.bunker;
  const DN = mk('dima_night');
  const cam = camera(f, [[DN, b + 20, 1280, 2.2], [mk('pass'), b + 40, 1240, 2.6]]);
  return (
    <SVG>
      <g transform={cam}>
        <Sky f={f} />
        <Depot f={f} />
        <rect x={-2000} y={-1000} width={5000} height={4000} fill="#05070e" opacity={0.6} />
        <Character who="mark" x={b + 60} y={GY} size={1.0} facing={-1} frame={f} override={GUARD} pose={{armF: [70, -80], blink: blink(f, 12), brow: 1, look: 0.4, lookUp: -0.4, rim: 0}} />
        <defs>
          <radialGradient id="phoneLit">
            <stop offset="0" stopColor="#bcd0ff" stopOpacity={0.35} />
            <stop offset="1" stopColor="#bcd0ff" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={b + 10} cy={GY - 280} r={170} fill="url(#phoneLit)" />
        <rect x={b + 2} y={GY - 252} width={22} height={38} rx={4} fill="#dfe8ff" transform={`rotate(-10 ${b + 13} ${GY - 233})`} />
      </g>
    </SVG>
  );
};

/* ───────── рассвет: объект садится ───────── */
const Dawn: React.FC<{f: number}> = ({f}) => {
  const PA = mk('pass');
  const LA = mk('land');
  const SI = mk('silence');
  const LE = mk('leave');
  const p = ease01(f, PA, LA + 40);
  const ox = interpolate(p, [0, 1], [-200, 820]);
  const oy = interpolate(p, [0, 1], [520, 1210]);
  const os = interpolate(p, [0, 1], [3.2, 1.0]);
  const cam = camera(f, [[PA, 540, 900, 1.0], [LA, 620, 1000, 1.05], [SI, 700, 1150, 1.25], [LE, 720, 1180, 1.35]]);
  return (
    <SVG>
      <g transform={cam}>
        <DawnSky />
        <Field f={f} />
        {f < LA + 40 ? <SkyObject x={ox} y={oy} s={os} f={f} /> : <Monolith cx={820} base={1252} w={70} h={96} f={f} />}
        <rect x={-2000} y={1180} width={5000} height={120} fill="#c9d4e8" opacity={0.08 + 0.06 * ramp(f, LA, SI)} />
        {[260, 330, 400].map((x, i) => (
          <Character key={i} who={i === 2 ? 'sonya' : i === 0 ? 'galina' : 'mark'} x={x} y={1560} size={i === 2 ? 0.8 : 0.85} facing={1} frame={f}
            pose={{lookUp: 0.6, blink: blink(f, i + 2), brow: 0.9, rim: 0.6, rimColor: '#e09a6a'}} />
        ))}
      </g>
    </SVG>
  );
};

/* ───────── отъезд: заяц для папы ───────── */
const Leave: React.FC<{f: number}> = ({f}) => {
  const LE = mk('leave');
  const BU = mk('bunny');
  const b = DEPOT.bunker;
  const give = ease01(f, BU + 20, BU + 50);
  const bx = interpolate(give, [0, 1], [b - 330, b - 400]);
  const by = interpolate(give, [0, 1], [GY - 112, GY - 200]);
  const cam = camera(f, [[LE, b - 200, 1250, 1.2], [BU, b - 330, 1300, 2.0], [mk('stone'), b - 360, 1290, 2.1]]);
  return (
    <SVG>
      <g transform={cam}>
        <DawnSky />
        <Depot f={f} />
        <rect x={-2000} y={-1000} width={5000} height={4000} fill="#1a1428" opacity={0.25} />
        <AbandonedCar x={b + 120} y={1640} col="#3a4038" />
        <Character who="mark" x={b + 20} y={GY} size={1.0} facing={1} frame={f} override={GUARD} pose={{blink: blink(f, 12), brow: 0.5, look: 0.3}} />
        <Character who="mark" x={b - 420} y={GY} size={1.0} facing={1} frame={f} pose={{sit: give * 0.35, armF: give > 0.5 ? [80, -40] : [10, -14], blink: blink(f, 1), brow: 0.5, look: 0.5, lookUp: -0.3}} />
        <Character who="sonya" x={b - 300} y={GY} size={0.95} facing={-1} frame={f} pose={{armF: f >= BU ? [80, -20] : [60, -30], blink: blink(f, 4), brow: 0.8, lookUp: 0.6, look: 0.4}} />
        <KnitBunny x={bx} y={by} s={0.8} />
      </g>
    </SVG>
  );
};

/* ───────── камень в поле ───────── */
const Stone: React.FC<{f: number}> = ({f}) => {
  const ST = mk('stone');
  const TO = mk('touch');
  const HU = mk('hum');
  const SL = mk('slit');
  const RI = mk('ring');
  const slit = ease01(f, SL + 10, SL + 70);
  const hum = ramp(f, HU, HU + 20);
  const reach = ease01(f, TO, TO + 24);
  const heroX = interpolate(ease01(f, ST, TO), [0, 1], [180, 300]);
  const touch: [number, number] = [358, 1250];
  const cam = camera(f, [[ST, 540, 1150, 0.85], [ST + 60, 540, 1050, 0.95], [TO, 360, 1250, 1.8], [HU + 30, 380, 1220, 1.6], [SL, 480, 1150, 1.05], [RI, 500, 1150, 1.0]]);
  const lit = slit > 0 ? '#eef3ff' : '#e09a6a';
  return (
    <SVG>
      <g transform={`translate(${hum * Math.sin(f * 2.3) * 1.5} 0) ${cam}`}>
        <DawnSky />
        <Field f={f} horizon={1050} />
        <Monolith cx={620} base={1530} w={560} h={820} f={f} slit={slit} hum={hum} touch={touch} />
        <Character who="mark" x={720 + 200} y={1560} size={1.0} facing={-1} frame={f} override={GUARD} pose={{blink: blink(f, 12), brow: 0.9, lookUp: 0.6, look: 0.4, rim: 0.8 + slit, rimColor: lit}} />
        <Character who="mark" x={heroX} y={1560} size={1.0} facing={1} frame={f}
          pose={{step: f > ST && f < TO ? f / 3 : 0, armF: [10 + reach * 80, -14 + reach * 4], blink: blink(f, 1), brow: 0.9, lookUp: 0.5, look: 0.4, rim: 0.8 + slit, rimColor: lit}} />
        <KnitBunny x={heroX - 34} y={1560 - 150} s={0.6} rot={10} />
      </g>
      {slit > 0 && <rect width={1080} height={1920} fill="#eef3ff" opacity={0.15 * slit} />}
    </SVG>
  );
};

/* ───────── сцена целиком ───────── */
export const SceneTw4: React.FC<{f: number}> = ({f}) => {
  const CA = mk('camp');
  const NO = mk('note');
  const SO = mk('sonya');
  const CAL = mk('calc');
  const SL = mk('slow');
  const DN = mk('dima_night');
  const PA = mk('pass');
  const LE = mk('leave');
  const ST = mk('stone');
  const RI = mk('ring');
  const CL = mk('call');
  const EV = mk('evgeny');
  const TITLE = mk('title');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f < CA && <Hook f={f} />}
      {f < CA && <Chip x={540} y={300} text="ОН ЗАТОРМОЗИЛ" kind="red" t={ramp(f, mk('h_brake') + 10, mk('h_brake') + 22)} tilt={-2} size={40} />}
      {f >= CA && f < CAL && <Camp f={f} />}
      {f >= NO && f < SO && <AbsoluteFill style={{opacity: 1 - ramp(f, SO - 5, SO)}}><NoteCloseup t={f - NO + 30} open lines={['Прости меня.', 'Я горжусь тобой.', 'Папа.']} /></AbsoluteFill>}
      {f >= CAL && f < DN && (
        <AbsoluteFill style={{background: '#06080d'}}>
          <PhoneFrame x={540} y={720} scale={0.95} tilt={-2} f={f} shake={f >= SL && f < SL + 20 ? 0.6 : 0} glow={f >= SL ? C.red : '#7fa6e8'} glowK={0.3}>
            <TrajectoryScreen f={f} start={f >= SL ? SL : CAL} slow={f >= SL ? 1 : 0} />
          </PhoneFrame>
          {f < SL && <Chip x={540} y={1240} text="ТАЙМЕРА НЕТ" kind="white" t={ramp(f, CAL + 40, CAL + 52)} tilt={-2} size={32} />}
        </AbsoluteFill>
      )}
      {f >= DN && f < PA && <Night f={f} />}
      {f >= PA && f < LE && <Dawn f={f} />}
      {f >= LE && f < ST && <Leave f={f} />}
      {f >= ST && f < RI && <Stone f={f} />}
      {f >= RI && f < CL && (
        <AbsoluteFill style={{background: 'rgba(6,8,13,0.92)'}}>
          <PhoneFrame x={300} y={760} scale={0.62} tilt={-7} f={f} shake={0.8} glowK={0.3} glow="#3aa25a"><CallScreen f={f} start={RI} name="Евгений" /></PhoneFrame>
          <PhoneFrame x={790} y={790} scale={0.62} tilt={6} f={f + 7} shake={0.8} glowK={0.3} glow="#3aa25a"><CallScreen f={f} start={RI} name="Евгений" /></PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= CL && f < TITLE && (
        <AbsoluteFill style={{background: '#050608'}}>
          <PhoneFrame x={540} y={720} scale={interpolate(f, [CL, TITLE], [0.92, 1.0])} tilt={-1} f={f} shake={0.4} glow="#3aa25a" glowK={0.4}>
            <CallScreen f={f} start={CL} name="Евгений" hl={ramp(f, EV, EV + 8)} />
          </PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= TITLE && <AbsoluteFill style={{background: C.void}}><SeasonCard f={f} start={TITLE} episode={4} teaser="ВЗЯТЬ ТРУБКУ?" /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
