import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, Grain, NarrationCaption} from './components/Overlay';
import {SceneZm1} from './scenes/SceneZm1';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineZm1';

/** «Карантин», серия 1. */
export const Zm1: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneZm1 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Grain f={f} strength={0.09} />
      <Audio src={staticFile('mix/zm1.wav')} />
    </AbsoluteFill>
  );
};
