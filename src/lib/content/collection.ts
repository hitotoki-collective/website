import { collections, isCollectionName, type CollectionName, type Frontmatter } from './schemas.js';

// Pure indexing of site-authored content. Shared by the runtime loader
// (src/lib/server/content) and the build-time report plugin, so both agree on
// what a path means, what is valid, and what falls back to the source locale.
//
// Layout: src/content/<type>/<slug>.<locale>.md — `en` is authoritative.

export type ContentPath = { type: CollectionName; slug: string; locale: string };

const PATH = /(?:^|\/)src\/content\/([^/]+)\/([^/.]+)\.([A-Za-z]{2,3}(?:-[A-Za-z]{4})?)\.md$/;

/** `null` for files that are not site-authored content (the archive, stray files). */
export function parseContentPath(path: string): ContentPath | null {
	const m = PATH.exec(path);
	if (!m || !isCollectionName(m[1])) return null;
	return { type: m[1], slug: m[2], locale: m[3] };
}

export type Entry<T extends CollectionName = CollectionName> = ContentPath & {
	type: T;
	path: string;
	data: Frontmatter<T>;
};

export class ContentError extends Error {
	constructor(
		public readonly path: string,
		message: string
	) {
		super(`${path}: ${message}`);
		this.name = 'ContentError';
	}
}

export type Index = Map<CollectionName, Map<string, Map<string, Entry>>>;

/**
 * Validate every entry against its collection schema and index by
 * type → slug → locale. Throws ContentError on the first invalid file.
 */
export function buildIndex(
	files: { path: string; data: unknown }[],
	locales: readonly string[],
	baseLocale: string
): Index {
	const index: Index = new Map();
	for (const { path, data } of files) {
		const at = parseContentPath(path);
		if (!at) continue;
		if (!locales.includes(at.locale)) {
			throw new ContentError(path, `locale "${at.locale}" is not one of ${locales.join(', ')}`);
		}
		const result = collections[at.type].safeParse(data);
		if (!result.success) {
			const issues = result.error.issues
				.map((i) => `${i.path.join('.') || '(front matter)'}: ${i.message}`)
				.join('; ');
			throw new ContentError(path, issues);
		}
		const bySlug = index.get(at.type) ?? new Map();
		const byLocale = bySlug.get(at.slug) ?? new Map();
		byLocale.set(at.locale, { ...at, path, data: result.data });
		bySlug.set(at.slug, byLocale);
		index.set(at.type, bySlug);
	}
	for (const [type, bySlug] of index) {
		for (const [slug, byLocale] of bySlug) {
			if (!byLocale.has(baseLocale)) {
				throw new ContentError(
					`src/content/${type}/${slug}.${baseLocale}.md`,
					`missing: "${baseLocale}" is the source locale and every item must have it`
				);
			}
		}
	}
	return index;
}

export type Resolved<T extends CollectionName> = {
	entry: Entry<T>;
	/** True when `entry` is the source-locale version standing in for a missing translation. */
	fallback: boolean;
};

export function resolveEntry<T extends CollectionName>(
	index: Index,
	type: T,
	slug: string,
	locale: string,
	baseLocale: string
): Resolved<T> | undefined {
	const byLocale = index.get(type)?.get(slug);
	if (!byLocale) return undefined;
	const own = byLocale.get(locale);
	if (own) return { entry: own as Entry<T>, fallback: false };
	const base = byLocale.get(baseLocale);
	return base ? { entry: base as Entry<T>, fallback: true } : undefined;
}

export function listSlugs(index: Index, type: CollectionName): string[] {
	return [...(index.get(type)?.keys() ?? [])].sort();
}

export type MissingTranslation = { type: CollectionName; slug: string; locale: string };

/** Every (item, locale) pair that will render from the source locale. */
export function missingTranslations(
	index: Index,
	locales: readonly string[]
): MissingTranslation[] {
	const out: MissingTranslation[] = [];
	for (const [type, bySlug] of index) {
		for (const [slug, byLocale] of bySlug) {
			for (const locale of locales) {
				if (!byLocale.has(locale)) out.push({ type, slug, locale });
			}
		}
	}
	return out;
}
