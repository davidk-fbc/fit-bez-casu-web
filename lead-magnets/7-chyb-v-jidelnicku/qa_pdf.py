#!/usr/bin/env python3
"""Automatická kontrola výsledného PDF a vytvoření kontaktního náhledu."""

from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

import pdfplumber
from PIL import Image, ImageDraw
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parent
PDF = ROOT / "fit-bez-casu-7-chyb-v-jidelnicku-ktere-mohou-brzdit-hubnuti.pdf"
HTML = ROOT / "index.html"
CSS = ROOT / "styles.css"
CONTACT_SHEET = ROOT / "contact-sheet.png"
EXPECTED_PAGES = 10

EXPECTED_TEXT = [
    "7 chyb v jídelníčku, které mohou brzdit hubnutí",
    "Nemusíš dělat všechno špatně, aby se výsledky nehýbaly tak, jak čekáš.",
    "Přes den jíš málo a večer tě dožene hlad",
    "V jídlech máš málo bílkovin",
    "Mezi jídly máš příliš dlouhé pauzy",
    "Část energie vypiješ, aniž by sis to moc uvědomovala",
    "Máš málo zeleniny a dalších zdrojů vlákniny",
    "Jíš „zdravě“, ale množství nemusí odpovídat tvému cíli",
    "Večery nebo víkendy vypadají úplně jinak než zbytek týdne",
    "Kde se poznáváš nejvíc?",
    "Neměň všechno najednou",
    "Osobní rozbor jídelníčku",
    "Zjisti, co má smysl změnit právě u tebe.",
    "web.fitbezcasu.cz",
    "@fitbezcasu",
]

EXPECTED_LINKS = {
    "https://web.fitbezcasu.cz/nabidka-podpory/osobni-rozbor-jidelnicku",
    "https://www.fitbezcasu.cz/jidelnicek-pro-zdrave-hubnuti",
    "https://web.fitbezcasu.cz/",
    "https://www.instagram.com/fitbezcasu/",
}

FORBIDDEN = [
    "—",
    "‑",
    "bílkoviny zrychlí metabolismus",
    "bez bílkovin nezhubneš",
    "sacharidy večer",
    "musíš jíst každé 3 hodiny",
    "svačina je nutná",
    "sladké blokuje hubnutí",
    "zelenina spaluje tuk",
    "tekuté kalorie se nepočítají",
    "tohle je důvod, proč nehubneš",
    "diagnóza",
]


def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def normalized(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def collect_links(reader: PdfReader) -> set[str]:
    links: set[str] = set()
    for page in reader.pages:
        for annotation_ref in page.get("/Annots", []):
            annotation = annotation_ref.get_object()
            action = annotation.get("/A")
            if action and action.get("/URI"):
                links.add(str(action["/URI"]))
    return links


def collect_fonts(reader: PdfReader) -> dict[str, str]:
    fonts: dict[str, str] = {}
    for page in reader.pages:
        resources = page.get("/Resources", {})
        for ref in resources.get("/Font", {}).values():
            font = ref.get_object()
            name = str(font.get("/BaseFont", "unknown"))
            subtype = str(font.get("/Subtype", "unknown"))
            fonts[name] = subtype
    return fonts


def make_contact_sheet(rendered: list[Path]) -> None:
    thumbs: list[Image.Image] = []
    for page_number, path in enumerate(rendered, start=1):
        image = Image.open(path).convert("RGB")
        image.thumbnail((420, 594), Image.Resampling.LANCZOS)
        tile = Image.new("RGB", (450, 640), "white")
        tile.paste(image, ((450 - image.width) // 2, 28))
        ImageDraw.Draw(tile).text((18, 610), f"Strana {page_number}", fill="#1b2740")
        thumbs.append(tile)

    columns = 4
    rows = (len(thumbs) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * 450, rows * 640), "#dfe9f7")
    for index, thumb in enumerate(thumbs):
        sheet.paste(thumb, ((index % columns) * 450, (index // columns) * 640))
    sheet.save(CONTACT_SHEET, optimize=True)


def main() -> None:
    check(PDF.exists(), f"Chybí PDF: {PDF}")
    html = HTML.read_text(encoding="utf-8")
    css = CSS.read_text(encoding="utf-8")
    source = html + "\n" + css

    check(len(re.findall(r'<section\s+class="page(?:\s|\")', html)) == EXPECTED_PAGES, "Zdroj nemá 10 stran.")
    check(html.count('class="mistake-block') == 7, "Zdroj nemá přesně 7 bloků chyb.")
    for number in range(1, 8):
        check(html.count(f'data-mistake="{number:02d}"') == 1, f"Chybí nebo se opakuje chyba {number:02d}.")
    check(html.count('class="check-statement"') == 14, "Sebekontrola nemá 14 tvrzení.")
    check(html.count('class="first-step"') == 7, "Souhrn nemá 7 prvních kroků.")
    for phrase in FORBIDDEN:
        check(phrase.lower() not in source.lower(), f"Nalezen zakázaný výraz: {phrase}")

    reader = PdfReader(str(PDF))
    check(len(reader.pages) == EXPECTED_PAGES, "PDF nemá přesně 10 stran.")
    all_text = normalized(" ".join(page.extract_text() or "" for page in reader.pages))
    check(len(all_text) > 7500, "Extrahovaný text je podezřele krátký.")
    compact_text = re.sub(r"\s+", "", all_text).lower()
    for phrase in EXPECTED_TEXT:
        check(re.sub(r"\s+", "", phrase).lower() in compact_text, f"V PDF chybí očekávaný text: {phrase}")

    links = collect_links(reader)
    check(EXPECTED_LINKS.issubset(links), f"V PDF chybí odkazy: {sorted(EXPECTED_LINKS - links)}")

    fonts = collect_fonts(reader)
    check(fonts, "V PDF nebyly nalezeny fonty.")
    check(all(subtype == "/Type0" for subtype in fonts.values()), f"Nalezen nepovolený typ fontu: {fonts}")
    font_names = " ".join(fonts).lower()
    check("inter" in font_names and "lora" in font_names, f"Nejsou vloženy oba požadované fonty: {fonts}")
    check("arial" not in font_names and "/type3" not in " ".join(fonts.values()).lower(), "Nalezen nepovolený font.")

    extracted_pages: list[str] = []
    with pdfplumber.open(PDF) as document:
        check(len(document.pages) == EXPECTED_PAGES, "pdfplumber načetl jiný počet stran.")
        for index, page in enumerate(document.pages):
            width, height = page.width, page.height
            check(590 <= width <= 600 and 838 <= height <= 845, f"Strana {index + 1} není A4: {width} × {height} pt")
            for char in page.chars:
                check(-0.5 <= char["x0"] <= width + 0.5, f"Text mimo šířku na straně {index + 1}.")
                check(-0.5 <= char["top"] <= height + 0.5, f"Text mimo výšku na straně {index + 1}.")
            extracted_pages.append(page.extract_text() or "")

    check(not re.search(r"(?:^|\n)0(?:\n|$)", extracted_pages[0]), "Titulní strana obsahuje číslo 0.")
    for index, text in enumerate(extracted_pages[1:], start=1):
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        check(lines and lines[-1] == str(index), f"Chybné číslo strany na PDF straně {index + 1}: {lines[-1:]}")

    with tempfile.TemporaryDirectory(prefix="fbc-diet-qa-") as tmp:
        prefix = Path(tmp) / "page"
        subprocess.run(
            ["pdftoppm", "-png", "-r", "200", str(PDF), str(prefix)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        rendered = sorted(Path(tmp).glob("page-*.png"))
        check(len(rendered) == EXPECTED_PAGES, "Render nevytvořil všech 10 stran.")
        make_contact_sheet(rendered)

    print(f"QA OK: {PDF.name} | {EXPECTED_PAGES} stran | A4 | 200 DPI render")
    print("Fonty:", ", ".join(f"{name} {subtype}" for name, subtype in sorted(fonts.items())))
    print("Odkazy:", ", ".join(sorted(links)))
    print("Kontaktní náhled:", CONTACT_SHEET)


if __name__ == "__main__":
    main()
