# Neighbor.com design system — reference for the take-home

**Sources scraped 2026-08-23:** neighbor.com homepage (desktop + mobile), `/rv-storage-near-me` category landing, `/search?...&location=austin,tx` real search results, `/auth/register` form, `/host` marketing landing. Plus 5 historical app screenshots from sidehustlenation.com/neighbor-com-review (listing-flow, smart pricing, vouches, listing-and-fees, search results).

Everything in this file is either measured from the live DOM or captured in `screenshots/`. When something below wasn't observable directly (inferred hover state, etc.) it's marked as such.

Files in this folder:
- **`tokens.css`** — copy into an Artifact `<style>` block. Custom properties + component classes (`.nb-btn-primary`, `.nb-price-panel`, `.nb-step-row`, `.nb-info-banner` and more).
- **`tokens.md`** — this file. The spec + rationale.
- **`patterns.md`** — interaction/copy patterns and UX conventions. Read this before building any screen.
- **`notes.md`** — raw extraction JS + findings, so future sessions can re-verify.
- **`screenshots/`** — 5 JPEGs of real Neighbor UI.

---

## Type — the single biggest visual decision

Neighbor pairs **GT-Ultra** (proprietary serif, Grilli Type) with **Inter** — but the load-bearing detail is *how they use the serif*:

| Role | Family | Weight | Sizes captured |
|---|---|---|---|
| **Hero H1 only** | GT-Ultra | **700 (bold)** | 64/76.8/−1.79 |
| Section H2 large | GT-Ultra | **400 (regular)** | 44/52.8/−1.23 |
| Section H2 medium | GT-Ultra | **400** | 40/48/−1.12 |
| Subhead | Inter | 400 | 26/35/−0.26 |
| Section H3 | Inter | 500 | 22/30 |
| Body | Inter | 400 | 16/24 |
| Small | Inter | 400 | 14/20 |
| Micro (badges, meta) | Inter | 600 | 12/16 |

**The distinctive move**: every serif heading except the top-of-page hero uses **font-weight 400** with a tight negative letter-spacing. Bold-everywhere would look Airbnb-generic; regular-weight serif is Neighbor's editorial signature.

Fallback stack — Neighbor themselves fall back to **Georgia** for GT-Ultra. An artifact that references GT-Ultra and falls back to Georgia looks intentional, not broken.

---

## Color — one primary blue, one dollar green, cream accents

| Token | Hex | Where |
|---|---|---|
| `--nb-blue` | **#1767FF** | Wordmark, primary CTAs, map price pins (`blue-40`) |
| `--nb-blue-hover` | #0F57E0 | Primary CTA hover state |
| `--nb-blue-search` | **#0079E1** | Search-bar submit circle, "OPEN" app pill |
| `--nb-blue-info-bg` | **#EFF5F8** | Trust-banner background ("100% of hosts are identity verified") |
| `--nb-blue-tint` | #BADFEE | Empty-star rating background |
| `--nb-link` | **#0067C0** | Inline text-link color (deeper than primary blue) |
| **`--nb-green`** | **#00573F** | **Prices, discounted totals, "Enjoy 50% off"** — this is critical |
| `--nb-green-tint` | #EAF4DD | Promo pill background |
| `--nb-cream` | **#FFF8DE** | Top Host badge background |
| `--nb-star` | ≈#FFB800 | Filled rating stars (amber, not blue) |
| `--nb-text` | #232323 | Cool near-black (gray-80) |
| `--nb-text-warm` | **#373A36** | Warm near-black — used on marketing + hosts pages |
| `--nb-text-muted` | #63666A | Icons, placeholder, meta (gray-60) |
| `--nb-text-faint` | #888B8D | Strikethrough was-price (gray-50) |
| `--nb-border` | #EBEBEB | Hairline borders (gray-30) |
| `--nb-border-nav` | #EBECF0 | Nav outline-button border (slightly cooler) |
| `--nb-white` | #FEFEFE | Their "white" — not pure #FFF |

**Two things that will trip up a rebuild:**

1. **Dollar amounts are GREEN, not blue.** Every price shown to the user in the app — booking totals, promo discounts, monthly rates — uses `#00573F` forest green. This is the single most important token for the "Cancel your storage bill" wedge screen: the "-$185 → $0" animation should use this exact green with strikethrough on the original.

2. **Two near-blacks coexist.** `#232323` (cool) on the homepage, `#373A36` (warm) on marketing/hosts pages. Use `#373A36` on any surface with soft/warm hero imagery.

**Colors NOT in the palette:** yellow, orange, red as accents. There is one cream badge (`#FFF8DE`) and one green thread (`#00573F` + `#EAF4DD`). No warm accents anywhere. The prior draft's yellow direction was 100% off.

---

## Shape — four radii, precise use cases

| Token | Value | Use |
|---|---|---|
| `--nb-r-xs` | **4px** | Promo pills ("50% OFF 1ST MONTH") |
| `--nb-r-sm` | **8px** | Top Host badges, small tags |
| `--nb-r-md` | **12px** | Buttons (ghost/nav), cards, dropdowns, inputs |
| `--nb-r-lg` | **16px** | Booking price panel, larger cards |
| `--nb-r-chip` | **30px** | Filter chips (outlined) |
| `--nb-r-pill` | **50px** | Filled primary CTA (marketing) |
| `--nb-r-full` | **9999px** | Circular buttons, map pins, mobile search |

Different radii by component isn't visual noise — it's Neighbor's rhythm. A card at 12px next to a filter chip at 30px next to a pill CTA at 50px reads as intentional hierarchy.

---

## Buttons — three primary shapes

| Variant | Radius | Padding | Weight | Where |
|---|---|---|---|---|
| **Primary marketing** | pill (50px) | 10px/24px | **500** | "Get started", "Become a host", homepage/host page |
| **Primary form** | pill (50px), often full-width | 14px/24px | 600 | "Continue", "Reserve space" |
| **Nav outline** | 12px | 14px/24px | 400 | "Become a host" in nav — outlined, not filled |
| **Ghost / nav link** | 12px | 12px/16px | 400 | Nav text links — transparent until hover reveals border |
| **Text link** | 0 | 4-8px | 500 | "Skip for now →", inline text CTAs |
| **Circular icon** | full round (60×60) | – | – | Search submit, floating actions |

The **font-weight difference matters**: marketing CTAs are 500, form CTAs are 600, nav/ghost is 400. Getting this wrong is the fastest way to make the mockup feel off.

---

## What each screen in the prototype should mirror

Because every screen in the take-home has a direct analogue in what was captured:

| Prototype screen | Mirror this pattern (see `screenshots/` and `patterns.md`) |
|---|---|
| **Push notification / billing receipt** | Neighbor's iOS app promo banner styling — small blue app icon, sticky top strip, blue pill CTA on right |
| **Rental activation (pre-filled)** | `neighbor-listing-process.jpg` — "List your space" flow header + step-list rows with icon/label/Start-chevron pattern |
| **Handoff & access setup** | `neighbor-host-smart-pricing.jpg` — radio-card selection pattern, blue progress bar in flow header, green dollar amounts |
| **First booking request** | Booking price panel from `neighbor-listing-and-fees.jpg` — green subtotal/total, strikethrough was-price, blue full-width "Reserve space" CTA |
| **Storage host consent** | `neighbor-vouch-system.jpg` — H1 with quiet illustration, info-tip with bolded inline callout, example card, primary+skip CTA pair |

The pattern library in `tokens.css` (`.nb-flow-header`, `.nb-step-row`, `.nb-radio-card`, `.nb-price-panel`, `.nb-info-tip`, `.nb-testimonial`) covers every one of these directly.

---

## The unexpected wink — Karate Kid color naming

Neighbor's Tailwind theme names accent colors after Karate Kid characters (`accent-miyagi`, `accent-matthew`). Not visible to end users, but it's in their compiled CSS. Using their internal naming in one place in the mockup (a comment, a variable name) reads as "did the homework" without becoming a distraction.
