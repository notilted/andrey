"""«Не спать сутки»: python3 tools/timeline_ns1.py -> src/data/ns1.json"""
from narr import M, N, S, load, marks, save

load("ns1_narration.json")
M("start", 0)
N("ns1_01", 0.05, at=[("hook", None), ("drunk", "Спойлер")])
N("ns1_02", 0.4, at=[("h17", None)])
N("ns1_03", 0.4, at=[("h24", None), ("car", "За руль")])
N("ns1_04", 0.4, at=[("micro", None), ("blink", "микросон")])
N("ns1_05", 0.4, at=[("food", None)])
N("ns1_06", 0.4, at=[("sleep", None), ("nocoffee", "Не кофе")])
N("ns1_07", 0.5, at=[("sub", None)])
M("end", 2.0)
m = marks
S("music/m12_void.wav", 0, -21, "music", fadeIn=0.3, length=m["sleep"], fadeOut=0.6)
S("sfx/clock.wav", 0, -18, length=m["h24"] + 3, fadeOut=0.5)
S("sfx/stinger.wav", m["drunk"] + 0.5, -12)
S("sfx/whoosh.wav", m["h17"] - 0.2, -14); S("sfx/whoosh.wav", m["h24"] - 0.2, -14)
S("sfx/tinnitus.wav", m["blink"], -26, length=2.0, fadeOut=0.8)
S("sfx/pop.wav", m["food"] + 0.5, -14)
S("music/m05_relief.wav", m["sleep"], -20, "music", fadeIn=0.5, length=m["end"] - m["sleep"], fadeOut=1.0)
S("sfx/chime.wav", m["sub"], -14)
save("ns1")
