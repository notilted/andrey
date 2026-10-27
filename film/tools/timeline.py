"""Таймлайн фильма из «битов» сцен: python3 tools/timeline.py -> src/data/film.json

Каждая сцена — последовательность событий относительно курсора:
  L(id, gap)        реплика через gap секунд после предыдущего события (курсор → конец реплики)
  M(name, gap)      маркер для анимации (курсор → маркер)
  S(file, at, ...)  звук в момент курсор+at (курсор не двигается)
Длительности реплик берутся из public/voice/*.wav, поэтому анимация и звук всегда совпадают.
"""
import json, os
import soundfile as sf

ROOT = os.path.join(os.path.dirname(__file__), "..")
LINES = {l["id"]: l for l in json.load(open(os.path.join(ROOT, "..", "script", "lines.json")))}
WHO = {"mark": "МАРК", "double": "МАРК?", "alisa": "АЛИСА", "galina": "ГАЛИНА", "lev": "ЛЕВ",
       "rescuer": "ГОЛОС ЗА ДВЕРЬЮ", "announcer": "ОПОВЕЩЕНИЕ"}
SPACE = {"s1": "room", "s2": "stairs", "s3": "bunker", "s4": "bunker", "s5": "bunker", "s6": "bunker", "s7": "bunker"}

# подсветка ключевых слов в субтитрах (*слово*)
HL = {
    "s1_announce": "Внимание! *Ракетная опасность*. Всем немедленно пройти в ближайшее *укрытие*.",
    "s1_alisa_1": "Пап… а что это *значит*?",
    "s1_mark_1": "Одевайся. Нам нужно *в укрытие*.",
    "s1_mark_3": "В подвал. Там *убежище*.",
    "s1_mark_2": "Это… *мой номер*.",
    "s2_galina_1": "Подождите! А *животных*-то брать разрешили?",
    "s2_galina_2": "А то я *кота* потеряла.",
    "s2_mark_2": "У вас же *попугай*.",
    "s2_galina_3": "Так кот его и *испугался*!",
    "s2_galina_4": "Ой… Это что, уже *началось*?",
    "s3_galina_1": "Молодой человек, у нас тут *конец света*, а вы в шахматы играете!",
    "s3_mark_1": "Почему у вас *другое время*?",
    "s3_lev_2": "Хороший *вопрос*.",
    "s3_lev_3": "Ваши часы *спешат*. Или мои *отстают*.",
    "s4_announce": "Внимание. *Угроза отменена*. Немедленно покиньте помещение.",
    "s4_lev_1": "Подождите. Если тревога отменена, почему *сирены* всё ещё работают?",
    "s4_mark_1": "Все стойте! *Никто не выходит*, пока это не подтвердят.",
    "s5_alisa_1": "Пап, мне *страшно*.",
    "s5_rescuer_1": "Откройте. Это *спасатели*.",
    "s5_mark_2": "Галина Петровна, стойте! *Не открывайте*.",
    "s5_double_1": "Алиса, открой. *Это папа*.",
    "s5_alisa_2": "Пап… у него *твой голос*.",
    "s6_double_1": "Марк. Ты уже *один раз* открыл эту дверь.",
    "s6_mark_1": "Это… *я*?",
    "s6_lev_2": "Похоже, это была *не обычная* ракетная тревога.",
    "s7_alisa_1": "Пап… а *какой из вас настоящий*?",
}

dialogue, sfx, marks = [], [], {}
cur = 0.0


def dur(i):
    return sf.info(os.path.join(ROOT, "public", "voice", i + ".wav")).duration


def L(i, gap=0.4, **kw):
    global cur
    start = round(cur + gap, 2)
    l = LINES[i]
    d = dict(id=i, who=l["voice"], name=WHO[l["voice"]], start=start, caption=HL.get(i, l["text"].replace("...", "…")),
             space=kw.pop("space", SPACE[i[:2]] if l.get("fx") not in ("loudspeaker", "door", "monitor") else None))
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
    if "end" in kw:  # end задаётся относительно курсора
        kw["end"] = round(cur + kw["end"], 2)
    sfx.append(dict(file=file, start=round(cur + at, 2), gain=gain, bus=bus, **kw))


# ───────────── СЦЕНА 1. ОПОВЕЩЕНИЕ ─────────────
M("s1", 0)
S("sfx/night_city.wav", 0, -12, "amb", fadeIn=1.0, end=7.2, fadeOut=1.6)
S("music/m01_night.wav", 0, -11, "music", fadeIn=1.5, end=8.05, fadeOut=0.15)
S("sfx/whoosh.wav", 4.5, -14)
S("sfx/tv_murmur.wav", 1.2, -30, "amb", end=5.0, fadeOut=1.0)
S("sfx/room_tone.wav", 5.4, -24, "amb", fadeIn=1.0, end=30.2)
S("sfx/pencil.wav", 5.8, -20, end=8.0, fadeOut=0.05)
M("alert", 8.0)
S("sfx/stinger.wav", 0, -5)
S("sfx/phone_alert.wav", 0, -9, pan=-0.3, space="room")
S("sfx/phone_alert.wav", 0.09, -12, pan=0.35, space="room")
S("music/m02_dread_long.wav", 0.3, -10, "music", fadeIn=0.8, end=22.0, fadeOut=0.3)
S("sfx/siren_far.wav", 1.0, -15, "amb", fadeIn=3.0)
S("sfx/siren_near.wav", 7.0, -17, "amb", fadeIn=2.0, end=22.0, fadeOut=1.0)
cur = 10.3; L("s1_alisa_1", 0)
S("sfx/chair.wav", -0.55 + 2.45, -18, space="room")
cur = 12.75; L("s1_mark_1", 0)
M("s1_window", 0.4)
S("sfx/footsteps_two.wav", 0, -22, end=1.6, fadeOut=0.3, space="room")
L("s1_announce", 0.5)
L("s1_alisa_2", 0.5)
L("s1_mark_3", 0.35)
M("s1_msg", 0.6)
S("sfx/vibrate.wav", 0, -12)
S("sfx/ping.wav", 0.5, -14)
S("music/m02_dread_long.wav", 0, -13, "music", fadeIn=0.2, end=8.0, fadeOut=1.0)
M("s1_face", 4.2)
S("sfx/riser.wav", -1.0, -16)
L("s1_mark_2", 0.9, space="room")
M("s1_cut", 1.0)
S("sfx/stinger.wav", 0, -6)
M("s2", 0.25)

# ───────────── СЦЕНА 2. ЛЕСТНИЦА ─────────────
S("sfx/footsteps_crowd.wav", 0, -16, "amb", fadeIn=0.3, end=30, fadeOut=2)
S("sfx/crowd.wav", 0, -26, "amb", fadeIn=1.0, end=24, fadeOut=2)
S("music/m03_stairs.wav", 0, -12, "music", fadeIn=0.6, end=27, fadeOut=0.25)
S("sfx/door_clank.wav", 1.4, -24)
M("s2_close", 8.5)
S("sfx/whoosh.wav", -0.4, -18)
S("sfx/footsteps_two.wav", 0, -16, end=14, fadeOut=1)
L("s2_mark_0", 0.6)
M("s2_galina_in", 0.5)
L("s2_galina_1", 0.3)
S("sfx/parrot.wav", 0.1, -16)
S("sfx/wings.wav", 0.2, -22)
L("s2_mark_1", 0.35)
L("s2_galina_2", 0.3)
L("s2_mark_2", 0.45)
L("s2_galina_3", 0.3)
S("sfx/parrot.wav", 0.15, -15)
M("s2_smile", 0.35)
M("s2_flicker", 1.5)
S("sfx/flicker.wav", 0, -10)
L("s2_galina_4", 1.0)
L("s2_mark_3", 0.3)
M("s2_end", 1.4)
S("sfx/door_clank.wav", 0, -10)
M("s3", 0.3)

# ───────────── СЦЕНА 3. ШАХМАТИСТ ─────────────
S("sfx/vent.wav", 0, -22, "amb", fadeIn=1.0, end=120)
S("sfx/crowd.wav", 0.5, -28, "amb", fadeIn=2.0, end=27, fadeOut=2)
S("sfx/siren_muffled.wav", 0, -26, "amb", fadeIn=2.0, end=40, fadeOut=0.5)
S("music/m04_shelter.wav", 0.5, -14, "music", fadeIn=3.0, end=60, fadeOut=2)
M("s3_chess", 4.5)
S("sfx/ui_tick.wav", 1.6, -20)
M("s3_back", 3.0)
L("s3_galina_1", 0.4)
L("s3_lev_1", 0.6)
M("s3_notice", 0.8)
M("s3_phones", 1.4)
S("sfx/ui_tick.wav", 0, -22)
M("s3_phones_end", 3.2)
L("s3_mark_1", 0.3)
M("s3_lookup", 0.4)
L("s3_lev_2", 0.5)
M("s3_phones2", 0.4)
S("sfx/heartbeat.wav", 0, -20, end=4)
L("s3_lev_3", 0.9)
M("s3_end", 1.2)
M("s4", 0.0)

# ───────────── СЦЕНА 4. ЛОЖНАЯ ТРЕВОГА ─────────────
S("sfx/ping.wav", 0.4, -18)
L("s4_announce", 0.8)
S("music/m05_relief.wav", -0.6, -12, "music")
S("sfx/cheer.wav", -0.2, -16, "amb")
M("s4_rise", 0.2)
L("s4_galina_1", 0.5)
S("sfx/footsteps_crowd.wav", 0, -22, "amb", end=8, fadeOut=1.5)
M("s4_walk", 0.3)
L("s4_lev_1", 0.6)
M("s4_listen", 0.3)
S("sfx/siren_muffled.wav", 0, -18, "amb", fadeIn=0.6, end=6.5, fadeOut=0.5)
L("s4_mark_1", 1.2)
M("s4_impact", 1.4)
S("sfx/explosion.wav", 0, -2)
S("sfx/dust.wav", 0.3, -14)
S("sfx/tinnitus.wav", 0.5, -18)
M("s4_dark", 0.5)
S("sfx/breathing_fast.wav", 0.4, -20, end=3.4, fadeOut=0.8)
S("sfx/heartbeat.wav", 0.6, -18, end=3.4, fadeOut=0.8)
M("s5", 3.6)

# ───────────── СЦЕНА 5. ГОЛОС ─────────────
S("music/m02_dread_long.wav", 0.5, -18, "music", fadeIn=3.0, end=30, fadeOut=1.5)
S("sfx/breathing.wav", 0.3, -26, end=8, fadeOut=2)
L("s5_alisa_1", 2.0)
L("s5_mark_1", 0.45)
M("s5_msg", 0.8)
S("sfx/vibrate.wav", 0, -12)
S("sfx/ping.wav", 0.4, -14)
M("s5_msg_end", 4.0)
M("s5_knock", 0.7)
for k in range(3):
    S("sfx/knock.wav", k * 1.0, -6)
M("s5_knock_end", 3.0)
L("s5_rescuer_1", 0.5)
M("s5_galina_go", 0.5)
L("s5_mark_2", 0.9)
M("s5_knock2", 0.9)
S("sfx/knock.wav", 0, -6)
L("s5_double_1", 1.4)
L("s5_alisa_2", 1.0)
M("s5_turn", 0.3)
S("sfx/heartbeat.wav", 0, -17, end=4.5, fadeOut=1)
M("s6", 3.2)

# ───────────── СЦЕНА 6. ДВОЙНИК ─────────────
S("sfx/monitor_on.wav", 0.3, -14)
S("sfx/static.wav", 0.4, -30, "amb", end=24, fadeOut=1)
S("music/m06_double.wav", 0.5, -12, "music", fadeIn=1.0)
M("s6_on", 0.3)
L("s6_lev_1", 0.8)
M("s6_push", 0.6)
S("sfx/whoosh.wav", 0, -22)
S("sfx/static.wav", 0, -22, end=8.5, fadeOut=0.5)
L("s6_double_1", 1.6)
L("s6_mark_1", 1.0)
M("s6_back", 0.8)
L("s6_lev_2", 0.8)
M("s7", 1.2)

# ───────────── СЦЕНА 7. ЭТАП ПЕРВЫЙ ─────────────
S("sfx/phones_chorus.wav", 0, -8)
S("music/m07_stage.wav", 0, -8, "music")
M("s7_stage", 0)
M("s7_back", 5.0)
L("s7_alisa_1", 1.0)
M("s7_black", 1.5)
M("s7_knock", 2.2)
for k in range(3):
    S("sfx/knock.wav", k * 1.25, -12)
M("s7_title", 4.6)
M("end", 5.5)

tl = dict(name="film", duration=round(cur, 2), dialogue=dialogue, sfx=sfx, marks=marks)
json.dump(tl, open(os.path.join(ROOT, "src", "data", "film.json"), "w"), ensure_ascii=False, indent=1)
print("duration", round(cur, 2), "s; scenes:", {k: v for k, v in marks.items() if len(k) == 2})
