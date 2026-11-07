"""«13 лет ждал» (GTA VI тренд): python3 tools/timeline_gt1.py -> src/data/gt1.json"""
from narr import B, M, N, S, load, marks, save

load("gt1_narration.json")

M("start", 0)
N("gt1_01", 0.05, at=[("hook", None), ("day", "И вот")])
N("gt1_02", 0.25, at=[("prep", None), ("cans", "закупил"), ("phone", "и выключил")])
N("gt1_03", 0.25, at=[("night", None), ("load", "Загрузка"), ("p99", "Девяносто")])
N("gt1_04", 0.15, at=[("off", None), ("house", "Во всём")])
N("gt1_05", 0.4, at=[("drill", None), ("district", "Нет")])
N("gt1_06", 0.35, at=[("candle", None), ("whisper", "и прошептал")])
N("gt1_07", 0.3, at=[("hour", None), ("servers", "А сервера")])
N("gt1_08", 0.45, at=[("sub", None), ("tonight", "А в семь")])
M("end", 2.2)

m = marks
S("music/m11_money.wav", 0, -20, "music", fadeIn=0.2, length=m["night"], fadeOut=0.5)
S("sfx/impact_low.wav", 0.05, -10)
S("sfx/cash.wav", m["cans"] + 0.2, -14)
S("sfx/ui_tick.wav", m["phone"] + 0.6, -12)
S("sfx/clock.wav", m["night"], -18, length=m["off"] - m["night"], fadeOut=0.2)
S("sfx/hum.wav", m["load"], -24, length=m["off"] - m["load"], fadeOut=0.05)
S("music/m02_dread.wav", m["load"], -22, "music", fadeIn=0.3, length=m["off"] - m["load"], fadeOut=0.05)
S("sfx/big_impact.wav", m["off"], -9)
S("sfx/flicker.wav", m["off"] + 0.1, -14)
S("sfx/room_tone.wav", m["off"], -26, "amb", length=m["sub"] - m["off"], fadeOut=0.5, loop=True)
S("sfx/knock.wav", m["drill"] + 0.3, -14)
S("sfx/whoosh.wav", m["district"], -13)
S("music/m09_sad.wav", m["candle"], -20, "music", fadeIn=0.6, length=m["hour"] - m["candle"], fadeOut=0.5)
S("sfx/fire.wav", m["candle"], -24, length=m["hour"] - m["candle"], fadeOut=0.5)
S("sfx/monitor_on.wav", m["hour"] + 0.4, -12)
S("sfx/stinger.wav", m["servers"] + 0.5, -11)
S("music/m10_run.wav", m["sub"], -19, "music", fadeIn=0.3, length=m["end"] - m["sub"], fadeOut=0.8)
S("sfx/riser.wav", m["tonight"] - 1.0, -17)

save("gt1")
