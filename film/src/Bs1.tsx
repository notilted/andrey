import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, NarrationCaption, Vignette} from './components/Overlay';
import {SceneBs1} from './scenes/SceneBs1';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineBs1';

/** «Без сигнала», часть 1. */
export const Bs1: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('next');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneBs1 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Vignette />
      <Audio src={staticFile('mix/bs1.wav')} />
    </AbsoluteFill>
  );
};
