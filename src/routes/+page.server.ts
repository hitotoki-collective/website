import { listPerformances } from '#lib/server/archive/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	performances: listPerformances().map((p) => ({
		code: p.code,
		number: p.number,
		date: p.date,
		host: p.host.name,
		location: p.location,
		country: p.country,
		stills: p.stills.length
	}))
});
