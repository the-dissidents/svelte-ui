<script lang="ts" module>
  import ProgressDialog from './ProgressDialog.svelte';
  type ProgressAction<T> = (report: (value: number, text?: string) => void) => Promise<T>;

  export function showProgress<T>(action: ProgressAction<T>, header: string = ''): Promise<T> {
    return new Promise<T>((resolve) => {
        const menu = mount(ProgressDialog<T>, {
            target: document.body,
            props: { header, action, async submit(result) {
                await unmount(menu);
                resolve(result);
            }, }
        });
    });
  }
</script>

<script lang="ts" generics="T">
  import { mount, onMount, unmount } from "svelte";
  import { Debug } from "./Debug.js";

  let { action, submit, header }: {
    action: ProgressAction<T>, submit: (result: T) => void, header: string
  } = $props();
  let dialog: HTMLDialogElement;

  let value: number = $state(0);
  let text: string | undefined = $state();

  onMount(async () => {
    Debug.assert(dialog !== undefined);
    dialog.showModal();
    const result = await action((v, t) => { value = v; text = t; });
    dialog.close();
    submit(result);
  });
</script>

<dialog bind:this={dialog}
  oncancel={(e) => e.preventDefault()}
  onkeydown={(e) => {
    // Chrome forces dialogs to close after ESC being hit twice; we need to manually disable this behavior here
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
    }
  }}
>
  {#if header}
  <h4>{header}</h4>
  {/if}

  <label>
    <progress {value} max="1"></progress>
    <span>{text}</span>
  </label>
</dialog>

<style lang="scss">
  @use 'uchu.scss';
  @use 'dialog.scss' as *;

  dialog {
    width: 30vw;
  }

  progress {
    width: 100%;
  }

  label {
    display: flex;
    flex-direction: column;
  }
  span {
    margin-block: 0.5em;
    display: block;
    text-align: right;
  }
</style>
