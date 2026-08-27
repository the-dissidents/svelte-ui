<script lang="ts" module>
  interface ButtonStripContext<T> {
    target?: T,
    readonly disabled: boolean;
    readonly container?: HTMLElement
  }

  const key = Symbol('ButtonStrip');

  export function getButtonStripContext<T>() {
    return getContext<ButtonStripContext<T>>(key);
  };

  function set<T>(c: ButtonStripContext<T>) {
    setContext<ButtonStripContext<T>>(key, c);
  };

  export function childPosition(
    el?: Element, container?: HTMLElement
  ): "first" | "last" | "neither" {
    if (!el || !container) {
      return 'neither';
    }

    const items = [...container.querySelectorAll("[data-strip-item]")];
    const item = el.closest("[data-strip-item]");
    if (!item || !container.contains(item)) return "neither";

    if (items[0] === item) return "first";
    if (items.at(-1) === item) return "last";
    return "neither";
  }
</script>

<script lang="ts" generics="T">
  import { Debug } from "$lib/Debug.js";

  import { getContext, setContext, type Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  interface Props {
    selectValue?: T,
    disabled?: boolean,
    onValueChanged?: (x: T) => void,
    children: Snippet
  }

  let {
    selectValue = $bindable(undefined), disabled, children, onValueChanged, ...rest
  }: Props & SvelteHTMLElements['ul'] = $props();

  let element = $state<HTMLElement>();

  set({
    get target() { return selectValue; },
    set target(x) {
      Debug.assert(x !== undefined);
      selectValue = x;
      onValueChanged?.(x);
    },
    get container() { return element; },
    get disabled() { return disabled ?? false },
  });
</script>

<ul bind:this={element} {...rest}>
  {@render children()}
</ul>

<style lang="scss">
  @use '../parameters.sass' as *;

  ul {
    list-style: none;
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;

    background-color: transparent;
    border-radius: v(border-radius-large);

    @include light() {
      box-shadow: ve(0 1px 3px, shadow-light);
    }
    @include dark() {
      box-shadow: ve(0 1px 3px, shadow-dark);
    }

    :global [data-strip-item] {
      flex-grow: 1;
      border-radius: 0;
      margin: 0;

      box-shadow: none;

      border-left: 0.25px solid;
      border-right: 0.25px solid;
      @include colors(border-color, #8884, #bbb4);

      &.first {
        border-radius: v(border-radius-large) 0 0 v(border-radius-large);
        margin-right: 0;
        border-left: none;
      }
      &.last {
        border-radius: 0 v(border-radius-large) v(border-radius-large) 0;
        margin-left: 0;
        border-right: none;
      }
    }
  }
</style>
