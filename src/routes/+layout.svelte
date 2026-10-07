<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getLocale, locales } from '#lib/paraglide/runtime.js';
	import { href } from '#lib/i18n/href.js';
	import * as m from '#lib/paraglide/messages.js';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const nav = [
		{ href: '/performances', label: m.nav_performances },
		{ href: '/about', label: m.nav_about },
		{ href: '/journal', label: m.nav_journal }
	] as const;

	const locale = $derived(getLocale());
	const languageName = (tag: string) =>
		new Intl.DisplayNames([tag], { type: 'language' }).of(tag) ?? tag;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a class="skip" href="#content">{m.skip_to_content()}</a>

<header>
	<a href={href(resolve('/'))} class="brand" lang="ja">{m.site_name_ja()}</a>
	<nav aria-label={m.nav_home()}>
		<ul>
			{#each nav as item (item.href)}
				<li><a href={href(resolve(item.href))}>{item.label()}</a></li>
			{/each}
		</ul>
	</nav>
	<nav aria-label={m.nav_language()}>
		<ul>
			{#each locales as tag (tag)}
				<li>
					<a
						href={href(page.url.pathname, tag)}
						hreflang={tag}
						lang={tag}
						aria-current={tag === locale ? 'true' : undefined}
					>
						{languageName(tag)}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<main id="content">
	{@render children()}
</main>

<footer>
	<p>{m.site_name()}</p>
</footer>
