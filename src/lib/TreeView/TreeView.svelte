<script lang="ts" module>
  export type TreeViewLeafItem<T> = {
    key: string, data: T, leaf: true
  };

  export type TreeViewNodeItem<T> = {
    key: string, data: T, leaf: false, defaultOpen?: boolean
  };

  export type TreeViewItem<TLeaf, TNode> = TreeViewLeafItem<TLeaf> | TreeViewNodeItem<TNode>;
</script>

<script lang="ts" generics="TLeaf, TNode">
  import { ChevronDownIcon, ChevronRightIcon } from "@lucide/svelte";

  import type { Snippet } from "svelte";

  interface Props {
    getItems: (item?: TreeViewNodeItem<TNode>) => TreeViewItem<TLeaf, TNode>[],
    leaf: Snippet<[item: TreeViewLeafItem<TLeaf>]>,
    node: Snippet<[item: TreeViewNodeItem<TNode>]>,
    selected?: string | null,
    onselectchange?: (id: string | null) => void,
  }

  let {
    getItems, leaf, node,
    selected = $bindable(null as string | null),
    onselectchange,
  }: Props = $props();

  let open = $state<Record<string, boolean>>({});
  let rootEl = $state<HTMLElement>();

  function isOpen(item: TreeViewNodeItem<TNode>) {
    return open[item.key] ?? item.defaultOpen ?? false;
  }

  function setSelected(id: string) {
    selected = id;
    onselectchange?.(id);
  }

  function onRowClick(e: MouseEvent, item: TreeViewItem<TLeaf, TNode>) {
    e.stopPropagation();
    setSelected(item.key);
  }

  function onRowKeydown(e: KeyboardEvent, item: TreeViewItem<TLeaf, TNode>) {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setSelected(item.key);
        break;
      case "ArrowRight":
        if (!item.leaf && !isOpen(item)) {
          e.preventDefault();
          open[item.key] = true;
        }
        break;
      case "ArrowLeft":
        if (!item.leaf && isOpen(item)) {
          e.preventDefault();
          open[item.key] = false;
        }
        break;
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        const next = adjacentTreeItem(e.currentTarget as HTMLElement, e.key === "ArrowDown" ? 1 : -1);
        if (next) {
          next.focus();
          if (next.dataset.id) setSelected(next.dataset.id);
        }
        break;
      }
    }
  }

  function adjacentTreeItem(from: HTMLElement, direction: 1 | -1): HTMLElement | undefined {
    if (!rootEl) return undefined;
    const items = Array.from(rootEl.querySelectorAll<HTMLElement>('[role="treeitem"] > .row'));
    return items[items.indexOf(from) + direction];
  }
</script>

{#snippet subtree(item: TreeViewItem<TLeaf, TNode>, depth: number)}
<li role='treeitem' data-id={item.key}
  aria-selected={selected === item.key}
  aria-level={depth}
  aria-expanded={item.leaf ? undefined : isOpen(item)}
>
  <div class='row' class:leaf={item.leaf}
    role="button"
    tabindex={selected === item.key ? 0 : -1}
    onclick={(e) => onRowClick(e, item)}
    onkeydown={(e) => onRowKeydown(e, item)}
  >
    {#if item.leaf}
      {@render leaf(item)}
    {:else}
      <label>
        <input type="checkbox" bind:checked={open[item.key]}>
        {#if isOpen(item)}
          <ChevronDownIcon />
        {:else}
          <ChevronRightIcon />
        {/if}
        {@render node(item)}
      </label>
    {/if}
  </div>

  {#if !item.leaf && isOpen(item)}
    <ol role='group'>
      {#each getItems(item) as subitem}
        {@render subtree(subitem, depth + 1)}
      {/each}
    </ol>
  {/if}
</li>
{/snippet}

<ol role='tree' class="svelte-ui-listbox" bind:this={rootEl}>
  {#each getItems() as item}
    {@render subtree(item, 1)}
  {/each}
</ol>

<style lang='scss'>
  @use '../parameters.sass' as *;
  @use '../uchu.scss' as uchu;

  ol[role='tree'] {
    padding-block: 0;
    padding: 0;
    margin: 1px;
    border-radius: 3px;
    list-style: none;

    li {
      margin: 0;
      padding: 0;
      border-bottom: none !important;
      font-size: v(text-font-size);

      display: flex;
      flex-direction: column;
      outline: none;
    }
    ol {
      display: flex;
      flex-direction: column;
      white-space: normal;
      overflow-y: auto;
      list-style: none;
      margin: 0 0 0 0.8em;
      padding: 0;
      outline: none;

      @include light() {
        border-left: 1px solid v(separator-minor-light);
        &:hover {
          border-left: 1px solid v(separator-light);
        }
      }
      @include dark() {
        border-left: 1px solid v(separator-minor-dark);
        &:hover {
          border-left: 1px solid v(separator-dark);
        }
      }
    }
  }

  .row {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;
    gap: 3px;

    margin: 0;
    padding: 4px 0;
    line-height: normal;
    cursor: pointer;

    &.leaf {
      padding-left: 1.5em;
    }

    @include light() {
      background-color: v(box-back-light);
      &:hover {
        filter: brightness(97%);
      }
    }
    @include dark() {
      background-color: v(box-back-dark);
      &:hover {
        filter: brightness(110%);
      }
    }
  }

  li[aria-selected='true'] > .row {
    @include light() {
      background-color: v(list-selection-light);
    }
    @include dark() {
      background-color: v(list-selection-dark);
    }
  }

  label {
    flex-grow: 1;
    margin: 0;
    font-size: v(text-font-size);

    :global(.lucide) {
      margin-inline: 0.3em 0.2em;
      padding: 0;
      width: 1em;
      aspect-ratio: 1;
      transition: transform 0.15s ease;
      transform-origin: center;
    }
  }

  input[type='checkbox'] {
    display: none;
  }
</style>
