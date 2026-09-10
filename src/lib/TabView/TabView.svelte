<script lang="ts" module>
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TabAPIType = {};
export type TabPageData = {
  readonly id: string,
  readonly header: () => Snippet | string,
  readonly alignment: () => 'start' | 'end',
  readonly closeRequested: () => (() => void) | undefined,
};
export const TabAPIContext: TabAPIType = {};

export type TabAPI = {
  registerPage(data: TabPageData): void,
  selected: string | undefined
};
</script>

<script lang="ts">
import { onMount, setContext, type Snippet } from "svelte";
import { XIcon } from "@lucide/svelte";
import { SvelteMap } from "svelte/reactivity";
import { Debug } from "$lib/Debug.js";

interface Props {
  children: Snippet;
  current?: string;
}

let { children, current = $bindable() }: Props = $props();
let history: string[] = [];
let pages = new SvelteMap<string, TabPageData>();

setContext<TabAPI>(TabAPIContext, {
  registerPage(data) {
    onMount(() => {
      const id = data.id;
      if (pages.has(id)) {
        throw new Error(`duplicate tab id: ${id}`);
      }
      console.log('adding tab', id);
      pages.set(id, data);
      if (!current) current = id;

      return () => {
        console.log('removing tab', id);
        Debug.assert(pages.has(id));
        pages.delete(id);
      }
    });
  },
  get selected() {
    return current;
  },
  set selected(x) {
    current = x;
  }
});

$effect(() => {
  pages.has(current!);

  console.log('current=', current);
  if (current && !pages.has(current)) {
    let previous: string | undefined;
    while ((previous = history.pop()))
      if (pages.has(previous)) break;
    current = previous;
    console.log('current set to', current);
    return;
  }
  if (current && current !== history.at(-1))
    history.push(current);
})
</script>

{#snippet page(id: string, data: TabPageData)}
  {@const selected = current === id}
  {@const header = data.header()}
  {@const close = data.closeRequested()}

  <div class='tab' class:selected>
    <button
      role='tab'
      class='tabbutton'
      onclick={() => current = id}
    >
      {#if typeof header == 'string'}
        {header}
      {:else}
        {@render header()}
      {/if}
    </button>

    {#if close && selected}
      <button class="close" disabled={!selected} onclick={() => close?.()}>
        <XIcon />
      </button>
    {/if}
  </div>

{/snippet}

<div class='tabview vlayout'>
  <div class='header'>
    <div class="left">
      {#each pages as [id, data]}
      {#if data.alignment() == 'start'}
        {@render page(id, data)}
      {/if}
      {/each}
    </div>

    <div class="spacer"></div>

    <div class="right">
      {#each pages as [id, data]}
      {#if data.alignment() == 'end'}
        {@render page(id, data)}
      {/if}
      {/each}
    </div>
  </div>

  {@render children()}
</div>

<style lang='scss'>
  @use '../parameters.sass' as *;

  .selected {
    border-bottom-width: 2px;
  }

  .tabview {
    width: 100%;
    height: 100%;
  }

  .tab {
    position: relative;
    display: inline-flex;
    flex-direction: row;
    justify-items: stretch;
    border-bottom: 1px solid transparent;

    &:not(.selected) {
      filter: contrast(10%) !important;
    }
    &:not(.selected):hover {
      filter: contrast(50%) !important;
    }

    button {
      background: none;
      border: none;
      border-radius: 0;
      box-shadow: none;
      margin: 0;
      font-size: v(label-font-size);
      text-wrap: nowrap;
      outline: none !important;
      border: none;
    }

    .tabbutton {
      margin: 0;
      width: 100%;
    }

    &:has(.close) .tabbutton {
      padding-right: 1.5em;
    }

    .close {
      position: absolute;
      right: 0;
      bottom: 0.2em;
      top: 0.2em;
      padding: 0;
      aspect-ratio: 1;
      :global(.lucide) {
        height: 1em;
      }
    }

    &.selected .close {
      &:hover {
        background: lightblue;
      }
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

  .header, .left, .right {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: end;
  }

  .right {
    justify-content: end;
  }

  .header {
    flex-wrap: nowrap;
  }

  .spacer {
    flex-grow: 1;
    width: 2em;
    align-self: stretch;
  }
</style>
