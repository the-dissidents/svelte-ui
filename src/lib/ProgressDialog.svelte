<script lang="ts" module>
  import ProgressDialog from './ProgressDialog.svelte';
  type ProgressAction = (report: (value: number, text?: string) => void) => Promise<void>;

  export function showProgress(action: ProgressAction, header: string = ''): Promise<void> {
    return new Promise<void>((resolve) => {
        const menu = mount(ProgressDialog, {
            target: document.body,
            props: { header, action, async submit() {
                await unmount(menu);
                resolve();
            }, }
        });
    });
  }
</script>

<script lang="ts">
  import { mount, onMount, unmount } from "svelte";
  import { Debug } from "./Debug.js";

  let { action, submit, header }: { action: ProgressAction, submit: () => void, header: string } = $props();
  let dialog: HTMLDialogElement;

  let value: number = $state(0);
  let text: string | undefined = $state();

  onMount(async () => {
    Debug.assert(dialog !== undefined);
    dialog.showModal();
    await action((v, t) => { value = v; text = t; });
    dialog.close();
    submit();
  });
</script>

<dialog bind:this={dialog}>
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
