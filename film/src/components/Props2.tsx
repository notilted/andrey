import React from 'react';
import {C, MONO} from '../theme';
import {ramp, rand} from '../util';

/** Крупный план: блокнот Льва — шахматная запись двенадцати партий и счёт попыток. t — кадр от открытия. */
export const NotebookCloseup: React.FC<{t: number}> = ({t}) => {
  const open = Math.min(1, t / 14);
  const games = Array.from({length: 12}).map((_, i) => i + 1);
  const shown = Math.floor(ramp(t, 10, 70) * 12);
  return (
    <svg viewBox="0 0 1080 1300" width={1080} height={1300}>
      <rect width={1080} height={1300} fill="#1c1418" />
      <rect width={1080} height={1300} fill={C.redHot} opacity={0.08} />
      <g transform={`translate(540 640) rotate(-4) scale(${0.92 + 0.08 * open})`}>
        {/* обложка и страницы */}
        <rect x={-470} y={-430} width={940} height={860} rx={18} fill="#2a2420" />
        <rect x={-450} y={-410} width={440} height={820} fill="#e6dfcf" />
        <rect x={10} y={-410} width={440} height={820} fill="#ebe5d6" />
        <rect x={-12} y={-410} width={24} height={820} fill="#c9c0ad" />
        {Array.from({length: 22}).map((_, i) => (
          <g key={i}>
            <rect x={-430} y={-370 + i * 36} width={400} height={2} fill="#b9c3cf" opacity={0.6} />
            <rect x={30} y={-370 + i * 36} width={400} height={2} fill="#b9c3cf" opacity={0.6} />
          </g>
        ))}
        {/* левая страница: партии */}
        {games.slice(0, shown).map((g) => (
          <text key={g} x={-420} y={-382 + g * 54} fontFamily={MONO} fontWeight={800} fontSize={28} fill="#2a3550" transform={`rotate(${(rand(g) - 0.5) * 2} -420 ${-382 + g * 54})`}>
            {`Партия ${g}`.padEnd(11)} 1.e4 e5 2.Кf3 {g < 12 ? '× 0:00' : '…'}
          </text>
        ))}
        {/* правая страница: счёт попыток и пометки */}
        <g stroke="#2a3550" strokeWidth={5} strokeLinecap="round" opacity={ramp(t, 30, 44)}>
          {[0, 1].map((grp) => (
            <g key={grp} transform={`translate(${70 + grp * 150} -300)`}>
              {[0, 1, 2, 3].map((k) => <path key={k} d={`M${k * 22} 0 L${k * 22 + 4} 90`} />)}
              <path d="M-10 70 L80 20" />
            </g>
          ))}
          <path d="M370 -300 L374 -210 M392 -300 L396 -210" />
        </g>
        <text x={60} y={-120} fontFamily={MONO} fontWeight={800} fontSize={34} fill={C.red} opacity={ramp(t, 44, 54)}>ЗА ДВЕРЬЮ: 12</text>
        <text x={60} y={-60} fontFamily={MONO} fontWeight={800} fontSize={28} fill="#2a3550" opacity={ramp(t, 54, 64)}>каждый раз +1</text>
        <text x={60} y={40} fontFamily={MONO} fontWeight={800} fontSize={28} fill="#2a3550" opacity={ramp(t, 64, 74)}>М. открыл дверь — 11 раз</text>
        <path d="M60 52 L420 46" stroke={C.red} strokeWidth={4} opacity={ramp(t, 74, 80)} />
        <text x={60} y={140} fontFamily={MONO} fontWeight={800} fontSize={28} fill="#2a3550" opacity={ramp(t, 84, 94)}>НЕ ДАВАТЬ ЕМУ ОТКРЫТЬ</text>
        {/* рука с карандашом */}
        <g transform={`translate(${300 + Math.sin(t / 3) * 6} ${200 + Math.cos(t / 4) * 4})`} opacity={open}>
          <rect x={-8} y={-160} width={14} height={180} rx={4} fill={C.warm} transform="rotate(28)" />
          <path d="M-40 -10 C-40 -50 10 -70 50 -50 C90 -30 100 20 70 50 C40 80 -40 60 -40 -10 Z" fill="#b98e78" />
          <path d="M40 40 C120 80 260 120 520 160 L520 300 C260 260 100 200 20 120 Z" fill="#2c3834" />
        </g>
      </g>
    </svg>
  );
};

/** Крупный план: рисунок Алисы. Тот же дом, солнце и два дерева, но теперь — гермодверь и два папы. */
export const DrawingCloseup: React.FC<{t: number}> = ({t}) => {
  const unfold = Math.min(1, t / 16);
  const reveal = ramp(t, 24, 60);
  return (
    <svg viewBox="0 0 1080 1300" width={1080} height={1300}>
      <rect width={1080} height={1300} fill="#1c1418" />
      <rect width={1080} height={1300} fill={C.redHot} opacity={0.08} />
      <g transform={`translate(540 640) rotate(3) scale(${0.85 + 0.15 * unfold}, ${0.4 + 0.6 * unfold})`}>
        <rect x={-430} y={-320} width={860} height={640} fill="#e9e4d6" />
        <path d="M-430 0 H430" stroke="#cfc8b6" strokeWidth={3} />
        <path d="M0 -320 V320" stroke="#cfc8b6" strokeWidth={3} />
        {/* как на стене дома: дом, солнце, два дерева */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-360 200 L-360 40 L-250 -40 L-140 40 L-140 200 Z" stroke="#c0503f" strokeWidth={10} />
          <rect x={-290} y={110} width={60} height={90} stroke="#c0503f" strokeWidth={8} />
          <circle cx={300} cy={-200} r={60} stroke={C.warm} strokeWidth={10} />
          {Array.from({length: 8}).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <path key={i} d={`M${300 + Math.cos(a) * 78} ${-200 + Math.sin(a) * 78} L${300 + Math.cos(a) * 104} ${-200 + Math.sin(a) * 104}`} stroke={C.warm} strokeWidth={8} />;
          })}
          <path d="M-90 220 l30 -70 l30 70 M-10 220 l26 -60 l26 60" stroke="#3c6a4a" strokeWidth={9} />
        </g>
        {/* новое: гермодверь и два папы — нарисовано карандашом поверх */}
        <g fill="none" stroke="#3b4250" strokeWidth={7} strokeLinecap="round" opacity={reveal}>
          <rect x={60} y={-60} width={150} height={260} rx={10} />
          <circle cx={135} cy={60} r={36} />
          <path d="M99 60 H171 M135 24 V96" />
        </g>
        {[0, 1].map((k) => (
          <g key={k} transform={`translate(${270 + k * 100} 120)`} fill="none" stroke="#3d4a5f" strokeWidth={8} strokeLinecap="round" opacity={ramp(t, 40 + k * 14, 54 + k * 14)}>
            <circle cx={0} cy={-60} r={22} />
            <path d="M0 -38 V30 M0 30 L-22 90 M0 30 L22 90 M-34 -10 L34 -10" />
            <path d="M-14 -66 q14 -20 28 0" stroke="#171a21" strokeWidth={10} />
          </g>
        ))}
        <text x={300} y={260} fontFamily="Montserrat" fontWeight={800} fontSize={34} fill="#3d4a5f" textAnchor="middle" opacity={ramp(t, 70, 80)}>ПАПА  ПАПА</text>
      </g>
    </svg>
  );
};
