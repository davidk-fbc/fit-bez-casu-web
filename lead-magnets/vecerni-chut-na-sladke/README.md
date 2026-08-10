# Co dělat, když tě večer honí chuť na sladké

Editovatelný zdroj a finální PDF lead magnetu značky Fit bez času.

## Soubory

- `index.html`: kompletní obsah a struktura všech 9 stran
- `styles.css`: tiskový layout A4 a vizuální systém
- `assets/`: logo, statické OFL řezy Inter a Lora a jejich licence
- `export_pdf.py`: reprodukovatelný export přes Chrome nebo Chromium
- `qa_pdf.py`: kontrola obsahu, odkazů, fontů a tvorba contact sheetu
- `fit-bez-casu-co-delat-kdyz-te-vecer-honi-chut-na-sladke.pdf`: finální PDF
- `contact-sheet.png`: náhled všech stran pro vizuální kontrolu

## Export

```bash
python3 export_pdf.py
```

## QA

QA vyžaduje Python balíčky `pypdf`, `Pillow` a nástroj `pdftoppm`.

```bash
python3 qa_pdf.py
```

Kontrola ověří devět stran A4, textovou vrstvu, čtyři scénáře, pět praktických řešení, self-check, všechny URL anotace a korektně vložené fonty. Současně vytvoří `contact-sheet.png` z renderu ve 200 DPI.

## Produkční odkazy

- Jídelníček: https://www.fitbezcasu.cz/jidelnicek-pro-zdrave-hubnuti
- Osobní rozbor: https://web.fitbezcasu.cz/nabidka-podpory/osobni-rozbor-jidelnicku
- Web: https://web.fitbezcasu.cz/
- Instagram: https://www.instagram.com/fitbezcasu/
