import { performanceManifest, type PerformanceManifest } from './schema.js';

// Parses a PRF-<NN>-MANIFEST.md. The format is fixed-order Markdown prose
// (src/content/archive/CLAUDE.md, "Manifest schema"); this reads it
// structurally, by heading, list and table, and never by line position.

const TODO = /^TODO\b/;

type Sections = Map<string, string>;

/** Split a Markdown document into `## Heading` → body. */
function sections(markdown: string, level: 2 | 3): Sections {
	const marker = '#'.repeat(level) + ' ';
	const out: Sections = new Map();
	let current: string | null = null;
	let buffer: string[] = [];
	for (const line of markdown.split('\n')) {
		if (line.startsWith(marker)) {
			if (current !== null) out.set(current, buffer.join('\n').trim());
			current = line.slice(marker.length).trim();
			buffer = [];
		} else if (current !== null) {
			// a deeper heading belongs to the current section's body
			buffer.push(line);
		}
	}
	if (current !== null) out.set(current, buffer.join('\n').trim());
	return out;
}

/** `Key: Value` lines → record, first occurrence wins. */
function fields(body: string): Record<string, string> {
	const out: Record<string, string> = {};
	for (const line of body.split('\n')) {
		const m = /^([A-Za-z][A-Za-z ]*?):\s*(.+)$/.exec(line.trim());
		if (m && !(m[1] in out)) out[m[1]] = m[2].trim();
	}
	return out;
}

type ListItem = { text: string; children: ListItem[] };

/** A Markdown bullet list → tree, two spaces per nesting level. */
function list(body: string): ListItem[] {
	const root: ListItem[] = [];
	const stack: { depth: number; items: ListItem[] }[] = [{ depth: -1, items: root }];
	for (const raw of body.split('\n')) {
		const m = /^(\s*)-\s+(.*)$/.exec(raw);
		if (!m) continue;
		const depth = m[1].length;
		const item: ListItem = { text: m[2].trim(), children: [] };
		while (stack[stack.length - 1].depth >= depth) stack.pop();
		stack[stack.length - 1].items.push(item);
		stack.push({ depth, items: item.children });
	}
	return root;
}

/** Rows of the first pipe table in `body`, header and separator dropped. */
function table(body: string): string[][] {
	const rows = body
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l.startsWith('|'))
		.map((l) =>
			l
				.slice(1, l.endsWith('|') ? -1 : undefined)
				.split('|')
				.map((c) => c.trim())
		);
	if (rows.length < 2) return [];
	// A second table in the same section starts with its own header; keep only
	// the first contiguous block.
	const out: string[][] = [];
	for (const row of rows.slice(2)) {
		if (row.every((c) => /^-+$/.test(c))) break;
		out.push(row);
	}
	return out;
}

function childFields(item: ListItem): Record<string, string> {
	return fields(item.children.map((c) => c.text).join('\n'));
}

/** Names from a flat list, dropping TODO placeholders. */
function people(body: string): { names: string[]; incomplete: boolean } {
	let incomplete = TODO.test(body.trim());
	const names: string[] = [];
	for (const item of list(body)) {
		if (TODO.test(item.text)) incomplete = true;
		else names.push(item.text);
	}
	return { names, incomplete };
}

function seconds(cell: string): number | null {
	const m = /^(\d+(?:\.\d+)?)s$/.exec(cell.trim());
	return m ? Number(m[1]) : null;
}

export class ManifestError extends Error {
	constructor(
		public readonly file: string,
		message: string
	) {
		super(`${file}: ${message}`);
		this.name = 'ManifestError';
	}
}

/**
 * Parse one manifest. `file` is used only for error messages. Throws
 * ManifestError when the document does not satisfy the schema, so a build
 * that imports it fails rather than rendering a half-read performance.
 */
export function parseManifest(markdown: string, file = 'manifest'): PerformanceManifest {
	const title = /^#\s+(.+)$/m.exec(markdown)?.[1]?.trim();
	const top = sections(markdown, 2);
	const need = (h: string) => {
		const body = top.get(h);
		if (body === undefined) throw new ManifestError(file, `missing "## ${h}"`);
		return body;
	};

	const overview = fields(need('Overview'));

	const hostBody = need('Host');
	const hostName = hostBody
		.split('\n')
		.find((l) => l.trim() && !l.trim().startsWith('-'))
		?.trim();
	const hostLinks: Record<string, string> = {};
	for (const item of list(hostBody)) {
		const key = item.text.replace(/:$/, '').toLowerCase();
		const url = item.children[0]?.text;
		if (!url) continue;
		if (key === 'google maps') hostLinks.googleMaps = url;
		else if (key === 'website') hostLinks.website = url;
		else if (key === 'wikipedia') hostLinks.wikipedia = url;
	}

	const participants = sections(need('Participants'), 3);
	const part = (h: string) => participants.get(h) ?? '';

	const artists = list(part('Artists')).map((item) => {
		const f = childFields(item);
		return { name: item.text, type: f.Type, instrument: f.Instrument };
	});
	const crewBody = part('Crew');
	const crew = list(crewBody).map((item) => ({ name: item.text, role: childFields(item).Role }));
	const execs = people(part('Executive Producers'));
	const assistants = people(part('Assistants'));
	const guests = people(part('Guests'));

	const incomplete: string[] = [];
	if (TODO.test(part('Artists').trim())) incomplete.push('artists');
	if (TODO.test(crewBody.trim())) incomplete.push('crew');
	if (execs.incomplete) incomplete.push('executiveProducers');
	if (assistants.incomplete) incomplete.push('assistants');
	if (guests.incomplete) incomplete.push('guests');

	const links: Record<string, string> = {};
	for (const item of list(top.get('Links') ?? '')) {
		const m = /^(Film|Stills):\s*(\S+)$/.exec(item.text);
		if (m) links[m[1].toLowerCase()] = m[2];
	}

	const derivatives = sections(top.get('Derivatives') ?? '', 3);
	const segments = table(derivatives.get('Segments') ?? '')
		.filter((r) => /^SEG-\d{2}$/.test(r[0] ?? ''))
		.map((r) => ({ id: r[0], startSeconds: seconds(r[1] ?? '') ?? -1, content: r[2] ?? '' }));
	const montages = table(derivatives.get('Montages') ?? '').flatMap((r) => {
		const m = /^(MON-\d{2})(?:\s+(.+))?$/.exec(r[0] ?? '');
		if (!m) return [];
		return [{ id: m[1], title: m[2]?.trim() || undefined, audioFromSeconds: seconds(r[1] ?? '') }];
	});

	const code = overview.Code;
	const number = Number(/^PRF-(\d{2})$/.exec(code ?? '')?.[1]);

	const result = performanceManifest.safeParse({
		code,
		number,
		title,
		date: overview.Date,
		time: overview.Time,
		country: overview.Country,
		location: overview.Location,
		host: { name: hostName?.replace(/\.$/, ''), links: hostLinks },
		space: top.get('Space') || undefined,
		participants: {
			artists,
			crew,
			executiveProducers: execs.names.map((n) => ({ name: n })),
			assistants: assistants.names.map((n) => ({ name: n })),
			guests: guests.names.map((n) => ({ name: n }))
		},
		crewVerified: !/not yet verified/i.test(crewBody),
		incomplete,
		links,
		segments,
		montages
	});

	if (!result.success) {
		const issues = result.error.issues
			.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
			.join('; ');
		throw new ManifestError(file, issues);
	}
	return result.data;
}
