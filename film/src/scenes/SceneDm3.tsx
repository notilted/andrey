import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Character} from '../components/Character';
import {Beach, Cap, CoastSky, D, DmCard, G, Raft, Rod, roofY} from '../components/Dm';
import {Chip} from '../components/Overlay';
import {BigTimer} from '../components/Tw2';
import {C} from '../theme';
import {mk} from '../timelineDm3';
import {blink, ramp, rand} from '../util';
import {FloodWorld, SILL, TOWER} from './SceneDm2';
import {camera, ease01, shakeXY, SVG} from './twkit';

const SZ = 0.42;
const LADX = TOWER.x + 42; // середина пожарной лестницы
const MISHA_NOCAP = {scale: 1, headScale: 1.26, torso: 116, width: 66, top: '#4f8fbf', topShade: '#3d7099', skin: '#d6a88a', skinShade: '#b0846c', hair: '#6a4a30'};

/* ───────── у дома: течение, лестница, Палыч ───────── */
const Tower: React.FC<{f: number}> = ({f}) => {
  const CU = mk('current');
  const JU = mk('jump');
  const TA = mk('take');
  const CL = mk('climb');
  const LA = mk('last');
  const BR = mk('break');
  const FA = mk('fall');
  const WA = mk('wall');
  const HA = mk('hand');
  const CA = mk('cap');
  const DE = mk('debt');
  const PU = mk('push');
  const WV = mk('wave');
  const UN = mk('under');
  const level = f < WV ? interpolate(f, [0, CU], [1640, 1700], {extrapolateRight: 'clamp'}) : interpolate(f, [WV, WV + 40], [1700, 800], {extrapolateRight: 'clamp'});
  const recede = f < WV ? 0.6 : 0;
  const wall = ramp(f, WA, WV + 10);
  // плот: течение тащит вправо, Палыч возвращает к стене, потом отталкивает
  const raftX = interpolate(f, [CU, JU, JU + 50, PU, PU + 40], [980, 1240, 990, 990, 1300], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const raftY = level - 4;
  const inWater = f >= JU && f < JU + 60;
  // лестница: подъём
  const up = (delay: number, to: number) => interpolate(f, [CL + delay, CL + delay + 90], [SILL, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const vikaY = f < TA + 30 ? SILL : up(0, roofY(9) + 180);
  const heroY = f < TA ? raftY - 6 : f < CL ? SILL : up(14, roofY(9) + 300);
  const mishaOnHero = f >= TA + 20;
  const palClimb = f >= LA ? interpolate(f, [LA, BR], [raftY - 6, SILL - 40], {extrapolateRight: 'clamp'}) : raftY - 6;
  const fallen = f >= BR + 6;
  const palY = !fallen ? palClimb : interpolate(f, [BR + 6, BR + 26], [SILL - 40, raftY - 6], {extrapolateRight: 'clamp'});
  const palX = f < JU ? raftX + 70 : inWater ? raftX + 120 : f < LA ? raftX + 70 : !fallen ? LADX : interpolate(f, [BR + 6, BR + 26], [LADX, raftX + 40], {extrapolateRight: 'clamp'});
  const capT = ease01(f, CA + 50, CA + 80);
  const shake = f >= WV + 10 && f < UN + 20 ? 18 * Math.exp(-(f - WV - 10) / 30) : 0;
  const cam = camera(f, [
    [0, 900, 1200, 0.8], [CU, 1100, 1450, 1.2], [JU + 40, 1080, 1500, 1.5], [TA, 980, 1250, 2.0], [CL, 980, 1150, 1.5], [CL + 90, 980, 900, 1.4],
    [LA, 980, 1250, 1.6], [BR + 30, 1030, 1400, 1.5], [FA, 1030, 1400, 1.5], [WA, 1100, 1100, 0.75], [HA - 1, 1100, 1100, 0.75], [HA, 1000, 1230, 1.0], [CA - 1, 1000, 1230, 1.0],
    [CA, 1010, 1450, 2.6], [CA + 50, 1010, 1450, 2.6], [CA + 80, 970, 900, 2.6], [DE - 1, 970, 900, 2.6], [DE, 1030, 1560, 3.0], [PU - 1, 1030, 1560, 3.0],
    [PU, 1100, 1450, 1.4], [WV, 1100, 1200, 0.8], [UN, 980, 900, 1.6], [mk('night'), 980, 900, 1.6],
  ]);
  return (
    <SVG>
      <g transform={`${shakeXY(f, shake)} ${cam}`}>
        <FloodWorld f={f} level={level} drift={f < JU ? 2.5 : f < WV ? 0.4 : 3} seaRecede={recede} wall={wall}>
          {/* оторвавшийся пролёт лестницы */}
          {f >= BR && f < BR + 40 && (
            <g transform={`rotate(${ramp(f, BR, BR + 30) * 70} ${TOWER.x + 64} ${SILL - 120}) translate(0 ${ramp(f, BR + 10, BR + 40) * 300})`} stroke="#5a3a2e" strokeWidth={6}>
              <path d={`M${TOWER.x + 20} ${SILL - 120} V${SILL - 300} M${TOWER.x + 64} ${SILL - 120} V${SILL - 300}`} />
            </g>
          )}
          {/* прикрыть нижнюю часть лестницы после обрыва */}
          {fallen && <rect x={TOWER.x + 10} y={SILL - 300} width={64} height={190} fill="#9aa0a8" />}
          <rect x={TOWER.x + 24} y={SILL} width={80} height={10} fill="#5a5f68" />
          <Character who="vika" x={f < TA + 30 ? TOWER.x + 76 : LADX + 10} y={vikaY} size={SZ} facing={-1} frame={f}
            pose={{armF: f >= CL ? [170 + Math.sin(f / 4) * 10, -10] : [60, -30], blink: blink(f, 5), brow: 1, look: 0.3}} />
          {!mishaOnHero && (
            <Character who="mark" x={TOWER.x + 50} y={SILL} size={SZ * 0.62} facing={-1} frame={f} override={MISHA_NOCAP} pose={{armF: [150, -10], blink: blink(f, 4), brow: 1}} />
          )}
          {f >= TA && (
            <g>
              <Character who="mark" x={LADX - 12} y={heroY} size={SZ} facing={-1} frame={f}
                pose={{armF: f >= HA && f < CA + 50 ? [170, -10] : f >= CL ? [170 + Math.sin(f / 4) * 10, -10] : [80, -60], armB: [-150, 10], blink: blink(f, 1), brow: 1, look: -0.4, lookUp: f >= HA ? -0.6 : 0.3}} />
              {mishaOnHero && <Character who="mark" x={LADX - 4} y={heroY - 110 * SZ * 1.3} size={SZ * 0.62} facing={-1} frame={f} override={MISHA_NOCAP}
                pose={{sit: 1, armF: f >= CA + 70 ? [160, -10] : [120, -60], blink: blink(f, 4), brow: 1, lookUp: -0.4}} />}
            </g>
          )}
          {/* кепка Палыча летит к Мише */}
          {f >= CA + 50 && capT < 1 && <Cap x={interpolate(capT, [0, 1], [palX, LADX])} y={interpolate(capT, [0, 1], [palY - 140, heroY - 220]) - Math.sin(capT * Math.PI) * 120} s={0.6} kind="fisher" rot={capT * 540} />}
        </FloodWorld>
        {f < WV + 6 && (
          <g>
            <Raft x={raftX} y={raftY} f={f} s={0.7} />
            {f < TA && (
              <Character who="mark" x={raftX - 40} y={raftY - 6} size={SZ} facing={1} frame={f} pose={{sit: 0.5, armF: [90, -20], blink: blink(f, 1), brow: 1}} />
            )}
            <Character who="palych" hair={f >= CA + 55 ? 'evgeny' : undefined} x={palX} y={inWater ? raftY + 60 : palY} size={SZ * 1.02} facing={f >= PU ? 1 : -1} frame={f}
              pose={{armF: inWater ? [100, -10] : f >= LA && !fallen ? [170 + Math.sin(f / 4) * 10, -10] : f >= CA && f < CA + 60 ? [160, -40] : f >= PU && f < PU + 30 ? [100, -10] : [20, -14],
                sit: fallen && f < HA ? 0.5 : 0, blink: blink(f, 7), brow: f >= DE ? -0.4 : 1, smile: f >= DE ? 0.5 : 0, lookUp: f >= HA && f < PU ? 0.7 : 0, look: 0.4, rim: f >= DE ? 1 : 0.3, rimColor: '#dfeef2'}} />
          </g>
        )}
        {f >= WV && f < WV + 30 && <rect x={-1000} y={-1000} width={4000} height={4000} fill={D.foam} opacity={0.6 * (1 - ramp(f, WV + 6, WV + 30))} />}
      </g>
    </SVG>
  );
};

/* ───────── ночь на крыше ───────── */
const Night: React.FC<{f: number}> = ({f}) => {
  const top = roofY(9);
  return (
    <SVG>
      <g transform={`translate(540 860) scale(3) translate(${-(TOWER.x + 170)} ${-(top - 70)})`}>
        <CoastSky night={1} />
        <rect x={-1000} y={top} width={4000} height={2000} fill="#4a4e58" />
        <rect x={-1000} y={top} width={4000} height={2000} fill="#05070e" opacity={0.6} />
        <Character who="vika" x={TOWER.x + 80} y={top + 38} size={SZ} facing={1} frame={f} pose={{sit: 1, blink: blink(f, 5) * 0.6, brow: 0.6, rim: 0.4, rimColor: '#9fb8ff'}} />
        <Character who="mark" x={TOWER.x + 200} y={top + 38} size={SZ} facing={1} frame={f} pose={{sit: 1, armF: [80, -40], blink: blink(f, 1), brow: 0.6, rim: 0.4, rimColor: '#9fb8ff'}} />
        <Character who="mark" x={TOWER.x + 250} y={top + 24} size={SZ * 0.62} facing={-1} frame={f} override={MISHA_NOCAP} pose={{sit: 1, armF: [90, -80], headTilt: 10, blink: 0.5, brow: 0.9, rim: 0.4, rimColor: '#9fb8ff'}} />
        <Cap x={TOWER.x + 228} y={top - 48} s={0.42} kind="fisher" rot={10} />
      </g>
    </SVG>
  );
};

/* ───────── утро: берег, две кепки ───────── */
const Morning: React.FC<{f: number}> = ({f}) => {
  const MO = mk('morning');
  const SH = mk('shore');
  const CA = mk('caps');
  const RO = mk('rod');
  const TW = mk('two_caps');
  const FI = mk('final');
  const pick = ease01(f, CA, CA + 30);
  const two = f >= TW + 10;
  const cam = camera(f, [[MO, 700, 1150, 0.8], [SH, 520, 1250, 1.5], [CA, 470, 1300, 2.6], [RO, 620, 1320, 2.6], [TW, 480, 1250, 2.8], [FI, 560, 1200, 1.2], [mk('title'), 600, 1100, 0.85]]);
  return (
    <SVG>
      <g transform={cam}>
        <CoastSky dawn={1} />
        <circle cx={1300} cy={1000} r={90} fill="#ffe9c0" opacity={0.95} />
        <Beach f={f} recede={0} horizon={1000} calm />
        {Array.from({length: 22}).map((_, i) => (
          <rect key={i} x={rand(i) * 2400 - 600} y={1320 + rand(i + 3) * 300} width={30 + rand(i + 5) * 90} height={8 + rand(i + 7) * 14} fill={['#6a5a46', '#2f4a30', '#5a6070'][i % 3]} transform={`rotate(${rand(i + 9) * 40 - 20})`} />
        ))}
        {f >= SH && (
          <g>
            {!two && pick < 1 && <Cap x={500} y={1400 - pick * 60} s={0.9} kind="yellow" rot={-20 + pick * 20} />}
            <Rod x={600} y={1420} ang={-8} broken />
            <Character who="mark" x={330} y={1440} size={0.9} facing={1} frame={f} pose={{armF: f >= FI ? [60, -20] : [10, -14], blink: blink(f, 1), brow: 0.4, look: 0.5}} />
            <Character who="vika" x={250} y={1440} size={0.85} facing={1} frame={f} pose={{blink: blink(f, 5), brow: 0.6, lookUp: 0.2}} />
            <Character who={two ? 'misha' : 'mark'} x={450} y={1440} size={0.9 * (two ? 1 : 0.62)} facing={1} frame={f} override={two ? undefined : MISHA_NOCAP}
              pose={{sit: pick > 0 && pick < 1 ? 0.5 : 0, armF: pick > 0 && pick < 1 ? [80, -10] : [10, -14], blink: blink(f, 4), brow: 0.6, lookUp: 0.2, look: 0.5, rim: 0.8, rimColor: '#ffd9a0'}} />
            {two && <Cap x={452} y={1440 - 212} s={0.8} kind="fisher" rot={-4} />}
          </g>
        )}
      </g>
    </SVG>
  );
};

/* ───────── сцена целиком ───────── */
export const SceneDm3: React.FC<{f: number}> = ({f}) => {
  const NI = mk('night');
  const MO = mk('morning');
  const TITLE = mk('title');
  const CU = mk('current');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f < NI && <Tower f={f} />}
      {f >= NI && f < MO && <Night f={f} />}
      {f >= MO && f < TITLE && <Morning f={f} />}
      {f < CU + 20 && <BigTimer text="02:00" label="ДО ВТОРОЙ ВОЛНЫ" k={ramp(f, 4, 14) * (1 - ramp(f, CU, CU + 20))} y={300} />}
      {f >= mk('wall') && f < mk('hand') && <Chip x={540} y={330} text="ВТОРАЯ ВОЛНА" kind="red" t={ramp(f, mk('wall') + 6, mk('wall') + 16)} tilt={-2} size={40} />}
      {f >= TITLE && <AbsoluteFill style={{background: C.void}}><DmCard f={f} start={TITLE} ep={3} teaser="памяти тех, кто остался" final /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
