"""Генератор дизайнов брелоков KeyPet.

Каждый дизайн — векторный SVG: персонаж + толстый белый контур (как у акрилового
брелока) + отверстие под кольцо. Запуск:  python3 make_designs.py
Результат: ../designs/*.svg (для типографии и сайта).
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "designs"
INK = "#2b2233"  # цвет линий

W, H = 240, 280


def eye(x, y, r=7, shine=True):
    s = f'<circle cx="{x}" cy="{y}" r="{r}" fill="{INK}"/>'
    if shine:
        s += f'<circle cx="{x - r * .35}" cy="{y - r * .4}" r="{r * .38}" fill="#fff"/>'
    return s


def blush(x, y, rx=9, ry=5, c="#ff8fab"):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{c}" opacity=".75"/>'


def smile(x, y, w=8):
    return (f'<path d="M{x - w} {y} q{w / 2} {w * .7} {w} 0 q{w / 2} {w * .7} {w} 0" '
            f'fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>')


def label(text, y, size=17, fill=INK, bg="#fff3b0"):
    w = len(text) * size * .62 + 22
    return (f'<rect x="{120 - w / 2}" y="{y - size}" width="{w}" height="{size + 12}" rx="{(size + 12) / 2}" '
            f'fill="{bg}" stroke="{INK}" stroke-width="3"/>'
            f'<text x="120" y="{y + 1}" text-anchor="middle" font-family="Nunito, \'Arial Rounded MT Bold\', Arial, sans-serif" '
            f'font-weight="900" font-size="{size}" fill="{fill}">{text}</text>')


S = f'stroke="{INK}" stroke-width="4" stroke-linejoin="round"'

DESIGNS = {
    # 1. Плачущий кот-мем
    "01-kot-plaksa": ("Кот-плакса", "Мемы", f'''
      <path d="M58 118 L66 62 L98 92 Z" fill="#d9d4e3" {S}/>
      <path d="M182 118 L174 62 L142 92 Z" fill="#d9d4e3" {S}/>
      <path d="M66 74 L72 96 L88 92 Z" fill="#ffb3c6"/><path d="M174 74 L168 96 L152 92 Z" fill="#ffb3c6"/>
      <ellipse cx="120" cy="150" rx="74" ry="64" fill="#e9e5f0" {S}/>
      <ellipse cx="92" cy="140" rx="17" ry="19" fill="{INK}"/><ellipse cx="148" cy="140" rx="17" ry="19" fill="{INK}"/>
      <circle cx="86" cy="132" r="7" fill="#fff"/><circle cx="142" cy="132" r="7" fill="#fff"/>
      <circle cx="98" cy="148" r="3.5" fill="#fff"/><circle cx="154" cy="148" r="3.5" fill="#fff"/>
      <path d="M78 156 q-6 26 -2 44" fill="none" stroke="#7cc6fe" stroke-width="9" stroke-linecap="round"/>
      <path d="M162 156 q6 26 2 44" fill="none" stroke="#7cc6fe" stroke-width="9" stroke-linecap="round"/>
      <path d="M108 178 q12 -10 24 0" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
      <path d="M116 162 l4 4 l4 -4 Z" fill="#ff8fab" {S}/>
      {blush(80, 170)}{blush(160, 170)}'''),

    # 2. Пельмешек
    "02-pelmeshek": ("Пельмешек", "Еда с лицом", f'''
      <path d="M44 176 C44 110 92 92 120 92 C148 92 196 110 196 176 C170 196 70 196 44 176 Z" fill="#fff8ec" {S}/>
      <path d="M64 120 q8 -14 20 -6 M92 104 q10 -12 22 -2 M124 102 q12 -10 22 2 M156 112 q12 -8 20 6"
            fill="none" stroke="{INK}" stroke-width="3.5" stroke-linecap="round"/>
      {eye(98, 150, 8)}{eye(142, 150, 8)}
      {smile(120, 164, 7)}
      {blush(80, 166)}{blush(160, 166)}
'''),

    # 3. Голубь в ушанке (подмосковная коллекция)
    "03-golub-v-ushanke": ("Голубь в ушанке", "Подмосковье", f'''
      <ellipse cx="124" cy="180" rx="62" ry="46" fill="#a9b4c8" {S}/>
      <path d="M150 176 q30 -6 40 18 q-22 4 -40 -4 Z" fill="#8c98ae" {S}/>
      <path d="M96 196 q20 14 48 4" fill="none" stroke="#7a86a0" stroke-width="4" stroke-linecap="round"/>
      <circle cx="104" cy="130" r="44" fill="#b9c3d6" {S}/>
      <path d="M78 150 q26 22 56 0 q-4 16 -28 18 q-22 -2 -28 -18 Z" fill="#7fd1b9" opacity=".9"/>
      <path d="M60 118 C60 74 148 74 148 118 Z" fill="#8a5a44" {S}/>
      <rect x="56" y="110" width="96" height="18" rx="9" fill="#c99a7a" {S}/>
      <path d="M58 124 q-14 24 -2 40 q14 -6 14 -36 Z" fill="#c99a7a" {S}/>
      <path d="M150 124 q14 24 2 40 q-14 -6 -14 -36 Z" fill="#c99a7a" {S}/>
      <circle cx="104" cy="78" r="9" fill="#e85d75" {S}/>
      {eye(90, 140, 6)}{eye(122, 140, 6)}
      <path d="M100 150 l12 0 l-6 10 Z" fill="#f2a541" {S}/>
      <path d="M106 224 v10 M134 224 v10" stroke="#f2a541" stroke-width="5" stroke-linecap="round"/>'''),

    # 4. Ворона с шаурмой
    "04-vorona-s-shaurmoy": ("Ворона с шаурмой", "Подмосковье", f'''
      <ellipse cx="114" cy="176" rx="60" ry="50" fill="#3d3550" {S}/>
      <path d="M60 170 q-24 10 -24 34 q24 0 36 -18 Z" fill="#2f2840" {S}/>
      <circle cx="122" cy="122" r="40" fill="#463d5c" {S}/>
      <path d="M156 118 l30 8 l-30 10 Z" fill="#f2c94c" {S}/>
      <circle cx="134" cy="112" r="11" fill="#fff"/>{eye(137, 113, 6)}
      <path d="M118 98 l18 -6" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
      <g transform="rotate(-24 160 176)">
        <rect x="128" y="150" width="34" height="74" rx="14" fill="#f6e2b3" {S}/>
        <path d="M130 156 q16 -12 30 0 l0 10 q-15 -8 -30 0 Z" fill="#7dbb5a" {S}/>
        <path d="M134 160 l6 -10 l6 10 l6 -10 l6 10" fill="#e85d75" stroke="{INK}" stroke-width="2.5"/>
        <rect x="128" y="196" width="34" height="28" rx="6" fill="#ffffff" {S}/>
        <path d="M132 206 h26" stroke="#e85d75" stroke-width="3"/>
      </g>
      <path d="M96 224 v10 M120 226 v10" stroke="#f2c94c" stroke-width="5" stroke-linecap="round"/>'''),

    # 5. Сонный кот «Ещё 5 минут»
    "05-eshche-5-minut": ("Ещё 5 минут", "Надписи", f'''
      <path d="M50 176 C40 120 200 120 190 176 C186 212 54 212 50 176 Z" fill="#f4a261" {S}/>
      <path d="M70 140 L74 108 L96 128 Z" fill="#f4a261" {S}/>
      <path d="M140 128 L164 110 L166 142 Z" fill="#f4a261" {S}/>
      <path d="M100 136 q-6 -10 2 -20 M120 134 q-4 -12 4 -20 M140 138 q0 -12 8 -18" fill="none" stroke="#d97b3a" stroke-width="5" stroke-linecap="round"/>
      <path d="M92 164 q10 8 20 0 M132 164 q10 8 20 0" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
      <path d="M118 176 l4 4 l4 -4" fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>
      {blush(84, 180)}{blush(160, 180)}
      <path d="M186 186 q22 -2 18 -26" fill="none" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>
      <path d="M186 186 q22 -2 18 -26" fill="none" stroke="#f4a261" stroke-width="4" stroke-linecap="round"/>
      <text x="170" y="104" font-family="Nunito, Arial, sans-serif" font-weight="900" font-size="22" fill="#7b6cf6">z</text>
      <text x="186" y="84" font-family="Nunito, Arial, sans-serif" font-weight="900" font-size="28" fill="#7b6cf6">Z</text>
      {label("ещё 5 минут", 238, 18)}'''),

    # 6. Лягушка «Не трогай»
    "06-ne-trogay": ("Не трогай", "Надписи", f'''
      <ellipse cx="120" cy="168" rx="72" ry="52" fill="#8fd694" {S}/>
      <circle cx="82" cy="118" r="24" fill="#8fd694" {S}/><circle cx="158" cy="118" r="24" fill="#8fd694" {S}/>
      <circle cx="82" cy="118" r="14" fill="#fff" {S}/><circle cx="158" cy="118" r="14" fill="#fff" {S}/>
      <circle cx="86" cy="122" r="7" fill="{INK}"/><circle cx="154" cy="122" r="7" fill="{INK}"/>
      <path d="M66 104 l30 8 M174 104 l-30 8" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>
      <path d="M96 172 q24 -14 48 0" fill="none" stroke="{INK}" stroke-width="4.5" stroke-linecap="round"/>
      {blush(76, 162, 10, 6, "#ff8f8f")}{blush(164, 162, 10, 6, "#ff8f8f")}
      {label("не трогай", 238, 20, "#ffffff", "#e85d75")}'''),

    # 7. Клубничка
    "07-klubnichka": ("Клубничка", "Еда с лицом", f'''
      <path d="M120 222 C60 196 40 150 52 124 C64 98 100 104 120 112 C140 104 176 98 188 124 C200 150 180 196 120 222 Z" fill="#ff5d73" {S}/>
      <path d="M84 104 q-6 -20 16 -16 q4 -18 20 -6 q16 -12 20 6 q22 -4 16 16 q-36 14 -72 0 Z" fill="#5fbf6a" {S}/>
      <path d="M120 82 q2 -14 12 -18" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
      <g fill="#ffe08a"><ellipse cx="76" cy="140" rx="3" ry="4.5"/><ellipse cx="164" cy="140" rx="3" ry="4.5"/>
        <ellipse cx="90" cy="190" rx="3" ry="4.5"/><ellipse cx="150" cy="190" rx="3" ry="4.5"/>
        <ellipse cx="120" cy="204" rx="3" ry="4.5"/><ellipse cx="70" cy="168" rx="3" ry="4.5"/><ellipse cx="170" cy="168" rx="3" ry="4.5"/></g>
      {eye(102, 150, 8)}{eye(138, 150, 8)}
      <path d="M112 166 q8 8 16 0" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
      {blush(88, 168, 9, 5, "#ffb3c1")}{blush(152, 168, 9, 5, "#ffb3c1")}'''),

    # 8. Онигири
    "08-onigiri": ("Онигири", "Еда с лицом", f'''
      <path d="M120 82 C140 82 196 170 192 196 C188 220 52 220 48 196 C44 170 100 82 120 82 Z" fill="#ffffff" {S}/>
      <rect x="86" y="172" width="68" height="46" rx="6" fill="#2f3b33" {S}/>
      <path d="M92 182 h56" stroke="#4b5b50" stroke-width="3"/>
      {eye(100, 146, 7)}{eye(140, 146, 7)}
      <path d="M114 158 q6 6 12 0" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linecap="round"/>
      {blush(86, 160)}{blush(154, 160)}
      <circle cx="96" cy="110" r="3" fill="#f2e8d5"/><circle cx="150" cy="128" r="3" fill="#f2e8d5"/><circle cx="76" cy="178" r="3" fill="#f2e8d5"/>'''),

    # 9. Шаблон «Ваш питомец»
    "09-vash-pitomets": ("Ваш питомец", "На заказ", f'''
      <path d="M62 118 L70 64 L100 94 Z M178 118 L170 64 L140 94 Z" fill="#fde2b8" {S}/>
      <ellipse cx="120" cy="152" rx="72" ry="62" fill="#fde2b8" {S}/>
      <path d="M86 128 q-30 30 -10 70 q20 -40 10 -70 Z" fill="#c98b5a" opacity=".85"/>
      {eye(96, 146, 9)}{eye(144, 146, 9)}
      <ellipse cx="120" cy="166" rx="9" ry="6" fill="{INK}"/>
      <path d="M120 172 v8 M110 184 q10 8 20 0" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linecap="round"/>
      {blush(80, 176)}{blush(160, 176)}
      {label("твой питомец", 238, 17, INK, "#c7f0ff")}'''),
}


def build(slug, art):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
  <defs>
    <filter id="cut-{slug}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="bl"/>
      <feComponentTransfer in="bl" result="fat"><feFuncA type="linear" slope="14" intercept="-0.6"/></feComponentTransfer>
      <feFlood flood-color="#ffffff"/><feComposite in2="fat" operator="in" result="white"/>
      <feComponentTransfer in="bl" result="edge0"><feFuncA type="linear" slope="30" intercept="-0.3"/></feComponentTransfer>
      <feFlood flood-color="#d8d0e4"/><feComposite in2="edge0" operator="in" result="edge"/>
      <feGaussianBlur in="edge0" stdDeviation="5" result="b"/><feOffset in="b" dy="6" result="bo"/>
      <feFlood flood-color="#2b2233" flood-opacity=".18"/><feComposite in2="bo" operator="in" result="shadow"/>
      <feMerge><feMergeNode in="shadow"/><feMergeNode in="edge"/><feMergeNode in="white"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <g filter="url(#cut-{slug})">
    <circle cx="120" cy="44" r="16" fill="#ffffff" stroke="{INK}" stroke-width="4"/>
    <rect x="114" y="56" width="12" height="52" fill="#ffffff"/>
    {art}
  </g>
  <circle cx="120" cy="44" r="7" fill="#f3eff8" stroke="#bdb3cc" stroke-width="2"/>
  <circle cx="120" cy="22" r="17" fill="none" stroke="#b8b2c2" stroke-width="5"/>
  <circle cx="120" cy="22" r="17" fill="none" stroke="#ece8f2" stroke-width="2" stroke-dasharray="10 14"/>
</svg>
'''


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    index = []
    for slug, (name, coll, art) in DESIGNS.items():
        (OUT / f"{slug}.svg").write_text(build(slug, art), encoding="utf-8")
        index.append(f"{slug}|{name}|{coll}")
    (OUT / "index.txt").write_text("\n".join(index) + "\n", encoding="utf-8")
    print(f"ok: {len(DESIGNS)} designs -> {OUT}")
