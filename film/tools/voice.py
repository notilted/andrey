"""Озвучка «17 минут»: нейросетевой синтез Piper (VITS) + обработка тембров (WORLD).

python3 tools/voice.py ../script/lines.json [--only id1,id2]
Модели ищутся в $TTS_MODELS (см. README).
"""
import json, os, re, subprocess, sys, tempfile
import numpy as np, soundfile as sf, pyworld as pw
from piper import PiperVoice, SynthesisConfig

MODELS = os.environ.get("TTS_MODELS", os.path.expanduser("~/tts-models"))
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "voice")

VOICES = {  # базовая модель + тембральная обработка персонажа
    "mark":     dict(model="dmitri", f0=0.94, formant=0.97, speed=1.0),
    "alisa":    dict(model="irina",  f0=1.42, formant=1.13, speed=1.0),
    "galina":   dict(model="irina",  f0=0.90, formant=0.96, speed=0.97, tremor=0.018),
    "lev":      dict(model="ruslan", f0=0.97, formant=1.0,  speed=0.88),
    "double":   dict(model="dmitri", f0=0.94, formant=0.97, speed=0.92),
    "announcer":dict(model="denis",  f0=1.0,  formant=1.0,  speed=0.95),
}
_tts = {}

def engine(name):
    if name not in _tts:
        d = os.path.join(MODELS, f"vits-piper-ru_RU-{name}-medium")
        _tts[name] = PiperVoice.load(f"{d}/ru_RU-{name}-medium.onnx",
                                     config_path=f"{d}/ru_RU-{name}-medium.onnx.json")
    return _tts[name]

def synth(voice, text, speed):
    cfg = SynthesisConfig(length_scale=1.0 / speed, noise_scale=0.6, noise_w_scale=0.75)
    chunks = list(voice.synthesize(text, syn_config=cfg))
    gap = np.zeros(int(0.12 * voice.config.sample_rate), np.float32)  # пауза между предложениями
    parts = []
    for c in chunks:
        parts += [c.audio_float_array, gap]
    return np.concatenate(parts[:-1]), voice.config.sample_rate

def stretch_gaps(x, sr, idx, dur, nmarks):
    hop = int(0.01 * sr)
    e = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    quiet = e < max(e) * 0.03
    gaps, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            if j - i >= 6 and i > 0 and j < len(quiet):
                gaps.append((i, j))
            i = j
        else:
            i += 1
    # паузы на знаках препинания — самые длинные; короткие — смычки согласных
    gaps = sorted(sorted(gaps, key=lambda g: g[0] - g[1])[:nmarks])
    out, last = [], 0
    for k in idx:
        if k < len(gaps):
            g0, g1 = gaps[k]; mid = (g0 + g1) // 2 * hop
            add = max(0, int(dur * sr) - (g1 - g0) * hop)
            out += [x[last:mid], np.zeros(add, np.float32)]; last = mid
    out.append(x[last:])
    return np.concatenate(out)

def warp_env(sp, k):
    """Сдвиг формант: растяжение спектральной огибающей по частоте."""
    n = sp.shape[1]; src = np.clip(np.arange(n) / k, 0, n - 1)
    return np.stack([np.interp(src, np.arange(n), row) for row in sp])

def reshape(x, sr, f0k, fk, tremor=0.0, intonation=1.0):
    x = x.astype(np.float64)
    f0, t = pw.harvest(x, sr, f0_floor=60, f0_ceil=700, frame_period=5)
    sp = pw.cheaptrick(x, f0, t, sr); ap = pw.d4c(x, f0, t, sr)
    voiced = f0 > 0
    if voiced.any() and intonation != 1.0:  # расширение/сужение мелодики
        m = np.exp(np.mean(np.log(f0[voiced])))
        f0[voiced] = m * (f0[voiced] / m) ** intonation
    f0 = f0 * f0k
    if tremor:
        f0 *= 1 + tremor * np.sin(2 * np.pi * 5.5 * t)
    if fk != 1.0:
        sp = warp_env(sp, fk)
    return pw.synthesize(f0, sp, ap, sr, frame_period=5).astype(np.float32)

def post(src, dst, chain):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", chain, "-ar", "48000", "-ac", "1", dst], check=True)

BASE = ("highpass=f=70,deesser=i=0.4,"
        "acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,"
        "loudnorm=I=-17:TP=-2:LRA=7")
EQ = {
    "mark": "equalizer=f=180:t=q:w=1:g=2,equalizer=f=3200:t=q:w=1:g=2,",
    "double": "equalizer=f=180:t=q:w=1:g=2,equalizer=f=3200:t=q:w=1:g=2,",
    "alisa": "equalizer=f=250:t=q:w=1:g=-2,equalizer=f=4000:t=q:w=1:g=1.5,",
    "galina": "equalizer=f=1800:t=q:w=1:g=2,",
    "lev": "equalizer=f=150:t=q:w=1:g=2.5,equalizer=f=6000:t=q:w=1:g=-2,",
    "announcer": "highpass=f=300,lowpass=f=3800,equalizer=f=1500:t=q:w=0.7:g=5,"
                 "acrusher=bits=12:mix=0.15,aecho=0.8:0.6:60|130:0.25|0.15,",
}

def render(line):
    v = VOICES[line["voice"]]
    tts = engine(v["model"])
    speed = line.get("speed", 1.0) * v["speed"]
    # «...» = живая пауза: фраза синтезируется целиком, затем естественная пауза
    # на этом знаке удлиняется до line["pause"] секунд
    text = line["text"]
    x, sr = synth(tts, text.replace("...", ","), speed)
    marks = re.findall(r"\.\.\.|[,.!?;:—]", text.rstrip(".!? "))
    stretch = [i for i, m in enumerate(marks) if m == "..."]
    if stretch:
        x = stretch_gaps(x, sr, stretch, line.get("pause", 0.45), len(marks))
    x = reshape(x, sr, v["f0"] * line.get("pitch", 1.0), v["formant"], v.get("tremor", 0),
                line.get("intonation", 1.0))
    with tempfile.TemporaryDirectory() as td:
        raw = os.path.join(td, "raw.wav"); sf.write(raw, x, sr)
        chain = EQ.get(line["voice"], "") + BASE
        if line.get("fx"):
            chain += "," + line["fx"]
        chain += ",silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,apad=pad_dur=0.05"
        post(raw, os.path.join(OUT, line["id"] + ".wav"), chain)

if __name__ == "__main__":
    lines = json.load(open(sys.argv[1]))
    only = set(sys.argv[3].split(",")) if len(sys.argv) > 3 and sys.argv[2] == "--only" else None
    os.makedirs(OUT, exist_ok=True)
    for l in lines:
        if only and l["id"] not in only:
            continue
        render(l); print("ok", l["id"])
