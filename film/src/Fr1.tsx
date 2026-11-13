import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, NarrationCaption, Vignette} from './components/Overlay';
import {SceneFr1} from './scenes/SceneFr1';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineFr1';

/** «Пятница 13». */
export const Fr1: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('sub');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneFr1 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Vignette />
      <Audio src={staticFile('mix/fr1.wav')} />
    </AbsoluteFill>
  );
};
