import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, NarrationCaption, Vignette} from './components/Overlay';
import {SceneNy1} from './scenes/SceneNy1';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineNy1';

/** «11 дней каникул». */
export const Ny1: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('sub');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneNy1 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Vignette />
      <Audio src={staticFile('mix/ny1.wav')} />
    </AbsoluteFill>
  );
};
