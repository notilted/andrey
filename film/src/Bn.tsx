import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {NarrationCaption} from './components/Overlay';
import {SceneBn} from './scenes/SceneBn';
import {C} from './theme';
import {DIALOGUE, line, mk} from './timelineBn';

/** Новость: взлом Binance. */
export const Bn: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('end');
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneBn f={f} />
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      <Audio src={staticFile('mix/bn.wav')} />
    </AbsoluteFill>
  );
};
