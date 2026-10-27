import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, fmt, Grain, NarrationCaption, StatusBar} from './components/Overlay';
import {SceneTw1, timerTw1} from './scenes/SceneTw1';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineTw1';
import {ramp} from './util';

/** «Три волны». Серия 1 — «2 минуты». */
export const Tw1: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  const showBar = f >= mk('h_two') && f < mk('flash');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneTw1 f={f} />
      {f >= mk('ext') && f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={f < mk('ext') ? 1500 : 1290} />;
      })}
      {showBar && <StatusBar time={fmt(timerTw1(f))} label="ДО УДАРА" opacity={ramp(f, mk('h_two'), mk('h_two') + 10)} />}
      <Grain f={f} />
      <Audio src={staticFile('mix/tw1.wav')} />
    </AbsoluteFill>
  );
};
