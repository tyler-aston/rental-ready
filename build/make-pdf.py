#!/usr/bin/env python3
"""Build the one-page delivery PDF: previews + links to all three versions.

Renders build/delivery.html through headless Chrome, which preserves <a href>
as real clickable annotations in the PDF.

  python3 build/make-pdf.py
"""
import base64
import io
import pathlib
import subprocess
import sys

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
BUILD = ROOT / 'build'
SHOTS = BUILD / 'previews'
OUT_HTML = BUILD / 'delivery.html'
OUT_PDF = ROOT / 'Neighbor-Rental-Ready.pdf'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
BASE = 'https://tyler-aston.github.io/rental-ready'

LINKS = [
    ('The walkthrough', BASE + '/',
     'The full argument, in the order I would present it: the thesis and the three '
     'advantages, the journey map across all three actors, the prototype, unit economics '
     'and rollout, risks, and a talk track. <b>Start here.</b>'),
    ('The experience', BASE + '/prototype.html',
     'Just the clickable prototype, with a short intro around it. Six screens from a '
     'storage billing push to a booked RV — the listing is pre-filled from the storage '
     'record and your choices carry through.'),
    ('The live demo', BASE + '/demo.html',
     'The same prototype full screen, with nothing around it: a screen rail, presenter '
     'notes, and the device scaled to fill the display. <b>Best for screen-sharing.</b>'),
]


def img_tag(path):
    im = Image.open(path).convert('RGB')
    im = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=90, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()


def main():
    shots = [SHOTS / f'p{i}.png' for i in (1, 2, 3)]
    missing = [p for p in shots if not p.exists()]
    if missing:
        sys.exit('missing previews: ' + ', '.join(str(p) for p in missing))
    imgs = [img_tag(p) for p in shots]

    rows = ''
    for i, ((title, url, desc), src) in enumerate(zip(LINKS, imgs), start=1):
        pretty = url.replace('https://', '')
        rows += f'''
    <a class="row" href="{url}">
      <span class="row__shot"><img src="{src}" alt="{title} preview"></span>
      <span class="row__body">
        <span class="row__n">{i}</span>
        <span class="row__title">{title}</span>
        <span class="row__desc">{desc}</span>
        <span class="row__url">{pretty}</span>
      </span>
    </a>'''

    OUT_HTML.write_text(TEMPLATE.replace('<!--ROWS-->', rows))
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
                    '--virtual-time-budget=8000',
                    f'--print-to-pdf={OUT_PDF}', OUT_HTML.as_uri()],
                   check=True, capture_output=True)
    print(f'wrote {OUT_PDF.relative_to(ROOT)}  {OUT_PDF.stat().st_size/1024:.0f}kb')


TEMPLATE = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Neighbor Rental-Ready</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Petrona:wght@400;500&display=swap">
<style>
  @page { size: Letter; margin: 0; }
  * { box-sizing: border-box; margin: 0; }
  :root {
    --blue: #1767FF; --green: #00573F; --ink: #232323; --warm: #373A36;
    --muted: #63666A; --faint: #888B8D; --line: #EBEBEB;
  }
  body {
    width: 8.5in; height: 11in; padding: 0.62in 0.68in 0.5in;
    font-family: 'Inter', system-ui, sans-serif; color: var(--ink);
    background: #fff; -webkit-font-smoothing: antialiased;
    display: flex; flex-direction: column;
  }

  .eyebrow {
    display: flex; align-items: center; gap: 8px;
    font-size: 8.5pt; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 13px;
  }
  .mark {
    width: 19px; height: 19px; border-radius: 5px; background: var(--blue);
    display: inline-flex; align-items: center; justify-content: center;
  }
  h1 {
    font-family: 'Petrona', Georgia, serif; font-weight: 400;
    font-size: 30pt; line-height: 1.08; letter-spacing: -0.025em;
    color: var(--warm); margin-bottom: 9px;
  }
  .lede { font-size: 10.5pt; line-height: 1.5; color: var(--muted); max-width: 62ch; }
  .lede b { color: var(--ink); font-weight: 600; }

  .rows { display: flex; flex-direction: column; gap: 15px; margin-top: 24px; }
  .row {
    display: flex; gap: 16px; align-items: flex-start;
    text-decoration: none; color: inherit;
    border: 1px solid var(--line); border-radius: 11px; padding: 15px;
  }
  .row__shot {
    flex: 0 0 3.15in; width: 3.15in; height: 1.97in;
    border: 1px solid var(--line); border-radius: 6px; overflow: hidden;
    background: #fff;
  }
  .row__shot img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
  .row__body { flex: 1; display: block; }
  .row__n {
    display: inline-block; font-size: 8pt; font-weight: 700; color: var(--blue);
    letter-spacing: 0.08em; margin-bottom: 3px;
  }
  .row__title {
    display: block; font-family: 'Petrona', Georgia, serif; font-weight: 400;
    font-size: 16.5pt; line-height: 1.15; letter-spacing: -0.02em;
    color: var(--warm); margin-bottom: 5px;
  }
  .row__desc { display: block; font-size: 9.5pt; line-height: 1.52; color: var(--muted); }
  .row__desc b { color: var(--ink); font-weight: 600; }
  .row__url {
    display: block; margin-top: 7px; font-size: 8.5pt; font-weight: 500;
    color: var(--blue); word-break: break-all;
  }

  .foot {
    margin-top: auto; padding-top: 11px; border-top: 1px solid var(--line);
    display: flex; justify-content: space-between; gap: 14px;
    font-size: 8pt; line-height: 1.45; color: var(--faint);
  }
  .foot b { color: var(--muted); font-weight: 600; }
</style>
</head>
<body>
  <div class="eyebrow">
    <span class="mark">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff"
           stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 11.2 12 4l9 7.2"/><path d="M5.6 9.8V20h12.8V9.8"/>
      </svg>
    </span>
    <span>PM take-home &middot; Tyler Aston &middot; August 2026</span>
  </div>

  <h1>Neighbor Rental-Ready</h1>
  <p class="lede">Turning Neighbor into the rental depot for the vehicles already stored
    on it &mdash; so a storage bill can be cancelled by the RV sitting on the lot.
    <b>Everything is live at the three links below; each preview is clickable.</b></p>

  <div class="rows"><!--ROWS--></div>

  <div class="foot">
    <span>Built on Neighbor&rsquo;s own design system &mdash; tokens extracted from
      neighbor.com, August 2026.</span>
    <span><b>tyler.aston@gmail.com</b></span>
  </div>
</body>
</html>
'''

if __name__ == '__main__':
    main()
