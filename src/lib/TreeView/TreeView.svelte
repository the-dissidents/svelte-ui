<script lang="ts" module>
  export type TreeViewLeafItem<T> = {
    data: T, leaf: true
  };

  export type TreeViewNodeItem<T> = {
    data: T, open: boolean, leaf: false
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
  }

  const { getItems, leaf, node }: Props = $props();
</script>

{#snippet subtree(item: TreeViewItem<TLeaf, TNode>)}
  {#if item.leaf}
    <li role='listitem'>
      {@render leaf(item)}
    </li>
  {:else}
    <li role='listitem'>
      <label>
        <input type="checkbox" bind:checked={item.open}>
        {#if item.open}
          <ChevronDownIcon />
        {:else}
          <ChevronRightIcon />
        {/if}
        {@render node(item)}
      </label>
    </li>
    {#if item.open}
      <ol>
        {#each getItems(item) as subitem}
          {@render subtree(subitem)}
        {/each}
      </ol>
    {/if}
  {/if}
{/snippet}

<ol role='listbox'>
  {#each getItems() as item}
    {@render subtree(item)}
  {/each}
</ol>

<style lang='scss'>
  @use '../parameters.sass' as *;
  @use '../uchu.scss' as uchu;

  ol[role='listbox'] {
    padding-block: 0;
    li {
      margin: 0;
      padding: 0;
      border-bottom: none !important;
      padding-left: 1em;

      display: flex;
      flex-direction: row;
      font-size: v(text-font-size);

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
    ol {
      display: flex;
      flex-direction: column;
      white-space: normal;
      overflow-y: auto;
      list-style: none;
      margin: 0 0 0 0.75em;
      padding: 0;

      border-left: 1px solid v(separator-minor-light);

      &:hover {
        border-left: 1px solid v(separator-light);
      }
    }
  }

  label {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;
    gap: 3px;

    margin: 0;
    padding: 4px 6px;
    line-height: normal;
    cursor: pointer;
  }

  // Chevron indicator that rotates when the node is open.
  label :global(.lucide) {
    display: block;
    position: absolute;
    width: 1em;

    aspect-ratio: 1;
    left: -0.75em;

    text-align: center;
    transition: transform 0.15s ease;
    transform-origin: center;
  }

  label:has(input:checked)::before {
    transform: rotate(90deg);
  }

  label > input[type='checkbox'] {
    width: 0;
    height: 0;
    display: none;
  }

  label:has(input:focus-visible) {
    @include light() {
      box-shadow: ve(inset 0 0 0 2px, accent1-back-light);
    }
    @include dark() {
      box-shadow: ve(inset 0 0 0 2px, accent1-back-dark);
    }
  }
</style>
