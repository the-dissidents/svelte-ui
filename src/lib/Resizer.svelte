<script lang="ts">
interface Props {
  first: HTMLElement;
  second?: HTMLElement | null;
  vertical?: boolean;
  reverse?: boolean;
  useViewportFraction?: boolean;
  minValue?: number;

  value?: string;
}

let {
  first,
  second = null,
  vertical = false,
  reverse = false,
  useViewportFraction = false,
  minValue = 10,
  value = $bindable(undefined)
}: Props = $props();

let cx = $state(0), cy = $state(0), orig = $state(0), orig2 = $state(0);

$effect(() => {
  if (!value || !first) return;
  if (vertical)
    first.style.width = value;
  else
    first.style.height = value;
});

function length(px: number) {
  const v = vertical ? window.innerWidth : window.innerHeight;
  return useViewportFraction ? `${px / v * 100}${vertical ? 'vw' : 'vh'}` : `${px}px`;
}

function ondrag(ev: MouseEvent) {
  let f = reverse ? -1 : 1;
  if (vertical) {
    let val = Math.max(orig + (ev.clientX - cx) * f, minValue);
    if (second) second.style.width = length(orig2 - val + orig);
    value = length(val);
    // first.style.width = value;
  } else {
    let val = Math.max(orig + (ev.clientY - cy) * f, minValue);
    if (second) second.style.height = length(orig2 - val + orig);
    value = length(val);
    // first.style.height = length(val);
  }
}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={vertical ? 'resizerV' : 'resizerH'}
  onmousedown={(ev) => {
	  cx = ev.clientX;
    cy = ev.clientY;
    orig = vertical ? first.offsetWidth : first.offsetHeight;
    if (second) {
      orig2 = vertical ? second.offsetWidth : second.offsetHeight;
    }
    document.addEventListener('mousemove', ondrag);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', ondrag);
    }, { once: true });
  }}>
<div class='inside'></div>
</div>

<style lang="scss">
@use 'parameters.sass' as *;
@use 'uchu.scss';

@media (prefers-color-scheme: light) {
  .inside {
    background-color: v(separator-light);
  }
  :hover .inside {
    background-color: v(accent1-border-light);
  }
}

@media (prefers-color-scheme: dark) {
  .inside {
    background-color: v(separator-dark);
  }
  :hover .inside {
    background-color: v(accent1-border-dark);
  }
}

div {
  user-select: none; -webkit-user-select: none;
  -moz-user-select: none; -ms-user-select: none;

  display: flex;
  align-items: center;
}

.resizerH {
  height: 6px;
  width: 100%;
  padding: 4px 0;
  flex-direction: row;
  cursor: row-resize;

  & .inside {
    width: 100%;
    height: 1px;
    cursor: row-resize;
  }

  &:hover .inside {
    height: 3px;
  }
}

.resizerV {
  height: 100%;
  width: 6px;
  padding: 0 4px;
  flex-direction: column;
  cursor: col-resize;

  & .inside {
    height: 100%;
    width: 1px;
    cursor: col-resize;
  }

  &:hover .inside {
    width: 3px;
  }
}
</style>
