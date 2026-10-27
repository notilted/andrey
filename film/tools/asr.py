"""Распознавание русской речи (GigaAM v2) для контроля качества озвучки."""
import os, re
import numpy as np, soundfile as sf, sherpa_onnx

_D = os.path.join(os.environ.get("TTS_MODELS", os.path.expanduser("~/tts-models")),
                  "sherpa-onnx-nemo-transducer-giga-am-v2-russian-2025-04-19")
_rec = None


def norm(s):
    return re.sub(r"[^а-яё ]", " ", s.lower().replace("ё", "е").replace("-", " ")).split()


def recognize(x, sr):
    global _rec
    if _rec is None:
        _rec = sherpa_onnx.OfflineRecognizer.from_transducer(
            encoder=f"{_D}/encoder.int8.onnx", decoder=f"{_D}/decoder.onnx", joiner=f"{_D}/joiner.onnx",
            tokens=f"{_D}/tokens.txt", model_type="nemo_transducer", num_threads=4)
    x = np.asarray(x, np.float32)
    if x.ndim > 1:
        x = x.mean(1)
    if sr != 16000:
        x = np.interp(np.arange(0, len(x), sr / 16000), np.arange(len(x)), x).astype(np.float32)
    s = _rec.create_stream(); s.accept_waveform(16000, x); _rec.decode_stream(s)
    return s.result.text


def accuracy(text, hyp):
    """Доля слов сценария, найденных в распознанном (слитное «не обычная» тоже засчитывается)."""
    ref, h = norm(text), norm(hyp)
    joined = "".join(h)
    return sum(w in h or w in joined for w in ref) / max(1, len(ref))


def score_file(path, text):
    x, sr = sf.read(path, dtype="float32")
    hyp = recognize(x, sr)
    return accuracy(text, hyp), hyp
