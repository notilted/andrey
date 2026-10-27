import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, Grain, NarrationCaption, StatusBar} from './components/Overlay';
import {fmtH} from './components/Tw';
import {SceneTw3, timerTw3} from './scenes/SceneTw3';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineTw3';
import {ramp} from './util';

/** «Три волны». Серия 3 — «2 дня». */
export const Tw3: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  const showBar = f >= mk('repair') && f < mk('impact3') + 24;
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneTw3 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      {showBar && <StatusBar time={fmtH(timerTw3(f))} label="ВОЛНА 3" opacity={ramp(f, mk('repair'), mk('repair') + 10)} />}
      <Grain f={f} />
      <Audio src={staticFile('mix/tw3.wav')} />
    </AbsoluteFill>
  );
};
