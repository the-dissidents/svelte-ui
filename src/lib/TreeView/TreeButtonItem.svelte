<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    children: Snippet
  }

  const { children, ...rest }: Props = $props();
</script>

<button {...rest}>
  {@render children()}
</button>

<style lang='scss'>
  @use '../parameters.sass' as *;
  @use '../uchu.scss' as uchu;

  button {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;

    margin: 0;
    padding: 0;
    line-height: normal;

    border: none;
    border-radius: 0;
    box-shadow: none;
    background: transparent;

    text-align: start;
    font-family: v(ui-font-family);

    &:disabled {
      @include light() {
        color: v(disabled-text-light);
      }
      @include dark() {
        color: v(disabled-text-dark);
      }
    }
  }
</style>
