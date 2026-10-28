import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {AdScreen, B, BankScreen, Block, CallScreen2, CctvShop, DaySky, Kiosk, PaperCloseup, Street} from '../components/Bm';
import {Character} from '../components/Character';
import {Chip} from '../components/Overlay';
import {PhoneFrame} from '../components/Phone';
import {C, FONT} from '../theme';
import {mk} from '../timelineBm2';
import {blink, ramp, rand} from '../util';
import {BmCard, KioskInside, LENA, RUSTAM, Walkers} from './SceneBm1';
import {camera, ease01, SVG} from './twkit';

/** Деньги на счёте во второй серии. */
export const moneyBm2 = (f: number) => {
  const k: [number, number][] = [[0, 190000], [mk('month'), 190000], [mk('meat'), 120000], [mk('alone'), 80000], [mk('queue'), 52000], [mk('sealed'), 30000], [mk('broke'), 11000]];
  return Math.round(interpolate(f, k.map((x) => x[0]), k.map((x) => x[1]), {extrapolateRight: 'clamp'}) / 1000) * 1000;
};

const STUDENT = {top: '#4a6a9a', topShade: '#3a5a8a', hair: '#2a1a14', bottom: '#2a2e38'};
const INSPECTOR = {top: '#2a3a5a', topShade: '#1d2a44', hair: '#3a3a3a', bottom: '#1d2129'};
const KNAME = 'ШАУРМА У КОЛЛЕДЖА';

/** Шаурма в руке (k — насколько развалилась). */
const Wrap: React.FC<{x: number; y: number; k: number}> = ({x, y, k}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-22 0 L22 0 L30 -90 L-30 -90 Z" fill="#e8d2a0" transform={`rotate(${k * 25})`} />
    {k > 0 && [0, 1, 2, 3].map((i) => <circle key={i} cx={-10 + i * 8} cy={20 + k * (60 + i * 40)} r={7} fill={i % 2 ? '#a8622e' : '#6aa84a'} />)}
    {k > 0 && <path d={`M-14 0 q4 ${30 * k} 0 ${60 * k}`} stroke="#f2f2ee" strokeWidth={6} fill="none" />}
  </g>
);

const Counter: React.FC<{f: number}> = ({f}) => {
  const FI = mk('first');
  const FA = mk('fall');
  const k = ease01(f, FA, FA + 30);
  return (
    <SVG>
      <g transform={`translate(540 860) scale(${1.5 + (f - FI) / 900}) translate(-520 -860)`}>
        <KioskInside f={f} staff={false} hero={440} />
        <Character who="mark" hair="lev" x={600} y={1300} size={1.3} facing={-1} frame={f} override={STUDENT}
          pose={{armF: [110, -50], blink: blink(f, 21), brow: k > 0.2 ? 0.9 : 0, mouth: f > FA - 20 && f < FA ? 0.4 : 0, look: 0.4}} />
        <Wrap x={520} y={980} k={k} />
      </g>
    </SVG>
  );
};

/** Улица у ларька; king — «Шаурма-Кинг» напротив; queue — очередь к ним. */
const StreetShot: React.FC<{f: number}> = ({f}) => {
  const TR = mk('trash');
  const RU = mk('rustam');
  const RE = mk('reno');
  const KI = mk('king');
  const BA = mk('banner');
  const QU = mk('queue');
  const KN = mk('knock');
  const SE = mk('sealed');
  const kingBuilt = f >= KI;
  const evening = f >= RU && f < mk('alone') ? 1 : 0;
  const throwK = ease01(f, TR + 40, TR + 70);
  const cam = camera(f, [
    [TR, 520, 1250, 1.5], [RU, 600, 1250, 1.4], [RE, 900, 1200, 0.9], [KI, 1300, 1200, 1.2], [BA, 1300, 1050, 1.6], [mk('price'), 1300, 1050, 1.6],
    [QU, 900, 1200, 0.85], [KN, 560, 1250, 1.5], [SE, 560, 1220, 1.4], [mk('broke'), 560, 1220, 1.4],
  ]);
  return (
    <SVG>
      <g transform={cam}>
        <DaySky dusk={evening} night={evening * 0.7} />
        <Block x={-800} w={700} h={1000} color="#b88a6a" lit={0.2} sign="КОЛЛЕДЖ" signColor="#2a4a8a" />
        <Block x={1720} w={700} h={520} color="#8a909a" sign="АВТОСЕРВИС" signColor="#c8302a" />
        <Kiosk x={420} f={f} name={KNAME} open={f < SE} dark={f >= SE ? 1 : 0} seal={f >= SE} />
        {/* напротив: стройка → «Шаурма-Кинг» */}
        {!kingBuilt && f >= RE && (
          <g>
            <rect x={1080} y={B.ground - 380} width={480} height={380} fill="#6a7080" />
            {Array.from({length: 6}).map((_, i) => <rect key={i} x={1060 + i * 90} y={B.ground - 420} width={8} height={420} fill="#c9a030" />)}
            {Array.from({length: 4}).map((_, i) => <rect key={i} x={1060} y={B.ground - 400 + i * 100} width={520} height={8} fill="#c9a030" />)}
          </g>
        )}
        {kingBuilt && <Kiosk x={1320} f={f} name="ШАУРМА-КИНГ" color={B.red} price={f >= BA ? '99 ₽' : undefined} />}
        <Street />
        {/* урна */}
        <rect x={700} y={B.ground - 90} width={60} height={90} rx={6} fill="#3a4048" />
        {f >= TR && f < mk('month') && (
          <g>
            <Character who="mark" hair="lev" x={820 - throwK * 40} y={B.ground + 10} size={0.95} facing={-1} frame={f} override={STUDENT} pose={{armF: [60 + throwK * 50, -20], blink: blink(f, 21), brow: 0.6}} />
            {throwK < 1 && <rect x={760 - throwK * 30} y={B.ground - 170 + throwK * 90} width={20} height={50} fill="#e8d2a0" transform={`rotate(${throwK * 120} ${770} ${B.ground - 140})`} />}
            <Character who="mark" x={560} y={B.ground} size={0.95} facing={1} frame={f} pose={{blink: blink(f, 1), brow: 1, look: 0.5}} />
          </g>
        )}
        {f >= RU && f < mk('alone') && (
          <g>
            <Character who="mark" hair="lev" x={interpolate(f, [RU, mk('alone')], [620, 1100])} y={B.ground + 10} size={0.95} facing={1} frame={f} override={RUSTAM} pose={{step: f / 3, armB: [-10, -10], blink: blink(f, 6), look: 0.6}} />
            <path d={`M${interpolate(f, [RU, mk('alone')], [580, 1060])} ${B.ground - 120} q20 -10 40 0 l6 70 l-52 0 Z`} fill="#e8e4da" />
            <rect x={interpolate(f, [RU, mk('alone')], [588, 1068])} y={B.ground - 100} width={30} height={22} fill="#a8622e" opacity={0.8} />
          </g>
        )}
        {f >= QU && (
          <g>
            {Array.from({length: 14}).map((_, i) => (
              <Character key={i} who="mark" hair={(['lev', 'alisa', 'mark', 'galina'] as const)[i % 4]} x={1520 + i * 70} y={B.ground + 30 + (i % 2) * 10} size={0.75} facing={-1} frame={f + i * 9}
                override={{top: ['#4a6a9a', '#c95a4a', '#6a8a5a', '#3a3a44'][i % 4], topShade: '#333', hair: '#2a1a14', bottom: '#2a2e38'}} pose={{blink: blink(f, i + 30), lookUp: 0.1}} />
            ))}
            <Character who="mark" x={640} y={B.ground} size={0.9} facing={1} frame={f} pose={{blink: blink(f, 1), brow: 0.9, look: 0.6}} />
          </g>
        )}
        {f >= KN && f < SE && (
          <g>
            <Character who="mark" hair="mark" x={760} y={B.ground} size={0.95} facing={-1} frame={f} override={INSPECTOR} pose={{armF: [80, -60], blink: blink(f, 33), brow: -0.4, look: 0.3}} />
            <rect x={680} y={B.ground - 260} width={70} height={90} fill="#e8e4da" transform={`rotate(-8 715 ${B.ground - 215})`} />
          </g>
        )}
        <rect x={-3000} y={-2000} width={8000} height={6000} fill="#05070e" opacity={f >= SE ? 0.3 : 0} />
      </g>
    </SVG>
  );
};

/** График выручки за месяц. */
const Chart: React.FC<{f: number}> = ({f}) => {
  const MO = mk('month');
  const days = Math.floor(interpolate(f, [MO, MO + 90], [0, 30], {extrapolateRight: 'clamp'}));
  const y0 = 1150;
  const sc = 0.022;
  return (
    <SVG>
      <rect width={1080} height={1920} fill="#0e1118" />
      <text x={90} y={420} fontFamily={FONT} fontWeight={900} fontSize={42} fill={C.white}>ВЫРУЧКА ЗА ДЕНЬ</text>
      <line x1={80} y1={y0 - 25000 * sc} x2={1000} y2={y0 - 25000 * sc} stroke={C.red} strokeWidth={5} strokeDasharray="18 12" />
      <text x={1000} y={y0 - 25000 * sc - 16} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.red}>НУЖНО 25 000 ₽</text>
      {Array.from({length: days}).map((_, i) => {
        const v = 2500 + rand(i + 3) * 3200;
        return <rect key={i} x={90 + i * 30} y={y0 - v * sc} width={22} height={v * sc} fill={C.warm} />;
      })}
      <rect x={80} y={y0} width={920} height={4} fill="#4a5160" />
      <text x={90} y={y0 + 70} fontFamily={FONT} fontWeight={900} fontSize={38} fill={C.warm} opacity={ramp(f, MO + 60, MO + 70)}>≈ 4 000 ₽</text>
    </SVG>
  );
};

const Cctv: React.FC<{f: number}> = ({f}) => {
  const CC = mk('cctv');
  const PO = mk('pocket');
  const pocket = ease01(f, PO - 10, PO + 10);
  return (
    <AbsoluteFill style={{background: '#050608'}}>
      <div style={{position: 'absolute', left: 540, top: 720, transform: 'translate(-50%,-50%)', padding: 30, borderRadius: 40, background: '#1b1e24'}}>
        <div style={{borderRadius: 22, overflow: 'hidden'}}>
          <CctvShop t={f - CC}>
            <rect width={1000} height={760} fill="#c8bea6" />
            <rect x={0} y={520} width={1000} height={240} fill="#7a6a52" />
            <rect x={300} y={430} width={170} height={90} fill="#1d2129" />
            <g transform="translate(-40 -120) scale(1.4)">
              <Character who="vika" x={460} y={640} size={1.2} facing={1} frame={f} override={LENA} pose={{armF: pocket > 0.1 ? [20 - pocket * 30, -20] : [80, -60], blink: blink(f, 5), look: -0.6, lookUp: pocket > 0.5 ? 0 : -0.3}} />
            </g>
          </CctvShop>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Alone: React.FC<{f: number}> = ({f}) => {
  const AL = mk('alone');
  const FI = mk('fire');
  const FV = mk('five');
  const phase = f < FI ? 0 : Math.floor((f - FI) / 25) % 3;
  return (
    <SVG>
      <g transform={`translate(540 860) scale(1.45) translate(-500 -860)`}>
        <KioskInside f={f} staff={f < FI} lights={f >= FV ? 0.5 : 1}>
          {f >= FI && <Character who="mark" x={[640, 260, 440][phase]} y={1100} size={1.15} facing={phase === 1 ? -1 : 1} frame={f}
            pose={{armF: phase === 0 ? [80, -40 + Math.sin(f / 4) * 20] : phase === 1 ? [70, -60] : [40, -10], lean: phase === 2 ? 25 : 0, blink: blink(f, 1), brow: 0.8}} />}
          {f < FI && <Character who="mark" x={440} y={1100} size={1.15} facing={1} frame={f} pose={{armF: [100, -20], blink: blink(f, 1), brow: 1, mouth: 0.5 + 0.3 * Math.sin(f / 3)}} />}
          {f >= FI && phase === 2 && <rect x={470} y={980} width={8} height={160} fill="#6a5a46" transform={`rotate(${20 + Math.sin(f / 5) * 15} 474 1060)`} />}
        </KioskInside>
      </g>
    </SVG>
  );
};

/** Сравнение цен. */
const Price: React.FC<{f: number}> = ({f}) => {
  const PR = mk('price');
  return (
    <AbsoluteFill style={{display: 'flex', flexDirection: 'row', fontFamily: FONT}}>
      <div style={{flex: 1, background: B.red, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ffd24a'}}>
        <div style={{fontWeight: 900, fontSize: 40}}>ОНИ</div>
        <div style={{fontWeight: 900, fontSize: 130}}>99 ₽</div>
      </div>
      <div style={{flex: 1, background: '#e8d2a0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#3a2e25'}}>
        <div style={{fontWeight: 900, fontSize: 40}}>ТЫ</div>
        <div style={{fontWeight: 900, fontSize: 130}}>280 ₽</div>
        <div style={{marginTop: 30, padding: '10px 22px', borderRadius: 20, background: '#14171d', color: C.white, fontWeight: 900, fontSize: 34, opacity: ramp(f, PR + 60, PR + 70)}}>МЯСО: 110 ₽</div>
      </div>
    </AbsoluteFill>
  );
};

/** Коробка с именем. */
const Box: React.FC<{f: number}> = ({f}) => (
  <SVG>
    <rect width={1080} height={1920} fill="#14110e" />
    <g transform={`translate(540 860) scale(${1 + (f - mk('box')) / 700}) translate(-540 -860)`}>
      <polygon points="260,700 820,700 900,1050 180,1050" fill="#a8885e" />
      <polygon points="180,1050 900,1050 900,1300 180,1300" fill="#c9a87a" />
      <rect x={400} y={1110} width={280} height={120} fill="#ece6d4" transform="rotate(-3 540 1170)" />
      <text x={540} y={1190} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontStyle="italic" fontSize={54} fill="#2a2e45" transform="rotate(-3 540 1170)">Внуку</text>
    </g>
  </SVG>
);

/* ───────── сцена целиком ───────── */
export const SceneBm2: React.FC<{f: number}> = ({f}) => {
  const TR = mk('trash');
  const MO = mk('month');
  const ME = mk('meat');
  const CC = mk('cctv');
  const RU = mk('rustam');
  const AL = mk('alone');
  const FV = mk('five');
  const RE = mk('reno');
  const PR = mk('price');
  const QU = mk('queue');
  const CO = mk('complaint');
  const SE = mk('sealed');
  const BR = mk('broke');
  const AD = mk('ad');
  const HO = mk('hover');
  const CA = mk('call');
  const BX = mk('box');
  const TITLE = mk('title');
  const street = (f >= TR && f < MO) || (f >= RU && f < AL) || (f >= RE && f < PR) || (f >= QU && f < BR);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f < TR && <Counter f={f} />}
      {street && <StreetShot f={f} />}
      {f >= MO && f < ME && <Chart f={f} />}
      {f >= ME && f < CC && <PaperCloseup t={f - ME} kind="notebook" title="Учёт" lines={['Закуплено: 50 порций', 'Продано: 30', '', 'Где ещё 20?']} />}
      {f >= CC && f < RU && <Cctv f={f} />}
      {f >= AL && f < RE && <Alone f={f} />}
      {f >= FV && f < RE && <Chip x={540} y={330} text={f < FV + 45 ? 'ПОДЪЁМ 05:00' : 'ОТБОЙ 01:00'} kind="white" t={1} tilt={0} size={44} />}
      {f >= PR && f < QU && <Price f={f} />}
      {f >= mk('king') && f < PR && <Chip x={540} y={330} text="40 ТОЧЕК ПО ГОРОДУ" kind="red" t={ramp(f, mk('king') + 20, mk('king') + 30)} tilt={-2} size={34} />}
      {f >= CO && f < SE && <PaperCloseup t={f - CO} kind="note" title="ЖАЛОБА" lines={['Отравился шаурмой', 'в ларьке у колледжа.', '', 'Аноним']} />}
      {f >= SE && f < BR && <Chip x={540} y={330} text="ЗАКРЫТО НА НЕДЕЛЮ" kind="red" t={ramp(f, SE + 10, SE + 20)} tilt={-2} size={40} />}
      {f >= BR && f < AD && (
        <AbsoluteFill style={{background: '#06080d'}}>
          <PhoneFrame x={540} y={720} scale={0.95} tilt={-2} f={f} glow={C.red} glowK={0.3}><BankScreen value={11000} items={[['Аренда через 3 дня', -110000]]} t={f - BR} /></PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= AD && f < CA && (
        <AbsoluteFill style={{background: '#06080d'}}>
          <PhoneFrame x={540} y={720} scale={0.95} tilt={-2} f={f} glow="#3aa25a" glowK={0.25}><AdScreen t={f - AD} publish={f >= HO ? 0.5 + 0.5 * Math.sin(f / 4) : 0} /></PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= CA && f < BX && (
        <AbsoluteFill style={{background: '#06080d'}}>
          <PhoneFrame x={540} y={720} scale={0.95} tilt={-2} f={f} shake={0.5} glow="#3aa25a" glowK={0.3}><CallScreen2 name="Мама" t={f - CA} /></PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= BX && f < TITLE && <Box f={f} />}
      {f >= TITLE && <AbsoluteFill style={{background: C.void}}><BmCard f={f} start={TITLE} ep={2} teaser="КОРОБКА С ТВОИМ ИМЕНЕМ" /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
