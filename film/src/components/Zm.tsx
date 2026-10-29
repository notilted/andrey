import React from 'react';
import {Character, Look, Pose, Who} from './Character';
import {C, FONT} from '../theme';
import {blink, rand} from '../util';

/** «Карантин»: общие элементы — заражённые, прихожая, двор, подъезд, город, стадион. */

export const ZSKIN: Partial<Look> = {skin: '#8f9c80', skinShade: '#6c7a5e'};
export const ME: Partial<Look> = {top: '#3d4a5f', topShade: '#2d374a'};
export const PAPA: Partial<Look> = {top: '#3a4a3a', topShade: '#2c382c', hair: '#5a5c62'};

/** Заражённый: серо-зелёная кожа, наклон вперёд, руки вперёд, рваная походка. */
export const Zombie: React.FC<{who?: Who; x: number; y: number; size?: number; facing?: 1 | -1; f: number; walk?: boolean; look?: Partial<Look>; pose?: Pose; seed?: number}> = ({who = 'mark', x, y, size = 1, facing = 1, f, walk = true, look = {}, pose = {}, seed = 0}) => {
  const j = Math.sin(f / 5 + seed) * 4;
  return (
    <g>
      <Character who={who} x={x} y={y} size={size} facing={facing} frame={f + seed * 13}
        override={{...ZSKIN, top: '#4a4a44', topShade: '#3a3a34', ...look}}
        pose={{lean: 14 + j, headTilt: 18 + j * 2, armF: [95 + j * 3, -10], armB: [80 - j * 2, -5], blink: 1, brow: -1, mouth: 0.5 + 0.3 * Math.sin(f / 4 + seed), step: walk ? f / 6 + seed : 0, rim: 0.7, rimColor: C.red, ...pose}} />
    </g>
  );
};

/** Обычный персонаж-обёртка с морганием. */
export const P: React.FC<{who: Who; x: number; y: number; size?: number; facing?: 1 | -1; f: number; look?: Partial<Look>; pose?: Pose; seed?: number}> = ({who, x, y, size = 1, facing = 1, f, look, pose = {}, seed = 0}) => (
  <Character who={who} x={x} y={y} size={size} facing={facing} frame={f} override={look} pose={{blink: blink(f, seed + 5), rim: 0.4, ...pose}} />
);

/** Диван. */
export const Sofa: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 560}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-170} width={w} height={130} rx={26} fill="#4a3a44" />
    <rect x={-w / 2 - 20} y={-70} width={w + 40} height={70} rx={20} fill="#5a4652" />
    <rect x={-w / 2 - 40} y={-120} width={50} height={120} rx={18} fill="#4a3a44" />
    <rect x={w / 2 - 10} y={-120} width={50} height={120} rx={18} fill="#4a3a44" />
  </g>
);

/** Прихожая с входной дверью; barricade 0..2 — шкаф, холодильник. */
export const Hall: React.FC<{f: number; barricade?: number; light?: number; gap?: number; shadow?: number; shake?: number}> = ({f, barricade = 0, light = 1, gap = 0, shadow = -1, shake = 0}) => {
  const sx = shake ? Math.sin(f * 3.1) * 6 * shake : 0;
  const wb = Math.min(1, barricade);
  const fb = Math.max(0, Math.min(1, barricade - 1));
  return (
    <g>
      <rect x={-200} y={-200} width={1480} height={2400} fill="#343842" />
      <rect x={-200} y={1180} width={1480} height={1000} fill="#1a1d24" />
      <rect x={-200} y={1170} width={1480} height={14} fill="#33363f" />
      <g transform={`translate(${sx} 0)`}>
        <rect x={330} y={330} width={420} height={850} fill="#4a3a30" />
        <rect x={350} y={350} width={380} height={810} fill="#5a463a" stroke="#3a2c24" strokeWidth={6} />
        <circle cx={540} cy={560} r={12} fill="#14171d" stroke="#8a8a80" strokeWidth={4} />
        <rect x={680} y={760} width={30} height={12} rx={6} fill="#c2b48a" />
        <rect x={672} y={790} width={16} height={36} rx={4} fill="#8a8a80" />
      </g>
      {/* шкаф едет справа */}
      <g transform={`translate(${1200 - wb * 560} 0)`}>
        <rect x={-180} y={360} width={360} height={820} fill="#3a3230" stroke="#2a2422" strokeWidth={8} />
        <rect x={-6} y={380} width={12} height={780} fill="#2a2422" />
        <circle cx={-24} cy={770} r={8} fill="#8a7a6a" /><circle cx={24} cy={770} r={8} fill="#8a7a6a" />
      </g>
      {/* холодильник слева */}
      <g transform={`translate(${-300 + fb * 600} 0)`}>
        <rect x={-150} y={500} width={300} height={680} rx={24} fill="#d8d8d2" stroke="#a8a8a0" strokeWidth={6} />
        <rect x={-150} y={720} width={300} height={8} fill="#a8a8a0" />
        <rect x={110} y={560} width={12} height={110} rx={6} fill="#9a9a92" />
      </g>
      <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={(1 - light) * 0.8} />
      {gap > 0 && <rect x={350} y={1168} width={380} height={14} fill="#e8d8a8" opacity={gap} />}
      {gap > 0 && shadow >= 0 && [0, 1].map((k) => <rect key={k} x={350 + shadow * 380 - 40 + k * 56} y={1168} width={36} height={14} fill="#05070c" />)}
    </g>
  );
};

/** Вид в глазок: круг-«рыбий глаз» с лестничной площадкой. */
export const Peephole: React.FC<{f: number; children: React.ReactNode}> = ({f, children}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#030406" />
    <defs>
      <clipPath id="peep"><circle cx={540} cy={820} r={430} /></clipPath>
      <radialGradient id="peepV" cx="0.5" cy="0.5" r="0.5"><stop offset="0.6" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.9} /></radialGradient>
    </defs>
    <g clipPath="url(#peep)">
      <rect x={100} y={380} width={880} height={880} fill="#3a3e36" />
      <rect x={100} y={1060} width={880} height={200} fill="#2a2c28" />
      <rect x={480} y={390} width={120} height={14} fill="#e8e0b0" opacity={0.9 * (rand(Math.floor(f / 3)) > 0.08 ? 1 : 0.3)} />
      {children}
      <circle cx={540} cy={820} r={430} fill="url(#peepV)" />
    </g>
    <circle cx={540} cy={820} r={430} fill="none" stroke="#14171d" strokeWidth={30} />
  </g>
);

/** Двор панельки сверху-сбоку: подъезд, фонарь, площадка. */
export const Yard: React.FC<{f: number; dusk?: number}> = ({f, dusk = 0}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill={dusk ? '#141a26' : '#8a96a2'} />
    <rect x={-200} y={-200} width={1480} height={700} fill={dusk ? '#0d121c' : '#a8b4be'} />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={-120 + i * 230} y={120} width={200} height={380} fill={dusk ? '#1c2230' : '#7a828c'} />)}
    {Array.from({length: 6}).map((_, i) => Array.from({length: 4}).map((__, r) => <rect key={`${i}${r}`} x={-100 + i * 230 + (r % 2) * 90} y={150 + r * 85} width={60} height={50} fill={dusk ? (rand(i * 7 + r) > 0.6 ? C.warm : '#141a24') : '#5a626c'} opacity={0.8} />))}
    <rect x={-200} y={500} width={1480} height={1700} fill={dusk ? '#1a1f28' : '#6a7066'} />
    <rect x={-200} y={760} width={1480} height={160} fill={dusk ? '#22262e' : '#7c7e78'} />
    <rect x={120} y={560} width={300} height={200} fill={dusk ? '#262b36' : '#8a8a84'} />
    <rect x={180} y={600} width={180} height={160} fill="#3a3230" />
    <rect x={100} y={540} width={340} height={30} fill={dusk ? '#30353f' : '#9a9a94'} />
    <rect x={820} y={480} width={10} height={420} fill="#2a2f38" />
    <circle cx={825} cy={480} r={14} fill={dusk ? '#fff2c8' : '#cfcfc8'} />
    {/* лавочка, качели */}
    <rect x={560} y={820} width={180} height={14} fill="#5a4a3a" />
    <rect x={570} y={834} width={10} height={40} fill="#3a3230" /><rect x={720} y={834} width={10} height={40} fill="#3a3230" />
    <path d="M900 1000 L960 760 L1020 1000" stroke="#4a4a52" strokeWidth={8} fill="none" />
    <rect x={-200} y={1000} width={1480} height={1200} fill={dusk ? '#14181f' : '#5a6058'} />
  </g>
);

/** Город днём/вечером: проспект с брошенными машинами, горящий автобус. */
export const CityStreet: React.FC<{f: number; scroll?: number; fire?: number}> = ({f, scroll = 0, fire = 1}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#3a3a40" />
    <rect x={-200} y={-200} width={1480} height={900} fill="#5a5560" />
    <g transform={`translate(${-scroll % 600} 0)`}>
      {Array.from({length: 8}).map((_, i) => <g key={i}><rect x={-200 + i * 300} y={200 + (i % 3) * 60} width={260} height={700} fill={['#2a2e36', '#30343c', '#262a30'][i % 3]} />{Array.from({length: 8}).map((__, r) => <rect key={r} x={-180 + i * 300 + (r % 3) * 80} y={240 + (i % 3) * 60 + Math.floor(r / 3) * 110} width={50} height={60} fill="#14181f" />)}</g>)}
    </g>
    <rect x={-200} y={900} width={1480} height={1300} fill="#2a2c30" />
    <rect x={-200} y={1080} width={1480} height={8} fill="#c8c8b0" opacity={0.3} />
    <g transform={`translate(${-(scroll * 1.6) % 900} 0)`}>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${i * 900 + 80} 1020) rotate(${i % 2 ? 6 : -4})`}>
          <rect x={-170} y={-80} width={340} height={90} rx={20} fill={['#5a2a2a', '#2a3a5a', '#4a4a4a', '#3a4a3a'][i]} />
          <path d="M-110 -80 L-60 -140 L70 -140 L120 -80 Z" fill="#1a1f28" />
          <circle cx={-100} cy={14} r={30} fill="#111" /><circle cx={100} cy={14} r={30} fill="#111" />
          {i % 2 === 0 && <path d="M-60 -140 L-20 -190 L-40 -120 Z" fill="#1a1f28" />}
        </g>
      ))}
    </g>
    {fire > 0 && (
      <g transform="translate(760 960)">
        <rect x={-260} y={-200} width={520} height={220} rx={20} fill="#2a2420" />
        {Array.from({length: 7}).map((_, i) => {
          const h = 140 + 60 * Math.sin(f / 3 + i * 1.7);
          return <path key={i} d={`M${-220 + i * 70} -180 q30 ${-h} 60 0 Z`} fill={i % 2 ? '#f2b448' : '#d85445'} opacity={0.85 * fire} />;
        })}
        <circle cx={0} cy={-260} r={300} fill="#f2b448" opacity={0.08 * fire} />
        {Array.from({length: 5}).map((_, i) => <circle key={i} cx={-100 + i * 60 + Math.sin(f / 20 + i) * 30} cy={-420 - ((f * 2 + i * 80) % 500)} r={90 + i * 10} fill="#1a1a1e" opacity={0.5} />)}
      </g>
    )}
  </g>
);

/** Стадион: прожекторы, сетка, ворота, бетонная стена. */
export const Stadium: React.FC<{f: number; lights?: number; gate?: number}> = ({f, lights = 1, gate = 1}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#0a0d14" />
    <path d="M-200 700 Q540 380 1280 700 L1280 900 L-200 900 Z" fill="#1c222c" />
    {[60, 1020].map((x, k) => (
      <g key={x}>
        <rect x={x - 8} y={160} width={16} height={600} fill="#2a2f38" />
        <rect x={x - 70} y={120} width={140} height={60} fill="#3a404b" />
        {[0, 1, 2].map((i) => <circle key={i} cx={x - 44 + i * 44} cy={150} r={16} fill="#fff6d8" opacity={lights > i / 3 + k * 0.15 ? 1 : 0.15} />)}
        <polygon points={`${x - 60},170 ${x + 60},170 ${540 + (k ? -120 : 120)},1500 ${540 + (k ? -560 : 560)},1500`} fill="#fff6d8" opacity={lights > 0.3 + k * 0.15 ? 0.06 : 0} />
      </g>
    ))}
    <rect x={-200} y={900} width={1480} height={1300} fill="#1a1d22" />
    <rect x={-200} y={640} width={1480} height={300} fill="#2a2e36" />
    <rect x={380} y={640} width={320} height={300} fill="#0e1118" />
    <rect x={380} y={640} width={160 * gate} height={300} fill="#4a5048" stroke="#2a2e2a" strokeWidth={6} />
    <rect x={700 - 160 * gate} y={640} width={160 * gate} height={300} fill="#4a5048" stroke="#2a2e2a" strokeWidth={6} />
    <text x={540} y={620} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#d9b04a">ПУНКТ ЭВАКУАЦИИ</text>
    {/* сетка */}
    <g opacity={0.5}>
      {Array.from({length: 40}).map((_, i) => <path key={i} d={`M${-200 + i * 40} 960 l60 200`} stroke="#8a8f98" strokeWidth={2} />)}
      {Array.from({length: 40}).map((_, i) => <path key={`b${i}`} d={`M${-140 + i * 40} 960 l-60 200`} stroke="#8a8f98" strokeWidth={2} />)}
      <rect x={-200} y={950} width={1480} height={8} fill="#8a8f98" />
    </g>
  </g>
);

/** Солдат в противогазе с автоматом. */
export const Soldier: React.FC<{x: number; y: number; s?: number; facing?: 1 | -1; f: number}> = ({x, y, s = 1, facing = 1, f}) => (
  <g>
    <Character who="lev" x={x} y={y} size={s} facing={facing} frame={f} override={{top: '#3a4430', topShade: '#2c3424', bottom: '#2c3424', hair: '#2c3424'}} pose={{blink: 1, armF: [60, -70], armB: [50, -60], rim: 0.5, rimColor: '#fff6d8'}} />
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      <ellipse cx={8} cy={-372} rx={30} ry={24} fill="#1a1d22" />
      <circle cx={30} cy={-358} r={12} fill="#2a2e36" />
      <rect x={-10} y={-268} width={110} height={16} rx={6} fill="#14171d" />
    </g>
  </g>
);

/** Экран телефона: экстренное оповещение. */
export const ChsScreen: React.FC<{f: number; start: number}> = ({f, start}) => {
  const l = f - start;
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#1a0d10,#0b0e14)'}}>
      <div style={{position: 'absolute', top: 90, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 96, color: 'rgba(255,255,255,0.25)'}}>06:00</div>
      {[0, 1, 2].map((k) => (
        <div key={k} style={{position: 'absolute', left: 24, right: 24, top: 260 + k * 22, opacity: l > 8 + k * 20 ? 1 : 0, transform: `scale(${1 - k * 0.04})`, borderRadius: 26, background: k ? 'rgba(242,242,238,0.5)' : 'rgba(242,242,238,0.97)', padding: '22px 26px', zIndex: 3 - k}}>
          {k === 0 && (
            <div style={{fontFamily: FONT, color: '#14171d'}}>
              <div style={{fontWeight: 900, fontSize: 24, color: C.red, letterSpacing: 2}}>⚠ ЭКСТРЕННОЕ ОПОВЕЩЕНИЕ</div>
              <div style={{marginTop: 12, fontWeight: 900, fontSize: 40, lineHeight: 1.15}}>Режим ЧС. Оставайтесь дома. Не открывайте двери никому.</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/** Чат: не доставлено маме, одна галочка папе. */
export const ChatScreen: React.FC<{f: number; start: number; papa: number}> = ({f, start, papa}) => {
  const row = (name: string, text: string, status: React.ReactNode, show: boolean) => (
    <div style={{opacity: show ? 1 : 0, margin: '0 24px 22px', borderRadius: 26, background: 'rgba(242,242,238,0.95)', padding: '20px 24px', fontFamily: FONT, color: '#14171d'}}>
      <div style={{fontWeight: 900, fontSize: 30}}>{name}</div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8}}>
        <div style={{fontWeight: 800, fontSize: 34}}>{text}</div>
        <div style={{fontWeight: 900, fontSize: 26}}>{status}</div>
      </div>
    </div>
  );
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#141a26,#07090e)', paddingTop: 150}}>
      {row('Мама', 'Мам, ты где? Ответь', <span style={{color: C.red}}>! не доставлено</span>, f >= start + 10)}
      {row('Папа', 'Пап, мы дома. Приезжай', <span style={{color: '#6a7080'}}>✓</span>, f >= papa)}
    </div>
  );
};

/** ТВ-новости: ведущий, за ним бегущие люди. */
export const NewsTv: React.FC<{f: number; chase: number}> = ({f, chase}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#0b0e14" />
    <rect x={90} y={420} width={900} height={560} rx={24} fill="#14171d" />
    <defs><clipPath id="tvc"><rect x={110} y={440} width={860} height={520} rx={12} /></clipPath></defs>
    <g clipPath="url(#tvc)">
      <rect x={110} y={440} width={860} height={520} fill="#6a7a8a" />
      <rect x={110} y={760} width={860} height={200} fill="#4a5048" />
      {Array.from({length: 5}).map((_, i) => {
        const x = 1000 - ((f * 6 + i * 170) % 1100);
        return <g key={i} transform={`translate(${x} 860) scale(0.55)`}><Character who="mark" x={0} y={0} facing={-1} frame={f + i * 9} override={{top: ['#c95a4a', '#4a6a9a', '#d9b04a', '#3a3a44', '#6a8a5a'][i]}} pose={{step: f / 2 + i, armF: [60, -60], armB: [-50, -40], blink: 1}} /></g>;
      })}
      {chase > 0 && <g transform={`translate(${1100 - ((f * 6) % 1300) * 0.9} 860) scale(0.55)`} opacity={chase}><Zombie x={0} y={0} f={f} facing={-1} /></g>}
      <g transform="translate(330 960)"><Character who="vika" x={0} y={0} size={1.05} facing={1} frame={f} pose={{blink: blink(f, 2), mouth: 0.3 + 0.3 * Math.sin(f / 2.5), look: 0.3}} /></g>
      <rect x={110} y={880} width={860} height={80} fill="#c8302a" />
      <text x={140} y={934} fontFamily={FONT} fontWeight={900} fontSize={30} fill="#fff">СРОЧНО · ВСПЫШКА БЕШЕНСТВА В ГОРОДЕ</text>
    </g>
    <rect x={500} y={980} width={80} height={60} fill="#14171d" />
  </g>
);
