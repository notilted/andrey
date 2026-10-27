"""Субтитры SRT из таймлайна: python3 tools/srt.py -> ../output/17_minut.srt"""
import json, os, textwrap
import soundfile as sf

ROOT = os.path.join(os.path.dirname(__file__), "..")
tl = json.load(open(os.path.join(ROOT, "src", "data", "film.json")))


def ts(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


out = []
for i, d in enumerate(tl["dialogue"], 1):
    dur = sf.info(os.path.join(ROOT, "public", "voice", d["id"] + ".wav")).duration
    text = d["caption"].replace("*", "")
    lines = textwrap.wrap(text, 38)[:2]  # не больше двух строк
    out.append(f"{i}\n{ts(d['start'])} --> {ts(d['start'] + dur + 0.25)}\n{d['name']}: " + "\n".join(lines) + "\n")
os.makedirs(os.path.join(ROOT, "..", "output"), exist_ok=True)
open(os.path.join(ROOT, "..", "output", "17_minut.srt"), "w", encoding="utf-8").write("\n".join(out))
print(len(out), "subtitles")
