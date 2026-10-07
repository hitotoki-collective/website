import { getLocale } from '#lib/paraglide/runtime.js';
import * as m from '#lib/paraglide/messages.js';
import { href } from '#lib/i18n/href.js';
import { SITE_NAME, absolute } from '#lib/site.js';
import { listPerformances } from '#lib/server/archive/index.js';
import { leadStill } from '#lib/server/archive/stills.js';
import { listEntries } from '#lib/server/content/index.js';
import type { RequestHandler } from './$types';

export const prerender = true;

// JSON Feed 1.1, one per locale at /<locale>/feed.json: performances and
// journal posts, newest first. Titles and summaries use the locale's UI
// strings; item text is factual (place, date, participants), never quoted
// captions.
export const GET: RequestHandler = async () => {
	const locale = getLocale();
	const list = new Intl.ListFormat(locale, { type: 'conjunction' });
	const performances = await Promise.all(
		listPerformances().map(async (p) => {
			const label = m.performance_label({ number: String(p.number).padStart(2, '0') });
			const lead = await leadStill(p);
			return {
				id: absolute(href(`/performances/${p.code}`)),
				url: absolute(href(`/performances/${p.code}`)),
				title: `${label} · ${p.host.name}`,
				summary: `${p.host.name}, ${p.location}, ${p.country}. ${list.format(p.participants.artists.map((a) => a.name))}.`,
				date_published: `${p.date}T${p.time}:00+09:00`,
				image: lead ? absolute(lead.picture.img.src) : undefined,
				tags: ['performance', p.code]
			};
		})
	);
	const posts = listEntries('journal', locale).map(({ entry }) => ({
		id: absolute(href(`/journal#${entry.slug}`)),
		url: absolute(href(`/journal#${entry.slug}`)),
		title: entry.data.title,
		summary: entry.data.summary,
		date_published: `${entry.data.date}T00:00:00+09:00`,
		tags: ['journal']
	}));
	const items = [...performances, ...posts].sort((a, b) =>
		b.date_published.localeCompare(a.date_published)
	);
	const feed = {
		version: 'https://jsonfeed.org/version/1.1',
		title: SITE_NAME,
		home_page_url: absolute(href('/')),
		feed_url: absolute(href('/feed.json')),
		description: m.cover_line(),
		language: locale,
		icon: absolute('/og.png'),
		authors: [{ name: SITE_NAME, url: absolute(href('/')) }],
		items
	};
	return new Response(JSON.stringify(feed, null, '\t'), {
		headers: { 'content-type': 'application/feed+json; charset=utf-8' }
	});
};
