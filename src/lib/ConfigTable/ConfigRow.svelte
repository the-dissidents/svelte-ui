<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLTableAttributes } from "svelte/elements";

  interface Props extends HTMLTableAttributes {
    name: string | Snippet,
    children: Snippet
  }

  const { name, children }: Props = $props();
</script>

<tr>
  <td class="name">
    {#if typeof name === 'string'}
      {name}
    {:else}
      {@render name()}
    {/if}
  </td>
  <td>
    {@render children()}
  </td>
</tr>

<style lang="scss">
  @use '../parameters.sass' as *;

  td.name {
    font-size: v(text-font-size);
    padding-right: 0.3em;
    text-align: end;
    align-content: start;
  }
</style>
