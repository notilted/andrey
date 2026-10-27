import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, Grain, NarrationCaption, StatusBar} from './components/Overlay';
import {fmtH} from './components/Tw';
import {SceneTw2, timerTw2} from './scenes/SceneTw2';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineTw2';
import {ramp} from './util';

/** «Три волны». Серия 2 — «12 часов». */
export const Tw2: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  const showBar = f >= mk('map') && f < mk('hit2');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneTw2 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      {showBar && <StatusBar time={fmtH(timerTw2(f))} label="ВОЛНА 2" opacity={ramp(f, mk('map'), mk('map') + 10)} />}
      <Grain f={f} />
      <Audio src={staticFile('mix/tw2.wav')} />
    </AbsoluteFill>
  );
};
