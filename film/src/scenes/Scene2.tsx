import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character, Who} from '../components/Character';
import {Chip} from '../components/Overlay';
import {Cage} from '../components/Shelter';
import {along, BuildingSection, floorY, SEC, stairPath} from '../components/Section';
import {C} from '../theme';
import {line, mk, mouthAny} from '../timeline';
import {blink, keys, ramp, rand} from '../util';

const SZ = 0.56; // масштаб персонажей в разрезе
const SPEED = 3.0; // px/кадр по маршруту

const doorX = (apt: 0 | 1) => SEC.left + 10 + apt * 335 + 320 - 26;

/** Жильцы: этаж, квартира, задержка выхода (кадры). */
const RESIDENTS = Array.from({length: 7}).map((_, i) => ({
  floor: [0, 2, 1, 3, 0, 2, 4][i],
  apt: ([0, 1, 0, 0, 1, 0, 1] as const)[i],
  delay: [0, 20, 50, 70, 110, 140, 30][i],
  top: ['#4a3a48', '#3a4a3e', '#4a4236', '#36404a', '#4a3434', '#2f3a4a', '#3c3c46'][i],
  hair: ['#5a4030', '#1a1a1a', '#9a9a9a', '#2a1a14', '#151515', '#6b5a40', '#202020'][i],
  style: (['galina', 'mark', 'lev', 'alisa', 'mark', 'lev', 'mark'] as Who[])[i],
  scale: 0.9 + rand(i + 2) * 0.15,
}));

/** Позиция идущего по маршруту с остановками: segs — [кадр начала, маршрут]. */
const walker = (f: number, segs: {from: number; pts: [number, number][]}[]) => {
  let pos = along(segs[0].pts, 0);
  for (const s of segs) {
    if (f >= s.from) pos = along(s.pts, (f - s.from) * SPEED);
  }
  return pos;
};

export const Scene2: React.FC<{f: number}> = ({f}) => {
  const S = mk('s2');
  const CLOSE = mk('s2_close');
  const GAL = mk('s2_galina_in');
  const SMILE = mk('s2_smile');
  const FLICK = mk('s2_flicker');
  const M3 = line('s2_mark_3');
  const END = mk('s2_end');
  const lf = f - S;

  // Марк и Алиса: этаж 1 → площадка этажа 3 (диалог) → дальше вниз после «Идём быстрее»
  const y1 = floorY(1);
  const stopAt = floorY(3);
  const go2 = M3.start + M3.dur - 10;
  const markPts: [number, number][] = [[doorX(1), y1], [SEC.stairR - 40, y1], ...stairPath(1, 3)];
  const mPos = walker(f, [{from: S + 42, pts: markPts}, {from: go2, pts: [[SEC.stairR - 80, stopAt], ...stairPath(3, 6).slice(1)]}]);
  const mStop = mPos.y >= stopAt - 1 && f < go2;
  const mark = mStop ? {x: SEC.stairR - 80, y: stopAt, dir: 1 as const, moving: false} : mPos;
  const aPos = walker(f, [{from: S + 52, pts: markPts}, {from: go2 + 8, pts: [[SEC.stairR - 140, stopAt], ...stairPath(3, 6).slice(1)]}]);
  const aStop = aPos.y >= stopAt - 1 && f < go2 + 8;
  const alisa = aStop ? {x: SEC.stairR - 140, y: stopAt, dir: 1 as const, moving: false} : aPos;

  // Галина догоняет сверху: с этажа 1 по маршам до площадки этажа 3
  const galPts: [number, number][] = [[SEC.stairR - 40, floorY(1)], ...stairPath(1, 3).slice(1)];
  const gPos = walker(f, [{from: GAL - 70, pts: galPts}, {from: go2 + 14, pts: [[SEC.stairR - 20, stopAt], ...stairPath(3, 6).slice(1)]}]);
  const gStop = gPos.y >= stopAt - 1 && f < go2 + 14;
  const galina = gStop ? {x: SEC.stairR - 20, y: stopAt, dir: -1 as const, moving: false} : gPos;

  // камера: общий план разреза с проездом вниз → крупнее на площадке
  const cs = keys(f, [[S, 1.0], [CLOSE, 1.08], [CLOSE + 26, 1.75], [END, 1.8]]);
  const ccx = keys(f, [[S, 560], [CLOSE, 640], [CLOSE + 26, SEC.stairR - 110], [END, SEC.stairR - 120]]);
  const ccy = keys(f, [[S, floorY(1) + 60], [CLOSE, floorY(2) + 80], [CLOSE + 26, stopAt - 130], [END, stopAt - 120]]);

  // мигание света
  const fl = f - FLICK;
  const flicker = fl < 0 ? 1 : fl < 42 ? ([1, 0, 1, 0.2, 0, 1, 0.1, 0, 0, 1, 0.6, 1][Math.floor(fl / 3.5)] ?? 1) : 0.75;
  const smile = f >= SMILE && f < FLICK + 4 ? ramp(f, SMILE, SMILE + 8) : 0;

  const talking = f >= GAL;
  const step = (moving: boolean, ph = 0) => (moving ? (f + ph) / 3.2 : 0);

  return (
    <AbsoluteFill style={{background: C.void}}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <g transform={`translate(540 760) scale(${cs}) translate(${-ccx} ${-ccy})`}>
          <BuildingSection f={f} lights={flicker}>
            {RESIDENTS.map((r, i) => {
              const pts: [number, number][] = [[doorX(r.apt), floorY(r.floor)], [SEC.stairR - 40, floorY(r.floor)], ...stairPath(r.floor, Math.min(r.floor + 4, 7)).slice(1)];
              const p = along(pts, Math.max(0, lf - r.delay) * SPEED * 0.9);
              if (lf < r.delay) return null;
              if (p.y > floorY(6) + 10) return null;
              return (
                <Character key={i} who="mark" hair={r.style} x={p.x} y={p.y} size={SZ * r.scale} facing={p.dir} frame={f + i * 13}
                  override={{top: r.top, topShade: r.top, hair: r.hair, bottom: '#23262d'}}
                  pose={{step: step(p.moving, i * 5), armF: [20, -10], armB: [-20, -10], blink: blink(f, i + 7), rim: 0.3}} />
              );
            })}
            <Character who="alisa" x={alisa.x} y={alisa.y} size={SZ} facing={alisa.dir} frame={f}
              pose={{step: step(alisa.moving, 3), armF: alisa.moving ? [45, -10] : [40, -10], blink: blink(f, 4), look: 0.4, lookUp: talking ? 0.5 : 0,
                mouth: 0, smile, brow: f > FLICK ? 0.8 : 0.2}} />
            <Character who="mark" x={mark.x} y={mark.y} size={SZ} facing={talking && mStop ? 1 : mark.dir} frame={f}
              pose={{step: step(mark.moving), armB: [-40, -10], blink: blink(f, 1), look: 0.3, lookUp: talking && mStop ? 0.3 : 0,
                mouth: mouthAny(['s2_mark_0', 's2_mark_1', 's2_mark_2', 's2_mark_3'], f), brow: f > FLICK ? 0.8 : 0.4}} />
            <g>
              <Character who="galina" x={galina.x} y={galina.y} size={SZ} facing={galina.dir} frame={f}
                pose={{step: step(galina.moving, 2), armF: [70, -40], blink: blink(f, 9), look: 0.2,
                  mouth: mouthAny(['s2_galina_1', 's2_galina_2', 's2_galina_3', 's2_galina_4'], f), brow: f > FLICK ? 1 : 0.5}} />
              <Cage x={galina.x + galina.dir * 58} y={galina.y - 120} f={f} s={0.5}
                flap={(f >= line('s2_galina_1').start && f < line('s2_galina_1').start + 30) || (f >= line('s2_galina_3').start + 10 && f < line('s2_galina_3').start + 40) ? f * 1.4 : 0} />
            </g>
          </BuildingSection>
        </g>
      </svg>
      {lf < 120 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - ramp(lf, 100, 118)}}>
          <Chip x={540} y={330} text="ПОДЪЕЗД № 3" kind="white" t={ramp(lf, 10, 22)} tilt={-2} size={30} />
          <Chip x={540} y={398} text="ВСЕ СПУСКАЮТСЯ В ПОДВАЛ" kind="yellow" t={ramp(lf, 24, 36)} tilt={1.5} size={22} />
        </div>
      )}
      {f >= CLOSE + 30 && f < GAL + 10 && <Chip x={760} y={330} text="9 ЭТАЖЕЙ ВНИЗ" kind="red" t={ramp(f, CLOSE + 30, CLOSE + 42) * (1 - ramp(f, GAL, GAL + 10))} tilt={2} size={22} />}
    </AbsoluteFill>
  );
};

