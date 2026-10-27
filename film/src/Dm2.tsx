import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {fmtMS} from './components/Dm';
import {BottomFade, Grain, NarrationCaption, StatusBar} from './components/Overlay';
import {SceneDm2, timerDm2} from './scenes/SceneDm2';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineDm2';
import {ramp} from './util';

/** «Девять минут». Серия 2 — «Вторая волна». */
export const Dm2: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  const showBar = f >= mk('forty') && f < mk('title');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneDm2 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      {showBar && <StatusBar time={fmtMS(timerDm2(f))} label="ДО ВТОРОЙ ВОЛНЫ" opacity={ramp(f, mk('forty'), mk('forty') + 10)} />}
      <Grain f={f} />
      <Audio src={staticFile('mix/dm2.wav')} />
    </AbsoluteFill>
  );
};
