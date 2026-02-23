# Svelte UI components by @the-dissidents

<img width="1168" height="716" alt="image" src="https://github.com/user-attachments/assets/aaabe42b-bc0f-42dd-8a60-ca72db9f2b18" />

## Features

All controls are consistently styled using a set of configurable SASS parameters.

Styled native controls:

- `<button>`
- `<input>` type=`text|number|checkbox|radio`
- `<textarea>`
- `<select>` (single-selection only)
- `<ol role=listbox>` (displays as a listbox)

Components:

- `<TabView>` and `<TabPage>`
- `<ListView>` (with configurable columns)
- `<OrderableList>` (each row has a grab handle)
- `<Colorpicker>` (uses the tree-shakable API of `colorjs.io`)
- `<Resizer>`
- `<Collapsible>`
- `<NumberInput>` (a wrapper on `<input type=number>`)
- `<Popup>` (generic base component)
- `<Tooltip>` (a specialized `<Popup>`)
- `<Banner>`
- An overlay menu with an imperative API: `await overlayMenu(...)`

## Usage

1. Install the library.

    ```sh
    pnpm add @the_dissidents/svelte-ui
    ```

2. Configure the main stylesheet. You must enable preprocessing of SASS/SCSS files, and you need to `@use` the main stylesheet in somewhere that has global scope (e.g. in a `<style lang='scss' global>` block or in a stylesheet `import`ed in your entrance point's JS/TS script):

    ```scss
    // The author cannot find a reliable method to resolve package paths in
    // SASS/SCSS except specifying the whole relative path to it in node_modules
    @use "../node_modules/@the_dissidents/svelte-ui/dist/main";

    // Uncomment this line to access the uchu palette which is used in the
    // default values:
    // @use "../node_modules/@the_dissidents/svelte-ui/dist/uchu";

    @include main.configure(
      // $ui-font-family:   system-ui,
      // $mono-font-family: monospace,
      // $input-font-size:  0.8rem,
      // $text-font-size:   0.85rem,

      // $page-background-light:   #fafafa,
      // $page-background-medium:  uchu.$yin-2,
      // $page-background-dark:    uchu.$yin-9,

      // $text-light:      uchu.$yin,
      // $text-dark:       uchu.$yang,
      // $h5-text-light:   uchu.$yin-6,
      // $h5-text-dark:    uchu.$yin-3,

      // $disabled-text-light:   uchu.$gray-9,
      // $disabled-text-dark:    uchu.$gray-9,
      // $disabled-back-light:   uchu.$gray-1,
      // $disabled-back-dark:    uchu.$yin-7,

      // $box-border-light:      uchu.$gray-4,
      // $box-border-dark:       uchu.$yin-8,
      // $box-back-light:        white,
      // $box-back-dark:         uchu.$yin-8,

      // $small-border-light:    uchu.$gray-4,
      // $small-border-dark:     uchu.$yin-7,

      // $button-back-light:     white,
      // $button-back-dark:      uchu.$yin-7,
      // $button-disabled-light: uchu.$gray-1,
      // $button-disabled-dark:  uchu.$yin-7,

      // $accent1-back-light:    uchu.$red-1,
      // $accent1-back-dark:     Teal,
      // $accent1-border-light:  uchu.$red-2,
      // $accent1-border-dark:   LightSeaGreen,

      // $accent2-back-light:    uchu.$pink-7,
      // $accent2-back-dark:     uchu.$blue-4,
      // $accent2-border-light:  uchu.$pink-8,
      // $accent2-border-dark:   uchu.$blue-8,

      // $slider-track-light:    uchu.$yin-1,
      // $slider-track-dark:     uchu.$yin-8,

      // $header-back-light:     uchu.$gray-1,
      // $header-back-dark:      uchu.$yin-8,
      // $header-border-light:   none,
      // $header-border-dark:    uchu.$yin-9,

      // $separator-light:       uchu.$gray-4,
      // $separator-dark:        uchu.$yin-7,
      // $separator-minor-light: uchu.$gray-2,
      // $separator-minor-dark:  uchu.$yin-7,

      // $shadow-light:  rgba(128, 128, 128, 0.5),
      // $shadow-dark:   rgba(128, 128, 128, 0.5),

      // $tab-accent-light: uchu.$blue-4,
      // $tab-accent-dark:  slategray,

      // $list-header-light:    uchu.$gray-1,
      // $list-header-dark:     uchu.$yin-8,
      // $list-border-light:    uchu.$gray-4,
      // $list-border-dark:     uchu.$yin-8,
      // $list-selection-light:  uchu.$red-1,
      // $list-selection-dark:  LightSeaGreen,

      // $border-radius-large: 3px,
      // $border-radius-small: 2px,
    );
    ```

    In the template above, commented lines contain default values for the parameters. Uncomment and modify to override.

    It is important to know that `@include`ing `main.configure` is mandatory to get the library working. You should include this call even if you don't override any of the parameters.

3. Now you can use the styled native controls and import the Svelte components as usual:

    ```typescript
    import { TabView, TabPage, Resizer } from '@the_dissidents/svelte-ui';
    ```
