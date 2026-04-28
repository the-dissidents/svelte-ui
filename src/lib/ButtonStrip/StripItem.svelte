<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    children: Snippet
  }

  const { children, ...rest }: Props = $props();
</script>

<button class="item" {...rest}>
  {@render children()}
</button>

<style lang="scss">
  @use '../parameters.sass' as *;

  button.item {
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
