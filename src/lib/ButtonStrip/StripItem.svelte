<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { childPosition, getButtonStripContext } from "./ButtonStrip.svelte";
  import { Debug } from "$lib/Debug.js";

  interface Props extends HTMLButtonAttributes {
    children: Snippet
  }

  const { children, disabled, ...rest }: Props = $props();
  const cxt = getButtonStripContext();
  Debug.assert(!!cxt);

  let elem = $state<HTMLElement>();
  let position = $derived(childPosition(elem, cxt.container));
</script>

<button {...rest} bind:this={elem} data-strip-item
  class:first={position == 'first'}
  class:last={position == 'last'}
  disabled={disabled || cxt.disabled}
>
  {@render children()}
</button>
