import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, Grain, Subtitle} from './components/Overlay';
import {Recap} from './scenes/Recap';
import {SceneEp2} from './scenes/SceneEp2';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timeline2';

/** «17 МИНУТ. Часть 2 — Этап второй». */
export const Ep2: React.FC = () => {
  const f = useCurrentFrame();
  const R = mk('recap_end');
  const BLACK = mk('c6_black');
  return (
    <AbsoluteFill style={{background: C.void}}>
      {f < R ? <Recap f={f} /> : <SceneEp2 f={f} />}
      {f >= mk('c1_light') && f < BLACK && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <Subtitle key={d.id} text={l.caption} who={l.name} f={f} start={l.start} dur={l.dur} />;
      })}
      <Grain f={f} />
      <Audio src={staticFile('mix/ep2.wav')} />
    </AbsoluteFill>
  );
};
