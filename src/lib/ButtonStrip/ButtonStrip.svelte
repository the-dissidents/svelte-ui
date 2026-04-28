<script lang="ts" module>
  interface ButtonStripContext<T> {
    target?: T
  }

  const key = Symbol('ButtonStrip');

  export function getButtonStripContext<T>() {
    return getContext<ButtonStripContext<T>>(key);
  };

  function set<T>(c: ButtonStripContext<T>) {
    setContext<ButtonStripContext<T>>(key, c);
  };
</script>

<script lang="ts" generics="T">
  import { getContext, setContext, type Snippet } from "svelte";

  interface Props {
    selectValue?: T,
    children: Snippet
  }

  let { selectValue = $bindable(undefined), children }: Props = $props();

  set({
    get target() { return selectValue; },
    set target(x) { selectValue = x; },
  });
</script>

<div>
  {@render children()}
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
  }
</style>
