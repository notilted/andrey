import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, NarrationCaption, Vignette} from './components/Overlay';
import {SceneSl1} from './scenes/SceneSl1';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineSl1';

/** «5 приёмов распродаж». */
export const Sl1: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('sub');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneSl1 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Vignette />
      <Audio src={staticFile('mix/sl1.wav')} />
    </AbsoluteFill>
  );
};
