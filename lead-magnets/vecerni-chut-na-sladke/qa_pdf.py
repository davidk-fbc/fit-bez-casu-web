#!/usr/bin/env python3
"""Validate the evening sweet-cravings lead magnet and build its contact sheet."""

from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parent
PDF = ROOT / "fit-bez-casu-co-delat-kdyz-te-vecer-honi-chut-na-sladke.pdf"
HTML = ROOT / "index.html"
CONTACT_SHEET = ROOT / "contact-sheet.png"

EXPECTED_TEXT = [
    "Co dělat, když tě večer honí chuť na sladké",
    "Hlad",
    "Stres",
    "Únava",
    "Zvyk",
    "Nenech se večer dohnat velkým hladem",
    "Poskládej si sytější hlavní jídla",
    "Nezakazuj si sladké automaticky",
    "Měj připravenou jednoduchou večerní variantu",
    "Najdi svůj nejčastější spouštěč",
    "Co u tebe spouští večerní chutě nejčastěji?",
    "Jídelníček pro zdravé hubnutí",
    "Osobní rozbor jídelníčku",
    "web.fitbezcasu.cz",
    "@fitbezcasu",
]

SELF_CHECK_TEXT = [
    "Přes den často nestíhám jíst.",
    "Mezi obědem a večeří mám dlouhou pauzu.",
    "Večer bych si dala i normální jídlo, nejen sladké.",
    "Sladké si dávám hlavně po náročném dni.",
    "Večer bývám výrazně unavená.",
    "Sladké patří k televizi nebo seriálu.",
    "Často jím přímo z balení.",
    "Přes den se snažím jíst co nejméně.",
    "Když si sladké zakážu, myslím na něj ještě víc.",
    "Chuť přichází skoro vždy ve stejnou dobu.",
]

EXPECTED_LINKS = {
    "https://www.fitbezcasu.cz/jidelnicek-pro-zdrave-hubnuti",
    "https://web.fitbezcasu.cz/nabidka-podpory/osobni-rozbor-jidelnicku",
    "https://web.fitbezcasu.cz/",
    "https://www.instagram.com/fitbezcasu/",
}

FORBIDDEN_SOURCE = [
    "—",
    "nemáš pevnou vůli",
    "nemáš disciplínu",
    "musíš se ovládat",
    "nastartuje metabolismus",
    "chutě zmizí",
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
    thumb_width = 780
    thumbs = [
        image.resize(
            (thumb_width, round(image.height * thumb_width / image.width)),
            Image.Resampling.LANCZOS,
        )
        for image in images
    ]
    columns = 3
    rows = (len(thumbs) + columns - 1) // columns
    gap = 36
    label_height = 34
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
    check(len(re.findall(r'<section\s+class="page(?:\s|\")', html)) == 9, "Zdroj nemá přesně 9 stran.")
    for forbidden in FORBIDDEN_SOURCE:
        check(forbidden.casefold() not in html.casefold(), f"Ve zdroji zůstal zakázaný text: {forbidden}")

    reader = PdfReader(PDF)
    check(len(reader.pages) == 9, f"PDF má {len(reader.pages)} stran místo 9.")
    for page_number, page in enumerate(reader.pages, start=1):
        width = float(page.mediabox.width)
        height = float(page.mediabox.height)
        check(590 <= width <= 600 and 838 <= height <= 845, f"Strana {page_number} není A4.")

    text = normalize("\n".join(page.extract_text() or "" for page in reader.pages))
    check(len(text) > 6500, "PDF nemá dostatečnou textovou vrstvu.")
    compact_text = re.sub(r"\s+", "", text.casefold())
    for required in EXPECTED_TEXT:
        compact_required = re.sub(r"\s+", "", required.casefold())
        check(compact_required in compact_text, f"V PDF chybí povinný text: {required}")
    for statement in SELF_CHECK_TEXT:
        compact_statement = re.sub(r"\s+", "", statement.casefold())
        check(compact_statement in compact_text, f"V PDF chybí self-check tvrzení: {statement}")

    links = pdf_links(reader)
    check(EXPECTED_LINKS.issubset(links), f"V PDF chybí odkazy: {EXPECTED_LINKS - links}")

    fonts = pdf_fonts(reader)
    check(all(subtype == "/Type0" for subtype, _ in fonts), f"Nalezen jiný font než Type0: {fonts}")
    check(any("Inter" in name for _, name in fonts), "V PDF není vložený Inter.")
    check(any("Lora" in name for _, name in fonts), "V PDF není vložená Lora.")
    check(not any("Arial" in name for _, name in fonts), f"V PDF je Arial fallback: {fonts}")

    with tempfile.TemporaryDirectory(prefix="fbc-sweet-cravings-qa-") as temp_dir:
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
        check(len(page_files) == 9, "Render nevytvořil přesně 9 stran.")
        build_contact_sheet(page_files)

    print("QA OK: 9 A4 stran, text, 4 scénáře, 5 řešení, self-check, odkazy a fonty.")
    print(f"Fonty: {fonts}")
    print(f"Odkazy: {sorted(links)}")
    print(f"Contact sheet: {CONTACT_SHEET}")


if __name__ == "__main__":
    main()
