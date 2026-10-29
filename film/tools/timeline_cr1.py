"""«Из низов», серия 1 «Ботинки»: python3 tools/timeline_cr1.py -> src/data/cr1.json"""
from narr import B, M, N, S, load, marks, save

load("cr1_narration.json")

M("start", 0)
N("cr1_01", 0.2, at=[("hook", None), ("fear", "Через")])
N("cr1_02", 0.4, at=[("square", None), ("pay", "Пятьдесят")])
N("cr1_03", 0.4, at=[("don", None), ("boss", "Дон Октавио")])
N("cr1_04", 0.4, at=[("shine", None), ("env", "А потом")])
N("cr1_05", 0.3, at=[("money", None)])
N("cr1_06", 0.3, at=[("note", None)])
N("cr1_07", 0.4, at=[("home", None), ("chino", "Чино"), ("look", "А ты")])
N("cr1_08", 0.4, at=[("choice", None)])
M("end", 2.8)

m = marks
S("music/m11_money.wav", 0, -20, "music", fadeIn=0.5, length=m["don"], fadeOut=1)
S("sfx/stinger.wav", m["fear"], -12)
S("sfx/crowd.wav", m["square"], -26, "amb", length=m["home"] - m["square"], fadeOut=1, loop=True)
S("music/m02_dread_long.wav", m["don"], -19, "music", fadeIn=1, length=m["money"] - m["don"], fadeOut=0.5)
S("sfx/footsteps_two.wav", m["don"], -18, length=2.0, fadeOut=0.5)
S("sfx/page_flip.wav", m["env"] + 0.8, -12)
S("sfx/cash.wav", m["money"], -10)
S("music/m11_money.wav", m["money"], -17, "music", length=m["note"] - m["money"], fadeOut=0.5)
S("sfx/page_flip.wav", m["note"], -14)
S("sfx/stinger.wav", m["note"] + 3.5, -12)
S("sfx/night_city.wav", m["home"], -24, "amb", length=m["end"] - m["home"], fadeOut=1, loop=True)
S("music/m13_quarantine.wav", m["home"], -19, "music", fadeIn=1, length=m["end"] - m["home"], fadeOut=1)
S("sfx/riser.wav", m["choice"] - 1.5, -14)
S("sfx/impact_low.wav", m["choice"], -10)
S("sfx/clock.wav", m["choice"] + 0.5, -16, length=m["end"] - m["choice"] - 0.5, fadeOut=0.5, loop=True)

save("cr1")
