<script lang="ts" generics="TItem extends WeakKey, ColId extends string">
  import type { Snippet } from 'svelte';
	import { onMount, onDestroy } from 'svelte';

	interface Column {
		header: string;
		width?: string; // e.g., '1fr', '100px'
    align?: 'start' | 'end' | 'center';
	}

  type ColumnSnippets = {[C in ColId]: Snippet<[TItem, number, C]>};

	type Props = ColumnSnippets & {
		items: TItem[];
		columns: [ColId, Column][];
		loading?: boolean;
    style?: string;
		onEndReached?: () => void;
	}

	let {
		items,
		columns,
		loading = false,
		onEndReached,
    style,
    ...snippets
	}: Props = $props();

	let sentinel: HTMLDivElement;
	let observer: IntersectionObserver;

	// Calculate grid template based on column definitions
	let gridTemplate = $derived(
    columns.map(([_, c]) => c.width ?? '1fr').join(' '));

	onMount(() => {
		if (onEndReached) {
			observer = new IntersectionObserver((entries) => {
				const entry = entries[0];
				if (entry.isIntersecting && !loading) {
					onEndReached();
				}
			}, {
				root: null, // viewport
				rootMargin: '100px', // Pre-fetch before hitting exact bottom
				threshold: 0
			});

			if (sentinel) observer.observe(sentinel);
		}
	});

	onDestroy(() => {
		if (observer) observer.disconnect();
	});
</script>

<div class="list-view" role='listbox' style={style ?? ''}>
	<div class="header" role='listitem' style:grid-template-columns={gridTemplate}>
		{#each columns as [_, col]}
			<div class="header-cell"
        style:text-align={col.align ?? 'start'}
      >
        {col.header}
      </div>
		{/each}
	</div>

	<div class="body">
		{#each items as item, i (item)}
			<div class="row" role='listitem' style:grid-template-columns={gridTemplate}>
        {#each columns as [id, col]}
          <div class="cell"
            style:text-align={col.align ?? 'start'}
          >
            {@render (snippets as unknown as ColumnSnippets)[id](item, i, id)}
          </div>
        {/each}
			</div>
		{/each}

		<div bind:this={sentinel} class="sentinel"></div>

		{#if loading}
			<div class="loading-indicator">Loading...</div>
		{/if}
	</div>
</div>

<style>
	.list-view {
		display: flex;
		flex-direction: column;
		border: 1px solid #ccc;
	}

	.header {
		display: grid;
    gap: 8px;
		border-bottom: 1px solid #ccc;
		font-weight: bold;
	}

	.header-cell {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.body {
		overflow-y: auto;
		flex: 1;
	}

	.row {
		display: grid;
    gap: 8px;
	}

	.list-view .cell {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		align-self: center;
	}

	.sentinel {
		height: 1px;
	}

	.loading-indicator {
		padding: 10px;
		text-align: center;
		color: #666;
		font-style: italic;
	}
</style>
