import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ManifestError, parseManifest } from './manifest.js';

// Parsed against the real manifests in the archive submodule, so a change in
// the upstream format shows up here before it reaches a page.

const read = (code: string) =>
	readFileSync(`src/content/archive/performances/${code}/${code}-MANIFEST.md`, 'utf8');

describe('parseManifest on PRF-01', () => {
	const m = parseManifest(read('PRF-01'), 'PRF-01');

	it('reads the overview', () => {
		expect(m).toMatchObject({
			code: 'PRF-01',
			number: 1,
			title: 'Performance 01',
			date: '2025-05-16',
			time: '12:00',
			country: 'Japan',
			location: 'Kyoto'
		});
	});

	it('reads the host, its links and the space prose', () => {
		expect(m.host.name).toBe('Dai-Kaku-Ji temple');
		expect(m.host.links).toEqual({
			googleMaps: 'https://maps.app.goo.gl/MHLCYoxHEdDvYSGn6',
			website: 'https://www.daikakuji.or.jp',
			wikipedia: 'https://en.wikipedia.org/wiki/Daikaku-ji'
		});
		expect(m.space).toMatch(/royal tea house/);
	});

	it('reads participants with their fields', () => {
		expect(m.participants.artists).toHaveLength(4);
		expect(m.participants.artists[0]).toEqual({
			name: 'Taro Nordberg',
			type: 'Painter',
			instrument: 'Calligraphy Brush'
		});
		expect(m.participants.crew).toContainEqual({
			name: 'Sam King',
			role: 'Director, DP and Editor'
		});
		expect(m.participants.crew).toHaveLength(8);
		expect(m.participants.executiveProducers).toEqual([{ name: 'Mark Greenslade' }]);
		expect(m.participants.guests).toEqual([{ name: 'Nathalie Jaoult' }]);
	});

	it('drops TODO placeholders and flags the section instead', () => {
		expect(m.participants.assistants).toEqual([]);
		expect(m.incomplete).toEqual(['assistants']);
	});

	it('records that the crew list is unverified OCR', () => {
		expect(m.crewVerified).toBe(false);
	});

	it('reads links, segments and montages', () => {
		expect(m.links).toEqual({ film: 'https://f.io/5fGGPSC7', stills: 'https://f.io/ZcR0fc9O' });
		expect(m.segments).toHaveLength(4);
		expect(m.segments[0]).toEqual({
			id: 'SEG-01',
			startSeconds: 5.8,
			content: 'Cold open, flute, title card, temple'
		});
		expect(m.montages.map((x) => x.id)).toEqual(['MON-01', 'MON-02', 'MON-03', 'MON-04']);
		expect(m.montages[0]).toEqual({ id: 'MON-01', title: 'The place', audioFromSeconds: 43.6 });
	});
});

describe('parseManifest on PRF-02', () => {
	const m = parseManifest(read('PRF-02'), 'PRF-02');

	it('tolerates a manifest with no Space section', () => {
		expect(m.space).toBeUndefined();
		expect(m.host.name).toBe('Jingo-Ji temple');
	});

	it('keeps the priest among the artists', () => {
		expect(m.participants.artists).toHaveLength(5);
		expect(m.participants.artists[4]).toEqual({
			name: 'Kosho Taniuchi',
			type: 'Priest',
			instrument: 'Calligraphy Brush'
		});
	});

	it('handles a trailing TODO in a list that also has names', () => {
		expect(m.participants.guests).toEqual([{ name: 'Chen Liu' }, { name: 'Una Hongyang' }]);
		expect(m.incomplete).toEqual(['assistants', 'guests']);
	});

	it('records a supplied montage with no audio offset', () => {
		expect(m.montages[0]).toEqual({ id: 'MON-01', title: undefined, audioFromSeconds: null });
		expect(m.montages[1]).toEqual({ id: 'MON-02', title: 'The place', audioFromSeconds: 57.6 });
	});
});

describe('parseManifest failures', () => {
	it('names the file and the missing section', () => {
		expect(() => parseManifest('# X\n\n## Overview\n\nCode: PRF-09\n', 'PRF-09')).toThrow(
			ManifestError
		);
		expect(() => parseManifest('# X\n\n## Overview\n\nCode: PRF-09\n', 'PRF-09')).toThrow(
			/PRF-09: missing "## Host"/
		);
	});

	it('rejects an overview that fails the schema', () => {
		const bad = read('PRF-01').replace('Date: 2025-05-16', 'Date: May 2025');
		expect(() => parseManifest(bad, 'PRF-01')).toThrow(/date/);
	});
});
