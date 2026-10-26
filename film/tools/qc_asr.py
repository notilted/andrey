"""Контроль разборчивости: распознаёт реплики (GigaAM v2) и сравнивает с текстом."""
import json, os, re, sys
import numpy as np, soundfile as sf, sherpa_onnx

d = os.path.join(os.environ.get("TTS_MODELS", os.path.expanduser("~/tts-models")),
                 "sherpa-onnx-nemo-transducer-giga-am-v2-russian-2025-04-19")
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{d}/encoder.int8.onnx", decoder=f"{d}/decoder.onnx", joiner=f"{d}/joiner.onnx",
    tokens=f"{d}/tokens.txt", model_type="nemo_transducer", num_threads=4)
norm = lambda s: re.sub(r"[^а-яё ]", "", s.lower().replace("ё", "е")).split()
lines = json.load(open(sys.argv[1])); bad = 0
for l in lines:
    f = os.path.join(os.path.dirname(__file__), "..", "public", "voice", l["id"] + ".wav")
    if not os.path.exists(f):
        continue
    x, sr = sf.read(f, dtype="float32")
    if sr != 16000:
        x = np.interp(np.arange(0, len(x), sr / 16000), np.arange(len(x)), x).astype(np.float32)
    s = rec.create_stream(); s.accept_waveform(16000, x); rec.decode_stream(s)
    ref, hyp = norm(l["text"]), norm(s.result.text)
    ok = sum(w in hyp for w in ref) / max(1, len(ref))
    bad += ok < 0.8
    print(f"{'OK ' if ok >= 0.8 else 'BAD'} {ok:4.0%} {l['id']:18} | {s.result.text}")
sys.exit(1 if bad else 0)
