import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, NarrationCaption, Vignette} from './components/Overlay';
import {SceneLp1} from './scenes/SceneLp1';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineLp1';

/** «Потерял телефон». */
export const Lp1: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('sub');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneLp1 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Vignette />
      <Audio src={staticFile('mix/lp1.wav')} />
    </AbsoluteFill>
  );
};
