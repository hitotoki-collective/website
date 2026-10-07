import type { Component } from 'svelte';
import { renderToHtml } from '../render.js';
import { ManifestError, parseManifest } from './manifest.js';
import type { PerformanceManifest } from './schema.js';

// Build-time view of the content archive submodule. Everything here is read
// from src/content/archive at build/dev time through import.meta.glob; nothing
// from this module reaches the client bundle (it lives under src/lib/server).
//
// Video is deliberately absent: the checkout excludes .mp4 files and playback
// resolves through the media manifest (docs/technical/archive-media-schema.md).

const ARCHIVE = '/src/content/archive/performances/';

const manifests = import.meta.glob('/src/content/archive/performances/*/*-MANIFEST.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

// Keys only: listing the stills must not pull 250 MB of JPEG into the build.
const stillFiles = Object.keys(
	import.meta.glob('/src/content/archive/performances/*/*-IMG-*.jpeg', { query: '?url' })
);

// Lazy: only the titled written texts are ever imported (as MDsveX components);
// manifests, transcripts and quote extracts are never compiled as Svelte.
const textModules = import.meta.glob('/src/content/archive/performances/*/*.md') as Record<
	string,
	() => Promise<{ default: Component }>
>;
const textFiles = Object.keys(textModules);

export type Still = {
	/** `PRF-01-IMG-03` */
	id: string;
	/** Path relative to the repository root. */
	path: string;
};

export type WrittenText = {
	/** `PRF-01-FORTY-MINUTES-ABOVE-THE-POND` */
	id: string;
	path: string;
};

export type Performance = PerformanceManifest & {
	/** Directory name, always equal to `code`. */
	dir: string;
	stills: Still[];
	/** Original prose the archive wrote in response to the performance. */
	texts: WrittenText[];
	/** Speaker names with a `QTE` extract. Machine transcripts, never verbatim. */
	speakers: string[];
};

function dirOf(path: string): string {
	return path.slice(ARCHIVE.length).split('/')[0];
}

function stem(path: string): string {
	return path.slice(path.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
}

function build(): Map<string, Performance> {
	const out = new Map<string, Performance>();
	for (const [path, raw] of Object.entries(manifests)) {
		const dir = dirOf(path);
		const file = path.slice(1);
		const manifest = parseManifest(raw, file);
		if (manifest.code !== dir) {
			throw new ManifestError(file, `Code "${manifest.code}" does not match directory "${dir}"`);
		}
		const own = (p: string) => dirOf(p) === dir;
		const prefix = `${dir}-`;
		const kindOf = (p: string) => stem(p).slice(prefix.length);
		out.set(dir, {
			...manifest,
			dir,
			stills: stillFiles
				.filter(own)
				.sort()
				.map((p) => ({ id: stem(p), path: p.slice(1) })),
			texts: textFiles
				.filter(own)
				.filter((p) => !/^(MANIFEST|VID-|TSC-)/.test(kindOf(p)))
				.sort()
				.map((p) => ({ id: stem(p), path: p.slice(1) })),
			speakers: textFiles
				.filter(own)
				.map(kindOf)
				.flatMap((k) => {
					const m = /^VID-\d{2}-QTE-(.+)$/.exec(k);
					return m ? [m[1].replace(/-/g, ' ')] : [];
				})
				.sort()
		});
	}
	return out;
}

const performances = build();

/** All performances, newest first. */
export function listPerformances(): Performance[] {
	return [...performances.values()].sort((a, b) => b.number - a.number);
}

export function getPerformance(code: string): Performance | undefined {
	return performances.get(code);
}

/**
 * Server-rendered HTML of one of a performance's written texts. The text's
 * own `# Title` becomes an `<h2>` (and so on down) so it nests under the
 * page's single `<h1>`.
 */
export async function renderText(text: WrittenText): Promise<string> {
	const load = textModules['/' + text.path];
	if (!load) throw new Error(`no such archive text: ${text.path}`);
	return renderToHtml((await load()).default).replace(
		/<(\/?)h([1-5])\b/g,
		(_, slash: string, level: string) => `<${slash}h${Number(level) + 1}`
	);
}
