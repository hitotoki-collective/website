<script lang="ts">
	import { resolve } from '$app/paths';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { href } from '#lib/i18n/href.js';
	import * as m from '#lib/paraglide/messages.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const dateFormat = $derived(new Intl.DateTimeFormat(getLocale(), { dateStyle: 'long' }));
</script>

<svelte:head>
	<title>{m.site_name()}</title>
</svelte:head>

<h1>{m.site_name()}</h1>

<section aria-labelledby="performances">
	<h2 id="performances">{m.performances_title()}</h2>
	<ul>
		{#each data.performances as p (p.code)}
			<li>
				<a href={href(resolve('/performances/[code=code]', { code: p.code }))}>
					{m.performance_label({ number: String(p.number).padStart(2, '0') })}
				</a>
				· {p.host}, {p.location}
				· <time datetime={p.date}>{dateFormat.format(new Date(p.date))}</time>
			</li>
		{/each}
	</ul>
</section>
