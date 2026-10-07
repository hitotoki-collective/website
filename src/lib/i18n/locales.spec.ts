import { describe, expect, it } from 'vitest';
import inlang from '../../../project.inlang/settings.json' with { type: 'json' };
import { baseLocale, locales } from '#lib/paraglide/runtime.js';

// The locale set is fixed by docs/technical/requirements.md. This pins the
// Inlang project and the compiled Paraglide runtime to it, BCP 47 casing included.
const REQUIRED = ['ar', 'zh-Hans', 'en', 'fr', 'de', 'hi', 'it', 'ja', 'ko', 'pt', 'ru', 'es'];

describe('locales', () => {
	it('match the twelve required BCP 47 tags exactly', () => {
		expect([...inlang.locales].sort()).toEqual([...REQUIRED].sort());
		expect([...locales].sort()).toEqual([...REQUIRED].sort());
	});

	it('use en as the source locale', () => {
		expect(inlang.baseLocale).toBe('en');
		expect(baseLocale).toBe('en');
	});
});
