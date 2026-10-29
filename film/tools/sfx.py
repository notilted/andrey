"""Синтез звуковых эффектов и музыки «17 минут» (всё собственное, без сторонних сэмплов).

python3 tools/sfx.py  -> public/sfx/*.wav, public/music/*.wav, tools/ir_*.wav
"""
import os
import numpy as np, soundfile as sf

SR = 48000
ROOT = os.path.join(os.path.dirname(__file__), "..")
rng = np.random.default_rng(17)

def t(d): return np.arange(int(d * SR)) / SR
def save(name, x):
    x = np.asarray(x, np.float32)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x /= max(1e-9, np.abs(x).max()) / 0.89
    sf.write(os.path.join(ROOT, name), x, SR)

def lp(x, fc):  # быстрый ФНЧ через БПФ
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / np.sqrt(1 + (f / fc) ** 4), len(x))
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / np.sqrt(1 + (f / hi) ** 4) / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4), len(x))
def env(n, a, r):
    e = np.ones(n); A = int(a * SR); R = int(r * SR)
    if A: e[:A] = np.linspace(0, 1, A)
    if R: e[-R:] *= np.linspace(1, 0, R) ** 2
    return e
def noise(d): return rng.standard_normal(int(d * SR))

def ir(d, decay, bright):
    n = noise(d) * np.exp(-t(d) * 6.9 / decay)
    return lp(n, bright)

def conv(x, h, wet):
    y = np.fft.irfft(np.fft.rfft(x, len(x) + len(h)) * np.fft.rfft(h, len(x) + len(h)))[:len(x)]
    y *= np.abs(x).max() / max(1e-9, np.abs(y).max())
    return (1 - wet) * x + wet * y

# ---------- SFX ----------
def phone_alert(d=3.2):
    # двухтональный сигнал оповещения 853+960 Гц, пульсирующий
    x = t(d); s = np.sin(2 * np.pi * 853 * x) + np.sin(2 * np.pi * 960 * x)
    gate = (np.sin(2 * np.pi * 2.2 * x) > -0.2).astype(float)
    gate = lp(gate, 60)
    buzz = bp(noise(d), 120, 260) * (np.sin(2 * np.pi * 2.2 * x) > 0) * 0.5
    return (s * 0.5 * gate + buzz) * env(len(x), 0.005, 0.2)

def siren(d=14, base=430, top=780, period=7.0, dist=0.0):
    x = t(d); ph = (x % period) / period
    f = base + (top - base) * np.where(ph < 0.55, np.sin(ph / 0.55 * np.pi / 2), np.cos((ph - 0.55) / 0.45 * np.pi / 2))
    p = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(p) + 0.45 * np.sin(2 * p) + 0.2 * np.sin(3 * p) + 0.08 * np.sin(5 * p)
    y = lp(y, 2400 - dist * 1600)
    return conv(y * env(len(x), 1.5, 2.0), ir(2.5, 2.2, 3000), 0.5 + dist * 0.3)

def whoosh(d=1.4):
    x = t(d); e = np.sin(np.pi * np.clip(x / d, 0, 1)) ** 3
    n = noise(d); lo = lp(n, 300 + 2500 * e.max()) * e
    return lo + 0.3 * bp(n, 800, 4000) * e ** 2

def pencil(d=6.0):
    x = t(d); strokes = np.zeros_like(x); i = 0
    while i < len(x):
        L = int(rng.uniform(0.08, 0.3) * SR); g = rng.uniform(0.04, 0.25) * SR
        seg = np.sin(np.linspace(0, np.pi, min(L, len(x) - i)))
        strokes[i:i + len(seg)] = seg; i += L + int(g)
    return bp(noise(d), 2500, 9000) * strokes * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * x))

def chair(d=0.7):
    x = t(d); f = 140 + 80 * np.sin(np.pi * x / d)
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.3 + bp(noise(d), 300, 2000)
    return lp(s, 2500) * env(len(x), 0.03, 0.25)

def impact_low(d=4.0):
    x = t(d); f = 55 * np.exp(-x * 1.5) + 28
    b = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 1.3)
    return b + lp(noise(d), 400) * np.exp(-x * 3) * 0.8

def ui_tick(d=0.12):
    x = t(d); return np.sin(2 * np.pi * 1800 * x) * np.exp(-x * 60) * 0.6

def stinger(d=2.5):  # резкий удар-акцент при появлении уведомления
    x = t(d); hit = lp(noise(d), 3000) * np.exp(-x * 9)
    sub = np.sin(2 * np.pi * (60 * np.exp(-x * 2) + 35) * x) * np.exp(-x * 1.6)
    return conv(hit * 0.7 + sub, ir(2.0, 1.8, 5000), 0.35)

def tv_murmur(d=8):
    x = t(d); syl = lp((rng.random(len(x)) < 9 / SR).astype(float), 12) * 4000
    return bp(noise(d), 300, 2500) * np.clip(syl, 0, 1) * 0.6

def room_tone(d=20):
    n = noise(d); return lp(n, 180) * 0.7 + bp(n, 2000, 6000) * 0.02

def night_city(d=20):
    x = t(d); wind = lp(noise(d), 350) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * x))
    hum = 0.08 * np.sin(2 * np.pi * 50 * x)
    car = np.zeros_like(x)
    for c in (2.0, 9.5, 15.0):
        e = np.exp(-((x - c) / 1.6) ** 2); car += (lp(noise(d), 500) + lp(noise(d), 1200) * e) * e * 0.9
    L = wind + hum + car * np.clip(np.sin(2 * np.pi * 0.05 * x) + 1.2, 0, 2)
    R = np.roll(wind, 2400) + hum + car
    return np.stack([L, R], 1)


# ---------- SFX сцен 2–7 ----------
def step(hard=1.0, d=0.18):
    x = t(d); thump = np.sin(2 * np.pi * (90 + 40 * hard) * x) * np.exp(-x * 40)
    scuff = bp(noise(d), 400, 3000) * np.exp(-x * 30) * 0.5
    return (thump + scuff) * hard

def footsteps(d=10, rate=3.2, people=6, gain_var=0.5):
    out = np.zeros(int(d * SR))
    for p in range(people):
        tt = rng.uniform(0, 0.3); r = rate * rng.uniform(0.85, 1.15)
        while tt < d - 0.3:
            s_ = step(rng.uniform(1 - gain_var, 1)) * rng.uniform(0.3, 1); i = int(tt * SR)
            out[i:i + len(s_)] += s_[:len(out) - i]; tt += 1 / r * rng.uniform(0.9, 1.1)
    return conv(out, ir(1.2, 1.0, 4000), 0.4)

def parrot(d=0.9):
    x = t(d); f = 2200 + 900 * np.sin(2 * np.pi * 7 * x) * np.exp(-x * 2) + 600 * np.sin(2 * np.pi * 31 * x)
    y = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.4 + np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR)
    return bp(y, 900, 6000) * env(len(x), 0.01, 0.25) * (x < 0.55)

def wings(d=1.2):
    x = t(d); m = (np.sin(2 * np.pi * 11 * x) > 0.3).astype(float)
    return bp(noise(d), 300, 3000) * lp(m, 80) * env(len(x), 0.02, 0.4)

def flicker(d=1.4):
    x = t(d); on = np.ones_like(x)
    for a, b in [(0.1, 0.18), (0.32, 0.36), (0.5, 0.75), (0.9, 0.95), (1.05, 1.25)]:
        on[(x > a) & (x < b)] = 0
    buzz = (np.sin(2 * np.pi * 100 * x) + 0.4 * np.sin(2 * np.pi * 200 * x) + 0.2 * bp(noise(d), 2000, 6000)) * on
    clicks = np.abs(np.diff(on, prepend=1)) * 6
    return lp(buzz * 0.4, 3000) + lp(np.convolve(clicks, np.exp(-np.arange(400) / 60), 'same'), 5000)

def metal_hit(d=2.2, f0=95):
    x = t(d); y = sum(a * np.sin(2 * np.pi * f0 * k * x) * np.exp(-x * (2 + k)) for k, a in [(1, 1), (2.76, 0.5), (5.4, 0.3), (8.9, 0.15)])
    thud = lp(noise(d), 250) * np.exp(-x * 25) * 2
    return conv(y + thud, ir(1.8, 1.4, 3000), 0.35)

def door_clank(d=2.5):
    a = metal_hit(d, 70); b = metal_hit(d, 130) * 0.6
    return a + np.roll(b, int(0.12 * SR))

def crowd(d=12, people=10, excited=0.0):
    out = np.zeros(int(d * SR)); x = t(d)
    for p in range(people):
        f = rng.uniform(140, 260); syl = lp((rng.random(len(x)) < (5 + 4 * excited) / SR).astype(float), 10) * 3000
        talk = bp(noise(d), f * 2, f * 12) * np.clip(syl, 0, 1) * rng.uniform(0.4, 1)
        out += talk
    return conv(out, ir(1.5, 1.2, 3000), 0.5) * env(len(x), 0.8, 1.0)

def cheer(d=4):
    x = t(d); c = crowd(d, 14, 1.0) * (0.5 + 0.5 * np.sin(np.pi * np.clip(x / d, 0, 1)))
    claps = np.zeros_like(x)
    for k in range(40):
        i = int(rng.uniform(0.3, d - 0.5) * SR); n = bp(noise(0.03), 800, 5000) * np.exp(-t(0.03) * 120); claps[i:i + len(n)] += n
    return c + claps * 0.5

def explosion(d=6):
    x = t(d); boom = np.sin(2 * np.pi * (40 * np.exp(-x * 1.2) + 22) * x) * np.exp(-x * 0.9)
    rum = lp(noise(d), 160) * np.exp(-x * 0.6) * 1.5
    deb = bp(noise(d), 1500, 6000) * np.exp(-((x - 0.8) / 0.6) ** 2) * 0.25
    return lp(boom * 1.4 + rum + deb, 900)

def tinnitus(d=4):
    x = t(d); return np.sin(2 * np.pi * 4100 * x) * env(len(x), 0.3, 2.5) * 0.15

def breathing(d=6, rate=0.45, shaky=0.0):
    x = t(d); ph = np.sin(2 * np.pi * rate * x)
    e = np.clip(ph, 0, 1) ** 2 * 0.8 + np.clip(-ph, 0, 1) ** 2 * 0.5
    e *= 1 + shaky * np.sin(2 * np.pi * 9 * x)
    return bp(noise(d), 500, 3500) * e

def heartbeat(d=6, bpm=82):
    out = np.zeros(int(d * SR))
    for k in np.arange(0.2, d - 0.5, 60 / bpm):
        for off, a in ((0, 1), (0.18, 0.7)):
            n = np.sin(2 * np.pi * 50 * t(0.16)) * np.exp(-t(0.16) * 22) * a; i = int((k + off) * SR); out[i:i + len(n)] += n
    return out

def vent(d=20):
    x = t(d); return lp(noise(d), 220) * 0.8 + 0.25 * np.sin(2 * np.pi * 59.5 * x) + 0.1 * np.sin(2 * np.pi * 119 * x)

def ping(d=0.9):
    x = t(d); a = np.sin(2 * np.pi * 1318 * x) * np.exp(-x * 7); b = np.sin(2 * np.pi * 1760 * x) * np.exp(-(x - 0.11).clip(0) * 7) * (x > 0.11)
    return a + b

def vibrate(d=1.2):
    x = t(d); return bp(noise(d), 130, 240) * (np.sin(2 * np.pi * 2.5 * x) > 0) * env(len(x), 0.01, 0.05) * 0.8

def monitor_on(d=2.5):
    x = t(d); thump = np.sin(2 * np.pi * 60 * x) * np.exp(-x * 8)
    whine = np.sin(2 * np.pi * 15600 * x) * 0.05 * (x > 0.1)
    stat = bp(noise(d), 1500, 9000) * np.exp(-x * 1.2) * 0.35
    return thump + whine + stat

def static(d=20):
    x = t(d); return bp(noise(d), 1200, 9000) * 0.12 + 0.03 * np.sin(2 * np.pi * 15600 * x)

def dust(d=2.0):
    x = t(d); out = np.zeros_like(x)
    for k in range(60):
        i = int(abs(rng.normal(0.3, 0.4)) * SR) % len(x); n = bp(noise(0.01), 2000, 8000) * np.exp(-t(0.01) * 300); out[i:i + len(n)] += n * rng.uniform(0.2, 1)
    return out

def phones_chorus(d=3.0):
    out = np.zeros(int(d * SR))
    for k in range(18):
        f = rng.choice([853, 960, 1046, 1318]); st = rng.uniform(0, 0.25)
        n = np.sin(2 * np.pi * f * t(1.4)) * env(int(1.4 * SR), 0.01, 0.6) * (np.sin(2 * np.pi * 3 * t(1.4)) > -0.3)
        i = int(st * SR); out[i:i + len(n)] += n * rng.uniform(0.3, 1)
    return conv(out, ir(1.5, 1.2, 4000), 0.4)

def riser(d=4):
    x = t(d); f = 200 * (2 ** (x / d * 2.5)); y = np.sin(2 * np.pi * np.cumsum(f) / SR)
    n = noise(d); k = x / d
    return ((lp(n, 300) * (1 - k) + lp(n, 3300) * k) * 0.5 + y * 0.3) * k ** 2

# ---------- SFX части 2 ----------
def lock_click(d=1.2):
    x = t(d); a = metal_hit(d, 220) * 0.4
    clk = bp(noise(d), 1500, 7000) * np.exp(-x * 90) * 1.5
    clk2 = np.roll(bp(noise(d), 1000, 5000) * np.exp(-x * 70), int(0.09 * SR))
    return a + clk + clk2

def creak(d=2.5, f0=180):
    x = t(d); f = f0 + 60 * np.sin(2 * np.pi * 0.6 * x) + 25 * np.sin(2 * np.pi * 7 * x)
    stick = (np.sin(2 * np.pi * np.cumsum(f) / SR) > 0.6).astype(float)
    y = bp(stick + 0.2 * noise(d), 200, 3000) * env(len(x), 0.2, 0.6)
    return conv(y, ir(1.5, 1.2, 3000), 0.35)

def door_open(d=4):
    x = t(d); air = lp(noise(d), 600) * np.clip((x - 0.8) / 2.5, 0, 1) * 0.7
    return creak(d, 140) + air

def page_flip(d=0.6):
    x = t(d); return bp(noise(d), 1500, 9000) * np.exp(-((x - 0.2) / 0.08) ** 2) * 0.8

def recap_hit(d=1.8):
    x = t(d); return stinger(d) * 0.8 + bp(noise(d), 3000, 9000) * np.exp(-x * 20) * 0.3

# ---------- музыка ----------
def note(freq, d, bright=1.0):
    x = t(d); y = sum((0.6 ** k) * np.sin(2 * np.pi * freq * (k + 1) * x) * np.exp(-x * (1.2 + k * 0.9 / bright)) for k in range(6))
    return y * env(len(x), 0.004, 0.3)

def pad(freqs, d):
    x = t(d); y = np.zeros_like(x)
    for f in freqs:
        for det in (-0.12, 0.0, 0.11):
            y += np.sin(2 * np.pi * (f + det) * x + rng.uniform(0, 6))
    return lp(y, 900) * env(len(x), 2.5, 3.0)

def music_night(d=8.5):  # спокойная ночь: пэд Am + редкие ноты
    y = pad([110, 164.8, 261.6, 329.6], d) * 0.25
    for st, f in [(0.3, 659.3), (1.9, 523.3), (3.4, 493.9), (5.2, 440.0), (6.6, 392.0)]:
        n = note(f, 2.2); i = int(st * SR); y[i:i + len(n)] += n[:len(y) - i] * 0.35
    return conv(y, ir(3.0, 2.8, 4000), 0.45)

def music_dread(d=12):  # низкий тревожный гул с биениями и пульсом
    x = t(d)
    drone = np.sin(2 * np.pi * 41.2 * x) + 0.7 * np.sin(2 * np.pi * 41.9 * x) + 0.3 * np.sin(2 * np.pi * 82.4 * x)
    cl = 0.12 * lp(np.sign(np.sin(2 * np.pi * 61.7 * x)), 500) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.25 * x))
    pulse = np.zeros_like(x)
    for k in np.arange(0.0, d, 0.75):
        n = np.sin(2 * np.pi * 55 * t(0.35)) * np.exp(-t(0.35) * 14); i = int(k * SR)
        pulse[i:i + len(n)] += n[:len(x) - i] * (0.3 + 0.7 * k / d)
    hi = bp(noise(d), 3000, 7000) * 0.015 * (x / d)
    return (drone * 0.5 + cl + pulse * 0.6 + hi) * env(len(x), 1.0, 1.5)


def music_stairs(d=30, bpm=112):  # ускоряющийся ритм лестницы
    x = t(d); beat = 60 / bpm; out = np.zeros_like(x)
    seq = [55, 55, 65.4, 55, 49, 55, 61.7, 58.3]
    for k, st in enumerate(np.arange(0, d, beat / 2)):
        f = seq[k % len(seq)]; n = np.sin(2 * np.pi * f * t(0.3)) * np.exp(-t(0.3) * 9)
        n += 0.3 * np.sign(np.sin(2 * np.pi * f * 2 * t(0.3))) * np.exp(-t(0.3) * 14)
        i = int(st * SR); out[i:i + len(n)] += lp(n, 900)[: len(out) - i] * (0.7 + 0.3 * (k % 2 == 0))
        if k % 2 == 1:
            h = bp(noise(0.05), 6000, 12000) * np.exp(-t(0.05) * 80); out[i:i + len(h)] += h[: len(out) - i] * 0.3
    padx = pad([110, 130.8, 164.8], d) * 0.18
    return conv(out + padx, ir(1.2, 1.0, 3000), 0.25) * env(len(x), 1.0, 2.0)

def music_shelter(d=60):  # тихое напряжение
    x = t(d); hi = sum(np.sin(2 * np.pi * f * x + rng.uniform(0, 6)) for f in (880, 932.3, 1318.5)) * 0.05
    hi *= 0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * x)
    low = np.sin(2 * np.pi * 41.2 * x) * 0.35 + 0.2 * np.sin(2 * np.pi * 61.7 * x)
    tick = np.zeros_like(x)
    for k in np.arange(0, d, 1.0):
        n = bp(noise(0.02), 3000, 8000) * np.exp(-t(0.02) * 200); i = int(k * SR); tick[i:i + len(n)] += n[: len(x) - i] * 0.25
    return conv(lp(hi, 3000) + low + tick, ir(3, 2.5, 3000), 0.4) * env(len(x), 3, 3)

def music_relief(d=4.5):
    y = pad([130.8, 164.8, 196, 261.6, 329.6], d) * 0.4
    return conv(y, ir(3, 2.5, 4000), 0.5)

def music_double(d=26):  # медленно нарастающий тревожный звук
    x = t(d); k = x / d; y = np.zeros_like(x)
    for i, f in enumerate((55, 58.3, 82.4, 87.3, 110)):
        y += np.sin(2 * np.pi * f * (1 + 0.03 * k) * x) * (k ** (0.5 + i * 0.4))
    shimmer = bp(noise(d), 2000, 6000) * 0.08 * k ** 2
    return conv(lp(y, 1500) * 0.3 + shimmer, ir(3, 2.5, 3000), 0.4) * env(len(x), 2, 1.5)

def music_stage(d=5):
    x = t(d); hit = stinger(2.5); y = np.zeros_like(x); y[:len(hit)] += hit
    y += (np.sin(2 * np.pi * 220 * x) + np.sin(2 * np.pi * 233.1 * x)) * 0.15 * env(len(x), 0.05, 2.5)
    return y

# ---------- «Три волны» ----------
def meteor_roar(d=6):
    # нарастающий рёв входа в атмосферу: шум с поднимающимся срезом + падающий гул
    x = t(d); k = x / d
    n = noise(d); lo = lp(n, 180) * 1.2; hi = bp(n, 600, 5000)
    tone = np.sin(2 * np.pi * np.cumsum(140 - 90 * k) / SR) * 0.35
    return (lo + hi * k ** 1.5 * 0.8 + tone) * k ** 2 * env(len(x), 0.1, 0.15)

def big_impact(d=10):
    x = t(d); boom = np.sin(2 * np.pi * (34 * np.exp(-x * 0.8) + 18) * x) * np.exp(-x * 0.5) * 1.6
    rum = lp(noise(d), 120) * np.exp(-x * 0.35) * 1.8
    crack = bp(noise(d), 800, 7000) * np.exp(-x * 4) * 0.7
    return lp(boom + rum + crack + rubble(d) * 0.4, 1600)

def rubble(d=4):
    out = np.zeros(int(d * SR))
    for k in range(140):
        st = abs(rng.normal(0.4, d / 3)) % (d - 0.2); ln = rng.uniform(0.02, 0.12)
        n = bp(noise(ln), rng.uniform(200, 900), rng.uniform(2000, 6000)) * np.exp(-t(ln) * rng.uniform(30, 90))
        i = int(st * SR); out[i:i + len(n)] += n * rng.uniform(0.2, 1)
    return out

def fire(d=20):
    x = t(d); base = lp(noise(d), 500) * (0.6 + 0.4 * lp(noise(d), 2) * 8)
    out = base * 0.5
    for k in range(int(d * 14)):
        ln = rng.uniform(0.004, 0.02); n = bp(noise(ln), 1500, 8000) * np.exp(-t(ln) * 250)
        i = int(rng.uniform(0, d - 0.05) * SR); out[i:i + len(n)] += n * rng.uniform(0.2, 1.2)
    return out

def meow(d=0.9):
    x = t(d); k = x / d
    f0 = 480 + 380 * np.sin(np.pi * np.clip(k * 1.3, 0, 1)) - 120 * k
    ph = 2 * np.pi * np.cumsum(f0) / SR
    y = sum((0.7 ** h) * np.sin(ph * (h + 1)) for h in range(8))
    return bp(y, 400, 4000) * env(len(x), 0.06, 0.35) * (1 + 0.15 * np.sin(2 * np.pi * 6 * x))

def wind_ash(d=20):
    x = t(d); return bp(noise(d), 200, 1400) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * x) ** 2) * 0.6

def music_sad(d=16, bpm=60):  # тихий мотив: Am — F — C — E
    y = pad([220, 261.6, 329.6], d) * 0.25
    seq = [440, 523.3, 659.3, 523.3, 349.2, 440, 523.3, 440, 392, 523.3, 659.3, 523.3, 329.6, 415.3, 493.9, 415.3]
    for i, fr in enumerate(seq):
        st = i * 60 / bpm; n = note(fr, 2.5, 0.7) * 0.5; j = int(st * SR)
        if j >= len(y): break
        y[j:j + len(n)] += n[: len(y) - j]
    return y

TW = [("meteor_roar", meteor_roar), ("big_impact", big_impact), ("rubble", rubble), ("fire", fire),
      ("meow", meow), ("wind_ash", wind_ash)]

def hum(d=8):  # гул камня: низкий тон с биениями и мягким нарастанием
    x = t(d); y = np.sin(2 * np.pi * 55 * x) + 0.6 * np.sin(2 * np.pi * 55.7 * x) + 0.3 * np.sin(2 * np.pi * 110.4 * x)
    return y * env(len(x), 2.0, 2.0) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.3 * x))

def ringtone(d=6):  # классический звонок: две ноты, пауза
    x = t(d); s = (np.sin(2 * np.pi * 1318 * x) + np.sin(2 * np.pi * 1568 * x)) * 0.5
    gate = ((x % 2.0) < 1.0) * (np.sin(2 * np.pi * 12 * x) > 0)
    return s * gate * 0.6

def silent_pass(d=7):  # объект проходит без звука: только давление воздуха
    x = t(d); k = np.sin(np.pi * x / d) ** 2
    return lp(noise(d), 90) * k * 1.5

def surf(d=20):  # прибой: накаты шума раз в ~5 с
    x = t(d); n = noise(d)
    sw = np.clip(np.sin(2 * np.pi * x / 5.2), 0, 1) ** 3 + 0.25
    return (lp(n, 900) * 0.8 + bp(n, 1500, 6000) * 0.3 * np.clip(np.sin(2 * np.pi * x / 5.2 - 0.6), 0, 1) ** 4) * sw

def gulls(d=12):
    out = np.zeros(int(d * SR))
    for k in range(6):
        st = rng.uniform(0, d - 1.2); ln = rng.uniform(0.4, 0.8); xx = t(ln)
        f0 = 1200 + 700 * np.sin(np.pi * xx / ln) - 300 * xx / ln
        y = np.sin(2 * np.pi * np.cumsum(f0) / SR) * env(len(xx), 0.03, 0.2) * (1 + 0.4 * np.sin(2 * np.pi * 30 * xx))
        i = int(st * SR); out[i:i + len(y)] += bp(y, 800, 5000) * rng.uniform(0.3, 1)
    return out

def water_rush(d=12):  # поток воды: мощный шум с низами
    x = t(d); n = noise(d)
    return (lp(n, 400) * 1.4 + bp(n, 600, 4000) * 0.6) * env(len(x), 0.6, 2.5) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.7 * x))

def wave_roar(d=6):  # приближающийся рёв волны
    x = t(d); k = x / d; n = noise(d)
    return ((lp(n, 200) * (1 - k) + lp(n, 1000) * k) * 1.2 + bp(n, 800, 3000) * k ** 2 * 0.6) * k ** 1.5 * env(len(x), 0.1, 0.1)

def cash(d=1.2):  # касса: звонок + выдвижной ящик
    x = t(d); bell = (np.sin(2 * np.pi * 2093 * x) + 0.6 * np.sin(2 * np.pi * 3136 * x)) * np.exp(-x * 6) * 0.6
    drawer = np.roll(bp(noise(d), 300, 3000) * np.exp(-x * 14) * 0.8, int(0.25 * SR))
    return bell + drawer

def clock(d=6):  # тиканье часов
    out = np.zeros(int(d * SR))
    for k in np.arange(0, d - 0.1, 0.5):
        n = bp(noise(0.02), 2000, 7000) * np.exp(-t(0.02) * 300) * (1 if int(k * 2) % 2 else 0.6); i = int(k * SR); out[i:i + len(n)] += n
    return out

def money_loop(d=32, bpm=104):  # фанк: бас, бочка, хэт, стабы — «деньги текут»
    out = np.zeros(int(d * SR)); beat = 60 / bpm
    bass = [55, 55, 82.4, 55, 73.4, 55, 98, 82.4]
    for k in range(int(d / beat * 2)):
        st = k * beat / 2; i = int(st * SR); ln = beat / 2 * 0.9
        x = t(ln); f0 = bass[k % 8]
        y = (np.sin(2 * np.pi * f0 * x) + 0.4 * np.sin(2 * np.pi * f0 * 2 * x)) * np.exp(-x * 4) * 0.6
        if k % 2 == 0: y = y + np.sin(2 * np.pi * (60 * np.exp(-x * 30) + 40) * x) * np.exp(-x * 18) * (1.0 if k % 4 == 0 else 0.5)
        y = y + bp(noise(ln), 6000, 12000) * np.exp(-x * 60) * 0.25
        if k % 8 == 4: y = y + bp(noise(ln), 1500, 6000) * np.exp(-x * 20) * 0.5
        if k % 16 in (3, 11):
            xs = t(ln); y = y + sum(np.sin(2 * np.pi * fr * xs) for fr in (523.3, 659.3, 784)) * np.exp(-xs * 9) * 0.18
        out[i:i + len(y)] += y[: len(out) - i]
    return out

def pop(d=0.8):
    x = t(d); return bp(noise(d), 800, 6000) * np.exp(-x * 40) + np.sin(2 * np.pi * 180 * x) * np.exp(-x * 30) * 0.6 + bp(noise(d), 3000, 9000) * np.exp(-(x - 0.1).clip(0) * 6) * 0.15 * (x > 0.1)

def heli(d=8):
    x = t(d); chop = (np.sin(2 * np.pi * 11 * x) > 0.6).astype(float)
    return lp(noise(d), 300) * (0.4 + chop) * env(len(x), 1.0, 1.5)

def flutter(d=4):
    out = np.zeros(int(d * SR))
    for k in range(120):
        ln = rng.uniform(0.03, 0.09); n = bp(noise(ln), 1500, 7000) * np.exp(-t(ln) * 50)
        i = int(rng.uniform(0, d - 0.1) * SR); out[i:i + len(n)] += n * rng.uniform(0.2, 1)
    return out

def gavel(d=1.5):
    x = t(d); return (np.sin(2 * np.pi * 220 * x) * 0.6 + bp(noise(d), 400, 3000)) * np.exp(-x * 25) + np.roll(np.sin(2 * np.pi * 180 * x) * np.exp(-x * 25), int(0.3 * SR)) * 0.6

def train_ride(d=20, speed=1.0):  # вагон на ходу: низкий гул + стыки рельсов «та-дам»
    x = t(d); out = lp(noise(d), 180) * 0.6 + np.sin(2 * np.pi * 48 * x) * 0.15
    per = 1.6 / speed
    for k in np.arange(0.2, d, per):
        for dt in (0.0, 0.16):
            ln = 0.25; n = (bp(noise(ln), 80, 900) + np.sin(2 * np.pi * 70 * t(ln))) * np.exp(-t(ln) * 18); i = int((k + dt) * SR)
            out[i:i + len(n)] += n[:len(out) - i] * 0.7
    return out * env(len(x), 0.5, 0.5)

def train_stop(d=6):  # торможение: замедление стыков + скрип колодок
    x = t(d); out = lp(noise(d), 200) * np.clip(1 - x / d, 0, 1) * 0.6
    sq = np.sin(2 * np.pi * (2400 + 300 * np.sin(2 * np.pi * 0.7 * x)) * x) * np.clip((x - 1.5) / 1.0, 0, 1) * np.clip((d - 0.5 - x) / 1.5, 0, 1) * 0.12
    k = 0.2; per = 0.9
    while k < d - 1.2:
        ln = 0.25; n = bp(noise(ln), 80, 900) * np.exp(-t(ln) * 18); i = int(k * SR); out[i:i + len(n)] += n * 0.6
        k += per; per *= 1.35
    return (out + sq) * env(len(x), 0.05, 0.6)

def door_hiss(d=2.2):  # пневматика дверей + стук створок
    x = t(d); h = bp(noise(d), 1500, 9000) * np.exp(-x * 2.5) * 0.7
    thud = np.zeros_like(x); i = int(1.2 * SR); n = (np.sin(2 * np.pi * 90 * t(0.4)) + bp(noise(0.4), 100, 1200)) * np.exp(-t(0.4) * 14)
    thud[i:i + len(n)] = n
    return h + thud

def train_depart(d=10):  # поезд трогается и уходит, звук затихает
    x = t(d); out = lp(noise(d), 220) * np.clip(x / 2, 0, 1) * np.exp(-np.clip(x - 3, 0, None) * 0.5) * 0.8
    k = 0.6; per = 1.6
    while k < d - 0.3:
        ln = 0.25; n = bp(noise(ln), 80, 900) * np.exp(-t(ln) * 18); i = int(k * SR)
        out[i:i + len(n)] += n[:len(out) - i] * 0.7 * np.exp(-max(0, k - 3) * 0.5)
        k += per; per = max(0.35, per * 0.8)
    return out * env(len(x), 0.3, 1.0)

def chime(d=2.4):  # «динь-дон» перед объявлением
    out = np.zeros(int(d * SR))
    for k, f in [(0.0, 659.3), (0.55, 523.3)]:
        n = (np.sin(2 * np.pi * f * t(1.6)) + 0.3 * np.sin(2 * np.pi * 2 * f * t(1.6))) * np.exp(-t(1.6) * 2.5); i = int(k * SR)
        out[i:i + len(n)] += n
    return out

def music_void(d=40):  # пустота: два низких тона в диссонансе, медленный «вдох»
    x = t(d)
    dr = np.sin(2 * np.pi * 36.7 * x) + 0.8 * np.sin(2 * np.pi * 38.9 * x) + 0.25 * np.sin(2 * np.pi * 146.8 * x + np.sin(2 * np.pi * 0.07 * x))
    air = bp(noise(d), 300, 1500) * (0.5 + 0.5 * np.sin(2 * np.pi * x / 6.5)) * 0.25
    hi = np.sin(2 * np.pi * 1244 * x) * 0.02 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * x))
    return (dr * 0.45 + air + hi) * env(len(x), 2.0, 2.0)

if __name__ == "__main__":
    import sys
    if sys.argv[1:] == ["el"]:
        for name, fn in [("train_ride", train_ride), ("train_stop", train_stop), ("door_hiss", door_hiss), ("train_depart", train_depart), ("chime", chime)]:
            save(f"public/sfx/{name}.wav", fn())
        save("public/music/m12_void.wav", music_void())
        sys.exit()
    if sys.argv[1:] == ["jb"]:
        for name, fn in [("pop", pop), ("heli", heli), ("flutter", flutter), ("gavel", gavel)]:
            save(f"public/sfx/{name}.wav", fn())
        save("public/music/m11_money.wav", money_loop())
        sys.exit()
    if sys.argv[1:] == ["bm"]:
        for name, fn in [("cash", cash), ("clock", clock)]:
            save(f"public/sfx/{name}.wav", fn())
        sys.exit()
    if sys.argv[1:] == ["dm"]:
        for name, fn in [("surf", surf), ("gulls", gulls), ("water_rush", water_rush), ("wave_roar", wave_roar)]:
            save(f"public/sfx/{name}.wav", fn())
        sys.exit()
    if sys.argv[1:] == ["tw4"]:
        for name, fn in [("hum", hum), ("ringtone", ringtone), ("silent_pass", silent_pass)]:
            save(f"public/sfx/{name}.wav", fn())
        sys.exit()
    if sys.argv[1:] == ["tw"]:  # только звуки «Трёх волн», старые файлы не трогаем
        for name, fn in TW:
            save(f"public/sfx/{name}.wav", fn())
        save("public/music/m09_sad.wav", music_sad())
        save("public/music/m10_run.wav", music_stairs(40, 124))
        sys.exit()
    for d in ("public/sfx", "public/music"): os.makedirs(os.path.join(ROOT, d), exist_ok=True)
    save("public/sfx/phone_alert.wav", phone_alert())
    save("public/sfx/siren_far.wav", siren(dist=0.7))
    save("public/sfx/siren_near.wav", siren(base=460, top=820, period=6.3, dist=0.25))
    save("public/sfx/whoosh.wav", whoosh())
    save("public/sfx/pencil.wav", pencil())
    save("public/sfx/chair.wav", chair())
    save("public/sfx/impact_low.wav", impact_low())
    save("public/sfx/ui_tick.wav", ui_tick())
    save("public/sfx/stinger.wav", stinger())
    save("public/sfx/tv_murmur.wav", tv_murmur())
    save("public/sfx/room_tone.wav", room_tone())
    save("public/sfx/night_city.wav", night_city())
    save("public/music/m01_night.wav", music_night())
    save("public/music/m02_dread.wav", music_dread())
    for name, fn in [("footsteps_crowd", lambda: footsteps(14, 3.0, 8)), ("footsteps_two", lambda: footsteps(14, 3.4, 2, 0.2)),
                     ("parrot", parrot), ("wings", wings), ("flicker", flicker), ("door_clank", door_clank),
                     ("knock", lambda: metal_hit(2.2, 82)), ("crowd", lambda: crowd(30, 10, 0.0)), ("cheer", cheer),
                     ("explosion", explosion), ("tinnitus", tinnitus), ("breathing", lambda: breathing(8, 0.4)),
                     ("breathing_fast", lambda: breathing(8, 0.75, 0.4)), ("heartbeat", heartbeat), ("vent", vent),
                     ("ping", ping), ("vibrate", vibrate), ("monitor_on", monitor_on), ("static", static), ("dust", dust),
                     ("phones_chorus", phones_chorus), ("riser", riser), ("siren_muffled", lambda: lp(siren(40, dist=0.9), 600))]:
        save(f"public/sfx/{name}.wav", fn())
    save("public/music/m03_stairs.wav", music_stairs())
    save("public/music/m04_shelter.wav", music_shelter())
    save("public/music/m05_relief.wav", music_relief())
    save("public/music/m06_double.wav", music_double())
    save("public/music/m07_stage.wav", music_stage())
    save("public/music/m01_night_long.wav", music_night(16))
    save("public/music/m02_dread_long.wav", music_dread(24))
    for name, fn in [("lock_click", lock_click), ("wheel_creak", lambda: creak(2.5, 210)), ("door_open", door_open),
                     ("page_flip", page_flip), ("recap_hit", recap_hit)]:
        save(f"public/sfx/{name}.wav", fn())
    save("public/music/m08_loop.wav", music_shelter(80) * 0.8 + music_double(80) * 0.6)
    sf.write(os.path.join(ROOT, "tools/ir_room.wav"), ir(0.5, 0.35, 5000).astype(np.float32), SR)
    sf.write(os.path.join(ROOT, "tools/ir_stairs.wav"), ir(1.4, 1.1, 4500).astype(np.float32), SR)
    sf.write(os.path.join(ROOT, "tools/ir_bunker.wav"), ir(2.2, 1.6, 3500).astype(np.float32), SR)
    print("done")
