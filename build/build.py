#!/usr/bin/env python3
"""Assemble the two-page Neighbor Rental-Ready site from shared partials.

  docs/index.html      the walkthrough  (strategy deliverable, prototype embedded)
  docs/prototype.html  the experience   (standalone clickable prototype)

Both pages mount the SAME phone markup from assets/prototype.js, so screen copy
lives in exactly one place and cannot drift between the two links.

Usage:  python3 build/build.py [BASE_URL]
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
B, SITE = ROOT / 'build', ROOT / 'docs'
(SITE / 'assets').mkdir(parents=True, exist_ok=True)

BASE = (sys.argv[1] if len(sys.argv) > 1
        else 'https://tyler-aston.github.io/rental-ready').rstrip('/')


def part(name):
    return (B / name).read_text()


def to_js_template(html):
    """Embed HTML as a JS template literal (verified backtick/${ free)."""
    assert '`' not in html and '${' not in html, 'phone markup needs escaping'
    return '`' + html.replace('\\', '\\\\') + '`'


ICONS = part('icons.part.html')
PHONE = part('phone.part.html')
SCRIPT = part('script.part.js')
TOPNAV = part('topnav.part.html')
RAIL = part('rail.part.html')
MASTHEAD = part('masthead.part.html')
S1, S2 = part('s1.part.html'), part('s2.part.html')
S3HEAD, TAIL = part('s3head.part.html'), part('s4s5s6.part.html')

# ------------------------------------------------ guard walkthrough-only DOM
OLD_KEYS = ("  var protoInView = false;\n"
            "  new IntersectionObserver(function (es) { es.forEach(function (en) "
            "{ protoInView = en.isIntersecting; }); }, { threshold: 0.15 })\n"
            "    .observe(document.getElementById('s3'));")
NEW_KEYS = ("  // On the standalone page the prototype IS the page, so keys are always live.\n"
            "  var s3 = document.getElementById('s3');\n"
            "  var protoInView = !s3;\n"
            "  if (s3) new IntersectionObserver(function (es) { es.forEach(function (en) "
            "{ protoInView = en.isIntersecting; }); }, { threshold: 0.15 }).observe(s3);")
assert OLD_KEYS in SCRIPT, 'arrow-key observer block not found'
SCRIPT = SCRIPT.replace(OLD_KEYS, NEW_KEYS)

spy_start = SCRIPT.index('  // Rail scroll-spy')
# NB: `go(0);` also appears inside the restart handler, so anchor on the final
# call at the bottom of the IIFE rather than the first match.
spy_end = SCRIPT.index('\n  go(0);\n})();') + 1
assert spy_start < spy_end, 'scroll-spy splice boundaries inverted'
spy_body = SCRIPT[spy_start:spy_end].split('\n')[1:]          # drop the comment line
spy_indented = '\n'.join(('  ' + l if l.strip() else l) for l in spy_body).rstrip()
SCRIPT = (SCRIPT[:spy_start]
          + "  // Rail scroll-spy — walkthrough only\n"
          + "  if (document.querySelector('.rail__link')) {\n"
          + spy_indented + "\n  }\n\n"
          + SCRIPT[spy_end:])
assert "if (s3)" in SCRIPT and "if (document.querySelector('.rail__link'))" in SCRIPT

# ------------------------------------------------------------- prototype.js
js = ("/* Neighbor Rental-Ready — shared prototype: markup + state machine.\n"
      "   Mounted into #proto-mount on BOTH the walkthrough and the standalone page,\n"
      "   so every line of screen copy lives in exactly one place. */\n\n"
      "var NB_PHONE_HTML = " + to_js_template(PHONE) + ";\n\n"
      "(function () {\n"
      "  var mount = document.getElementById('proto-mount');\n"
      "  if (mount) mount.innerHTML = NB_PHONE_HTML;\n"
      "})();\n\n" + SCRIPT)
(SITE / 'assets' / 'prototype.js').write_text(js)


# ------------------------------------------------------------------- <head>
def head(title, desc, page, extra=''):
    url = BASE + ('' if page == 'index.html' else '/' + page)
    canonical = BASE + '/' if page == 'index.html' else url
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="author" content="Tyler Aston">
<!-- Unlisted by request: the link works for anyone it is sent to, but search
     engines are asked not to index this take-home. -->
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="{canonical}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="Neighbor Rental-Ready">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{BASE}/assets/og-card.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{BASE}/assets/og-card.png">

<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<meta name="theme-color" content="#1767FF">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;family=Petrona:wght@400;500;700&amp;display=swap">
<link rel="stylesheet" href="assets/neighbor.css">
{extra}</head>
<body>
{ICONS}
"""


DESC_WALK = ("PM take-home: turning Neighbor into the rental depot for the vehicles "
             "already stored on it.")
DESC_PROTO = ("A clickable six-screen prototype — from a storage billing push to a "
              "rental-ready RV in five taps.")

# ------------------------------------------------------------- index.html
open_proto_link = """
      <p class="proto-openline">
        <a class="proto-open" href="prototype.html">
          Open the prototype on its own page
          <svg width="15" height="15" aria-hidden="true"><use href="#i-out"/></svg>
        </a>
        <span>Best link to send to someone who just wants to click through it.</span>
      </p>
"""

index = (head('Neighbor Rental-Ready', DESC_WALK, 'index.html')
         + TOPNAV + '\n\n<div class="wrap">\n' + RAIL + '\n  <main>\n'
         + MASTHEAD + '\n'
         + S1 + '\n' + S2 + '\n'
         + '    <section id="s3">\n' + S3HEAD + open_proto_link
         + '      <div id="proto-mount"></div>\n    </section>\n'
         + TAIL + '\n  </main>\n</div>\n'
         + '<script src="assets/prototype.js"></script>\n</body>\n</html>\n')
(SITE / 'index.html').write_text(index)

# --------------------------------------------------------- prototype.html
proto_page = (head('Rental-Ready Prototype', DESC_PROTO, 'prototype.html',
                   extra='<link rel="stylesheet" href="assets/standalone.css">\n')
              + """<header class="solo-bar">
  <a class="solo-brand" href="index.html">
    <svg width="20" height="20" aria-hidden="true"><use href="#i-house"/></svg>
    <span>Neighbor <b>Rental-Ready</b></span>
  </a>
  <a class="solo-back" href="index.html">
    <span class="solo-back__long">Read the full walkthrough</span>
    <span class="solo-back__short">Walkthrough</span>
    <svg width="14" height="14" aria-hidden="true"><use href="#i-arrow"/></svg>
  </a>
</header>

<main class="solo">
  <h1 class="solo-h1">From billing push to rental-ready in five taps.</h1>
  <p class="solo-lede">A working state machine, not linked pictures. The listing is
    pre-filled from the storage record, the booking request really arrives, and your
    choices persist &mdash; <b>pick &ldquo;I&rsquo;ll hand off myself&rdquo; on screen&nbsp;3
    and watch the payout change on screen&nbsp;4.</b> Use the &larr; &rarr; arrow keys
    to move between screens.</p>
  <div id="proto-mount"></div>
</main>

<footer class="solo-foot">
  <span>Tyler Aston &middot; PM take-home &middot; August 2026</span>
  <a href="index.html">Thesis, journey map, metrics and rollout &rarr;</a>
</footer>

<script src="assets/prototype.js"></script>
</body>
</html>
""")
(SITE / 'prototype.html').write_text(proto_page)

# --------------------------------------------------------------- demo.html
# The immersive stage: same phone, same state machine, no page around it.
DESC_DEMO = ("The Rental-Ready prototype full screen — six clickable screens, "
             "from a storage billing push to a booked RV.")
for asset in ('demo.css', 'demo.js'):
    (SITE / 'assets' / asset).write_text(part(asset))

demo_page = (head('Rental-Ready Live Demo', DESC_DEMO, 'demo.html',
                  extra='<link rel="stylesheet" href="assets/demo.css">\n')
             .replace('<body>', '<body class="demo">')
             + """<div class="stage">

  <header class="hud hud--top">
    <a class="hud__brand" href="index.html">
      <svg width="19" height="19" aria-hidden="true"><use href="#i-house"/></svg>
      <span>Neighbor <b>Rental-Ready</b></span>
    </a>
    <span class="hud__spacer"></span>
    <button class="hud__btn" id="notesBtn" aria-pressed="false">
      <span class="lbl">Presenter notes</span><kbd>N</kbd>
    </button>
    <button class="hud__btn" id="fsBtn" aria-pressed="false">
      <span class="lbl" id="fsLabel">Full screen</span><kbd>F</kbd>
    </button>
    <a class="hud__btn" href="index.html">
      <span class="lbl">Walkthrough</span>
      <svg width="13" height="13" aria-hidden="true"><use href="#i-arrow"/></svg>
    </a>
  </header>

  <div class="stage__floor">
    <div id="proto-mount"></div>
  </div>

  <div class="hud hud--bottom">
    <p class="hint">
      <kbd>&larr;</kbd><kbd>&rarr;</kbd> move between screens &nbsp;&middot;&nbsp;
      <kbd>N</kbd> notes &nbsp;&middot;&nbsp; <kbd>F</kbd> full screen
    </p>
  </div>

</div>

<script src="assets/prototype.js"></script>
<script src="assets/demo.js"></script>
</body>
</html>
""")
(SITE / 'demo.html').write_text(demo_page)

# ------------------------------------------------------- rental-ready.html
# The Claude Artifact build: one self-contained file, no external assets.
# Generated from the SAME partials so the hosted site and the artifact can
# never drift apart. Artifact supplies its own <head> wrapper and favicon.
css = (SITE / 'assets' / 'neighbor.css').read_text()
artifact = (
    '<title>Neighbor Rental-Ready</title>\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700'
    '&amp;family=Petrona:wght@400;500;700&amp;display=swap">\n'
    '<style>\n' + css + '\n</style>\n'
    + ICONS + '\n'
    + TOPNAV + '\n\n<div class="wrap">\n' + RAIL + '\n  <main>\n'
    + MASTHEAD + '\n' + S1 + '\n' + S2 + '\n'
    + '    <section id="s3">\n' + S3HEAD
    + '      <div id="proto-mount"></div>\n    </section>\n'
    + TAIL + '\n  </main>\n</div>\n'
    + '<script>\n' + (SITE / 'assets' / 'prototype.js').read_text() + '\n</script>\n')
(ROOT / 'rental-ready.html').write_text(artifact)

print('built:')
for f in sorted(SITE.rglob('*')):
    if f.is_file():
        print(f'  {f.relative_to(ROOT)}  {f.stat().st_size:,}b')
print(f'  rental-ready.html  {(ROOT / "rental-ready.html").stat().st_size:,}b  (artifact, single file)')
print('base url:', BASE)
