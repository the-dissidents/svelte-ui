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
  /** do not modify */
  id: string;
  header: Snippet | string;
  alignment?: 'start' | 'end';
  lazy?: boolean;

  onCloseRequested?: () => void;
  onActivate?: () => void;
  children?: Snippet;
}

let {
  id, header, children, lazy,
  alignment = 'start',
  onActivate,
  onCloseRequested,
}: Props = $props();

const tabApi: TabAPI = getContext(TabAPIContext);

tabApi.registerPage({
  id,
  alignment: () => alignment,
  header: () => header,
  closeRequested: () => onCloseRequested
});

$effect(() => {
  if (tabApi.selected === id) {
    console.log('activate:', id);
    onActivate?.();
  }
});
</script>

<div class='page' class:active={tabApi.selected === id}>
  {#if !lazy || tabApi.selected === id}
    {@render children?.()}
  {/if}
</div>

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
