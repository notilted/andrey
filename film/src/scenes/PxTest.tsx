import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Cell, Pixel, PxCaption, TradingFloor, YachtNight} from '../components/Px';

/** Пробные кадры пиксельного стиля: 0–29 торговый зал, 30–59 яхта, 60–89 тюрьма. */
export const PxTest: React.FC = () => {
  const f = useCurrentFrame();
  const k = Math.floor(f / 30);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Pixel size={7} levels={10}>
        <g transform={k === 0 ? 'translate(540 860) scale(1.15) translate(-540 -1000)' : k === 1 ? 'translate(540 860) scale(1.1) translate(-540 900)' : 'translate(540 860) scale(1.0) translate(-540 -960)'}>
          {k === 0 && <TradingFloor f={f} roar={1} />}
          {k === 1 && <g transform="translate(0 -1900)"><YachtNight f={f} /></g>}
          {k === 2 && <Cell f={f} />}
        </g>
      </Pixel>
      <PxCaption text={['49 миллионов в год', 'Яхта «Надин»', '22 месяца'][k]} />
    </AbsoluteFill>
  );
};
