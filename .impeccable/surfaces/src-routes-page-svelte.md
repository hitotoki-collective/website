---
version: 1
slug: "src-routes-page-svelte"
primary_target: "src/routes/+page.svelte"
related_targets: ["src/routes/performances/[code=code]/+page.svelte"]
---

# Surface brief — Home and Performance page

Scope: `src/routes/+page.svelte` (home) and `src/routes/performances/[code=code]/+page.svelte` (one performance). Visitor mode: Experience on both. Confirmed by the user on 2026-10-07.

## Audience, job, action

Culturally curious visitor arriving cold on phone or laptop; sponsors reading the same pages to judge character. They must understand within one screen what Hitotoki is, enter one performance, and leave with its place, date, people, images and text. Proof is real material only: stills, manifests, the approved conceptual text (`docs/conceptual/index.md`), the seal. Film is an outbound screener link for now. Captions and transcripts are never quoted.

## Content and ranges

Performances 2 now, up to 99; the accordion must still read at 12+. Stills 16–39 per performance, curated mechanically for now: `IMG-00` lead + next five, list kept in site content and swappable. Written texts 0–1. Participant sections may be empty or TODO-incomplete ("and others"). Crew unverified note on both current manifests. Fallback notice when a locale lacks a translation. Journal empty state.

## Constraints

12 locales incl. RTL Arabic; logical properties; ~2× text expansion. < 100 KB JS per route (fold and accordion near-zero JS), < 150 KB fonts per locale (per-script subsets, ja sliced). WCAG 2.2 AA, axe on en/ja/ar. CSP with no inline scripts. Core content legible without JavaScript. Light and dark schemes.

## Anti-goals

No video hero, no equal-thumbnail card grid, no ink-splash or brush-stroke decoration, no faked brushwork, no invented quotes, testimonials or sponsors, no person pages, no form.

## Open decisions

Contact mechanism (mailto `contact@hitotoki-collective.org` meanwhile). Film hosting (Stream/R2). Curated still lists. Approved About copy beyond the conceptual doc.

## Direction contract

THESIS: The site is a goshuinchō, the pilgrim's stamp book: each performance is a page received from the guardians of the place where it happened, a vermilion seal and a date on washi. It refuses the category's dark looping film hero over a grid of equal thumbnails.

OWN-WORLD: Brocade indigo cloth for the cover, header, footer and the dark scheme; thick warm-white washi for pages; sumi black type; vermilion only where a stamp would be — the 一時 seal, a performance's date mark, the current-page marker. Committed colour: indigo owns whole regions. Display face Shippori Mincho (ja + Latin), body Noto Serif per script; one voice across twelve scripts. Leaves fold sideways along a visible crease; the fold margin holds the stamp and date like a gutter. The only brushwork on the site is Taro's, in photographs.

STORY: The visitor meets a closed book with one seal, opens it, finds a sequence of dated pages from Kyoto temples, reads one, and understands that each page was given to its place. Sponsors read seriousness and restraint; curious visitors look at the pictures and the text and come back for the next page.

FIRST VIEWPORT: Home: the closed cover fills the viewport — indigo cloth edge to edge, the 一時 seal centred at roughly a quarter of the viewport's shorter side, "Hitotoki Collective" small beneath it in the display face, nothing else; scrolling opens the book and the cover gives way to the accordion of leaves running sideways in the reading direction, newest first, each leaf with date mark, large place name, lead still, artists. Performance page: one opened leaf on washi — vermilion date mark and number in the fold margin, the place name as the largest type on the page, the lead still pasted whole and uncropped beneath; the reading column (text, artists, credits, curated stills) continues below; fold edges to the previous and next performance at the leaf's sides. Primary action on home: open the newest leaf.

FORM: Goshuinchō — the pilgrim's accordion stamp book; position 1 on the ordered grounded list (IMPECCABLE'S PICK, chosen over the assigned candidate 7); seed key 529d7e10; code-led. Signature interaction: the fold — a sideways turn along a crease between leaves, and a scroll-driven opening of the cover on home (CSS scroll-timeline); under reduced motion everything is already open and still.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
