<script lang="ts" generics="TItem extends WeakKey, ColId extends string">
  import type { Snippet } from 'svelte';
	import { onMount, onDestroy } from 'svelte';

	interface Column {
		header: string;
		width?: string;
    align?: 'start' | 'end' | 'center';
	}

  type ColumnSnippets = {[C in ColId]: Snippet<[TItem, number, C]>};

	type Props = ColumnSnippets & {
		items: TItem[];
		columns: [ColId, Column][];
		loading?: boolean;
    style?: string;
    canSelect?: boolean;
    selectedIndex?: number;
		onEndReached?: () => void;
	}

	let {
		items,
		columns,
    selectedIndex = $bindable(),
    canSelect = false,
		loading = false,
		onEndReached,
    style,
    ...snippets
	}: Props = $props();

	let sentinel: HTMLDivElement;
	let observer: IntersectionObserver;

	let gridTemplate = $derived(
    columns.map(([_, c]) => c.width ?? 'auto').join(' '));

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
	<div class="grid" style:grid-template-columns={gridTemplate}>
    <div class="row header" role='listitem'>
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
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <div role='listitem'
          class={{active: selectedIndex == i, row: true}}
          onclick={() => {
            if (canSelect) selectedIndex = i
          }}
        >
          {#each columns as [id, col]}
            <div class="cell"
              style:text-align={col.align ?? 'start'}
            >
              {@render (snippets as unknown as ColumnSnippets)[id](item, i, id)}
            </div>
          {/each}
        </div>
      {/each}
    </div>

		<div bind:this={sentinel} class="sentinel"></div>

		{#if loading}
			<div class="loading-indicator">Loading...</div>
		{/if}
	</div>
</div>

<style lang='scss'>
  @use './parameters.sass' as *;

	.list-view {
		display: flex;
		flex-direction: column;
    padding: 0;

    @include light() {
      border-color: v(list-border-light);
    }
    @include dark() {
      border-color: v(list-border-dark);
    }
	}

	.grid {
		display: grid;
    gap: 0 8px;
		overflow-y: auto;
	}

  .row {
    grid-column: 1 / -1;
		display: grid;
    grid-template-columns: subgrid;
    background-color: v(box-back-light);

    &:not(.header) {
      @include hover-indicator;
    }
  }

  .body {
    grid-column: 1 / -1;
		display: grid;
    grid-template-columns: subgrid;
  }

  .header.header.header {
    position: sticky;
    top: 0;
    padding-block: 5px;
    z-index: 1;

    @include light() {
      border-bottom-color: v(list-border-light);
      background-color: v(list-header-light);
    }
    @include dark() {
      border-bottom-color: v(list-border-dark);
      background-color: v(list-header-dark);
    }
  }

	.header-cell {
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.cell {
		white-space: nowrap;
		text-overflow: ellipsis;
		align-self: center;
	}

  .active {
    @include light() {
      background-color: v(list-selection-light);
    }
    @include dark() {
      background-color: v(list-selection-dark);
    }
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
