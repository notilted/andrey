"""«Три волны», сезон 2, серия 5 «Звонок» (финал): python3 tools/timeline_tw5.py -> src/data/tw5.json"""
from narr import B, M, N, S, load, marks, save

load("tw5_narration.json")

# ───────── ЗАЦЕП: голос из трубки ─────────
M("start", 0)
N("w5_01", 0.4, at=[("h_answer", None), ("h_voice", "И слышишь")])
N("w5_02", 0.4, at=[("voice1", None)])
N("w5_03", 0.4, at=[("voicemail", None), ("recorded", "Евгений записал")])
N("w5_04", 0.2, at=[("delivered", None)])
# ───────── ДИМА СЛУШАЕТ ОТЦА ─────────
N("w5_05", 0.6, at=[("dima_takes", None)])
N("w5_06", 0.4, at=[("memory", None)])
N("w5_07", 0.6, at=[("kneel", None), ("turn_away", "Ты отворачиваешься")])
# ───────── ПИСЬМО ─────────
N("w5_08", 0.8, at=[("letter", None)])
N("w5_09", 0.3, at=[("letter_text", None)])
N("w5_10", 0.4, at=[("voices", None)])
N("w5_11", 0.4, at=[("no_waves", None)])
# ───────── КАМЕНЬ УХОДИТ ─────────
N("w5_12", 0.8, at=[("rise", None), ("star", "пока не")])
N("w5_13", 0.6, at=[("blue", None)])
# ───────── ДОМОЙ ─────────
N("w5_14", 0.8, at=[("home", None), ("run", "Соня бежит"), ("give", "Ты отдаёшь")])
N("w5_15", 0.8, at=[("fire", None), ("galya_cry", "Баба Галя")])
N("w5_16", 1.0, at=[("last", None)])
M("title", 1.2)
M("end", 4.5)

m = marks
S("sfx/hum.wav", 0, -14, length=m["dima_takes"], fadeOut=1.5)
S("sfx/wind_ash.wav", 0, -22, "amb", fadeIn=1.0, length=m["rise"] + 6, fadeOut=2.0)
S("sfx/static.wav", m["h_voice"], -26, length=m["voicemail"] - m["h_voice"], fadeOut=0.3)
S("sfx/stinger.wav", m["h_voice"] + 0.2, -14)
S("sfx/ui_tick.wav", m["voicemail"] + 0.3, -14)
S("sfx/ping.wav", m["delivered"] + 0.1, -12)
S("music/m09_sad.wav", m["dima_takes"], -14, "music", fadeIn=2.0, length=m["letter"] - m["dima_takes"], fadeOut=1.5)
S("sfx/static.wav", m["memory"], -30, length=m["kneel"] - m["memory"], fadeOut=0.5)
S("sfx/wheel_creak.wav", m["memory"] + 3.0, -20)
S("sfx/phones_chorus.wav", m["letter"], -14)
S("music/m04_shelter.wav", m["letter"], -17, "music", fadeIn=1.5, length=m["rise"] - m["letter"], fadeOut=1.5)
S("sfx/ui_tick.wav", m["letter_text"], -20)
S("sfx/ui_tick.wav", m["voices"], -20)
S("sfx/recap_hit.wav", m["no_waves"], -12)
S("sfx/riser.wav", m["rise"], -14)
S("sfx/silent_pass.wav", m["rise"] + 0.5, -10)
S("sfx/ping.wav", m["star"] + 0.4, -18)
S("music/m05_relief.wav", m["blue"], -12, "music", fadeIn=0.5)
S("sfx/night_city.wav", m["blue"], -30, "amb", fadeIn=2.0, length=m["home"] - m["blue"] + 1, fadeOut=1.0)
S("music/m09_sad.wav", m["home"], -14, "music", fadeIn=2.0, length=m["title"] - m["home"] + 1.5, fadeOut=2.0)
S("sfx/footsteps_two.wav", m["run"], -18, length=1.8, fadeOut=0.3)
S("sfx/fire.wav", m["fire"], -20, "amb", fadeIn=1.5, length=m["title"] - m["fire"], fadeOut=1.5)
S("sfx/static.wav", m["fire"] + 0.5, -32, length=4, fadeOut=1)
S("music/m01_night_long.wav", m["title"] - 0.5, -12, "music", fadeIn=1.0)

save("tw5")
