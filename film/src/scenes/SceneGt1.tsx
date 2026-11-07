import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {Glow, Shake, Toon} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineGt1';
import {easeOut, ramp, rand} from '../util';
import {HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «13 лет ждал» — день релиза, а свет погас (тренд GTA VI). */

const Can: React.FC<{x: number; y: number; c: string; t: number}> = ({x, y, c, t}) => (
  <g transform={`translate(${x} ${y - (1 - easeOut(t)) * 60})`} opacity={t}>
    <rect x={-22} y={-70} width={44} height={70} rx={6} fill={c} />
    <rect x={-22} y={-56} width={44} height={14} fill="#fff" opacity={0.5} />
    <rect x={-16} y={-76} width={32} height={8} rx={3} fill="#aab" />
  </g>
);

/** Комната: ТВ слева сверху, Марк на кресле, столик. tv: 'load' | 'off' | 'dark' | 'err'. */
const Room: React.FC<{f: number; tv: string; pct: number; dark: number; cans: number; phoneOff: boolean; candle: number; scared: boolean}> = ({f, tv, pct, dark, cans, phoneOff, candle, scared}) => {
  const tvLit = tv === 'load' || tv === 'err';
  return (
    <g>
      <Glow f={f} c1={tvLit ? '#24305a' : '#1a1e2e'} c2="#05060c" cy={600} id="groom" />
      <rect x={-200} y={1150} width={1480} height={900} fill="#141820" />
      {/* ТВ */}
      <g transform="translate(540 420)">
        <rect x={-380} y={-230} width={760} height={460} rx={18} fill="#0a0b10" stroke="#2a2e38" strokeWidth={10} />
        {tvLit && <rect x={-360} y={-210} width={720} height={420} rx={8} fill={tv === 'err' ? '#2a0c12' : '#0e1a3a'} />}
        {tv === 'load' && (
          <g>
            <text x={0} y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#fff">ЗАГРУЗКА…</text>
            <rect x={-280} y={20} width={560} height={40} rx={20} fill="#1a2240" />
            <rect x={-280} y={20} width={560 * pct} height={40} rx={20} fill="#ff4fa0" />
            <text x={0} y={130} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={60} fill={pct > 0.98 && Math.floor(f / 8) % 2 ? '#ffd23a' : '#fff'}>{Math.floor(pct * 100)}%</text>
          </g>
        )}
        {tv === 'err' && (
          <g>
            <text x={0} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill="#ff5a6a">НЕТ ПОДКЛЮЧЕНИЯ</text>
            <text x={0} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#fff">К СЕРВЕРУ</text>
            <text x={0} y={120} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={30} fill="#aab">ПОВТОРИТЬ ПОЗЖЕ</text>
          </g>
        )}
        <rect x={-60} y={230} width={120} height={40} fill="#0a0b10" />
      </g>
      {tvLit && <path d="M160 650 L920 650 L1180 1500 L-100 1500 Z" fill={tv === 'err' ? '#ff3a4a' : '#5a7aff'} opacity={0.07} />}
      {/* кресло и Марк */}
      <rect x={250} y={1000} width={580} height={220} rx={50} fill="#3a2a4a" />
      <rect x={250} y={880} width={120} height={300} rx={40} fill="#33243f" />
      <rect x={710} y={880} width={120} height={300} rx={40} fill="#33243f" />
      {scared && <Shake x={540} y={680} w={190} f={f} />}
      <Toon id="mk" x={540} y={1160} s={1.0} f={f} look={HERO} pose={{sit: 1, eyes: dark > 0.5 && candle === 0 ? 'wide' : scared ? 'wide' : tv === 'load' ? 'open' : 'half', mouth: scared ? 'fear' : tv === 'load' ? 'grin' : 'line', look: 0, armR: [60, -90], armL: [60, -90], brow: scared ? 1 : tv === 'load' ? -0.2 : 0.4, shake: scared, sweat: scared}} />
      {/* столик */}
      <rect x={760} y={1150} width={300} height={24} rx={8} fill="#5a3a24" />
      <rect x={790} y={1174} width={20} height={120} fill="#4a2e1c" /><rect x={1010} y={1174} width={20} height={120} fill="#4a2e1c" />
      <Can x={820} y={1150} c="#3ac87a" t={ramp(cans, 0, 0.3)} />
      <Can x={880} y={1150} c="#ff4fa0" t={ramp(cans, 0.25, 0.55)} />
      <Can x={940} y={1150} c="#ffd23a" t={ramp(cans, 0.5, 0.8)} />
      <g transform="translate(1010 1140) rotate(-8)"><rect x={-26} y={-8} width={52} height={10} rx={3} fill="#14171d" /><rect x={-22} y={-6} width={44} height={6} fill={phoneOff ? '#14171d' : '#4a8aff'} /></g>
      {/* свеча */}
      {candle > 0 && (
        <g transform="translate(900 1150)" opacity={candle}>
          <circle cx={0} cy={-90} r={260} fill="#ffb03a" opacity={0.12 + 0.03 * Math.sin(f / 3)} />
          <rect x={-14} y={-70} width={28} height={70} rx={4} fill="#f2ead8" />
          <path d={`M0 -110 Q${12 + Math.sin(f / 2) * 4} -86 0 -72 Q${-12 + Math.sin(f / 3) * 4} -86 0 -110`} fill="#ffcf5a" />
        </g>
      )}
      <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={dark * (candle > 0 ? 0.55 : 0.88)} />
    </g>
  );
};

/** Дом в разрезе / район: окна с синим светом приставок. */
const District: React.FC<{f: number; on: number; off: boolean}> = ({f, on, off}) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#06080e" />
    {Array.from({length: 7}).map((_, i) => {
      const x = -60 + i * 165, h = 560 + ((i * 37) % 3) * 170;
      return (
        <g key={i}>
          <rect x={x} y={1250 - h} width={150} height={h} fill="#141a24" />
          {Array.from({length: Math.floor(h / 80) * 2}).map((__, k) => {
            const lit = !off && rand(i * 31 + k) < on;
            const flick = 0.75 + 0.25 * Math.sin(f / 3 + k);
            return <rect key={k} x={x + 22 + (k % 2) * 62} y={1250 - h + 34 + Math.floor(k / 2) * 80} width={44} height={46} fill={lit ? '#5a8aff' : '#0a0e16'} opacity={lit ? flick : 1} />;
          })}
        </g>
      );
    })}
    <rect x={-200} y={1250} width={1480} height={900} fill="#0a0c12" />
  </g>
);

export const SceneGt1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const DAY = m('day'), PR = m('prep'), CA = m('cans'), PH = m('phone'), NI = m('night'), LO = m('load'), P9 = m('p99');
  const OFF = m('off'), HO = m('house'), DR = m('drill'), DI = m('district'), CN = m('candle'), WH = m('whisper');
  const HR = m('hour'), SV = m('servers'), SUB = m('sub'), TN = m('tonight');
  let scene: React.ReactNode = null;
  if (f < PR) {
    scene = <Glow f={f} c1="#3a1a4a" c2="#06040c" cy={760} id="ghook" />;
  } else if (f < OFF) {
    const pct = f < LO ? 0 : Math.min(0.99, ramp(f, LO, P9) * 0.99);
    scene = <Room f={f} tv={f >= NI ? 'load' : 'dark'} pct={pct} dark={0} cans={ramp(f, CA, CA + 30)} phoneOff={f >= PH + 15} candle={0} scared={false} />;
  } else if (f < HO) {
    scene = <Room f={f} tv="off" pct={0} dark={1} cans={1} phoneOff candle={0} scared={false} />;
  } else if (f < DR) {
    scene = <District f={f} on={0} off />;
  } else if (f < CN) {
    scene = <District f={f} on={f < DI ? ramp(f, DR, DI) : 1} off={f >= DI + 45} />;
  } else if (f < HR) {
    scene = <Room f={f} tv="off" pct={0} dark={1} cans={1} phoneOff candle={ramp(f, CN, CN + 20)} scared={false} />;
  } else if (f < SUB) {
    scene = <Room f={f} tv={f >= SV ? 'err' : 'load'} pct={0.99} dark={0} cans={1} phoneOff candle={0} scared={f >= SV} />;
  } else {
    scene = <Glow f={f} c1="#3a2a5a" c2="#0a0810" cy={700} id="gsub" />;
  }
  const years = Math.round(2013 + 13 * ramp(f, 0, 60));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f < PR && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 260, gap: 30}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 104, color: C.white, textAlign: 'center', lineHeight: 1.02, textShadow: '0 6px 0 #000'}}>13 ЛЕТ<br /><span style={{color: '#ff4fa0'}}>ЖДАЛИ</span></div>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 120, color: '#ffd23a'}}>{years}</div>
          {f >= DAY && <div style={{padding: '14px 36px', borderRadius: 20, background: '#ff4fa0', fontFamily: FONT, fontWeight: 900, fontSize: 50, color: '#fff', opacity: ramp(f, DAY, DAY + 8), transform: `scale(${1.2 - 0.2 * easeOut(ramp(f, DAY, DAY + 10))})`}}>ДЕНЬ РЕЛИЗА</div>}
        </AbsoluteFill>
      )}
      {f >= PR && f < NI && <Chip x={540} y={200} text={f < PH ? 'ОТГУЛ + ЭНЕРГЕТИКИ' : 'ТЕЛЕФОН — ВЫКЛ'} kind="yellow" t={ramp(f, PR, PR + 10)} tilt={-2} size={42} />}
      {f >= NI && f < OFF && <Chip x={540} y={200} text="00:00" kind="white" t={ramp(f, NI, NI + 8)} tilt={0} size={56} />}
      {f >= OFF && f < HO && <Chip x={540} y={330} text="ЩЁЛК." kind="white" t={ramp(f, OFF + 10, OFF + 16)} tilt={0} size={56} />}
      {f >= HO && f < DR && <Chip x={540} y={330} text="ВО ВСЁМ ДОМЕ" kind="red" t={ramp(f, HO, HO + 8)} tilt={-2} size={48} />}
      {f >= DR && f < CN && <Chip x={540} y={330} text={f < DI ? 'СОСЕД С ПЕРФОРАТОРОМ?' : 'ВЕСЬ РАЙОН ВКЛЮЧИЛ ПРИСТАВКИ'} kind={f < DI ? 'white' : 'yellow'} t={ramp(f, f < DI ? DR : DI, (f < DI ? DR : DI) + 8)} tilt={2} size={38} />}
      {f >= WH && f < HR && <Chip x={540} y={200} text="«ПОДОЖДУ ЕЩЁ ЧАС»" kind="white" t={ramp(f, WH, WH + 10)} tilt={-2} size={42} />}
      {f >= HR && f < SV && <Chip x={540} y={200} text="+1 ЧАС · СВЕТ ЕСТЬ" kind="yellow" t={ramp(f, HR, HR + 8)} tilt={0} size={42} />}
      {f >= SV && f < SUB && <Chip x={540} y={200} text="А СЕРВЕРА — НЕТ" kind="red" t={ramp(f, SV, SV + 8)} tilt={-3} size={50} />}
      {f >= SUB && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 62, color: C.white, textAlign: 'center', opacity: ramp(f - SUB, 0, 10)}}>КАЖДЫЙ ДЕНЬ<br />НОВЫЕ ИСТОРИИ</div>
          <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SUB) / 4)})`, opacity: ramp(f - SUB, 6, 14)}}>+ ПОДПИСАТЬСЯ</div>
          {f >= TN && <div style={{marginTop: 20, padding: '14px 30px', borderRadius: 20, background: '#ffd23a', fontFamily: FONT, fontWeight: 900, fontSize: 38, color: '#14171d', opacity: ramp(f - TN, 0, 10)}}>19:00 — «БЕЗ СИГНАЛА» · ЧАСТЬ 2</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
