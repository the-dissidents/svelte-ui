<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLTableAttributes } from "svelte/elements";

  interface Props extends HTMLTableAttributes {
    children: Snippet
  }

  const { children }: Props = $props();
</script>

<div>
  {@render children()}
</div>

<style lang="scss">
  div {
    display: grid;
    grid-template-columns: min-content auto 1fr;
    gap: 0.2em 0.3em;
    align-items: start;
    margin: 0.2em;
  }
</style>
