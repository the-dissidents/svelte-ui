<!--
  @component
  If you want to dynamically include `<TabPage>`s in a `{#each}` block, make sure you key it using the tabs' `id`, or unexpected behavior may arise for unknown reasons.

  ```tsx
  {#each customTabs as [id, tab] (id)}
    <TabPage {id} header={id}
      onCloseRequested={() => customTabs.delete(id)}
    > ... </TabPage>
  {/each}
  ```
-->
<script lang="ts">
import { getContext, type Snippet } from "svelte";
import { TabAPIContext, type TabAPI } from "./TabView.svelte";

interface Props {
  /** do not modify once initialized */
  id: string;
  header: Snippet | string;
  reorderable?: boolean;
  alignment?: 'start' | 'end';
  lazy?: boolean;

  onCloseRequested?: () => void;
  onActivate?: () => void;
  children?: Snippet;
}

let {
  id, header, children, lazy,
  reorderable = false,
  alignment = 'start',
  onActivate,
  onCloseRequested,
}: Props = $props();

const tabApi: TabAPI = getContext(TabAPIContext);

tabApi.registerPage({
  id,
  alignment: () => alignment,
  reorderable: () => reorderable,
  header: () => header,
  closeRequested: () => onCloseRequested,
  content: () => page
});

$effect(() => {
  if (tabApi.selectedId === id) {
    // console.log('activate:', id);
    onActivate?.();
  }
});
</script>

{#snippet page()}
<div class='page' class:active={tabApi.selectedId === id}>
  {#if !lazy || tabApi.selectedId === id}
    {@render children?.()}
  {/if}
</div>
{/snippet}

<style>
.page {
  padding: 2px;
  flex: 1 0;
  overflow-x: hidden;
  overflow-y: auto;
  display: none;
  scrollbar-gutter: stable;
}
.active {
  display: block;
}
</style>
