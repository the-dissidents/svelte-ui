<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLTableAttributes } from "svelte/elements";

  interface Props extends HTMLTableAttributes {
    children: Snippet
  }

  const { children }: Props = $props();
</script>

<form>
  {@render children()}
</form>

<style lang="scss">
  form {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.2em 0.4em;
    align-items: start;
    margin: 0.2em;
  }
</style>
