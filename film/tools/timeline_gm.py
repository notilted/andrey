"""Шпаргалка «Четырёхугольники»: python3 tools/timeline_gm.py -> src/data/gm.json"""
import json, os
from narr import M, N, S, load, marks, save

load("gm_narration.json")
ids = [s["id"] for s in json.load(open(os.path.join(os.path.dirname(__file__), "..", "..", "script", "gm_narration.json")))]
M("start", 0)
for k, i in enumerate(ids):
    N(i, 0.05 if k == 0 else 0.7)
M("end", 1.5)
m = marks
S("music/m08_loop.wav", 0, -26, "music", length=m["end"], fadeIn=0.5, fadeOut=1.0, loop=True)
for k, i in enumerate(ids):
    S("sfx/whoosh.wav" if k else "sfx/impact_low.wav", max(0, m[i] - 0.25), -18)
S("sfx/chime.wav", m["gm12"], -14)
save("gm")
