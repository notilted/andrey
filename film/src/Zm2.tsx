import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, NarrationCaption, Vignette} from './components/Overlay';
import {SceneZm2} from './scenes/SceneZm2';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineZm2';

/** «Карантин», серия 2. */
export const Zm2: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneZm2 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Vignette />
      <Audio src={staticFile('mix/zm2.wav')} />
    </AbsoluteFill>
  );
};
