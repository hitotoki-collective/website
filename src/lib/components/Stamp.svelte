<script lang="ts">
	import { getLocale } from '#lib/paraglide/runtime.js';
	import * as m from '#lib/paraglide/messages.js';

	// The vermilion date mark a temple presses into a goshuinchō: the
	// performance's number and the day it was received. Sits in the fold margin.
	let { number, date, time }: { number: number; date: string; time?: string } = $props();

	const locale = $derived(getLocale());
	const padded = $derived(String(number).padStart(2, '0'));
	const day = $derived(
		new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Asia/Tokyo' }).format(
			new Date(`${date}T${time ?? '12:00'}:00+09:00`)
		)
	);
</script>

<p class="stamp" aria-label={m.performance_label({ number: padded })}>
	<span class="number" aria-hidden="true">{padded}</span>
	<time datetime={date}>{day}</time>
</p>

<style>
	.stamp {
		display: inline-grid;
		justify-items: center;
		gap: 0.1em;
		margin: 0;
		padding: var(--space-2) var(--space-3) var(--space-3);
		background: var(--stamp);
		color: var(--stamp-ink);
		font-family: var(--font-display);
		line-height: 1.1;
		border-radius: 3px;
		/* a pressed stamp is never perfectly square to the page */
		rotate: -1.5deg;
		max-width: none;
		white-space: nowrap;
		overflow-wrap: normal;
		box-shadow: 0 1px 0 color-mix(in oklab, var(--stamp) 60%, black);
	}
	.number {
		font-size: var(--step-2);
		font-weight: 400;
		letter-spacing: 0.04em;
		font-variant-numeric: tabular-nums;
	}
	time {
		font-size: var(--step--1);
		font-variant-numeric: tabular-nums;
		opacity: 0.92;
	}
</style>
