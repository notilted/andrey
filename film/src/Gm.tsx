import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Vignette} from './components/Overlay';
import {SceneGm} from './scenes/SceneGm';

/** Шпаргалка «Четырёхугольники», 8 класс. */
export const Gm: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SceneGm f={f} />
      <Vignette />
      <Audio src={staticFile('mix/gm.wav')} />
    </AbsoluteFill>
  );
};
