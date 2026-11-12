import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, NarrationCaption, Vignette} from './components/Overlay';
import {SceneBn2} from './scenes/SceneBn2';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineBn2';

/** «Бабушкины 2 млн», сезон 2, часть 2. */
export const Bn2: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('next');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneBn2 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Vignette />
      <Audio src={staticFile('mix/bn2.wav')} />
    </AbsoluteFill>
  );
};
