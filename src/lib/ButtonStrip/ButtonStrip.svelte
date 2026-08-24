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
  import { Debug } from "$lib/Debug.js";

  import { getContext, setContext, type Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  interface Props {
    selectValue?: T,
    onValueChanged?: (x: T) => void,
    children: Snippet
  }

  let {
    selectValue = $bindable(undefined), children, onValueChanged, ...rest
  }: Props & SvelteHTMLElements['ul'] = $props();

  set({
    get target() { return selectValue; },
    set target(x) {
      Debug.assert(x !== undefined);
      selectValue = x;
      onValueChanged?.(x);
    },
  });
</script>

<ul {...rest}>
  {@render children()}
</ul>

<style>
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
  }
</style>
