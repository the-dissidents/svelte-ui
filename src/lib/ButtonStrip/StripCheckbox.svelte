<script lang="ts">
  import { type Snippet } from "svelte";
  import type { HTMLLabelAttributes } from "svelte/elements";

  interface Props extends HTMLLabelAttributes {
    value: boolean,
    disabled?: boolean,
    children: Snippet
  }

  let { children, disabled, value = $bindable(), ...rest }: Props = $props();
</script>

<label {...rest}>
  {@render children()}

  <input type='checkbox' class="button" {disabled} bind:checked={value}>
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
