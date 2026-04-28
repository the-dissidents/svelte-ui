<script lang="ts">
import { getContext, untrack, type Snippet } from "svelte";
import { TabAPIContext, type TabAPI, type TabPageData } from "./TabView.svelte";

interface Props {
  id: string;
  header: Snippet | string;
  lazy?: boolean;
  active?: boolean;
  onActivate?: () => void;
  children?: Snippet;
}

let {
  id, header, children, lazy,
  active = $bindable(false),
  onActivate
}: Props = $props();

const tabApi: TabAPI = getContext(TabAPIContext);

const page: TabPageData = {
  id,
  header: () => header
};

tabApi.registerPage(page);
const selection = tabApi.selected();
selection.subscribe((x) => { active = x === id; });

  $effect(() => {
    if (active) {
      untrack(() => {
        selection.set(id);
        onActivate?.();
      });
    }
  });
</script>

<div class={['page', 'fill', {active}]}>
  {#if !lazy || active}
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
