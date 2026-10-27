import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Character} from '../components/Character';
import {Chip, fmt} from '../components/Overlay';
import {CctvView, EpisodeCard, IdentifiedScreen, PhoneFrame, TimerScreen} from '../components/Phone';
import {DrawingCloseup, NotebookCloseup} from '../components/Props2';
import {Cage, EXTRAS, SH, ShelterBack, ShelterFront, ShelterLight} from '../components/Shelter';
import {C} from '../theme';
import {line, mk, mouth, mouthAny} from '../timeline2';
import {blink, ease, keys, ramp} from '../util';

/** Таймер этапа 2: 17:00 с момента, как загорелись телефоны, до нуля к финалу (с монтажными скачками). */
export const timerEp2 = (f: number) => {
  const P = mk('c1_phones');
  if (f < P) return 17 * 60;
  const k: [number, number][] = [[P, 1020], [mk('c2'), 1020 - (mk('c2') - P) / 30], [mk('c2') + 1, 760], [mk('c3'), 560], [mk('c4'), 380], [mk('c5'), 220], [mk('c5_silence'), 60], [mk('c6'), 0]];
  return interpolate(f, k.map((x) => x[0]), k.map((x) => x[1]), {extrapolateRight: 'clamp'});
};

type Cam = [number, number, number, number];
const camera = (f: number, list: Cam[]) => {
  const k = (i: 1 | 2 | 3) => keys(f, list.map((c) => [c[0], c[i]] as [number, number]), ease);
  return {cx: k(1), cy: k(2), s: k(3)};
};
const fade = (f: number, a: number, b: number, d = 5) => ramp(f, a, a + d) * (1 - ramp(f, b - d, b));

export const SceneEp2: React.FC<{f: number}> = ({f}) => {
  const R = mk('recap_end');
  const LIGHT = mk('c1_light');
  const G1 = line('e2_galina_1');
  const PH = mk('c1_phones');
  const PHE = mk('c1_phones_end');
  const L1 = line('e2_lev_1');
  const M1 = line('e2_mark_1');
  const L2 = line('e2_lev_2');
  const C2 = mk('c2');
  const P1 = line('e2_parrot_1');
  const G2 = line('e2_galina_2');
  const A1 = line('e2_alisa_1');
  const M2 = line('e2_mark_2');
  const L3 = line('e2_lev_3');
  const BOOK = mk('c3_book');
  const BOOKE = mk('c3_book_end');
  const L5 = line('e2_lev_5');
  const MON = mk('c3_monitor');
  const MON3 = mk('c3_monitor3');
  const G3 = line('e2_galina_3');
  const LOOK = mk('c3_look');
  const C4 = mk('c4');
  const A2 = line('e2_alisa_2');
  const DRAW = mk('c4_draw');
  const M4 = line('e2_mark_4');
  const A3 = line('e2_alisa_3');
  const C5 = mk('c5');
  const M5 = line('e2_mark_5');
  const D1 = line('e2_double_1');
  const A4 = line('e2_alisa_4');
  const D2 = line('e2_double_2');
  const SIL = mk('c5_silence');
  const M6 = line('e2_mark_6');
  const G4 = line('e2_galina_4');
  const C6 = mk('c6');
  const BACK = mk('c6_back');
  const TURN = mk('c6_turn');
  const A5 = line('e2_alisa_5');
  const LOCK = mk('c6_lock');
  const OPEN = mk('c6_open');
  const BLACK = mk('c6_black');
  const TITLE = mk('title');

  // красная аварийная лампа загорается с миганием
  const fl = f - LIGHT;
  const redOn = fl < 0 ? 0 : fl < 24 ? [0, 1, 0, 0, 1, 0.3, 1][Math.floor(fl / 3.5)] ?? 1 : 1;
  const light: ShelterLight = {lamps: 0, red: redOn, monitor: 0};

  const cam = camera(f, [
    [R, 560, 760, 0.85], [G1.start, 330, 790, 1.4], [PH, 330, 790, 1.4],
    [PHE, 1120, 790, 1.35], [M1.start - 1, 1120, 790, 1.35], [M1.start, 560, 780, 1.5], [L2.start - 1, 560, 780, 1.5], [L2.start, 1120, 790, 1.4],
    [C2, 1120, 790, 1.4], [C2 + 1, 330, 900, 1.6], [G2.start + G2.dur, 330, 860, 1.5], [A1.start, 520, 800, 1.6], [M2.start + 20, 560, 790, 1.6],
    [L3.start - 1, 560, 790, 1.6], [L3.start, 1120, 790, 1.4], [L5.start, 1100, 790, 1.3],
    [G3.start - 1, 1100, 790, 1.3], [G3.start, 330, 790, 1.45], [LOOK, 330, 790, 1.45], [LOOK + 1, 760, 780, 1.0], [C4 - 10, 600, 760, 1.4],
    [C4, 600, 760, 1.4], [A2.start, 470, 790, 1.8], [M4.start + M4.dur, 500, 790, 1.6], [A3.start + A3.dur, 470, 790, 1.8],
    [C5, 420, 780, 1.1], [M5.start, 220, 780, 1.4], [D1.start + D1.dur, 220, 780, 1.4], [A4.start - 1, 220, 780, 1.4], [A4.start, 480, 760, 1.9],
    [D2.start - 1, 480, 760, 1.9], [D2.start, 230, 760, 1.6], [M6.start + 10, 230, 690, 2.4], [G4.start - 1, 230, 690, 2.4], [G4.start, 360, 790, 1.5],
    [BACK, 520, 760, 0.95], [A5.start, 360, 760, 1.25], [LOCK - 1, 360, 760, 1.25], [LOCK, 20, 760, 1.25], [OPEN + 60, 60, 760, 1.4],
  ]);

  // ── персонажи (стартовая расстановка = последний кадр части 1) ──
  const toDoor = interpolate(f, [C5, M5.start - 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const markX = 560 - toDoor * 360;
  const markMoving = f > C5 && f < M5.start - 4;
  const markFacing: 1 | -1 = f >= C5 ? -1 : f >= A1.start && f < L3.start ? 1 : -1;
  const alisaBack = interpolate(f, [TURN, A5.start], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const alisaX = f >= C5 ? 470 - toDoor * 160 + alisaBack * 120 : 470;
  const alisaFacing: 1 | -1 = f >= C5 ? -1 : 1;
  const holding = f < C5; // держит папу за руку, пока он не пошёл к двери
  const galX = 300;
  const galFacing: 1 | -1 = f >= C5 ? -1 : 1;
  const levX = 1150;
  const levFacing: 1 | -1 = -1;
  const rimC = C.redHot;
  const allLookMark = f >= TURN; // в финале все смотрят на Марка
  const beak = mouth('e2_parrot_1', f);

  const camT = `translate(540 800) scale(${cam.s}) translate(${-cam.cx} ${-cam.cy})`;
  const showRoom = f >= LIGHT && f < BLACK + 2;
  const remaining = timerEp2(f);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {showRoom && (
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute'}}>
          <g transform={camT}>
            <ShelterBack f={f} light={light} doorWheel={interpolate(f, [LOCK + 6, OPEN], [0, 200], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease})} doorOpen={interpolate(f, [OPEN, OPEN + 80], [0, 0.35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease})} />
            {EXTRAS.map((e, i) => (
              <Character key={i} who="mark" hair={e.style} x={e.x} y={SH.floor - 60} size={1.05 * e.scale} facing={allLookMark ? -1 : e.facing} frame={f + i * 11}
                override={{top: e.top, topShade: e.top, hair: e.hair, bottom: '#202329'}}
                pose={{sit: 1, armF: [55, -95], armB: [-10, -10], lookUp: allLookMark || f >= P1.start ? 0.2 : -0.6, blink: blink(f, i + 20), rim: 0.25, rimColor: rimC, brow: 0.7}} />
            ))}
            <Character who="lev" x={levX} y={SH.floor} size={1.2} facing={levFacing} frame={f}
              pose={{armF: f >= BOOK - 30 && f < L5.start ? [70, -80] : [10, -14], lookUp: f >= BOOK - 30 && f < BOOKE ? -0.6 : 0.2, look: 0.4, blink: blink(f, 6),
                mouth: mouthAny(['e2_lev_1', 'e2_lev_2', 'e2_lev_3', 'e2_lev_4', 'e2_lev_5'], f), brow: f >= LOOK ? 0.9 : 0.4, rimColor: rimC}} />
            <Character who="galina" x={galX} y={SH.floor} size={1.12} facing={galFacing} frame={f}
              pose={{armF: f >= G2.start && f < G2.start + G2.dur ? [60, -60] : [20, -20], blink: blink(f, 9), look: 0.3, lookUp: f >= C2 && f < G2.start + G2.dur ? -0.6 : 0,
                mouth: mouthAny(['e2_galina_1', 'e2_galina_2', 'e2_galina_3', 'e2_galina_4'], f), brow: 1, rimColor: rimC}} />
            <Cage x={galX + 40} y={SH.floor - 4} f={f} s={0.8} beak={beak} flap={f >= C2 && f < P1.start + P1.dur + 20 ? f * 1.4 : 0} />
            <Character who="alisa" x={alisaX} y={SH.floor} size={1.2} facing={alisaFacing} frame={f}
              pose={{step: f > TURN && f < A5.start ? f / 3 : 0, armF: holding ? [62, -20] : f >= DRAW - 20 && f < A3.start + A3.dur ? [60, -60] : [30, -10],
                blink: blink(f, 4), look: 0.5, lookUp: holding ? 0.8 : 0.4, brow: 0.9,
                mouth: mouthAny(['e2_alisa_1', 'e2_alisa_2', 'e2_alisa_3', 'e2_alisa_4', 'e2_alisa_5'], f), rimColor: rimC}} />
            <Character who="mark" x={markX} y={SH.floor} size={1.2} facing={markFacing} frame={f}
              pose={{step: markMoving ? f / 3.2 : 0, armF: holding && markFacing === -1 ? [10, -14] : f >= M5.start && f < SIL ? [80, -30] : [10, -14], armB: holding ? [-30, -10] : [-8, -14],
                look: f >= SIL && f < C6 ? -0.2 : 0.3, lookUp: f >= SIL && f < C6 ? -0.5 : 0.1, blink: f >= SIL && f < M6.start ? 1 : blink(f, 1), brow: 1,
                mouth: mouthAny(['e2_mark_1', 'e2_mark_2', 'e2_mark_3', 'e2_mark_4', 'e2_mark_5', 'e2_mark_6'], f), rimColor: rimC}} />
            <ShelterFront f={f} light={light} chessT={1} monitorOn={f >= MON - 10 ? 1 : 0} />
          </g>
        </svg>
      )}

      {/* ── вставки ── */}
      {f >= PH && f < PHE && (
        <AbsoluteFill style={{background: 'rgba(6,8,13,0.9)', opacity: fade(f, PH, PHE)}}>
          <PhoneFrame x={540} y={720} scale={0.95} f={f} shake={f < PH + 20 ? 0.6 : 0} glowK={0.45}>
            <TimerScreen owner="ЭТАП 2" remaining={remaining} color={C.redHot} />
          </PhoneFrame>
          <Chip x={540} y={1260} text="ОТСЧЁТ НАЧАЛСЯ ЗАНОВО" kind="red" t={ramp(f, PH + 16, PH + 28)} tilt={-1.5} size={26} />
        </AbsoluteFill>
      )}
      {f >= C2 + 1 && f < G2.start && (
        <AbsoluteFill style={{background: '#120b0d', opacity: fade(f, C2 + 1, G2.start, 4)}}>
          <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
            <rect width={1080} height={1300} fill={C.redHot} opacity={0.07} />
            <Cage x={540} y={1040} f={f} s={4.2} beak={beak} flap={f < P1.start + 10 ? f * 1.4 : 0} />
          </svg>
          <Chip x={540} y={330} text="ПОПУГАЙ КЕША" kind="yellow" t={ramp(f, C2 + 6, C2 + 18)} tilt={2} size={24} />
        </AbsoluteFill>
      )}
      {f >= BOOK && f < BOOKE && (
        <AbsoluteFill style={{opacity: fade(f, BOOK, BOOKE)}}>
          <NotebookCloseup t={f - BOOK} />
        </AbsoluteFill>
      )}
      {f >= MON && f < G3.start && (
        <AbsoluteFill style={{background: '#050608', opacity: fade(f, MON, G3.start, 5)}}>
          <div style={{position: 'absolute', left: 540, top: 700, transform: `translate(-50%,-50%) scale(${interpolate(f, [MON, G3.start], [0.98, 1.1])})`}}>
            <div style={{padding: 34, borderRadius: 46, background: '#1b1e24', boxShadow: '0 0 160px rgba(159,179,166,0.25)'}}>
              <div style={{borderRadius: 26, overflow: 'hidden'}}>
                <CctvView f={f} mouth={0} approach={0} blink={blink(f, 30)} count={f < MON3 ? 2 : 3} />
              </div>
            </div>
          </div>
          <Chip x={540} y={1180} text={f < MON3 ? 'ИХ УЖЕ ДВОЕ' : 'ТРОЕ'} kind="red" t={ramp(f, f < MON3 ? MON + 10 : MON3, (f < MON3 ? MON + 10 : MON3) + 10)} tilt={-2} size={28} />
        </AbsoluteFill>
      )}
      {f >= DRAW && f < M4.start + M4.dur && (
        <AbsoluteFill style={{opacity: fade(f, DRAW, M4.start + M4.dur)}}>
          <DrawingCloseup t={f - DRAW} />
        </AbsoluteFill>
      )}
      {f >= C6 && f < BACK && (
        <AbsoluteFill style={{background: 'rgba(6,8,13,0.92)', opacity: fade(f, C6, BACK, 4)}}>
          <PhoneFrame x={250} y={760} scale={0.62} tilt={-7} glow="#ffffff" glowK={0.2} f={f}><IdentifiedScreen f={f} start={C6 + 6} name="МАРК" /></PhoneFrame>
          <PhoneFrame x={830} y={780} scale={0.62} tilt={6} glow="#ffffff" glowK={0.2} f={f}><IdentifiedScreen f={f} start={C6 + 3} name="МАРК" /></PhoneFrame>
          <PhoneFrame x={540} y={720} scale={0.86} tilt={-1} glow="#ffffff" glowK={0.35} f={f}><IdentifiedScreen f={f} start={C6} name="МАРК" /></PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= BLACK && f < TITLE && <AbsoluteFill style={{background: '#000', opacity: ramp(f, BLACK, BLACK + 8)}} />}
      {f >= TITLE && <AbsoluteFill style={{background: C.void}}><EpisodeCard f={f} start={TITLE} part={2} teaser="ЧАСТЬ 3: КТО ВОШЁЛ?" /></AbsoluteFill>}
      {/* статус-строка этапа */}
      {f >= PH && f < BLACK && (
        <div style={{position: 'absolute', left: 48, top: 64}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 40, background: 'rgba(5,7,12,0.55)', fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: 30, color: C.white}}>
            <span>{fmt(remaining)}</span>
            <span style={{width: 8, height: 8, borderRadius: 4, background: C.grey, opacity: 0.6}} />
            <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 26, color: C.red, letterSpacing: 1.5}}>ЭТАП 2</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
