import React from 'react';
import {AbsoluteFill} from 'remotion';
import slides from '../data/gm_slides.json';
import {C, FONT, MONO} from '../theme';
import {line} from '../timelineGm';
import {easeOut, ramp} from '../util';
import {SVG} from './twkit';

/** Видео-шпаргалка «Четырёхугольники», 8 класс. */

type P = [number, number];
const INK = '#eaf2ff', ACC = '#ffd23a', HL = '#5ad1ff', RED = '#ff5a6a', GRN = '#5ae08a';
const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

const Poly: React.FC<{pts: P[]; t: number; c?: string; w?: number; fill?: string}> = ({pts, t, c = INK, w = 8, fill}) => {
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ') + ' Z';
  return <path d={d} fill={fill ?? 'rgba(90,209,255,0.06)'} stroke={c} strokeWidth={w} strokeLinejoin="round" pathLength={1} strokeDasharray={`${t} 1`} />;
};
const Seg: React.FC<{a: P; b: P; t: number; c?: string; w?: number; dash?: boolean}> = ({a, b, t, c = HL, w = 6, dash}) => (
  <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * t} y2={a[1] + (b[1] - a[1]) * t} stroke={c} strokeWidth={w} strokeDasharray={dash ? '18 14' : undefined} strokeLinecap="round" />
);
const Lbl: React.FC<{p: P; t: string; o?: P; c?: string; s?: number; op?: number}> = ({p, t, o = [0, 0], c = INK, s = 54, op = 1}) => (
  <text x={p[0] + o[0]} y={p[1] + o[1]} fill={c} fontFamily={FONT} fontWeight={900} fontSize={s} textAnchor="middle" dominantBaseline="middle" opacity={op}>{t}</text>
);
const Tick: React.FC<{a: P; b: P; n?: number; c?: string}> = ({a, b, n = 1, c = ACC}) => {
  const [mx, my] = mid(a, b);
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  return <g>{Array.from({length: n}).map((_, i) => { const o = (i - (n - 1) / 2) * 14; const cx = mx + ux * o, cy = my + uy * o; return <line key={i} x1={cx - uy * 20} y1={cy + ux * 20} x2={cx + uy * 20} y2={cy - ux * 20} stroke={c} strokeWidth={6} />; })}</g>;
};
const RightMark: React.FC<{p: P; u: P; v: P; s?: number}> = ({p, u, v, s = 40}) => (
  <path d={`M${p[0] + u[0] * s} ${p[1] + u[1] * s} L${p[0] + (u[0] + v[0]) * s} ${p[1] + (u[1] + v[1]) * s} L${p[0] + v[0] * s} ${p[1] + v[1] * s}`} fill="none" stroke={ACC} strokeWidth={5} />
);
const Arc: React.FC<{p: P; a1: number; a2: number; r?: number; c?: string}> = ({p, a1, a2, r = 60, c = ACC}) => {
  const x1 = p[0] + r * Math.cos(a1), y1 = p[1] + r * Math.sin(a1), x2 = p[0] + r * Math.cos(a2), y2 = p[1] + r * Math.sin(a2);
  return <path d={`M${x1} ${y1} A${r} ${r} 0 0 ${a2 > a1 ? 1 : 0} ${x2} ${y2}`} fill="none" stroke={c} strokeWidth={6} />;
};
const ang = (p: P, q: P) => Math.atan2(q[1] - p[1], q[0] - p[0]);
const Names: React.FC<{pts: P[]; names: string; offs: P[]}> = ({pts, names, offs}) => <g>{pts.map((p, i) => <Lbl key={i} p={p} t={names[i]} o={offs[i]} />)}</g>;

const Fig: React.FC<{fig: string; t: number; k: number; id: string}> = ({fig, t, k, id}) => {
  const s = (a: number) => ramp(k, a, a + 0.12); // поэтапное появление по ходу слайда
  switch (fig) {
    case 'intro': {
      const A: P[] = [[260, 820], [400, 420], [820, 380], [860, 860]];
      return <g transform={`rotate(${Math.sin(k * 6) * 3} 540 620)`}><Poly pts={A} t={t} c={ACC} /><Poly pts={[[380, 760], [480, 520], [700, 520], [600, 760]]} t={t} c={HL} /></g>;
    }
    case 'pause': return <g><rect x={420} y={420} width={80} height={320} rx={16} fill={ACC} opacity={t} /><rect x={580} y={420} width={80} height={320} rx={16} fill={ACC} opacity={t} /></g>;
    case 'quad': {
      const A: P = [200, 850], B: P = [330, 380], Cc: P = [860, 330], D: P = [900, 880];
      const lab = id === 'gm13' ? ['x', '2x', '3x', '4x'] : ['∠A', '∠B', '∠C', '∠D'];
      return <g><Poly pts={[A, B, Cc, D]} t={t} /><Seg a={A} b={Cc} t={s(0.15)} dash />
        <Names pts={[A, B, Cc, D]} names="ABCD" offs={[[-40, 30], [-40, -30], [30, -40], [40, 30]]} />
        {[A, B, Cc, D].map((p, i) => <Lbl key={i} p={p} t={lab[i]} o={[[100, -30], [50, 70], [-70, 60], [-80, -40]][i] as P} c={ACC} s={40} op={s(0.1 + i * 0.05)} />)}</g>;
    }
    case 'para': case 'rect': {
      const R = fig === 'rect';
      const A: P = R ? [170, 850] : [160, 850], B: P = R ? [170, 420] : [360, 400], Cc: P = R ? [910, 420] : [920, 400], D: P = R ? [910, 850] : [720, 850];
      const O = mid(A, Cc);
      return <g><Poly pts={[A, B, Cc, D]} t={t} />
        <Names pts={[A, B, Cc, D]} names="ABCD" offs={[[-40, 30], [-30, -40], [30, -40], [40, 30]]} />
        {!R && <g opacity={s(0.15)}><Tick a={A} b={B} /><Tick a={Cc} b={D} /><Tick a={B} b={Cc} n={2} /><Tick a={D} b={A} n={2} /></g>}
        <Seg a={A} b={Cc} t={s(R ? 0.3 : 0.5)} c={R ? GRN : HL} /><Seg a={B} b={D} t={s(R ? 0.3 : 0.5)} c={R ? GRN : HL} />
        {!R && <Lbl p={O} t="O" o={[0, 60]} op={s(0.5)} s={44} />}
        {R && [A, B, Cc, D].map((p, i) => <RightMark key={i} p={p} u={[[1, 0], [1, 0], [-1, 0], [-1, 0]][i] as P} v={[[0, -1], [0, 1], [0, 1], [0, -1]][i] as P} />)}
        {id === 'gm14' && <g opacity={s(0.2)}><Lbl p={A} t="x" o={[110, -40]} c={ACC} s={44} /><Lbl p={B} t="x+40°" o={[60, 70]} c={ACC} s={40} /></g>}</g>;
    }
    case 'rhomb': case 'square': {
      const Q = fig === 'square';
      const A: P[] = Q ? [[290, 865], [290, 365], [790, 365], [790, 865]] : [[230, 615], [540, 330], [850, 615], [540, 900]];
      const O = mid(A[0], A[2]);
      return <g><Poly pts={A} t={t} />
        <g opacity={s(0.1)}>{A.map((p, i) => <Tick key={i} a={p} b={A[(i + 1) % 4]} />)}</g>
        <Seg a={A[0]} b={A[2]} t={s(0.3)} c={GRN} /><Seg a={A[1]} b={A[3]} t={s(0.3)} c={GRN} />
        <g opacity={s(0.45)}><RightMark p={O} u={Q ? [0.707, 0.707] : [1, 0]} v={Q ? [0.707, -0.707] : [0, -1]} s={36} /></g>
        <Names pts={A} names="ABCD" offs={Q ? [[-40, 30], [-40, -30], [40, -30], [40, 30]] : [[-45, 0], [0, -45], [45, 0], [0, 45]]} /></g>;
    }
    case 'trapTypes': {
      const iso: P[] = [[60, 860], [190, 560], [400, 560], [530, 860]], rt: P[] = [[600, 860], [600, 560], [850, 560], [1020, 860]];
      return <g><Poly pts={[[150, 480], [330, 260], [720, 260], [930, 480]]} t={t} />
        <Lbl p={[540, 230]} t="основание" s={34} c={HL} op={s(0.1)} /><Lbl p={[540, 520]} t="основание" s={34} c={HL} op={s(0.1)} />
        <g opacity={s(0.3)}><Poly pts={iso} t={1} c={ACC} /><Tick a={iso[0]} b={iso[1]} /><Tick a={iso[2]} b={iso[3]} /><Lbl p={[295, 920]} t="равнобедренная" s={34} c={ACC} /></g>
        <g opacity={s(0.5)}><Poly pts={rt} t={1} c={GRN} /><RightMark p={rt[0]} u={[1, 0]} v={[0, -1]} /><RightMark p={rt[1]} u={[1, 0]} v={[0, 1]} /><Lbl p={[810, 920]} t="прямоугольная" s={34} c={GRN} /></g></g>;
    }
    case 'isoTrap': case 'isoH': case 'trapMid': {
      const A: P = [140, 860], B: P = [340, 420], Cc: P = [740, 420], D: P = [940, 860];
      const M = mid(A, B), N = mid(Cc, D);
      return <g><Poly pts={[A, B, Cc, D]} t={t} />
        <Names pts={[A, B, Cc, D]} names="ABCD" offs={[[-40, 30], [-30, -40], [30, -40], [40, 30]]} />
        <g opacity={s(0.1)}><Tick a={A} b={B} /><Tick a={Cc} b={D} /></g>
        {fig === 'isoTrap' && <g opacity={s(0.2)}><Arc p={A} a1={ang(A, B)} a2={0} /><Arc p={D} a1={Math.PI} a2={ang(D, Cc) + 2 * Math.PI} />
          {id === 'gm18' && <g><Lbl p={A} t="50°" o={[110, -40]} c={ACC} s={40} /><Lbl p={D} t="50°" o={[-110, -40]} c={ACC} s={40} /><Lbl p={B} t="130°" o={[10, 70]} c={GRN} s={40} op={s(0.5)} /><Lbl p={Cc} t="130°" o={[-10, 70]} c={GRN} s={40} op={s(0.5)} /></g>}</g>}
        {fig === 'isoTrap' && id === 'gm09' && <g><Seg a={A} b={Cc} t={s(0.4)} c={GRN} /><Seg a={D} b={B} t={s(0.4)} c={GRN} /></g>}
        {fig === 'trapMid' && <g><Seg a={M} b={N} t={s(0.2)} c={ACC} w={8} /><Lbl p={M} t="M" o={[-50, 0]} op={s(0.2)} /><Lbl p={N} t="N" o={[50, 0]} op={s(0.2)} />
          {id === 'gm19' && <g><Lbl p={[540, 380]} t="6" c={HL} op={s(0.1)} /><Lbl p={[540, 910]} t="14" c={HL} op={s(0.1)} /><Lbl p={[540, 600]} t="10" c={ACC} op={s(0.3)} /></g>}</g>}
        {fig === 'isoH' && <g><Seg a={B} b={[340, 860]} t={s(0.15)} c={GRN} dash /><RightMark p={[340, 860]} u={[1, 0]} v={[0, -1]} />
          <Lbl p={[240, 905]} t="3" c={ACC} op={s(0.2)} /><Lbl p={[640, 905]} t="9" c={ACC} op={s(0.2)} /><Lbl p={[340, 860]} t="H" o={[0, 45]} op={s(0.15)} s={40} />
          <Seg a={M} b={N} t={s(0.55)} c={ACC} w={8} dash /></g>}</g>;
    }
    case 'triMid': {
      const A: P = [160, 860], B: P = [480, 360], Cc: P = [920, 860], M = mid(A, B), N = mid(B, Cc);
      return <g><Poly pts={[A, B, Cc]} t={t} /><Names pts={[A, B, Cc]} names="ABC" offs={[[-40, 30], [0, -45], [40, 30]]} />
        <g opacity={s(0.1)}><Tick a={A} b={M} /><Tick a={M} b={B} /><Tick a={B} b={N} n={2} /><Tick a={N} b={Cc} n={2} /></g>
        <Seg a={M} b={N} t={s(0.15)} c={ACC} w={8} /><Lbl p={M} t="M" o={[-50, 0]} op={s(0.15)} /><Lbl p={N} t="N" o={[50, 0]} op={s(0.15)} /></g>;
    }
    case 'bis': {
      const A: P = [120, 850], B: P = [300, 560], K: P = [641, 560], Cc: P = [846, 560], D: P = [666, 850];
      return <g><Poly pts={[A, B, Cc, D]} t={t} /><Names pts={[A, B, Cc, D]} names="ABCD" offs={[[-40, 30], [-30, -40], [30, -40], [40, 30]]} />
        <Seg a={A} b={K} t={s(0.1)} c={ACC} w={7} /><Lbl p={K} t="K" o={[0, -45]} op={s(0.1)} />
        <Lbl p={mid(B, K)} t="5" o={[0, -40]} c={HL} op={s(0.15)} /><Lbl p={mid(K, Cc)} t="3" o={[0, -40]} c={HL} op={s(0.15)} />
        <g opacity={s(0.35)}><Arc p={A} a1={ang(A, B)} a2={ang(A, K)} r={70} /><Arc p={A} a1={ang(A, K)} a2={0} r={85} c={GRN} /><Arc p={K} a1={Math.PI} a2={ang(K, A) + 2 * Math.PI} r={70} c={GRN} /></g>
        <g opacity={s(0.55)}><Tick a={A} b={B} /><Tick a={B} b={K} /><Lbl p={mid(A, B)} t="5" o={[-50, 0]} c={ACC} /></g></g>;
    }
    case 'rect30': {
      const A: P = [170, 850], B: P = [170, 420], Cc: P = [910, 420], D: P = [910, 850];
      return <g><Poly pts={[A, B, Cc, D]} t={t} /><Names pts={[A, B, Cc, D]} names="ABCD" offs={[[-40, 30], [-40, -30], [40, -30], [40, 30]]} />
        <Seg a={A} b={Cc} t={s(0.1)} c={HL} /><Lbl p={mid(A, Cc)} t="12" o={[-30, -40]} c={HL} op={s(0.1)} />
        <g opacity={s(0.2)}><Arc p={A} a1={ang(A, Cc)} a2={0} r={110} /><Lbl p={A} t="30°" o={[190, -40]} c={ACC} s={40} /></g>
        <g opacity={s(0.45)}><Seg a={Cc} b={D} t={1} c={RED} w={10} /><Lbl p={mid(Cc, D)} t="6" o={[50, 0]} c={RED} /></g></g>;
    }
    case 'rhomb60': {
      const A: P = [200, 800], B: P = [410, 436], Cc: P = [830, 436], D: P = [620, 800];
      return <g><Poly pts={[A, B, Cc, D]} t={t} /><Names pts={[A, B, Cc, D]} names="ABCD" offs={[[-40, 30], [-30, -40], [30, -40], [40, 30]]} />
        <g opacity={s(0.1)}><Arc p={A} a1={ang(A, B)} a2={0} r={70} /><Lbl p={A} t="60°" o={[120, -40]} c={ACC} s={40} /><Lbl p={mid(A, B)} t="7" o={[-45, 0]} c={HL} /><Lbl p={mid(A, D)} t="7" o={[0, 45]} c={HL} /></g>
        <g opacity={s(0.35)}><Poly pts={[A, B, D]} t={1} c={GRN} fill="rgba(90,224,138,0.15)" /><Lbl p={mid(B, D)} t="7" o={[45, 0]} c={GRN} /></g></g>;
    }
  }
  return null;
};

export const SceneGm: React.FC<{f: number}> = ({f}) => {
  const cur = [...slides].reverse().find((sl) => f >= line(sl.id).start - 8) ?? slides[0];
  const l = line(cur.id);
  const dur = Math.max(30, l.dur);
  const k = Math.min(1, Math.max(0, (f - l.start) / dur));
  const t = easeOut(ramp(f, l.start - 6, l.start + 24));
  const n = cur.lines.length;
  const big = cur.fig === 'intro' || cur.fig === 'pause';
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #1a2448 0%, #0a0e1c 60%, #05070e 100%)'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.08}}>{Array.from({length: 40}).map((_, i) => <line key={i} x1={i * 54} y1={0} x2={i * 54} y2={1920} stroke="#7aa0ff" strokeWidth={1} />)}{Array.from({length: 40}).map((_, i) => <line key={'h' + i} x1={0} y1={i * 54} x2={1080} y2={i * 54} stroke="#7aa0ff" strokeWidth={1} />)}</svg>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: big ? 1000 : 110}}>
        {cur.tag && <div style={{padding: '6px 22px', borderRadius: 14, background: cur.tag === 'ЗАДАЧИ' ? RED : HL, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: '#0a0e1c', marginBottom: 14}}>{cur.tag}</div>}
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: big ? (cur.title.length > 10 ? 84 : 110) : cur.title.length > 18 ? 58 : 76, color: C.white, textAlign: 'center', lineHeight: 1.05, opacity: t, transform: `translateY(${(1 - t) * 30}px)`}}>{cur.title}</div>
      </AbsoluteFill>
      <SVG><g transform={big ? 'translate(0 -80)' : 'translate(0 40)'}><Fig fig={cur.fig} t={t} k={k} id={cur.id} /></g></SVG>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: big ? 1200 : 1030, gap: 22}}>
        {cur.lines.map((s, i) => {
          const at = l.start + (i / (n + 0.3)) * dur;
          const o = ramp(f, at, at + 10);
          const last = i === n - 1 && cur.tag === 'ЗАДАЧИ';
          return <div key={i} style={{maxWidth: 960, padding: '16px 28px', borderRadius: 18, background: last ? 'rgba(255,210,58,0.16)' : 'rgba(255,255,255,0.06)', border: `3px solid ${last ? ACC : 'rgba(255,255,255,0.12)'}`, fontFamily: s.match(/[=∥⟂∠°+·/]/) ? MONO : FONT, fontWeight: 800, fontSize: big ? 56 : 48, color: last ? ACC : INK, textAlign: 'center', opacity: o, transform: `translateX(${(1 - easeOut(o)) * 40}px)`}}>{s}</div>;
        })}
      </AbsoluteFill>
      <div style={{position: 'absolute', bottom: 60, left: 60, right: 60, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.1)'}}><div style={{width: `${((slides.findIndex((x) => x.id === cur.id) + k) / slides.length) * 100}%`, height: '100%', borderRadius: 5, background: ACC}} /></div>
    </AbsoluteFill>
  );
};
