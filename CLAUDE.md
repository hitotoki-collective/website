# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## State of the repo

Freshly scaffolded, no product UI yet. Stack as resolved in `docs/technical/requirements.md`: SvelteKit 3 (Svelte 5, runes forced on for project code), TypeScript strict, pnpm, Node >= 22 (`.nvmrc` pins 24), `@sveltejs/adapter-cloudflare` targeting Pages, Paraglide JS 2, MDsveX (`.svx` and `.md` are components), Vitest, Playwright, ESLint + Prettier, plain CSS with custom properties — no utility-class framework. Zod, axe-core, Lighthouse CI and the content loader are not wired yet.

There is no `svelte.config.js`: SvelteKit 3 is configured inside `sveltekit({...})` in `vite.config.ts`, alongside the Paraglide plugin and the Vitest projects.

The Svelte MCP server is configured in `.mcp.json`; use it for Svelte/SvelteKit documentation and to autofix components.

## Commands

```bash
pnpm install              # first run also needs: pnpm run gen (wrangler types)
pnpm run dev
pnpm run build            # wrangler types --check && vite build
pnpm run preview          # wrangler pages dev on :4173
pnpm run check            # svelte-check, strict
pnpm run lint             # prettier --check && eslint
pnpm run format
pnpm run test:unit        # vitest (watch); `pnpm vitest run` for one pass
pnpm vitest run --project server            # node-only tests, fast
pnpm vitest run src/lib/server/archive/manifest.spec.ts  # single file
pnpm run test:e2e         # playwright; builds and serves the preview itself
pnpm exec playwright install chromium        # once per machine
```

Vitest has two projects: `server` (node, `*.spec.ts`) and `client` (browser via Playwright, `*.svelte.spec.ts`). The client project currently has no tests and makes a full `vitest run` take ~10 s to exit; prefer `--project server` while that holds.

## Scaffold decisions worth knowing

- **Locale in every URL, `en` included.** `vite.config.ts` gives Paraglide explicit `urlPatterns` so there is no unprefixed variant; `/` redirects via `url → cookie → preferredLanguage → baseLocale`. `src/hooks.ts` de-localises for routing, `src/hooks.server.ts` sets `lang`/`dir` on `<html>`. The e2e tests in `src/routes/page.svelte.e2e.ts` pin this behaviour.
- **Locale tags are BCP 47 as written in the requirements**, including `zh-Hans` (the `sv` scaffold lowercased it; `project.inlang/settings.json` and `messages/zh-Hans.json` were corrected). `src/lib/i18n/locales.spec.ts` guards the set.
- **`src/lib/paraglide/` is generated** by the Vite plugin and gitignored; `tsconfig.json` excludes it from `svelte-check` because its Cloudflare `Request` types clash. Run a build or dev once before `check` on a fresh clone.
- **`cookie` is publicly hoisted** in `pnpm-workspace.yaml`: SvelteKit externalises it from the server output and Node otherwise resolves whatever `cookie` sits above the project.
- Prettier and ESLint ignore the archive submodule, `docs/`, `.claude/`, `.impeccable/`, root Markdown and `.mcp.json`; those are hand-formatted or upstream-owned.

## Specs are the source of truth

- `docs/technical/requirements.md` — normative (MUST/MUST NOT) requirements: 12 locales including RTL Arabic, locale-prefixed URLs (`/<locale>/<path>`, no unprefixed variant), CSS logical properties only, JS-free legibility of core routes, WCAG 2.2 AA, CSP without `unsafe-inline`/`unsafe-eval` in `script-src`, performance budgets (< 100 KB JS per route, < 150 KB fonts per locale, per-script font subsetting), SEO/JSON-LD, `/llms.txt`, AI crawler policy. Some sections say a change requires updating the document first (AI crawler policy, consent banner) — respect that.
- `docs/technical/archive-media-schema.md` — **draft** proposal for a `PRF-<NN>-media.yaml` sidecar (with Zod schema) mapping video assets to Cloudflare Stream / R2. It must be agreed and merged in the archive repo before the site depends on it.
- `docs/conceptual/index.md` — what the collective is; useful for copy and tone.

## Content architecture

- Site-authored content goes under `src/content/<type>/`, one Markdown file per locale: `<slug>.<locale>.md`. `en` is the source and authoritative; missing translations fall back to `en` with a build warning. Front matter is Zod-validated and invalid front matter fails the build.
- UI strings: `messages/<locale>.json` (Inlang/Paraglide).

### How content loading is wired

- `src/lib/content/schemas.ts` — one Zod schema per collection (`pages`, `journal`). Adding a content type means adding a schema here and a `src/content/<type>/` folder; nothing else needs registering.
- `src/lib/content/collection.ts` — pure indexing: path parsing, validation, `en` fallback, missing-translation report. No Vite, no fs; both consumers below share it.
- `src/lib/content/report-plugin.ts` — Vite plugin registered first in `vite.config.ts`. At `buildStart` it reads the content folders with fs, throws `ContentError` on invalid front matter (fails the build) and warns once per missing translation.
- `src/lib/server/content/index.ts` — runtime loader. `import.meta.glob` over `src/content/*/*.md` (archive excluded); MDsveX supplies each file as a component plus `metadata`. `loadEntry(type, slug, locale)` returns `{ entry, fallback, component }`.
- `src/lib/server/archive/` — the archive submodule's view. `manifest.ts` parses `PRF-<NN>-MANIFEST.md` by heading, list and table into the Zod shape in `schema.ts`; `TODO` placeholders are dropped and the section is named in `incomplete`; `crewVerified` is false while the manifest still says the crew list is unverified OCR. `index.ts` globs manifests (raw), still filenames (keys only — never import the JPEGs) and texts, and exposes `listPerformances()` / `getPerformance(code)`. Its tests run against the real PRF-01 and PRF-02 files.
- Everything under `src/lib/server/` is server-only; keep content loading there so the archive never reaches the client bundle.

### Routes

- Routes live **unprefixed** in `src/routes/` (`/`, `/about`, `/performances`, `/performances/[code=code]`, `/journal`); `src/hooks.ts` strips the locale prefix before matching and `src/hooks.server.ts` resolves the locale. Read it with `getLocale()` inside `load`.
- Every internal link goes through `href()` from `src/lib/i18n/href.ts` (`localizeHref` over `resolve()`); a bare `resolve()` href leaks an unprefixed URL, which the crawler would then prerender. The e2e suite asserts every link on the page is prefixed and that unprefixed URLs redirect.
- The whole tree is prerendered (`src/routes/+layout.server.ts`); `vite.config.ts` seeds one entry per locale and the crawler follows the layout's language links. Don't export `entries` from dynamic routes — SvelteKit would visit the unprefixed path.
- Param matchers are SvelteKit 3 style: a single `src/params.ts` exporting `defineParams({...})` with Standard Schema (Zod) validators. Node loads that file directly, so it cannot use `#lib` imports.
- Markdown content (site pages, archive texts) is rendered to HTML on the server (`src/lib/server/render.ts`) and passed as a string; pages use `{@html}`. No Markdown component reaches the client.
- `src/content/archive` is a git submodule of `hitotoki-collective/archive` (shallow, tracks `main`). It is **read-only** from this repo — changes go upstream. It has its own `CLAUDE.md` describing its layout: flat `performances/PRF-<NN>/` folders, every file prefixed with the folder name, kind codes (`IMG`, `VID`, `SEG`, `MON`, `SUB`, `QTE`, `TSC`), and a fixed-section `PRF-<NN>-MANIFEST.md`. Read it before writing code that parses the archive.

## Archive checkout (important)

The archive holds ~4 GB of video in Git LFS. Never run a plain `git submodule update --init` on it. Use:

```bash
scripts/checkout-content.sh
```

It sets `GIT_LFS_SKIP_SMUDGE=1`, sparse-checks out everything except `performances/*/*.mp4` and `tmp/`, then pulls only the `.jpeg` LFS objects (~250 MB result). CI and Cloudflare Pages must set `GIT_LFS_SKIP_SMUDGE=1` and run this script as the first build step.

The build must never read `.mp4` files from the submodule; video is served from Cloudflare Stream / R2 and resolved via the media manifest. Needing a real video file at build time means the checkout policy is broken.

## Archive content rules that carry over to the site

- Participants are real people: never invent, guess or complete names or personal details.
- Captions, `QTE` extracts and speaker attribution are unproofed machine output — don't present them as verbatim quotes. Written texts (titled `.md` files) paraphrase and must not be cited as anyone's words.
- Honour each manifest's `## Provenance` for credits (archive is CC BY-NC-SA 4.0).

## Design tooling

`.claude/` holds the Impeccable design skill and agents; its hooks run checks after Edit/Write on UI files and a deeper pass on Stop. The visual language belongs in a separate design document (not yet written).
