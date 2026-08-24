# Neighbor UX & copy patterns — for the take-home mockup

Distilled from the same 2026-08-23 scrape as `tokens.md`. This file covers the *behaviors* that don't come through in a token table — how they price things, how they show trust, how they write CTAs, and how their flows are shaped.

---

## Pricing display — the single most reusable pattern

Every price surface in Neighbor's UI uses the same 3-part convention:

1. **Original amount, strikethrough, muted gray** (`#888B8D`, small text)
2. **Discounted amount, green, bold** (`#00573F`, one size larger)
3. **Meta label** ("first month", "/mo", "after first month") in muted body-gray

Order top-down: subtotal → service fee → divider → total (biggest green number) → optional "after first month" in small gray.

**For the "Cancel your storage bill" wedge screen:** this pattern *is* the moment. Show `−$185/mo` in green (the storage bill), an arrow / transition, then `$0` in even bigger green. The visual language is already Neighbor's — you're just reframing "discount" as "offset."

---

## Trust & credibility — quiet, present in every flow

Neighbor doesn't beat people over the head with trust badges; they weave them into flows:

- **Info banner** — thin light-blue strip (`#EFF5F8` bg, blue text, centered, small icon). Example live: "🛡 100% of hosts are identity verified." on the search results page.
- **Top Host cream badge** — top-left corner of listing cards. Cream `#FFF8DE` + warm-dark text + 8px radius. Subtle, not shouty.
- **Example testimonial card** — used in the vouches flow to *show* what "good" looks like. Real photo avatar, name + `EXAMPLE` micro-tag, quote. Educational, not persuasive.
- **Inline stat bolding** — in tips and copy, key numbers are bolded within a sentence rather than pulled into a callout. Example: "hosts with 5 or more positive recommendations rent their space **85% more frequently**." — the bold is doing the work, no separate stat block.

**For the storage-host consent screen:** use exactly this pattern. A quiet H2, an info-tip with a bolded stat ("Hosts who allow handoffs earn **$40–120 more/mo**"), an example testimonial from a made-up host, a primary "Allow handoffs" pill, a "Skip for now →" text link below it. Do not build a shouty "New feature!" banner.

---

## Flow / setup shape — every multi-step surface is the same

Neighbor's "List your space" flow, "Vouches" flow, and Smart Pricing all share:

1. **Header:** centered flow title in bold sans (14–16px), hairline border below, then a **thin blue progress bar** (`.nb-flow-progress` — 3px tall, animates from 0 → progress% as steps complete). No numbered step indicator.
2. **Body:** one H1 in bold sans (~24px) stating the current question ("Turn on Smart Pricing?", "Increase your credibility with vouches."), one short paragraph below.
3. **Choice pattern:** radio cards stacked vertically. Selected card gets a blue border and inset blue shadow; unselected stays outlined. Each card holds a title + short description + optional inline detail (a green price, an input field, a link).
4. **CTA pair at bottom:** primary blue pill (full-width or centered) + text-link secondary underneath ("Skip for now →", "Back", or nothing at all).

**Do NOT invent** a horizontal numbered step-tracker (1 → 2 → 3 → 4) — that would look Turbo-Tax-y and doesn't exist anywhere in Neighbor's real UX. The blue progress bar is the whole affordance.

---

## Copy voice — concrete, wry, slightly casual

Observed headlines and CTAs, verbatim:

- "Parking & storage made friendly"
- "Enjoy savings. Cancel any month."
- "Start a storage side hustle from home"
- "Turn any space into a passive storage business"
- "The side hustle without the 'hustle'"
- "You bring the space. Neighbor brings the tools."
- "Meet Justin, a Seattle host who's earned $64,152"
- "Don't overpay for RV storage"
- "Month-to-month storage with no hidden fees"
- "$1 Million Liability Protection"

Patterns:
- **Concrete dollar amounts in headlines** ("$64,152", "$1 Million", price in green in the panel).
- **Named humans** ("Meet Justin, a Seattle host...").
- **Cancel-any-month is baked into the value prop** across surfaces.
- **Slightly self-aware phrasing** ("side hustle without the 'hustle'").
- **Short sentences.** Two-clause max, comma or period.

**For the take-home headlines:** don't write in a different voice. Names, dollars, and "cancel-any-month" phrasing land as native. "Cancel your storage bill" is directly derivative of "Cancel any month" — that's a feature, not a bug.

---

## Listing card anatomy (search results, desktop)

Horizontal layout. Left column: image tiles (1 hero + 3 thumbs stacked, or 4-tile grid). Right column, top to bottom:

- Title (bold sans, ~16-18px) with a `|` separator and dimension ("Self Storage Unit | 6×4")
- Location, muted (`Mercer Island, WA`)
- Star rating: gold ★ + number (5.0) + separator + "200+ months rented"
- If applicable: `⚡ Instant book` tag (small, inline)
- Testimonial quote in italic gray, one line, truncated
- Bottom-right corner: **green promo pill** ("$ 50% OFF 1ST MONTH") stacked above **price** ("$55/mo" bold)

Overlays on the image:
- **Top-left:** cream `Top Host` badge (if applicable)
- **Top-right:** heart / favorite icon (not filled by default)
- **Bottom-left:** photo carousel dot indicator (four small dots for four photos)

**For the take-home:** the vehicle owner's "here's your rental listing preview" screen should use this exact horizontal card. Populate it with the RV they're already storing — pre-filled photos (from their storage listing), pre-filled dimensions (Class C, 32 ft), an `⚡ Instant book` tag (auto-enabled), and the green offset math.

---

## Booking / price panel (listing detail, desktop right sidebar)

Compact floating card, `border-radius: 16px`, subtle 1px border, no heavy shadow. Structure:

- Small green promo line at top: "$ Enjoy 50% off your first month" + finer italic disclaimer below
- Price stack rows (right-aligned):
  - Subtotal — was-price strikethrough + green now-price
  - Service Fee ⓘ — same pattern (ⓘ is a hover tooltip)
  - Divider
  - **Total (first month) ⓘ** — biggest green number, bolded
  - Total (after first month) — muted small, no green
- Full-width blue pill CTA: "Reserve space"

The "ⓘ" affordance is worth mirroring in the mockup: it tells reviewers "we thought about the disclosure" without cluttering the panel.

---

## Nav — desktop vs mobile behavior

**Desktop:** sticky white bar, wordmark left, text-link nav center-right (each in `.nb-btn-ghost`), user actions right ("Become a host" as `.nb-btn-nav-outline`, "Sign up" and "Log in" as ghost). No filled CTAs in nav.

**Mobile:** sticky white bar, wordmark + chevron dropdown (hamburger equivalent). Above it, dismissible app-promo banner. Search moves down into the hero.

For the prototype flow: the vehicle-owner mobile experience should preserve the app-promo banner on top of every screen — it reinforces "you're in the Neighbor app" and gives you a persistent brand strip that costs nothing.

---

## Motion & feedback — restrained, not showy

Observed:
- Hover on ghost buttons: border-color transitions in on ~150ms cubic-bezier(0.2,0,0,1)
- Hover on cards: subtle lift (`transform: translateY(-1px)` + `box-shadow: 0 8px 24px rgba(0,0,0,0.06)`)
- Active on primary CTA: `scale(0.98)`
- Flow progress bar: `transform` transition on scaleX
- Radio card selection: border + inset shadow swap on ~150ms

Nothing bounces or springs. If the prototype adds a `receipt → activation` transition, keep it in the same 150–400ms band with the same ease. **The one hero animation** (the `−$185 → $0` price flip) can be a bit more theatrical because it's the wedge moment; everything else should whisper.

---

## What NOT to mimic

- Neighbor's *own* current hero image (family walking to a cabin) is theirs; use a plausible RV/parking image instead. Unsplash has good RV photos.
- Neighbor's "Instant book" lightning-bolt icon has trademark shape — draw a generic bolt instead.
- Do not copy Justin's face from the "Meet Justin" testimonial — use a placeholder avatar or a stock portrait.
- Do not use the wordmark SVG verbatim — replicate the pattern (blue "Neighbor" in Inter 700 with house glyph) but keep it close, not identical, since the mockup is a proposal, not a copy of production UI.
