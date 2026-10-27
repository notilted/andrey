"""«Три волны», серия 1 «2 минуты»: python3 tools/timeline_tw1.py -> src/data/tw1.json"""
from narr import B, M, N, S, load, marks, save

load("tw1_narration.json")

# ───────── ЗАЦЕП: телефон в темноте ─────────
M("start", 0)
N("w1_01", 0.6, at=[("h_dark", None), ("h_alert", "оповещение"), ("h_two", "у тебя есть")])
# ───────── ОКНО: небо оранжевое ─────────
N("w1_02", 0.5, at=[("ext", None), ("sky", "небо")])
# ───────── КВАРТИРА: Соня в одеяле ─────────
N("w1_03", 0.3, at=[("room", None), ("bunny", "Она спросонья"), ("no_time", "Времени нет")])
# ───────── ПОДЪЕЗД ─────────
N("w1_04", 0.3, at=[("stairs", None)])
N("w1_05", 0.3, at=[("galya", None), ("galya_says", "«Без")])
N("w1_06", 0.3, at=[("galya_go", None), ("cat_jump", "Кот"), ("t40", "Сорок")])
# ───────── ПОДВАЛ ─────────
N("w1_07", 0.5, at=[("cellar", None), ("evgeny", "Механик")])
N("w1_08", 0.3, at=[("lie", None)])
N("w1_09", 0.3, at=[("cover", None), ("t5", "Пять")])
B("roar", 0.2, 2.0)
N("w1_10", 0.0, at=[("flash", None), ("hit", "Потом")])
B("black", 0.4, 1.6)
N("w1_11", 0.2, at=[("dust", None)])
# ───────── СНАРУЖИ ─────────
N("w1_12", 1.0, at=[("out", None), ("crater", "На месте")])
N("w1_13", 0.4, at=[("relief", None)])
N("w1_14", 0.6, at=[("cry", None)])
# ───────── КРЮЧОК ─────────
N("w1_15", 0.9, at=[("phones", None)])
N("w1_16", 0.3, at=[("msg", None)])
M("title", 0.8)
M("end", 3.4)

m = marks
# ───────── звук ─────────
S("sfx/vibrate.wav", m["start"] + 0.2, -10)
S("sfx/phone_alert.wav", m["h_alert"] - 0.3, -14, length=3.0, fadeOut=0.5)
S("sfx/stinger.wav", m["h_alert"], -12)
S("music/m02_dread_long.wav", m["h_two"], -18, "music", fadeIn=1.0, length=m["stairs"] - m["h_two"], fadeOut=0.6)
S("sfx/siren_far.wav", m["ext"], -18, "amb", fadeIn=0.5, length=m["cellar"] - m["ext"], fadeOut=1.0)
S("sfx/meteor_roar.wav", m["sky"] - 1.0, -16, length=5, fadeOut=1.5)
S("sfx/night_city.wav", m["ext"], -26, "amb", length=m["room"] - m["ext"])
S("sfx/footsteps_two.wav", m["room"] + 0.4, -18, length=2.0, fadeOut=0.3)
S("music/m10_run.wav", m["stairs"], -15, "music", length=m["cellar"] - m["stairs"], fadeOut=0.8)
S("sfx/footsteps_crowd.wav", m["stairs"], -14, "amb", fadeIn=0.3, length=m["cellar"] - m["stairs"], fadeOut=0.6)
S("sfx/crowd.wav", m["stairs"], -24, "amb", fadeIn=0.5, length=m["galya_go"] - m["stairs"] + 2, fadeOut=1)
S("sfx/meow.wav", m["cat_jump"], -12)
S("sfx/door_clank.wav", m["cellar"] - 0.3, -14)
S("sfx/vent.wav", m["cellar"], -26, "amb", fadeIn=1.0, length=m["out"] - m["cellar"], fadeOut=0.5)
S("sfx/heartbeat.wav", m["cover"], -14, length=m["flash"] - m["cover"], fadeOut=0.3)
S("sfx/meteor_roar.wav", m["roar"] - 1.5, -6, length=3.6)
S("sfx/whoosh.wav", m["flash"] - 0.2, -10)
S("sfx/big_impact.wav", m["hit"], -2)
S("sfx/rubble.wav", m["hit"] + 0.6, -10)
S("sfx/tinnitus.wav", m["black"], -16, length=4, fadeOut=2)
S("sfx/dust.wav", m["dust"], -14)
S("sfx/wind_ash.wav", m["out"], -20, "amb", fadeIn=1.5, length=m["title"] - m["out"], fadeOut=1)
S("sfx/fire.wav", m["out"], -18, "amb", fadeIn=1.0, length=m["title"] - m["out"], fadeOut=1)
S("sfx/siren_far.wav", m["out"] + 2, -28, "amb", fadeIn=2, length=12, fadeOut=3)
S("music/m09_sad.wav", m["relief"], -16, "music", fadeIn=2.0, length=m["phones"] - m["relief"] + 0.5, fadeOut=0.8)
S("sfx/phones_chorus.wav", m["phones"] + 0.3, -8)
S("sfx/vibrate.wav", m["phones"] + 0.1, -10)
S("sfx/stinger.wav", m["msg"], -10)
S("music/m07_stage.wav", m["title"] - 0.2, -8, "music")
S("sfx/meteor_roar.wav", m["title"] + 0.3, -18, length=3.0, fadeOut=0.5)

save("tw1")
