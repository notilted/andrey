"""Таймлайн части 2 «Этап второй»: python3 tools/timeline_ep2.py -> src/data/ep2.json

Устроен так же, как tools/timeline.py: L — реплика, M — маркер анимации, S — звук.
"""
import json, os
import soundfile as sf

ROOT = os.path.join(os.path.dirname(__file__), "..")
LINES = {l["id"]: l for l in json.load(open(os.path.join(ROOT, "..", "script", "ep2_lines.json")))}
WHO = {"mark": "МАРК", "double": "ГОЛОС ЗА ДВЕРЬЮ", "alisa": "АЛИСА", "galina": "ГАЛИНА", "lev": "ЛЕВ", "parrot": "КЕША", "rescuer": "МУЖЧИНА"}

HL = {
    "e2_lev_1": "Время пошло *заново*.",
    "e2_lev_2": "Значит, мы здесь *уже были*.",
    "e2_parrot_1": "*Не открывай*. Не открывай.",
    "e2_galina_2": "*Кеша*! Ты где такого набрался?",
    "e2_alisa_1": "Пап… он говорит *твоим голосом*.",
    "e2_mark_2": "Он не мог этого слышать. Я этого *ещё не говорил*.",
    "e2_lev_3": "Ещё не говорили. *В этот раз*.",
    "e2_lev_4": "*Двенадцать партий*. Я записываю каждую.",
    "e2_lev_5": "Когда таймер доходит до нуля, *всё начинается снова*. И за дверью становится *на одного больше*.",
    "e2_galina_3": "На одного *кого*?",
    "e2_alisa_2": "Я это нарисовала дома. Но тут было *по-другому*.",
    "e2_alisa_3": "Не помню. Пап, мне кажется, я это уже рисовала. *Много раз*.",
    "e2_mark_5": "Если ты — это я… скажи, что Алиса *рисовала сегодня вечером*.",
    "e2_double_1": "*Дом. Солнце.* И два дерева.",
    "e2_double_2": "Теперь ты ответь. Как зовут *маму Алисы*?",
    "e2_mark_6": "Я… *не помню*.",
    "e2_alisa_5": "Пап?..",
    "e2_mark_7": "*Тринадцатая*…",
    "e2_galina_5": "Так. *Без паники*. Я в девяносто восьмом и не такое видела.",
    "e2_man_1": "Да *откройте* вы уже! Может, там помощь!",
    "e2_mark_9": "*Никто* не откроет эту дверь.",
    "e2_mark_8": "А вы? Вы *настоящий*?",
    "e2_lev_6": "Я единственный, кто *ни разу* не открыл эту дверь.",
    "e2_lev_7": "*Ваш ход*, Марк.",
    "e2_alisa_6": "Тут папа держит меня за руку. А этот *стоит за дверью*.",
    "e2_mark_10": "*Который* из них я?",
    "e2_lev_8": "Осторожно. Он *помнит всё*, что помните вы.",
    "e2_mark_11": "Тогда проверим, *что помню я*.",
    "e2_mark_12": "Алиса… как зовут *маму*?",
    "e2_alisa_8": "Пап… ты же сам сказал. Её имя *нельзя называть*.",
    "e2_double_3": "Алиса. *Пойдём домой*.",
}

dialogue, sfx, marks = [], [], {}
cur = 0.0


def dur(i):
    return sf.info(os.path.join(ROOT, "public", "voice", i + ".wav")).duration


def L(i, gap=0.4, **kw):
    global cur
    start = round(cur + gap, 2)
    l = LINES[i]
    space = None if l.get("fx") in ("door", "monitor", "loudspeaker") else "bunker"
    d = dict(id=i, who=l["voice"], name=WHO[l["voice"]], start=start, caption=HL.get(i, l["text"].replace("...", "…")), space=space)
    d.update(kw)
    dialogue.append(d)
    marks[i] = start
    cur = start + dur(i)
    marks[i + "_end"] = round(cur, 2)


def M(name, gap=0.0):
    global cur
    cur = round(cur + gap, 2)
    marks[name] = cur


def S(file, at=0.0, gain=0, bus="sfx", **kw):
    if "end" in kw:
        kw["end"] = round(cur + kw["end"], 2)
    sfx.append(dict(file=file, start=round(cur + at, 2), gain=gain, bus=bus, **kw))


# ───────────── РАНЕЕ В «17 МИНУТАХ» ─────────────
M("recap", 0)
S("music/m02_dread_long.wav", 0, -16, "music", fadeIn=0.3, end=7.4, fadeOut=0.4)
for k in range(4):
    S("sfx/recap_hit.wav", k * 1.8, -10)
S("sfx/phone_alert.wav", 0.05, -16, end=1.7, fadeOut=0.2)
S("sfx/static.wav", 1.8, -20, end=3.6, fadeOut=0.2)
S("sfx/phones_chorus.wav", 3.6, -16, end=5.4, fadeOut=0.3)
M("recap_end", 7.2)

# ───────────── 1. ТРИ УДАРА ─────────────
for k in range(3):
    S("sfx/knock.wav", 0.5 + k * 1.3, -8)
S("sfx/vent.wav", 3.5, -24, "amb", fadeIn=2.0, end=230)
S("sfx/siren_muffled.wav", 3.8, -30, "amb", fadeIn=3.0, end=60, fadeOut=3)
M("c1_light", 3.6)
S("sfx/flicker.wav", 0, -14)
S("music/m08_loop.wav", 0.5, -15, "music", fadeIn=4.0, end=78, fadeOut=3)
L("e2_galina_1", 1.4)
M("c1_phones", 0.6)
S("sfx/phones_chorus.wav", 0, -12)
S("sfx/stinger.wav", 0, -10)
M("c1_phones_end", 3.6)
L("e2_lev_1", 0.4)
L("e2_mark_1", 0.4)
L("e2_lev_2", 0.5)
M("c1_msg", 0.8)
S("sfx/vibrate.wav", 0, -12)
S("sfx/ping.wav", 0.4, -14)
M("c1_msg_end", 4.6)
L("e2_mark_7", 0.3)
L("e2_galina_5", 1.0)

# ───────────── 2. ПОПУГАЙ ─────────────
M("c2", 1.4)
S("sfx/wings.wav", 0, -18)
L("e2_parrot_1", 0.5)
S("sfx/wings.wav", 0.1, -20)
L("e2_galina_2", 0.6)
L("e2_alisa_1", 0.5)
L("e2_mark_2", 0.45)
L("e2_lev_3", 0.7)

# ───────────── 3. БЛОКНОТ ─────────────
M("c3", 1.0)
S("sfx/page_flip.wav", 0.3, -14)
S("sfx/page_flip.wav", 0.9, -16)
M("c3_book", 0.2)
L("e2_lev_4", 0.6)
L("e2_mark_3", 0.4)
M("c3_book_end", 0.2)
L("e2_lev_5", 0.4)
M("c3_monitor", -2.6)
S("sfx/monitor_on.wav", 0, -16)
S("sfx/static.wav", 0, -22, end=6, fadeOut=0.4)
M("c3_monitor3", 2.6)
S("sfx/recap_hit.wav", 0, -14)
L("e2_galina_3", 1.0)
S("sfx/crowd.wav", 0.3, -24, "amb", fadeIn=0.5, end=7, fadeOut=1.5)
L("e2_man_1", 1.0)
M("c3_block", 0.0)
S("sfx/footsteps_two.wav", 0, -22, "amb", end=1.5, fadeOut=0.3)
L("e2_mark_9", 0.6)
L("e2_mark_8", 1.2)
L("e2_lev_6", 0.6)
M("c3_chess", 0.4)
S("sfx/ui_tick.wav", 1.2, -18)
L("e2_lev_7", 0.2)
M("c3_look", 0.3)
S("sfx/heartbeat.wav", 0, -20, end=3)
M("c4", 2.4)

# ───────────── 4. РИСУНОК ─────────────
S("music/m04_shelter.wav", 0, -16, "music", fadeIn=2.0, end=40, fadeOut=2)
L("e2_alisa_2", 0.6)
M("c4_draw", -2.0)
S("sfx/page_flip.wav", 0, -16)
M("c4_draw_mid", 2.0)
L("e2_mark_4", 0.8)
L("e2_alisa_3", 0.5)
L("e2_alisa_6", 0.6)
L("e2_mark_10", 0.6)
L("e2_alisa_7", 0.5)
M("c4_end", 1.4)

# ───────────── 5. ПРОВЕРКА ─────────────
M("c5", 0.0)
L("e2_lev_8", 0.3)
S("sfx/footsteps_two.wav", 0, -22, "amb", end=2.6, fadeOut=0.4)
L("e2_mark_11", 0.4)
L("e2_mark_5", 1.2)
L("e2_double_1", 0.5)
L("e2_alisa_4", 0.6)
L("e2_double_2", 0.9)
M("c5_silence", 0.2)
S("sfx/heartbeat.wav", 0, -14, end=4.2, fadeOut=0.8)
S("music/m06_double.wav", 0, -12, "music", fadeIn=1.0, end=26, fadeOut=1)
L("e2_mark_6", 3.6)
L("e2_galina_4", 0.9)
L("e2_mark_12", 1.2)
L("e2_alisa_8", 0.5)

# ───────────── 6. КОПИЯ ОПОЗНАНА ─────────────
M("c6", 1.2)
S("sfx/phones_chorus.wav", 0, -8)
S("music/m07_stage.wav", 0, -8, "music")
M("c6_back", 5.0)
S("sfx/riser.wav", 0, -18)
M("c6_turn", 0.4)
L("e2_alisa_5", 2.4)
M("c6_lock", 1.0)
S("sfx/lock_click.wav", 0, -6)
S("sfx/wheel_creak.wav", 0.4, -10)
M("c6_open", 2.4)
S("sfx/door_open.wav", 0, -8)
L("e2_double_3", 2.2, space="bunker")
M("c6_black", 1.4)
M("title", 1.6)
S("sfx/knock.wav", 0.6, -16)
M("end", 7.0)

tl = dict(name="ep2", duration=round(cur, 2), dialogue=dialogue, sfx=sfx, marks=marks)
json.dump(tl, open(os.path.join(ROOT, "src", "data", "ep2.json"), "w"), ensure_ascii=False, indent=1)
print("duration", round(cur, 2), "s")
