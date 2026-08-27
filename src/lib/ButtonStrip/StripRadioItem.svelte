<script lang="ts" generics="T">
  import { type Snippet } from "svelte";
  import type { HTMLLabelAttributes } from "svelte/elements";
  import { childPosition, getButtonStripContext } from "./ButtonStrip.svelte";
  import { Debug } from "$lib/Debug.js";

  interface Props extends HTMLLabelAttributes {
    value: T,
    disabled?: boolean,
    children: Snippet
  }

  const { children, value, disabled, ...rest }: Props = $props();

  const cxt = getButtonStripContext<T>();
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
    checked={cxt.target === value}
    onchange={() => cxt.target = value}>
</label>
