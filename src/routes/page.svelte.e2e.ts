import { expect, test } from '@playwright/test';

test('the root redirects to a locale-prefixed URL', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveURL(/\/en\/?$/);
	await expect(page.locator('h1')).toBeVisible();
});

test('html carries lang and dir for an LTR locale', async ({ page }) => {
	await page.goto('/ja/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
	await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
});

test('html carries lang and dir for the RTL locale', async ({ page }) => {
	await page.goto('/ar/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
	await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});
