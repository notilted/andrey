"""«Нет завещания»: python3 tools/timeline_nz1.py -> src/data/nz1.json"""
from narr import B, M, N, S, load, marks, save

load("nz1_narration.json")

M("start", 0)
N("nz1_01", 0.05, at=[("hook", None), ("flat", "квартира")])
N("nz1_02", 0.3, at=[("law", None), ("q1", "Первая"), ("equal", "Они делят")])
N("nz1_03", 0.3, at=[("q2", None), ("q2list", "братья")])
N("nz1_04", 0.3, at=[("couple", None), ("nope", "по закону")])
N("nz1_05", 0.3, at=[("term", None), ("six", "шесть"), ("court", "Пропустил")])
N("nz1_06", 0.3, at=[("state", None), ("gov", "государству")])
N("nz1_07", 0.45, at=[("sub", None), ("tonight", "А в семь")])
M("end", 2.2)

m = marks
S("music/m11_money.wav", 0, -20, "music", fadeIn=0.2, length=m["couple"], fadeOut=0.5)
S("sfx/impact_low.wav", 0.05, -10)
S("sfx/gavel.wav", m["law"] + 0.2, -12)
S("sfx/pop.wav", m["q1"] + 0.3, -14)
S("sfx/cash.wav", m["equal"] + 0.4, -14)
S("sfx/pop.wav", m["q2"] + 0.3, -14)
S("sfx/stinger.wav", m["nope"] + 0.6, -12)
S("music/m02_dread.wav", m["couple"], -22, "music", fadeIn=0.4, length=m["state"] - m["couple"], fadeOut=0.4)
S("sfx/clock.wav", m["six"], -18, length=m["court"] - m["six"] + 1.0, fadeOut=0.4)
S("sfx/gavel.wav", m["court"] + 1.2, -12)
S("sfx/big_impact.wav", m["gov"], -10)
S("music/m10_run.wav", m["sub"], -19, "music", fadeIn=0.3, length=m["end"] - m["sub"], fadeOut=0.8)
S("sfx/riser.wav", m["tonight"] - 1.0, -17)

save("nz1")
