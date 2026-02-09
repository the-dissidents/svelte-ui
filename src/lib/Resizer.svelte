<script lang="ts">
interface Props {
  first: HTMLElement;
  second?: HTMLElement | null;
  vertical?: boolean;
  reverse?: boolean;
  minValue?: number;
}

let {
  first = $bindable(),
  second = $bindable(null),
  vertical = false,
  reverse = false,
  minValue = 10,
}: Props = $props();
let cx = $state(0), cy = $state(0), orig = $state(0), orig2 = $state(0);

function ondrag(ev: MouseEvent) {
  let f = reverse ? -1 : 1;
  if (vertical) {
    let val = Math.max(orig + (ev.clientX - cx) * f, minValue);
    if (second) second.style.width = (orig2 + val - orig) + 'px';
    first.style.width = val + 'px';
  } else {
    let val = Math.max(orig + (ev.clientY - cy) * f, minValue);
    if (second) second.style.height = (orig2 + val - orig) + 'px';
    first.style.height = val + 'px';
  }
}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={vertical ? 'resizerV' : 'resizerH'}
  style='cursor: {vertical ? 'ew-resize' : 'ns-resize'}'
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
    }, {once: true});
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

.resizerH {
  height: 6px;
  width: 100%;
  padding: 4px 0;
  user-select: none; -webkit-user-select: none;
  -moz-user-select: none; -ms-user-select: none;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.resizerH .inside {
  width: 100%;
  height: 1px;
}

.resizerH:hover .inside {
  height: 3px;
}

.resizerV {
  height: 100%;
  width: 6px;
  padding: 0 4px;
  user-select: none; -webkit-user-select: none;
  -moz-user-select: none; -ms-user-select: none;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.resizerV .inside {
  height: 100%;
  width: 1px;
}

.resizerV:hover .inside {
  width: 3px;
}
</style>
