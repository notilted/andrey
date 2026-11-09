"""«Без сигнала», часть 2: python3 tools/timeline_bs2.py -> src/data/bs2.json"""
from narr import B, M, N, S, load, marks, save

load("bs2_narration.json")

M("start", 0)
N("bs2_01", 0.05, at=[("hook", None), ("city", "Прошло")])
N("bs2_02", 0.3, at=[("shop", None), ("term", "Касса"), ("cash", "На двери")])
N("bs2_03", 0.3, at=[("zero", None), ("atm", "Банкомат")])
N("bs2_04", 0.3, at=[("tap", None), ("pump", "Насосам")])
N("bs2_05", 0.3, at=[("fridge", None), ("phone", "Телефон"), ("nonews", "Новостей")])
N("bs2_06", 0.35, at=[("yard", None), ("gen", "у меня"), ("short", "но бензина")])
N("bs2_07", 0.45, at=[("next", None), ("sub", "Подпишись")])
M("end", 2.4)

m = marks
S("music/m13_quarantine.wav", 0, -20, "music", fadeIn=0.2, length=m["tap"], fadeOut=0.5)
S("sfx/impact_low.wav", 0.05, -10)
S("sfx/wind_ash.wav", m["city"], -24, length=m["shop"] - m["city"], fadeOut=0.4)
S("sfx/door_open.wav", m["shop"] + 0.2, -14)
S("sfx/ui_tick.wav", m["term"] + 0.6, -12)
S("sfx/ui_tick.wav", m["term"] + 1.2, -12)
S("sfx/stinger.wav", m["cash"] + 0.4, -13)
S("sfx/lock_click.wav", m["atm"] + 0.5, -12)
S("music/m02_dread_long.wav", m["tap"], -20, "music", fadeIn=0.5, length=m["yard"] - m["tap"], fadeOut=0.5)
S("sfx/water_rush.wav", m["tap"], -28, length=1.6, fadeOut=1.2)
S("sfx/vibrate.wav", m["phone"] + 0.3, -16)
S("sfx/room_tone.wav", m["fridge"], -26, "amb", length=m["yard"] - m["fridge"], fadeOut=0.4, loop=True)
S("sfx/crowd.wav", m["yard"], -24, length=m["next"] - m["yard"], fadeOut=0.6)
S("sfx/impact_low.wav", m["short"] + 0.8, -11)
S("music/m10_run.wav", m["next"], -18, "music", fadeIn=0.3, length=m["end"] - m["next"], fadeOut=0.8)
S("sfx/riser.wav", m["sub"] - 1.0, -16)

save("bs2")
