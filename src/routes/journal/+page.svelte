<script lang="ts">
	import { getLocale } from '#lib/paraglide/runtime.js';
	import * as m from '#lib/paraglide/messages.js';
	import Head from '#lib/components/Head.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const dateFormat = $derived(new Intl.DateTimeFormat(getLocale(), { dateStyle: 'long' }));
</script>

<Head title="{m.journal_title()} · {m.site_name()}" description={m.cover_line()} />

<h1>{m.journal_title()}</h1>

{#if data.posts.length === 0}
	<p>{m.journal_empty()}</p>
{:else}
	<ul>
		{#each data.posts as post (post.slug)}
			<li>
				<article>
					<h2>{post.title}</h2>
					<p><time datetime={post.date}>{dateFormat.format(new Date(post.date))}</time></p>
					<p>{post.summary}</p>
				</article>
			</li>
		{/each}
	</ul>
{/if}
