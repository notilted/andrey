# Промпты для ИИ

Бесплатные генераторы: Ideogram, Leonardo, Bing Image Creator, Шедеврум (Яндекс), Kandinsky (Сбер).
Чтобы брелок хорошо напечатался: **плоские цвета, толстые тёмные линии, без мелких деталей, белый или прозрачный фон.**

## Базовый стиль (добавляй в конец любого промпта)

```
kawaii sticker style, thick dark outline, flat colors, simple shapes, cute blush cheeks,
centered, white background, acrylic keychain design, no text
```

## Новые дизайны

```
a chubby cat holding a cup of hot chocolate, eyes closed happily, + базовый стиль
a capybara wearing a school backpack, + базовый стиль
a sleepy hamster inside a dumpling, + базовый стиль
a frog in a hoodie playing a video game, + базовый стиль
a seagull stealing french fries, + базовый стиль
a tiny ghost holding a heart, + базовый стиль
a cup of bubble tea with a cute face, + базовый стиль
a sad little cloud raining on itself, + базовый стиль
```

**Знаки зодиака** (12 штук, коллекция):
```
aries zodiac as a fluffy baby ram in a hoodie, + базовый стиль
```
(меняй на: taurus — bull calf, gemini — two kittens, cancer — crab with sunglasses и т.д.)

**Подмосковная коллекция:**
```
a pigeon wearing a winter fur hat with ear flaps (ushanka), + базовый стиль
a pigeon in a puffer jacket waiting at a bus stop, + базовый стиль
a crow holding a shawarma wrap, mischievous look, + базовый стиль
```

## Портрет питомца по фото

Нужен генератор, который принимает фото (image-to-image), например Leonardo или Ideogram с загрузкой референса.

```
turn this pet photo into a cute kawaii cartoon portrait, keep the same fur colors and markings,
big shiny eyes, round chubby face, thick dark outline, flat colors, white background,
acrylic keychain design, head and shoulders only
```

**Важно:** ИИ часто путает окрас и пятна. Перед тем как показывать клиенту, сравни с фото и поправь цвета (в Figma, Canva или Krita). Если ИИ не справился — обведи фото вручную в Figma по образцу дизайнов из `designs/`.

## Подготовка к печати

1. Убери фон (remove.bg или инструмент в Canva).
2. Добавь белую обводку 2–3 мм вокруг — по ней типография режет акрил.
3. Сохрани в высоком разрешении: PNG 300 dpi (≈ 700×700 px на 6 см) или вектор SVG/PDF.

## Тексты с помощью ИИ

Можешь попросить меня (Claude):
- «Напиши 5 вариантов объявления на Авито для брелока [название]»
- «Придумай сценарий TikTok на 15 секунд для брелока [название]»
- «Ответь покупателю, который просит скидку»
