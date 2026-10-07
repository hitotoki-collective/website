import type { Component } from 'svelte';
import { baseLocale, locales } from '#lib/paraglide/runtime.js';
import {
	buildIndex,
	listSlugs,
	resolveEntry,
	type Entry,
	type Resolved
} from '#lib/content/collection.js';
import type { CollectionName } from '#lib/content/schemas.js';

// Runtime loader for site-authored content. MDsveX compiles each .md into a
// Svelte component and exposes its front matter as `metadata`; the index
// validates that metadata and resolves the locale fallback.

type MarkdownModule = { default: Component; metadata?: unknown };

const modules = import.meta.glob(['/src/content/*/*.md', '!/src/content/archive/**'], {
	eager: true
}) as Record<string, MarkdownModule>;

const index = buildIndex(
	Object.entries(modules).map(([path, mod]) => ({ path: path.slice(1), data: mod.metadata })),
	locales,
	baseLocale
);

export type Loaded<T extends CollectionName> = Resolved<T> & { component: Component };

export function loadEntry<T extends CollectionName>(
	type: T,
	slug: string,
	locale: string
): Loaded<T> | undefined {
	const resolved = resolveEntry(index, type, slug, locale, baseLocale);
	if (!resolved) return undefined;
	return { ...resolved, component: modules['/' + resolved.entry.path].default };
}

export function listEntries<T extends CollectionName>(type: T, locale: string): Loaded<T>[] {
	return listSlugs(index, type).flatMap((slug) => {
		const loaded = loadEntry(type, slug, locale);
		return loaded ? [loaded] : [];
	});
}

export type { Entry };
