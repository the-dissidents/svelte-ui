<script lang="ts">
  import * as Color from "colorjs.io/fn";
  Color.ColorSpace.register(Color.sRGB);
  Color.ColorSpace.register(Color.HSL);
  Color.ColorSpace.register(Color.OKLCH);

  import "../styles/main.scss";
  import "../styles/utility.scss";

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

  let value = $state(1.23);
  let tooltipPos: TooltipPosition = $state('bottom');

  let list = $state([
    {text: '123'},
    {text: 'abc'},
    {text: '543t635'},
    {text: 'aeewwwbc'},
    {text: 'abdfcc'},
    {text: '12112223'},
    {text: 'ab33333c'},
    {text: '543tpppp35'},
    {text: 'aeewaazzzwwbc'},
    {text: 'abdfxxxxcc'},
  ]);

  let leftPane = $state<HTMLElement>();
  let topPane = $state<HTMLElement>();

  let errorBanner = $state(false);
  let infoBanner = $state(false);
</script>

<style lang="scss">
  article {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  main {
    width: 800px;
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
    <div class="hlayout" style="height: 600px;" bind:this={topPane}>
      <div bind:this={leftPane} style="width: 300px;">
        <TabView>
          <TabPage id="1">
            {#snippet header()}
              Common (value={value})
            {/snippet}

            Enter a number: <NumberInput bind:value step="0.01"/>

            <br>

            <Collapsible header="Styled native controls" active={true}>
              <div class="hlayout" style="gap: 1em;">
                <div class="vlayout">
                  <label>
                    <input type='checkbox'>
                    Ketchup
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
                </div>
              </div>

              <h5>Textarea</h5>
              <textarea>content...</textarea>

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
          </TabPage>
        </TabView>
      </div>
      <Resizer control={leftPane} vertical={true}/>
      <div class="vlayout flexgrow">
        <p>
          You can reorder this list
        </p>
        <OrderableList bind:list={list}>
          {#snippet row(item)}
            <input type="text" bind:value={item.text} style="width: 100%" />
          {/snippet}
        </OrderableList>
      </div>
    </div>
    <Resizer control={topPane}/>
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
