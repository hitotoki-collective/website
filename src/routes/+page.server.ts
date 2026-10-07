import { getLocale } from '#lib/paraglide/runtime.js';
import { listPerformances } from '#lib/server/archive/index.js';
import { leadStill } from '#lib/server/archive/stills.js';
import { loadEntry } from '#lib/server/content/index.js';
import { renderToHtml } from '#lib/server/render.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const leaves = await Promise.all(
		listPerformances().map(async (p) => ({
			code: p.code,
			number: p.number,
			date: p.date,
			time: p.time,
			host: p.host.name,
			location: p.location,
			country: p.country,
			artists: p.participants.artists.map((a) => a.name),
			lead: (await leadStill(p))?.picture ?? null
		}))
	);
	const about = loadEntry('pages', 'about', getLocale());
	return {
		leaves,
		inscription: about ? { html: renderToHtml(about.component), fallback: about.fallback } : null
	};
};
