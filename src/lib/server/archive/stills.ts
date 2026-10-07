import type { Picture } from '@sveltejs/enhanced-img';
import type { Performance, Still } from './index.js';

// Curated stills, transformed at build time by @sveltejs/enhanced-img into
// AVIF/WebP sets. Curation is mechanical for now (see the surface brief):
// IMG-00, the photographer's frame, leads, followed by the next five. The glob
// is deliberately narrow so only those files are processed; widening the
// curation means widening this pattern.

const pictures = import.meta.glob('/src/content/archive/performances/*/*-IMG-0[0-5].jpeg', {
	query: { enhanced: true, w: '2400;1600;1200;800;480' },
	import: 'default'
}) as Record<string, () => Promise<Picture>>;

export type CuratedStill = Still & { picture: Picture };

export async function curatedStills(p: Performance): Promise<CuratedStill[]> {
	const out: CuratedStill[] = [];
	for (const still of p.stills) {
		const load = pictures['/' + still.path];
		if (!load) continue;
		out.push({ ...still, picture: await load() });
	}
	return out;
}

export async function leadStill(p: Performance): Promise<CuratedStill | undefined> {
	return (await curatedStills(p))[0];
}
