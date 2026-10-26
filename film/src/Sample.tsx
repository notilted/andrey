import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from './components/Overlay';
import {Scene1} from './scenes/Scene1';

/** 15-секундный образец первой сцены — проверка стиля. */
export const Sample: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Scene1 />
      <Grain f={f} />
      <Audio src={staticFile('mix/sample.wav')} />
    </AbsoluteFill>
  );
};
