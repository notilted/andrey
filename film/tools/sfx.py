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

if __name__ == "__main__":
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
    sf.write(os.path.join(ROOT, "tools/ir_room.wav"), ir(0.5, 0.35, 5000).astype(np.float32), SR)
    sf.write(os.path.join(ROOT, "tools/ir_bunker.wav"), ir(2.2, 1.6, 3500).astype(np.float32), SR)
    print("done")
