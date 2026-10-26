import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ApartmentBack, ApartmentFront, Chair, ROOM} from '../components/Apartment';
import {Character} from '../components/Character';
import {FarSkyline, MidTowers, Sky, Street} from '../components/City';
import {AlertPhone, BottomFade, Chip, fmt, StatusBar, Subtitle} from '../components/Overlay';
import {BLD, PanelBuilding, winPos, WIN_H, WIN_W} from '../components/PanelBuilding';
import {C} from '../theme';
import {blink, ease, keys, ramp} from '../util';
import voice from '../data/sample.voice.json';
import tl from '../data/sample.json';

const FPS = 30;
const V = voice as Record<string, {duration: number; mouth: number[]}>;
const line = (id: string) => {
  const d = tl.dialogue.find((x) => x.id === id)!;
  return {start: Math.round(d.start * FPS), dur: Math.round(V[id].duration * FPS), caption: d.caption};
};
/** Открытие рта по огибающей реплики. */
export const mouthAt = (id: string, f: number) => {
  const l = line(id);
  const m = V[id].mouth[f - l.start];
  return m === undefined ? 0 : Math.min(1, m * (0.75 + 0.25 * Math.sin(f * 1.7)));
};

export const ALERT = 240; // кадр оповещения
const MARK_WIN = {row: 6, col: 3};
const TV_WIN = {row: 4, col: 1};
const KETTLE_WIN = {row: 5, col: 4};

/** Камера-проезд: центр кадра (x,y) в мире и масштаб s; слои с параллаксом depth 0..1. */
const Layer: React.FC<{cx: number; cy: number; s: number; depth: number; children: React.ReactNode}> = ({cx, cy, s, depth, children}) => {
  const ax = 540;
  const ay = 820;
  const ls = 1 + (s - 1) * depth;
  const lx = ax + (cx - ax) * depth;
  const ly = ay + (cy - ay) * depth;
  return <g transform={`translate(540 860) scale(${ls}) translate(${-lx} ${-ly})`}>{children}</g>;
};

const CityShot: React.FC<{f: number}> = ({f}) => {
  const center = (r: number, c: number) => {
    const p = winPos(r, c);
    return [p.x + WIN_W / 2, p.y + WIN_H / 2];
  };
  const [tvx, tvy] = center(TV_WIN.row, TV_WIN.col);
  const [kx, ky] = center(KETTLE_WIN.row, KETTLE_WIN.col);
  const [mx, my] = center(MARK_WIN.row, MARK_WIN.col);
  const cx = keys(f, [[0, 520], [70, 560], [100, tvx + 30], [128, kx - 30], [150, mx], [182, mx]]);
  const cy = keys(f, [[0, 900], [70, 860], [100, tvy + 10], [128, ky + 10], [150, my], [182, my]]);
  const s = keys(f, [[0, 1.0], [70, 1.12], [100, 3.0], [128, 3.0], [150, 3.6], [182, 12]], ease);
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Layer cx={cx} cy={cy} s={s} depth={0.15}>
        <Sky f={f} />
      </Layer>
      <Layer cx={cx} cy={cy} s={s} depth={0.35}>
        <FarSkyline f={f} base={1180} />
      </Layer>
      <Layer cx={cx} cy={cy} s={s} depth={0.65}>
        <MidTowers f={f} base={1250} />
      </Layer>
      <Layer cx={cx} cy={cy} s={s} depth={1}>
        <PanelBuilding
          f={f}
          special={{[`${TV_WIN.row},${TV_WIN.col}`]: 'tv', [`${KETTLE_WIN.row},${KETTLE_WIN.col}`]: 'kettle', [`${MARK_WIN.row},${MARK_WIN.col}`]: 'mark'}}
        />
        <Street f={f} y={BLD.top + BLD.rows * BLD.rowH} />
      </Layer>
    </svg>
  );
};

const RoomShot: React.FC<{f: number}> = ({f}) => {
  const alertOn = f >= ALERT;
  const pulse = alertOn ? 0.5 + 0.5 * Math.sin(((f - ALERT) / FPS) * 2 * Math.PI * 2.2) : 0;
  const alertFade = alertOn ? Math.max(0.35, 1 - (f - ALERT) / 120) : 0;
  const red = pulse * alertFade;
  // камера в комнате: «приземление» после наезда, общий план, затем средний
  const s = keys(f, [[174, 1.5], [200, 1.0], [300, 1.0], [306, 1.22], [440, 1.28], [465, 1.33]]);
  const cx = keys(f, [[174, 720], [200, 540], [300, 540], [306, 520], [400, 500], [465, 480]]);
  const cy = keys(f, [[174, 640], [200, 720], [300, 720], [306, 790], [465, 780]]);

  // Марк: сидит → встаёт (кадр 365) → смотрит в окно → поворачивается к Алисе
  const stand = ramp(f, 362, 378);
  const markX = 250 + ramp(f, 376, 400) * 60;
  const sitMark = 1 - stand;
  const markLook = keys(f, [[0, 0.1], [244, 0.6], [300, 0.3], [330, 0.6], [372, -0.1], [392, 0.5]]);
  const markLookUp = keys(f, [[0, -0.6], [244, -0.9], [300, 0], [372, 0.6], [392, 0]]);
  const markBrow = keys(f, [[0, -0.3], [244, 0.7], [380, 0.5]]);
  const markHead = keys(f, [[0, 14], [244, 18], [300, 4], [372, -6], [392, 2]]);
  // Алиса рисует, после сигнала замирает и смотрит на папу
  const drawing = f < ALERT + 6;
  const aliceLook = keys(f, [[0, 0.2], [ALERT + 4, 0.6], [300, 0.9], [372, 0.9], [380, 0.5]]);
  const aliceHead = keys(f, [[0, 16], [ALERT + 4, 6], [300, -4], [372, -10]]);
  const pencil = drawing ? Math.sin(f / 3.2) * 8 : 0;
  const rimC = alertOn ? C.redHot : C.warm;

  const a1 = line('s1_alisa_1');
  const m1 = line('s1_mark_1');
  return (
    <>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute'}}>
      <g transform={`translate(540 820) scale(${s}) translate(${-cx} ${-cy})`}>
        <ApartmentBack f={f} alert={red} />
        <Chair x={250 - 30} facing={1} />
        <Chair x={830} facing={-1} seat={1004} />
        <Character
          who="mark"
          x={markX}
          y={ROOM.floor}
          size={1.2}
          frame={f}
          pose={{
            sit: sitMark,
            lean: 6 * sitMark,
            headTilt: markHead,
            look: markLook,
            lookUp: markLookUp,
            brow: markBrow,
            blink: blink(f, 1),
            mouth: mouthAt('s1_mark_1', f),
            armF: stand > 0.5 ? [8, -12] : [62, -58 + Math.sin(f / 40) * 4],
            armB: [-6, -14],
            step: f > 376 && f < 400 ? (f - 376) / 3 : 0,
            rimColor: rimC,
            rim: 0.6 + red * 0.6,
          }}
        />
        <Character
          who="alisa"
          x={812}
          y={ROOM.floor - 34}
          size={1.2}
          facing={-1}
          frame={f}
          pose={{
            sit: 1,
            lean: drawing ? 10 : 2,
            headTilt: aliceHead,
            look: aliceLook,
            lookUp: drawing ? -0.8 : 0.3,
            brow: alertOn ? 0.9 : -0.2,
            blink: blink(f, 4),
            mouth: mouthAt('s1_alisa_1', f),
            armF: drawing ? [70 + pencil * 0.4, -52 + pencil] : [40, -70],
            armB: [-4, -20],
            smile: alertOn ? 0 : 0.4,
            rimColor: rimC,
            rim: 0.6 + red * 0.6,
          }}
        />
        <ApartmentFront f={f} phone={alertOn ? 0.4 + 0.6 * pulse : 0} shake={alertOn && f < ALERT + 80 ? 1 : 0} drawn={Math.min(1, f / 230)} />
        <rect x={-200} y={-400} width={1480} height={2600} fill={C.red} opacity={red * 0.12} style={{mixBlendMode: 'screen'}} />
      </g>
    </svg>
      {/* субтитры — вне камеры, в тёмной нижней трети */}
      <BottomFade from={1150} />
      <Subtitle text={a1.caption} who="АЛИСА" f={f} start={a1.start} dur={a1.dur} />
      <Subtitle text={m1.caption} who="МАРК" f={f} start={m1.start} dur={m1.dur} />
    </>
  );
};

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cityOut = ramp(f, 164, 176);
  const roomIn = ramp(f, 174, 188);
  const phoneShot = f >= 252 && f < 306;
  const remaining = 17 * 60 - Math.max(0, (f - ALERT) / FPS);
  const flash = f >= ALERT ? Math.max(0, 1 - (f - ALERT) / 8) : 0;
  return (
    <AbsoluteFill style={{background: C.void}}>
      {f < 177 && (
        <AbsoluteFill style={{opacity: 1 - cityOut}}>
          <CityShot f={f} />
        </AbsoluteFill>
      )}
      {f >= 174 && (
        <AbsoluteFill style={{opacity: roomIn}}>
          <RoomShot f={f} />
        </AbsoluteFill>
      )}
      {phoneShot && (
        <AbsoluteFill style={{background: 'rgba(6,8,13,0.86)', opacity: ramp(f, 252, 256) * (1 - ramp(f, 302, 306))}}>
          <AlertPhone f={f} start={252} remaining={remaining} y={760} scale={interpolate(f, [252, 306], [0.98, 1.06])} shake={f < 280 ? 1 : 0.3} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#fff', opacity: flash * 0.5, mixBlendMode: 'overlay'}} />
      {/* надписи и статус-строка */}
      {f < 120 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - ramp(f, 92, 112)}}>
          <Chip x={540} y={330} text="МОСКВА" kind="white" t={ramp(f, 18, 30)} tilt={-2} size={30} />
          <Chip x={540} y={398} text="ОБЫЧНАЯ НОЧЬ" kind="yellow" t={ramp(f, 34, 46)} tilt={1.5} size={22} />
        </div>
      )}
      <StatusBar
        time={f < ALERT ? '23:41' : fmt(remaining)}
        label={f < ALERT ? 'МОСКВА' : 'ДО УДАРА'}
        labelColor={f < ALERT ? C.grey : C.red}
        opacity={ramp(f, 10, 24)}
      />
    </AbsoluteFill>
  );
};
