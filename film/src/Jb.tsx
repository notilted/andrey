import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {usd} from './components/Jb';
import {BottomFade, Grain, NarrationCaption} from './components/Overlay';
import {moneyJb, SceneJb} from './scenes/SceneJb';
import {C, FONT, MONO} from './theme';
import {DIALOGUE, line, mk} from './timelineJb';

/** «Ты — Джордан Белфорт». Пиксельный стиль. */
export const Jb: React.FC = () => {
  const f = useCurrentFrame();
  const TITLE = mk('title');
  const v = moneyJb(f);
  const trend = v - moneyJb(f - 15);
  return (
    <AbsoluteFill style={{background: C.void}}>
      <SceneJb f={f} />
      {f < TITLE && <BottomFade from={1180} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <NarrationCaption key={d.id} text={l.caption} f={f} start={l.start} dur={l.dur} y={1290} />;
      })}
      {f < TITLE && (
        <div style={{position: 'absolute', right: 36, top: 60, padding: '12px 20px', background: 'rgba(5,7,12,0.75)', border: '4px solid #e8b830', fontFamily: MONO, fontWeight: 800, fontSize: 38,
          color: v < 0 ? '#ff5a4a' : trend > 0 ? '#5ad08a' : '#ffe27a', boxShadow: '6px 6px 0 #000'}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 18, color: '#c9c3b2', letterSpacing: 2}}>{v < 0 ? 'ДОЛГ ПОСТРАДАВШИМ' : 'ЗАРАБОТАНО'}</div>
          {usd(v)}
        </div>
      )}
      <Grain f={f} strength={0.04} />
      <Audio src={staticFile('mix/jb.wav')} />
    </AbsoluteFill>
  );
};
