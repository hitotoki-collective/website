import { error } from '@sveltejs/kit';
import { getPerformance, renderText } from '#lib/server/archive/index.js';
import type { PageServerLoad } from './$types';

// No `entries` export on purpose: SvelteKit would visit the unprefixed
// /performances/PRF-01 and prerender it. The crawler reaches every localized
// page from the performances list instead.

export const load: PageServerLoad = async ({ params }) => {
	const p = getPerformance(params.code);
	if (!p) error(404);
	const texts = await Promise.all(
		p.texts.map(async (t) => ({ id: t.id, html: await renderText(t) }))
	);
	return {
		code: p.code,
		number: p.number,
		date: p.date,
		time: p.time,
		country: p.country,
		location: p.location,
		host: p.host,
		space: p.space,
		participants: p.participants,
		crewVerified: p.crewVerified,
		incomplete: p.incomplete,
		links: p.links,
		stills: p.stills,
		texts
	};
};
