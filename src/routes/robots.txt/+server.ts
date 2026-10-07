import { SITE_ORIGIN } from '#lib/site.js';
import type { RequestHandler } from './$types';

export const prerender = true;

// AI crawler policy, stated per user agent. The recorded decision
// (docs/technical/requirements.md, AI Optimisation) is to allow indexing;
// changing it means updating that document first, then this list.
const AI_CRAWLERS = [
	'GPTBot',
	'OAI-SearchBot',
	'ChatGPT-User',
	'ClaudeBot',
	'Claude-SearchBot',
	'Claude-User',
	'anthropic-ai',
	'Google-Extended',
	'Applebot-Extended',
	'PerplexityBot',
	'Perplexity-User',
	'CCBot',
	'Bytespider',
	'meta-externalagent',
	'Amazonbot'
];

export const GET: RequestHandler = () => {
	const lines = [
		'# Hitotoki Collective — crawling and AI training policy: allow.',
		'User-agent: *',
		'Allow: /',
		'',
		...AI_CRAWLERS.flatMap((ua) => [`User-agent: ${ua}`, 'Allow: /', '']),
		`Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
		''
	];
	return new Response(lines.join('\n'), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
};
