<script lang="ts" module>
import { type Writable } from "svelte/store";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TabAPIType = {};
export type TabPageData = {
  readonly id: string,
  readonly header: () => Snippet | string,
};
export const TabAPIContext: TabAPIType = {};

export type TabAPI = {
  registerPage(data: TabPageData): void,
  selected(): Writable<string | undefined>
};
</script>

<script lang="ts">
import { onDestroy, setContext, type Snippet } from "svelte";
import { writable } from "svelte/store";

interface Props {
  children: Snippet;
  value?: string;
}

let { children, value = $bindable() }: Props = $props();

let Pages = new Map<string, TabPageData>();
let Selected = writable<string | undefined>(undefined);
let update = $state(0);

Selected.subscribe((x) => {
  value = x;
});

$effect(() => {
  $Selected = value === undefined ? undefined : Pages.get(value)?.id;
});

setContext<TabAPI>(TabAPIContext, {
  registerPage(data) {
    if (Pages.has(data.id)) {
      throw new Error(`duplicate tab id: ${data.id}`);
    }
    Pages.set(data.id, data);
    $Selected = $Selected ?? data.id;
    update++;

    onDestroy(() => {
      Pages.delete(data.id);
      if (Pages.size == 0 || $Selected == data.id)
        $Selected = undefined;
    });
  },
  selected() {
    return Selected;
  },
});
</script>

<div class='tabview vlayout'>
  <div class='header'>
    {#key update}
    {#each Pages as [id, data] (id)}
    {@const header = data.header()}
      <button
        class:selected="{$Selected === id}"
        class='hlayout'
        onclick={() => $Selected = id}>
        {#if typeof header == 'string'}
          {header}
        {:else}
          {@render header()}
        {/if}
      </button>
    {/each}
    {/key}
  </div>

  {@render children()}
</div>

<style lang='scss'>
  @use 'parameters.sass' as *;

  .selected {
    border-bottom-width: 2px;
  }

  button {
    outline: none !important;

    &:not(.selected) {
      filter: contrast(10%) !important;
    }
    &:not(.selected):hover {
      filter: contrast(50%) !important;
    }
  }

  .header, .selected {
    @media (prefers-color-scheme: light) {
      border-bottom: 1px solid v(tab-accent-light);
    }
    @media (prefers-color-scheme: dark) {
      border-bottom: 1px solid v(tab-accent-dark);
    }
  }

  .tabview {
    width: 100%;
    height: 100%;
  }

  .header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: thin;
    margin-bottom: 2px;
  }
  button {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    box-shadow: none;
    margin: 0;
    font-size: 90%;
    text-wrap: nowrap;
  }
</style>
