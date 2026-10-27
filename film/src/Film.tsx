import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BottomFade, fmt, Grain, StatusBar, Subtitle} from './components/Overlay';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {SceneShelter} from './scenes/SceneShelter';
import {C} from './theme';
import {timerMark} from './timers';
import {DIALOGUE, line, mk} from './timeline';
import {ramp} from './util';

/** «17 МИНУТ» — полный фильм. */
export const Film: React.FC = () => {
  const f = useCurrentFrame();
  const S2 = mk('s2');
  const S3 = mk('s3');
  const CUT = mk('s1_cut');
  const ALERT = mk('alert');
  const STAGE = mk('s7_stage');
  const BLACK = mk('s7_black');
  const DARK = mk('s4_dark');
  const S5 = mk('s5');
  const hideBar = (f >= DARK && f < S5 + 20) || f >= BLACK;
  const t = timerMark(f);
  return (
    <AbsoluteFill style={{background: C.void}}>
      {f < CUT && <Scene1 f={f} />}
      {f >= S2 && f < S3 && <Scene2 f={f} />}
      {f >= S3 && <SceneShelter f={f} />}
      {/* нижняя треть под субтитры */}
      {f >= 175 && f < BLACK && !(f >= DARK && f < S5) && <BottomFade from={1150} />}
      {DIALOGUE.map((d) => {
        const l = line(d.id);
        return <Subtitle key={d.id} text={l.caption} who={l.name} f={f} start={l.start} dur={l.dur} />;
      })}
      {!hideBar && (
        <StatusBar
          time={f < ALERT ? '23:41' : f >= STAGE ? '00:00' : fmt(t)}
          label={f < ALERT ? 'МОСКВА' : f >= STAGE ? 'ЭТАП 1' : 'ДО УДАРА'}
          labelColor={f < ALERT ? C.grey : C.red}
          opacity={ramp(f, 10, 24)}
        />
      )}
      <Grain f={f} />
      <Audio src={staticFile('mix/film.wav')} />
    </AbsoluteFill>
  );
};
