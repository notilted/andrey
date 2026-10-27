import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, Grain, NarrationCaption} from './components/Overlay';
import {SceneTw5} from './scenes/SceneTw5';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineTw5';

/** «Три волны». Сезон 2, серия 5 — «Звонок» (финал). */
export const Tw5: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneTw5 f={f} />
      {f < TITLE && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Grain f={f} />
      <Audio src={staticFile('mix/tw5.wav')} />
    </AbsoluteFill>
  );
};
