# Navigation Icon Specifications

Generate clean, minimal SVG icons for the bottom navigation that match Gold Star Man's premium design system.

## Design Philosophy
- **Style**: Outline/stroke-based icons (not filled)
- **Weight**: 2-2.5px stroke width for clarity
- **Aesthetic**: Soft, clean, modern, minimalist
- **Color**: Inherit currentColor for dynamic theming
- **Size**: 24x24px base viewBox, scalable
- **Corners**: Rounded stroke caps and joins for softer feel

## Color System
Icons should use `stroke="currentColor"` so they can be dynamically colored:
- **Inactive state**: Stone-500 (`#78716c`)
- **Active state**: Amber-600 (`#d97706`)
- **Hover**: Stone-700 (`#44403c`)

---

## Icon 1: Today (Gold Star)
**Status**: ✓ Already implemented as custom SVG component
**Filename**: `GoldStar.tsx` (existing)
**Description**: Custom gradient gold star icon
**Usage**: Special animated star for Today tab

---

## Icon 2: Calendar
**Filename**: `calendar-icon.svg`
**Concept**: Clean calendar/date icon

### Visual Description
A minimalist calendar icon with:
- Rectangular calendar frame with rounded corners
- Top binding/header bar suggesting calendar rings
- Grid pattern or single date number inside
- 2-2.5px stroke width
- Soft, approachable feel

### Generation Prompt
```
Create a minimal, outline-style calendar icon for a premium goal tracking app:
- 24x24px viewBox
- 2.5px stroke weight
- No fill, outline only
- Rectangular calendar shape with rounded corners (corner radius: 3px)
- Two small vertical lines at top representing binding rings
- Horizontal line separating header from body
- 3x3 dot grid inside calendar body OR single centered number
- Rounded stroke caps and line joins
- Modern, clean, soft aesthetic
- Style similar to Lucide icons or Feather icons
- SVG format with stroke="currentColor"
```

**SVG Template**:
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <!-- Calendar frame -->
  <rect x="3" y="4" width="18" height="18" rx="3" ry="3"/>
  <!-- Top binding line -->
  <line x1="3" y1="10" x2="21" y2="10"/>
  <!-- Binding rings -->
  <line x1="8" y1="2" x2="8" y2="6"/>
  <line x1="16" y1="2" x2="16" y2="6"/>
</svg>
```

---

## Icon 3: Goals (Target/Bullseye)
**Filename**: `goals-icon.svg`
**Concept**: Target/bullseye representing goals and achievement

### Visual Description
A concentric circle target icon:
- 3 concentric circles (large, medium, small)
- Center dot or filled circle
- Clean, balanced spacing
- Represents focus and precision

### Generation Prompt
```
Create a minimal target/bullseye icon for a premium goal tracking app:
- 24x24px viewBox
- 2.5px stroke weight
- Three concentric circles: outer (radius 10), middle (radius 6), inner (radius 2)
- Center filled dot OR smallest circle
- Perfect circles, centered alignment
- No fill on outer circles, outline only
- Rounded stroke caps
- Modern, clean aesthetic
- Style similar to Lucide icons
- SVG format with stroke="currentColor"
```

**SVG Template**:
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <!-- Outer circle -->
  <circle cx="12" cy="12" r="10"/>
  <!-- Middle circle -->
  <circle cx="12" cy="12" r="6"/>
  <!-- Inner circle -->
  <circle cx="12" cy="12" r="2"/>
</svg>
```

---

## Icon 4: Settings (Gear/Cog)
**Filename**: `settings-icon.svg`
**Concept**: Settings gear/cog icon

### Visual Description
A clean settings icon featuring:
- Central circle (gear center)
- 6-8 radiating lines/spokes suggesting gear teeth
- Minimal, not overly detailed
- Balanced, symmetrical design

### Generation Prompt
```
Create a minimal settings/gear icon for a premium goal tracking app:
- 24x24px viewBox
- 2.5px stroke weight
- Central circle (radius 3)
- 8 radiating spokes extending from center
- Spokes evenly distributed at 45-degree intervals
- Spokes extend from radius 3 to radius 10
- Clean, simple gear representation
- No complex teeth, just lines
- Rounded stroke caps
- Modern, minimalist aesthetic
- Style similar to Lucide icons
- SVG format with stroke="currentColor"
```

**SVG Template**:
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <!-- Center circle -->
  <circle cx="12" cy="12" r="3"/>
  <!-- Vertical spokes -->
  <path d="M12 1v6m0 6v6"/>
  <!-- Horizontal spokes -->
  <path d="M1 12h6m6 0h6"/>
  <!-- Diagonal spokes -->
  <path d="M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24"/>
  <path d="M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
</svg>
```

---

## Technical Specifications

### Required Attributes
```svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2.5"
stroke-linecap="round"
stroke-linejoin="round"
```

### Export Settings
- Format: SVG
- Optimization: Remove unnecessary metadata
- Decimal precision: 2 digits
- Viewbox: 24x24
- Preserve stroke attributes

### Implementation
Icons will be used in the `NavIcon.tsx` component:
```tsx
<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  {/* icon paths */}
</svg>
```

---

## Design Consistency Checklist
- [ ] All icons use 2-2.5px stroke weight
- [ ] All icons have rounded caps/joins
- [ ] All icons fit within 24x24px viewBox
- [ ] All icons use `currentColor` for dynamic theming
- [ ] Icons maintain visual weight balance
- [ ] Icons are recognizable at small sizes (24px-32px)
- [ ] Icons match the soft, premium aesthetic
- [ ] Icons align with Gold Star Man's warm, elegant design system

---

## Color Usage in App
```css
/* Inactive */
.text-stone-500 { color: #78716c; }

/* Active */
.text-amber-600 { color: #d97706; }
.dark .text-amber-400 { color: #fbbf24; }

/* Hover */
.text-stone-700 { color: #44403c; }
.dark .text-stone-300 { color: #d6d3d1; }
```

---

## Generation Tools Recommended
- **Figma** - Design and export clean SVGs
- **Sketch** - Vector design with SVG export
- **Illustrator** - Professional vector editing
- **IconJar** - Icon management
- **SVGOMG** - SVG optimization
- **Or use**: Lucide, Feather Icons, Heroicons as reference/starting point

---

## Notes
- Keep designs simple and recognizable
- Avoid overly complex paths
- Ensure icons scale well from 20px to 48px
- Test in both light and dark modes
- Match the soft, premium aesthetic of the app
- Icons should feel cohesive with existing GoldStar and BucketIcon components
