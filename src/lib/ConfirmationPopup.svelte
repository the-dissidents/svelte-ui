<script lang="ts" module>
  export function showConfirmationPopup(element: Element, buttonText: string, opts?: {
    text?: string,
    type?: 'error' | 'info'
  }) {
    return new Promise<boolean>((resolve) => {
      const component = mount(ConfirmationPopup, {
        props: {
          element, buttonText,
          text: opts?.text,
          type: opts?.type ?? 'info',
          onSubmit: async (x: boolean) => {
            await unmount(component);
            resolve(x);
          }
        },
        target: document.body
      });
    });
  }
</script>

<script lang="ts">
  import ConfirmationPopup from "./ConfirmationPopup.svelte";
  import { mount, onMount, unmount } from "svelte";
  import Popup, { type TooltipPosition } from "./Popup.svelte";

  let { element, position = 'bottom', text, type, buttonText, onSubmit }: {
    element: Element,
    position?: TooltipPosition,
    text?: string,
    type: 'error' | 'info',
    buttonText: string,
    onSubmit: (ok: boolean) => void
  } = $props();

  let popup: Popup;

  onMount(() => {
    popup.open(element.getBoundingClientRect());
  });
</script>

<Popup bind:this={popup} {position}
  onclose={() => onSubmit(false)}
  class={{'confirmation-popup-error': type == 'error'}}
>
  {#if text}
    <div>{text}</div>
  {/if}
  <button onclick={() => {
    onSubmit(true);
  }}>{buttonText}</button>
</Popup>

<style lang='scss'>
  @use "./parameters.sass" as *;

  :global(.confirmation-popup-error.confirmation-popup-error) {
    @include colorvars(background-color, error-back);
  }
</style>
