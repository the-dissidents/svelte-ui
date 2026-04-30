<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLTableAttributes } from "svelte/elements";

  interface Props extends HTMLTableAttributes {
    name: string | Snippet,
    children: Snippet
  }

  const { name, children }: Props = $props();
</script>

<div class="name">
  {#if typeof name === 'string'}
    {name}
  {:else}
    {@render name()}
  {/if}
</div>
<div class="value">
  {@render children()}
</div>

<style lang="scss">
  @use '../parameters.sass' as *;

  .name {
    grid-column: 1;
    font-size: v(text-font-size);
    line-height: normal;
    padding-top: 0.2em;
    text-align: end;
    align-content: v(config-label-alignment);
  }

  .value {
    grid-column: 2;
  }
</style>
