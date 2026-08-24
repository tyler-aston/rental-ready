# Neighbor Rental-Ready

PM take-home by Tyler Aston, August 2026 — turning Neighbor into the rental depot
for the vehicles already stored on it.

## The two links

| | |
|---|---|
| **The walkthrough** | `index.html` — the full argument: thesis, journey map, prototype, metrics and rollout, risks, talk track. |
| **The experience** | `prototype.html` — just the clickable six-screen prototype, on its own page. The link to send to someone who wants to play with it. |

## The prototype is a real state machine

Not linked screenshots. Screen copy renders from a single vehicle record, trip dates
compute to roughly three weeks out so the demo stays plausible on any day, and choices
persist across screens — picking "I'll hand off myself" on screen 3 changes the payout
on screen 4 *and* the dollar figure inside the booking notification.

Arrow keys (← →) move between screens while presenting.

## Layout

```
site/                     ← this is what gets deployed
  index.html                the walkthrough
  prototype.html            the experience
  assets/
    neighbor.css            design tokens extracted from neighbor.com + page styles
    standalone.css          extra styles for the prototype-only page
    prototype.js            phone markup + the state machine (shared by both pages)
    favicon.svg / .ico / -32.png / apple-touch-icon.png
    og-card.png             1200×630 social preview

build/                    ← sources; not needed to serve the site
  build.py                  assembles every output from the partials
  *.part.html/.js           shared fragments
  og-card.html              source of the social preview image

rental-ready.html         ← single-file build for the Claude Artifact
neighbor-ds/              ← the extracted neighbor.com design system + reference screenshots
```

## Rebuilding

Every output — both site pages *and* the single-file artifact — is generated from the
same partials, so screen copy lives in exactly one place and cannot drift between them.

```bash
python3 build/build.py [BASE_URL]
```

`BASE_URL` sets the canonical and Open Graph URLs; it defaults to the GitHub Pages
address. Serve locally with:

```bash
python3 -m http.server 4178 --directory site
```

## Design system

Colors, type scale, radii and component recipes in `assets/neighbor.css` were extracted
from live neighbor.com surfaces on 2026-08-23. Notes and the reference screenshots each
screen mirrors are in `neighbor-ds/`. Three things that matter most: primary blue is
`#1767FF`, dollar amounts are green `#00573F`, and serif headings are regular weight —
only the top-of-page hero is bold.

GT-Ultra is Neighbor's proprietary face and is not redistributed here; the stylesheet
asks for it first, then falls back to Petrona and Georgia.
