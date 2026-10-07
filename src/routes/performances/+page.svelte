<script lang="ts">
	import { resolve } from '$app/paths';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { href } from '#lib/i18n/href.js';
	import * as m from '#lib/paraglide/messages.js';
	import Head from '#lib/components/Head.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const locale = $derived(getLocale());
	const dateFormat = $derived(new Intl.DateTimeFormat(locale, { dateStyle: 'long' }));
	const listFormat = $derived(new Intl.ListFormat(locale, { type: 'conjunction' }));
</script>

<Head title="{m.performances_title()} · {m.site_name()}" description={m.cover_line()} />

<h1>{m.performances_title()}</h1>

<ul>
	{#each data.performances as p (p.code)}
		<li>
			<article>
				<h2>
					<a href={href(resolve('/performances/[code=code]', { code: p.code }))}>
						{m.performance_label({ number: String(p.number).padStart(2, '0') })}
					</a>
				</h2>
				<p>
					{p.host}, {p.location}, {p.country} ·
					<time datetime={p.date}>{dateFormat.format(new Date(p.date))}</time>
				</p>
				<p>{listFormat.format(p.artists)}</p>
				<p>{m.performance_stills_count({ count: p.stills })}</p>
			</article>
		</li>
	{/each}
</ul>
