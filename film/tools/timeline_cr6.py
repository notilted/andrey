"""«Из низов», серия 6 «Карта» (ветка «рассказать дону»): python3 tools/timeline_cr6.py -> src/data/cr6.json"""
from narr import B, M, N, S, load, marks, save

load("cr6_narration.json")

M("start", 0)
N("cr6_01", 0.15, at=[("results", None)])
N("cr6_02", 0.3, at=[("office", None), ("lucia", "Лусия")])
N("cr6_03", 0.3, at=[("look", None), ("loupe", "Потом"), ("map", "Между"), ("cross", "И красный")])
N("cr6_04", 0.3, at=[("friday", None), ("rule7", "Правило")])
N("cr6_05", 0.3, at=[("praise", None), ("plus", "Плюс"), ("rank", "Я теперь")])
N("cr6_06", 0.35, at=[("hall", None), ("efm", "Ну")])
N("cr6_07", 0.35, at=[("order", None), ("alive", "Привези")])
N("cr6_08", 0.4, at=[("night", None), ("kids", "Так Чино")])
N("cr6_09", 0.3, at=[("below", None)])
N("cr6_10", 0.35, at=[("choice", None)])
M("end", 3.0)

m = marks
S("music/m11_money.wav", 0, -21, "music", fadeIn=0.3, length=m["office"], fadeOut=0.6)
S("sfx/room_tone.wav", m["office"], -24, "amb", length=m["night"] - m["office"], fadeOut=0.5, loop=True)
S("music/m02_dread_long.wav", m["office"], -20, "music", fadeIn=0.8, length=m["praise"] - m["office"], fadeOut=0.6)
S("sfx/page_flip.wav", m["office"] + 0.8, -12)
S("sfx/whoosh.wav", m["loupe"], -15)
S("sfx/stinger.wav", m["cross"] + 0.4, -11)
S("sfx/clock.wav", m["friday"], -17, length=m["praise"] - m["friday"], fadeOut=0.4, loop=True)
S("sfx/cash.wav", m["plus"], -10)
S("music/m11_money.wav", m["plus"], -20, "music", length=m["hall"] - m["plus"], fadeOut=0.5)
S("music/m09_sad.wav", m["hall"], -19, "music", fadeIn=0.6, length=m["order"] - m["hall"], fadeOut=0.5)
S("sfx/impact_low.wav", m["efm"], -12)
S("music/m13_quarantine.wav", m["order"], -20, "music", fadeIn=0.6, length=m["night"] - m["order"], fadeOut=0.5)
S("sfx/night_city.wav", m["night"], -25, "amb", length=m["end"] - m["night"], fadeOut=0.8, loop=True)
S("music/m01_night_long.wav", m["night"], -20, "music", fadeIn=0.8, length=m["choice"] - m["night"], fadeOut=0.5)
for k in range(2):
    S("sfx/knock.wav", m["night"] + 0.6 + k * 0.7, -16)
S("sfx/stinger.wav", m["below"], -12)
S("sfx/riser.wav", m["choice"] - 1.2, -15)
S("sfx/clock.wav", m["choice"] + 0.5, -17, length=m["end"] - m["choice"] - 0.5, fadeOut=0.5, loop=True)

save("cr6")
