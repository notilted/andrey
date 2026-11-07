"""Собирает site/index.html из template.html и дизайнов из ../designs.

Запуск: python3 build.py   (сначала tools/make_designs.py, если менял дизайны)
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
DESIGNS = HERE.parent / "designs"

rows = [l.split("|") for l in (DESIGNS / "index.txt").read_text(encoding="utf-8").split("\n") if l]
svg = {slug: (DESIGNS / f"{slug}.svg").read_text(encoding="utf-8") for slug, _, _ in rows}


def scoped(slug, suffix):
    # одинаковые id фильтров на одной странице ломают отрисовку — даём копиям свои id
    return svg[slug].replace(f"cut-{slug}", f"cut-{slug}-{suffix}")


catalog = [r for r in rows if r[2] != "На заказ"]
NEW = {"03-golub-v-ushanke", "04-vorona-s-shaurmoy"}

cards = []
for slug, name, coll in catalog:
    badge = '<span class="badge">новинка</span>' if slug in NEW else ""
    cards.append(f'''<article class="card" data-coll="{coll}">{badge}
        <div class="pic">{scoped(slug, "c")}</div>
        <div class="meta"><div><div class="coll">{coll}</div><h3>{name}</h3></div><span class="price">290 ₽</span></div>
        <button class="add" type="button" data-id="{slug}">В заказ</button>
      </article>''')

colls = []
for _, _, c in catalog:
    if c not in colls:
        colls.append(c)
filters = ['<button type="button" data-f="all" aria-pressed="true">Все</button>'] + [
    f'<button type="button" data-f="{c}" aria-pressed="false">{c}</button>' for c in colls]

rail = "".join(f'<div class="hang">{scoped(s, "r")}</div>' for s in
               ["01-kot-plaksa", "09-vash-pitomets", "03-golub-v-ushanke"])

items = [{"id": s, "name": n} for s, n, _ in catalog]

html = (HERE / "template.html").read_text(encoding="utf-8")
html = (html.replace("<!--CARDS-->", "\n      ".join(cards))
            .replace("<!--FILTERS-->", "\n      ".join(filters))
            .replace("<!--RAIL-->", rail)
            .replace("/*ITEMS*/[]", json.dumps(items, ensure_ascii=False)))
(HERE / "index.html").write_text(html, encoding="utf-8")
print("ok:", HERE / "index.html", f"{len(html) // 1024} KB")
