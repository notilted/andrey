"""«11 дней каникул»: python3 tools/timeline_ny1.py -> src/data/ny1.json"""
from narr import B, M, N, S, load, marks, save

load("ny1_narration.json")
M("start", 0)
N("ny1_01", 0.05, at=[("hook", None), ("range", "С тридцать")])
N("ny1_02", 0.3, at=[("plan", None), ("gym", "спортзал"), ("eng", "английский"), ("sleep", "выспаться"), ("todo", "и наконец")])
N("ny1_03", 0.3, at=[("d1", None), ("d2", "День второй"), ("d3", "День третий")])
N("ny1_04", 0.3, at=[("jan7", None), ("st1", "Спортзал"), ("st2", "Английский"), ("st3", "Сериал")])
N("ny1_05", 0.3, at=[("eve", None), ("busy", "он был")])
N("ny1_06", 0.4, at=[("work", None), ("sub", "Подпишись")])
M("end", 2.2)
m = marks
S("music/m11_money.wav", 0, -20, "music", fadeIn=0.2, length=m["jan7"], fadeOut=0.5)
S("sfx/chime.wav", 0.05, -12)
S("sfx/pencil.wav", m["gym"], -16); S("sfx/pencil.wav", m["eng"], -16); S("sfx/pencil.wav", m["sleep"], -16); S("sfx/pencil.wav", m["todo"], -16)
S("sfx/page_flip.wav", m["d1"], -14); S("sfx/page_flip.wav", m["d2"], -14); S("sfx/page_flip.wav", m["d3"], -14)
S("sfx/tv_murmur.wav", m["jan7"], -26, length=m["work"] - m["jan7"], fadeOut=0.5)
S("sfx/pop.wav", m["st1"] + 0.4, -14); S("sfx/pop.wav", m["st2"] + 0.4, -14); S("sfx/cash.wav", m["st3"] + 0.8, -14)
S("music/m09_sad.wav", m["eve"], -21, "music", fadeIn=0.5, length=m["work"] - m["eve"], fadeOut=0.4)
S("sfx/stinger.wav", m["work"] + 0.3, -12)
S("music/m10_run.wav", m["work"], -19, "music", fadeIn=0.3, length=m["end"] - m["work"], fadeOut=0.8)
save("ny1")
