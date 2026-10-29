"""Озвучка рассказчика через ElevenLabs.

python3 tools/voice_el.py ../script/ep2_narration.json [--only n01,n05] [--force]

Ключ: переменная окружения ELEVENLABS_API_KEY или файл, указанный в ELEVENLABS_KEY_FILE.
Уже озвученные куски с тем же текстом не перезаписываются (кэш по хэшу текста), чтобы не тратить лимит.
Соседние куски передаются как previous_text/next_text — интонация между ними связная.
"""
import argparse, hashlib, json, os, subprocess, sys, tempfile, urllib.request

sys.path.insert(0, os.path.dirname(__file__))
from asr import accuracy, recognize  # noqa: E402
import soundfile as sf  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "voice")
VOICE_ID = os.environ.get("EL_VOICE", "pNInz6obpgDQGcFmaJgB")  # по умолчанию Adam — низкий, твёрдый голос рассказчика
MODEL = "eleven_v4"
SETTINGS = {"stability": 0.45, "similarity_boost": 0.8, "style": 0.3, "use_speaker_boost": True}
if os.environ.get("EL_LIVELY"):  # живая разговорная подача (стиль «от первого лица»)
    SETTINGS = {"stability": 0.3, "similarity_boost": 0.8, "style": 0.6, "use_speaker_boost": True, "speed": 1.08}
# обработка «как в референсе»: плотный, близкий, громкий голос
CHAIN = ("highpass=f=60,equalizer=f=120:t=q:w=1:g=2,deesser=i=0.3,"
         "acompressor=threshold=-24dB:ratio=3.5:attack=5:release=120:makeup=2,loudnorm=I=-16:TP=-1.5:LRA=5,"
         "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,apad=pad_dur=0.05")


def key():
    k = os.environ.get("ELEVENLABS_API_KEY")
    if not k and os.environ.get("ELEVENLABS_KEY_FILE"):
        k = open(os.environ["ELEVENLABS_KEY_FILE"]).read().strip()
    if not k:
        sys.exit("нет ключа ElevenLabs: задайте ELEVENLABS_API_KEY")
    return k


def clean(t):
    return t.replace("*", "")


def tts(text, prev, nxt):
    body = {"text": text, "model_id": MODEL, "language_code": "ru", "voice_settings": SETTINGS}
    if prev:
        body["previous_text"] = prev
    if nxt:
        body["next_text"] = nxt
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), method="POST",
        headers={"xi-api-key": key(), "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=180) as r:
        return r.read()


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("script"); ap.add_argument("--only"); ap.add_argument("--force", action="store_true")
    a = ap.parse_args()
    segs = json.load(open(a.script))
    only = set(a.only.split(",")) if a.only else None
    os.makedirs(OUT, exist_ok=True)
    cache_p = os.path.join(OUT, "_elevenlabs_cache.json")
    cache = json.load(open(cache_p)) if os.path.exists(cache_p) else {}
    spent = 0
    for i, s in enumerate(segs):
        if only and s["id"] not in only:
            continue
        text = clean(s["text"])
        h = hashlib.sha1((VOICE_ID + MODEL + json.dumps(SETTINGS) + text).encode()).hexdigest()
        dst = os.path.join(OUT, s["id"] + ".wav")
        if not a.force and cache.get(s["id"]) == h and os.path.exists(dst):
            print("кэш", s["id"]); continue
        prev = clean(segs[i - 1]["text"]) if i > 0 else None
        nxt = clean(segs[i + 1]["text"]) if i + 1 < len(segs) else None
        mp3 = tts(text, prev, nxt); spent += len(text)
        with tempfile.TemporaryDirectory() as td:
            src = os.path.join(td, "a.mp3"); open(src, "wb").write(mp3)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", CHAIN, "-ar", "48000", "-ac", "1", dst], check=True)
        x, sr = sf.read(dst, dtype="float32")
        acc = accuracy(text, recognize(x, sr))
        cache[s["id"]] = h
        json.dump(cache, open(cache_p, "w"), indent=1)
        print(f"{'OK ' if acc >= 0.85 else 'LOW'} {acc:4.0%} {len(x) / sr:5.1f}s {s['id']}", flush=True)
    print("потрачено символов:", spent)
