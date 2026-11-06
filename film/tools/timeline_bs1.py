"""«Без сигнала», часть 1: python3 tools/timeline_bs1.py -> src/data/bs1.json"""
from narr import B, M, N, S, load, marks, save

load("bs1_narration.json")

M("start", 0)
N("bs1_01", 0.05, at=[("hook", None), ("y1859", "А теперь")])
N("bs1_02", 0.25, at=[("real", None), ("cme", "Солнце"), ("tele", "и телеграф"), ("spark", "Провода")])
N("bs1_03", 0.25, at=[("aurora", None)])
N("bs1_04", 0.25, at=[("now", None)])
N("bs1_05", 0.3, at=[("wake", None), ("nonet", "Телефон"), ("nolight", "Свет")])
N("bs1_06", 0.3, at=[("quebec", None), ("people", "Шесть")])
N("bs1_07", 0.3, at=[("ours", None), ("silence", "И первое")])
N("bs1_08", 0.35, at=[("next", None), ("sub", "Часть два")])
M("end", 2.6)

m = marks
S("music/m13_quarantine.wav", 0, -19, "music", fadeIn=0.2, length=m["wake"], fadeOut=0.6)
S("sfx/impact_low.wav", 0.05, -9)
S("sfx/whoosh.wav", m["cme"], -12)
S("sfx/static.wav", m["tele"], -20, length=m["aurora"] - m["tele"], fadeOut=0.4)
S("sfx/flicker.wav", m["spark"], -14)
S("music/m05_relief.wav", m["aurora"], -20, "music")
S("sfx/stinger.wav", m["now"] + 0.5, -12)
S("sfx/room_tone.wav", m["wake"], -26, "amb", length=m["quebec"] - m["wake"], fadeOut=0.4, loop=True)
S("sfx/ui_tick.wav", m["nonet"] + 0.4, -12)
S("sfx/ui_tick.wav", m["nonet"] + 1.4, -12)
S("sfx/lock_click.wav", m["nolight"] + 0.3, -12)
S("music/m02_dread_long.wav", m["wake"], -19, "music", fadeIn=0.6, length=m["ours"] - m["wake"], fadeOut=0.5)
S("sfx/impact_low.wav", m["quebec"] + 0.8, -12)
S("sfx/tinnitus.wav", m["silence"] + 0.8, -26, length=2.5, fadeOut=1.0)
S("music/m10_run.wav", m["next"], -18, "music", fadeIn=0.3, length=m["end"] - m["next"], fadeOut=0.8)
S("sfx/riser.wav", m["sub"] - 1.0, -16)

save("bs1")
