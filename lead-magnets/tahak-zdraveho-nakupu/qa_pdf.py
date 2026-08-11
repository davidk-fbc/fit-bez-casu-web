#!/usr/bin/env python3
"""Validate the healthy-shopping guide and build a 200 DPI contact sheet."""

from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parent
PDF = ROOT / "fit-bez-casu-tahak-zdraveho-nakupu.pdf"
HTML = ROOT / "index.html"
CONTACT_SHEET = ROOT / "contact-sheet.png"

EXPECTED_TEXT = [
    "Tahák zdravého nákupu",
    "Co mít doma, když chceš hubnout bez stresu",
    "Bílkoviny",
    "Přílohy",
    "Zelenina",
    "Ovoce",
    "Rychlá snídaně",
    "Rychlá svačina",
    "Nouzová jídla",
    "Co mít v mrazáku",
    "Něco sladkého",
    "Můj rychlý nákupní checklist",
    "Jídelníček pro zdravé hubnutí",
    "web.fitbezcasu.cz",
    "@fitbezcasu",
]

CHECKLIST_CATEGORIES = [
    "Bílkoviny",
    "Přílohy",
    "Zelenina",
    "Ovoce",
    "Snídaně",
    "Svačiny",
    "Nouzové jídlo",
    "Mrazák",
    "Něco sladkého",
]

EXPECTED_LINKS = {
    "https://www.fitbezcasu.cz/jidelnicek-pro-zdrave-hubnuti",
    "https://web.fitbezcasu.cz/",
    "https://www.instagram.com/fitbezcasu/",
}

FORBIDDEN_SOURCE = [
    "—",
    "‑",
    "cheat meal",
    "detox",
    "spalovač",
    "spaluje tuk",
    "zrychlí metabolismus",
    "sacharidy večer škodí",
    "povolené potraviny",
    "zakázané potraviny",
]


def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def pdf_links(reader: PdfReader) -> set[str]:
    links: set[str] = set()
    for page in reader.pages:
        for annotation in page.get("/Annots") or []:
            obj = annotation.get_object()
            uri = (obj.get("/A") or {}).get("/URI")
            if uri:
                links.add(str(uri))
    return links


def pdf_fonts(reader: PdfReader) -> list[tuple[str, str]]:
    fonts: set[tuple[str, str]] = set()
    for page in reader.pages:
        resources = page.get("/Resources") or {}
        for font in (resources.get("/Font") or {}).values():
            obj = font.get_object()
            fonts.add((str(obj.get("/Subtype")), str(obj.get("/BaseFont"))))
    return sorted(fonts)


def build_contact_sheet(page_files: list[Path]) -> None:
    images = [Image.open(path).convert("RGB") for path in page_files]
    thumb_width = 620
    thumbs = [
        image.resize(
            (thumb_width, round(image.height * thumb_width / image.width)),
            Image.Resampling.LANCZOS,
        )
        for image in images
    ]
    columns = 4
    rows = (len(thumbs) + columns - 1) // columns
    gap = 32
    label_height = 30
    cell_height = max(image.height for image in thumbs) + label_height
    sheet = Image.new(
        "RGB",
        (gap + columns * (thumb_width + gap), gap + rows * (cell_height + gap)),
        (233, 233, 240),
    )
    draw = ImageDraw.Draw(sheet)
    for index, image in enumerate(thumbs):
        x = gap + (index % columns) * (thumb_width + gap)
        y = gap + (index // columns) * (cell_height + gap)
        sheet.paste(image, (x, y))
        draw.text((x, y + image.height + 6), str(index + 1), fill=(45, 45, 52))
    sheet.save(CONTACT_SHEET, optimize=True)


def main() -> None:
    check(PDF.is_file(), f"Chybí PDF: {PDF}")
    check(HTML.is_file(), f"Chybí HTML: {HTML}")

    html = HTML.read_text(encoding="utf-8")
    check(len(re.findall(r'<section\s+class="page(?:\s|\")', html)) == 8, "Zdroj nemá přesně 8 stran.")
    check(html.count('class="shopping-grid"') == 1, "Zdroj nemá přesně jeden nákupní checklist.")
    check(html.count('class="write-line"') == 27, "Checklist nemá 27 doplnitelných řádků.")
    for forbidden in FORBIDDEN_SOURCE:
        check(forbidden.casefold() not in html.casefold(), f"Ve zdroji zůstal zakázaný text: {forbidden}")
    for category in CHECKLIST_CATEGORIES:
        check(category.casefold() in html.casefold(), f"Ve zdroji chybí kategorie: {category}")

    reader = PdfReader(PDF)
    check(len(reader.pages) == 8, f"PDF má {len(reader.pages)} stran místo 8.")
    for page_number, page in enumerate(reader.pages, start=1):
        width = float(page.mediabox.width)
        height = float(page.mediabox.height)
        check(590 <= width <= 600 and 838 <= height <= 845, f"Strana {page_number} není A4.")

    text = normalize("\n".join(page.extract_text() or "" for page in reader.pages))
    check(len(text) > 5000, "PDF nemá dostatečnou textovou vrstvu.")
    compact_text = re.sub(r"\s+", "", text.casefold())
    for required in EXPECTED_TEXT:
        compact_required = re.sub(r"\s+", "", required.casefold())
        check(compact_required in compact_text, f"V PDF chybí povinný text: {required}")

    links = pdf_links(reader)
    check(EXPECTED_LINKS.issubset(links), f"V PDF chybí odkazy: {EXPECTED_LINKS - links}")

    fonts = pdf_fonts(reader)
    check(all(subtype == "/Type0" for subtype, _ in fonts), f"Nalezen jiný font než Type0: {fonts}")
    check(any("Inter" in name for _, name in fonts), "V PDF není vložený Inter.")
    check(any("Lora" in name for _, name in fonts), "V PDF není vložená Lora.")
    check(not any("Arial" in name for _, name in fonts), f"V PDF je Arial fallback: {fonts}")

    with tempfile.TemporaryDirectory(prefix="fbc-shopping-guide-qa-") as temp_dir:
        prefix = Path(temp_dir) / "page"
        completed = subprocess.run(
            ["pdftoppm", "-png", "-r", "200", str(PDF), str(prefix)],
            check=True,
            capture_output=True,
            text=True,
        )
        check(not completed.stderr.strip(), f"Render hlásí chyby: {completed.stderr}")
        page_files = sorted(
            Path(temp_dir).glob("page-*.png"),
            key=lambda path: int(path.stem.split("-")[-1]),
        )
        check(len(page_files) == 8, "Render nevytvořil přesně 8 stran.")
        build_contact_sheet(page_files)

    print("QA OK: 8 A4 stran, text, 9 kategorií, checklist, CTA, odkazy a fonty.")
    print(f"Fonty: {fonts}")
    print(f"Odkazy: {sorted(links)}")
    print(f"Contact sheet: {CONTACT_SHEET}")


if __name__ == "__main__":
    main()
