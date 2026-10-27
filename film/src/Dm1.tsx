import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {fmtMS} from './components/Dm';
import {BottomFade, Grain, NarrationCaption, StatusBar} from './components/Overlay';
import {SceneDm1, timerDm1} from './scenes/SceneDm1';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineDm1';
import {ramp} from './util';

/** «Девять минут». Серия 1 — «Море ушло». */
export const Dm1: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  const showBar = f >= mk('recede') && f < mk('hit');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneDm1 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      {showBar && <StatusBar time={fmtMS(timerDm1(f))} label="ДО ВОЛНЫ" opacity={ramp(f, mk('recede'), mk('recede') + 10)} />}
      <Grain f={f} />
      <Audio src={staticFile('mix/dm1.wav')} />
    </AbsoluteFill>
  );
};
