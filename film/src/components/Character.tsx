import React from 'react';

/**
 * Персонаж в плоской векторной стилистике. Начало координат — пол между стопами,
 * персонаж смотрит вправо (facing=-1 — зеркально влево). Размеры в единицах взрослого (~340).
 */
export type Who = 'mark' | 'alisa' | 'galina' | 'lev' | 'sonya' | 'evgeny' | 'misha' | 'palych' | 'vika';

export type Pose = {
  sit?: number; // 0 — стоит, 1 — сидит
  lean?: number; // наклон корпуса, градусы (вперёд +)
  headTilt?: number; // наклон головы, градусы
  look?: number; // -1..1 — куда смотрит (смещение черт лица)
  lookUp?: number; // -1..1
  armF?: [number, number]; // передняя рука: плечо, локоть (градусы от вертикали, вперёд +)
  armB?: [number, number]; // задняя рука
  blink?: number; // 1 — открыты, 0 — закрыты
  mouth?: number; // 0..1 — открытие рта (липсинк)
  brow?: number; // -1 спокойно … 1 тревога
  smile?: number; // 0..1
  step?: number; // фаза шага (рад), 0 — стоит ровно
  rim?: number; // сила контрового света
  rimColor?: string;
};

export type Look = {
  skin: string;
  skinShade: string;
  hair: string;
  top: string;
  topShade: string;
  bottom: string;
  shoes: string;
  scale: number;
  headScale: number;
  torso: number;
  width: number;
};

export const LOOKS: Record<Who, Look> = {
  mark: {skin: '#c29479', skinShade: '#9c7461', hair: '#171a21', top: '#3d4a5f', topShade: '#2d374a', bottom: '#232833', shoes: '#13161c', scale: 1, headScale: 1, torso: 132, width: 74},
  alisa: {skin: '#d3a689', skinShade: '#ad826b', hair: '#5e3a2a', top: '#c98a36', topShade: '#a06c2a', bottom: '#2c3446', shoes: '#3a2328', scale: 0.66, headScale: 1.22, torso: 120, width: 70},
  galina: {skin: '#c99f88', skinShade: '#a07e6d', hair: '#a7a9ad', top: '#6b2f38', topShade: '#52242c', bottom: '#2f3340', shoes: '#1b1d22', scale: 0.9, headScale: 1.02, torso: 128, width: 80},
  sonya: {skin: '#d6aa8e', skinShade: '#b0866f', hair: '#8a5a36', top: '#7f9bc4', topShade: '#647fa6', bottom: '#5d7396', shoes: '#c9c3b8', scale: 0.64, headScale: 1.24, torso: 118, width: 68},
  evgeny: {skin: '#b88a72', skinShade: '#94695a', hair: '#8f9196', top: '#4d4a36', topShade: '#3a3828', bottom: '#262a33', shoes: '#15171b', scale: 1.04, headScale: 1.02, torso: 138, width: 88},
  misha: {skin: '#d6a88a', skinShade: '#b0846c', hair: '#6a4a30', top: '#4f8fbf', topShade: '#3d7099', bottom: '#2c3446', shoes: '#c9c3b8', scale: 0.62, headScale: 1.26, torso: 116, width: 66},
  palych: {skin: '#b47e64', skinShade: '#8f6250', hair: '#d0d0cc', top: '#5a5a48', topShade: '#454536', bottom: '#2a2e38', shoes: '#1a1a1e', scale: 0.98, headScale: 1.02, torso: 134, width: 84},
  vika: {skin: '#d2a488', skinShade: '#ac8068', hair: '#2a1a14', top: '#e8e4da', topShade: '#c9c3b8', bottom: '#1f2430', shoes: '#15171b', scale: 0.86, headScale: 1.04, torso: 124, width: 66},
  lev: {skin: '#b98e78', skinShade: '#93705f', hair: '#0f1115', top: '#2c3834', topShade: '#202a27', bottom: '#1d2128', shoes: '#101216', scale: 1.02, headScale: 0.97, torso: 136, width: 66},
};

const rad = (d: number) => (d * Math.PI) / 180;

const Limb: React.FC<{x: number; y: number; a1: number; a2: number; l1: number; l2: number; w: number; color: string; end: string; endR: number; flipKnee?: boolean}> = ({x, y, a1, a2, l1, l2, w, color, end, endR}) => {
  const ex = x + Math.sin(rad(a1)) * l1;
  const ey = y + Math.cos(rad(a1)) * l1;
  const hx = ex + Math.sin(rad(a1 + a2)) * l2;
  const hy = ey + Math.cos(rad(a1 + a2)) * l2;
  return (
    <g>
      <path d={`M${x} ${y} L${ex} ${ey} L${hx} ${hy}`} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={hx} cy={hy} r={endR} fill={end} />
    </g>
  );
};

const Hair: React.FC<{who: Who; c: string; f: number}> = ({who, c, f}) => {
  switch (who) {
    case 'mark':
      return <path d="M-33 -6 C-38 -40 -14 -52 6 -50 C26 -49 38 -38 36 -18 C30 -26 20 -30 8 -30 C-6 -30 -16 -24 -22 -12 Z" fill={c} />;
    case 'alisa': {
      const sway = Math.sin(f / 18) * 3;
      return (
        <g>
          <path d={`M-30 -24 C-46 -20 ${-56 + sway} 0 ${-50 + sway} 26 C${-44 + sway} 34 -36 22 -34 6 Z`} fill={c} />
          <circle cx={-31} cy={-24} r={6} fill="#f2b448" />
          <path d="M-34 4 C-40 -36 -12 -52 8 -50 C28 -48 40 -36 36 -12 C32 -22 22 -32 6 -32 C0 -22 -14 -18 -24 -16 C-26 -6 -28 0 -34 4 Z" fill={c} />
        </g>
      );
    }
    case 'galina':
      return (
        <g>
          <circle cx={-22} cy={-44} r={16} fill={c} />
          <path d="M-34 0 C-40 -36 -14 -52 6 -50 C28 -49 38 -36 36 -14 C26 -28 10 -34 -6 -30 C-18 -26 -24 -16 -26 -4 Z" fill={c} />
        </g>
      );
    case 'sonya': {
      const sw = Math.sin(f / 16) * 2.5;
      return (
        <g>
          {/* два хвостика */}
          <path d={`M-28 -30 C-46 -34 ${-58 + sw} -14 ${-54 + sw} 8 C${-46 + sw} 4 -38 -10 -30 -16 Z`} fill={c} />
          <path d={`M10 -50 C18 -64 ${34 + sw} -66 ${40 + sw} -56 C30 -54 22 -50 18 -44 Z`} fill={c} />
          <circle cx={-30} cy={-26} r={5.5} fill="#d85445" />
          <path d="M-34 4 C-40 -36 -12 -52 8 -50 C28 -48 40 -36 36 -14 C30 -24 18 -30 4 -30 C-8 -28 -18 -20 -24 -10 C-28 -4 -30 0 -34 4 Z" fill={c} />
        </g>
      );
    }
    case 'evgeny':
      return (
        <g>
          {/* лысина с седым венчиком */}
          <path d="M-33 4 C-38 -18 -34 -30 -26 -34 C-22 -22 -24 -10 -22 2 Z" fill={c} />
          <path d="M-26 -34 C-20 -40 -12 -42 -4 -42 C-14 -36 -20 -30 -22 -24 Z" fill={c} opacity={0.7} />
        </g>
      );
    case 'misha':
      // короткая стрижка + жёлтая кепка козырьком вперёд
      return (
        <g>
          <path d="M-33 -2 C-36 -30 -20 -40 -4 -40 C-18 -30 -24 -16 -26 -2 Z" fill={c} />
          <path d="M-34 -14 C-36 -46 -8 -58 14 -54 C34 -50 40 -34 38 -22 L-34 -14 Z" fill="#f2c230" />
          <path d="M20 -26 L62 -22 Q60 -14 36 -16 L18 -18 Z" fill="#d9a920" />
          <circle cx={4} cy={-55} r={4} fill="#d9a920" />
        </g>
      );
    case 'palych':
      // седые волосы из-под рыбацкой кепки
      return (
        <g>
          <path d="M-33 4 C-38 -14 -34 -24 -28 -28 C-26 -16 -26 -6 -24 6 Z" fill={c} />
          <path d="M-36 -16 C-38 -44 -10 -54 12 -50 C32 -46 40 -32 38 -20 L-36 -16 Z" fill="#3a4a5a" />
          <path d="M18 -26 L58 -24 Q56 -16 34 -18 L16 -20 Z" fill="#2a3644" />
          <rect x={-36} y={-22} width={74} height={6} fill="#2a3644" />
        </g>
      );
    case 'vika':
      return (
        <g>
          <path d={`M-30 -30 C-46 -28 ${-52 + Math.sin(f / 15) * 3} -6 ${-44 + Math.sin(f / 15) * 3} 18 C-40 6 -36 -10 -30 -16 Z`} fill={c} />
          <path d="M-34 4 C-40 -36 -12 -52 8 -50 C28 -48 40 -36 36 -12 C30 -24 18 -32 2 -32 C-10 -30 -20 -22 -26 -10 C-28 -4 -30 0 -34 4 Z" fill={c} />
        </g>
      );
    case 'lev':
      return <path d="M-33 -4 C-36 -42 -10 -54 12 -50 C30 -47 40 -34 37 -20 C26 -34 6 -36 -10 -30 C-20 -24 -26 -14 -28 -2 Z" fill={c} />;
  }
};

export const Character: React.FC<{
  who: Who;
  x: number;
  y: number;
  size?: number;
  facing?: 1 | -1;
  pose?: Pose;
  frame?: number;
  opacity?: number;
  /** для массовки: замена цветов/пропорций и причёски поверх базового персонажа */
  override?: Partial<Look>;
  hair?: Who;
}> = ({who, x, y, size = 1, facing = 1, pose = {}, frame = 0, opacity = 1, override, hair}) => {
  const L = override ? {...LOOKS[who], ...override} : LOOKS[who];
  const gid = 'rim' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const {
    sit = 0, lean = 0, headTilt = 0, look = 0, lookUp = 0, armF = [10, -20], armB = [-8, -15],
    blink = 1, mouth = 0, brow = 0, smile = 0, step = 0, rim = 0.8, rimColor = '#f2b448',
  } = pose;
  const thigh = 78;
  const shin = 82;
  const tA = sit * 88; // угол бедра от вертикали
  const hipY = -(shin + Math.cos(rad(tA)) * thigh) - 6;
  const breathe = Math.sin(frame / 22) * 1.2;
  const torsoTop = hipY - L.torso + breathe;
  const sw = step ? Math.sin(step) * 22 : 0;
  const hw = L.width / 2;
  const hs = L.headScale;
  const headY = torsoTop - 40 * hs;
  const lx = look * 3.5;
  const ly = lookUp * -3;
  const eyeH = 5.2 * Math.max(0.08, blink);
  const browA = brow * 12;
  const browC = who === 'galina' || who === 'evgeny' || who === 'palych' ? '#8f9196' : who === 'misha' ? '#6a4a30' : L.hair;

  const leg = (dx: number, phase: number, back: boolean) => {
    const kneeA = tA + phase;
    const kx = dx + Math.sin(rad(kneeA)) * thigh;
    const ky = hipY + Math.cos(rad(kneeA)) * thigh;
    const fx = kx - (sit > 0.5 ? 0 : phase * 0.3);
    const fy = ky + shin;
    return (
      <g opacity={back ? 0.85 : 1}>
        <path d={`M${dx} ${hipY} L${kx} ${ky} L${fx} ${fy - 6}`} stroke={back ? shade(L.bottom) : L.bottom} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={`M${fx - 12} ${fy - 2} Q${fx - 12} ${fy - 16} ${fx + 4} ${fy - 14} L${fx + 22} ${fy - 8} Q${fx + 26} ${fy} ${fx + 18} ${fy} Z`} fill={L.shoes} />
      </g>
    );
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${size * L.scale * facing} ${size * L.scale})`} opacity={opacity}>
      <defs>
        <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={rimColor} stopOpacity={rim * 0.55} />
          <stop offset="0.16" stopColor={rimColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* тень */}
      <ellipse cx={sit > 0.5 ? 30 : 0} cy={0} rx={70} ry={8} fill="#000" opacity={0.35} />
      {leg(-8, -sw, true)}
      {/* задняя рука */}
      <g transform={`rotate(${lean} 0 ${hipY})`}>
        <Limb x={-hw * 0.45} y={torsoTop + 16} a1={armB[0]} a2={armB[1]} l1={64} l2={60} w={24} color={L.topShade} end={L.skinShade} endR={10} />
      </g>
      {leg(8, sw, false)}
      <g transform={`rotate(${lean} 0 ${hipY})`}>
        {/* корпус */}
        <path
          d={`M${-hw} ${torsoTop + 22} Q${-hw} ${torsoTop} ${-hw + 22} ${torsoTop - 2} L${hw - 22} ${torsoTop - 2} Q${hw} ${torsoTop} ${hw} ${torsoTop + 22} L${hw - 4} ${hipY + 8} L${-hw + 4} ${hipY + 8} Z`}
          fill={L.top}
        />
        <path d={`M${-hw} ${torsoTop + 22} Q${-hw} ${torsoTop} ${-hw + 22} ${torsoTop - 2} L${-hw + 30} ${torsoTop - 2} L${-hw + 16} ${hipY + 8} L${-hw + 4} ${hipY + 8} Z`} fill={L.topShade} />
        {who === 'galina' && <path d={`M-6 ${torsoTop} L6 ${torsoTop} L4 ${hipY + 8} L-4 ${hipY + 8} Z`} fill="#4a1f27" />}
        {who === 'palych' && <path d={`M${-hw + 8} ${torsoTop} L${-hw + 26} ${torsoTop} L${-hw + 30} ${hipY + 8} L${-hw + 8} ${hipY + 8} Z M${hw - 8} ${torsoTop} L${hw - 26} ${torsoTop} L${hw - 30} ${hipY + 8} L${hw - 8} ${hipY + 8} Z`} fill="#3a3a2c" />}
        {who === 'vika' && <path d={`M${-hw + 6} ${torsoTop + 10} L${-6} ${torsoTop + 10} L${-4} ${hipY + 8} L${-hw + 6} ${hipY + 8} Z M${hw - 6} ${torsoTop + 10} L${6} ${torsoTop + 10} L${4} ${hipY + 8} L${hw - 6} ${hipY + 8} Z`} fill="#2a3040" />}
        {who === 'vika' && <rect x={12} y={torsoTop + 30} width={18} height={10} rx={2} fill={'#f2b448'} />}
        {who === 'evgeny' && <rect x={-hw} y={hipY - 46} width={L.width} height={9} fill="#c9b458" opacity={0.85} />}
        {who === 'evgeny' && <rect x={-hw} y={hipY - 76} width={L.width} height={9} fill="#c9b458" opacity={0.85} />}
        {who === 'lev' && <rect x={-16} y={torsoTop - 12} width={32} height={18} rx={6} fill={L.top} />}
        {/* контровой свет по спине — мягкий градиент по краю силуэта */}
        <path
          d={`M${-hw} ${torsoTop + 22} Q${-hw} ${torsoTop} ${-hw + 22} ${torsoTop - 2} L${hw - 22} ${torsoTop - 2} Q${hw} ${torsoTop} ${hw} ${torsoTop + 22} L${hw - 4} ${hipY + 8} L${-hw + 4} ${hipY + 8} Z`}
          fill={`url(#${gid})`}
        />
        {/* голова */}
        <g transform={`translate(${4} ${headY}) rotate(${headTilt}) scale(${hs})`}>
          <rect x={-9} y={22} width={18} height={22} fill={L.skinShade} />
          <path d="M-32 -6 C-34 -36 -16 -46 4 -46 C26 -46 36 -32 35 -8 C35 16 26 34 6 36 C-16 37 -31 20 -32 -6 Z" fill={L.skin} />
          <path d="M-32 -6 C-34 -36 -16 -46 -6 -46 C-20 -30 -22 10 -4 36 C-18 34 -31 18 -32 -6 Z" fill={L.skinShade} opacity={0.55} />
          {/* ухо */}
          <ellipse cx={-14 + lx * 0.3} cy={2} rx={6} ry={9} fill={L.skinShade} />
          <Hair who={hair ?? who} c={L.hair} f={frame} />
          {/* черты лица — обрезаны по контуру головы, чтобы не выходили за щёку */}
          <clipPath id={`${gid}h`}>
            <path d="M-32 -6 C-34 -36 -16 -46 4 -46 C26 -46 36 -32 35 -8 C35 16 26 34 6 36 C-16 37 -31 20 -32 -6 Z" />
          </clipPath>
          <g clipPath={`url(#${gid}h)`}>
            <g transform={`translate(${lx} ${ly})`}>
              <path d={`M${3} ${-15 - browA * 0.3} l10 ${-2 + browA * 0.35}`} stroke={browC} strokeWidth={3.2} strokeLinecap="round" />
              <path d={`M${20} ${-17 + browA * 0.2} l9 ${2 + browA * 0.25}`} stroke={browC} strokeWidth={3.2} strokeLinecap="round" />
              <ellipse cx={9} cy={-4} rx={3.5} ry={eyeH} fill="#11131a" />
              <ellipse cx={25} cy={-4} rx={3.2} ry={eyeH} fill="#11131a" />
              {blink > 0.6 && <circle cx={10} cy={-6} r={1.1} fill="#fff" opacity={0.8} />}
              {/* нос — мягкая тень внутри лица */}
              <path d="M27 2 Q32 9 29 12 Q25 13.5 22.5 11.5 Q26 9 27 2 Z" fill={L.skinShade} />
              {who === 'palych' && <path d="M-2 10 Q2 40 18 44 Q34 40 36 10 Q30 22 18 24 Q6 22 -2 10 Z" fill="#d0d0cc" />}
              {who === 'evgeny' && <path d="M10 17 Q18 12 24 15 Q30 12 33 17 Q29 22 22 19 Q15 22 10 17 Z" fill="#8f9196" />}
              {/* рот: от линии к открытому, с верхней губой и языком */}
              {mouth > 0.06 ? (
                <g>
                  <path d={`M${13} 21 Q${18.5} ${19.5 - mouth} 24 21 Q${24 - mouth * 0.5} ${21 + 2 + mouth * 6} 18.5 ${21 + 2 + mouth * 6} Q${13 + mouth * 0.5} ${21 + 2 + mouth * 6} 13 21 Z`} fill="#3d1f20" />
                  {mouth > 0.35 && <ellipse cx={18.5} cy={21 + 1.5 + mouth * 5} rx={3} ry={mouth * 1.6} fill="#8a4a48" />}
                </g>
              ) : (
                <path d={`M13 ${21 - smile} Q18.5 ${21 + smile * 4.5 - brow * 1.2} 24 ${21 - smile}`} stroke="#5a2f2b" strokeWidth={2.4} fill="none" strokeLinecap="round" />
              )}
              {who === 'galina' && (
                <g fill="none" stroke="#d9d2c0" strokeWidth={2} opacity={0.9}>
                  <circle cx={9} cy={-4} r={7} />
                  <circle cx={25} cy={-4} r={6.5} />
                  <path d="M16 -4 L18.5 -4" />
                </g>
              )}
            </g>
          </g>
          {who === 'galina' && <path d="M2 -6 L-14 -8" stroke="#d9d2c0" strokeWidth={2} opacity={0.9} />}
          <path d="M-32 -6 C-34 -36 -16 -46 4 -46 C26 -46 36 -32 35 -8 C35 16 26 34 6 36 C-16 37 -31 20 -32 -6 Z" fill={`url(#${gid})`} />
        </g>
        {/* передняя рука */}
        <Limb x={hw * 0.35} y={torsoTop + 16} a1={armF[0]} a2={armF[1]} l1={64} l2={60} w={25} color={L.top} end={L.skin} endR={10.5} />
      </g>
    </g>
  );
};

const shade = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * 0.75);
  const g = Math.round(((n >> 8) & 255) * 0.75);
  const b = Math.round((n & 255) * 0.75);
  return `rgb(${r},${g},${b})`;
};
