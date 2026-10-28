"""Сведение по таймлайну: python3 tools/mix.py src/data/sample.json

Пишет public/mix/<name>.wav (мастер) + стемы dialog/music/sfx/amb в stems/
и src/data/<name>.voice.json (длительности реплик и огибающие для липсинка).
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf

SR, FPS = 48000, 30
ROOT = os.path.join(os.path.dirname(__file__), "..")
IR = {}

def load(rel):
    x, sr = sf.read(os.path.join(ROOT, "public", rel), dtype="float32", always_2d=True)
    assert sr == SR, rel
    return x if x.shape[1] == 2 else np.repeat(x, 2, 1)

def reverb(x, space):
    if space not in IR:
        h, _ = sf.read(os.path.join(ROOT, "tools", f"ir_{space}.wav"), dtype="float32"); IR[space] = h
    h = IR[space]; n = len(x) + len(h); wet = {"room": 0.1, "bunker": 0.16, "stairs": 0.17}[space]
    y = np.stack([np.fft.irfft(np.fft.rfft(x[:, c], n) * np.fft.rfft(h, n), n) for c in range(2)], 1)
    y *= 0.5 * np.abs(x).max() / max(1e-9, np.abs(y).max())
    out = np.vstack([x, np.zeros((len(h), 2), np.float32)])
    return (out + wet * y).astype(np.float32)

def place(bus, x, start, gain=0, fadeIn=0, end=None, fadeOut=0, pan=0):
    x = x * 10 ** (gain / 20)
    if end is not None:
        x = x[: max(0, int((end - start) * SR))]
    x = x.copy()
    if fadeIn: k = min(len(x), int(fadeIn * SR)); x[:k] *= np.linspace(0, 1, k)[:, None]
    if fadeOut: k = min(len(x), int(fadeOut * SR)); x[-k:] *= np.linspace(1, 0, k)[:, None]
    if pan: x[:, 0] *= np.sqrt(1 - pan) / np.sqrt(1); x[:, 1] *= np.sqrt(1 + pan)
    i = int(start * SR); j = min(len(bus), i + len(x))
    bus[i:j] += x[: j - i]

def main(path):
    tl = json.load(open(path)); N = int(tl["duration"] * SR)
    buses = {b: np.zeros((N, 2), np.float32) for b in ("dialog", "music", "sfx", "amb")}
    meta = {}
    chars = {}  # отдельные дорожки персонажей
    for d in tl["dialogue"]:
        x = load(f"voice/{d['id']}.wav"); dur = len(x) / SR
        hop = SR // FPS; mono = x[:, 0]
        envl = [float(np.sqrt(np.mean(mono[k:k + hop] ** 2))) for k in range(0, len(mono), hop)]
        m = max(envl) or 1; meta[d["id"]] = {"duration": dur, "mouth": [round(min(1, v / m * 1.4), 3) for v in envl]}
        if d.get("space"): x = reverb(x, d["space"])
        place(buses["dialog"], x, d["start"], d.get("gain", 0), pan=d.get("pan", 0))
        who = d.get("who", "other")
        chars.setdefault(who, np.zeros((N, 2), np.float32))
        place(chars[who], x, d["start"], d.get("gain", 0), pan=d.get("pan", 0))
    for s in tl["sfx"]:
        if s["start"] >= tl["duration"]:
            continue
        x = load(s["file"])
        if s.get("space"): x = reverb(x, s["space"])
        place(buses[s.get("bus", "sfx")], x, s["start"], s.get("gain", 0), s.get("fadeIn", 0),
              s.get("end"), s.get("fadeOut", 0), s.get("pan", 0))
    # приглушение музыки и фона под диалог (сайдчейн, атака 60 мс, отпускание 400 мс)
    lvl = np.abs(buses["dialog"]).max(1); hop = 480
    blocks = np.array([lvl[k:k + hop].max() for k in range(0, N, hop)]) > 0.02
    g = np.where(blocks, 10 ** (-10 / 20), 1.0); sm = np.empty_like(g); s = 1.0
    for k, v in enumerate(g): s += (v - s) * (0.5 if v < s else 0.08); sm[k] = s
    duck = np.repeat(sm, hop)[:N, None]
    buses["music"] *= duck; buses["amb"] *= duck
    os.makedirs(os.path.join(ROOT, "public/mix"), exist_ok=True)
    name = tl["name"]
    for b, x in buses.items():
        sf.write(os.path.join(ROOT, f"stems/{name}_{b}.wav"), x, SR)
    os.makedirs(os.path.join(ROOT, "stems/characters"), exist_ok=True)
    for w, x in chars.items():
        sf.write(os.path.join(ROOT, f"stems/characters/{name}_{w}.wav"), x, SR)
    raw = os.path.join(ROOT, f"public/mix/{name}_raw.wav")
    sf.write(raw, sum(buses.values()), SR, subtype="FLOAT")
    # мастеринг: мягкая компрессия + громкость под мобильные платформы
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
                    "acompressor=threshold=-18dB:ratio=2.5:attack=10:release=200,"
                    "loudnorm=I=-15:TP=-1.5:LRA=11,alimiter=limit=0.89",
                    "-ar", str(SR), os.path.join(ROOT, f"public/mix/{name}.wav")], check=True)
    os.remove(raw)
    json.dump(meta, open(os.path.join(ROOT, f"src/data/{name}.voice.json"), "w"), ensure_ascii=False)
    print("mixed", name, {k: round(v["duration"], 2) for k, v in meta.items()})

if __name__ == "__main__":
    main(sys.argv[1])
