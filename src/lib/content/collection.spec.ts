import { describe, expect, it } from 'vitest';
import {
	ContentError,
	buildIndex,
	missingTranslations,
	parseContentPath,
	resolveEntry
} from './collection.js';
import { parseFrontMatter } from './report-plugin.js';

const LOCALES = ['en', 'ja', 'ar'];

const about = (locale: string, title = 'About') => ({
	path: `src/content/pages/about.${locale}.md`,
	data: { title }
});

describe('parseContentPath', () => {
	it('reads type, slug and locale, including a script subtag', () => {
		expect(parseContentPath('src/content/pages/about.zh-Hans.md')).toEqual({
			type: 'pages',
			slug: 'about',
			locale: 'zh-Hans'
		});
		expect(parseContentPath('/src/content/journal/first-post.en.md')).toEqual({
			type: 'journal',
			slug: 'first-post',
			locale: 'en'
		});
	});

	it('ignores the archive and files without a locale suffix', () => {
		expect(parseContentPath('src/content/archive/PRESS.md')).toBeNull();
		expect(parseContentPath('src/content/pages/about.md')).toBeNull();
		expect(parseContentPath('src/content/unknown/x.en.md')).toBeNull();
	});
});

describe('buildIndex', () => {
	it('fails on invalid front matter and names the file', () => {
		expect(() => buildIndex([{ path: about('en').path, data: {} }], LOCALES, 'en')).toThrow(
			ContentError
		);
		expect(() =>
			buildIndex(
				[
					{
						path: 'src/content/journal/p.en.md',
						data: { title: 'P', date: 'yesterday', summary: 's' }
					}
				],
				LOCALES,
				'en'
			)
		).toThrow(/journal\/p\.en\.md: date/);
	});

	it('fails when an item has no source-locale file', () => {
		expect(() => buildIndex([about('ja')], LOCALES, 'en')).toThrow(/about\.en\.md: missing/);
	});

	it('fails on a locale outside the configured set', () => {
		expect(() => buildIndex([about('en'), about('xx')], LOCALES, 'en')).toThrow(/locale "xx"/);
	});
});

describe('resolveEntry', () => {
	const index = buildIndex([about('en', 'About'), about('ja', '概要')], LOCALES, 'en');

	it('returns the locale version when it exists', () => {
		const r = resolveEntry(index, 'pages', 'about', 'ja', 'en');
		expect(r?.entry.data.title).toBe('概要');
		expect(r?.fallback).toBe(false);
	});

	it('falls back to the source locale and says so', () => {
		const r = resolveEntry(index, 'pages', 'about', 'ar', 'en');
		expect(r?.entry.locale).toBe('en');
		expect(r?.fallback).toBe(true);
	});

	it('returns undefined for an unknown slug', () => {
		expect(resolveEntry(index, 'pages', 'nope', 'en', 'en')).toBeUndefined();
	});

	it('reports exactly the missing (item, locale) pairs', () => {
		expect(missingTranslations(index, LOCALES)).toEqual([
			{ type: 'pages', slug: 'about', locale: 'ar' }
		]);
	});
});

describe('parseFrontMatter', () => {
	it('splits YAML front matter from the body', () => {
		const { data, body } = parseFrontMatter('---\ntitle: T\ndate: 2025-05-16\n---\n\n# Hi\n');
		expect(data).toEqual({ title: 'T', date: '2025-05-16' });
		expect(body).toBe('\n# Hi\n');
	});

	it('treats a file without front matter as empty data', () => {
		expect(parseFrontMatter('# Hi\n')).toEqual({ data: {}, body: '# Hi\n' });
	});
});
