<script lang="ts">
  import * as Color from "colorjs.io/fn";
  Color.ColorSpace.register(Color.sRGB);
  Color.ColorSpace.register(Color.HSL);
  Color.ColorSpace.register(Color.OKLCH);

  import "../lib/utility.scss";

  import Collapsible from "$lib/Collapsible.svelte";
  import NumberInput from "$lib/NumberInput.svelte";
  import Tooltip, { type TooltipPosition } from "$lib/Tooltip.svelte";
  import OrderableList from "$lib/OrderableList.svelte";
  import TabView from "$lib/TabView.svelte";
  import TabPage from "$lib/TabPage.svelte";
  import Colorpicker from "$lib/Colorpicker.svelte";
  import Resizer from "$lib/Resizer.svelte";
  import Banner from "$lib/Banner.svelte";
  import { overlayMenu } from "$lib/OverlayMenu.svelte";
  import ListView from "$lib/ListView.svelte";

  let value = $state(1.23);
  let tooltipPos: TooltipPosition = $state('bottom');

  function randomString(len = 15) {
    let cps: number[] = [];
    for (let i = 0; i < len; i++)
      cps.push(Math.floor(Math.random() * (122 - 65)) + 65);
    return String.fromCharCode(...cps);
  }

  let list2 = $state<{
      a: number;
      b: string;
      c: boolean;
  }[]>([]);
  for (let i = 0; i < 50; i++)
    list2.push({
      a: Math.round(Math.random() * 1000),
      b: randomString(),
      c: Math.random() > 0.3
    });

  let list = $state<{text: string}[]>([]);
  for (let i = 0; i < 10; i++)
    list.push({text: randomString(Math.random() * 10 + 5)});

  let leftPane = $state<HTMLElement>();
  let topPane = $state<HTMLElement>();

  let errorBanner = $state(false);
  let infoBanner = $state(false);
</script>

<style lang="scss" global>
  @use '../lib/main.sass' as *;
  @include configure();

  article {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  main {
    width: 800px;
  }
  label {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
  }
  hr {
    margin-block: 5px;
  }
</style>

<Banner style='error' bind:open={errorBanner}
  text="this is an error banner without buttons"/>

<Banner style='normal' bind:open={infoBanner}
  text="this is a normal banner with 3 buttons"
  buttons={[
    { name: '1', localizedName: () => 'Button A' },
    { name: '2', localizedName: () => 'Button B' },
    { name: '2', localizedName: () => 'Button C' }
  ]}/>

<article>
<main>
  <h1>Svelte UI test page by <code>@the-dissidents</code></h1>

  <div class="vlayout">
    <div class="hlayout" style="height: 500px;" bind:this={topPane}>
      <div bind:this={leftPane} style="width: 300px;">
        <TabView>
          <TabPage id="1">
            {#snippet header()}
              Common (value={value})
            {/snippet}

            <label>
              Enter a number:
              <NumberInput bind:value step="0.01"/>
            </label>

            <Collapsible header="Styled native controls" active={true}>
              <button>button</button>
              <button disabled>disabled button</button>
              <br>
              <select value="disabled select" disabled>
                <option>disabled select</option>
                <option>second</option>
                <option>third</option>
              </select>
              <select value="second">
                <option>first</option>
                <option>second</option>
                <option>third</option>
              </select>
              <label>
                Slider:
                <input type='range' min="0" max="100" value="5" />
              </label>

              <hr>

              <div class="hlayout" style="gap: 0 1em;">
                <div class="vlayout">
                  <label>
                    <input type='checkbox'>
                    Ketchup
                  </label>
                  <label>
                    <input type='checkbox' disabled>
                    Yoghurt
                  </label>
                  <label>
                    <input type='checkbox'>
                    Mayonnaise
                  </label>
                </div>
                <div class="vlayout">
                  <label>
                    <input type='radio' name='1'>
                    Email
                  </label>
                  <label>
                    <input type='radio' name='1'>
                    Phone
                  </label>
                  <label>
                    <input type='radio' name='1'>
                    Mail
                  </label>
                  <label>
                    <input type='radio' name='1' disabled>
                    Telepathy
                  </label>
                </div>
              </div>

              <h5>Text inputs</h5>
              <label>
                text:
                <input type="text" placeholder="placeholder">
              </label>
              <label>
                disabled text:
                <input type="text" placeholder="placeholder" disabled>
              </label>
              <textarea>textarea...</textarea>
              <textarea disabled>disabled textarea...</textarea>

              <h5>Button-style checkboxes</h5>
              <label>
                <input type='checkbox' class="button">
                aka Toggle Button
              </label>
              <br>
              <label class="left">
                <input type='checkbox' class="button">
                Bold
              </label><label class="middle">
                <input type='checkbox' class="button">
                Italic
              </label><label class="middle">
                <input type='checkbox' class="button" disabled>
                Disabled
              </label><label class="right">
                <input type='checkbox' class="button">
                Underline
              </label>
            </Collapsible>


          </TabPage>

          <TabPage id="2">
            {#snippet header()}
              Advanced
            {/snippet}

            <h5>Colorpicker</h5>
            <Colorpicker color={Color.getColor('pink')}/>

            <button onclick={() => {
              overlayMenu([
                { text: 'first item' },
                { text: 'second item' },
                { text: 'third item' },
              ], {
                title: 'overlay menu title',
                text: 'Choose one of the items',
                emptyText: '(no items)'
              });
            }}>
              show overlay menu
            </button>

            <select bind:value={tooltipPos}>
              <option value="top">top</option>
              <option value="left">left</option>
              <option value="right">right</option>
              <option value="bottom">bottom</option>
            </select>

            <Tooltip position={tooltipPos} text="content of tooltip">
              <button>tooltip</button>
            </Tooltip>

            <h5>Listbox</h5>
            <ol role="listbox" style="max-height: 250px;">
              <li>item 1</li>
              <li>item 2</li>
              <li>item 3</li>
              <li>another item</li>
              <li>item 5</li>
              <li>item 6</li>
              <li>item 7</li>
              <li>another item</li>
              <li>item 9</li>
              <li>item 10</li>
              <li>item 11</li>
              <li>another item</li>
              <li>item 1</li>
              <li>item 2</li>
              <li>item 3</li>
              <li>another item</li>
              <li>item 5</li>
              <li>item 6</li>
              <li>item 7</li>
              <li>another item</li>
              <li>item 9</li>
              <li>item 10</li>
              <li>item 11</li>
              <li>another item</li>
            </ol>
          </TabPage>
        </TabView>
      </div>
      <Resizer first={leftPane} vertical={true}/>
      <div class="flexgrow" style="overflow-y: scroll;">
        <h5>ListView</h5>
        <ListView style="max-height: 300px"
          columns={[
            ['a', { header: 'number', align: 'end', width: 'max-content' }],
            ['b', { header: 'string' }],
            ['c', { header: 'boolean' }],
            ['d', { header: 'button' }]
          ]}
          items={list2}
        >
          {#snippet a(item)}
            {item.a}
          {/snippet}
          {#snippet b(item)}
            {item.b}
          {/snippet}
          {#snippet c(item)}
            {item.c ? '✅' : '❌'}
          {/snippet}
          {#snippet d()}
            <button>hi</button>
          {/snippet}
        </ListView>
        <h5>You can reorder this list</h5>
        <OrderableList bind:list={list}>
          {#snippet row(item)}
            <input type="text" bind:value={item.text}
              style="width: 100%; height: 1lh;" />
          {/snippet}
        </OrderableList>
      </div>
    </div>
    <Resizer first={topPane}/>
    <div>
      <button onclick={() => errorBanner = true}>
        show error banner
      </button>
      <button onclick={() => infoBanner = true}>
        show info banner
      </button>
    </div>
  </div>
</main>

</article>
