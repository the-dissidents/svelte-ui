<script lang="ts" generics="T">
  import { type Snippet } from "svelte";
  import type { HTMLLabelAttributes } from "svelte/elements";
  import { getButtonStripContext } from "./ButtonStrip.svelte";
  import { Debug } from "$lib/Debug.js";

  interface Props extends HTMLLabelAttributes {
    value: T,
    disabled?: boolean,
    children: Snippet
  }

  const { children, value, disabled, ...rest }: Props = $props();

  const cxt = getButtonStripContext<T>();
  Debug.assert(!!cxt);
</script>

<label {...rest}>
  {@render children()}

  <input type='radio' class="button" {disabled}
    checked={cxt.target === value}
    onchange={() => cxt.target = value}>
</label>

<style lang="scss">
  @use '../parameters.sass' as *;

  label {
    flex-grow: 1;
    border-radius: 0;
    margin-inline: 0;

    &:first-child {
      border-radius: v(border-radius-large) 0 0 v(border-radius-large);
      margin-right: 0;
    }
    &:last-child {
      border-radius: 0 v(border-radius-large) v(border-radius-large) 0;
      margin-left: 0;
    }
  }
</style>
