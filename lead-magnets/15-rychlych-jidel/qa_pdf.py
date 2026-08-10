#!/usr/bin/env python3
"""Validate the exported lead magnet and build its final contact sheet."""

from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parent
PDF = ROOT / "fit-bez-casu-15-rychlych-jidel-kdyz-nestihas.pdf"
HTML = ROOT / "index.html"
CONTACT_SHEET = ROOT / "contact-sheet.png"

RECIPE_TITLES = [
    "Skyr miska s vločkami a ovocem",
    "Vaječný toast s cottage a rajčetem",
    "Jablečná kaše z mikrovlnky",
    "Cottage miska s ředkvičkami a chlebem",
    "Kefírové smoothie s banánem",
    "Jablko s jogurtovým dipem",
    "Kuskus s tuňákem a křupavou zeleninou",
    "Kuřecí tortilla s hummusem",
    "Rýže s vejcem a hráškem z jedné pánve",
    "Těstoviny se špenátem a cottage",
    "Cizrnová pánev s fetou a rajčaty",
    "Bramborová miska s tuňákem a jogurtem",
    "Kakaový tvarohový krém s malinami",
    "Banánové lívanečky ze tří surovin",
    "Jablečný crumble z pánve",
]

EXPECTED_LINKS = {
    "https://www.fitbezcasu.cz/jidelnicek-pro-zdrave-hubnuti",
    "https://web.fitbezcasu.cz/",
    "https://www.instagram.com/fitbezcasu/",
}

FORBIDDEN_TEXT = [
    "02 / 09",
    "03 / 09",
    "04 / 09",
    "05 / 09",
    "06 / 09",
    "07 / 09",
    "08 / 09",
    "Snídaně 01 až 03",
    "Svačiny 04 až 06",
    "Obědy 07 až 09",
    "Večeře 10 až 12",
    "Dezerty 13 až 15",
    "Kliknutím se otevře veřejná stránka",
]


def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


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
    source_titles = re.findall(r'<h3 class="recipe-title">([^<]+)</h3>', html)
    check(source_titles == RECIPE_TITLES, "Zdroj neobsahuje přesně očekávaných 15 receptů.")

    reader = PdfReader(PDF)
    check(len(reader.pages) == 9, f"PDF má {len(reader.pages)} stran místo 9.")
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    normalized_text = re.sub(r"\s+", " ", text)
    check(len(text.strip()) > 5000, "PDF nemá dostatečnou textovou vrstvu.")
    for title in RECIPE_TITLES:
        check(title in normalized_text, f"V PDF chybí recept: {title}")
    check(text.count("Záměna:") == 15, "PDF neobsahuje přesně 15 bloků Záměna.")
    for required in [
        "Máš inspiraci. Teď potřebuješ plán, který tě povede dál.",
        "Jídelníčku pro zdravé hubnutí",
        "web.fitbezcasu.cz",
        "@fitbezcasu",
    ]:
        check(required in normalized_text, f"V PDF chybí povinný text: {required}")
    for forbidden in FORBIDDEN_TEXT:
        check(forbidden not in text, f"V PDF zůstal odstraněný text: {forbidden}")

    links = pdf_links(reader)
    check(EXPECTED_LINKS.issubset(links), f"V PDF chybí odkazy: {EXPECTED_LINKS - links}")

    fonts = pdf_fonts(reader)
    check(all(subtype == "/Type0" for subtype, _ in fonts), f"Nalezen jiný font než Type0: {fonts}")
    check(any("Inter" in name for _, name in fonts), "V PDF není vložený Inter.")
    check(any("Lora" in name for _, name in fonts), "V PDF není vložená Lora.")

    with tempfile.TemporaryDirectory(prefix="fbc-pdf-qa-") as temp_dir:
        prefix = Path(temp_dir) / "page"
        subprocess.run(
            ["pdftoppm", "-png", "-r", "200", str(PDF), str(prefix)],
            check=True,
            capture_output=True,
            text=True,
        )
        page_files = sorted(
            Path(temp_dir).glob("page-*.png"),
            key=lambda path: int(path.stem.split("-")[-1]),
        )
        check(len(page_files) == 9, "Render nevytvořil přesně 9 stran.")
        build_contact_sheet(page_files)

    print("QA OK: 9 stran, 15 receptů, textová vrstva, odkazy a vložené fonty.")
    print(f"Contact sheet: {CONTACT_SHEET}")


if __name__ == "__main__":
    main()
