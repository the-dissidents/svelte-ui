<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLTableAttributes } from "svelte/elements";

  interface Props extends HTMLTableAttributes {
    name: string | Snippet,
    checked?: boolean,
    children: Snippet,
    onCheckedChanged?: (c: boolean) => void
  }

  let { name, children, checked = $bindable(), onCheckedChanged }: Props = $props();
</script>

{#if checked !== undefined}
  <div class="checked">
    <input type='checkbox' bind:checked={checked}
      onchange={(e) => onCheckedChanged?.(e.currentTarget.checked)} />
  </div>
{/if}

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

  .checked {
    grid-column: 1;
  }

  .name {
    grid-column: 2;
    font-size: v(label-font-size);
    line-height: normal;
    padding-top: 0.2em;
    text-align: end;
    align-content: v(config-label-alignment);
  }

  .value {
    grid-column: 3;
  }
</style>
