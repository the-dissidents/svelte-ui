<script lang="ts">
  import type { ChangeEventHandler, HTMLInputAttributes } from "svelte/elements";

  interface Props extends HTMLInputAttributes {
    value: Date,
    width?: string,
    onchange?: ChangeEventHandler<HTMLInputElement>
  };

  let { value = $bindable(), width, onchange, ...rest }: Props = $props();
  let input = $state<HTMLInputElement>();

  $effect(() => {
    void value;
    if (input) input.valueAsDate = value;
  });
</script>

<input type="date" bind:this={input}
  style={width ? `width: ${width};` : ''}
  onchange={(ev) => {
    if (ev.currentTarget.validity.valid && ev.currentTarget.valueAsDate) {
      value = ev.currentTarget.valueAsDate;
      onchange?.(ev);
    }
  }} {...rest}/>

<style lang='scss'>
  @use "./parameters.sass" as *;

  input[type=date] {
    font-family: v(mono-font-family);
  }
</style>
