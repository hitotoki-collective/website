# Technical Requirements

## High Level

- The website MUST be:
  - creative
  - unique
  - SEO optimised
  - AI optimised
  - web accessibile
  - i18n optimised

- The website MUST support the following languages:

  | Language   | BCP 47 tag | Script | Direction |
  | ---------- | ---------- | ------ | --------- |
  | Arabic     | `ar`       | Arab   | RTL       |
  | Chinese    | `zh-Hans`  | Hans   | LTR       |
  | English    | `en`       | Latn   | LTR       |
  | French     | `fr`       | Latn   | LTR       |
  | German     | `de`       | Latn   | LTR       |
  | Hindi      | `hi`       | Deva   | LTR       |
  | Italian    | `it`       | Latn   | LTR       |
  | Japanese   | `ja`       | Jpan   | LTR       |
  | Korean     | `ko`       | Kore   | LTR       |
  | Portuguese | `pt`       | Latn   | LTR       |
  | Russian    | `ru`       | Cyrl   | LTR       |
  | Spanish    | `es`       | Latn   | LTR       |

- English (`en`) is the source locale. All other locales are translations of it.

## Stack

- langs:
  - typescript
- frameworks:
  - node
  - svelte

### Resolved stack

| Concern         | Choice                               | Notes                                                                      |
| --------------- | ------------------------------------ | -------------------------------------------------------------------------- |
| Framework       | SvelteKit 2 (Svelte 5, runes)         | Plain Svelte is not sufficient — routing, SSR and prerendering are required. |
| Language        | TypeScript, `strict: true`            | No implicit `any`. `checkJs` off; no JavaScript source files.                |
| Package manager | pnpm                                  | Lockfile committed.                                                          |
| Node            | Current LTS (>= 22)                   | Pinned via `.nvmrc` and `engines`.                                           |
| Adapter         | `@sveltejs/adapter-cloudflare`        | See Hosting.                                                                 |
| Styling         | Plain CSS with custom properties      | No utility-class framework. Design tokens as CSS custom properties.          |
| i18n runtime    | Paraglide JS (Inlang)                 | Compiles messages to tree-shakeable functions; no runtime dictionary bundle. |
| Content format  | Markdown via MDsveX                   | See Content.                                                                 |
| Testing         | Vitest (unit), Playwright (e2e + a11y)| See Testing.                                                                 |
| Lint / format   | ESLint + Prettier                     | Enforced in CI.                                                              |

## Hosting & Delivery

- The site MUST deploy to Cloudflare Pages using `@sveltejs/adapter-cloudflare`.
- Pages that do not depend on request state MUST be prerendered at build time.
- The production domain MUST serve over HTTPS with HSTS enabled.
- A Content Security Policy MUST be set. `unsafe-inline` and `unsafe-eval` MUST NOT
  appear in `script-src`.
- Preview deployments MUST be generated per pull request and MUST NOT be indexable
  (`X-Robots-Tag: noindex`).
- Static assets MUST be served with immutable, content-hashed filenames.

## Content

- Content is git-based. There is no external CMS.
- Site-authored content lives under `src/content/`, one directory per content type
  (e.g. `works/`, `artists/`, `exhibitions/`, `journal/`).
- The performance archive is maintained in a separate repository,
  `hitotoki-collective/archive`, and is consumed here as a git submodule mounted at
  `src/content/archive` tracking `main`. It is upstream-owned and MUST be treated as
  read-only by this repository; changes go to the archive repository.
- Each content item is a Markdown file suffixed with its locale tag, e.g.
  `works/tsuki-no-michi.ja.md`. The `en` file is authoritative.
- Front matter MUST be typed and validated at build time (Zod schema). A build MUST
  fail on invalid or missing required front matter.
- UI strings live in `messages/<locale>.json`, one file per locale, managed by Inlang.
- A missing translation MUST fall back to `en` and MUST be reported by the build as a
  warning, never silently rendered as a key.
- Images MUST be committed as originals and transformed at build time into responsive
  AVIF/WebP sets. Every image MUST carry per-locale alt text.

### Archive checkout

The archive stores performance video in Git LFS. The video directories total roughly
4 GB, which exceeds what a build needs and what the Cloudflare Pages build environment
will tolerate.

- The archive MUST NOT be checked out with a plain `git submodule update --init`.
  Checkouts MUST go through `scripts/checkout-content.sh`, which sets
  `GIT_LFS_SKIP_SMUDGE=1`, applies a sparse-checkout excluding
  `performances/*/video/` and `tmp/`, and then fetches only the image LFS objects.
- The resulting working tree is approximately 4 MB.
- CI and Cloudflare Pages MUST set `GIT_LFS_SKIP_SMUDGE=1` in the build environment so
  that any automatic submodule clone performed before the build command does not smudge
  LFS media, and MUST run `scripts/checkout-content.sh` as the first build step.
- Video MUST be served from a dedicated media host (Cloudflare Stream or R2), never
  from the repository or as a Pages static asset. Manifests in the archive carry the
  playback identifiers.

## Internationalisation

- Locale MUST be carried in the URL path: `/<locale>/<path>` (e.g. `/ja/works/`).
  There is no unprefixed variant; `/` redirects to a negotiated locale.
- Locale negotiation on first visit MUST use `Accept-Language`, then fall back to `en`.
  An explicit user choice MUST be persisted and MUST take precedence over the header.
- Every page MUST emit `hreflang` alternates for all 12 locales plus `x-default`.
- `<html>` MUST carry the correct `lang` and `dir` attributes per locale.
- The layout MUST be direction-agnostic: CSS logical properties
  (`margin-inline-start`, `padding-block`, `inset-inline`) MUST be used instead of
  physical ones. The Arabic locale MUST be visually verified, not assumed.
- Dates, numbers and lists MUST be formatted with `Intl`, never hand-formatted.
- Fonts MUST be subset per script. A Latin-only visitor MUST NOT download CJK, Arabic,
  Devanagari or Cyrillic font data.
- Text MUST NOT be baked into images.

## SEO

- Every page MUST have a unique, locale-specific `<title>` and meta description.
- Server-rendered HTML MUST contain the page's primary content. Content MUST NOT
  require client-side JavaScript to become visible.
- JSON-LD structured data MUST be emitted: `Organization` for the collective,
  `Person` for artists, `VisualArtwork` for works, `Event` for exhibitions.
- Canonical URLs MUST be absolute and self-referencing per locale.
- A localised `sitemap.xml` (with `xhtml:link` alternates) and a `robots.txt` MUST be
  generated at build time.
- Open Graph and Twitter card metadata MUST be present, with per-locale OG images.
- URL slugs MUST be localised where the locale uses a non-Latin script, with a stable
  ID component so links survive slug changes.

## AI Optimisation

- The site MUST publish `/llms.txt` summarising the collective, its sections and the
  canonical URLs for each.
- A machine-readable content feed MUST be exposed per locale (JSON Feed or RSS).
- `robots.txt` MUST explicitly state AI crawler policy per user-agent. The default
  policy is: allow indexing, and this decision MUST be recorded here if it changes.
- Semantic HTML MUST be used over `div` soup: one `<h1>` per page, ordered headings,
  `<article>`, `<figure>`/`<figcaption>`, `<time datetime>`.
- Structured data MUST stay in sync with visible page content — no cloaking.

## Accessibility

- The site MUST conform to WCAG 2.2 Level AA.
- All functionality MUST be operable by keyboard alone, with a visible focus indicator
  and a skip-to-content link.
- Text contrast MUST be at least 4.5:1 (3:1 for large text and UI boundaries).
- All motion MUST be disabled or reduced under `prefers-reduced-motion: reduce`.
- Forms MUST have programmatically associated labels and error messages.
- Interactive controls MUST have a minimum 24×24 CSS pixel target.
- Automated a11y checks (axe-core) MUST run in CI on every route in at least `en`,
  `ja` and `ar`. Automated checks are a floor, not proof — manual screen-reader
  verification is required before launch.

## Design

The visual language is defined in a separate design document. This document fixes only
the constraints the implementation must satisfy:

- The site MUST be legible and fully usable with JavaScript disabled for all core
  content routes.
- The design MUST work across all 12 locales without per-locale layout hacks. Line
  length, heading sizes and component widths MUST tolerate ~2× text expansion
  (German, Russian) and the vertical metrics of CJK, Arabic and Devanagari.
- Colour MUST NOT be the sole carrier of meaning.
- Decorative motion MUST be suppressible and MUST NOT block content rendering.
- Light and dark schemes MUST both be supported via `prefers-color-scheme`.

## Performance

Budgets, measured on a mid-tier mobile device over a throttled 4G connection:

| Metric                    | Budget   |
| ------------------------- | -------- |
| Largest Contentful Paint  | < 2.0 s  |
| Interaction to Next Paint | < 200 ms |
| Cumulative Layout Shift   | < 0.1    |
| JS shipped per route      | < 100 KB compressed |
| Font data per locale      | < 150 KB |

- Lighthouse CI MUST run per pull request and MUST fail the build on budget regression.

## Privacy & Compliance

- No third-party tracking scripts. Analytics, if used, MUST be cookieless and
  self-hosted or Cloudflare-native.
- If no non-essential cookies are set, no consent banner is required. Introducing one
  requires updating this section first.
- A privacy policy MUST be available in all 12 locales.

## Testing & CI

- Unit tests (Vitest) MUST cover locale negotiation, content schema validation and
  formatting helpers.
- End-to-end tests (Playwright) MUST cover navigation, locale switching and RTL layout.
- CI MUST run, on every pull request: type check, lint, unit tests, e2e tests,
  axe-core a11y checks, Lighthouse budgets, and a translation-completeness report.
- A merge to `main` MUST deploy to production automatically once CI is green.
