# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Already resolved in `docs/technical/requirements.md` (not delegated): SvelteKit 2 on Svelte 5 runes, TypeScript strict, pnpm, Node >= 22, `@sveltejs/adapter-cloudflare` deploying to Cloudflare Pages, Paraglide JS for i18n, MDsveX for Markdown content, Zod-validated front matter, plain CSS with custom properties (no utility-class framework), Vitest + Playwright + axe-core, ESLint + Prettier. Nothing is scaffolded yet.

## Users

Primary, confirmed:

- **The public / culturally curious** — people who encounter the collective and want to understand it, watch the films, see the paintings and the places. Twelve locales are required, so this audience is explicitly global, including RTL (Arabic) and CJK, Devanagari and Cyrillic scripts.
- **Sponsors and patrons** — people deciding whether the project's spirit is one they want to fund. They evaluate character and seriousness, not deliverables.

Secondary (success metrics name them, but the site is not primarily built for them): prospective host spaces (temples and similar guardians) and press/curators. Press material lives in the archive's `PRESS.md`, whose terms are not yet agreed; the site must not present anything as cleared for editorial use.

## Product Purpose

The main website of the Hitotoki Collective (一時, "one moment"): an art project born in Switzerland, bred in Japan, performing live collaborations — a painter working in sumi-e and calligraphy alongside improvising musicians — inside places such as Kyoto temples. Each performance is improvised once and never repeated.

The site exists to be the collective's lasting public record and its front door. Success in the first year, confirmed:

1. A durable, well-documented record of each performance — the site is itself one of the "signposts" the collective leaves.
2. Sponsorship enquiries from people in tune with the spirit.
3. Invitations from new host spaces.
4. Reach: films and images seen widely, press coverage.

## Positioning

Two claims a neighbouring project could not truthfully copy:

- **The moment is the work.** Painting, music, film, photography and movement converge in a single unrehearsed sitting in a place where "time opens onto a primordial timelessness". Nothing is repeated.
- **Counter-intuitive economics of culture.** Funded by sponsors in tune with the spirit; the fruits of each performance are given freely to the guardians of the space where it happened — as respect, and because guardians are the best assurance the signposts survive history. The collective frames its traces as left for "forecestors" who will navigate their own times.

Source: `docs/conceptual/index.md` (approved voice).

## Operating Context

- Content is git-based, no CMS. Performance material comes from the upstream `hitotoki-collective/archive` repository, mounted read-only as a submodule at `src/content/archive`. One flat folder per performance, `performances/PRF-<NN>/`, with a human-authored `PRF-<NN>-MANIFEST.md` (overview, space, participants, links, provenance, derivatives), 4K stills (`IMG`), a master film (`VID-00`), 30-second segments and montages, OCR'd subtitles, per-speaker quote extracts (`QTE`), interview transcripts (`TSC`), and occasionally an original written text (titled, e.g. `PRF-01-FORTY-MINUTES-ABOVE-THE-POND.md`).
- Two performances exist: PRF-01 (2025-05-16, royal tea house, Daikaku-ji, Kyoto) and PRF-02 (2025-10-01, Jingo-ji, Kyoto, where the head priest joined with his own calligraphy).
- Video is never served from the repository. It lives on Cloudflare Stream (masters) and R2 (segments, montages); the mapping is a proposed `PRF-<NN>-media.yaml` sidecar (`docs/technical/archive-media-schema.md`, draft, not yet agreed upstream). The build must not read `.mp4` files.
- Deploys to Cloudflare Pages; prerendered where possible; per-PR previews.

## Capabilities and Constraints

Confirmed sections for the first build:

- **Performances** — one page per `PRF-<NN>`: film, stills, participants and credits, the written text where one exists.
- **Manifesto / about** — the conceptual text, the economics-of-culture stance, the meaning of Hitotoki.
- **Journal / news** — dated posts: upcoming performances, announcements.

Explicitly deferred: **per-person pages** for artists and participants. Participants are credited within performance pages; design should leave room for person pages later without building them now.

Explicitly undecided:

- **Contact mechanism** for sponsorship and host enquiries (mailto only vs a Cloudflare-native form). Design around a clear contact point without committing to a mechanism.
- Signed vs public playback for master films; whether `media.yaml` is generated or hand-maintained; per-locale poster images (all recorded as open in the media schema doc).

Hard constraints from `docs/technical/requirements.md`:

- 12 locales (`ar`, `zh-Hans`, `en`, `fr`, `de`, `hi`, `it`, `ja`, `ko`, `pt`, `ru`, `es`); `en` is source. Locale always in the URL path; no unprefixed routes.
- Layout must be direction-agnostic (CSS logical properties), tolerate ~2× text expansion and CJK/Arabic/Devanagari vertical metrics, with no per-locale layout hacks. No text baked into images.
- Core content routes legible and usable with JavaScript disabled; server-rendered HTML carries primary content.
- Light and dark schemes via `prefers-color-scheme`; all motion suppressible under `prefers-reduced-motion`.
- Budgets on mid-tier mobile over throttled 4G: LCP < 2.0 s, INP < 200 ms, CLS < 0.1, < 100 KB compressed JS per route, < 150 KB font data per locale, fonts subset per script.
- CSP with no `unsafe-inline`/`unsafe-eval` in `script-src`. No third-party tracking; no consent banner unless the requirements doc is updated first.
- SEO/AI: unique per-locale titles, hreflang for all locales + `x-default`, JSON-LD (`Organization`, `Person`, `VisualArtwork`, `Event`), localised sitemap, `/llms.txt`, per-locale feed, explicit AI-crawler policy (default: allow).

Terminology: *performance* (not exhibition or event) for a `PRF-<NN>`; *guardians* for host institutions; *signpost* / *trace* for what a performance leaves behind; *forecestors* is the collective's own coinage and must be kept as written.

## Brand Commitments

- Name: **Hitotoki Collective**; Japanese **一時** ("one moment").
- Seal / mark: `src/content/archive/core/seal/seal.svg` plus dark and `-light` rasters at 32–512 px; `core/favicon.ico`. These are the only existing brand assets.
- Approved voice: `docs/conceptual/index.md` only. The "About" copy in the archive's `PRESS.md` is draft and **not approved**; do not use it as site copy.
- Licence of archive material: CC BY-NC-SA 4.0; every reuse honours each manifest's `## Provenance`.

## Evidence on Hand

- Two performances fully documented in the archive, with 4K stills (credited, photographer Mark Greenslade for both so far), master films (4K, on screener links; Stream/R2 hosting pending), 30 s montages (no on-screen text, music-led) and segments (burned-in subtitles) in 16:9 and 9:16.
- Per-speaker quote extracts and interview transcripts exist but are **machine-transcribed and unproofed**: never present them as verbatim quotes. The archive's written texts paraphrase them and must not be cited as anyone's words.
- Crew lists in manifests are partly OCR'd from closing credits and marked unverified; `TODO` placeholders are legitimate and must not be filled by guessing.
- Absent, do not fabricate: testimonials, sponsor names or logos, visitor numbers, press quotes, cleared press terms, pricing, upcoming dates.

## Product Principles

1. **The record outlives the campaign.** Every performance page is built as a durable document first; marketing concerns never compromise its completeness or accuracy.
2. **Let the work lead; the interface recedes.** Film, ink, stills and place are the content. Chrome, copy and motion exist to get out of the way.
3. **One site, twelve readerships.** Nothing is designed for English and patched for the rest; Arabic, Japanese and German are first-class from the first layout.
4. **Say less, truthfully.** Real people, real places, machine transcripts marked as such, nothing invented to fill a gap. Placeholders over fabrication.
5. **Spirit over pitch.** Sponsors are moved by the character of the project, not by a funnel; the site invites alignment rather than selling.

## Accessibility & Inclusion

WCAG 2.2 Level AA is a hard requirement: keyboard-operable with visible focus and skip link, 4.5:1 text contrast, 24×24 px targets, reduced-motion respected, colour never the sole carrier of meaning. axe-core runs in CI on at least `en`, `ja` and `ar`; manual screen-reader verification is required before launch. Every image carries per-locale alt text.
