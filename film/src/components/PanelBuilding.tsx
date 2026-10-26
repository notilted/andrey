import React from 'react';
import {C} from '../theme';
import {rand} from '../util';

export type WinKind = 'dark' | 'dim' | 'lit' | 'curtain' | 'tv' | 'kettle' | 'mark';

const SIL = '#151821';
export const WIN_W = 84;
export const WIN_H = 62;

/** Окно с жизнью внутри: силуэты на жёлтом свете — как в референсе. */
export const Window: React.FC<{kind: WinKind; f: number; seed?: number; alert?: number}> = ({kind, f, seed = 0, alert = 0}) => {
  const w = WIN_W;
  const h = WIN_H;
  const id = `w${seed}`;
  let inner: React.ReactNode = null;
  if (kind === 'dark') inner = <rect width={w} height={h} fill={C.winDark} />;
  if (kind === 'dim') inner = <rect width={w} height={h} fill={C.winDim} />;
  if (kind === 'lit' || kind === 'curtain') {
    inner = (
      <g>
        <rect width={w} height={h} fill={rand(seed) > 0.5 ? C.warmSoft : C.warm} opacity={0.92} />
        {kind === 'curtain' && <path d={`M0 0 H${w * 0.42} Q${w * 0.3} ${h / 2} ${w * 0.36} ${h} H0 Z`} fill="#c98d34" opacity={0.85} />}
      </g>
    );
  }
  if (kind === 'tv') {
    const fl = 0.55 + 0.25 * Math.sin(f * 0.9) + 0.2 * Math.sin(f * 2.3 + 1);
    inner = (
      <g>
        <rect width={w} height={h} fill="#1b2335" />
        <rect width={w} height={h} fill={C.tv} opacity={0.35 * fl} />
        <rect x={56} y={22} width={22} height={16} fill="#cfe0ff" opacity={0.6 + 0.4 * fl} />
        <rect x={64} y={38} width={6} height={8} fill={SIL} />
        {/* кресло и голова со спины */}
        <path d="M6 62 V38 Q6 30 14 30 H34 Q42 30 42 38 V62 Z" fill={SIL} />
        <circle cx={26} cy={26} r={9} fill={SIL} />
      </g>
    );
  }
  if (kind === 'kettle') {
    inner = (
      <g>
        <rect width={w} height={h} fill={C.warmSoft} />
        <rect x={0} y={44} width={w} height={18} fill="#c8a24c" />
        {/* женщина у плиты */}
        <circle cx={26} cy={18} r={7.5} fill={SIL} />
        <circle cx={21} cy={11} r={4.5} fill={SIL} />
        <path d="M17 62 L19 30 Q20 26 26 26 Q32 26 33 30 L36 62 Z" fill={SIL} />
        <path d={`M32 33 L${46 + Math.sin(f / 9) * 2} 40`} stroke={SIL} strokeWidth={5} strokeLinecap="round" />
        {/* чайник и пар */}
        <path d="M50 44 Q50 34 58 34 Q66 34 66 44 Z" fill={SIL} />
        <path d="M66 38 L72 34" stroke={SIL} strokeWidth={3} />
        {[0, 1, 2].map((i) => {
          const p = ((f / 40 + i / 3) % 1);
          return <circle key={i} cx={73 + Math.sin(p * 6 + i) * 3} cy={32 - p * 26} r={2 + p * 4} fill="#fff" opacity={0.55 * (1 - p)} />;
        })}
      </g>
    );
  }
  if (kind === 'mark') {
    const hand = Math.sin(f / 4) * 2;
    inner = (
      <g>
        <rect width={w} height={h} fill={C.warmSoft} />
        <rect width={w} height={h} fill={C.red} opacity={alert} />
        <rect x={10} y={42} width={64} height={5} fill={SIL} />
        <rect x={16} y={47} width={4} height={15} fill={SIL} />
        <rect x={64} y={47} width={4} height={15} fill={SIL} />
        {/* Марк */}
        <circle cx={22} cy={22} r={7} fill={SIL} />
        <path d="M13 44 L14 33 Q15 29 22 29 Q29 29 30 33 L31 44 Z" fill={SIL} />
        {/* Алиса с хвостиком, рисует */}
        <circle cx={60} cy={29} r={6} fill={SIL} />
        <path d="M65 25 Q71 28 68 35" stroke={SIL} strokeWidth={3} fill="none" />
        <path d="M53 44 L54 37 Q55 34 60 34 Q65 34 66 37 L67 44 Z" fill={SIL} />
        <path d={`M55 38 L${48 + hand} 42`} stroke={SIL} strokeWidth={3.4} strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g>
      <clipPath id={id}>
        <rect width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{inner}</g>
      <rect width={w} height={h} fill="none" stroke="#11151c" strokeWidth={4} />
      {kind !== 'tv' && kind !== 'kettle' && kind !== 'mark' && <rect x={w / 2 - 1.5} y={0} width={3} height={h} fill="#11151c" />}
      <rect x={0} y={14} width={w} height={3} fill="#11151c" />
      <rect x={-6} y={h} width={w + 12} height={5} fill={C.facadeHi} />
    </g>
  );
};

export const BLD = {x: 170, top: 290, cols: 6, rows: 12, colW: 123, rowH: 80};
export const winPos = (row: number, col: number) => ({
  x: BLD.x + col * BLD.colW + (BLD.colW - WIN_W) / 2,
  y: BLD.top + row * BLD.rowH + 8,
});

/** Панельная многоэтажка; special — окна с виньетками, row/col сверху. */
export const PanelBuilding: React.FC<{f: number; special: Record<string, WinKind>; alert?: number; litBoost?: number}> = ({f, special, alert = 0, litBoost = 0}) => {
  const W = BLD.cols * BLD.colW;
  const Hh = BLD.rows * BLD.rowH;
  return (
    <g>
      <rect x={BLD.x - 14} y={BLD.top - 30} width={W + 28} height={30} fill={C.facadeHi} />
      <rect x={BLD.x + 80} y={BLD.top - 70} width={110} height={40} fill={C.facade} />
      <rect x={BLD.x + 500} y={BLD.top - 110} width={4} height={80} fill={C.facade} />
      <circle cx={BLD.x + 502} cy={BLD.top - 112} r={5} fill={C.red} opacity={Math.floor(f / 22) % 2 ? 1 : 0.2} />
      <rect x={BLD.x} y={BLD.top} width={W} height={Hh} fill={C.facade} />
      {/* швы панелей */}
      {Array.from({length: BLD.rows + 1}).map((_, r) => (
        <rect key={r} x={BLD.x} y={BLD.top + r * BLD.rowH - 1} width={W} height={2} fill={C.seam} />
      ))}
      {Array.from({length: BLD.cols / 2 + 1}).map((_, c) => (
        <rect key={c} x={BLD.x + c * BLD.colW * 2 - 1} y={BLD.top} width={2} height={Hh} fill={C.seam} />
      ))}
      <rect x={BLD.x} y={BLD.top} width={12} height={Hh} fill={C.facadeHi} />
      {Array.from({length: BLD.rows}).map((_, r) =>
        Array.from({length: BLD.cols}).map((__, c) => {
          const s = rand(r * 17 + c * 3 + 5);
          const key = `${r},${c}`;
          let kind: WinKind = s > 0.86 ? 'curtain' : s > 0.74 ? 'lit' : s > 0.5 ? 'dim' : 'dark';
          if (litBoost && kind === 'dark' && rand(r * 7 + c + 99) < litBoost) kind = 'lit';
          if (special[key]) kind = special[key];
          const p = winPos(r, c);
          return (
            <g key={key} transform={`translate(${p.x} ${p.y})`}>
              <Window kind={kind} f={f} seed={r * 10 + c} alert={kind === 'mark' ? alert : 0} />
            </g>
          );
        }),
      )}
      {/* подъезд */}
      <rect x={BLD.x + 300} y={BLD.top + Hh - 70} width={120} height={70} fill="#12161e" />
      <rect x={BLD.x + 290} y={BLD.top + Hh - 84} width={140} height={12} fill={C.facadeHi} />
      <circle cx={BLD.x + 360} cy={BLD.top + Hh - 92} r={6} fill={C.lamp} />
      <circle cx={BLD.x + 360} cy={BLD.top + Hh - 92} r={70} fill="url(#lampHalo)" />
    </g>
  );
};
