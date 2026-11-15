import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, NarrationCaption, Vignette} from './components/Overlay';
import {SceneCf2} from './scenes/SceneCf2';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineCf2';

/** «Чужой телефон», часть 2. */
export const Cf2: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('next');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneCf2 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Vignette />
      <Audio src={staticFile('mix/cf2.wav')} />
    </AbsoluteFill>
  );
};
