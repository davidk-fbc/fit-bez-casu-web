# 7 chyb v jídelníčku, které mohou brzdit hubnutí

Finální desetistránkový A4 lead magnet značky Fit bez času. Zdroj je v HTML a CSS, export probíhá přes headless Chrome a výsledné PDF se ověřuje automatickým QA skriptem.

## Soubory

- `index.html` – editovatelný obsah a struktura 10 stran
- `styles.css` – sazba, barvy a vložené fonty Lora a Inter
- `export_pdf.py` – export PDF
- `qa_pdf.py` – kontrola struktury, textu, odkazů, fontů, A4 rozměru a 200 DPI renderu
- `fit-bez-casu-7-chyb-v-jidelnicku-ktere-mohou-brzdit-hubnuti.pdf` – finální výstup
- `contact-sheet.png` – náhled všech stran v 200 DPI

## Export a kontrola

```bash
python3 export_pdf.py
python3 qa_pdf.py
```

## Odkazy v PDF

- primární CTA: <https://web.fitbezcasu.cz/nabidka-podpory/osobni-rozbor-jidelnicku>
- sekundární nabídka: <https://www.fitbezcasu.cz/jidelnicek-pro-zdrave-hubnuti>
- web: <https://web.fitbezcasu.cz/>
- Instagram: <https://www.instagram.com/fitbezcasu/>
