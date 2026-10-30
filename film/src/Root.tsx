import React from 'react';
import {Composition, Still} from 'remotion';
import './fonts';
import {CharacterSheet} from './scenes/CharacterSheet';
import {ShortOverlay} from './scenes/ShortOverlay';
import {PxTest} from './scenes/PxTest';
import {StyleTest} from './scenes/StyleTest';
import {ToonTest} from './scenes/ToonTest';
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
import {Bm1} from './Bm1';
import {El} from './El';
import {Cr1} from './Cr1';
import {Cr2} from './Cr2';
import {Cr3} from './Cr3';
import {Cr4} from './Cr4';
import {Bn} from './Bn';
import {DURATION as DURATION_BN} from './timelineBn';
import {DURATION as DURATION_CR4} from './timelineCr4';
import {DURATION as DURATION_CR3} from './timelineCr3';
import {DURATION as DURATION_CR2} from './timelineCr2';
import {DURATION as DURATION_CR1} from './timelineCr1';
import {Zm1} from './Zm1';
import {Zm2} from './Zm2';
import {Zm3} from './Zm3';
import {DURATION as DURATION_ZM3} from './timelineZm3';
import {DURATION as DURATION_ZM2} from './timelineZm2';
import {DURATION as DURATION_ZM1} from './timelineZm1';
import {DURATION as DURATION_EL} from './timelineEl';
import {DURATION as DURATION_BM1} from './timelineBm1';
import {Bm2} from './Bm2';
import {DURATION as DURATION_BM2} from './timelineBm2';
import {Bm3} from './Bm3';
import {DURATION as DURATION_BM3} from './timelineBm3';
import {Jb} from './Jb';
import {DURATION as DURATION_JB} from './timelineJb';
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
    <Composition id="Zm3" component={Zm3} durationInFrames={DURATION_ZM3} fps={FPS} width={W} height={H} />
    <Composition id="Zm2" component={Zm2} durationInFrames={DURATION_ZM2} fps={FPS} width={W} height={H} />
    <Composition id="Zm1" component={Zm1} durationInFrames={DURATION_ZM1} fps={FPS} width={W} height={H} />
    <Composition id="Bn" component={Bn} durationInFrames={DURATION_BN} fps={FPS} width={W} height={H} />
    <Composition id="Cr4" component={Cr4} durationInFrames={DURATION_CR4} fps={FPS} width={W} height={H} />
    <Composition id="Cr3" component={Cr3} durationInFrames={DURATION_CR3} fps={FPS} width={W} height={H} />
    <Composition id="Cr2" component={Cr2} durationInFrames={DURATION_CR2} fps={FPS} width={W} height={H} />
    <Composition id="Cr1" component={Cr1} durationInFrames={DURATION_CR1} fps={FPS} width={W} height={H} />
    <Composition id="El" component={El} durationInFrames={DURATION_EL} fps={FPS} width={W} height={H} />
    <Composition id="Bm1" component={Bm1} durationInFrames={DURATION_BM1} fps={FPS} width={W} height={H} />
    <Composition id="Bm2" component={Bm2} durationInFrames={DURATION_BM2} fps={FPS} width={W} height={H} />
    <Composition id="Bm3" component={Bm3} durationInFrames={DURATION_BM3} fps={FPS} width={W} height={H} />
    <Composition id="ToonTest" component={ToonTest} durationInFrames={3} fps={FPS} width={W} height={H} />
    <Composition id="StyleTest" component={StyleTest} durationInFrames={7} fps={FPS} width={W} height={H} />
    <Composition id="PxTest" component={PxTest} durationInFrames={90} fps={FPS} width={W} height={H} />
    <Composition id="Jb" component={Jb} durationInFrames={DURATION_JB} fps={FPS} width={W} height={H} />
    <Composition id="Sample" component={Film} durationInFrames={465} fps={FPS} width={W} height={H} />
    <Still id="ShortOverlay" component={ShortOverlay} width={W} height={H} defaultProps={{text: '', kind: 'hook' as const, series: ''}} />
    <Still id="FaceTest" component={FaceTest} width={W} height={H} />
    <Still id="CharacterSheet" component={CharacterSheet} width={W} height={H} />
  </>
);
