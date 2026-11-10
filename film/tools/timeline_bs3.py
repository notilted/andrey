"""«Без сигнала», часть 3 (финал): python3 tools/timeline_bs3.py -> src/data/bs3.json"""
from narr import B, M, N, S, load, marks, save

load("bs3_narration.json")
M("start", 0)
N("bs3_01", 0.05, at=[("hook", None), ("night", "Ночь")])
N("bs3_02", 0.3, at=[("gran", None), ("queue", "заряжаем"), ("table", "а еду")])
N("bs3_03", 0.3, at=[("cash", None), ("radio", "и старое")])
N("bs3_04", 0.3, at=[("news", None), ("morning", "свет дадут")])
N("bs3_05", 0.4, at=[("six", None), ("fridge", "Щёлкает"), ("lamp", "Загорается"), ("notif", "Телефон")])
N("bs3_06", 0.3, at=[("kit", None), ("k1", "наличные"), ("k2", "фонарик"), ("k3", "пауэрбанк"), ("k4", "воду"), ("k5", "и радио")])
N("bs3_07", 0.45, at=[("end", None), ("sub", "Подпишись")])
M("fin", 2.4)
m = marks
S("music/m01_night_long.wav", 0, -20, "music", fadeIn=0.3, length=m["news"], fadeOut=0.6)
S("sfx/impact_low.wav", 0.05, -10)
S("sfx/hum.wav", m["night"], -24, length=m["news"] - m["night"], fadeOut=0.5)
S("sfx/crowd.wav", m["gran"], -26, length=m["cash"] - m["gran"], fadeOut=0.5)
S("sfx/static.wav", m["radio"] + 0.6, -22, length=m["six"] - m["radio"] - 0.6, fadeOut=0.5)
S("music/m05_relief.wav", m["news"], -20, "music", fadeIn=0.6, length=m["kit"] - m["news"], fadeOut=0.5)
S("sfx/lock_click.wav", m["fridge"] + 0.2, -12)
S("sfx/monitor_on.wav", m["lamp"] + 0.3, -12)
S("sfx/phones_chorus.wav", m["notif"] + 0.5, -16, length=2.5, fadeOut=0.8)
for k in ["k1", "k2", "k3", "k4", "k5"]:
    S("sfx/pop.wav", m[k] + 0.2, -14)
S("music/m10_run.wav", m["end"], -18, "music", fadeIn=0.3, length=m["fin"] - m["end"], fadeOut=0.8)
S("sfx/chime.wav", m["end"] + 0.1, -13)
save("bs3")
