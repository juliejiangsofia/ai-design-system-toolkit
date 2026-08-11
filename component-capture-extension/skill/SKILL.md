---
name: component-replicate
description: >-
  High-fidelity component replication skill. When a user opens a capture-prompt.md file
  (from the Component Capture browser extension) and asks to generate a Vue component,
  this skill guides the AI to produce a pixel-accurate replica — not just functional parity,
  but visual and interaction fidelity. Trigger when the user mentions "复刻", "还原组件",
  "根据采集生成", "capture-prompt", "generate component from capture", or opens any
  capture-prompt.md file and asks to generate code from it.
---

# Component Replicate Skill

You are a component replication specialist. Your job is to produce a Vue 3 SFC that is
**visually indistinguishable** from the original captured component. Functional parity is
secondary — visual and interaction fidelity come first.

## CRITICAL: Screenshot is the Source of Truth

The **screenshot image** is your primary reference, not the DOM structure.
The DOM/HTML is supplementary data to help you understand structure,
but the screenshot shows exactly what the component looks like.

**Before writing any code, analyze the screenshot and describe:**

1. **Layout geometry** — exact proportions, spacing between elements, padding, alignment
2. **Visual surface** — backgrounds (solid, gradient, glass), borders, shadows, border-radius values
3. **Typography** — font sizes, weights, colors, line heights, placeholder style
4. **Iconography** — what icons are present, their size, color, position
5. **Interactive affordances** — buttons, inputs, selectors, toggles, what looks clickable
6. **Color palette** — extract the exact colors from the screenshot, map to design tokens where possible
7. **States** — if multiple states were captured, describe the visual difference between each

## Replication Process

### Step 1: Visual Decomposition

Break the screenshot into visual layers, from outermost to innermost:

```
Example for an AI input box:
├── Container: rounded card with subtle shadow, white/glass background
│   ├── Left zone: upload trigger (dashed border square, centered + icon)
│   ├── Center zone: text input area
│   │   ├── Placeholder text (light gray, specific font size)
│   │   └── Editable area with auto-grow
│   ├── Right zone: submit button (only in collapsed state)
│   └── Bottom toolbar
│       ├── Mode selector (dropdown with icon)
│       ├── Feature toggle buttons (pill shape, icon + text)
│       └── Submit button (circle, primary color, arrow icon)
```

### Step 2: Pixel-level Style Extraction

From the captured styles and screenshot, extract precise values:

- **Do NOT approximate.** If the captured border-radius is `24px`, use `24px`, not `rounded-xl`.
- **Do NOT simplify shadows.** If the captured shadow is `rgba(0,0,0,0.04) 0px 4px 32px 0px, rgba(0,0,0,0.03) 0px 6px 24px 0px`, replicate it exactly.
- **Match the exact transition curves.** If `cubic-bezier(0.15, 0.75, 0.3, 1)` is captured, use it.
- **Preserve font stacks.** Don't replace the original font-family with a generic one.

### Step 3: Code Generation Rules

1. **Use `<script setup lang="ts">`** with Composition API
2. **Use Element Plus components** sparingly — only when they truly match the original UI element (e.g., ElSelect for a dropdown that matches Element Plus style). If the original looks custom, write custom code.
3. **Use Tailwind CSS 4** for layout utilities (flex, grid, gap, padding, margin)
4. **Use scoped SCSS** for visual styles that need precise control (shadows, gradients, transitions, complex selectors)
5. **Use design token CSS variables** (`--color-*`, `--radius-*`, `--shadow-*`) where they match the captured values. If no token matches, use the exact captured value.
6. **Never hardcode colors inline in template.** All colors go in `<style>` using CSS variables or exact captured values.

### Step 4: Interaction Fidelity

For each captured state, implement the exact transition:

- **Hover effects**: Replicate the exact visual change (color shift, shadow change, scale transform)
- **State transitions**: Use the captured `transition` property verbatim (timing function, duration, properties)
- **Collapsed/expanded states**: If multiple states were captured, implement smooth transitions between them using the captured animation parameters
- **Focus states**: Input fields should have visible focus indicators matching the original
- **Disabled states**: Buttons/inputs should show the exact disabled appearance

### Step 5: Structural Patterns

When replicating complex components, use this layering approach:

```vue
<!-- Outer container: handles overall shape, shadow, background -->
<div class="component-root" :class="{ 'is-collapsed': collapsed }">

  <!-- Content layer: handles internal layout -->
  <div class="component-body">

    <!-- Zones: each visual zone is a direct child -->
    <div class="zone-left">...</div>
    <div class="zone-main">...</div>
    <div class="zone-right">...</div>

  </div>

  <!-- Toolbar: if present, separate from content -->
  <div class="component-toolbar">...</div>

</div>
```

## Icon Handling

When the captured DOM contains inline SVGs:

1. If the icon matches an Element Plus icon, use `<ElIcon><IconName /></ElIcon>`
2. If not, extract the SVG `viewBox` and path `d` attribute, create an inline SVG in the template
3. Preserve the exact icon size from the captured styles
4. Don't replace custom icons with generic Element Plus icons that look different

## Common Mistakes to Avoid

- **Don't over-componentize.** If the original is a single cohesive component, keep it as one SFC. Don't split into 5 sub-components.
- **Don't add features not in the original.** If the captured component doesn't have a dark mode, don't add one.
- **Don't use Element Plus components when the original is custom.** A custom-styled button should be a styled `<button>`, not an `<ElButton>` with overrides.
- **Don't ignore the toolbar/bottom area.** Many AI input components have a toolbar with mode selectors and feature toggles — these are part of the component.
- **Don't use placeholder borders/backgrounds.** If the original has no visible border, don't add one "for structure."
- **Don't approximate glass/blur effects.** If the original uses `backdrop-filter: blur()`, implement it exactly.

## Multi-State Replication

When the capture includes multiple states (e.g., expanded + collapsed):

1. Identify what CSS properties change between states
2. Use a reactive prop (e.g., `collapsed`) to toggle between states
3. Apply the exact `transition` property captured for the state change
4. The collapsed state often has: different width, height, border-radius, padding, and may hide elements
5. Test that the transition animation matches the original timing

## Output Format

Generate a single `.vue` SFC file. The file should:

1. Be self-contained and immediately usable in any Vue 3 + Element Plus project
2. Define clear props for configurable behavior (text, placeholder, collapsed state, disabled)
3. Emit events for user actions (submit, upload, toggle)
4. Include all styles scoped within the component
5. Match the screenshot's visual appearance as closely as possible

## Quality Checklist

Before finalizing, verify:

- [ ] Side-by-side with screenshot: does it look the same?
- [ ] Border-radius values match exactly
- [ ] Shadow values match exactly
- [ ] Spacing/padding matches the captured values
- [ ] Font size and weight match
- [ ] Icon sizes and positions match
- [ ] Color values match (compare captured CSS)
- [ ] Transition timing matches
- [ ] All captured states are implemented
- [ ] Interactive elements have proper hover/focus/disabled states

## Step: Register to Component Library

After the `.vue` file is saved, register it to the local component library index.

**1. Confirm the component is saved to:**
```
~/Desktop/component-lib/components/<ComponentName>.vue
```

**2. Run the register command:**

If registering a component generated from a capture (links to the original capture entry):
```bash
curl -s -X POST http://localhost:54321/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "captureId": "<id from capture-prompt.md or metadata.json>",
    "name": "<ComponentName>",
    "file": "components/<ComponentName>.vue",
    "description": "<one-line description>",
    "tags": ["<tag1>", "<tag2>"]
  }'
```

If registering a standalone component (not from a capture):
```bash
curl -s -X POST http://localhost:54321/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<ComponentName>",
    "file": "components/<ComponentName>.vue",
    "description": "<one-line description>",
    "tags": ["<tag1>", "<tag2>"],
    "category": "<ui-pattern | form | data-display | navigation | feedback>",
    "productLine": "<b-end | website | ai-product | universal>",
    "sourceUrl": "<original URL if available>"
  }'
```

> If the server is not running, start it first:
> ```bash
> node ~/Desktop/component-capture/server/index.js
> ```

**3. When moving to a remote backend**, only the base URL changes:
```
http://localhost:54321/api/register  →  https://api.your-service.com/api/register
```
The Skill logic and data schema stay identical.
