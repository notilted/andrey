"""Озвучка «17 минут».

Персонажи — XTTS-v2 (выразительный нейросетевой синтез, встроенные студийные голоса),
оповещения — Silero v5.6 (ровный официальный голос). На каждую реплику делается
несколько дублей; лучший выбирается автоматически: полное совпадение с текстом по
распознаванию (GigaAM) и длительность без «заиканий» и обрывов.

python3 tools/voice.py ../script/lines.json [--only id1,id2] [--takes 3]
Модели: $TTS_MODELS (по умолчанию ~/tts-models), см. README.
"""
import argparse, json, os, re, subprocess, sys, tempfile, warnings

warnings.filterwarnings("ignore")
os.environ.setdefault("COQUI_TOS_AGREED", "1")
import numpy as np, soundfile as sf, torch

sys.path.insert(0, os.path.dirname(__file__))
from asr import accuracy, norm, recognize  # noqa: E402

MODELS = os.environ.get("TTS_MODELS", os.path.expanduser("~/tts-models"))
ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "voice")
TAKES = os.path.join(ROOT, "public", "voice_takes")

# голос персонажа: движок, диктор, базовая скорость, «живость» (temperature), f0 — мягкая коррекция высоты
VOICES = {
    "mark":      dict(engine="xtts", speaker="Ludvig Milivoj", speed=1.0, temp=0.7),
    "double":    dict(engine="xtts", speaker="Ludvig Milivoj", speed=0.9, temp=0.55),
    "alisa":     dict(engine="xtts", speaker="Daisy Studious", speed=1.0, temp=0.75, f0=1.06),
    "galina":    dict(engine="xtts", speaker="Henriette Usha", speed=1.02, temp=0.8, f0=0.94),
    "lev":       dict(engine="xtts", speaker="Aaron Dreschner", speed=0.92, temp=0.6),
    "rescuer":   dict(engine="xtts", speaker="Baldur Sanjin", speed=0.95, temp=0.6),
    "announcer": dict(engine="silero", speaker="eugene", speed=1.0),
    # попугай Кеша повторяет фразу голосом Марка: выше по тону и тембру, «птичья» обработка
    "parrot":    dict(engine="xtts", speaker="Ludvig Milivoj", speed=1.05, temp=0.6, f0=1.75, formant=1.22),
}

# обработка «пространства» после синтеза
FX = {
    "loudspeaker": "highpass=f=320,lowpass=f=3600,equalizer=f=1600:t=q:w=0.8:g=6,"
                   "acompressor=threshold=-24dB:ratio=6:attack=2:release=60,acrusher=bits=10:mix=0.12,"
                   "aecho=0.8:0.55:70|160:0.3|0.18",
    "door": "lowpass=f=900,equalizer=f=220:t=q:w=1:g=4,aecho=0.7:0.5:18|35:0.35|0.2",
    "monitor": "highpass=f=450,lowpass=f=3200,acrusher=bits=8:mix=0.2,equalizer=f=1800:t=q:w=1:g=5",
    "whisper": "highpass=f=180,equalizer=f=5000:t=q:w=1:g=3",
    "parrot": "highpass=f=500,equalizer=f=2600:t=q:w=0.8:g=6,acrusher=bits=11:mix=0.15,"
              "vibrato=f=11:d=0.18",
}
EQ = {
    "mark": "equalizer=f=160:t=q:w=1:g=1.5,equalizer=f=3000:t=q:w=1:g=1.5,",
    "double": "equalizer=f=160:t=q:w=1:g=1.5,equalizer=f=3000:t=q:w=1:g=1.5,",
    "alisa": "equalizer=f=220:t=q:w=1:g=-2,equalizer=f=3800:t=q:w=1:g=1,",
    "galina": "equalizer=f=1700:t=q:w=1:g=1.5,",
    "lev": "equalizer=f=140:t=q:w=1:g=2,equalizer=f=6500:t=q:w=1:g=-1.5,",
}
BASE = ("afftdn=nr=8:nf=-45,highpass=f=70,deesser=i=0.35,"
        "acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150:makeup=1.5,loudnorm=I=-17:TP=-2:LRA=9")
TRIM = ("silenceremove=start_periods=1:start_threshold=-48dB,areverse,"
        "silenceremove=start_periods=1:start_threshold=-48dB,areverse,apad=pad_dur=0.06")

_xtts = None
_silero = None


def xtts():
    global _xtts
    if _xtts is None:
        from TTS.tts.configs.xtts_config import XttsConfig
        from TTS.tts.models.xtts import Xtts
        d = os.path.join(MODELS, "xtts_v2")
        cfg = XttsConfig(); cfg.load_json(os.path.join(d, "config.json"))
        m = Xtts.init_from_config(cfg); m.load_checkpoint(cfg, checkpoint_dir=d); m.eval()
        _xtts = m
    return _xtts


def silero():
    global _silero
    if _silero is None:
        p = os.path.join(MODELS, "silero_v5_6_ru.pt")
        _silero = torch.package.PackageImporter(p).load_pickle("tts_models", "model")
    return _silero


def synth(line, v, seed):
    text = line.get("say", line["text"])
    speed = line.get("speed", 1.0) * v.get("speed", 1.0)
    if v["engine"] == "xtts":
        torch.manual_seed(seed)
        m = xtts(); s = m.speaker_manager.speakers[v["speaker"]]
        o = m.inference(text, "ru", s["gpt_cond_latent"], s["speaker_embedding"],
                        temperature=line.get("temp", v["temp"]), speed=speed,
                        repetition_penalty=5.0, enable_text_splitting=True)
        return np.asarray(o["wav"], np.float32), 24000
    rate = "medium" if speed == 1 else ("slow" if speed < 1 else "fast")
    body = text.replace("...", '<break time="400ms"/>')
    ssml = f'<speak><prosody rate="{rate}">{body}</prosody></speak>'
    a = silero().apply_tts(ssml_text=ssml, speaker=v["speaker"], sample_rate=48000)
    return a.numpy().astype(np.float32), 48000


def cut_tail(x, sr):
    """Убирает короткий всплеск-артефакт после паузы в конце фразы (типичный дефект XTTS)."""
    hop = int(0.01 * sr)
    e = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    if not len(e):
        return x
    thr = e.max() * 0.04
    loud = e > thr
    idx = np.where(loud)[0]
    if not len(idx):
        return x
    end = idx[-1]
    # ищем последнюю паузу ≥150 мс, после которой звучит меньше 350 мс
    i = end
    while i > 0 and loud[i]:
        i -= 1
    j = i
    while j > 0 and not loud[j]:
        j -= 1
    if (i - j) >= 15 and (end - i) <= 35 and j > 0:
        return x[: (j + 3) * hop] * 1.0
    return x


def shift_f0(x, sr, k, formant=1.0):
    """Коррекция высоты голоса без изменения темпа (WORLD); formant — сдвиг тембра."""
    import pyworld as pw
    x64 = x.astype(np.float64)
    f0, t = pw.harvest(x64, sr, f0_floor=60, f0_ceil=700, frame_period=5)
    sp = pw.cheaptrick(x64, f0, t, sr); ap = pw.d4c(x64, f0, t, sr)
    if formant != 1.0:
        n = sp.shape[1]; src = np.clip(np.arange(n) / formant, 0, n - 1)
        sp = np.stack([np.interp(src, np.arange(n), row) for row in sp])
    return pw.synthesize(f0 * k, sp, ap, sr, frame_period=5).astype(np.float32)


def ffmpeg(src, dst, chain):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", chain, "-ar", "48000", "-ac", "1", dst], check=True)


def render(line, ntakes):
    v = VOICES[line["voice"]]
    text = line["text"]
    takes = []
    os.makedirs(TAKES, exist_ok=True)
    said = line.get("say", text)
    # ожидаемая длительность: ~13 букв в секунду с поправкой на скорость и паузы «...»
    expected = (len(re.sub(r"[^а-яёА-ЯЁ]", "", said)) / 13.0 + 0.45 * said.count("...") + 0.3) / (line.get("speed", 1) * v.get("speed", 1))
    n = ntakes + (3 if len(said) < 25 else 0)
    for k in range(n if v["engine"] == "xtts" else 1):
        x, sr = synth(line, v, seed=1000 + k * 17 + len(text))
        if v["engine"] == "xtts":
            x = cut_tail(x, sr)
        hyp = recognize(x, sr)
        acc = accuracy(said, hyp)
        extra = max(0, len(norm(hyp)) - len(norm(said)))  # лишние «слова» = артефакты/галлюцинации
        dur = len(x) / sr
        hw, rw = norm(hyp), norm(said)
        tail = 0.0 if hw and rw and hw[-1] == rw[-1] else 0.5  # хвост-галлюцинация после последнего слова
        q = -tail + acc - 0.3 * extra - max(0.0, dur / expected - 1.45) - max(0.0, 0.7 - dur / expected)
        p = os.path.join(TAKES, f"{line['id']}__t{k}.wav"); sf.write(p, x, sr)
        takes.append(dict(path=p, acc=acc, dur=dur, hyp=hyp, sr=sr, q=q))
        if v["engine"] == "xtts" and q >= 0.999 and k >= 1:
            break
    best = max(takes, key=lambda t: t["q"])
    x, sr = sf.read(best["path"], dtype="float32")
    if v.get("f0") and v["f0"] != 1.0:
        x = shift_f0(x, sr, v["f0"], v.get("formant", 1.0))
    with tempfile.TemporaryDirectory() as td:
        raw = os.path.join(td, "raw.wav"); sf.write(raw, x, sr)
        chain = EQ.get(line["voice"], "") + BASE
        if line.get("fx"):
            chain += "," + FX[line["fx"]]
            if line["fx"] in ("door", "monitor", "loudspeaker", "parrot"):
                chain += ",loudnorm=I=-19:TP=-2"
        chain += "," + TRIM
        ffmpeg(raw, os.path.join(OUT, line["id"] + ".wav"), chain)
    return best


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("lines"); ap.add_argument("--only"); ap.add_argument("--takes", type=int, default=3)
    a = ap.parse_args()
    torch.set_num_threads(4)
    lines = json.load(open(a.lines))
    only = set(a.only.split(",")) if a.only else None
    os.makedirs(OUT, exist_ok=True)
    report = {}
    for l in lines:
        if only and l["id"] not in only:
            continue
        b = render(l, a.takes)
        report[l["id"]] = {k: b[k] for k in ("acc", "dur", "hyp", "q")}
        print(f"{'OK ' if b['q'] >= 0.85 else 'BAD'} q={b['q']:.2f} {b['acc']:4.0%} {b['dur']:4.1f}s {l['id']:16} | {b['hyp']}", flush=True)
    rp = os.path.join(ROOT, "public", "voice", "_report.json")
    old = json.load(open(rp)) if os.path.exists(rp) else {}
    old.update(report); json.dump(old, open(rp, "w"), ensure_ascii=False, indent=1)
