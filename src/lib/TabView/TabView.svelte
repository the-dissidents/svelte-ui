<script lang="ts" module>
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TabAPIType = {};
export type TabPageData = {
  readonly id: string,
  readonly reorderable: () => boolean,
  readonly header: () => Snippet | string,
  readonly alignment: () => 'start' | 'end',
  readonly closeRequested: () => (() => void) | undefined,
  readonly content: () => Snippet,

  dom?: HTMLElement
};
export const TabAPIContext: TabAPIType = {};

export type TabAPI = {
  registerPage(data: TabPageData): void,
  selectedId: string | undefined
};
</script>

<script lang="ts">
import { onMount, setContext, type Snippet } from "svelte";
import { XIcon } from "@lucide/svelte";
import { Debug } from "$lib/Debug.js";

interface Props {
  children: Snippet;
  current?: string;
}

let { children, current = $bindable() }: Props = $props();
let history: string[] = [];
let pages = $state<TabPageData[]>([]);
let dragTarget = $state<{ id: string, side: 'before' | 'after' }>();

setContext<TabAPI>(TabAPIContext, {
  registerPage(data) {
    onMount(() => {
      const id = data.id;
      if (getPage(id)) {
        throw new Error(`duplicate tab id: ${id}`);
      }
      console.log('adding tab', id);
      pages.push(data);
      if (!current) current = id;

      return () => {
        console.log('removing tab', id);
        const index = pages.findIndex((x) => x.id == id);
        Debug.assert(index >= 0);
        pages.splice(index, 1);
      }
    });
  },
  get selectedId() {
    return current;
  },
  set selectedId(x) {
    current = x;
  }
});

function getPage(id?: string) {
  return id ? pages.find((x) => x.id === id) : undefined;
}

// undefined beforeId means moving to the last
function movePage(id: string, targetId: string, side: 'before' | 'after') {
  if (id == targetId) return;

  console.log('moving page', id, side, targetId);

  const i = pages.findIndex((x) => x.id === id);
  Debug.assert(i >= 0);
  const [data] = pages.splice(i, 1);

  const j = pages.findIndex((x) => x.id === targetId);
  Debug.assert(j >= 0);
  pages.splice(side == 'after' ? j + 1 : j, 0, data);
}

function handleDrag(data: TabPageData, eOrig: MouseEvent) {
  current = data.id;
  if (!data.reorderable()) return;

  let started = false;
  const move = (e: MouseEvent) => {
    if (!started) {
      if (Math.abs(eOrig.clientX - e.clientX) > 2
       || Math.abs(eOrig.clientY - e.clientY) > 2
      ) started = true;
      else return;
    }

    let best = Infinity;
    dragTarget = undefined;
    for (const { id, dom, alignment, reorderable } of pages) {
      if (alignment() !== data.alignment() || !reorderable()) continue;

      const rect = dom?.getBoundingClientRect();
      if (!rect || e.clientY < rect.top || e.clientY > rect.bottom) continue;
      const middleX = rect.left + rect.width / 2;

      if (e.clientX < middleX) {
        const dist = middleX - e.clientX;
        if (dist < best) {
          best = dist;
          dragTarget = { id, side: 'before' };
        }
      } else {
        const dist = e.clientX - middleX;
        if (dist < best) {
          best = dist;
          dragTarget = { id, side: 'after' };
        }
      }
    }
  };
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', move);
    if (!dragTarget) return;
    movePage(data.id, dragTarget.id, dragTarget.side);
    dragTarget = undefined;
  }, {once: true});
}

$effect(() => {
  const page = getPage(current);
  console.log('current=', current);
  if (!page) {
    let previous: string | undefined;
    while ((previous = history.pop()))
      if (getPage(previous)) break;
    current = previous;
    console.log('current set to', current);
    return;
  }
  if (current && current !== history.at(-1))
    history.push(current);
});
</script>

{#snippet pageHeader(data: TabPageData)}
  {@const selected = current === data.id}
  {@const header = data.header()}
  {@const close = data.closeRequested()}

  <div class='tab' class:selected
    class:hasclose={close}
    class:dragbefore={dragTarget?.id === data.id && dragTarget.side == 'before'}
    class:dragafter={dragTarget?.id === data.id && dragTarget.side == 'after'}
    bind:this={data.dom}
  >
    <button
      role='tab' class='tabbutton'
      onmousedown={(e) => handleDrag(data, e)}
    >
      {#if typeof header == 'string'}
        {header}
      {:else}
        {@render header()}
      {/if}
    </button>

    {#if close}
      <button class="close" onclick={() => close?.()}>
        <XIcon />
      </button>
    {/if}
  </div>
{/snippet}

<div class='tabview vlayout'>
  <div class='header'>
    <div class="left">
      {#each pages as data (data.id)}
      {#if data.alignment() == 'start'}
        {@render pageHeader(data)}
      {/if}
      {/each}
    </div>

    <div class="spacer"></div>

    <div class="right">
      {#each pages as data (data.id)}
      {#if data.alignment() == 'end'}
        {@render pageHeader(data)}
      {/if}
      {/each}
    </div>
  </div>

  <div hidden>
    {@render children()}
  </div>

  {#each pages as data (data.id)}
    {@render data.content()()}
  {/each}
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
    border: 1px solid transparent;

    &.dragbefore::before,
    &.dragafter::before {
      content: '';
      position: absolute;
      top: 0; bottom: 0;
      width: 1px;
      pointer-events: none;
      z-index: 1;
      @include colors(background, v(tab-accent-light), v(tab-accent-dark));
    }
    &.dragbefore::before { left: -1.5px; }
    &.dragafter::before { right: -1.5px; }

    &.dragbefore::after,
    &.dragafter::after {
      content: '';
      position: absolute;
      top: 0; width: 0; height: 0;
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-top: 4px solid transparent;
      pointer-events: none;
      z-index: 1;
      @include colors(border-top-color, v(tab-accent-light), v(tab-accent-dark));
    }
    &.dragbefore::after { left: -4px; }
    &.dragafter::after { right: -4px; }

    &:not(.selected) .tabbutton {
      filter: contrast(10%) !important;
    }
    &:not(.selected):hover .tabbutton {
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

    &.hasclose {
      .tabbutton {
        padding-inline: 0.2em 1.3em;
      }
      .close {
        position: absolute;
        padding: 0;
        aspect-ratio: 1;
        right: 0;
        bottom: 0.25em;
        top: 0.25em;
        :global(.lucide) {
          height: 1em;
        }
        &:hover {
          background: #eee;
        }
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
    flex-wrap: wrap-reverse;
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
