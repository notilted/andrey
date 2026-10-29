import React from 'react';

/** Стиль «тун»: большая круглая голова, двухтоновая заливка (свет/тень пополам), руки-трубки, круглые кисти. */

export type ToonLook = {
  skin: string; skinD: string; hair: string; top: string; topD: string; legs: string; legsD: string; shoes: string;
  band?: string; bald?: boolean; messy?: boolean; hoodie?: boolean; mustache?: boolean; hat?: string; tie?: string; scale?: number; scar?: boolean; scarf?: string;
};

export type ToonPose = {
  armL?: [number, number]; armR?: [number, number]; // плечо, локоть (градусы от вертикали; + наружу)
  step?: number; // фаза шага
  sit?: number;
  eyes?: 'open' | 'wide' | 'half' | 'closed' | 'side';
  look?: number; // -1..1 зрачки
  mouth?: 'smile' | 'grin' | 'fear' | 'line' | 'open' | 'smirk';
  talk?: number; // 0..1 открытие рта
  brow?: number; // -1 злой … 1 испуг
  sweat?: boolean; blush?: boolean; shake?: boolean; lean?: number;
};

const rad = (d: number) => (d * Math.PI) / 180;

const Arm: React.FC<{x: number; y: number; a: [number, number]; side: 1 | -1; c: string; skin: string}> = ({x, y, a, side, c, skin}) => {
  const ex = x + side * Math.sin(rad(a[0])) * 78, ey = y + Math.cos(rad(a[0])) * 78;
  const hx = ex + side * Math.sin(rad(a[0] + a[1])) * 74, hy = ey + Math.cos(rad(a[0] + a[1])) * 74;
  return (
    <g>
      <path d={`M${x} ${y} L${ex} ${ey} L${hx} ${hy}`} stroke={c} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={hx} cy={hy} r={21} fill={skin} />
    </g>
  );
};

/** Персонаж. (x, y) — точка между ступнями; рост ~560 при s=1. */
export const Toon: React.FC<{x: number; y: number; s?: number; facing?: 1 | -1; f: number; look: ToonLook; pose?: ToonPose; id: string}> = ({x, y, s = 1, facing = 1, f, look: L, pose = {}, id}) => {
  const p = {armL: [18, 8] as [number, number], armR: [18, 8] as [number, number], eyes: 'open' as const, mouth: 'smile' as const, brow: 0, look: 0, ...pose};
  const k = s * (L.scale ?? 1);
  const sh = p.shake ? Math.sin(f * 2.7) * 4 : 0;
  const sit = p.sit ?? 0;
  const st = p.step ?? 0;
  const legSw = p.step !== undefined ? Math.sin(st) * 22 : 0;
  const bob = p.step !== undefined ? Math.abs(Math.cos(st)) * 6 : 0;
  const hipY = -150 + sit * 70;
  const blinkNow = (f + id.length * 37) % 97 < 4;
  const eyes = blinkNow && p.eyes !== 'closed' ? 'closed' : p.eyes;
  const mouthOpen = p.talk ?? 0;
  const clipL = `tl-${id}`;
  return (
    <g transform={`translate(${x + sh} ${y - bob}) scale(${k * facing} ${k}) rotate(${p.lean ?? 0} 0 ${hipY})`}>
      <defs>
        <clipPath id={clipL}><rect x={-400} y={-900} width={400} height={1200} /></clipPath>
      </defs>
      {/* ноги */}
      {sit ? (
        <g>
          <path d={`M-28 ${hipY} L-28 ${hipY} L60 ${hipY} L60 0`} stroke={L.legs} strokeWidth={42} fill="none" strokeLinejoin="round" />
          <path d={`M28 ${hipY} L100 ${hipY} L100 0`} stroke={L.legsD} strokeWidth={42} fill="none" strokeLinejoin="round" />
          <ellipse cx={74} cy={4} rx={34} ry={14} fill={L.shoes} /><ellipse cx={116} cy={4} rx={34} ry={14} fill={L.shoes} />
        </g>
      ) : (
        <g>
          <rect x={-46} y={hipY} width={42} height={150} fill={L.legs} transform={`rotate(${legSw} -25 ${hipY})`} />
          <rect x={4} y={hipY} width={42} height={150} fill={L.legsD} transform={`rotate(${-legSw} 25 ${hipY})`} />
          <ellipse cx={-28 + Math.sin(rad(legSw)) * -150} cy={2} rx={36} ry={15} fill={L.shoes} />
          <ellipse cx={28 + Math.sin(rad(-legSw)) * -150} cy={2} rx={36} ry={15} fill={L.shoes} />
        </g>
      )}
      {/* корпус: двухтоновый */}
      <g>
        <rect x={-82} y={hipY - 250} width={164} height={262} rx={34} fill={L.topD} />
        <g clipPath={`url(#${clipL})`}><rect x={-82} y={hipY - 250} width={164} height={262} rx={34} fill={L.top} /></g>
        {L.hoodie && <g>
          <path d={`M-62 ${hipY - 250} Q0 ${hipY - 196} 62 ${hipY - 250} L50 ${hipY - 262} Q0 ${hipY - 220} -50 ${hipY - 262} Z`} fill={L.topD} />
          <path d={`M-16 ${hipY - 226} l-4 70 M16 ${hipY - 226} l4 70`} stroke="#e8e4da" strokeWidth={6} strokeLinecap="round" />
          <circle cx={-20} cy={hipY - 154} r={6} fill="#e8e4da" /><circle cx={20} cy={hipY - 154} r={6} fill="#e8e4da" />
          <rect x={-56} y={hipY - 110} width={112} height={46} rx={14} fill="#000" opacity={0.12} />
        </g>}
        {L.tie && <path d={`M0 ${hipY - 246} l-14 24 l14 120 l14 -120 Z`} fill={L.tie} />}
      </g>
      <Arm x={-62} y={hipY - 225} a={p.armL} side={-1} c={L.top} skin={L.skin} />
      <Arm x={62} y={hipY - 225} a={p.armR} side={1} c={L.topD} skin={L.skin} />
      {/* шея */}
      <rect x={-17} y={hipY - 286} width={34} height={44} fill={L.skinD} />
      {/* голова */}
      <g transform={`translate(0 ${hipY - 370})`}>
        <circle r={92} fill={L.skinD} />
        <g clipPath={`url(#${clipL})`}><circle r={92} fill={L.skin} /></g>
        {L.messy && <path d="M-94 2 Q-100 -70 -40 -94 Q10 -112 60 -90 Q100 -70 96 -6 L84 -24 L74 -6 L62 -34 Q30 -20 -6 -40 L-20 -18 L-34 -42 Q-60 -26 -80 -30 Z" fill={L.hair} />}
        {!L.bald && !L.messy && <path d="M-92 -6 A92 92 0 0 1 92 -6 Q92 -40 70 -40 L-70 -40 Q-92 -40 -92 -6 Z" fill={L.hair} transform="translate(0 -22)" />}
        {L.bald && <path d="M-92 4 Q-96 -30 -78 -34 L-70 10 Z M92 4 Q96 -30 78 -34 L70 10 Z" fill={L.hair} />}
        {L.hat && <g><ellipse cx={0} cy={-74} rx={130} ry={22} fill={L.hat} /><path d="M-70 -76 Q-66 -150 0 -152 Q66 -150 70 -76 Z" fill={L.hat} /><rect x={-70} y={-96} width={140} height={14} fill="#1a1410" /></g>}
        {L.band && <g><rect x={-94} y={-46} width={188} height={26} rx={6} fill={L.band} /><path d="M-90 -40 l-46 -14 l10 26 Z" fill={L.band} /></g>}
        {/* брови */}
        <path d={`M-52 ${-24 + p.brow * 6} L-18 ${-24 - p.brow * 8}`} stroke="#2a1a14" strokeWidth={7} strokeLinecap="round" />
        <path d={`M18 ${-24 - p.brow * 8} L52 ${-24 + p.brow * 6}`} stroke="#2a1a14" strokeWidth={7} strokeLinecap="round" />
        {/* глаза */}
        {[-34, 34].map((ex) => (
          <g key={ex}>
            {eyes === 'closed' ? <path d={`M${ex - 14} 6 q14 8 28 0`} stroke="#14110e" strokeWidth={6} fill="none" strokeLinecap="round" /> : (
              <g>
                <circle cx={ex} cy={6} r={eyes === 'wide' ? 22 : 17} fill="#fff" />
                {eyes === 'half' && <rect x={ex - 20} y={-14} width={40} height={18} fill={ex < 0 ? L.skin : L.skinD} />}
                <circle cx={ex + p.look * 8 + (eyes === 'side' ? 7 : 0)} cy={eyes === 'half' ? 10 : 6} r={eyes === 'wide' ? 8 : 9} fill="#14110e" />
              </g>
            )}
          </g>
        ))}
        {L.mustache && <path d="M-34 44 Q-10 30 0 42 Q10 30 34 44 Q14 52 0 46 Q-14 52 -34 44 Z" fill={L.hair} />}
        {/* рот */}
        {mouthOpen > 0.15 ? <ellipse cx={0} cy={52} rx={16} ry={6 + mouthOpen * 14} fill="#5a1a1a" /> :
          p.mouth === 'fear' ? <path d="M-18 54 l6 -5 l6 5 l6 -5 l6 5 l6 -5" stroke="#3a1a14" strokeWidth={4} fill="none" /> :
          p.mouth === 'line' ? <path d="M-14 52 L14 52" stroke="#3a1a14" strokeWidth={5} strokeLinecap="round" /> :
          p.mouth === 'grin' ? <path d="M-26 44 Q0 74 26 44 Z" fill="#5a1a1a" /> :
          p.mouth === 'smirk' ? <path d="M-12 54 Q10 56 24 42" stroke="#3a1a14" strokeWidth={5} fill="none" strokeLinecap="round" /> :
          p.mouth === 'open' ? <ellipse cx={0} cy={52} rx={14} ry={16} fill="#5a1a1a" /> :
          <path d="M-18 46 Q0 62 18 46" stroke="#3a1a14" strokeWidth={5} fill="none" strokeLinecap="round" />}
        {p.blush !== false && [-56, 56].map((bx) => <ellipse key={bx} cx={bx} cy={34} rx={16} ry={10} fill="#ff8a9a" opacity={0.55} />)}
        {L.scar && <path d="M-60 -50 L40 60" stroke="#c86a6a" strokeWidth={8} strokeLinecap="round" />}
        {L.scarf && <path d="M-100 -10 Q-100 -110 0 -112 Q100 -110 100 -10 L104 60 Q60 20 70 -20 Q0 -60 -70 -20 Q-60 20 -104 60 Z" fill={L.scarf} />}
        {p.sweat && <path d="M66 -30 q10 16 0 24 q-10 -8 0 -24 Z" fill="#7ac8f0" />}
      </g>
    </g>
  );
};

/** Фон: радиальное свечение + частицы. */
export const Glow: React.FC<{f: number; c1: string; c2: string; cx?: number; cy?: number; id: string}> = ({f, c1, c2, cx = 540, cy = 760, id}) => (
  <g>
    <defs>
      <radialGradient id={id} cx={cx / 1080} cy={cy / 1920} r="0.75">
        <stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} />
      </radialGradient>
    </defs>
    <rect x={-200} y={-200} width={1480} height={2400} fill={`url(#${id})`} />
    {Array.from({length: 22}).map((_, i) => (
      <rect key={i} x={(i * 263) % 1080} y={((i * 491 + f * (0.4 + (i % 3) * 0.2)) % 1700)} width={6} height={6} fill="#fff" opacity={0.12 + (i % 4) * 0.05} />
    ))}
  </g>
);

/** Линии движения/дрожи по бокам. */
export const Shake: React.FC<{x: number; y: number; w?: number; f: number}> = ({x, y, w = 170, f}) => (
  <g opacity={0.8}>
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={x - w - 100 + (f % 4) * 2} y={y + i * 34} width={100 - i * 18} height={8} rx={4} fill="#f2e0e0" opacity={0.6} />
        <rect x={x + w + (f % 4) * -2} y={y + i * 34} width={100 - i * 18} height={8} rx={4} fill="#f2e0e0" opacity={0.6} />
      </g>
    ))}
  </g>
);
