# «17 МИНУТ» — анимационный триллер (Remotion)

Статус: **этап 2 — образец первой сцены на согласование** (`output/17_minut_sample.mp4`, 15,5 с, 1080×1920, 30 fps).

## Структура
- `film/src/components` — персонажи, город, панельный дом, квартира, телефон и оповещение, субтитры, зерно.
- `film/src/scenes` — сцены; `film/src/data/*.json` — таймлайн (реплики, звуки) — общий для видео и звука.
- `film/tools/voice.py` — озвучка, `tools/qc_asr.py` — проверка разборчивости, `tools/sfx.py` — синтез музыки и SFX, `tools/mix.py` — сведение.
- `script/` — реплики (`lines.json`), визуальный стандарт.
- `output/` — готовые MP4.

## Повторный рендер
```bash
pip install piper-tts pyworld soundfile numpy sherpa-onnx
# модели (GitHub-релизы sherpa-onnx): vits-piper-ru_RU-{dmitri,irina,ruslan,denis}-medium,
# sherpa-onnx-nemo-transducer-giga-am-v2-russian-2025-04-19 → в ~/tts-models (или $TTS_MODELS)
cd film && npm i
python3 tools/voice.py ../script/lines.json && python3 tools/qc_asr.py ../script/lines.json
python3 tools/sfx.py && python3 tools/mix.py src/data/sample.json
npm run render:sample      # браузер: REMOTION_BROWSER=/путь/к/chrome-headless-shell
```

## Озвучка — честно об ограничениях
ElevenLabs, OpenAI TTS, HuggingFace и Silero из этой среды недоступны (сетевая политика), ключей нет.
Использованы локальные нейросетевые голоса Piper (VITS) с обработкой тембра (WORLD) — не eSpeak,
но и не уровень актёров: эмоциональный диапазон ограничен. Конвейер готов к замене движка.
Вся музыка и SFX синтезированы в `tools/sfx.py` — сторонних материалов нет.
