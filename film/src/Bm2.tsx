import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {MoneyCounter} from './components/Bm';
import {BottomFade, Grain, NarrationCaption} from './components/Overlay';
import {moneyBm2, SceneBm2} from './scenes/SceneBm2';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineBm2';
import {ramp} from './util';

/** «Бабушкины 2 миллиона». Серия 2 — «Минус». */
export const Bm2: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  const v = moneyBm2(f);
  const show = f < TITLE;
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneBm2 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      {show && <MoneyCounter value={v} trend={v < moneyBm2(f - 20) ? -1 : 0} opacity={ramp(f, 4, 14)} />}
      <Grain f={f} />
      <Audio src={staticFile('mix/bm2.wav')} />
    </AbsoluteFill>
  );
};
