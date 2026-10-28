import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {MoneyCounter} from './components/Bm';
import {BottomFade, Grain, NarrationCaption} from './components/Overlay';
import {moneyBm1, SceneBm1} from './scenes/SceneBm1';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineBm1';
import {ramp} from './util';

/** «Бабушкины 2 миллиона». Серия 1 — «Наследство». */
export const Bm1: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  const v = moneyBm1(f);
  const show = f >= mk('courier') && f < TITLE;
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneBm1 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      {show && <MoneyCounter value={v} trend={v < moneyBm1(f - 20) ? -1 : 0} opacity={ramp(f, mk('courier'), mk('courier') + 10)} />}
      <Grain f={f} />
      <Audio src={staticFile('mix/bm1.wav')} />
    </AbsoluteFill>
  );
};
