<script lang="ts" module>
  export const scrollShadows: Attachment = (node: Element) => {
    const parent = node.parentElement;
    if (!parent || !parent.classList.contains('scroll-shadows-wrapper'))
      throw new SyntaxError('Elements with {@attach scrollShadows} should be inside a <ScrollShadows> component');

    const update = () => {
      parent.toggleAttribute('data-scroll-top', node.scrollTop > 0);
      parent.toggleAttribute(
        'data-scroll-bottom',
        node.scrollTop + node.clientHeight < node.scrollHeight - 1
      );
    };

    node.addEventListener('scroll', update, { passive: true });

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(node);

    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(node, {
      childList: true,
      subtree: true,
      characterData: true
    });

    update();

    return () => {
      node.removeEventListener('scroll', update);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Attachment } from "svelte/attachments";
	import type { SvelteHTMLElements } from 'svelte/elements';

  interface Props {
    children: Snippet
  };

  const { children, ...rest }: Props & SvelteHTMLElements['div'] = $props();
</script>

<div class="scroll-shadows-wrapper" {...rest}>
  {@render children()}

	<!-- {#if canScrollTop}
		<div class="shadow shadow-top" aria-hidden="true"></div>
	{/if}

	{#if canScrollBottom}
		<div class="shadow shadow-bottom" aria-hidden="true"></div>
	{/if} -->
</div>

<style lang="scss">
	.scroll-shadows-wrapper {
		position: relative;
		overflow: hidden;

    &::before, &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 16px;
      z-index: 1;
      pointer-events: none;
      opacity: 0;
      transition: opacity 300ms;
    }
	}

  [data-scroll-top]::before {
    opacity: 1;
    top: 0;
    background: linear-gradient(to bottom, rgb(0 0 0 / 15%), transparent);
  }

  [data-scroll-bottom]::after {
    bottom: 0;
    opacity: 1;
    background: linear-gradient(to top, rgb(0 0 0 / 15%), transparent);
  }
</style>
