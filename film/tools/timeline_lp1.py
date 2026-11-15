"""«Потерял телефон: 4 шага»: python3 tools/timeline_lp1.py -> src/data/lp1.json"""
from narr import M, N, S, load, marks, save

load("lp1_narration.json")
M("start", 0)
N("lp1_01", 0.05, at=[("hook", None), ("four", "Четыре")])
N("lp1_02", 0.4, at=[("r1", None)])
N("lp1_03", 0.4, at=[("r2", None)])
N("lp1_04", 0.4, at=[("r3", None)])
N("lp1_05", 0.4, at=[("r4", None)])
N("lp1_06", 0.5, at=[("imei", None), ("sub", "Подпишись")])
M("end", 2.0)
m = marks
S("sfx/vibrate.wav", 0.05, -12)
S("music/m11_money.wav", 0, -21, "music", fadeIn=0.3, length=m["end"], fadeOut=1.0, loop=True)
for k in ["r1", "r2", "r3", "r4"]:
    S("sfx/whoosh.wav", m[k] - 0.2, -14)
S("sfx/ringtone.wav", m["r1"] + 1.0, -20, length=1.5, fadeOut=0.4)
S("sfx/lock_click.wav", m["r3"] + 1.5, -12)
S("sfx/chime.wav", m["imei"], -14)
save("lp1")
