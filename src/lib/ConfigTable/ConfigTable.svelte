<script lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  interface Props {
    children: Snippet
  }

  const { children, ...rest }: Props & SvelteHTMLElements['div'] = $props();
</script>

<div {...rest}>
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
