"""«Застрял в лифте: 5 правил»: python3 tools/timeline_lf1.py -> src/data/lf1.json"""
from narr import M, N, S, load, marks, save

load("lf1_narration.json")
M("start", 0)
N("lf1_01", 0.05, at=[("hook", None), ("five", "Пять")])
N("lf1_02", 0.4, at=[("r1", None)])
N("lf1_03", 0.4, at=[("r2", None)])
N("lf1_04", 0.4, at=[("r3", None), ("free", "С мобильного")])
N("lf1_05", 0.4, at=[("r4", None)])
N("lf1_06", 0.4, at=[("r5", None)])
N("lf1_07", 0.5, at=[("sub", None)])
M("end", 2.0)
m = marks
S("sfx/door_clank.wav", 0.05, -9)
S("sfx/flicker.wav", 0.4, -14)
S("music/m02_dread.wav", 0, -21, "music", fadeIn=0.3, length=m["end"], fadeOut=1.0, loop=True)
for k in ["r1", "r2", "r3", "r4", "r5"]:
    S("sfx/whoosh.wav", m[k] - 0.2, -14)
S("sfx/ui_tick.wav", m["r2"] + 2.0, -10)
S("sfx/ringtone.wav", m["r3"] + 1.2, -20, length=1.6, fadeOut=0.4)
S("sfx/chime.wav", m["sub"], -14)
save("lf1")
