"""«Из низов», серия 7 «Пятница» (ветка «схватить Чино»): python3 tools/timeline_cr7.py -> src/data/cr7.json"""
from narr import B, M, N, S, load, marks, save

load("cr7_narration.json")

M("start", 0)
N("cr7_01", 0.15, at=[("results", None), ("friday", "Пятница")])
N("cr7_02", 0.3, at=[("window", None), ("trust", "Он кивает")])
N("cr7_03", 0.35, at=[("port", None), ("hide", "Люди дона")])
N("cr7_04", 0.3, at=[("chino", None), ("bag", "Просто")])
N("cr7_05", 0.3, at=[("rule8", None), ("look", "Я смотрю")])
N("cr7_06", 0.3, at=[("guards", None), ("says", "Смотрит")])
N("cr7_07", 0.3, at=[("lucia", None), ("photo", "А фото")])
N("cr7_08", 0.4, at=[("don", None), ("ask", "«Ну")])
N("cr7_09", 0.35, at=[("choice", None)])
M("end", 3.0)

m = marks
S("music/m11_money.wav", 0, -21, "music", fadeIn=0.3, length=m["window"], fadeOut=0.6)
S("sfx/stinger.wav", m["friday"], -12)
S("sfx/night_city.wav", m["window"], -25, "amb", length=m["port"] - m["window"], fadeOut=0.5, loop=True)
S("music/m01_night_long.wav", m["window"], -21, "music", fadeIn=0.6, length=m["port"] - m["window"], fadeOut=0.5)
S("sfx/surf.wav", m["port"], -22, "amb", length=m["choice"] - m["port"], fadeOut=1, loop=True)
S("sfx/wind_ash.wav", m["port"], -28, "amb", length=m["choice"] - m["port"], fadeOut=1, loop=True)
S("music/m02_dread_long.wav", m["port"], -19, "music", fadeIn=1, length=m["guards"] - m["port"], fadeOut=0.5)
S("sfx/footsteps_two.wav", m["chino"], -18, length=2.5, fadeOut=0.5)
S("sfx/heartbeat.wav", m["rule8"], -15, length=m["guards"] - m["rule8"], fadeOut=0.4, loop=True)
S("sfx/footsteps_crowd.wav", m["guards"], -16, length=2.5, fadeOut=0.6)
S("music/m13_quarantine.wav", m["says"], -19, "music", fadeIn=0.4, length=m["don"] - m["says"], fadeOut=0.5)
S("sfx/stinger.wav", m["lucia"] + 0.5, -11)
S("sfx/impact_low.wav", m["photo"] + 1.5, -11)
S("sfx/footsteps_two.wav", m["don"], -16, length=2.0, fadeOut=0.4)
S("music/m02_dread_long.wav", m["don"], -18, "music", fadeIn=0.4, length=m["end"] - m["don"], fadeOut=0.8)
S("sfx/riser.wav", m["choice"] - 1.2, -15)
S("sfx/clock.wav", m["choice"] + 0.5, -17, length=m["end"] - m["choice"] - 0.5, fadeOut=0.5, loop=True)

save("cr7")
