---
name: Hitotoki Collective
description: A goshuinchō, the pilgrim's stamp book — brocade indigo cloth, warm washi leaves, sumi type, and vermilion only where a stamp is pressed.
colors:
  washi: "#f5f0e6"
  washi-deep: "#e9e1d0"
  sumi: "#1a1715"
  cloth: "#1d2740"
  cloth-deep: "#141b2e"
  cloth-night: "#0d1322"
  vermilion: "#a83c25"
  ink-soft: "#655c53"
  rule: "#d6cbb6"
  crease: "color-mix(in oklab, #1a1715 14%, #f5f0e6)"
  selection: "color-mix(in oklab, #a83c25 22%, #f5f0e6)"
  cover-ink-soft: "#b9bfd2"
  dark-ink: "#ece5d8"
  dark-ink-soft: "#aab0c4"
  dark-rule: "#35415f"
  dark-crease: "color-mix(in oklab, white 22%, #1d2740)"
  dark-selection: "color-mix(in oklab, #a83c25 45%, #1d2740)"
typography:
  display:
    fontFamily: "Shippori Mincho, Noto Serif JP, Noto Serif, serif"
    fontSize: "clamp(2.6rem, 1.6rem + 5vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Shippori Mincho, Noto Serif JP, Noto Serif, serif"
    fontSize: "clamp(2rem, 1.6rem + 2vw, 3.2rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Shippori Mincho, Noto Serif JP, Noto Serif, serif"
    fontSize: "clamp(1.5rem, 1.3rem + 1vw, 2.1rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  subtitle:
    fontFamily: "Shippori Mincho, Noto Serif JP, Noto Serif, serif"
    fontSize: "clamp(1.2rem, 1.1rem + 0.5vw, 1.5rem)"
    fontWeight: 500
    lineHeight: 1.15
  body:
    fontFamily: "Noto Serif, Noto Serif JP, Noto Naskh Arabic, Noto Serif Devanagari, serif"
    fontSize: "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.65
    fontFeature: "'kern', 'liga', 'onum', 'pnum'"
  reading:
    fontFamily: "Noto Serif, Noto Serif JP, Noto Naskh Arabic, Noto Serif Devanagari, serif"
    fontSize: "clamp(1.2rem, 1.1rem + 0.5vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Shippori Mincho, Noto Serif JP, Noto Serif, serif"
    fontSize: "clamp(0.83rem, 0.8rem + 0.15vw, 0.92rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0.16em"
  cover-title:
    fontFamily: "Shippori Mincho, Noto Serif JP, Noto Serif, serif"
    fontSize: "clamp(1.2rem, 1.1rem + 0.5vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0.22em"
  small:
    fontFamily: "Noto Serif, Noto Serif JP, Noto Naskh Arabic, Noto Serif Devanagari, serif"
    fontSize: "clamp(0.83rem, 0.8rem + 0.15vw, 0.92rem)"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  none: "0"
  focus: "2px"
  stamp: "3px"
spacing:
  space-1: "0.25rem"
  space-2: "0.5rem"
  space-3: "1rem"
  space-4: "1.5rem"
  space-5: "2.5rem"
  space-6: "4rem"
  space-7: "6.5rem"
  gutter: "clamp(1rem, 4vw, 3rem)"
  fold: "clamp(3.5rem, 9vw, 7rem)"
components:
  stamp:
    backgroundColor: "{colors.vermilion}"
    textColor: "{colors.washi}"
    typography: "{typography.title}"
    rounded: "{rounded.stamp}"
    padding: "0.5rem 1rem 1rem"
  skip-link:
    backgroundColor: "{colors.vermilion}"
    textColor: "{colors.washi}"
    padding: "0.5rem 1rem"
  cloth-header:
    backgroundColor: "{colors.cloth}"
    textColor: "{colors.washi}"
    typography: "{typography.label}"
    padding: "1rem clamp(1rem, 4vw, 3rem)"
  cloth-nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.washi}"
    typography: "{typography.small}"
    padding: "0.25rem 0"
  language-menu:
    backgroundColor: "{colors.washi}"
    textColor: "{colors.sumi}"
    rounded: "{rounded.none}"
    padding: "1rem 1.5rem"
  language-menu-current:
    textColor: "{colors.vermilion}"
  cover:
    backgroundColor: "{colors.cloth}"
    textColor: "{colors.washi}"
    typography: "{typography.cover-title}"
    padding: "4rem clamp(1rem, 4vw, 3rem)"
    height: "100svh"
  leaf:
    backgroundColor: "{colors.washi}"
    textColor: "{colors.sumi}"
    rounded: "{rounded.none}"
    padding: "2.5rem 2.5rem 2.5rem 0"
    width: "min(88vw, 56rem)"
  leaf-even:
    backgroundColor: "color-mix(in oklab, #f5f0e6 94%, #e9e1d0)"
  pasted-still:
    backgroundColor: "{colors.washi-deep}"
    rounded: "{rounded.none}"
  people-row:
    textColor: "{colors.sumi}"
    typography: "{typography.body}"
    padding: "0 0 0.5rem"
  colophon:
    backgroundColor: "{colors.cloth}"
    textColor: "{colors.washi}"
    padding: "4rem clamp(1rem, 4vw, 3rem) 6.5rem"
---

# Design System: Hitotoki Collective

## Overview

**Creative North Star: "The Goshuinchō"**

The site is a pilgrim's stamp book. Every performance is a page received from the guardians of the place where it happened: a vermilion date mark pressed in the fold margin, the place name as the largest thing on the leaf, the finished painting pasted whole beneath it. The book has a cloth cover (brocade indigo), warm washi leaves, and one voice of sumi type. Nothing on the site imitates the artist's brushwork; the only ink wash and calligraphy anywhere are in the photographs.

Density is low and the rhythm is editorial: one leaf at a time, generous fold and gutter, a 66ch measure, soft section labels in letterspaced small caps. Depth is physical rather than digital: a crease between leaves, the shadow a page casts on the cover as it slides over it, the lift of a photograph kept in a book. Colour is committed: indigo owns whole regions (cover, header, footer, the entire dark scheme), washi owns the page, and vermilion is rationed to the four places a stamp would be.

Twelve locales, including RTL Arabic and three Han-script locales, are first-class. Every layout rule is written in logical properties; Han glyph forms follow `:lang()`; Arabic and Devanagari swap the whole family and loosen the leading. Core content is server-rendered and legible with no JavaScript; the fold is `<details>`, scroll-snap and a CSS scroll-timeline, and under reduced motion the book is already open and still.

**Key Characteristics:**
- Two materials, cloth and washi, each carrying its own procedurally generated texture tile (`scripts/textures.mjs`, provenance in the PNG `tEXt`).
- Vermilion appears only on the seal, the date stamp, the current-language marker and focus/selection.
- One display face (Shippori Mincho) above one body family (Noto Serif per script); no sans, no mono.
- A fluid, clamp-based type ramp of six steps and a seven-step spacing scale; no breakpoint-specific font sizes.
- Sideways folding: leaves snap horizontally in the reading direction, with a 1px crease and an inset shadow at each fold.
- Flat surfaces with physical depth only: inset creases, a page-over-cover lift, a soft lift under pasted stills; no cards, no borders-as-decoration, no radius above 3px.
- Motion is scroll-driven or near-instant (160ms); reduced motion stops everything.

## Colors

The palette is three materials and a seal: warm washi, deep indigo cloth, sumi ink, and vermilion pressed sparingly.

### Primary
- **Vermilion** (`vermilion`): the stamp colour. Fills the date mark (`Stamp.svelte`), the skip link on focus, the `:focus-visible` outline, and tints `::selection`. It is also the text colour of the current language in the menu. It is never a background for a region, never a link colour, never a heading colour.
- **Washi on Vermilion** (`washi`): the only ink the stamp carries; the seal SVG uses the same pairing and does not change between schemes.

### Neutral
- **Washi** (`washi`): the open page. `html` background in the light scheme, tiled with `washi.png`; also the ink on cloth (`--cover-ink`) in both schemes.
- **Washi Deep** (`washi-deep`): the loading ground behind every still frame and the tint mixed into even-numbered leaves (94% page, 6% deep).
- **Sumi** (`sumi`): the ink. All text and headings on washi; links inherit it.
- **Ink Soft** (`ink-soft`): secondary ink for place lines, roles, "and others", notes, stills count, section labels and the fold-navigation direction word.
- **Rule** (`rule`): hairlines under people rows, the short `hr` inside written texts, the language-menu border and the credits divider when it stacks.
- **Crease** (`crease`): the fold between leaves and the fold margin's edge; a 14% sumi tint of washi, never a plain grey.
- **Cloth** (`cloth`): the brocade cover. Header, colophon footer, the home cover, the `theme-color`, and the page itself in the dark scheme, tiled with `brocade.png`.
- **Cloth Deep / Cloth Night** (`cloth-deep`, `cloth-night`): the darker cloth used for cover regions once the whole page is already cloth (dark scheme), and the deep behind frames there.
- **Cover Ink Soft** (`cover-ink-soft`): secondary washi on cloth; the cover tagline, the "Open the book" affordance, the Japanese name and licence line in the colophon.
- **Dark Ink / Dark Ink Soft / Dark Rule / Dark Crease** (`dark-*`): the dark-scheme equivalents of ink, soft ink, rule and crease; the crease becomes a 22% white lift of the cloth so the fold still reads on indigo.

### Named Rules
**The Four Stamps Rule.** Vermilion is pressed, never painted: it appears only as the seal, the date stamp, the current-language marker, and focus/selection. Any new surface that wants a fifth vermilion element must justify it as a stamp.

**The Two Materials Rule.** Every region is either cloth or washi, and each carries its texture tile with its colour (`var(--texture-cover) var(--cover)`, `var(--texture-page) var(--page)`). There is no third surface colour, no white, no grey panel.

**The Same Seal Rule.** The 一時 seal is the archive's `seal.svg`, vermilion ground and washi glyphs, identical in light and dark. It is never recoloured, inverted or redrawn.

## Typography

**Display Font:** Shippori Mincho (with the locale's Noto Serif CJK, then Noto Serif, serif)
**Body Font:** Noto Serif (with the locale's Noto Serif CJK, Noto Naskh Arabic, Noto Serif Devanagari, serif)
**Label/Mono Font:** none; labels are Shippori Mincho, numerals are tabular Noto Serif/Shippori

**Character:** One Mincho voice across twelve scripts. Shippori Mincho carries names, places and labels at light weight (400) with slightly tightened tracking; Noto Serif carries reading text with oldstyle proportional figures (`onum`, `pnum`) and tabular figures on `time` and `.numeric`. In `ar` and `hi` both roles collapse to Noto Naskh Arabic / Noto Serif Devanagari with leading loosened to 1.9 / 1.85; in `ja`, `zh-Hans` and `ko` the `--font-cjk` slot resolves to the regional Noto Serif so Han forms are correct without changing the stack.

### Hierarchy
- **Display** (400, `--step-4`, 1.02, -0.02em): the place name on a performance page; the single largest thing on the leaf.
- **Headline** (400, `--step-3`, 1.15, -0.01em): the place name on a home leaf (`h3.place`) and base `h1`.
- **Title** (500, `--step-2`, 1.15, -0.01em): base `h2`, the heading inside a written text; the stamp number uses this size at 700.
- **Subtitle** (500, `--step-1`, 1.15): base `h3`; the colophon site name at 0.04em.
- **Reading** (400, `--step-1`, 1.6): paragraphs inside the written text and the home inscription, with a Shippori drop cap on the first paragraph (`2.8em` on the performance text, `2.6em` on the inscription, `float: inline-start`, line-height 0.85).
- **Body** (400, `--step-0`, 1.65): everything else; `p` is capped at `--measure` (66ch) and wraps `pretty`; headings wrap `balance`; `hanging-punctuation: first last`.
- **Label** (400, `--step--1`, uppercase, 0.16em): section headings inside the reading column and credits aside ("Place", "Artists", "Credits"), in soft ink. These are real `h2` elements, not decorative kickers.
- **Cover Title** (400, `--step-1`, uppercase, 0.22em): "Hitotoki Collective" under the seal on the closed cover only.
- **Small** (400, `--step--1`, 1.65): notes (`[role=note]`), the stills count, the stamp date, header navigation, licence line.

### Named Rules
**The One Voice Rule.** Two families, one character: Shippori Mincho for display and labels, Noto Serif for reading. No sans-serif, no monospace, no system face, in any locale. Script changes swap the family through `:lang()` tokens, never through per-locale selectors in components.

**The Light Display Rule.** Display and headline sizes are set at weight 400; 500 is the heaviest a heading goes, and 700 is reserved for the stamp number and inline emphasis.

**The Label Is A Heading Rule.** Small uppercase letterspaced text is only used where it is the heading of the section that follows (`h2` at `--step--1`, 0.16em, soft ink). Nothing sits above a heading as a kicker.

## Layout

The spatial model is a leaf with a fold margin. On the performance page the leaf is a two-column grid, `var(--fold) minmax(0, 1fr)`, capped at 84rem and centred; the fold margin holds the stamp and the vertical (`writing-mode: vertical-rl`) previous/next navigation, separated from the page by a 1px crease and an inset shadow. The page column then splits into a reading column and a sticky credits aside (`minmax(0, 1fr) minmax(14rem, 20rem)`, gap `--space-6`, aside stuck at `--space-4` from the top).

On home, the cover is `position: sticky` at full viewport height (`100svh`) and the book slides over it. Leaves are an `ol` laid out as `grid-auto-flow: column`, each `min(88vw, 56rem)` wide, horizontally scrollable with `scroll-snap-type: x mandatory`, `scroll-padding-inline: var(--gutter)` and a thin scrollbar; each leaf is itself a `var(--fold) 1fr` grid. The inscription below is a single 40rem column. The colophon's inner row is capped at 72rem.

Spacing uses the seven-step scale exclusively: `--space-2`/`--space-3` inside components, `--space-4`/`--space-5` between blocks, `--space-6` between sections and above the lead still, `--space-7` above the colophon. Horizontal page padding is always `--gutter`.

Responsive behaviour is content-driven, in `max-width` rem queries, and nothing changes font size by breakpoint:
- `64rem`: the credits aside stops being sticky and stacks under the reading column with a rule above it.
- `48rem`: the fold margin turns into a horizontal strip above the page (stamp on one side, fold links on the other, `horizontal-tb`), the crease moves to its bottom edge, leaves become `84vw` so the next leaf shows a real edge, and pasted stills lose their alternating offsets.
- `40rem`: the header wraps, its gaps tighten, and the brand's text is visually hidden beside the seal.

All offsets, borders and insets are logical (`inset-inline-start`, `border-inline-end`, `padding-inline`, `margin-block`), so the Arabic locale mirrors the fold, the accordion direction and the drop cap without any per-locale rules.

### Named Rules
**The Fold Margin Rule.** Anything that belongs to the page's provenance (the stamp, the way to neighbouring pages) lives in the fold margin at `--fold` width; the page content never enters it.

**The Logical Only Rule.** No physical direction properties (`left`, `right`, `margin-left`, `padding-right`, `text-align: left`) anywhere; the one `translate: -50% 0` on the cover affordance is centring, not direction.

## Elevation & Depth

Surfaces are flat and depth is physical. There are no raised cards and no hover lifts. Depth appears in exactly four places, all describing paper: the book's edge lifting over the cover, the crease between leaves, the fold margin's gutter, and photographs pasted into the book. Shadows are soft, large-blur, negative-spread black at 0.45–0.6 alpha, and none are offset hard edges.

### Shadow Vocabulary
- **Book over cover** (`box-shadow: 0 -18px 40px -24px rgb(0 0 0 / 0.6)`): the top edge of the page section as it slides over the sticky cover on home.
- **Leaf crease** (`border-inline-end: 1px solid var(--crease); box-shadow: inset -24px 0 28px -30px rgb(0 0 0 / 0.55)`): the inline-end edge of every home leaf except the last.
- **Fold margin** (`border-inline-end: 1px solid var(--crease); box-shadow: inset -18px 0 22px -24px rgb(0 0 0 / 0.5)`): the performance page's gutter edge.
- **Pasted still** (`box-shadow: 0 10px 24px -16px rgb(0 0 0 / 0.45)`): under each secondary still on a performance page; the lead still carries none.
- **Stamp press** (`box-shadow: 0 1px 0 color-mix(in oklab, var(--stamp) 60%, black)`): a one-pixel darker vermilion edge that reads as impression, not elevation.
- **Language menu** (`box-shadow: 0 10px 30px -12px rgb(0 0 0 / 0.45)` with `border: 1px solid var(--rule)`): the only floating surface.

### Named Rules
**The Paper Depth Rule.** A shadow may only describe paper: a crease, a fold, a page over cloth, a photograph kept in a book. Nothing is elevated on hover or focus; focus is the vermilion outline.

## Shapes

Square. Every surface, frame and still has `border-radius: 0`; the lead still is uncropped at its own ratio while index frames are a fixed `4 / 3` crop with `object-fit: cover`. The two exceptions are small: the stamp is `3px` (a rubber stamp's softened corner) and rotated `-1.5deg` because a pressed stamp is never square to the page, and the focus outline is `2px`. Borders are hairlines (1px) in rule or crease colour and only where paper has an edge: people rows, the short 6rem `hr` inside texts, the header's 14% washi underline, the language menu. Pasted stills alternate `12%` inline offsets, odd to the start and even to the end. Link underlines are 1px at 45% of the ink, offset 0.18em, and darken to full ink on hover; navigation links use a 1px bottom border instead, filled on hover and `aria-current`.

## Components

### Buttons
There are no buttons. Every action is a link: "Open the book" (`a.open`, display face, `--step--1`, 0.1em, soft cover ink, 1px bottom border at 40% washi, both filled on hover), "Open this page", fold links, external links. Any future button inherits the link grammar: ink text, hairline underline, vermilion only on focus.

### Stamp (signature)
The vermilion date mark pressed in the fold margin (`Stamp.svelte`).
- **Shape:** `3px` radius, rotated `-1.5deg`, `white-space: nowrap`, one-pixel darker press edge.
- **Colour:** vermilion ground, washi ink; identical in both schemes.
- **Type:** number at `--step-2`, 700, 0.04em, tabular; date beneath at `--step--1`, tabular, 0.92 opacity; both in Shippori Mincho, `line-height: 1.1`.
- **Padding:** `--space-2 --space-3 --space-3`.
- **Semantics:** a `p` with `aria-label` "Performance NN"; the number is `aria-hidden`, the date is a `time` with `datetime`, formatted in the locale in `Asia/Tokyo`.

### Seal (signature)
The archive's `seal.svg` as an `img` sized by the caller (`1.75rem` in the header, `2.5rem` in the colophon, `clamp(6rem, 24vmin, 12rem)` on the cover); decorative copies carry empty alt, the cover copy carries "一時 — the Hitotoki seal".

### Cover (signature)
Full-viewport sticky cloth at `z-index: 0`, centred grid: seal, cover title, tagline in soft cover ink at 34ch, and the "Open the book" affordance absolutely placed `--space-5` from the bottom. With `animation-timeline: scroll(root block)` over `0 100svh` the inner group and affordance `recede` (opacity 0.15, scale 0.92, translate 0 -6vh, blur 2px) as the book slides over; under reduced motion or without scroll-timeline support the cover is static.

### Leaf (home, signature)
One performance in the accordion: `var(--fold) 1fr` grid, padding `--space-5` except at the fold side, stamp centred in the margin; place name as a bare link at Headline size (underline on hover only), place line in soft ink, a `4 / 3` frame on `--page-deep`, artists in the display face at body size, then "Open this page" at `--step--1` with a 0.22em underline offset. Even leaves are tinted 6% toward washi-deep; every leaf but the last carries the crease.

### Pasted Still
A `figure` on `--page-deep` with the pasted-still shadow, full inline width, natural height, alternating `12%` inline offsets; images are `enhanced:img` with locale alt text and lazy loading after the lead.

### People List
A `ul.people` of rows: `minmax(10rem, max-content) 1fr` grid (name in the display face, role in soft ink), `--space-2` gap, hairline rule under each row. `.compact` collapses to one column for the credits aside. A final row reads "and others" in soft ink wherever the manifest marks a section incomplete.

### Credits Aside
Sticky at `--space-4` on wide viewports; Label-style `h2`, `h3` at body size with `--space-4` above and `--space-2` below; unverified crew preceded by a `[role=note]` sentence; links list with `--space-2` gaps.

### Navigation
- **Header:** cloth with texture, washi ink, display face at `--step--1`, `--space-3 --gutter` padding, 1px bottom hairline at 14% washi; absolutely laid over the cover on home with no background or border. Brand is seal plus name at 0.04em; links sit on a transparent 1px bottom border that fills on hover and `aria-current`.
- **Language menu:** a native `<details>`; the summary hides its marker and draws a 0.45em chevron from two borders; the panel is a washi two-column grid (`repeat(2, max-content)`) with `--space-1 --space-4` gaps, `--space-3 --space-4` padding, rule border and the language-menu shadow; the current locale is set in vermilion and `aria-current="true"`. Each item carries `lang` and `hreflang`.
- **Fold navigation:** vertical (`vertical-rl`) links in the fold margin, display face at body size: a direction word in soft ink at 0.08em over the neighbouring place name, underlined on hover; flips to `horizontal-tb` under 48rem.
- **Skip link:** vermilion ground, washi text, `--space-2 --space-3` padding, placed at `--gutter` inline-start and revealed to `--space-2` from the top on focus.

### Colophon
Cloth footer `--space-7` below content, `--space-6 --gutter --space-7` padding, inner row capped at 72rem: seal at 2.5rem beside the name (Subtitle size, 0.04em) with 一時 in soft cover ink, the contact mailto, and the licence line at Small size.

### Inputs / Fields
None exist. The contact mechanism is a mailto link in the colophon.

## Do's and Don'ts

### Do:
- **Do** compose every region as cloth or washi with its texture tile (`var(--texture-cover) var(--cover)` / `var(--texture-page) var(--page)`), and let the dark scheme be the whole book seen as cloth.
- **Do** press vermilion only as the seal, the date stamp, the current-language marker and focus/selection (The Four Stamps Rule).
- **Do** set every size from the fluid ramp `--step--1`..`--step-4` and every gap from `--space-1`..`--space-7`, `--gutter` and `--fold`; no literal px/rem sizes in components.
- **Do** write all direction in logical properties and let `:lang()` swap families; Arabic mirrors the fold and the accordion without extra rules.
- **Do** make the place name the largest type on any performance surface (`--step-4`, 400, 1.02) and keep headings at weight 400–500.
- **Do** show the lead still whole and uncropped on a performance page; crop to `4 / 3` only in index frames.
- **Do** keep core content in server-rendered HTML: `<details>` for menus, scroll-snap and scroll-timeline for the fold, no JavaScript needed to read a page.
- **Do** wrap motion in `@supports (animation-timeline: scroll())` and `prefers-reduced-motion: no-preference`; the base stylesheet already zeroes all durations under reduced motion.
- **Do** carry the archive's truth in copy: real names only, "and others" where a manifest section is TODO, the unverified-crew note, the written-text caveat, and never a machine transcript or caption quoted as anyone's words.
- **Do** load fonts per script: fontsource subsets for Latin, Cyrillic, Arabic and Devanagari, and CJK stylesheets as `<link>` only for their own locale.

### Don't:
- **Don't** draw ink: no brush strokes, splashes, calligraphic rules, hand-drawn borders or textured type. The only brushwork on the site is the painter's, in photographs.
- **Don't** use vermilion for links, headings, backgrounds, buttons or hover states, and don't recolour or invert the seal.
- **Don't** add a third surface colour, a white or grey panel, a card, a border-radius above 3px, or any hover elevation.
- **Don't** introduce a sans-serif, monospace or system face, or set a heading at 700 (the stamp number is the sole exception).
- **Don't** place a kicker or eyebrow above a heading; the small uppercase label is itself the section heading.
- **Don't** build a thumbnail grid of equal cards or a video hero; the index is a sideways accordion of leaves and film is an outbound link.
- **Don't** use physical direction properties or per-locale layout overrides.
- **Don't** bake text into images, fabricate names, quotes, sponsors or dates, or fill a TODO by guessing.
