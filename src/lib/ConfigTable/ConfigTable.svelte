<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLTableAttributes } from "svelte/elements";

  interface Props extends HTMLTableAttributes {
    children: Snippet
  }

  const { children }: Props = $props();
</script>

<table class="config">
  <tbody>
    {@render children()}
  </tbody>
</table>
