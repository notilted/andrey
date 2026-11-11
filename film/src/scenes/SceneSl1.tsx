import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Toon} from '../components/Toon';
import {C, FONT, MONO} from '../theme';
import {mk} from '../timelineSl1';
import {easeOut, ramp} from '../util';
import {HERO} from './SceneCr2';
import {SVG} from './twkit';

/** «5 приёмов распродаж» — 11.11. */

const RED = '#ff3a4a', YEL = '#ffd23a';

const Card: React.FC<{n: number; title: string; f: number; at: number; children: React.ReactNode}> = ({n, title, f, at, children}) => {
  const t = easeOut(ramp(f, at, at + 12));
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 150, opacity: t, transform: `translateY(${(1 - t) * 60}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
        <div style={{width: 120, height: 120, borderRadius: 60, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 72, color: '#fff'}}>{n}</div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 62, color: C.white, maxWidth: 760, lineHeight: 1.05}}>{title}</div>
      </div>
      <div style={{marginTop: 50, width: 900, minHeight: 420, borderRadius: 30, background: 'rgba(255,255,255,0.06)', border: '3px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 30}}>{children}</div>
    </AbsoluteFill>
  );
};

export const SceneSl1: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const FI = m('five'), T1 = m('t1'), UP = m('up'), GI = m('gift'), T2 = m('t2'), RU = m('rush'), T3 = m('t3'), SO = m('socks'), T4 = m('t4'), TE = m('ten'), T5 = m('t5'), CA = m('cart'), TI = m('tip'), SU = m('sub');
  const price = f < UP ? 1990 : Math.round(1990 + 2010 * easeOut(ramp(f, UP, UP + 25)));
  const timer = Math.max(0, 59 - Math.floor((f - T2) / 6));
  const pays = f < TE ? 4 : Math.min(10, 4 + Math.floor((f - TE) / 6));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SVG>
        <Glow f={f} c1={f < T1 ? '#4a1020' : '#1e1a30'} c2="#07060c" cy={760} id="gsl" />
        <rect x={-200} y={1250} width={1480} height={900} fill="#0c0c14" />
        <Toon id="mk" x={f < T1 ? 540 : 900} y={1250} s={f < T1 ? 1.0 : 0.6} f={f} look={HERO} facing={-1} pose={{eyes: f >= RU && f < T3 ? 'wide' : 'open', mouth: f >= GI && f < T2 ? 'grin' : f >= CA && f < TI ? 'fear' : 'smile', armR: [120, -80], sweat: f >= TE && f < T5}} />
      </SVG>
      {f < T1 && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 180, gap: 24}}>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 200, color: RED, lineHeight: 1, textShadow: '0 8px 0 #000'}}>11.11</div>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 70, color: C.white, textAlign: 'center', lineHeight: 1.05}}>ДЕНЬ РАСПРОДАЖ</div>
          {f >= FI && <div style={{padding: '14px 34px', borderRadius: 20, background: YEL, fontFamily: FONT, fontWeight: 900, fontSize: 44, maxWidth: 860, textAlign: 'center', color: '#14171d', opacity: ramp(f, FI, FI + 8)}}>5 ПРИЁМОВ, НА КОТОРЫЕ ТЫ ПОПАДАЛСЯ</div>}
        </AbsoluteFill>
      )}
      {f >= T1 && f < T2 && (
        <Card n={1} title="ЗАЧЁРКНУТАЯ ЦЕНА" f={f} at={T1}>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 110, color: f >= UP ? C.grey : '#fff', textDecoration: f >= GI ? 'line-through' : 'none'}}>{price} ₽</div>
          {f >= UP && f < GI && <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, color: RED}}>↑ подняли перед акцией</div>}
          {f >= GI && <div style={{display: 'flex', gap: 30, alignItems: 'center', opacity: ramp(f, GI, GI + 8)}}><span style={{padding: '8px 22px', borderRadius: 14, background: RED, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff'}}>−50%</span><span style={{fontFamily: MONO, fontWeight: 800, fontSize: 96, color: YEL}}>2000 ₽</span></div>}
          {f >= GI + 30 && <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.grey, opacity: ramp(f, GI + 30, GI + 40)}}>почти та же цена, что была</div>}
        </Card>
      )}
      {f >= T2 && f < T3 && (
        <Card n={2} title="«ОСТАЛОСЬ 2 ШТУКИ» + ТАЙМЕР" f={f} at={T2}>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 130, color: RED}}>00:{String(timer).padStart(2, '0')}</div>
          <div style={{padding: '10px 26px', borderRadius: 14, background: '#3a1a1a', fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#ff8a8a'}}>🔥 ОСТАЛОСЬ 2 ШТ.</div>
          {f >= RU && <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: YEL, opacity: ramp(f, RU, RU + 8)}}>спешка выключает голову</div>}
        </Card>
      )}
      {f >= T3 && f < T4 && (
        <Card n={3} title="ДОСТАВКА БЕСПЛАТНО ОТ 2000 ₽" f={f} at={T3}>
          <div style={{width: 700, height: 44, borderRadius: 22, background: '#1a1d24'}}><div style={{width: `${f < SO ? 80 : 100}%`, height: '100%', borderRadius: 22, background: f < SO ? YEL : '#3ac87a'}} /></div>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 60, color: '#fff'}}>{f < SO ? '1 600 / 2 000 ₽' : '2 090 / 2 000 ₽ ✓'}</div>
          {f >= SO && <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: RED, opacity: ramp(f, SO, SO + 8)}}>+ 🧦 носки, которые не нужны</div>}
        </Card>
      )}
      {f >= T4 && f < T5 && (
        <Card n={4} title="ОПЛАТА ЧАСТЯМИ" f={f} at={T4}>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', width: 760}}>
            {Array.from({length: pays}).map((_, i) => <div key={i} style={{width: 160, padding: '14px 0', borderRadius: 14, background: i < 4 ? '#2a3a5a' : '#5a1a2a', textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 36, color: '#fff'}}>500 ₽</div>)}
          </div>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: pays > 4 ? RED : YEL}}>{pays} {pays < 5 ? 'платежа — мелочь?' : 'платежей'}</div>
        </Card>
      )}
      {f >= T5 && f < TI && (
        <Card n={5} title="«ВАМ МОЖЕТ ПОНРАВИТЬСЯ»" f={f} at={T5}>
          <div style={{fontSize: 110, letterSpacing: 10}}>{f < CA ? '🎧' : '🎧📱⌚👟🧢'}</div>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 50, color: f < CA ? '#fff' : RED}}>{f < CA ? 'пришёл за одним…' : '…ушёл с пятью'}</div>
        </Card>
      )}
      {f >= TI && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34, paddingBottom: 340}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 60, color: C.white, textAlign: 'center', opacity: ramp(f - TI, 0, 10)}}>💡 ПРОВЕРЯЙ<br />ИСТОРИЮ ЦЕНЫ</div>
          {f >= SU && <div style={{padding: '22px 70px', borderRadius: 50, background: '#fe2c55', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${1 + 0.05 * Math.sin((f - SU) / 4)})`, opacity: ramp(f - SU, 0, 8)}}>+ ПОДПИСАТЬСЯ</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
