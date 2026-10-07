<script lang="ts">
	import { getLocale } from '#lib/paraglide/runtime.js';
	import * as m from '#lib/paraglide/messages.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const locale = $derived(getLocale());
	const label = $derived(m.performance_label({ number: String(data.number).padStart(2, '0') }));
	const when = $derived(
		new Intl.DateTimeFormat(locale, {
			dateStyle: 'long',
			timeStyle: 'short',
			timeZone: 'Asia/Tokyo'
		})
	);
	const start = $derived(new Date(`${data.date}T${data.time}:00+09:00`));
	const incomplete = (section: (typeof data.incomplete)[number]) =>
		data.incomplete.includes(section);
</script>

<svelte:head>
	<title>{label} · {m.site_name()}</title>
</svelte:head>

<article>
	<header>
		<h1>{label}</h1>
		<p>
			{data.host.name}, {data.location}, {data.country} ·
			<time datetime={start.toISOString()}>{when.format(start)}</time>
		</p>
	</header>

	<section aria-labelledby="host">
		<h2 id="host">{m.performance_host()}</h2>
		<p>{data.host.name}</p>
		<ul>
			{#if data.host.links.website}<li><a href={data.host.links.website}>website</a></li>{/if}
			{#if data.host.links.wikipedia}<li><a href={data.host.links.wikipedia}>wikipedia</a></li>{/if}
			{#if data.host.links.googleMaps}<li><a href={data.host.links.googleMaps}>map</a></li>{/if}
		</ul>
		{#if data.space}
			<h3>{m.performance_space()}</h3>
			<p>{data.space}</p>
		{/if}
	</section>

	<section aria-labelledby="artists">
		<h2 id="artists">{m.performance_artists()}</h2>
		<ul>
			{#each data.participants.artists as a (a.name)}
				<li>{a.name} — {a.type}, {a.instrument}</li>
			{/each}
			{#if incomplete('artists')}<li>{m.performance_and_others()}</li>{/if}
		</ul>
	</section>

	<section aria-labelledby="crew">
		<h2 id="crew">{m.performance_crew()}</h2>
		{#if !data.crewVerified}
			<p role="note">{m.performance_crew_unverified()}</p>
		{/if}
		<ul>
			{#each data.participants.crew as c (c.name)}
				<li>{c.name} — {c.role}</li>
			{/each}
			{#if incomplete('crew')}<li>{m.performance_and_others()}</li>{/if}
		</ul>

		<h3>{m.performance_executive_producers()}</h3>
		<ul>
			{#each data.participants.executiveProducers as p (p.name)}<li>{p.name}</li>{/each}
			{#if incomplete('executiveProducers')}<li>{m.performance_and_others()}</li>{/if}
		</ul>

		{#if data.participants.assistants.length || incomplete('assistants')}
			<h3>{m.performance_assistants()}</h3>
			<ul>
				{#each data.participants.assistants as p (p.name)}<li>{p.name}</li>{/each}
				{#if incomplete('assistants')}<li>{m.performance_and_others()}</li>{/if}
			</ul>
		{/if}

		{#if data.participants.guests.length || incomplete('guests')}
			<h3>{m.performance_guests()}</h3>
			<ul>
				{#each data.participants.guests as p (p.name)}<li>{p.name}</li>{/each}
				{#if incomplete('guests')}<li>{m.performance_and_others()}</li>{/if}
			</ul>
		{/if}
	</section>

	<section aria-labelledby="stills">
		<h2 id="stills">{m.performance_stills()}</h2>
		<p>{m.performance_stills_count({ count: data.stills.length })}</p>
		<ul>
			{#each data.stills as s (s.id)}<li>{s.id}</li>{/each}
		</ul>
	</section>

	{#if data.texts.length}
		<section aria-labelledby="texts">
			<h2 id="texts">{m.performance_texts()}</h2>
			<p role="note">{m.performance_text_caveat()}</p>
			{#each data.texts as t (t.id)}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- server-rendered from the archive's own Markdown -->
				<div>{@html t.html}</div>
			{/each}
		</section>
	{/if}
</article>
