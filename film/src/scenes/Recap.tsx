import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chip} from '../components/Overlay';
import {line as line1, mk as mk1} from '../timeline';
import {ramp} from '../util';
import {Scene1} from './Scene1';
import {SceneShelter} from './SceneShelter';

/** «Ранее в 17 минутах»: настоящие кадры прошлой серии, по 1,8 с на кадр. */
export const Recap: React.FC<{f: number; total: number}> = ({f, total}) => {
  const shots = [
    {at: mk1('alert') + 32, text: 'Ракетная угроза. *17 минут* до удара', s1: true},
    {at: mk1('s6_double_1') + 30, text: 'За дверью — *двойник Марка*'},
    {at: mk1('s7') + 100, text: '*2 847 193* копии'},
    {at: line1('s7_alisa_1').start + 40, text: '«Какой из вас *настоящий*?»'},
  ];
  const len = Math.max(30, Math.floor(total / shots.length));
  const i = Math.min(shots.length - 1, Math.floor(f / len));
  const local = f - i * len;
  const sh = shots[i];
  const frame = sh.at + Math.floor(local / 2); // замедленно
  const z = 1 + (local / len) * 0.05;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, filter: 'saturate(0.55) contrast(1.05) brightness(0.85)'}}>
        {sh.s1 ? <Scene1 f={frame} /> : <SceneShelter f={frame} />}
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: Math.max(0, 1 - local / 5) * 0.35, mixBlendMode: 'overlay'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1150, bottom: 0, background: 'linear-gradient(to bottom, rgba(6,8,13,0), #06080d 30%)'}} />
      <Chip x={540} y={150} text="РАНЕЕ В «17 МИНУТАХ»" kind="white" t={ramp(f, 0, 10)} tilt={-2} size={28} />
    </AbsoluteFill>
  );
};
