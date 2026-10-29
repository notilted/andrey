import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PixelFilter} from '../components/Px';
import {FONT} from '../theme';
import {SceneCr1} from './SceneCr1';

/** Пробы стилей: один кадр «Из низов» в разной обработке (кадр композиции = номер стиля). */
const STYLES = ['ПЛОСКИЙ (СЕЙЧАС)', 'ПИКСЕЛЬ', 'КОМИКС', 'НУАР', 'НЕОН', 'АКВАРЕЛЬ', 'СКЕТЧ'];
const SRC = 560;

const Defs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <PixelFilter id="st-px" size={8} levels={8} />
      <filter id="st-comic" colorInterpolationFilters="sRGB">
        <feComponentTransfer in="SourceGraphic" result="post">
          <feFuncR type="discrete" tableValues="0 0.35 0.7 1" /><feFuncG type="discrete" tableValues="0 0.35 0.7 1" /><feFuncB type="discrete" tableValues="0 0.35 0.7 1" />
        </feComponentTransfer>
        <feConvolveMatrix in="SourceGraphic" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" result="edge" />
        <feColorMatrix in="edge" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  4 4 4 0 0" result="ea" />
        <feMorphology in="ea" operator="dilate" radius="1.6" result="ed" />
        <feFlood floodColor="#0b0b0e" result="ink" />
        <feComposite in="ink" in2="ed" operator="in" result="lines" />
        <feMerge><feMergeNode in="post" /><feMergeNode in="lines" /></feMerge>
      </filter>
      <filter id="st-water" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="4" result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale="34" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feGaussianBlur in="d" stdDeviation="1.6" result="b" />
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" result="paper" />
        <feColorMatrix in="paper" type="matrix" values="0 0 0 0 0.94  0 0 0 0 0.91  0 0 0 0 0.84  0 0 0 0.55 0" result="pap" />
        <feBlend in="b" in2="pap" mode="multiply" />
      </filter>
      <filter id="st-sketch" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="saturate" values="0.25" result="pale" />
        <feComponentTransfer in="pale" result="wash"><feFuncR type="linear" slope="0.35" intercept="0.62" /><feFuncG type="linear" slope="0.35" intercept="0.6" /><feFuncB type="linear" slope="0.35" intercept="0.55" /></feComponentTransfer>
        <feConvolveMatrix in="SourceGraphic" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" result="edge" />
        <feColorMatrix in="edge" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 3 3 0 0" result="ea" />
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="2" result="jit" />
        <feDisplacementMap in="ea" in2="jit" scale="5" xChannelSelector="R" yChannelSelector="G" result="ej" />
        <feFlood floodColor="#2a2622" result="ink" />
        <feComposite in="ink" in2="ej" operator="in" result="lines" />
        <feMerge><feMergeNode in="wash" /><feMergeNode in="lines" /></feMerge>
      </filter>
    </defs>
  </svg>
);

export const StyleTest: React.FC = () => {
  const i = useCurrentFrame() % STYLES.length;
  const filter = ['none', 'url(#st-px)', 'url(#st-comic)', 'grayscale(1) contrast(1.55) brightness(0.9)', 'saturate(1.7) contrast(1.15) brightness(0.85)', 'url(#st-water)', 'url(#st-sketch)'][i];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Defs />
      <AbsoluteFill style={{filter}}><SceneCr1 f={SRC} /></AbsoluteFill>
      {i === 3 && <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)'}} />}
      {i === 4 && <AbsoluteFill style={{background: 'linear-gradient(180deg,#ff2a9a,#2a5aff)', mixBlendMode: 'color', opacity: 0.6}} />}
      {i === 4 && <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(255,42,154,0.0),rgba(20,0,60,0.55))'}} />}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center'}}>
        <span style={{padding: '18px 36px', borderRadius: 30, background: '#f2f2ee', color: '#14171d', fontFamily: FONT, fontWeight: 900, fontSize: 64}}>{i + 1}. {STYLES[i]}</span>
      </div>
    </AbsoluteFill>
  );
};
