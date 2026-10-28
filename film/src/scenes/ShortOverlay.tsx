import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT} from '../theme';

/** Плашки для коротких нарезок: зацеп сверху (kind=hook) или финальная карточка (kind=end). */
export const ShortOverlay: React.FC<{text: string; kind: 'hook' | 'end'; series?: string}> = ({text, kind, series}) =>
  kind === 'hook' ? (
    <AbsoluteFill style={{background: 'transparent'}}>
      <div style={{position: 'absolute', left: 50, right: 50, top: 150, padding: '26px 30px', borderRadius: 28, background: 'rgba(6,8,13,0.86)', textAlign: 'center',
        fontFamily: FONT, fontWeight: 900, fontSize: 66, lineHeight: 1.08, color: C.white, textTransform: 'uppercase', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>
        {text.split('*').map((p, i) => <span key={i} style={{color: i % 2 ? C.warm : C.white}}>{p}</span>)}
      </div>
    </AbsoluteFill>
  ) : (
    <AbsoluteFill style={{background: C.void, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: C.white}}>
      <div style={{fontWeight: 900, fontSize: 92, letterSpacing: 1, textAlign: 'center', lineHeight: 1.05}}>{series}</div>
      <div style={{marginTop: 50, padding: '18px 36px', borderRadius: 30, background: C.warm, color: '#14171d', fontWeight: 900, fontSize: 46}}>{text}</div>
      <div style={{marginTop: 30, fontWeight: 800, fontSize: 40, color: C.grey}}>👆 в профиле</div>
    </AbsoluteFill>
  );
