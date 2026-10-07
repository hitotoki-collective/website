import { baseLocale } from '#lib/paraglide/runtime.js';
import { localizedUrls, sitePages, xml } from '#lib/server/pages.js';
import type { RequestHandler } from './$types';

export const prerender = true;

// One <url> per locale per page, each carrying xhtml:link alternates for every
// locale plus x-default, as the requirements ask.
export const GET: RequestHandler = () => {
	const entries = sitePages().flatMap((page) => {
		const urls = localizedUrls(page.path);
		const links = [
			...urls.map(
				(u) => `<xhtml:link rel="alternate" hreflang="${u.locale}" href="${xml(u.url)}"/>`
			),
			`<xhtml:link rel="alternate" hreflang="x-default" href="${xml(urls.find((u) => u.locale === baseLocale)!.url)}"/>`
		].join('');
		return urls.map(
			(u) =>
				`<url><loc>${xml(u.url)}</loc>${links}<changefreq>${page.changefreq}</changefreq><priority>${page.priority}</priority></url>`
		);
	});
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
	return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
