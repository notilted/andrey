import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, NarrationCaption, Vignette} from './components/Overlay';
import {SceneCr6} from './scenes/SceneCr6';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineCr6';

/** «Из низов», серия 6. */
export const Cr6: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('choice');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneCr6 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Vignette />
      <Audio src={staticFile('mix/cr6.wav')} />
    </AbsoluteFill>
  );
};
