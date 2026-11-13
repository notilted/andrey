import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, NarrationCaption, Vignette} from './components/Overlay';
import {SceneBn3} from './scenes/SceneBn3';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineBn3';

/** «Бабушкины 2 млн», сезон 2, финал. */
export const Bn3: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('end');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneBn3 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Vignette />
      <Audio src={staticFile('mix/bn3.wav')} />
    </AbsoluteFill>
  );
};
