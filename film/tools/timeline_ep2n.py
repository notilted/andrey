"""Таймлайн части 2 в формате рассказчика: python3 tools/timeline_ep2n.py -> src/data/ep2.json

Рассказ разбит на куски (script/ep2_narration.json). Моменты анимации («биты») привязаны к фразам
внутри кусков: бит начинается, когда рассказчик доходит до опорной фразы. Положение фразы во времени
оценивается по доле символов в куске — для ровной дикторской речи это точнее полукадра.
"""
import json, os
import soundfile as sf

ROOT = os.path.join(os.path.dirname(__file__), "..")
SEGS = {s["id"]: s for s in json.load(open(os.path.join(ROOT, "..", "script", "ep2_narration.json")))}

dialogue, sfx, marks, beats = [], [], {}, {}
cur = 0.0


def dur(i):
    return sf.info(os.path.join(ROOT, "public", "voice", i + ".wav")).duration


def clean(t):
    return t.replace("*", "")


def N(i, gap=0.5, at=None):
    """Кусок рассказа; at — список (бит, опорная фраза | None = начало куска)."""
    global cur
    start = round(cur + gap, 2)
    d = dur(i)
    text = clean(SEGS[i]["text"])
    dialogue.append(dict(id=i, who="narrator", name="", start=start, caption=SEGS[i]["text"], space=None))
    pts = []
    for name, anchor in at or []:
        pos = 0 if anchor is None else text.index(anchor) / len(text)
        pts.append((name, start + pos * d))
    pts.sort(key=lambda p: p[1])
    for k, (name, t0) in enumerate(pts):
        t1 = pts[k + 1][1] if k + 1 < len(pts) else start + d
        beats[name] = dict(start=round(t0, 2), dur=round(max(0.3, t1 - t0), 2))
        marks[name] = round(t0, 2)
    marks[i] = start
    cur = start + d
    marks[i + "_end"] = round(cur, 2)


def B(name, gap, d=0.8):
    """Немой бит без рассказа (реакция, пауза)."""
    global cur
    cur = round(cur + gap, 2)
    beats[name] = dict(start=cur, dur=d)
    marks[name] = cur
    cur = round(cur + d, 2)


def M(name, gap=0.0):
    global cur
    cur = round(cur + gap, 2)
    marks[name] = cur


def S(file, t, gain=0, bus="sfx", **kw):
    if "length" in kw:
        kw["end"] = round(t + kw.pop("length"), 2)
    sfx.append(dict(file=file, start=round(t, 2), gain=gain, bus=bus, **kw))


# ───────── РАНЕЕ ─────────
M("recap", 0)
N("n01", 0.3)
M("recap_end", 0.4)
# ───────── 1. ТРИ УДАРА ─────────
N("n02", 1.2, at=[("c1_light", "Красная лампа")])
N("n03", 0.4, at=[("e2_galina_1", None)])
N("n04", 0.5, at=[("c1_phones", "все телефоны")])
M("c1_phones_end", 1.2)
N("n05", 0.4, at=[("e2_lev_1", "Лев"), ("e2_mark_1", "Ты спрашиваешь"), ("e2_lev_2", "«Значит")])
M("c1_msg", 0.4)
N("n06", 0.3, at=[("e2_mark_7", "Это твоя")])
M("c1_msg_end", 0.8)
N("n07", 0.3, at=[("e2_galina_5", None)])
# ───────── 2. ПОПУГАЙ ─────────
N("n08", 0.9, at=[("c2", None), ("e2_parrot_1", "И говорит")])
B("e2_galina_2", 0.6, 1.4)
N("n09", 0.2, at=[("e2_alisa_1", None), ("e2_mark_2", "Но ты"), ("e2_lev_3", "«Ещё не говорили")])
# ───────── 3. БЛОКНОТ ─────────
M("c3", 1.4)
N("n10", 0.3, at=[("c3_book", None), ("e2_lev_4", None), ("e2_mark_3", "Шахматные")])
N("n11", 0.4, at=[("c3_book_end", None), ("e2_lev_5", None), ("c3_monitor", "На мониторе"), ("c3_monitor3", "Потом трое")])
N("n11b", 0.5)
B("e2_galina_3", 0.9, 0.8)
N("n12", 0.3, at=[("e2_man_1", None), ("c3_block", "Ты встаёшь"), ("e2_mark_9", "Никто")])
N("n13", 0.6, at=[("e2_mark_8", None), ("e2_lev_6", "«Я единственный"), ("c3_chess", "Он переставляет"), ("e2_lev_7", "«Ваш ход")])
B("c3_look", 0.4, 2.4)
M("c4", 0.0)
# ───────── 4. РИСУНОК ─────────
N("n14", 0.4, at=[("e2_alisa_2", None), ("c4_draw", "свой рисунок"), ("e2_mark_4", "Но теперь")])
N("n15", 0.5, at=[("e2_alisa_3", None), ("e2_alisa_6", "Тут папа"), ("e2_mark_10", "Который"), ("e2_alisa_7", "Она не знает")])
M("c4_end", 1.8)
# ───────── 5. ПРОВЕРКА ─────────
N("n16", 0.3, at=[("c5", None), ("e2_lev_8", "Лев предупреждает"), ("e2_mark_11", "Ты подходишь")])
N("n17", 0.6, at=[("e2_mark_5", None), ("e2_double_1", "Из-за двери"), ("e2_alisa_4", "Правильно")])
N("n18", 0.8, at=[("e2_double_2", None)])
M("c5_silence", 0.2)
N("n19", 2.6, at=[("e2_mark_6", None)])
B("e2_galina_4", 0.3, 0.8)
N("n20", 0.4, at=[("e2_mark_12", None), ("e2_alisa_8", "Алиса пятится")])
# ───────── 6. КОПИЯ ОПОЗНАНА ─────────
M("c6", 0.8)
N("n21", 0.3)
M("c6_back", 1.4)
N("n22", 0.2, at=[("c6_turn", None), ("e2_alisa_5", "Алиса отпускает")])
N("n23", 0.6, at=[("c6_lock", None), ("c6_open", "Дверь открывается")])
N("n24", 2.2, at=[("e2_double_3", None)])
M("c6_black", 1.2)
M("title", 1.2)
N("n25", 1.6)
M("end", 2.0)

m = marks
# ───────── звук (относительно маркеров) ─────────
S("music/m02_dread_long.wav", 0, -18, "music", fadeIn=0.3, length=m["recap_end"], fadeOut=0.4)
for k in range(4):
    S("sfx/recap_hit.wav", 0.3 + k * 2.1, -12)
for k in range(3):
    S("sfx/knock.wav", m["recap_end"] + 0.2 + k * 1.2, -8)
S("sfx/flicker.wav", m["c1_light"], -14)
S("sfx/vent.wav", m["c1_light"], -24, "amb", fadeIn=2.0, length=m["end"] - m["c1_light"])
S("sfx/siren_muffled.wav", m["c1_light"], -30, "amb", fadeIn=3.0, length=60, fadeOut=3)
S("music/m08_loop.wav", m["c1_light"] + 0.5, -16, "music", fadeIn=4.0, length=m["c3"] - m["c1_light"], fadeOut=3)
S("sfx/phones_chorus.wav", m["c1_phones"], -12)
S("sfx/stinger.wav", m["c1_phones"], -10)
S("sfx/vibrate.wav", m["c1_msg"], -12)
S("sfx/ping.wav", m["c1_msg"] + 0.4, -14)
S("sfx/wings.wav", m["c2"], -18)
S("sfx/parrot.wav", m["e2_parrot_1"] - 0.3, -16)
S("sfx/wings.wav", m["e2_galina_2"], -20)
S("sfx/page_flip.wav", m["c3_book"], -14)
S("sfx/page_flip.wav", m["c3_book"] + 0.6, -16)
S("music/m04_shelter.wav", m["c3"], -17, "music", fadeIn=2.0, length=m["c5"] - m["c3"], fadeOut=2)
S("sfx/monitor_on.wav", m["c3_monitor"], -16)
S("sfx/static.wav", m["c3_monitor"], -24, length=m["e2_galina_3"] - m["c3_monitor"], fadeOut=0.4)
S("sfx/recap_hit.wav", m["c3_monitor3"], -14)
S("sfx/crowd.wav", m["e2_man_1"] - 0.5, -26, "amb", fadeIn=0.5, length=6, fadeOut=1.5)
S("sfx/footsteps_two.wav", m["c3_block"], -22, "amb", length=1.5, fadeOut=0.3)
S("sfx/ui_tick.wav", m["c3_chess"] + 0.6, -18)
S("sfx/heartbeat.wav", m["c3_look"], -20, length=2.4)
S("sfx/page_flip.wav", m["c4_draw"], -16)
S("sfx/footsteps_two.wav", m["e2_mark_11"], -22, "amb", length=2.4, fadeOut=0.4)
S("music/m06_double.wav", m["c5"], -14, "music", fadeIn=1.0, length=m["c6"] - m["c5"], fadeOut=1)
S("sfx/heartbeat.wav", m["c5_silence"], -14, length=4.2, fadeOut=0.8)
S("sfx/phones_chorus.wav", m["c6"], -8)
S("music/m07_stage.wav", m["c6"], -9, "music")
S("sfx/riser.wav", m["c6_back"], -18)
S("sfx/lock_click.wav", m["c6_lock"] + 0.3, -6)
S("sfx/wheel_creak.wav", m["c6_lock"] + 0.8, -10)
S("sfx/door_open.wav", m["c6_open"], -8)
S("sfx/knock.wav", m["title"] + 0.6, -16)

tl = dict(name="ep2", duration=round(cur, 2), dialogue=dialogue, sfx=sfx, marks=marks, beats=beats)
json.dump(tl, open(os.path.join(ROOT, "src", "data", "ep2.json"), "w"), ensure_ascii=False, indent=1)
print("duration", round(cur, 2), "s")
