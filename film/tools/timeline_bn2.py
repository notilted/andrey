"""«Бабушкины 2 миллиона», сезон 2, часть 2: python3 tools/timeline_bn2.py -> src/data/bn2.json"""
from narr import M, N, S, load, marks, save

load("bn2_narration.json")
M("start", 0)
N("bn2_01", 0.05, at=[("hook", None), ("law", "Юрист"), ("first", "знак")])
N("bn2_02", 0.35, at=[("paths", None), ("p1", "Сменить"), ("p2", "Или")])
N("bn2_03", 0.3, at=[("ev", None), ("e1", "чеки"), ("e2", "договоры"), ("e3", "фото")])
N("bn2_04", 0.35, at=[("rem", None), ("vid", "Миллион"), ("sign", "А на заднем"), ("date", "и дата")])
N("bn2_05", 0.4, at=[("relief", None), ("night", "Ночью"), ("door", "и видишь")])
N("bn2_06", 0.5, at=[("gone", None), ("book", "Пропало")])
N("bn2_07", 0.5, at=[("next", None), ("sub", "Подпишись")])
M("end", 2.3)
m = marks
S("music/m02_dread.wav", 0, -21, "music", fadeIn=0.2, length=m["rem"], fadeOut=0.5)
S("sfx/impact_low.wav", 0.05, -10)
S("sfx/page_flip.wav", m["law"] + 0.3, -14)
S("sfx/pop.wav", m["p1"] + 0.2, -14); S("sfx/pop.wav", m["p2"] + 0.2, -14)
for k in ["e1", "e2", "e3"]:
    S("sfx/ui_tick.wav", m[k] + 0.2, -12)
S("music/m05_relief.wav", m["rem"], -20, "music", fadeIn=0.4, length=m["night"] - m["rem"], fadeOut=0.5)
S("sfx/ping.wav", m["date"] + 0.4, -12)
S("sfx/night_city.wav", m["night"], -24, length=m["next"] - m["night"], fadeOut=0.5)
S("sfx/door_open.wav", m["door"] + 0.4, -12)
S("music/m01_night_long.wav", m["door"], -19, "music", fadeIn=0.3, length=m["next"] - m["door"], fadeOut=0.5)
S("sfx/stinger.wav", m["book"] + 0.6, -10)
S("music/m10_run.wav", m["next"], -18, "music", fadeIn=0.3, length=m["end"] - m["next"], fadeOut=0.8)
S("sfx/riser.wav", m["sub"] - 1.0, -16)
save("bn2")
