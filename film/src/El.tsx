import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, Grain, NarrationCaption} from './components/Overlay';
import {SceneEl} from './scenes/SceneEl';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineEl';

/** «Последняя электричка» — страшная история. */
export const El: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneEl f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Grain f={f} strength={0.1} />
      <Audio src={staticFile('mix/el.wav')} />
    </AbsoluteFill>
  );
};
