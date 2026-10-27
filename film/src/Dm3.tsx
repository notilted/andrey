import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, Grain, NarrationCaption} from './components/Overlay';
import {SceneDm3} from './scenes/SceneDm3';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineDm3';

/** «Девять минут». Серия 3 — «Палыч» (финал). */
export const Dm3: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneDm3 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Grain f={f} />
      <Audio src={staticFile('mix/dm3.wav')} />
    </AbsoluteFill>
  );
};
