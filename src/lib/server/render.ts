import { render } from 'svelte/server';
import type { Component } from 'svelte';

// Markdown content is compiled by MDsveX into Svelte components. Rendering
// them here, on the server, to an HTML string keeps the content out of the
// client bundle: pages receive markup, not components, and hydrate nothing
// for it. The requirements want core content legible without JavaScript.
export function renderToHtml(component: Component): string {
	return render(component).body;
}
