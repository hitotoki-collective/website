import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { Plugin } from 'vite';
import { buildIndex, missingTranslations } from './collection.js';

// Vite plugin, used from vite.config.ts. At build start it reads every
// site-authored content file, validates its front matter (an invalid file
// fails the build) and warns once per missing translation, as
// docs/technical/requirements.md requires: a fallback must be reported, never
// rendered silently as a key.

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

export function parseFrontMatter(raw: string): { data: unknown; body: string } {
	const m = FRONT_MATTER.exec(raw);
	if (!m) return { data: {}, body: raw };
	return { data: parseYaml(m[1]) ?? {}, body: raw.slice(m[0].length) };
}

async function contentFiles(root: string): Promise<string[]> {
	const base = path.join(root, 'src', 'content');
	const out: string[] = [];
	for (const type of await readdir(base, { withFileTypes: true })) {
		// the archive submodule is upstream content with its own layout
		if (!type.isDirectory() || type.name === 'archive') continue;
		for (const file of await readdir(path.join(base, type.name))) {
			if (file.endsWith('.md')) out.push(path.join('src', 'content', type.name, file));
		}
	}
	return out;
}

export function contentReport(options: { locales: readonly string[]; baseLocale: string }): Plugin {
	// Vite runs buildStart once per environment (client, server); validate in
	// each, warn only once per process.
	let warned = false;
	return {
		name: 'hitotoki:content-report',
		async buildStart() {
			const root = process.cwd();
			const files = await Promise.all(
				(await contentFiles(root)).map(async (p) => ({
					path: p,
					data: parseFrontMatter(await readFile(path.join(root, p), 'utf8')).data
				}))
			);
			// throws ContentError on invalid front matter, which fails the build
			const index = buildIndex(files, options.locales, options.baseLocale);
			if (warned) return;
			warned = true;
			const missing = missingTranslations(index, options.locales);
			for (const m of missing) {
				this.warn(
					`missing translation: ${m.type}/${m.slug} has no "${m.locale}" file; "${options.baseLocale}" will be served`
				);
			}
			if (missing.length > 0) {
				this.warn(`${missing.length} missing translation(s) in site content`);
			}
		}
	};
}
