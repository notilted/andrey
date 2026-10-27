import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Character} from '../components/Character';
import {Chip} from '../components/Overlay';
import {CctvView, EndCard, MessageScreen, PhoneFrame, StageScreen, TimerScreen} from '../components/Phone';
import {Cage, ChessCloseup, EXTRAS, SH, ShelterBack, ShelterFront, ShelterLight} from '../components/Shelter';
import {C} from '../theme';
import {timerLev, timerMark} from '../timers';
import {line, mk, mouth, mouthAny} from '../timeline';
import {blink, ease, keys, ramp, rand} from '../util';

/** Сцены 3–7: всё действие в убежище № 17. f — глобальный кадр. */

type Cam = [number, number, number, number]; // кадр, cx, cy, масштаб

/** Камера по монтажному листу: плавные переходы и жёсткие склейки (два ключа подряд). */
const camera = (f: number, list: Cam[]) => {
  const k = (i: 1 | 2 | 3) => keys(f, list.map((c) => [c[0], c[i]] as [number, number]), ease);
  return {cx: k(1), cy: k(2), s: k(3)};
};

const WIDE = (fr: number): Cam => [fr, 560, 740, 0.78];

const fade = (f: number, a: number, b: number, d = 5) => ramp(f, a, a + d) * (1 - ramp(f, b - d, b));

export const SceneShelter: React.FC<{f: number}> = ({f}) => {
  // ── маркеры ──
  const S3 = mk('s3');
  const CHESS = mk('s3_chess');
  const BACK = mk('s3_back');
  const NOTICE = mk('s3_notice');
  const PH = mk('s3_phones');
  const PHE = mk('s3_phones_end');
  const LOOKUP = mk('s3_lookup');
  const PH2 = mk('s3_phones2');
  const L3 = line('s3_lev_3');
  const S4 = mk('s4');
  const RISE = mk('s4_rise');
  const WALK = mk('s4_walk');
  const LEV4 = line('s4_lev_1');
  const LISTEN = mk('s4_listen');
  const M4 = line('s4_mark_1');
  const IMPACT = mk('s4_impact');
  const DARK = mk('s4_dark');
  const S5 = mk('s5');
  const A5 = line('s5_alisa_1');
  const MSG = mk('s5_msg');
  const MSGE = mk('s5_msg_end');
  const KN = mk('s5_knock');
  const KNE = mk('s5_knock_end');
  const RES = line('s5_rescuer_1');
  const GGO = mk('s5_galina_go');
  const M52 = line('s5_mark_2');
  const KN2 = mk('s5_knock2');
  const DBL = line('s5_double_1');
  const A52 = line('s5_alisa_2');
  const TURN = mk('s5_turn');
  const S6 = mk('s6');
  const ON = mk('s6_on');
  const L61 = line('s6_lev_1');
  const PUSH = mk('s6_push');
  const D6 = line('s6_double_1');
  const BACK6 = mk('s6_back');
  const L62 = line('s6_lev_2');
  const S7 = mk('s7');
  const BACK7 = mk('s7_back');
  const A7 = line('s7_alisa_1');
  const BLACK = mk('s7_black');
  const TITLE = mk('s7_title');

  // ── свет ──
  const lampsOff = ramp(f, IMPACT + 4, DARK, ease);
  const flickerImpact = f >= IMPACT && f < DARK ? (Math.floor(f / 2) % 2 ? 0.2 : 1) : 1;
  const light: ShelterLight = {
    lamps: f < IMPACT ? 1 : (1 - lampsOff) * flickerImpact,
    red: ramp(f, S5 + 10, S5 + 50),
    monitor: 0,
  };
  const monitorOn = f >= ON ? ramp(f, ON, ON + 8) * (0.9 + 0.1 * Math.sin(f)) : 0;
  const blackout = f >= DARK && f < S5 + 12 ? 1 - ramp(f, S5, S5 + 12) : 0;

  // ── камера ──
  const cam = camera(f, [
    WIDE(S3), [S3 + 130, 520, 760, 0.84],
    [BACK - 1, 520, 760, 0.84], [BACK, 900, 800, 1.25], [NOTICE, 900, 800, 1.25],
    [NOTICE + 14, 800, 790, 1.12], [LOOKUP, 860, 790, 1.2], [L3.start, 980, 780, 1.45],
    [S4 - 1, 980, 780, 1.45], [S4, 560, 520, 1.6], [RISE - 2, 560, 560, 1.5], [RISE + 14, 560, 740, 0.8],
    [LEV4.start - 1, 560, 740, 0.8], [LEV4.start, 960, 780, 1.3], [LISTEN, 960, 780, 1.3],
    [LISTEN + 1, 470, 760, 1.25], [M4.start + 10, 300, 760, 1.05], [IMPACT, 300, 760, 1.05], [IMPACT + 20, 380, 740, 0.9],
    [S5, 520, 790, 1.3], [A5.start, 480, 810, 1.4], [KN - 1, 480, 810, 1.4], [KN, 40, 740, 1.15], [KNE, 40, 740, 1.2],
    [RES.start + RES.dur, 260, 760, 0.95], [M52.start, 320, 770, 1.0], [KN2, 40, 760, 1.15], [DBL.start, 200, 760, 0.95],
    [A52.start - 1, 200, 760, 0.95], [A52.start, 470, 760, 1.75], [TURN + 60, 440, 760, 1.85],
    [S6, 440, 760, 1.85], [S6 + 1, 1100, 780, 1.2], [L61.start + L61.dur, 1050, 780, 1.15], [PUSH, 1150, 760, 1.6],
    [BACK6, 1150, 760, 1.6], [BACK6 + 1, 980, 790, 1.2], [L62.start + L62.dur, 980, 790, 1.3],
    [S7, 980, 790, 1.3], [BACK7, 500, 780, 1.7], [BLACK, 480, 770, 1.9],
  ]);
  // тряска при ударе
  const shakeK = f >= IMPACT ? Math.max(0, 1 - (f - IMPACT) / 40) : 0;
  const shx = shakeK * 26 * Math.sin(f * 2.1);
  const shy = shakeK * 20 * Math.cos(f * 2.9);
  // удары в дверь
  const knockAt = [KN, KN + 30, KN + 60, KN2];
  const doorShake = knockAt.reduce((a, k) => Math.max(a, f >= k && f < k + 12 ? 1 - (f - k) / 12 : 0), 0);

  // ── персонажи ──
  // вход: от двери к местам
  const enter = (from: number, x: number, delay: number) => interpolate(f, [S3 + delay, S3 + delay + 90], [from, x], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const walking = (a: number, b: number) => f > a && f < b;
  let markX = enter(-60, 520, 10);
  let markFacing: 1 | -1 = 1;
  if (f >= M4.start - 10) markX = interpolate(f, [M4.start - 10, M4.start + 30], [520, 150], {extrapolateRight: 'clamp', easing: ease});
  if (f >= M4.start + 30) markFacing = 1;
  if (f >= M4.start - 10 && f < M4.start + 30) markFacing = -1;
  if (f >= S5) markX = 520;
  if (f >= GGO && f < S6) markFacing = -1;
  if (f >= TURN) markFacing = -1;
  if (f >= S6 + 1) {
    markX = interpolate(f, [L61.start, PUSH], [520, 1010], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
    markFacing = 1;
  }
  if (f >= BACK6) markX = interpolate(f, [BACK6, BACK6 + 20], [1010, 930], {extrapolateRight: 'clamp', easing: ease});
  if (f >= S7) { markX = 560; markFacing = -1; }
  const markMoving = walking(S3 + 10, S3 + 100) || walking(M4.start - 10, M4.start + 30) || walking(L61.start, PUSH) || walking(BACK6, BACK6 + 20);

  let alisaX = enter(-120, 440, 22);
  if (f >= S5) alisaX = 455;
  if (f >= S7) alisaX = 470;
  const alisaFacing: 1 | -1 = f >= S7 && f >= A7.start - 20 ? 1 : f >= S5 ? 1 : 1;

  let galX = enter(-160, 700, 40);
  let galFacing: 1 | -1 = 1;
  if (f >= WALK) galX = interpolate(f, [WALK, WALK + 90], [700, 330], {extrapolateRight: 'clamp', easing: ease});
  if (f >= WALK) galFacing = -1;
  if (f >= LEV4.start + 20) galFacing = 1;
  if (f >= S5) { galX = 680; galFacing = -1; }
  if (f >= GGO) galX = interpolate(f, [GGO, M52.start + 16], [680, 260], {extrapolateRight: 'clamp', easing: ease});
  if (f >= M52.start + 16) galFacing = 1;
  if (f >= S6) { galX = 300; galFacing = 1; }
  const galMoving = walking(S3 + 40, S3 + 130) || walking(WALK, WALK + 90) || walking(GGO, M52.start + 16);

  const levSit = f < LEV4.start ? 1 : f < S5 ? 1 - ramp(f, LEV4.start, LEV4.start + 14) : 0;
  const levX = f < S5 ? 1120 : f < S6 + 1 ? 1100 : 1150;
  const levFacing: 1 | -1 = f >= ON + 10 && f < BACK6 ? 1 : -1;
  const levLookUp = f < LOOKUP ? -0.7 : f < L3.start ? 0.3 : f < S4 ? -0.4 : 0.2;

  const markLookUp = f >= LISTEN && f < M4.start ? 0.8 : f >= NOTICE && f < PH ? -0.3 : 0.1;
  const markBrow = f < S4 ? 0.4 : f < RISE ? 0.2 : 0.8;
  const alisaHold = f >= S5 && f < S6; // держит папу за руку

  const extrasUp = f >= RISE ? ramp(f, RISE, RISE + 16) : 0;
  const extrasDrift = f >= WALK ? interpolate(f, [WALK, WALK + 70], [0, -90], {extrapolateRight: 'clamp'}) * (1 - ramp(f, LEV4.start + 20, LEV4.start + 50)) : 0;
  const phonesWhite = f >= S7 && f < BLACK;

  const rimC = light.red > 0.3 ? C.redHot : C.warm;

  // пыль после удара и стуков
  const dust = (from: number, n: number, area: [number, number]) =>
    f >= from && f < from + 70
      ? Array.from({length: n}).map((_, i) => {
          const t = (f - from) / 70;
          const x = area[0] + rand(i + from) * (area[1] - area[0]);
          const y = SH.ceil + 20 + t * (500 + rand(i * 3) * 400);
          return <circle key={`${from}-${i}`} cx={x + Math.sin(t * 6 + i) * 10} cy={y} r={1.5 + rand(i) * 2.5} fill="#bdb6a6" opacity={0.6 * (1 - t)} />;
        })
      : null;

  const camT = `translate(${540 + shx} ${800 + shy}) scale(${cam.s}) translate(${-cam.cx} ${-cam.cy})`;
  const showRoom = !(f >= DARK && f < S5) && f < BLACK + 2;

  return (
    <AbsoluteFill style={{background: C.void}}>
      {showRoom && (
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute'}}>
          <g transform={camT}>
            <ShelterBack f={f} light={light} doorShake={doorShake} />
            {/* массовка на скамьях */}
            {EXTRAS.map((e, i) => {
              const up = Math.min(1, extrasUp * (0.7 + rand(i) * 0.6));
              const x = e.x + extrasDrift * (0.6 + rand(i + 1) * 0.5);
              return (
                <g key={i}>
                  <Character who="mark" hair={e.style} x={x} y={SH.floor - 60 + (1 - up) * 0} size={1.05 * e.scale} facing={extrasDrift < -5 ? -1 : e.facing} frame={f + i * 11}
                    override={{top: e.top, topShade: e.top, hair: e.hair, bottom: '#202329'}}
                    pose={{sit: 1 - up, armF: up > 0.5 ? [10, -10] : [55, -95], armB: [-10, -10], lookUp: up > 0.5 ? 0.2 : -0.7, blink: blink(f, i + 20), rim: 0.25, rimColor: rimC,
                      smile: f >= RISE && f < LEV4.start ? 0.8 : 0, brow: f >= LEV4.start ? 0.7 : 0.3}} />
                  {/* свет экрана телефона на лице */}
                  {up < 0.5 && (
                    <circle cx={x + e.facing * 40} cy={SH.floor - 60 - 210 * e.scale} r={55} fill={phonesWhite ? '#fff' : '#9ec0ff'} opacity={phonesWhite ? 0.35 : 0.12 + 0.05 * Math.sin(f / 7 + i)} />
                  )}
                </g>
              );
            })}
            {/* Лев */}
            <rect x={levX + 30} y={1004} width={70} height={12} fill="#3a3230" opacity={levSit} />
            <Character who="lev" x={levX} y={SH.floor} size={1.2} facing={levFacing} frame={f}
              pose={{sit: levSit, lean: levSit * 8, armF: levSit > 0.5 ? [64, -70] : [10, -14], lookUp: levLookUp, look: 0.4, blink: blink(f, 6),
                mouth: mouthAny(['s3_lev_1', 's3_lev_2', 's3_lev_3', 's4_lev_1', 's6_lev_1', 's6_lev_2'], f), brow: f > S5 ? 0.6 : -0.2, rimColor: rimC}} />
            {/* Галина с клеткой */}
            <Character who="galina" x={galX} y={SH.floor} size={1.12} facing={galFacing} frame={f}
              pose={{step: galMoving ? f / 3.4 : 0, armF: f < S5 ? [70, -40] : [20, -20], blink: blink(f, 9), look: 0.3,
                mouth: mouthAny(['s3_galina_1', 's3_galina_2', 's4_galina_1', 's4_galina_2'], f), brow: f > IMPACT ? 1 : f >= RISE && f < LEV4.start ? -0.3 : 0.5,
                smile: f >= RISE && f < LEV4.start ? 0.9 : 0, rimColor: rimC}} />
            {f < S5 ? (
              <Cage x={galX + galFacing * 92} y={SH.floor - 215} f={f} s={0.85} flap={f >= line('s3_galina_1').start && f < line('s3_galina_1').start + 30 ? f * 1.4 : 0} />
            ) : (
              <Cage x={galX + 40} y={SH.floor - 4} f={f} s={0.8} />
            )}
            {/* Алиса */}
            <Character who="alisa" x={alisaX} y={SH.floor} size={1.2} facing={alisaFacing} frame={f}
              pose={{step: walking(S3 + 22, S3 + 112) ? f / 3 : 0, armF: alisaHold ? [62, -20] : [30, -10], blink: blink(f, 4), look: 0.5,
                lookUp: alisaHold ? 0.8 : 0.3, mouth: mouthAny(['s5_alisa_1', 's5_alisa_2', 's7_alisa_1'], f), brow: f > S4 ? 0.9 : 0.4, rimColor: rimC}} />
            {/* Марк */}
            <Character who="mark" x={markX} y={SH.floor} size={1.2} facing={markFacing} frame={f}
              pose={{step: markMoving ? f / 3.2 : 0,
                armF: f >= M4.start + 20 && f < IMPACT ? [100, -10] : alisaHold && markFacing === 1 ? [-20, -10] : [10, -14],
                armB: f >= M4.start + 20 && f < IMPACT ? [-100, 10] : alisaHold ? [-30, -10] : [-8, -14],
                look: f >= TURN && f < S6 ? -0.4 : 0.3, lookUp: markLookUp, blink: blink(f, 1), brow: markBrow,
                mouth: mouthAny(['s3_mark_1', 's4_mark_1', 's4_mark_2', 's5_mark_1', 's5_mark_2', 's6_mark_1'], f), rimColor: rimC}} />
            <ShelterFront f={f} light={light} chessT={ramp(f, CHESS + 20, CHESS + 60)} monitorOn={monitorOn} />
            {/* телефон Льва на столе */}
            <rect x={SH.table.x + 40} y={SH.table.top - 6} width={60} height={7} rx={2} fill="#0d0f14" />
            <ellipse cx={SH.table.x + 70} cy={SH.table.top - 20} rx={60} ry={30} fill={phonesWhite ? '#fff' : C.redHot} opacity={phonesWhite ? 0.4 : 0.18} />
            {dust(IMPACT, 60, [-200, 1300])}
            {knockAt.map((k) => dust(k, 12, [-180, 120]))}
          </g>
        </svg>
      )}
      <AbsoluteFill style={{background: '#000', opacity: blackout}} />

      {/* ── вставки крупных планов ── */}
      {f >= CHESS && f < BACK && (
        <AbsoluteFill style={{opacity: fade(f, CHESS, BACK)}}>
          <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
            <ChessCloseup f={f} moveT={ramp(f, CHESS + 20, CHESS + 60)} />
          </svg>
        </AbsoluteFill>
      )}
      {((f >= PH && f < PHE) || (f >= PH2 && f < L3.start + 24)) && (
        <AbsoluteFill style={{background: 'rgba(6,8,13,0.9)', opacity: f < PHE ? fade(f, PH, PHE) : fade(f, PH2, L3.start + 24)}}>
          <PhoneFrame x={300} y={720} scale={0.82} tilt={-4} glowK={0.3} f={f}>
            <TimerScreen owner="ЛЕВ" remaining={timerLev(f)} color={C.warm} />
          </PhoneFrame>
          <PhoneFrame x={780} y={740} scale={0.82} tilt={3} glowK={0.45} f={f}>
            <TimerScreen owner="МАРК" remaining={timerMark(f)} color={C.redHot} />
          </PhoneFrame>
          <Chip x={540} y={1250} text={f < PHE ? 'РАЗНОЕ ВРЕМЯ' : 'ИДУТ С РАЗНОЙ СКОРОСТЬЮ'} kind="red" t={ramp(f, f < PHE ? PH + 20 : PH2 + 10, (f < PHE ? PH : PH2) + 32)} tilt={-1.5} size={26} />
        </AbsoluteFill>
      )}
      {f >= MSG && f < MSGE && (
        <AbsoluteFill style={{background: 'rgba(6,8,13,0.92)', opacity: fade(f, MSG, MSGE)}}>
          <PhoneFrame x={540} y={720} f={f} scale={interpolate(f, [MSG, MSGE], [0.94, 1.0])} shake={f < MSG + 24 ? 0.8 : 0} glow="#d85445" glowK={0.35}>
            <MessageScreen f={f} start={MSG + 4} text="АЛИСА ДОЛЖНА ОСТАТЬСЯ ВНУТРИ." time="23:55" remaining={timerMark(f)} />
          </PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= PUSH && f < BACK6 && (
        <AbsoluteFill style={{background: '#050608', opacity: fade(f, PUSH, BACK6, 6)}}>
          <div style={{position: 'absolute', left: 540, top: 700, transform: `translate(-50%,-50%) scale(${interpolate(f, [PUSH, BACK6], [0.98, 1.12])})`}}>
            <div style={{padding: 34, borderRadius: 46, background: '#1b1e24', boxShadow: '0 0 160px rgba(159,179,166,0.25)'}}>
              <div style={{borderRadius: 26, overflow: 'hidden'}}>
                <CctvView f={f} mouth={mouth('s6_double_1', f)} approach={ramp(f, PUSH, D6.start + D6.dur)} blink={blink(f, 30)} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      {f >= S7 && f < BACK7 && (
        <AbsoluteFill style={{background: 'rgba(6,8,13,0.92)', opacity: fade(f, S7, BACK7, 4)}}>
          <PhoneFrame x={250} y={760} scale={0.62} tilt={-7} glow="#ffffff" glowK={0.2} f={f}>
            <StageScreen f={f} start={S7 + 6} copies={interpolate(f, [S7 + 32, S7 + 110], [0, 2847193], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
          </PhoneFrame>
          <PhoneFrame x={830} y={780} scale={0.62} tilt={6} glow="#ffffff" glowK={0.2} f={f}>
            <StageScreen f={f} start={S7 + 3} copies={interpolate(f, [S7 + 30, S7 + 108], [0, 2847193], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
          </PhoneFrame>
          <PhoneFrame x={540} y={720} scale={0.86} tilt={-1} glow="#ffffff" glowK={0.35} f={f}>
            <StageScreen f={f} start={S7} copies={interpolate(f, [S7 + 28, S7 + 105], [0, 2847193], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
          </PhoneFrame>
        </AbsoluteFill>
      )}
      {/* плашки */}
      {f >= S3 + 20 && f < S3 + 130 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - ramp(f, S3 + 110, S3 + 128)}}>
          <Chip x={540} y={330} text="УБЕЖИЩЕ № 17" kind="white" t={ramp(f, S3 + 20, S3 + 32)} tilt={-2} size={30} />
          <Chip x={540} y={398} text="ПОДВАЛ ДОМА" kind="yellow" t={ramp(f, S3 + 34, S3 + 46)} tilt={1.5} size={22} />
        </div>
      )}
      {f >= S5 + 30 && f < A5.start + 20 && <Chip x={540} y={330} text="АВАРИЙНОЕ ОСВЕЩЕНИЕ" kind="red" t={ramp(f, S5 + 30, S5 + 42) * (1 - ramp(f, A5.start, A5.start + 20))} tilt={-1.5} size={22} />}
      {f >= TITLE && <AbsoluteFill style={{background: C.void}}><EndCard f={f} start={TITLE} /></AbsoluteFill>}
      {f >= BLACK && f < TITLE && <AbsoluteFill style={{background: '#000', opacity: ramp(f, BLACK, BLACK + 10)}} />}
    </AbsoluteFill>
  );
};
