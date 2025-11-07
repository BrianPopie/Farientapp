# Spacing Best Practices

This guide defines how we handle spacing across the frontend so layouts stay consistent and predictable. Treat it as the default playbook unless a specific design spec says otherwise.

## 1. Baseline: container-first

- Page layouts rely on the parent container for outer padding (e.g., page wrappers, section shells). Individual feature cards should not reintroduce outer padding unless the design calls for it.
- When a component needs to align flush with its siblings, set the Card root to `py-0` (or `px-0`) and manage spacing inside the card instead.

## 2. Use gaps, not margin stacks

- Prefer `flex`/`grid` + `gap-*` utilities for vertical/horizontal spacing between siblings.
- Avoid stacking `mt-*`/`mb-*` for structural spacing. Margins are reserved for one-off micro-adjustments (e.g., aligning an icon next to text).

## 3. Card conventions (shadcn/ui)

- `Card` root ships with `py-6` by default. Override with `className="py-0"` when the surrounding container already controls outer padding.
- Keep padding on `CardContent`. Standard defaults are `p-4` or `px-6`; adjust inside content using flex/grid + gap rather than stacking nested padding/margin.
- If a card contains a sub-surface (e.g., dashed dropzone border), apply padding directly to that sub-surface (`px-8 py-8`) and keep the surrounding wrapper `p-0`.

## 4. Lists, tables, and forms

- Inputs, selects, and search bars should sit inside a flex/grid container with gap to the adjacent elements—no manual `margin-left` or `margin-top`.
- Tables should live in a `div` with `overflow-x-auto` if needed, but avoid wrapping that container with extra padding. The card’s padding is enough.

## 5. Icons and buttons

- When showing lists (file preview rows, action rows), ensure icon buttons have a fixed footprint (`h-8 w-8` etc.) so columns align visually.
- Combine icon + text in buttons using `gap-*`, not manual padding.

## 6. Debug checklist

Before shipping a layout:

1. Inspect the DOM for stacked `mt-*`/`mb-*`—replace with parent gap when possible.
2. Check Cards: outer padding only when the component itself owns the spacing; otherwise set `py-0` and rely on content padding.
3. Ensure interactive areas (dropzones, upload lists) keep their inner padding, but the surrounding container remains flush.
4. Verify alignment of repeated elements (e.g., remove icons) by giving consistent width/height.

Following these rules keeps spacing predictable across the app and reduces one-off overrides.

