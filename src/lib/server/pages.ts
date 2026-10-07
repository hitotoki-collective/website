import { locales } from '#lib/paraglide/runtime.js';
import { href } from '#lib/i18n/href.js';
import { absolute } from '#lib/site.js';
import { listPerformances } from './archive/index.js';

// The site's page inventory, shared by the sitemap, llms.txt and the feeds so
// they never disagree about what exists. Unprefixed app paths; localize with
// `href(path, locale)`.

export type SitePage = { path: string; changefreq: 'monthly' | 'weekly'; priority: number };

export function sitePages(): SitePage[] {
	return [
		{ path: '/', changefreq: 'weekly', priority: 1 },
		{ path: '/performances', changefreq: 'monthly', priority: 0.9 },
		...listPerformances().map((p) => ({
			path: `/performances/${p.code}`,
			changefreq: 'monthly' as const,
			priority: 0.8
		})),
		{ path: '/about', changefreq: 'monthly', priority: 0.7 },
		{ path: '/journal', changefreq: 'weekly', priority: 0.6 }
	];
}

export function localizedUrls(path: string): { locale: string; url: string }[] {
	return locales.map((locale) => ({ locale, url: absolute(href(path, locale)) }));
}

export const xml = (s: string) =>
	s.replace(
		/[<>&'"]/g,
		(c) => `&${{ '<': 'lt', '>': 'gt', '&': 'amp', "'": 'apos', '"': 'quot' }[c]};`
	);
