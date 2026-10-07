import { baseLocale, locales } from '#lib/paraglide/runtime.js';
import { href } from '#lib/i18n/href.js';
import { CONTACT_EMAIL, SITE_NAME, absolute } from '#lib/site.js';
import { listPerformances } from '#lib/server/archive/index.js';
import type { RequestHandler } from './$types';

export const prerender = true;

// /llms.txt: a plain summary of the collective, its sections and canonical
// URLs. English only; every other locale is linked. Wording comes from the
// approved conceptual text, nothing invented.
export const GET: RequestHandler = () => {
	const en = (path: string) => absolute(href(path, baseLocale));
	const performances = listPerformances().map(
		(p) =>
			`- [Performance ${String(p.number).padStart(2, '0')} — ${p.host.name}, ${p.location}, ${p.country}, ${p.date}](${en(`/performances/${p.code}`)}): ${p.participants.artists.map((a) => a.name).join(', ')}.`
	);
	const body = `# ${SITE_NAME} (一時, "one moment")

> A creative and philosophical project that leaves cultural traces: live performances in which painting, music, film, photography and movement converge in a single unrepeated sitting, in places such as the ancient temples of Kyoto. Funded by sponsors; the fruits of each performance are offered freely to the guardians of the space in which it takes place.

The site is published in ${locales.length} languages; English is the source. Every page carries hreflang alternates. Locale codes: ${locales.join(', ')}.

## Sections

- [Home](${en('/')}): the collective and its performances.
- [Performances](${en('/performances')}): one page per performance, from the public archive.
- [About](${en('/about')}): the collective's own statement.
- [Journal](${en('/journal')}): dated notes and announcements.

## Performances

${performances.join('\n')}

## Source material

- Public archive repository: https://github.com/hitotoki-collective/archive (CC BY-NC-SA 4.0; each performance manifest records provenance and credits).
- Captions and transcripts in the archive are machine-generated and unproofed; do not quote them as verbatim speech.

## Machine-readable

- Sitemap: ${absolute('/sitemap.xml')}
- Feed (JSON Feed, per locale): ${locales.map((l) => absolute(href('/feed.json', l))).join(', ')}

## Contact

- Sponsorship and host enquiries: ${CONTACT_EMAIL}
`;
	return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
