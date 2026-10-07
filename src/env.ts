import { defineEnvVars } from '@sveltejs/kit/env';

// SvelteKit 3 environment variables: declared here, imported from
// `$app/env/public` / `$app/env/private`. See .env.example.
export const variables = defineEnvVars({
	PUBLIC_SITE_ORIGIN: {
		public: true,
		static: true,
		description:
			'Production origin for canonical URLs, hreflang, sitemap, feeds and JSON-LD. The domain is not decided yet; the placeholder is deliberately unusable.',
		schema: (value) =>
			value && value.trim() !== '' ? value.replace(/\/$/, '') : 'https://hitotoki.example'
	}
});
