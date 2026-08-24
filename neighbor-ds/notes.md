# Extraction notes — raw findings + how to re-verify

Captured 2026-08-23 via the in-app Browser tool against 4 surfaces on neighbor.com plus a third-party review site for historical app screenshots. Everything below is a direct dump so any future session can diff against these findings.

---

## Surfaces scraped

| URL | Title / purpose | What was captured |
|---|---|---|
| `https://neighbor.com/` (desktop) | Homepage | Root fonts, wordmark blue, nav pattern, search bar (3-segment desktop) |
| `https://neighbor.com/` (mobile, 375×812) | Same, mobile viewport | App-promo banner, mobile nav (wordmark + chevron), category tiles |
| `https://neighbor.com/rv-storage-near-me` | RV vertical landing | Marketing CTAs (font-weight 500 confirmed), category type pattern |
| `https://neighbor.com/search?can_store_vehicle=true&class=motorhome&location=austin%2C+tx` | Real search results | Listing card overlays (Top Host badge, promo pill), filter chips (30px radius), map (Google Maps), color-name reveal (`bg-blue-40`, `bg-accent-matthew-tint-2`) |
| `https://neighbor.com/auth/register` | Login/register flow | Floating-label input, full-width primary CTA, "Continue with Google/Email" secondary pattern, nav-outline "Become a host" button |
| `https://neighbor.com/host` | Marketing landing | Full type hierarchy — hero H1 (GT-Ultra 700, 64/76.8/−1.79), section H2 (GT-Ultra 400, 44/52.8/−1.23), subhead (Inter 400, 26/35/−0.26). Marketing copy patterns. |
| `https://sidehustlenation.com/neighbor-com-review/` | 3rd-party review (historical) | 5 JPEGs of older Neighbor UI — listing flow, smart pricing, vouches, listing+fees panel, search results with map |

---

## Screenshots on disk (in `./screenshots/`)

| File | What it shows | Why it matters |
|---|---|---|
| `neighbor-listing-process.jpg` | "List your space" flow entry — step list with icon/label/Start-chevron rows, muted "locked" future steps | The `.nb-step-row` pattern; direct template for the rental-activation screen |
| `neighbor-host-smart-pricing.jpg` | "Turn on Smart Pricing?" step — flow header with blue progress bar, two radio-cards (selected + unselected), green starting price, minimum-price input | The `.nb-radio-card` + `.nb-flow-progress` + green-price patterns |
| `neighbor-listing-and-fees.jpg` | Listing detail with floating booking panel — green promo line, was-price strikethrough, big green total, blue full-width "Reserve space" | The `.nb-price-panel` recipe; the "$185 → $0" wedge screen uses this |
| `neighbor-storage-listings.jpg` | Search results with map, real listing cards, blue trust banner, filter chips | The `.nb-info-banner`, `.nb-chip`, and listing-card anatomy |
| `neighbor-vouch-system.jpg` | Vouches step — H1, info-tip with lightbulb + bolded inline stat, example testimonial card, primary + "Skip for now →" CTA pair | The `.nb-info-tip`, `.nb-testimonial`, and "Skip for now →" pattern — direct template for storage-host consent screen |

**Age caveat:** the sidehustlenation screenshots are dated 2022-05 and 2022-11 (visible in filenames). Neighbor has redesigned some surfaces since — the current auth page and marketing pages look fresher and are what `tokens.md` reflects. The *patterns* in these screenshots are still present in the live site; the specific pixels aren't necessarily identical anymore.

---

## Raw extraction JS (paste into `mcp__Claude_Browser__javascript_tool`)

To re-verify or extend, open any Neighbor page and run:

```js
// Pass 1 — tokens, fonts, headings
(() => {
  const rs = getComputedStyle(document.documentElement);
  const vars = {};
  for (let i = 0; i < rs.length; i++) {
    const p = rs[i];
    if (p.startsWith('--')) vars[p] = rs.getPropertyValue(p).trim();
  }
  return JSON.stringify({
    vars,
    rootFont: rs.fontFamily,
    headings: [...document.querySelectorAll('h1, h2, h3')].slice(0, 10).map(h => ({
      tag: h.tagName, text: h.textContent.trim().slice(0, 60),
      family: getComputedStyle(h).fontFamily.split(',')[0],
      size: getComputedStyle(h).fontSize,
      weight: getComputedStyle(h).fontWeight,
      color: getComputedStyle(h).color,
      lineHeight: getComputedStyle(h).lineHeight,
      letterSpacing: getComputedStyle(h).letterSpacing,
    })),
  }, null, 2);
})();

// Pass 2 — filled CTAs, chips, borders
(() => {
  const btns = [...document.querySelectorAll('button, a')].filter(b => {
    const bg = getComputedStyle(b).backgroundColor;
    return !/rgba\(0, 0, 0, 0\)|transparent|rgb\(255, 255, 255\)|rgb\(254, 254, 254\)/i.test(bg);
  }).slice(0, 8);
  return JSON.stringify(btns.map(b => ({
    text: b.textContent.trim().slice(0, 40),
    bg: getComputedStyle(b).backgroundColor,
    color: getComputedStyle(b).color,
    radius: getComputedStyle(b).borderRadius,
    padding: getComputedStyle(b).padding,
    fontSize: getComputedStyle(b).fontSize,
    fontWeight: getComputedStyle(b).fontWeight,
  })), null, 2);
})();
```

---

## Confirmed findings — highlights

### Fonts declared via @font-face on homepage
- **Inter** — variable weight 100–900, from `d9lvjui2ux1xa.cloudfront.net/fonts/v3/Inter-VariableFont.woff2`
- **GT-Ultra** — regular (400) and bold (700), each in normal + italic
- **GT-Ultra-Fallback** — declared as `local("Georgia"), local("Times New Roman"), local("Times")` — this is Neighbor's own fallback

### Color hexes verified across surfaces
| Color | Where confirmed |
|---|---|
| `#1767FF` | Wordmark SVG (`fill="#1767FF"`), map price pins, primary marketing CTAs |
| `#0079E1` | Search-bar submit circle, "OPEN" app pill, "Apply" filter button |
| `#0067C0` | Inline text links (nav "Log in", disclaimer links) |
| `#00573F` (text) with `#EAF4DD` (bg) | Green promo pill on listing card, price stack on booking panel |
| `#FFF8DE` bg / `#373A36` text | Top Host badge (Tailwind class `bg-yellow-10`) |
| `#232323` | Homepage body text |
| `#373A36` | Marketing/hosts pages body + heading text |
| `#EBEBEB` | Card/chip hairline borders (Tailwind `border-gray-30`) |
| `#EBECF0` | Nav outline-button border (slightly cooler) |

### Type scale confirmed on `/host`
- H1: **GT-Ultra 700**, 64px, lh 76.8px, letter-spacing −1.792px, color #373A36 → "Start a storage side hustle from home"
- H2 large: **GT-Ultra 400**, 44px, lh 52.8px, −1.232px → "Turn any space into a passive storage business"
- H2 medium: **GT-Ultra 400**, 40px, lh 48px, −1.12px → "Real hosts." / "Real earnings." / "Meet Justin..."
- Subhead: **Inter 400**, 26px, lh 35px, −0.26px → "Join the largest storage marketplace..."

### Border-radius scale confirmed
- `4px` — promo pills ("$ 50% OFF 1ST MONTH")
- `8px` — Top Host badge
- `12px` — nav outline buttons, ghost buttons, cards, dropdowns
- `16px` — booking price panel (inferred from proportion)
- `30px` — filter chips
- `50px` — filled primary CTAs
- `9999px` — circular buttons, map pins, mobile search bar

### CSS-variable leakage on `:root`
Only Neighbor's own vars observed:
- `--star-background: #BADFEE` (pastel blue — empty star)
- `--star-color: #000` (filled star fallback — but in practice filled stars are amber, not black)
- `--star-size: 15px`
- `--rating: <live number>` (dynamic homepage rating)

Everything else is Tailwind's own `--tw-*` machinery. Neighbor doesn't expose a full token layer at runtime; their color scale (`gray-20/30/60/80`, `blue-40/50`, `accent-*`) lives in the Tailwind config, not runtime CSS.

### Tailwind class-name breadcrumbs worth remembering
Real class names found in the DOM (a bit of Karate Kid trivia included):
- `bg-blue-40`, `bg-blue-50`, `text-accent-miyagi-tint`
- `bg-accent-matthew-tint-2` (the green promo pill)
- `bg-yellow-10` (Top Host cream)
- `text-gray-50`, `text-gray-60`, `text-gray-80` (text scale)
- `border-gray-30` (hairline borders)
- `rounded-xl` (12px), `rounded-full` (pill), `rounded-lg` (8px), literal `rounded-[50px]` and `rounded-[30px]` for filter chips and pill CTAs

---

## What was NOT extracted (add if needed)

- **Native mobile app screens** — the app-promo banner on the mobile web hints at the app but the actual iOS/Android chrome (tab bar, native nav header) wasn't pulled. Sidehustlenation screenshots show older web UX, not the current native app. If the prototype needs pixel-accurate iOS chrome, screenshot the App Store listing or install the app.
- **Post-login authenticated states** — my session isn't logged in, so I never saw the vehicle-owner dashboard, notifications inbox, message center, or "Your reservations" list. These will be relevant for the prototype's "offset dashboard" screen — the design will need to be inferred from other flows.
- **The listing detail page live** — I have the historical `neighbor-listing-and-fees.jpg` but did not navigate a current listing on the live site. If a rental listing on the vehicle owner side needs a pixel-current template, click through from `/search` results.
- **Individual listing detail page — image carousel, host bio, reviews** — same reason as above.
- **Payout/earnings dashboard** — the host earnings UI is behind auth; would need to be inferred.
