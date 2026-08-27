<script lang="ts">
  import { Debug } from "$lib/Debug.js";
  import { type Snippet } from "svelte";
  import type { HTMLLabelAttributes } from "svelte/elements";
  import { getButtonStripContext, childPosition } from "./ButtonStrip.svelte";

  interface Props extends HTMLLabelAttributes {
    value: boolean,
    disabled?: boolean,
    children: Snippet
  }

  let { children, disabled, value = $bindable(), ...rest }: Props = $props();

  const cxt = getButtonStripContext();
  Debug.assert(!!cxt);

  let elem = $state<HTMLElement>();
  let position = $derived(childPosition(elem, cxt.container));
</script>

<label {...rest} bind:this={elem} data-strip-item
  class:first={position == 'first'}
  class:last={position == 'last'}
>
  {@render children()}

  <input type='checkbox' class="button"
    disabled={disabled || cxt.disabled}
    bind:checked={value}>
</label>
