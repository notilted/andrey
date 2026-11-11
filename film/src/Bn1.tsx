import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, NarrationCaption, Vignette} from './components/Overlay';
import {SceneBn1} from './scenes/SceneBn1';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineBn1';

/** «Бабушкины 2 млн», сезон 2, часть 1. */
export const Bn1: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('next');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneBn1 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Vignette />
      <Audio src={staticFile('mix/bn1.wav')} />
    </AbsoluteFill>
  );
};
