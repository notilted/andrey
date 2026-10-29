import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ApartmentBack} from '../components/Apartment';
import {Chip} from '../components/Overlay';
import {PhoneFrame} from '../components/Phone';
import {ChatScreen, ChsScreen, Hall, ME, NewsTv, P, PAPA, Peephole, Sofa, Yard, Zombie} from '../components/Zm';
import {C, FONT} from '../theme';
import {mk} from '../timelineZm1';
import {easeOut, ramp} from '../util';
import {ease01, SVG} from './twkit';

const zoom = (f: number, a: number, b: number, s: number, cx: number, cy: number) => {
  const k = ease01(f, a, b);
  return `translate(${540 + (540 - cx) * k * (s - 1)} ${900 + (900 - cy) * k * (s - 1)}) scale(${1 + k * (s - 1)}) translate(-540 -900)`;
};

/** «Карантин», серия 1 «День ноль». */
export const SceneZm1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const WA = m('wake'), SC = m('scream'), AL = m('alert'), TV = m('tv'), CHA = m('chase'), HO = m('home'), SO = m('sonya'), AS = m('ask'), LI = m('lie');
  const WI = m('window'), GA = m('galya'), UP = m('up'), JA = m('janitor'), BI = m('bite'), CU = m('curtain'), WR = m('wardrobe'), FR = m('fridge');
  const MS = m('msg'), PA = m('papa'), EV = m('evening'), HA = m('hall'), ST = m('steps'), STOP = m('stop'), GR = m('grip'), SI = m('silence'), AW = m('away');
  const MI = m('midnight'), KN = m('knock'), VO = m('voice'), PE = m('peep'), BL = m('blood'), RU = m('run'), Q = m('q'), TI = m('title');
  let scene: React.ReactNode = null;
  if (f < AL) {
    const lamp = f < SC ? 0 : 0.15;
    scene = (
      <g transform={zoom(f, SC, SC + 12, 1.08, 540, 900)}>
        <ApartmentBack f={f} lamp={lamp} />
        <Sofa x={420} y={1110} w={620} />
        <P who="mark" x={420} y={1060} size={1.15} facing={1} f={f} look={ME} pose={{sit: 1, blink: f < WA + 20 ? 0 : 1, brow: f > SC ? 1 : 0, look: f > SC ? 0.8 : 0, lean: f > SC ? -6 : 0}} />
        <rect x={-200} y={-200} width={1480} height={2400} fill="#05070c" opacity={f < SC ? 0.55 : 0.3} />
      </g>
    );
  } else if (f < TV) {
    scene = <g><ApartmentBack f={f} lamp={0.2} alert={0.6} /><rect x={-200} y={-200} width={1480} height={2400} fill="#05070c" opacity={0.6} /></g>;
  } else if (f < HO) {
    scene = <g transform={zoom(f, TV, HO, 1.12, 540, 700)}><NewsTv f={f} chase={ramp(f, CHA - 5, CHA + 10)} /></g>;
  } else if (f < WI) {
    const close = f >= AS;
    scene = (
      <g transform={close ? zoom(f, AS, AS + 20, 1.35, 540, 820) : ''}>
        <ApartmentBack f={f} lamp={0.6} alert={0.2} />
        <Sofa x={540} y={1110} w={640} />
        <P who="mark" x={400} y={1060} size={1.15} facing={1} f={f} look={ME} pose={{sit: 1, look: 0.5, brow: 0.6, mouth: f >= LI && f < LI + 30 ? 0.3 : 0}} />
        <P who="sonya" x={680} y={1060} size={1.15} facing={-1} f={f} seed={3} pose={{sit: 1, look: -0.4, lookUp: 0.4, brow: 0.8, mouth: f >= AS && f < AS + 40 ? 0.4 + 0.3 * Math.sin(f / 2) : 0}} />
      </g>
    );
  } else if (f < CU) {
    const lunge = ease01(f, BI, BI + 12);
    scene = (
      <g transform={f < JA ? zoom(f, UP, UP + 40, 1.5, 330, 760) : zoom(f, JA, JA + 20, 1.5, 420, 780)}>
        <Yard f={f} />
        {f >= JA && (
          <P who="lev" x={760 - ease01(f, JA, BI) * 260 + lunge * 20} y={900} size={0.7} facing={-1} f={f} look={{top: '#d07a2a', topShade: '#a85a1a'}} pose={{step: f < BI ? f / 5 : 0, armF: f < BI ? [20, 0] : [70, -60], lean: lunge * -20, brow: lunge}} />
        )}
        <Zombie who="galina" x={330 + lunge * 110} y={900} size={0.7} facing={1} f={f} walk={false}
          pose={{headTilt: f < UP ? 10 : -30 + lunge * 50, lookUp: f < UP || f >= JA ? 0 : 1, lean: 6 + lunge * 30, armF: [40 + lunge * 50, -10]}} />
        {f >= BI && <rect x={-200} y={-200} width={1480} height={2400} fill={C.red} opacity={0.35 * (1 - ramp(f, BI, BI + 25))} />}
      </g>
    );
  } else if (f < MS) {
    scene = <Hall f={f} barricade={ease01(f, WR, WR + 40) + ease01(f, FR, FR + 40)} light={0.8} />;
  } else if (f < EV) {
    scene = <g><rect x={-200} y={-200} width={1480} height={2400} fill="#06080d" /></g>;
  } else if (f < MI) {
    const shadow = f < ST ? -1 : f < STOP ? Math.min(0.5, (f - ST) / (STOP - ST) * 0.5) : f < AW ? 0.5 : 0.5 + (f - AW) / 60;
    const dark = 1 - ramp(f, EV, HA + 10);
    scene = (
      <g transform={f >= GR && f < AW ? zoom(f, GR, GR + 30, 1.25, 540, 1100) : ''}>
        <Hall f={f} barricade={2} light={0.5} gap={0.9} shadow={shadow <= 1 ? shadow : -1} />
        {f >= GR && (
          <g>
            <P who="mark" x={180} y={1180} size={1.05} facing={1} f={f} look={ME} pose={{sit: 1, lean: 10, brow: 1, look: 0.8, blink: 1}} />
            <P who="sonya" x={300} y={1180} size={1.05} facing={1} f={f} seed={3} pose={{sit: 1, lean: 14, brow: 1, look: 0.8, blink: 1, armF: [40, -30]}} />
          </g>
        )}
        <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={dark * 0.9} />
      </g>
    );
  } else if (f < PE) {
    const kshake = [0, 1, 2].some((k) => f >= KN + k * 13 && f < KN + k * 13 + 5) ? 1 : 0;
    scene = <Hall f={f} barricade={2} light={0.3} gap={0.9} shadow={0.45} shake={kshake} />;
  } else if (f < Q) {
    if (f < RU) {
      scene = (
        <g transform={zoom(f, BL, BL + 30, 1.4, 560, 1020)}>
          <Peephole f={f}>
            <g transform="translate(540 1240) scale(1.9) translate(-540 -1240)">
              <P who="evgeny" x={540} y={1240} size={1} facing={-1} f={f} look={PAPA} pose={{lean: 6, brow: 0.9, mouth: f < BL ? 0.2 + 0.2 * Math.sin(f / 3) : 0, armB: [-40, -60], armF: [10, 10]}} />
              {[[500, 1238, 14], [528, 1244, 9], [566, 1236, 11], [470, 1246, 7]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r * 1.6} ry={r * 0.6} fill="#8a1a14" opacity={ramp(f, BL, BL + 20)} />)}
            </g>
          </Peephole>
        </g>
      );
    } else {
      scene = (
        <g>
          <Hall f={f} barricade={2} light={0.35} gap={0.9} shadow={0.45} />
          <P who="sonya" x={200 + ease01(f, RU, RU + 50) * 260} y={1180} size={1.15} facing={1} f={f} seed={3} pose={{step: f / 3, armF: [80, -10], armB: [70, -10], mouth: 0.6, brow: 0.4}} />
        </g>
      );
    }
  }
  const clock = f < AL ? '06:00' : f >= HO && f < CU ? '07:40' : f >= HA && f < AW ? '20:00' : f >= AW && f < MI ? '20:02' : f >= MI && f < Q ? '00:00' : '';
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>{scene}</SVG>
      {f >= AL && f < TV && <PhoneFrame x={540} y={760} scale={0.92} tilt={-2} f={f} glow={C.red} glowK={0.35} shake={f < AL + 20 ? 1 : 0}><ChsScreen f={f} start={AL} /></PhoneFrame>}
      {f >= MS && f < EV && <PhoneFrame x={540} y={760} scale={0.92} tilt={2} f={f} glow={C.tv} glowK={0.2}><ChatScreen f={f} start={MS} papa={PA} /></PhoneFrame>}
      {clock && <Chip x={540} y={150} text={clock} kind="white" t={1} tilt={0} size={44} />}
      {f >= SO && f < AS && <Chip x={700} y={560} text="СОНЕ 8" kind="yellow" t={ramp(f, SO, SO + 10)} tilt={-3} size={40} />}
      {f >= AS && f < WI && <Chip x={540} y={330} text="«ЭТО УЧЕНИЯ?»" kind="white" t={ramp(f, AS + 4, AS + 14)} tilt={2} size={40} />}
      {f >= GA && f < JA && <Chip x={330} y={330} text="ТЁТЯ ГАЛЯ" kind="red" t={ramp(f, GA + 10, GA + 20)} tilt={-2} size={36} />}
      {f >= STOP && f < SI && <Chip x={540} y={330} text="ОН У ВАШЕЙ ДВЕРИ" kind="red" t={ramp(f, STOP, STOP + 10)} tilt={-2} size={40} />}
      {f >= VO && f < PE && <Chip x={540} y={330} text="«СЫНОК, ОТКРОЙ»" kind="white" t={ramp(f, VO + 4, VO + 14)} tilt={2} size={40} />}
      {f >= BL && f < RU && <Chip x={540} y={330} text="РУКАВ В КРОВИ" kind="red" t={ramp(f, BL + 6, BL + 16)} tilt={-2} size={40} />}
      {f >= RU && f < Q && <Chip x={540} y={330} text="«ПАПА!»" kind="yellow" t={ramp(f, RU, RU + 8)} tilt={-3} size={52} />}
      {f >= TI && <AbsoluteFill style={{background: C.void}}><ZmCard f={f} start={TI} ep={1} teaser="ОТКРЫТЬ ИЛИ НЕТ?" /></AbsoluteFill>}
    </AbsoluteFill>
  );
};

/** Титр сериала «Карантин». */
export const ZmCard: React.FC<{f: number; start: number; ep: number; teaser: string; final?: boolean}> = ({f, start, ep, teaser, final}) => {
  const a = easeOut(ramp(f - start, 0, 14));
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: a, transform: `scale(${0.96 + 0.04 * a})`}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 112, color: C.red, letterSpacing: 4}}>КАРАНТИН</div>
      <div style={{marginTop: 26, padding: '8px 22px', borderRadius: 22, background: C.white, color: '#14171d', fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 3}}>{final ? 'КОНЕЦ' : `СЕРИЯ ${ep} ИЗ 3`}</div>
      <div style={{marginTop: 40, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: final ? C.grey : C.white, letterSpacing: 2, opacity: ramp(f - start, 16, 28)}}>{teaser}</div>
    </div>
  );
};
