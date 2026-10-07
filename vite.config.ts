import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-cloudflare';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import inlang from './project.inlang/settings.json' with { type: 'json' };
import { contentReport } from './src/lib/content/report-plugin.js';

const LOCALES: string[] = inlang.locales;

export default defineConfig({
	build: {
		// The seal SVG and favicon appear several times per page; keep them as cacheable files.
		assetsInlineLimit: 0
	},
	plugins: [
		// Validates site content front matter (fails the build) and warns on
		// every missing translation before anything is compiled.
		contentReport({ locales: LOCALES, baseLocale: inlang.baseLocale }),
		// Must precede sveltekit(): transforms the curated archive stills into AVIF/WebP sets.
		enhancedImages(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			prerender: {
				// Routes live unprefixed in src/routes; Paraglide reroutes `/<locale>/...`.
				// Seed one entry per locale and let the crawler follow the layout's
				// language links to reach every localized page.
				entries: LOCALES.map((locale) => `/${locale}` as const)
			},
			preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
			extensions: ['.svelte', '.svx', '.md']
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true,
			// Locale is always in the path, `en` included: there is no unprefixed
			// variant. An explicit choice (cookie) beats Accept-Language, which
			// beats the base locale. See docs/technical/requirements.md.
			strategy: ['url', 'cookie', 'preferredLanguage', 'baseLocale'],
			urlPatterns: [
				{
					pattern: '/:path(.*)?',
					localized: LOCALES.map((locale) => [locale, `/${locale}/:path(.*)?`])
				}
			]
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
