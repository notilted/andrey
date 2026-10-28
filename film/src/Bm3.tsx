import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {MoneyCounter} from './components/Bm';
import {BottomFade, Grain, NarrationCaption} from './components/Overlay';
import {moneyBm3, SceneBm3} from './scenes/SceneBm3';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineBm3';
import {ramp} from './util';

/** «Бабушкины 2 миллиона». Серия 3 — «Тетрадь» (финал). */
export const Bm3: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  const v = moneyBm3(f);
  const show = f < TITLE;
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneBm3 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      {show && <MoneyCounter value={v} trend={v > moneyBm3(f - 20) ? 1 : 0} opacity={ramp(f, 4, 14)} />}
      <Grain f={f} />
      <Audio src={staticFile('mix/bm3.wav')} />
    </AbsoluteFill>
  );
};
