import { error } from '@sveltejs/kit';
import { getPerformance, listPerformances, renderText } from '#lib/server/archive/index.js';
import { curatedStills } from '#lib/server/archive/stills.js';
import type { PageServerLoad } from './$types';

// No `entries` export on purpose: SvelteKit would visit the unprefixed
// /performances/PRF-01 and prerender it. The crawler reaches every localized
// page from the performances list instead.

export const load: PageServerLoad = async ({ params }) => {
	const p = getPerformance(params.code);
	if (!p) error(404);
	const [texts, stills] = await Promise.all([
		Promise.all(p.texts.map(async (t) => ({ id: t.id, html: await renderText(t) }))),
		curatedStills(p)
	]);
	// Leaves are ordered newest first; "previous" is the older page.
	const all = listPerformances();
	const at = all.findIndex((x) => x.code === p.code);
	const neighbour = (x: (typeof all)[number] | undefined) =>
		x ? { code: x.code, number: x.number, host: x.host.name } : null;
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
		stillCount: p.stills.length,
		stills: stills.map((s) => ({ id: s.id, picture: s.picture })),
		texts,
		older: neighbour(all[at + 1]),
		newer: neighbour(all[at - 1])
	};
};
