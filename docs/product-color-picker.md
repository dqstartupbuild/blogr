# Product Color Picker

## Overview

The Product details form in Settings shows a small color box beside every saved brand color. Users can click the box to open their browser's color chooser or type a hex code directly. Both controls update the same product color value and are saved with the rest of the product details.

## How It Works

`ProductColorEditor` manages the list of brand colors. It lets users add and remove colors and renders one `ProductColorField` for each value.

`ProductColorField` pairs a native color input with the existing text-entry experience. Choosing a shade writes a standard six-digit hex value such as `#2f6fed`. Typing remains available for quick edits and pasted values.

`getColorPickerValue` gives the visual picker a valid color while the user is typing. It supports three-digit and six-digit hex values, with or without a leading `#`. An incomplete value stays unchanged in the text field and uses black only as the picker's temporary fallback.

## Use Cases

- See every product color without having to read its hex code.
- Click a color box to choose a different shade.
- Type or paste an exact hex code.
- Add another brand color or remove one that is no longer used.

## Relevant Code

- `src/features/workspace/components/ProductColorEditor.tsx`
- `src/features/workspace/components/ProductColorField.tsx`
- `src/features/workspace/components/ProductDetailsPanel.tsx`
- `src/features/workspace/utils/getColorPickerValue.ts`

## File Tree

```text
src/features/workspace/
├── components/
│   ├── ProductColorEditor.tsx
│   ├── ProductColorField.tsx
│   └── ProductDetailsPanel.tsx
└── utils/
    └── getColorPickerValue.ts
```
