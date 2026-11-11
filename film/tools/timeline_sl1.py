"""«5 приёмов распродаж» (11.11): python3 tools/timeline_sl1.py -> src/data/sl1.json"""
from narr import M, N, S, load, marks, save

load("sl1_narration.json")
M("start", 0)
N("sl1_01", 0.05, at=[("hook", None), ("five", "И пять")])
N("sl1_02", 0.35, at=[("t1", None), ("up", "Её бывает"), ("gift", "и минус")])
N("sl1_03", 0.35, at=[("t2", None), ("rush", "Спешка")])
N("sl1_04", 0.35, at=[("t3", None), ("socks", "И вот")])
N("sl1_05", 0.35, at=[("t4", None), ("ten", "пока их")])
N("sl1_06", 0.35, at=[("t5", None), ("cart", "Пришёл")])
N("sl1_07", 0.4, at=[("tip", None), ("sub", "Подпишись")])
M("end", 2.0)
m = marks
S("music/m11_money.wav", 0, -20, "music", fadeIn=0.2, length=m["end"], fadeOut=1.0, loop=True)
S("sfx/cash.wav", 0.05, -12)
for k in ["t1", "t2", "t3", "t4", "t5"]:
    S("sfx/whoosh.wav", m[k] - 0.2, -14)
S("sfx/stinger.wav", m["up"] + 0.5, -14)
S("sfx/clock.wav", m["t2"] + 0.5, -18, length=2.5, fadeOut=0.5)
S("sfx/pop.wav", m["socks"] + 0.5, -14)
S("sfx/ui_tick.wav", m["ten"] + 0.3, -12)
S("sfx/cash.wav", m["cart"] + 0.5, -14)
S("sfx/chime.wav", m["tip"], -14)
save("sl1")
