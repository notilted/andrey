"""«Бабушкины 2 миллиона», сезон 2, финал: python3 tools/timeline_bn3.py -> src/data/bn3.json"""
from narr import M, N, S, load, marks, save

load("bn3_narration.json")
M("start", 0)
N("bn3_01", 0.05, at=[("hook", None), ("stolen", "Тетрадь")])
N("bn3_02", 0.35, at=[("hands", None), ("i1", "кефир"), ("i2", "зиру"), ("i3", "чеснок"), ("i4", "гранатовый"), ("year", "Ты делал")])
N("bn3_03", 0.35, at=[("inyou", None), ("you", "Он был")])
N("bn3_04", 0.45, at=[("rival", None), ("zero", "И очередь")])
N("bn3_05", 0.35, at=[("why", None), ("court", "А в суде"), ("annul", "и знак")])
N("bn3_06", 0.5, at=[("parcel", None), ("book", "Внутри"), ("note", "И записка")])
N("bn3_07", 0.5, at=[("end", None), ("sub", "Подпишись")])
M("fin", 2.3)
m = marks
S("music/m09_sad.wav", 0, -20, "music", fadeIn=0.3, length=m["hands"], fadeOut=0.5)
S("sfx/impact_low.wav", 0.05, -10)
for k in ["i1", "i2", "i3", "i4"]:
    S("sfx/pop.wav", m[k] + 0.1, -14)
S("music/m05_relief.wav", m["hands"], -20, "music", fadeIn=0.6, length=m["rival"] - m["hands"], fadeOut=0.5)
S("sfx/chime.wav", m["you"] + 0.3, -13)
S("music/m11_money.wav", m["rival"], -20, "music", fadeIn=0.3, length=m["parcel"] - m["rival"], fadeOut=0.5)
S("sfx/wind_ash.wav", m["zero"], -24, length=2.0, fadeOut=0.6)
S("sfx/gavel.wav", m["annul"] + 0.5, -10)
S("sfx/knock.wav", m["parcel"] + 0.2, -14)
S("sfx/page_flip.wav", m["book"] + 0.4, -13)
S("music/m09_sad.wav", m["parcel"], -21, "music", fadeIn=0.6, length=m["end"] - m["parcel"], fadeOut=0.5)
S("music/m10_run.wav", m["end"], -18, "music", fadeIn=0.3, length=m["fin"] - m["end"], fadeOut=0.8)
save("bn3")
