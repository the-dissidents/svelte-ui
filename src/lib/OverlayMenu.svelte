<script lang="ts" module>
export function overlayMenu(
    items: {text: string, disabled?: boolean}[],
    options: {title?: string, text?: string, rememberedItem?: string, emptyText?: string}
): Promise<number> {
    return new Promise<number>((resolve) => {
        const menu = mount(OverlayMenu, {
            target: document.body,
            props: { items, ...options, async onSubmit(x) {
                await unmount(menu);
                resolve(x);
            }, }
        });
    });
}
</script>

<script lang="ts">
import type { Action } from "svelte/action";
import { mount, unmount } from "svelte";
import OverlayMenu from "./OverlayMenu.svelte";
import { Debug } from "./Debug.js";

let dialog: HTMLDialogElement | undefined = $state();
let closed = false;

interface Props {
  items: { text: string, disabled?: boolean }[],
  rememberedItem?: string,
  text?: string,
  emptyText?: string,
  title?: string,
  onSubmit: (x: number) => void
}

let {
  onSubmit,
  rememberedItem, emptyText,
  items, text = '', title = '',
}: Props = $props();

$effect(() => {
  Debug.assert(dialog !== undefined);
  dialog.showModal();
});

const autofocus: Action<HTMLButtonElement, string> = (node, text) => {
  $effect(() => {
    if (text == rememberedItem)
      node.focus();
  });
};

</script>

<dialog
  bind:this={dialog}
  tabindex="-1"
  onclose={() => {
    if (!closed) onSubmit(-1);
  }}
>
  {#if title}
    <h4>{title}</h4>
  {/if}
  {#if text}
    <p>{text}</p>
  {/if}
  <div class='vlayout'>
    {#each items as item, i (item)}
      <button class="noborder"
        type="submit"
        tabindex="0"
        disabled={item.disabled ?? false}
        onclick={() => {closed = true; onSubmit(i)}}
        use:autofocus={item.text}
      >
        {item.text}
      </button>
    {:else}
    {#if emptyText}
      <button class="noborder" disabled={true}>
        {emptyText}
      </button>
    {/if}
    {/each}
  </div>
</dialog>

<style lang='scss'>
  @use 'uchu.scss';
  @use 'dialog.scss' as *;

  div {
    list-style: none;
    padding: 0 0 10px 0;
    min-width: 10em;
  }

  button {
    box-shadow: none;
    text-align: start;
    border-radius: 0;
    border-bottom: 1px solid gray;
  }
  button:focus {
    outline: 2px solid color-mix(in oklab, uchu.$blue-3, transparent);
  }
</style>
