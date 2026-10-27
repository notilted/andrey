"""Общие функции таймлайна в формате рассказчика (серии «Трёх волн»).

N — кусок рассказа с битами анимации, привязанными к опорным фразам; B — немой бит;
M — маркер; S — звук в абсолютном времени; save — запись src/data/<name>.json.
"""
import json, os
import soundfile as sf

ROOT = os.path.join(os.path.dirname(__file__), "..")
SEGS = {}
dialogue, sfx, marks, beats = [], [], {}, {}
cur = 0.0


def load(script):
    SEGS.update({s["id"]: s for s in json.load(open(os.path.join(ROOT, "..", "script", script)))})


def dur(i):
    return sf.info(os.path.join(ROOT, "public", "voice", i + ".wav")).duration


def N(i, gap=0.4, at=None):
    global cur
    start = round(cur + gap, 2)
    d = dur(i)
    text = SEGS[i]["text"].replace("*", "")
    dialogue.append(dict(id=i, who="narrator", name="", start=start, caption=SEGS[i]["text"], space=None))
    pts = sorted([(name, start + (0 if a is None else text.index(a) / len(text)) * d) for name, a in at or []], key=lambda p: p[1])
    for k, (name, t0) in enumerate(pts):
        t1 = pts[k + 1][1] if k + 1 < len(pts) else start + d
        beats[name] = dict(start=round(t0, 2), dur=round(max(0.3, t1 - t0), 2))
        marks[name] = round(t0, 2)
    marks[i] = start
    cur = start + d
    marks[i + "_end"] = round(cur, 2)


def B(name, gap, d=0.8):
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


def save(name):
    tl = dict(name=name, duration=round(cur, 2), dialogue=dialogue, sfx=sfx, marks=marks, beats=beats)
    json.dump(tl, open(os.path.join(ROOT, "src", "data", name + ".json"), "w"), ensure_ascii=False, indent=1)
    print("duration", round(cur, 2), "s")
