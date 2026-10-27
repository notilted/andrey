import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Character} from '../components/Character';
import {FarSkyline} from '../components/City';
import {PhoneFrame} from '../components/Phone';
import {SH, ShelterBack} from '../components/Shelter';
import {Cat, OrangeSky, T, Tear} from '../components/Tw';
import {DEPOT, Depot} from '../components/Tw2';
import {KnitBunny} from '../components/Tw3';
import {Campfire, DawnSky, Field, Monolith} from '../components/Tw4';
import {BlueSky, FinalCard, LetterScreen, StarSky, VoiceMessageScreen} from '../components/Tw5';
import {C} from '../theme';
import {mk} from '../timelineTw5';
import {blink, ramp} from '../util';
import {camera, ease01, eye, SVG} from './twkit';

const GUARD = {top: '#3d4a3a', topShade: '#2f3a2c', bottom: '#2a3328', hair: '#1a1612', skin: '#c8987c', skinShade: '#a37a64'};
const GY = 1560;
const EAR: [number, number] = [150, -150]; // рука с телефоном у уха

/** Телефон у уха персонажа ростом «как Марк». */
const EarPhone: React.FC<{x: number; facing: 1 | -1; size?: number}> = ({x, facing, size = 1}) => {
  const e = eye(x, GY, size, facing, 1, 1, 132);
  return <rect x={e.x - facing * 34 - 9} y={e.y - 6} width={18} height={34} rx={4} fill="#0d0f14" stroke="#9fb8ff" strokeWidth={2} />;
};

/* ───────── поле: камень, звонок, Дима ───────── */
const FieldShot: React.FC<{f: number}> = ({f}) => {
  const DT = mk('dima_takes');
  const KN = mk('kneel');
  const TA = mk('turn_away');
  const dimaHas = f >= DT + 20;
  const kneel = ease01(f, KN, KN + 30);
  const heroX = f < DT ? 300 : interpolate(f, [DT + 20, DT + 50], [300, 220], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dimaX = f < DT ? 920 : interpolate(f, [DT, DT + 20], [920, 420], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const heroFacing: 1 | -1 = f >= TA ? -1 : 1;
  const cam = f < DT
    ? camera(f, [[0, 380, 1250, 1.6], [mk('voice1'), 340, 1270, 1.9]])
    : camera(f, [[DT, 500, 1250, 1.3], [DT + 40, 360, 1300, 1.7], [KN, 360, 1320, 1.8], [TA + 20, 330, 1340, 2.0]]);
  return (
    <SVG>
      <g transform={cam}>
        <DawnSky />
        <Field f={f} horizon={1050} />
        <Monolith cx={620} base={1530} w={560} h={820} f={f} slit={1} hum={f < DT ? 0.4 : 0.15} touch={[358, 1250]} />
        <rect width={1080} height={1920} x={-500} y={-200} fill="#eef3ff" opacity={0.08} />
        <Character who="mark" x={dimaX} y={GY} size={1.0} facing={-1} frame={f} override={GUARD}
          pose={{step: f > DT && f < DT + 20 ? f / 3 : 0, sit: kneel * 0.85, lean: kneel * 28, headTilt: kneel * 18, armF: dimaHas ? EAR : [10, -14], blink: kneel > 0.5 ? 0.15 : blink(f, 12), brow: 1, look: 0.3, rim: 1, rimColor: '#eef3ff'}} />
        {dimaHas && kneel < 0.2 && <EarPhone x={dimaX} facing={-1} />}
        <Character who="mark" x={heroX} y={GY} size={1.0} facing={heroFacing} frame={f}
          pose={{armF: !dimaHas ? EAR : [10, -14], blink: blink(f, 1), brow: 1, look: 0.4, lookUp: f >= TA ? -0.4 : 0, rim: 1, rimColor: '#eef3ff'}} />
        {!dimaHas && <EarPhone x={heroX} facing={1} />}
        <KnitBunny x={heroX - 34 * heroFacing} y={GY - 150} s={0.6} rot={10} />
      </g>
    </SVG>
  );
};

/* ───────── воспоминание: Евгений у двери ───────── */
const Memory: React.FC<{f: number}> = ({f}) => {
  const ME = mk('memory');
  const cam = camera(f, [[ME, 40, 840, 2.2], [mk('kneel'), 70, 800, 2.6]]);
  return (
    <SVG>
      <defs>
        <filter id="memSepia"><feColorMatrix type="matrix" values="0.45 0.7 0.18 0 0.02  0.38 0.62 0.16 0 0.01  0.28 0.48 0.12 0 0  0 0 0 1 0" /></filter>
        <radialGradient id="memVig" cx="0.5" cy="0.42" r="0.6">
          <stop offset="0.45" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.85} />
        </radialGradient>
      </defs>
      <g filter="url(#memSepia)" transform={cam}>
        <ShelterBack f={f} light={{lamps: 0.6, red: 0.4, monitor: 0}} sign="ОБЪЕКТ ГО № 3" doorOpen={0.3} />
        <Character who="evgeny" x={SH.door.x + 140} y={SH.floor} size={1.15} facing={1} frame={f}
          pose={{armF: [80, -40], blink: blink(f, 3), brow: -0.5, smile: 0.9, look: 0.4, rim: 1, rimColor: '#fffbe8'}} />
        <KnitBunny x={SH.door.x + 210} y={SH.floor - 245} s={1.0} />
      </g>
      <rect width={1080} height={1920} fill="url(#memVig)" />
      <rect width={1080} height={1920} fill="#fff6e0" opacity={0.05 + 0.03 * Math.sin(f / 4)} />
    </SVG>
  );
};

/* ───────── камень уходит, небо синеет ───────── */
const Rise: React.FC<{f: number}> = ({f}) => {
  const RI = mk('rise');
  const SR = mk('star');
  const BL = mk('blue');
  const up = ease01(f, RI + 10, SR + 20);
  const shrink = interpolate(up, [0, 1], [1, 0.02]);
  const lift = interpolate(up, [0, 1], [0, -1500]);
  const blue = ramp(f, BL, BL + 50);
  const cam = camera(f, [[RI, 560, 1150, 0.9], [SR, 560, 800, 0.85], [BL, 560, 950, 0.85], [mk('home'), 560, 1000, 0.9]]);
  return (
    <SVG>
      <g transform={cam}>
        <OrangeSky k={1} h={1500} />
        <BlueSky k={blue} />
        <FarSkyline f={f} base={1330} />
        <Field f={f} horizon={1330} />
        <g transform={`translate(620 ${1530 + lift}) scale(${shrink}) translate(-620 -1530)`}>
          <Monolith cx={620} base={1530} w={560} h={820} f={f} slit={1 - up} />
        </g>
        {up > 0.85 && <circle cx={620} cy={1530 + lift - 400 * shrink} r={6} fill="#fffbe8" opacity={1 - blue * 0.6} />}
        {[300, 380].map((x, i) => (
          <Character key={i} who="mark" x={x} y={1700} size={1.0} facing={1} frame={f} override={i ? GUARD : undefined}
            pose={{lookUp: 0.9, blink: blink(f, i + 1), brow: 0.6 - blue, smile: blue * 0.5, rim: 0.6, rimColor: blue ? '#fffbe8' : '#eef3ff'}} />
        ))}
      </g>
    </SVG>
  );
};

/* ───────── дома: Соня, костёр, запись ───────── */
const Home: React.FC<{f: number}> = ({f}) => {
  const HO = mk('home');
  const RU = mk('run');
  const GV = mk('give');
  const FI = mk('fire');
  const GC = mk('galya_cry');
  const LA = mk('last');
  const b = DEPOT.bunker;
  const night = f >= FI;
  const run = ease01(f, RU, RU + 40);
  const sonX = interpolate(run, [0, 1], [b + 200, b - 160]);
  const give = ease01(f, GV + 10, GV + 40);
  const fx = b - 420;
  const camEvening = camera(f, [[HO, b - 200, 1250, 1.0], [RU, b - 180, 1300, 1.3], [GV, b - 220, 1340, 2.0], [FI, b - 220, 1340, 2.0]]);
  const camNight = camera(f, [[FI, fx, 1330, 1.6], [GC, fx - 120, 1320, 2.2], [LA, fx - 60, 1300, 1.7], [mk('title'), fx, 900, 0.75]]);
  const e = eye(fx - 150, GY - 60, 0.95, 1, 0.9, 1.02, 128);
  return (
    <SVG>
      <g transform={night ? camNight : camEvening}>
        {night ? <StarSky f={f - FI} /> : <BlueSky k={1} sun={[200, 1050]} />}
        {!night && <rect x={-2000} y={-1000} width={5000} height={2450} fill="#e09a6a" opacity={0.25} />}
        <Depot f={f} />
        {night && <rect x={-2000} y={-1000} width={5000} height={4000} fill="#05070e" opacity={0.45} />}
        {!night ? (
          <g>
            <Character who="mark" x={b - 260} y={GY} size={1.0} facing={1} frame={f} pose={{sit: give * 0.5, armF: give > 0.3 ? [80, -40] : [10, -14], blink: blink(f, 1), brow: 0, smile: 0.6, look: 0.4}} />
            <Character who="sonya" x={sonX} y={GY} size={0.95} facing={-1} frame={f} pose={{step: run > 0 && run < 1 ? f / 2.2 : 0, armF: run >= 1 ? [80, -20] : [40, -10], blink: blink(f, 4), smile: 0.8, lookUp: 0.6}} />
            <KnitBunny x={interpolate(give, [0, 1], [b - 206, sonX - 40])} y={interpolate(give, [0, 1], [GY - 150, GY - 112])} s={0.8} />
          </g>
        ) : (
          <g>
            <Campfire x={fx} y={GY} f={f} cakes={2} />
            <Character who="galina" x={fx - 150} y={GY - 60} size={0.95} facing={1} frame={f} pose={{sit: 1, blink: f >= GC ? 0.5 : blink(f, 9), brow: 1, lookUp: -0.3, rimColor: T.fire, rim: 1}} />
            <Cat x={fx - 120} y={GY - 112} f={f} s={0.5} />
            {f >= GC + 10 && [0, 1].map((i) => <Tear key={i} x={e.x} y={e.y + 6} t={((f - GC) / 45 + i / 2) % 1} s={1} />)}
            <Character who="mark" x={fx + 150} y={GY - 60} size={1.0} facing={-1} frame={f} override={GUARD} pose={{sit: 1, armF: [80, -70], blink: blink(f, 12), brow: 0.8, lookUp: -0.5, rimColor: T.fire, rim: 1}} />
            <circle cx={fx + 110} cy={GY - 230} r={10} fill="#dfe8ff" opacity={0.9} />
            <Character who="mark" x={fx + 300} y={GY - 60} size={1.0} facing={-1} frame={f} pose={{sit: 1, armF: [60, -40], blink: blink(f, 1), brow: 0.4, rimColor: T.fire, rim: 1}} />
            <Character who="sonya" x={fx + 380} y={GY - 40} size={0.9} facing={-1} frame={f} pose={{sit: 1, lean: -10, headTilt: -14, blink: 0.1, rimColor: T.fire, rim: 1}} />
            <KnitBunny x={fx + 350} y={GY - 112} s={0.7} />
          </g>
        )}
      </g>
    </SVG>
  );
};

/* ───────── сцена целиком ───────── */
export const SceneTw5: React.FC<{f: number}> = ({f}) => {
  const VM = mk('voicemail');
  const DL = mk('delivered');
  const DT = mk('dima_takes');
  const ME = mk('memory');
  const KN = mk('kneel');
  const LE = mk('letter');
  const LT = mk('letter_text');
  const VO = mk('voices');
  const NW = mk('no_waves');
  const RI = mk('rise');
  const HO = mk('home');
  const TITLE = mk('title');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {(f < VM || (f >= DT && f < ME) || (f >= KN && f < LE)) && <FieldShot f={f} />}
      {f >= VM && f < DT && (
        <AbsoluteFill style={{background: '#06080d'}}>
          <PhoneFrame x={540} y={720} scale={0.95} tilt={-2} f={f} glow={f >= DL ? '#3aa25a' : C.red} glowK={0.3}>
            <VoiceMessageScreen f={f} start={VM} delivered={ramp(f, DL, DL + 6)} play={interpolate(f, [VM, DT], [0.05, 0.35], {extrapolateRight: 'clamp'})} />
          </PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= ME && f < KN && <Memory f={f} />}
      {f >= LE && f < RI && (
        <AbsoluteFill style={{background: '#030406'}}>
          <PhoneFrame x={540} y={720} scale={interpolate(f, [LE, RI], [0.92, 1.0])} tilt={-1} f={f} glow="#9fb8ff" glowK={0.35}>
            <LetterScreen f={f} lines={[
              ['Мы видели вас все три раза.', LT],
              ['Каждое предупреждение было от нас.', LT + 50],
              ['Мы не могли остановить камни. Только дать вам время.', LT + 110],
              ['Мы храним голоса тех, кто закрыл дверь за других.', VO],
              ['Этот — мы вернули.', VO + 90],
              ['ВОЛН БОЛЬШЕ НЕ БУДЕТ.', NW, true],
            ].filter(([, at]) => f >= (at as number) - 0).slice(-4) as [string, number, boolean?][]} />
          </PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= RI && f < HO && <Rise f={f} />}
      {f >= HO && f < TITLE && <Home f={f} />}
      {f >= TITLE && <AbsoluteFill style={{background: C.void}}><FinalCard f={f} start={TITLE} /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
