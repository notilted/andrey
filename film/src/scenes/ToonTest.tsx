import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Glow, Shake, Toon, ToonLook} from '../components/Toon';
import {FONT} from '../theme';
import {SVG} from './twkit';

/** Проба тун-стиля для «Из низов»: 0 — площадь, 1 — страх у двери, 2 — дон крупно. */
const KID: ToonLook = {skin: '#f4cfae', skinD: '#e6b894', hair: '#3a2418', top: '#ffa82a', topD: '#ff8a1a', legs: '#3a3a8a', legsD: '#2e2e74', shoes: '#1a1424', band: '#7a8a3a'};
const DON: ToonLook = {skin: '#f0c8a8', skinD: '#dcb090', hair: '#e8e4da', top: '#f6f4ee', topD: '#dcd8ce', legs: '#f0eee6', legsD: '#d8d4ca', shoes: '#4a2a1a', mustache: true, bald: true, hat: '#f2f0e8', tie: '#c83030', scale: 1.08};
const GUARD: ToonLook = {skin: '#d8a888', skinD: '#c09070', hair: '#14110e', top: '#2a2a3a', topD: '#1e1e2c', legs: '#22222e', legsD: '#1a1a24', shoes: '#0a0a10'};

const Houses: React.FC = () => (
  <g>
    {['#e86a5a', '#f2b44a', '#4aa8a0', '#e88aa0', '#8a7ad8', '#f2d06a'].map((c, i) => {
      const x = -120 + i * 220, h = 420 + (i % 3) * 80;
      return (
        <g key={i}>
          <rect x={x} y={1040 - h} width={210} height={h} fill={c} />
          <rect x={x + 105} y={1040 - h} width={105} height={h} fill="#000" opacity={0.12} />
          {[0, 1, 2].map((r) => <rect key={r} x={x + 40} y={1040 - h + 50 + r * 120} width={130} height={70} rx={35} fill="#2a1a3a" opacity={0.8} />)}
        </g>
      );
    })}
  </g>
);

export const ToonTest: React.FC = () => {
  const i = useCurrentFrame() % 3;
  const f = 40;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>
        {i === 0 && (
          <g>
            <Glow f={f} c1="#ff9a5a" c2="#6a2a5a" cy={500} id="g0" />
            <Houses />
            <rect x={-200} y={1040} width={1480} height={1000} fill="#c8805a" />
            <rect x={-200} y={1040} width={1480} height={1000} fill="#000" opacity={0.1} />
            <g transform="translate(560 1330)"><rect x={-80} y={-110} width={160} height={110} rx={14} fill="#8a4a2a" /><rect x={-80} y={-110} width={80} height={110} rx={14} fill="#a85a32" /></g>
            <Toon id="kid" x={380} y={1330} s={0.95} f={f} look={KID} pose={{sit: 1, armR: [70, 30], armL: [40, 40], eyes: 'wide', look: 0.8, mouth: 'fear', sweat: true}} />
            <Toon id="don" x={760} y={1330} s={0.95} facing={-1} f={f} look={DON} pose={{sit: 1, eyes: 'half', mouth: 'smirk', armL: [30, 50], armR: [20, 10]}} />
            <Toon id="gd" x={1000} y={1300} s={0.92} facing={-1} f={f} look={GUARD} pose={{eyes: 'half', mouth: 'line', brow: -1, armL: [8, 30], armR: [8, 30]}} />
          </g>
        )}
        {i === 1 && (
          <g>
            <Glow f={f} c1="#c8404a" c2="#1a0a1a" cy={720} id="g1" />
            <rect x={330} y={460} width={420} height={1000} fill="#2a1a3a" />
            <rect x={354} y={484} width={372} height={976} fill="#8a4a32" />
            <rect x={540} y={484} width={186} height={976} fill="#000" opacity={0.12} />
            <rect x={384} y={520} width={312} height={420} rx={10} fill="none" stroke="#6a3a26" strokeWidth={8} />
            <rect x={384} y={1000} width={312} height={420} rx={10} fill="none" stroke="#6a3a26" strokeWidth={8} />
            <Shake x={540} y={760} f={f} />
            <Toon id="kid2" x={540} y={1460} s={1.35} f={f} look={KID} pose={{armL: [130, -60], armR: [130, -60], eyes: 'wide', mouth: 'fear', sweat: true, shake: true, brow: 1}} />
          </g>
        )}
        {i === 2 && (
          <g>
            <Glow f={f} c1="#f2e8c8" c2="#4a2a6a" cy={760} id="g2" />
            <Toon id="don2" x={540} y={2200} s={2.6} f={f} look={DON} pose={{eyes: 'half', mouth: 'smirk', look: -0.4, armL: [10, 0], armR: [10, 0]}} />
          </g>
        )}
      </SVG>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1500, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 76, color: '#fff', textShadow: '0 4px 0 #000'}}>
        {[<><span style={{color: '#ffd23a'}}>СУКА,</span> ОН СЕЛ</>, <><span style={{color: '#ffd23a'}}>ОНО</span> УЖЕ ЗА ДВЕРЬЮ</>, <>ДОН <span style={{color: '#ffd23a'}}>ОКТАВИО</span></>][i]}
      </div>
    </AbsoluteFill>
  );
};
