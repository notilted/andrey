"""Субтитры SRT из таймлайна: python3 tools/srt.py [имя таймлайна] [файл] -> ../output/17_minut.srt"""
import json, os, sys, textwrap
import soundfile as sf

ROOT = os.path.join(os.path.dirname(__file__), "..")
NAME = sys.argv[1] if len(sys.argv) > 1 else "film"
OUT = sys.argv[2] if len(sys.argv) > 2 else "17_minut.srt"
tl = json.load(open(os.path.join(ROOT, "src", "data", NAME + ".json")))


def ts(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


out = []
for d in tl["dialogue"]:
    dur = sf.info(os.path.join(ROOT, "public", "voice", d["id"] + ".wav")).duration
    text = d["caption"].replace("*", "")
    lines = textwrap.wrap(text, 38)
    if d["name"]:  # реплика персонажа: одна карточка, не больше двух строк
        out.append((d["start"], d["start"] + dur + 0.25, f"{d['name']}: " + "\n".join(lines[:2])))
        continue
    # рассказчик: длинный кусок делится на карточки по две строки, время — по доле символов
    chunks = ["\n".join(lines[i:i + 2]) for i in range(0, len(lines), 2)]
    total = sum(len(c) for c in chunks); t = d["start"]
    for c in chunks:
        dt = dur * len(c) / total
        out.append((t, t + dt + (0.25 if c is chunks[-1] else 0), c)); t += dt
out = [f"{i}\n{ts(a)} --> {ts(b)}\n{c}\n" for i, (a, b, c) in enumerate(out, 1)]
os.makedirs(os.path.join(ROOT, "..", "output"), exist_ok=True)
open(os.path.join(ROOT, "..", "output", OUT), "w", encoding="utf-8").write("\n".join(out))
print(len(out), "subtitles")
