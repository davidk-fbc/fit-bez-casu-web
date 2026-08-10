# 15 rychlých jídel, když nestíháš

Editovatelný zdroj a finální PDF lead magnetu značky Fit bez času.

## Soubory

- `index.html`: kompletní obsah a struktura všech 9 stran
- `styles.css`: tiskový layout A4 a vizuální styl
- `assets/`: oficiální logo, statické OFL řezy Inter a Lora a jejich licence
- `export_pdf.py`: reprodukovatelný export přes Chrome nebo Chromium
- `qa_pdf.py`: automatická kontrola obsahu, odkazů, fontů a tvorba contact sheetu
- `fit-bez-casu-15-rychlych-jidel-kdyz-nestihas.pdf`: finální PDF
- `contact-sheet.png`: náhled všech 9 stran pro rychlou vizuální kontrolu

## Export

Z této složky spusť:

```bash
python3 export_pdf.py
```

Script používá lokálně nainstalovaný Google Chrome nebo Chromium. CSS obsahuje pevný tiskový formát A4, nulové okraje a zapnutý tisk barev na pozadí.

Po exportu spusť QA (vyžaduje Python balíčky `pypdf`, `Pillow` a nástroj `pdftoppm`):

```bash
python3 qa_pdf.py
```

Kontrola ověří počet stran, textovou vrstvu, všech 15 receptů, CTA a kontaktní texty, klikatelné odkazy, odstraněné technické řádky i korektně vložené fonty. Současně přegeneruje `contact-sheet.png` z renderu v rozlišení 200 DPI.

## Ověřené odkazy

- Jídelníček: https://www.fitbezcasu.cz/jidelnicek-pro-zdrave-hubnuti
- Web: https://web.fitbezcasu.cz
- Instagram: https://www.instagram.com/fitbezcasu/
