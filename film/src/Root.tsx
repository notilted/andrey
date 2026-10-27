import React from 'react';
import {Composition, Still} from 'remotion';
import './fonts';
import {CharacterSheet} from './scenes/CharacterSheet';
import {FaceTest} from './scenes/FaceTest';
import {Film} from './Film';
import {FPS, H, W} from './theme';
import {DURATION} from './timeline';

export const Root: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
    <Composition id="Sample" component={Film} durationInFrames={465} fps={FPS} width={W} height={H} />
    <Still id="FaceTest" component={FaceTest} width={W} height={H} />
    <Still id="CharacterSheet" component={CharacterSheet} width={W} height={H} />
  </>
);
