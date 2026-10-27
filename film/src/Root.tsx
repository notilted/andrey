import React from 'react';
import {Composition, Still} from 'remotion';
import './fonts';
import {CharacterSheet} from './scenes/CharacterSheet';
import {FaceTest} from './scenes/FaceTest';
import {Film} from './Film';
import {Ep2} from './Ep2';
import {DURATION as DURATION2} from './timeline2';
import {Tw1} from './Tw1';
import {DURATION as DURATION_TW1} from './timelineTw1';
import {Tw2} from './Tw2';
import {DURATION as DURATION_TW2} from './timelineTw2';
import {Tw3} from './Tw3';
import {DURATION as DURATION_TW3} from './timelineTw3';
import {FPS, H, W} from './theme';
import {DURATION} from './timeline';

export const Root: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
    <Composition id="Ep2" component={Ep2} durationInFrames={DURATION2} fps={FPS} width={W} height={H} />
    <Composition id="Tw1" component={Tw1} durationInFrames={DURATION_TW1} fps={FPS} width={W} height={H} />
    <Composition id="Tw2" component={Tw2} durationInFrames={DURATION_TW2} fps={FPS} width={W} height={H} />
    <Composition id="Tw3" component={Tw3} durationInFrames={DURATION_TW3} fps={FPS} width={W} height={H} />
    <Composition id="Sample" component={Film} durationInFrames={465} fps={FPS} width={W} height={H} />
    <Still id="FaceTest" component={FaceTest} width={W} height={H} />
    <Still id="CharacterSheet" component={CharacterSheet} width={W} height={H} />
  </>
);
