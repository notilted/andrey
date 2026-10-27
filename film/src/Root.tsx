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
import {Tw4} from './Tw4';
import {DURATION as DURATION_TW4} from './timelineTw4';
import {Tw5} from './Tw5';
import {DURATION as DURATION_TW5} from './timelineTw5';
import {Dm1} from './Dm1';
import {DURATION as DURATION_DM1} from './timelineDm1';
import {Dm2} from './Dm2';
import {DURATION as DURATION_DM2} from './timelineDm2';
import {Dm3} from './Dm3';
import {DURATION as DURATION_DM3} from './timelineDm3';
import {FPS, H, W} from './theme';
import {DURATION} from './timeline';

export const Root: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
    <Composition id="Ep2" component={Ep2} durationInFrames={DURATION2} fps={FPS} width={W} height={H} />
    <Composition id="Tw1" component={Tw1} durationInFrames={DURATION_TW1} fps={FPS} width={W} height={H} />
    <Composition id="Tw2" component={Tw2} durationInFrames={DURATION_TW2} fps={FPS} width={W} height={H} />
    <Composition id="Tw3" component={Tw3} durationInFrames={DURATION_TW3} fps={FPS} width={W} height={H} />
    <Composition id="Tw4" component={Tw4} durationInFrames={DURATION_TW4} fps={FPS} width={W} height={H} />
    <Composition id="Tw5" component={Tw5} durationInFrames={DURATION_TW5} fps={FPS} width={W} height={H} />
    <Composition id="Dm1" component={Dm1} durationInFrames={DURATION_DM1} fps={FPS} width={W} height={H} />
    <Composition id="Dm2" component={Dm2} durationInFrames={DURATION_DM2} fps={FPS} width={W} height={H} />
    <Composition id="Dm3" component={Dm3} durationInFrames={DURATION_DM3} fps={FPS} width={W} height={H} />
    <Composition id="Sample" component={Film} durationInFrames={465} fps={FPS} width={W} height={H} />
    <Still id="FaceTest" component={FaceTest} width={W} height={H} />
    <Still id="CharacterSheet" component={CharacterSheet} width={W} height={H} />
  </>
);
