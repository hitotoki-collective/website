import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Automated WCAG 2.2 AA floor on every route, in the three locales the
// requirements name (en, ja, ar — Latin LTR, CJK, RTL). Automated checks are a
// floor, not proof: manual screen-reader verification is still required.

const LOCALES = ['en', 'ja', 'ar'] as const;
const ROUTES = ['/', '/performances', '/performances/PRF-01', '/about', '/journal'] as const;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const locale of LOCALES) {
	for (const route of ROUTES) {
		const path = `/${locale}${route === '/' ? '' : route}`;
		test(`${path} has no WCAG 2.2 AA violations`, async ({ page }) => {
			await page.goto(path);
			await page.evaluate(() => document.fonts.ready);
			const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
			const summary = results.violations.map(
				(v) =>
					`${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`
			);
			expect(summary, summary.join('\n')).toEqual([]);
		});
	}
}
