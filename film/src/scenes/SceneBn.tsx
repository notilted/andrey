import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {FONT, MONO} from '../theme';
import {mk} from '../timelineBn';
import {easeOut, ramp, rand} from '../util';

/** Новостной ролик «Взлом Binance» — профессиональная инфографика: тёмный UI, сетка, карточки, свечи. */

const Y = '#F0B90B';
const BG = '#0B0E11';
const PANEL = '#161A1E';
const LINE = '#2B3139';
const TXT = '#EAECEF';
const SUB = '#848E9C';
const UP = '#0ECB81';
const DN = '#F6465D';

const fmtUsd = (n: number) => '$' + Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
const fade = (f: number, a: number, d = 10) => easeOut(ramp(f, a, a + d));
const rise = (f: number, a: number, d = 12) => `translateY(${(1 - easeOut(ramp(f, a, a + d))) * 40}px)`;

/** Логотип Binance (ромб из квадратов). */
const BnLogo: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="-160 -160 320 320">
    <g fill={Y}>
      <rect x={-22} y={-22} width={44} height={44} transform="rotate(45)" />
      {[[0, -84], [84, 0], [0, 84], [-84, 0]].map(([a, b], i) => <rect key={i} x={a - 20} y={b - 20} width={40} height={40} transform={`rotate(45 ${a} ${b})`} />)}
      <path d="M0 -150 L-62 -88 L-38 -64 L0 -102 L38 -64 L62 -88 Z" />
      <path d="M0 150 L-62 88 L-38 64 L0 102 L38 64 L62 88 Z" />
    </g>
  </svg>
);

/** Фон: сетка + мягкое свечение. */
const Backdrop: React.FC<{glow?: string}> = ({glow = 'rgba(240,185,11,0.10)'}) => (
  <AbsoluteFill style={{background: BG}}>
    <AbsoluteFill style={{backgroundImage: `linear-gradient(${LINE}55 1px, transparent 1px), linear-gradient(90deg, ${LINE}55 1px, transparent 1px)`, backgroundSize: '60px 60px', opacity: 0.5}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 45% at 50% 40%, ${glow}, transparent 70%)`}} />
  </AbsoluteFill>
);

/** Верхняя плашка «СРОЧНО». */
const TopBar: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', top: 70, left: 50, right: 50, display: 'flex', alignItems: 'center', gap: 18}}>
    <div style={{padding: '8px 18px', background: DN, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 2, borderRadius: 6, opacity: Math.floor(f / 20) % 2 ? 1 : 0.85}}>СРОЧНО</div>
    <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 26, color: SUB, letterSpacing: 2}}>КРИПТОРЫНОК · 30.10.2026</div>
  </div>
);

/** Бегущая строка котировок внизу. */
const Ticker: React.FC<{f: number}> = ({f}) => {
  const items = [['BTC', '$77 446', '−4.1%'], ['BNB', '', '−6.0%'], ['ВЗЛОМ BINANCE', '$6,3 МЛРД', '']];
  const s = items.map(([a, b, c]) => [a, b, c].filter(Boolean).join('  ')).join('      ▼      ');
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, background: PANEL, borderTop: `2px solid ${LINE}`, overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
      <div style={{whiteSpace: 'nowrap', transform: `translateX(${-((f * 3) % 1400)}px)`, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: DN}}>{s}      ▼      {s}      ▼      {s}</div>
    </div>
  );
};

/** Карточка-цифра. */
const Stat: React.FC<{f: number; at: number; value: string; label: string; color?: string; w?: number}> = ({f, at, value, label, color = Y, w = 900}) => (
  <div style={{width: w, padding: '34px 40px', background: PANEL, border: `2px solid ${LINE}`, borderLeft: `8px solid ${color}`, borderRadius: 18, opacity: fade(f, at), transform: rise(f, at)}}>
    <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 84, color, lineHeight: 1}}>{value}</div>
    <div style={{marginTop: 14, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: TXT, letterSpacing: 1}}>{label}</div>
  </div>
);

/** Свечной график: спокойный рынок → обвал. */
const Candles: React.FC<{f: number; at: number; title: string; price: string; pct: string; seed: number; w?: number; h?: number}> = ({f, at, title, price, pct, seed, w = 940, h = 560}) => {
  const n = 34;
  const series: {o: number; c: number; hi: number; lo: number}[] = [];
  let p = 100;
  for (let i = 0; i < n; i++) {
    const crash = i >= 24 ? -(1.2 + rand(i + seed) * 1.6) : 0;
    const o = p;
    const c = p + (rand(i * 3 + seed) - 0.48) * 1.4 + crash;
    series.push({o, c, hi: Math.max(o, c) + rand(i + seed + 9) * 0.8, lo: Math.min(o, c) - rand(i + seed + 5) * 0.8});
    p = c;
  }
  const max = Math.max(...series.map((s) => s.hi)), min = Math.min(...series.map((s) => s.lo));
  const pad = 70, cw = (w - pad) / n;
  const yv = (v: number) => 40 + ((max - v) / (max - min)) * (h - 120);
  const shown = Math.floor(interpolate(f - at, [0, 50], [6, n], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const last = series[Math.min(shown, n) - 1];
  return (
    <div style={{width: w, padding: '26px 0 10px', background: PANEL, border: `2px solid ${LINE}`, borderRadius: 18, opacity: fade(f, at), transform: rise(f, at)}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 32px'}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: TXT}}>{title} <span style={{fontSize: 24, color: SUB, fontWeight: 700}}>/ USDT · 15m</span></div>
        <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 40, color: shown > 24 ? DN : UP}}>{shown > 24 ? pct : '+0.3%'}</div>
      </div>
      <div style={{padding: '0 32px', fontFamily: MONO, fontWeight: 700, fontSize: 28, color: SUB}}>{price}</div>
      <svg width={w} height={h} style={{display: 'block'}}>
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={0} x2={w - pad + 10} y1={40 + i * ((h - 120) / 4)} y2={40 + i * ((h - 120) / 4)} stroke={LINE} strokeWidth={1.5} strokeDasharray="6 8" />)}
        {series.slice(0, shown).map((s, i) => {
          const x = 20 + i * cw + cw / 2;
          const col = s.c >= s.o ? UP : DN;
          const top = yv(Math.max(s.o, s.c)), bot = yv(Math.min(s.o, s.c));
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={yv(s.hi)} y2={yv(s.lo)} stroke={col} strokeWidth={3} />
              <rect x={x - cw * 0.32} y={top} width={cw * 0.64} height={Math.max(3, bot - top)} fill={col} rx={2} />
            </g>
          );
        })}
        {last && <g><line x1={0} x2={w - pad + 10} y1={yv(last.c)} y2={yv(last.c)} stroke={last.c >= last.o ? UP : DN} strokeWidth={2} strokeDasharray="4 6" /><rect x={w - pad + 10} y={yv(last.c) - 18} width={pad - 14} height={36} rx={6} fill={last.c >= last.o ? UP : DN} /></g>}
        <rect x={20} y={h - 70} width={w - pad - 10} height={50} fill="none" />
        {series.slice(0, shown).map((s, i) => <rect key={`v${i}`} x={20 + i * cw + cw * 0.18} y={h - 20 - (6 + rand(i + seed + 30) * 20 + (i >= 24 ? 26 : 0))} width={cw * 0.64} height={6 + rand(i + seed + 30) * 20 + (i >= 24 ? 26 : 0)} fill={s.c >= s.o ? UP : DN} opacity={0.4} />)}
      </svg>
    </div>
  );
};

/** Схема атаки: ноутбук → инфраструктура → кошельки. */
const AttackMap: React.FC<{f: number; at: number; flow: number}> = ({f, at, flow}) => {
  const node = (x: number, y: number, label: string, icon: React.ReactNode, col: string) => (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-130} y={-90} width={260} height={180} rx={20} fill={PANEL} stroke={col} strokeWidth={3} />
      <g transform="translate(0 -18)">{icon}</g>
      <text x={0} y={66} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={TXT}>{label}</text>
    </g>
  );
  const laptop = <g stroke={DN} strokeWidth={5} fill="none"><rect x={-44} y={-34} width={88} height={56} rx={6} /><path d="M-58 30 L58 30" /><path d="M0 -20 L0 0 M0 8 L0 10" strokeLinecap="round" /></g>;
  const server = <g stroke={Y} strokeWidth={5} fill="none">{[0, 1, 2].map((i) => <rect key={i} x={-40} y={-40 + i * 26} width={80} height={20} rx={4} />)}</g>;
  const wallet = <g stroke={SUB} strokeWidth={5} fill="none"><rect x={-42} y={-30} width={84} height={58} rx={8} /><circle cx={24} cy={0} r={6} /></g>;
  const dash = (x1: number, y1: number, x2: number, y2: number, col: string) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={5} strokeDasharray="14 12" strokeDashoffset={-f * 3} opacity={flow} />
  );
  return (
    <svg viewBox="0 0 1080 1100" width={860} height={876} style={{opacity: fade(f, at)}}>
      {dash(540, 290, 540, 470, DN)}
      {dash(540, 650, 260, 830, DN)}
      {dash(540, 650, 820, 830, DN)}
      {node(540, 200, 'НОУТБУК ИНЖЕНЕРА', laptop, DN)}
      {node(540, 560, 'СИСТЕМЫ БИРЖИ', server, Y)}
      {node(260, 920, 'КОШЕЛЬКИ ХАКЕРОВ', wallet, SUB)}
      {node(820, 920, 'КОШЕЛЬКИ ХАКЕРОВ', wallet, SUB)}
    </svg>
  );
};

/** Экран вывода в приложении. */
const Withdraw: React.FC<{f: number; at: number}> = ({f, at}) => (
  <div style={{width: 760, padding: 40, background: PANEL, border: `2px solid ${LINE}`, borderRadius: 26, opacity: fade(f, at), transform: rise(f, at)}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16}}><BnLogo size={56} /><div style={{fontFamily: FONT, fontWeight: 900, fontSize: 36, color: TXT}}>Вывод средств</div></div>
    <div style={{marginTop: 30, fontFamily: FONT, fontWeight: 700, fontSize: 26, color: SUB}}>Доступно</div>
    <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 60, color: TXT}}>12 480.00 USDT</div>
    <div style={{marginTop: 30, padding: '22px 0', borderRadius: 14, background: '#2B3139', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 34, color: '#5E6673'}}>ВЫВЕСТИ</div>
    <div style={{marginTop: 22, padding: '16px 20px', borderRadius: 12, background: 'rgba(246,70,93,0.12)', border: `2px solid ${DN}`, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: DN, opacity: fade(f, at + 15)}}>⚠ Вывод временно приостановлен</div>
  </div>
);

export const SceneBn: React.FC<{f: number}> = ({f}) => {
  const m = mk;
  const NI = m('night'), L0 = m('laptop0'), BI = m('binance'), HA = m('hacked'), RE = m('record'), HO = m('how'), EN = m('eng'), PA = m('path');
  const SC = m('scale'), FR = m('freeze'), US = m('users'), MA = m('market'), BN = m('bnb'), WH = m('who'), DP = m('dprk'), DE = m('deny');
  const GO = m('good'), FZ = m('frozen'), CO = m('cover'), HR = m('hours'), Q = m('q');
  const center = (children: React.ReactNode, top = 260) => <AbsoluteFill style={{alignItems: 'center', paddingTop: top, gap: 30}}>{children}</AbsoluteFill>;
  let body: React.ReactNode = null;
  let glow: string | undefined;
  if (f < BI) {
    glow = 'rgba(246,70,93,0.16)';
    const v = interpolate(f, [0, 40], [0, 6.3e9], {extrapolateRight: 'clamp', easing: (t) => 1 - (1 - t) ** 3});
    body = center(<>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: SUB, letterSpacing: 4, opacity: fade(f, 0, 6)}}>УКРАДЕНО</div>
      <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 104, color: Y, textShadow: '0 0 50px rgba(240,185,11,0.35)'}}>{fmtUsd(v)}</div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 48, color: TXT, opacity: fade(f, NI)}}>ЗА ОДНУ НОЧЬ</div>
      {f >= L0 && <div style={{marginTop: 20, padding: '14px 30px', border: `2px solid ${DN}`, borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: DN, opacity: fade(f, L0)}}>ТОЧКА ВХОДА: ОДИН НОУТБУК</div>}
    </>, 380);
  } else if (f < HO) {
    body = center(<>
      <div style={{opacity: fade(f, BI), transform: `scale(${0.9 + 0.1 * easeOut(ramp(f, BI, BI + 15))})`}}><BnLogo size={300} /></div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, color: Y, letterSpacing: 10, opacity: fade(f, BI + 5)}}>BINANCE</div>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 30, color: SUB, opacity: fade(f, BI + 10)}}>Крупнейшая криптобиржа мира по объёму торгов</div>
      {f >= HA && <div style={{marginTop: 20, padding: '14px 40px', background: DN, borderRadius: 10, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: '#fff', letterSpacing: 4, opacity: fade(f, HA, 6)}}>ПОДТВЕРДИЛА ВЗЛОМ</div>}
      {f >= RE && <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 34, color: TXT, opacity: fade(f, RE)}}>Крупнейшая кража криптовалюты в истории</div>}
    </>, 300);
  } else if (f < SC) {
    body = <AbsoluteFill style={{alignItems: 'center', paddingTop: 200}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: TXT, letterSpacing: 2, opacity: fade(f, HO)}}>КАК ЭТО ПРОИЗОШЛО</div>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 26, color: SUB, opacity: fade(f, HO + 5)}}>по данным Binance</div>
      <AttackMap f={f} at={HO} flow={ramp(f, PA, PA + 20)} />
    </AbsoluteFill>;
  } else if (f < FR) {
    const people = Math.floor(interpolate(f - SC, [0, 60], [0, 160], {extrapolateRight: 'clamp'}));
    body = center(<>
      <Stat f={f} at={SC} value="≈ $485" label="на каждого жителя Москвы (13 млн человек)" />
      <div style={{width: 900, display: 'flex', flexWrap: 'wrap', gap: 10, opacity: fade(f, SC + 10)}}>
        {Array.from({length: 160}).map((_, i) => <div key={i} style={{width: 36, height: 36, borderRadius: 18, background: i < people ? Y : LINE}} />)}
      </div>
    </>, 300);
  } else if (f < MA) {
    body = center(<>
      <Withdraw f={f} at={FR} />
      {f >= US && <Stat f={f} at={US} value="МИЛЛИОНЫ" label="пользователей не могут вывести средства" color={DN} w={760} />}
    </>, 260);
  } else if (f < WH) {
    glow = 'rgba(246,70,93,0.10)';
    body = center(<>
      <Candles f={f} at={MA} title="BTC" price="≈ $77 446" pct="−4.1%" seed={3} h={f >= BN ? 420 : 560} />
      {f >= BN && <Candles f={f} at={BN} title="BNB" price="токен Binance" pct="−6.0%" seed={11} h={420} />}
    </>, 180);
  } else if (f < GO) {
    body = center(<>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 48, color: TXT, opacity: fade(f, WH)}}>КТО ЗА ЭТИМ СТОИТ?</div>
      <div style={{display: 'flex', gap: 24}}>
        {f >= DP && <div style={{width: 430, padding: 30, background: PANEL, border: `2px solid ${LINE}`, borderTop: `8px solid ${Y}`, borderRadius: 18, opacity: fade(f, DP), transform: rise(f, DP)}}>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 24, color: SUB}}>АНАЛИТИКИ БЛОКЧЕЙНА</div>
          <div style={{marginTop: 12, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: TXT, lineHeight: 1.15}}>Хакеры из Северной Кореи</div>
        </div>}
        {f >= DE && <div style={{width: 430, padding: 30, background: PANEL, border: `2px solid ${LINE}`, borderTop: `8px solid ${DN}`, borderRadius: 18, opacity: fade(f, DE), transform: rise(f, DE)}}>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 24, color: SUB}}>BINANCE</div>
          <div style={{marginTop: 12, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: TXT, lineHeight: 1.15}}>Пока не подтверждает</div>
        </div>}
      </div>
    </>, 380);
  } else if (f < HR) {
    glow = 'rgba(14,203,129,0.10)';
    body = center(<>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 44, color: UP, opacity: fade(f, GO)}}>ХОРОШИЕ НОВОСТИ</div>
      {f >= FZ && <Stat f={f} at={FZ} value="$3+ млрд" label="украденного уже заморожено" color={UP} />}
      {f >= CO && <Stat f={f} at={CO} value="$6,34 млрд" label="Binance выделила на компенсацию из своих средств" />}
    </>, 300);
  } else {
    const left = Math.max(0, 40 * 3600 - (f - HR) * 120);
    const t = [Math.floor(left / 3600), Math.floor((left % 3600) / 60), Math.floor(left % 60)].map((x) => String(x).padStart(2, '0')).join(':');
    body = center(f < Q ? <>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: SUB, letterSpacing: 3}}>ДО ВОЗОБНОВЛЕНИЯ ВЫВОДА</div>
      <div style={{padding: '24px 50px', background: PANEL, border: `2px solid ${LINE}`, borderRadius: 18, fontFamily: MONO, fontWeight: 800, fontSize: 130, color: Y}}>{t}</div>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 26, color: SUB}}>ориентировочно, по данным CoinDesk</div>
    </> : <>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 62, color: TXT, textAlign: 'center', lineHeight: 1.12, opacity: fade(f, Q)}}>Ты бы сейчас держал<br />деньги на бирже?</div>
      <div style={{display: 'flex', gap: 30, opacity: fade(f, Q + 10)}}>
        <div style={{padding: '22px 70px', borderRadius: 16, background: UP, color: BG, fontFamily: FONT, fontWeight: 900, fontSize: 54}}>ДА</div>
        <div style={{padding: '22px 70px', borderRadius: 16, background: DN, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 54}}>НЕТ</div>
      </div>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 34, color: Y, opacity: fade(f, Q + 20)}}>Ответ — в комментариях 👇</div>
    </>, 420);
  }
  return (
    <AbsoluteFill>
      <Backdrop glow={glow} />
      {body}
      <TopBar f={f} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 84, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 20, color: '#5E6673'}}>Источники: The Block, CNBC, TechCrunch, CoinDesk, Al Jazeera</div>
      <Ticker f={f} />
    </AbsoluteFill>
  );
};
