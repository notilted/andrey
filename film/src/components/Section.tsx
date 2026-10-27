import React from 'react';
import {C} from '../theme';
import {rand} from '../util';

/**
 * Подъезд панельного дома в разрезе: слева квартиры, справа лестничная клетка с маршами зигзагом.
 * Этаж i (0 — верхний) имеет уровень пола floorY(i).
 */
export const SEC = {left: 40, right: 1040, top: 120, floorH: 250, floors: 7, stairL: 720, stairR: 1020};
export const floorY = (i: number) => SEC.top + (i + 1) * SEC.floorH;

/** Точки маршрута вниз по лестнице: с этажа i на этаж j (j > i). */
export const stairPath = (i: number, j: number) => {
  const pts: [number, number][] = [];
  for (let k = i; k < j; k++) {
    const y = floorY(k);
    pts.push([SEC.stairR - 40, y], [SEC.stairL + 40, y + SEC.floorH / 2], [SEC.stairR - 40, y + SEC.floorH]);
  }
  return pts;
};

/** Положение на ломаной по пройденному расстоянию. */
export const along = (pts: [number, number][], d: number) => {
  let rest = Math.max(0, d);
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const L = Math.hypot(x1 - x0, y1 - y0);
    if (rest <= L) {
      const k = rest / L;
      return {x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, dir: (x1 >= x0 ? 1 : -1) as 1 | -1, moving: true};
    }
    rest -= L;
  }
  const [x, y] = pts[pts.length - 1];
  const [px] = pts[Math.max(0, pts.length - 2)];
  return {x, y, dir: (x >= px ? 1 : -1) as 1 | -1, moving: false};
};

const Flight: React.FC<{x0: number; y0: number; x1: number; y1: number; front: boolean}> = ({x0, y0, x1, y1, front}) => {
  const n = 9;
  const steps = Array.from({length: n}).map((_, i) => {
    const sx = x0 + ((x1 - x0) * i) / n;
    const sy = y0 + ((y1 - y0) * i) / n;
    const w = (x1 - x0) / n;
    const h = (y1 - y0) / n;
    return `L${sx} ${sy + h} L${sx + w} ${sy + h}`;
  });
  const d = `M${x0} ${y0} ${steps.join(' ')} L${x1} ${y1 + 26} L${x0} ${y0 + 26} Z`;
  return (
    <g opacity={front ? 1 : 0.55}>
      <path d={d} fill={front ? '#3a414e' : '#2a303a'} />
      {/* перила */}
      <path d={`M${x0} ${y0 - 70} L${x1} ${y1 - 70}`} stroke={front ? '#555d6b' : '#3a404b'} strokeWidth={5} />
      {Array.from({length: 5}).map((_, i) => {
        const k = (i + 0.5) / 5;
        const x = x0 + (x1 - x0) * k;
        const y = y0 + (y1 - y0) * k;
        return <rect key={i} x={x - 1.5} y={y - 70} width={3} height={70} fill={front ? '#4a515e' : '#343a45'} />;
      })}
    </g>
  );
};

const Apartment: React.FC<{x: number; y: number; w: number; seed: number; f: number; lit: number; flicker: number}> = ({x, y, w, seed, f, lit, flicker}) => {
  const h = SEC.floorH - 30;
  const warm = rand(seed) > 0.35;
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={warm ? '#2f3036' : '#272c36'} />
      {/* окно вглубь */}
      <rect x={x + w * 0.3} y={y - h + 40} width={w * 0.34} height={90} fill="#0f141d" />
      <rect x={x + w * 0.3 + w * 0.17 - 2} y={y - h + 40} width={4} height={90} fill="#1a1e26" />
      {/* мебель */}
      {rand(seed + 1) > 0.5 ? (
        <g fill="#1c2028">
          <rect x={x + 30} y={y - 70} width={110} height={40} rx={8} />
          <rect x={x + 30} y={y - 96} width={30} height={66} rx={8} />
        </g>
      ) : (
        <g fill="#1c2028">
          <rect x={x + w - 160} y={y - 60} width={100} height={8} />
          <rect x={x + w - 150} y={y - 52} width={6} height={52} />
          <rect x={x + w - 72} y={y - 52} width={6} height={52} />
        </g>
      )}
      {/* лампа под потолком */}
      <rect x={x + w / 2} y={y - h} width={2} height={40} fill="#15181e" />
      <circle cx={x + w / 2 + 1} cy={y - h + 46} r={7} fill={C.lamp} opacity={lit * flicker} />
      <rect x={x} y={y - h} width={w} height={h} fill={C.lamp} opacity={(warm ? 0.09 : 0.04) * lit * flicker} />
      {/* дверь на площадку */}
      <rect x={x + w - 46} y={y - 150} width={40} height={150} fill="#3b2f2c" />
      <circle cx={x + w - 14} cy={y - 76} r={3} fill={C.warm} opacity={0.7} />
      <text x={x + w - 26} y={y - 160} fill="#8a909b" fontSize={16} fontWeight={800} textAnchor="middle" fontFamily="Montserrat">{seed + 40}</text>
    </g>
  );
};

/**
 * Разрез подъезда. lights — уровень света 0..1 (для мигания), people рисуются снаружи (как children).
 */
export const BuildingSection: React.FC<{f: number; lights?: number; children?: React.ReactNode; front?: React.ReactNode; labelTop?: number}> = ({f, lights = 1, children, front, labelTop}) => {
  const {left, right, top, floorH, floors, stairL, stairR} = SEC;
  return (
    <g>
      <rect x={-600} y={-600} width={2400} height={3600} fill={C.facade} />
      <rect x={left} y={top} width={right - left} height={floorH * floors} fill="#20252e" />
      {/* лестничная клетка: стена с окнами */}
      <rect x={stairL} y={top} width={stairR - stairL} height={floorH * floors} fill="#262b34" />
      {Array.from({length: floors}).map((_, i) => {
        const y = floorY(i);
        const fl = lights * (0.85 + 0.15 * Math.sin(f / 7 + i));
        return (
          <g key={i}>
            <Apartment x={left + 10} y={y} w={320} seed={i * 2 + 1} f={f} lit={rand(i + 3) > 0.2 ? 1 : 0.2} flicker={lights} />
            <Apartment x={left + 345} y={y} w={320} seed={i * 2 + 2} f={f} lit={rand(i + 9) > 0.3 ? 1 : 0.2} flicker={lights} />
            {/* площадка и марши */}
            <rect x={stairL} y={y} width={stairR - stairL} height={8} fill="#3a414e" />
            <rect x={stairL} y={y + floorH / 2} width={90} height={8} fill="#2e343f" />
            <Flight x0={stairR - 40} y0={y} x1={stairL + 40} y1={y + floorH / 2} front={false} />
            {/* окно лестницы и лампочка площадки */}
            <rect x={stairL + 140} y={y + 40} width={70} height={90} fill="#0d121b" />
            <rect x={stairL + 174} y={y + 40} width={3} height={90} fill="#1a1e26" />
            <circle cx={stairR - 60} cy={y - floorH + 50} r={8} fill={C.lamp} opacity={fl} />
            <circle cx={stairR - 60} cy={y - floorH + 50} r={70} fill="url(#bulbHalo)" opacity={fl} />
            <text x={stairL + 20} y={y - floorH + 60} fill="#6a707c" fontSize={30} fontWeight={900} fontFamily="Montserrat">{(labelTop ?? floors + 2) - i}</text>
          </g>
        );
      })}
      <defs>
        <radialGradient id="bulbHalo">
          <stop offset="0" stopColor={C.lamp} stopOpacity={0.3} />
          <stop offset="1" stopColor={C.lamp} stopOpacity={0} />
        </radialGradient>
      </defs>
      {children}
      {/* ближние марши поверх людей на дальних */}
      {Array.from({length: floors}).map((_, i) => {
        const y = floorY(i);
        return <Flight key={i} x0={stairL + 40} y0={y + floorH / 2} x1={stairR - 40} y1={y + floorH} front />;
      })}
      {front}
      {/* перекрытия-разрез */}
      {Array.from({length: floors + 1}).map((_, i) => (
        <rect key={i} x={left - 30} y={top + i * floorH - 4} width={right - left + 60} height={26} fill={C.facadeHi} />
      ))}
      <rect x={left - 30} y={top} width={30} height={floorH * floors} fill={C.facadeHi} />
      <rect x={right} y={top} width={30} height={floorH * floors} fill={C.facadeHi} />
      <rect x={stairL - 12} y={top} width={12} height={floorH * floors} fill={C.facadeHi} />
      {/* тьма при мигании света */}
      <rect x={-600} y={-600} width={2400} height={3600} fill="#000" opacity={(1 - lights) * 0.75} />
    </g>
  );
};
