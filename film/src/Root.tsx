import React from 'react';
import {Composition, Still} from 'remotion';
import './fonts';
import {CharacterSheet} from './scenes/CharacterSheet';
import {FaceTest} from './scenes/FaceTest';
import {Sample} from './Sample';
import {FPS, H, W} from './theme';
import sample from './data/sample.json';

export const Root: React.FC = () => (
  <>
    <Composition id="Sample" component={Sample} durationInFrames={Math.round(sample.duration * FPS)} fps={FPS} width={W} height={H} />
    <Still id="FaceTest" component={FaceTest} width={W} height={H} />
    <Still id="CharacterSheet" component={CharacterSheet} width={W} height={H} />
  </>
);
