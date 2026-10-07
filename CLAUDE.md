# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## State of the repo

Pre-implementation. There is no application code, `package.json`, build, lint or test setup yet — only specs, a checkout script and the content submodule. Do not invent commands; when scaffolding, follow the resolved stack in `docs/technical/requirements.md` (SvelteKit 2 / Svelte 5 runes, TypeScript strict, pnpm, Node >= 22 via `.nvmrc`, `@sveltejs/adapter-cloudflare`, Paraglide JS, MDsveX, Zod, Vitest, Playwright + axe-core, ESLint + Prettier, plain CSS with custom properties — no utility-class framework). Update this file with real commands once they exist.

The Svelte MCP server is configured in `.mcp.json`; use it for Svelte/SvelteKit documentation and to autofix components.

## Specs are the source of truth

- `docs/technical/requirements.md` — normative (MUST/MUST NOT) requirements: 12 locales including RTL Arabic, locale-prefixed URLs (`/<locale>/<path>`, no unprefixed variant), CSS logical properties only, JS-free legibility of core routes, WCAG 2.2 AA, CSP without `unsafe-inline`/`unsafe-eval` in `script-src`, performance budgets (< 100 KB JS per route, < 150 KB fonts per locale, per-script font subsetting), SEO/JSON-LD, `/llms.txt`, AI crawler policy. Some sections say a change requires updating the document first (AI crawler policy, consent banner) — respect that.
- `docs/technical/archive-media-schema.md` — **draft** proposal for a `PRF-<NN>-media.yaml` sidecar (with Zod schema) mapping video assets to Cloudflare Stream / R2. It must be agreed and merged in the archive repo before the site depends on it.
- `docs/conceptual/index.md` — what the collective is; useful for copy and tone.

## Content architecture

- Site-authored content goes under `src/content/<type>/`, one Markdown file per locale: `<slug>.<locale>.md`. `en` is the source and authoritative; missing translations fall back to `en` with a build warning. Front matter is Zod-validated and invalid front matter fails the build.
- UI strings: `messages/<locale>.json` (Inlang/Paraglide).
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
