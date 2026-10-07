import { describe, expect, it } from 'vitest';
import { getPerformance, listPerformances } from './index.js';

describe('archive index', () => {
	it('lists every performance in the submodule, newest first', () => {
		expect(listPerformances().map((p) => p.code)).toEqual(['PRF-02', 'PRF-01']);
	});

	it('attaches the stills by name, without importing them', () => {
		const p1 = getPerformance('PRF-01')!;
		expect(p1.stills).toHaveLength(16);
		expect(p1.stills[3]).toEqual({
			id: 'PRF-01-IMG-03',
			path: 'src/content/archive/performances/PRF-01/PRF-01-IMG-03.jpeg'
		});
		expect(getPerformance('PRF-02')!.stills).toHaveLength(39);
	});

	it('separates written texts from transcripts and quote extracts', () => {
		expect(getPerformance('PRF-01')!.texts.map((t) => t.id)).toEqual([
			'PRF-01-FORTY-MINUTES-ABOVE-THE-POND'
		]);
		expect(getPerformance('PRF-02')!.texts).toEqual([]);
	});

	it('lists speakers with a quote extract', () => {
		expect(getPerformance('PRF-01')!.speakers).toEqual([
			'Akira',
			'Jason',
			'Kazu',
			'Mark Greenslade',
			'Taro'
		]);
		expect(getPerformance('PRF-02')!.speakers).toContain('Kosho Taniuchi');
	});
});
