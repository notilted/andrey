import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {ApartmentBack, ROOM} from '../components/Apartment';
import {B, BizCard, Block, DaySky, GrannyPhoto, Kiosk, PaperCloseup, Street, ViralScreen} from '../components/Bm';
import {Character} from '../components/Character';
import {Chip} from '../components/Overlay';
import {PhoneFrame} from '../components/Phone';
import {C, FONT} from '../theme';
import {mk} from '../timelineBm3';
import {blink, easeOut, ramp} from '../util';
import {BmCard, KioskInside} from './SceneBm1';
import {camera, ease01, SVG} from './twkit';

/** Деньги в финале: 11 000 → рост. */
export const moneyBm3 = (f: number) => {
  const k: [number, number][] = [[0, 11000], [mk('reopen'), 11000], [mk('million'), 40000], [mk('king_off'), 260000], [mk('night'), 480000], [mk('year'), 520000], [mk('wall'), 3400000]];
  return Math.round(interpolate(f, k.map((x) => x[0]), k.map((x) => x[1]), {extrapolateRight: 'clamp'}) / 1000) * 1000;
};

const STUDENT = {top: '#4a6a9a', topShade: '#3a5a8a', hair: '#2a1a14', bottom: '#2a2e38'};
const SUIT = {top: '#1d2129', topShade: '#14171d', hair: '#3a3a3a', bottom: '#1d2129', shoes: '#0d0f12'};
const KNAME = 'ШАУРМА У КОЛЛЕДЖА';

const Tries: React.FC<{f: number}> = ({f}) => {
  const TR = mk('tries');
  const n = Math.min(40, 1 + Math.floor((f - TR) / 6));
  return (
    <>
      <SVG>
        <g transform="translate(540 860) scale(1.5) translate(-520 -860)">
          <KioskInside f={f} staff={false} lights={0.55}>
            <Character who="mark" x={560} y={1100} size={1.15} facing={1} frame={f} pose={{armF: [80, -40 + Math.sin(f / 3) * 25], blink: blink(f, 1), brow: 0.6, mouth: Math.floor(f / 18) % 2 ? 0.3 : 0}} />
          </KioskInside>
          <rect x={150} y={1010} width={70} height={100} rx={6} fill="#3a4048" />
        </g>
      </SVG>
      <Chip x={540} y={330} text={`ПОПЫТКА ${n}`} kind={n < 40 ? 'white' : 'yellow'} t={1} tilt={0} size={46} />
    </>
  );
};

const Taste: React.FC<{f: number}> = ({f}) => {
  const TA = mk('taste');
  const FL = mk('flash');
  const flash = f >= FL && f < FL + 50;
  return (
    <SVG>
      <defs><filter id="tsep"><feColorMatrix type="matrix" values="0.45 0.7 0.18 0 0.02  0.38 0.62 0.16 0 0.01  0.28 0.48 0.12 0 0  0 0 0 1 0" /></filter></defs>
      <g transform={`translate(540 860) scale(${2.8 + (f - TA) / 1200}) translate(-560 -800)`}>
        <KioskInside f={f} staff={false} lights={0.7}>
          <Character who="mark" x={560} y={1100} size={1.15} facing={1} frame={f} pose={{armF: [120, -110], blink: f >= TA + 30 ? 0.05 : 1, brow: f >= TA + 30 ? -0.6 : 0.3, smile: f >= TA + 40 ? 0.7 : 0, look: 0.3}} />
        </KioskInside>
      </g>
      {flash && (
        <g filter="url(#tsep)" opacity={Math.min(1, (f - FL) / 6) * (1 - ramp(f, FL + 40, FL + 50))}>
          <rect width={1080} height={1920} fill="#cfc4ae" />
          <g transform="translate(540 860) scale(2.2) translate(-540 -900)">
            <Character who="galina" x={540} y={1100} size={1.2} facing={1} frame={f} pose={{armF: [70, -60], smile: 0.9, blink: 1, look: 0.4}} />
          </g>
        </g>
      )}
    </SVG>
  );
};

/** Ларёк снаружи: открытие, студент, очередь, «Кинг» гаснет, костюм. */
const Street3: React.FC<{f: number}> = ({f}) => {
  const RE = mk('reopen');
  const ST = mk('student');
  const TW = mk('two');
  const LI = mk('line');
  const KO = mk('king_off');
  const SU = mk('suit');
  const queue = f >= LI;
  const kingOff = f >= KO + 30;
  const cam = camera(f, [[RE, 480, 1250, 1.4], [mk('free'), 300, 1100, 2.2], [ST, 560, 1250, 1.5], [TW, 600, 1230, 2.0], [LI, 100, 1200, 0.8], [KO - 20, 100, 1200, 0.8], [KO, 1320, 1150, 1.3], [SU, 520, 1250, 1.5]]);
  return (
    <SVG>
      <g transform={cam}>
        <DaySky dusk={f >= KO && f < SU ? 0.6 : 0} />
        <Block x={-800} w={700} h={1000} color="#b88a6a" lit={0.2} sign="КОЛЛЕДЖ" signColor="#2a4a8a" />
        <Block x={1720} w={700} h={520} color="#8a909a" sign="АВТОСЕРВИС" signColor="#c8302a" />
        <Kiosk x={420} f={f} name={KNAME} open />
        <g transform={`translate(${300} ${B.ground - 300}) rotate(-3)`}>
          <rect x={-150} y={-60} width={300} height={110} rx={8} fill="#ffd24a" />
          <text x={0} y={-16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={22} fill={B.red}>ПЕРВАЯ — БЕСПЛАТНО</text>
          <text x={0} y={20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={17} fill="#3a2e25">Не понравится — вторая тоже</text>
        </g>
        <Kiosk x={1320} f={f} name="ШАУРМА-КИНГ" color={B.red} price={kingOff ? undefined : '99 ₽'} open={!kingOff} dark={kingOff ? 1 : 0} />
        <Street />
        {f >= ST && f < LI && (
          <g>
            <Character who="mark" hair="lev" x={640} y={B.ground + 10} size={0.95} facing={-1} frame={f} override={STUDENT} pose={{armF: f >= TW ? [100, -40] : [110, -110], blink: blink(f, 21), smile: f >= TW ? 0.7 : 0, look: 0.4}} />
            {f >= TW && [0, 1].map((i) => <rect key={i} x={560 + i * 26} y={B.ground - 230} width={20} height={56} fill={B.lavash} />)}
          </g>
        )}
        {queue && f < SU && Array.from({length: 16}).map((_, i) => (
          <Character key={i} who="mark" hair={(['lev', 'alisa', 'mark', 'galina'] as const)[i % 4]} x={240 - i * 62} y={B.ground + 30 + (i % 2) * 10} size={0.72} facing={1} frame={f + i * 9}
            override={{top: ['#4a6a9a', '#c95a4a', '#6a8a5a', '#3a3a44'][i % 4], topShade: '#333', hair: '#2a1a14', bottom: '#2a2e38'}} pose={{blink: blink(f, i + 30), smile: 0.4}} />
        ))}
        {f >= SU && (
          <g>
            <Character who="lev" x={interpolate(f, [SU, SU + 50], [900, 660], {extrapolateRight: 'clamp'})} y={B.ground + 10} size={1.0} facing={-1} frame={f} override={SUIT}
              pose={{step: f < SU + 50 ? f / 3 : 0, armF: f >= mk('card') ? [90, -20] : [10, -14], blink: blink(f, 44), brow: -0.4, look: 0.4}} />
            <Character who="mark" x={520} y={B.ground} size={0.95} facing={1} frame={f} pose={{blink: blink(f, 1), brow: 0.6, look: 0.4}} />
          </g>
        )}
      </g>
    </SVG>
  );
};

const CardShot: React.FC<{f: number}> = ({f}) => (
  <SVG>
    <rect width={1080} height={1920} fill="#14110e" />
    <rect x={0} y={900} width={1080} height={1020} fill="#6a5a46" />
    <g transform={`translate(540 860) scale(${2.4 + (f - mk('card')) / 900}) translate(-540 -900)`}>
      <BizCard x={540} y={900} s={1} />
    </g>
  </SVG>
);

const Compare: React.FC<{f: number}> = ({f}) => {
  const CO = mk('compare');
  const a = easeOut(ramp(f, CO, CO + 14));
  return (
    <AbsoluteFill style={{background: '#0e1118', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: C.white, paddingBottom: 400}}>
      <div style={{fontWeight: 900, fontSize: 104, color: C.warm, opacity: a}}>5 000 000 ₽</div>
      <div style={{fontWeight: 800, fontSize: 40, color: C.grey, marginTop: 20, opacity: ramp(f, CO + 20, CO + 30)}}>= 2,5 × бабушкины</div>
      <div style={{fontWeight: 900, fontSize: 64, marginTop: 10, opacity: ramp(f, CO + 30, CO + 40)}}>2 000 000 ₽</div>
    </AbsoluteFill>
  );
};

const Night: React.FC<{f: number}> = ({f}) => (
  <SVG>
    <g transform={`translate(540 860) scale(${1.9 + (f - mk('night')) / 1500}) translate(-520 -880)`}>
      <ApartmentBack f={f} lamp={0.5} />
      <rect x={250} y={930} width={560} height={18} rx={4} fill={C.woodHi} />
      <Character who="mark" x={460} y={ROOM.floor} size={1.2} facing={1} frame={f} pose={{sit: 1, lean: 18, headTilt: 10, armF: [70, -80], blink: blink(f, 1), brow: 0.6, lookUp: -0.6}} />
      <rect x={560} y={918} width={110} height={12} fill="#e9ecf2" />
      <rect x={690} y={920} width={60} height={10} fill="#ece6d4" />
      <rect x={250} y={330} width={560} height={780} fill="#0a1228" opacity={0.25} />
    </g>
  </SVG>
);

const PhoneNo: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: '#06080d'}}>
    <PhoneFrame x={540} y={720} scale={0.95} tilt={-2} f={f} glow={C.warm} glowK={0.25}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#1a1f2b,#0c0e14)', fontFamily: FONT, color: C.white}}>
        <div style={{position: 'absolute', top: 200, width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 26, color: C.grey}}>идёт вызов · 00:0{Math.min(9, Math.floor((f - mk('no')) / 30))}</div>
        <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', fontWeight: 900, fontSize: 52}}>FOOD GROUP</div>
        <div style={{position: 'absolute', top: 460, width: '100%', textAlign: 'center', fontWeight: 900, fontSize: 140, color: C.red, opacity: ramp(f, mk('no_word'), mk('no_word') + 6)}}>НЕТ</div>
      </div>
    </PhoneFrame>
  </AbsoluteFill>
);

/** Через год: три точки. */
const Year: React.FC<{f: number}> = ({f}) => {
  const YE = mk('year');
  return (
    <SVG>
      <g transform={`translate(540 860) scale(${0.62 + (f - YE) / 3000}) translate(-1100 -1200)`}>
        <DaySky dusk={0.3} />
        {[0, 1, 2].map((i) => (
          <g key={i} opacity={ramp(f, YE + i * 20, YE + i * 20 + 12)}>
            <Block x={-200 + i * 900} w={600} h={800} color={['#b88a6a', '#9aa0a8', '#c9b49a'][i]} lit={0.3} />
            <Kiosk x={100 + i * 900} f={f} name={['ШАУРМА У КОЛЛЕДЖА', 'ШАУРМА · ТОЧКА 2', 'ШАУРМА · ТОЧКА 3'][i]} open />
            {Array.from({length: 6}).map((_, k) => (
              <Character key={k} who="mark" hair={(['lev', 'alisa', 'mark'] as const)[k % 3]} x={300 + i * 900 + k * 60} y={B.ground + 20} size={0.7} facing={-1} frame={f + k * 7}
                override={{top: ['#4a6a9a', '#c95a4a', '#6a8a5a'][k % 3], topShade: '#333', hair: '#2a1a14', bottom: '#2a2e38'}} pose={{blink: blink(f, k + i * 9), smile: 0.4}} />
            ))}
          </g>
        ))}
        <Street />
      </g>
    </SVG>
  );
};

/** Стена: фото бабушки, записка и «Не потратил». */
const Wall: React.FC<{f: number}> = ({f}) => {
  const WA = mk('wall');
  const NO = mk('note');
  const SG = mk('signed');
  const write = interpolate(f, [SG, SG + 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <SVG>
      <rect width={1080} height={1920} fill="#d8cdb6" />
      <g transform={`translate(540 760) scale(${1.25 + (f - WA) / 2000}) translate(-540 -760)`}>
        <GrannyPhoto x={540} y={600} s={1.6}>
          <Character who="galina" x={4} y={260} size={1.1} facing={1} frame={f} pose={{smile: 0.8, blink: 1, look: 0.2, rim: 0}} />
        </GrannyPhoto>
        <g opacity={ramp(f, NO, NO + 10)} transform="rotate(-3 380 1030)">
          <rect x={250} y={960} width={260} height={140} fill="#ece6d4" />
          <text x={380} y={1040} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontStyle="italic" fontSize={26} fill="#2a2e45">Не трать на ерунду.</text>
        </g>
        <g opacity={ramp(f, SG, SG + 6)} transform="rotate(4 700 1040)">
          <rect x={570} y={970} width={260} height={140} fill="#f2f2ee" />
          <clipPath id="writeClip"><rect x={570} y={970} width={260 * write} height={140} /></clipPath>
          <text x={700} y={1052} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontStyle="italic" fontSize={34} fill="#3c4a6a" clipPath="url(#writeClip)">Не потратил.</text>
        </g>
      </g>
    </SVG>
  );
};

/* ───────── сцена целиком ───────── */
export const SceneBm3: React.FC<{f: number}> = ({f}) => {
  const NB = mk('notebook');
  const RC = mk('recipes');
  const MA = mk('marinade');
  const IN = mk('ingredients');
  const TR = mk('tries');
  const TA = mk('taste');
  const RE = mk('reopen');
  const VI = mk('video');
  const MI = mk('million');
  const LI = mk('line');
  const CA = mk('card');
  const OF = mk('offer');
  const CO = mk('compare');
  const NI = mk('night');
  const NO = mk('no');
  const YE = mk('year');
  const WA = mk('wall');
  const TITLE = mk('title');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f < RC && <PaperCloseup t={f - NB} kind="notebook" title="Внуку." lines={['', 'Когда будет трудно.']} tilt={-2} />}
      {f >= RC && f < MA && <PaperCloseup t={f - RC} kind="notebook" title="Рецепты" lines={['Пирожки с капустой', 'Борщ', 'Плов']} tilt={2} />}
      {f >= MA && f < IN && <PaperCloseup t={f - MA} kind="notebook" title="Маринад" lines={['для мяса, которое', 'любят все']} tilt={-2} />}
      {f >= IN && f < TR && <PaperCloseup t={f - IN} kind="notebook" title="Маринад" lines={['кефир — 1 стакан', 'зира — щепотка', 'чеснок — 3 зубчика', 'гранатовый сок — капля', '', 'Мясо должно ночевать!']} tilt={1} />}
      {f >= TR && f < TA && <Tries f={f} />}
      {f >= TA && f < RE && <Taste f={f} />}
      {((f >= RE && f < VI) || (f >= LI && f < CA)) && <Street3 f={f} />}
      {f >= VI && f < LI && (
        <AbsoluteFill style={{background: '#06080d'}}>
          <PhoneFrame x={540} y={720} scale={0.95} tilt={-2} f={f} glow={C.red} glowK={0.3}>
            <ViralScreen t={f - VI} views={f < MI ? interpolate(f, [VI, MI], [120, 18000]) : interpolate(f, [MI, MI + 40], [18000, 1000000], {extrapolateRight: 'clamp'})} />
          </PhoneFrame>
        </AbsoluteFill>
      )}
      {f >= CA && f < CO && <CardShot f={f} />}
      {f >= OF && f < CO && <Chip x={540} y={1180} text="5 000 000 ₽ ЗА РЕЦЕПТ" kind="yellow" t={ramp(f, OF, OF + 10)} tilt={-2} size={44} />}
      {f >= CO && f < NI && <Compare f={f} />}
      {f >= NI && f < NO && <Night f={f} />}
      {f >= NO && f < YE && <PhoneNo f={f} />}
      {f >= YE && f < WA && <Year f={f} />}
      {f >= YE && f < WA && <Chip x={540} y={330} text="3 ТОЧКИ · 12 СОТРУДНИКОВ" kind="yellow" t={ramp(f, YE + 30, YE + 40)} tilt={-2} size={34} />}
      {f >= WA && f < TITLE && <Wall f={f} />}
      {f >= TITLE && <AbsoluteFill style={{background: C.void}}><BmCard f={f} start={TITLE} ep={3} teaser="ПАМЯТИ БАБУШЕК, КОТОРЫЕ В НАС ВЕРИЛИ" final /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
