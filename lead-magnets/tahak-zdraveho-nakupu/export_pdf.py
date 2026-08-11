#!/usr/bin/env python3
"""Export the editable healthy-shopping guide to a print-ready A4 PDF."""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "index.html"
OUTPUT = ROOT / "fit-bez-casu-tahak-zdraveho-nakupu.pdf"


def find_chrome() -> str:
    candidates = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
        "google-chrome",
        "chromium",
        "chromium-browser",
    ]
    for candidate in candidates:
        if candidate.startswith("/") and Path(candidate).is_file():
            return candidate
        found = shutil.which(candidate)
        if found:
            return found
    raise RuntimeError("Chrome nebo Chromium nebyl nalezen. Nainstaluj ho a spusť export znovu.")


def main() -> int:
    if not SOURCE.is_file():
        raise FileNotFoundError(f"Chybí zdrojový soubor: {SOURCE}")

    command = [
        find_chrome(),
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--no-pdf-header-footer",
        f"--print-to-pdf={OUTPUT}",
        SOURCE.as_uri(),
    ]
    completed = subprocess.run(command, check=False, text=True, capture_output=True)
    if completed.returncode != 0:
        sys.stderr.write(completed.stderr)
        return completed.returncode
    if not OUTPUT.is_file() or OUTPUT.stat().st_size < 10_000:
        raise RuntimeError("PDF se nevytvořilo nebo je neobvykle malé.")

    print(f"Vytvořeno: {OUTPUT}")
    print(f"Velikost: {OUTPUT.stat().st_size} B")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
