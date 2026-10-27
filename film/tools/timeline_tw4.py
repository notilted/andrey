"""«Три волны», сезон 2, серия 4 «Он тормозит»: python3 tools/timeline_tw4.py -> src/data/tw4.json"""
from narr import B, M, N, S, load, marks, save

load("tw4_narration.json")

# ───────── ЗАЦЕП: метеорит тормозит в небе ─────────
M("start", 0)
N("w4_01", 0.5, at=[("h_sky", None), ("h_brake", "Этот")])
# ───────── ЛАГЕРЬ В ДЕПО ─────────
N("w4_02", 0.8, at=[("camp", None), ("dima", "Старший")])
N("w4_03", 0.3, at=[("note", None)])
N("w4_04", 0.4, at=[("sonya", None), ("galya", "Баба Галя"), ("cat", "Барсик")])
N("w4_05", 0.5, at=[("calc", None)])
# ───────── НОЧЬ: ОБЪЕКТ ТОРМОЗИТ ─────────
N("w4_06", 0.8, at=[("slow", None)])
N("w4_07", 0.4, at=[("dima_night", None)])
# ───────── РАССВЕТ: ПОСАДКА ─────────
N("w4_08", 0.8, at=[("pass", None), ("land", "И садится")])
N("w4_09", 0.4, at=[("silence", None)])
# ───────── ПОЕЗДКА ─────────
N("w4_10", 0.8, at=[("leave", None), ("bunny", "Соня отдаёт")])
N("w4_11", 0.8, at=[("stone", None)])
N("w4_12", 0.4, at=[("touch", None), ("hum", "И камень")])
N("w4_13", 0.5, at=[("slit", None)])
N("w4_14", 0.5, at=[("ring", None)])
N("w4_15", 0.6, at=[("call", None), ("evgeny", "Евгений")])
M("title", 1.0)
M("end", 3.6)

m = marks
S("sfx/wind_ash.wav", 0, -22, "amb", fadeIn=1.0, length=m["slow"], fadeOut=1.0)
S("sfx/meteor_roar.wav", m["h_sky"], -12, length=m["h_brake"] - m["h_sky"] + 1.0, fadeOut=1.5)
S("sfx/riser.wav", m["h_brake"] - 0.5, -16)
S("sfx/stinger.wav", m["h_brake"] + 0.6, -12)
S("music/m04_shelter.wav", m["camp"], -18, "music", fadeIn=2.0, length=m["slow"] - m["camp"], fadeOut=2.0)
S("sfx/fire.wav", m["camp"], -20, "amb", fadeIn=1.0, length=m["calc"] - m["camp"], fadeOut=1.0)
S("sfx/page_flip.wav", m["note"] + 0.4, -16)
S("sfx/meow.wav", m["cat"] + 0.3, -14)
S("sfx/ui_tick.wav", m["calc"] + 0.4, -14)
S("sfx/static.wav", m["calc"], -28, length=m["slow"] - m["calc"], fadeOut=0.5)
S("sfx/night_city.wav", m["slow"], -30, "amb", length=m["pass"] - m["slow"], fadeOut=1.0)
S("sfx/vibrate.wav", m["slow"] + 0.1, -10)
S("sfx/stinger.wav", m["slow"] + 0.3, -12)
S("music/m06_double.wav", m["slow"], -15, "music", fadeIn=1.0, length=m["silence"] - m["slow"], fadeOut=1.5)
S("sfx/heartbeat.wav", m["dima_night"], -20, length=m["pass"] - m["dima_night"], fadeOut=0.5)
S("sfx/silent_pass.wav", m["pass"], -6)
S("sfx/tinnitus.wav", m["silence"], -24, length=3, fadeOut=1.5)
S("music/m09_sad.wav", m["leave"], -16, "music", fadeIn=1.5, length=m["stone"] - m["leave"], fadeOut=1.0)
S("sfx/footsteps_two.wav", m["leave"] + 0.5, -22, "amb", length=2.5, fadeOut=0.4)
S("sfx/wind_ash.wav", m["stone"], -20, "amb", fadeIn=1.0, length=m["title"] - m["stone"], fadeOut=1.0)
S("music/m02_dread_long.wav", m["stone"], -17, "music", fadeIn=1.5, length=m["ring"] - m["stone"], fadeOut=0.5)
S("sfx/hum.wav", m["hum"] - 0.2, -8, length=m["ring"] - m["hum"] + 1.0, fadeOut=1.0)
S("sfx/riser.wav", m["slit"], -14)
S("sfx/whoosh.wav", m["slit"] + 0.8, -16)
S("sfx/ringtone.wav", m["ring"] + 0.2, -10, length=m["title"] - m["ring"] + 1.0, fadeOut=0.4)
S("sfx/vibrate.wav", m["ring"] + 0.2, -12)
S("sfx/stinger.wav", m["evgeny"], -8)
S("music/m07_stage.wav", m["title"] - 0.2, -8, "music")

save("tw4")
