# Gold Star Man - Icon & Asset Specifications

## Design System
- **Primary Gold:** `#fb9700` with gradient to `#d97706`
- **Background:** Warm off-white `#fafaf9` or light gray `#f5f5f4`
- **Style:** Soft, rounded, minimal, timeless
- **Philosophy:** Recognizable at all sizes, works in light and dark mode

---

## 1. App Icons (PWA & Mobile)

### icon-512.png (512x512 pixels)
**Purpose:** Main app icon, PWA install, high-resolution displays

**Design Description:**
- Centered five-point star with soft, rounded points
- Star uses gradient from `#fcd34d` (top) to `#fb9700` (middle) to `#d97706` (bottom)
- Subtle inner glow effect for depth
- Background: warm off-white `#fafaf9` with very subtle radial gradient
- Star sits in center, taking up ~70% of canvas
- Optional: very subtle circular backdrop behind star in lighter gold `#fef3c7` at 20% opacity
- Add soft drop shadow: 0px 4px 20px rgba(251, 151, 0, 0.15)
- Rounded square container (corner radius: 20% of size)

### icon-192.png (192x192 pixels)
**Purpose:** PWA manifest, Android home screen

**Design Description:**
- Same design as 512px but optimized for smaller size
- Slightly thicker star points for visibility
- Simplified glow (less layers)
- Same color scheme and proportions

### icon-180.png (180x180 pixels)
**Purpose:** Apple Touch Icon (iOS home screen)

**Design Description:**
- Identical to 192px version
- iOS will automatically add rounded corners
- Ensure star remains centered and visible

### icon-96.png (96x96 pixels)
**Purpose:** Android launcher icons, smaller displays

**Design Description:**
- Further simplified star design
- Bolder, more defined edges
- Remove subtle effects, keep gradient
- Star takes up 75% of canvas for maximum visibility

### icon-32.png (32x32 pixels)
**Purpose:** Browser tab favicon, taskbar

**Design Description:**
- Simplified five-point star
- Solid gold `#fb9700` (no gradient needed at this size)
- Background: `#fafaf9`
- Star is bold and clearly visible
- No additional effects or shadows

### icon-16.png (16x16 pixels)
**Purpose:** Favicon, smallest size

**Design Description:**
- Maximum simplification
- Solid gold `#fb9700` star
- No background effects
- Star should be recognizable even as tiny pixel representation

---

## 2. Favicons

### favicon.ico (Multi-size: 16x16, 32x32, 48x48)
**Purpose:** Browser compatibility, older systems

**Design Description:**
- Contains all three sizes in one .ico file
- Each size follows specs above
- Simple, bold star at all sizes

### favicon.svg (Vector)
**Purpose:** Modern browsers, scalable favicon

**Design Description:**
```svg
- Vector star with rounded points
- Uses gradient definition
- Maintains proportions at any size
- Background rounded square
- Optimized for small rendering
```

---

## 3. Social Media & Preview Images

### og-image.png (1200x630 pixels)
**Purpose:** Open Graph image for social media sharing (Twitter, Facebook, LinkedIn)

**Design Description:**
- Horizontal layout
- Left side: Large gold star (same design as app icon) - 400x400px area
- Right side:
  - "Gold Star Man" in Inter font, 72px, bold, `#1c1917`
  - Tagline: "Turn Goals into Daily Wins" in Inter, 36px, regular, `#78716c`
- Background: Soft gradient from `#fffbeb` (left) to `#fef3c7` (right)
- Add subtle decorative small stars scattered in background at 10% opacity
- Maintain breathing space, premium minimal aesthetic

### og-image-square.png (1200x1200 pixels)
**Purpose:** Instagram, Pinterest, square social posts

**Design Description:**
- Centered layout
- Top 60%: Large gold star with glow
- Bottom 40%:
  - "Gold Star Man" centered, Inter bold, 64px
  - Tagline below, Inter regular, 32px
- Background: radial gradient from center `#fffbeb` to edges `#fef3c7`
- Same decorative stars as OG image

### twitter-card.png (800x418 pixels)
**Purpose:** Twitter summary card

**Design Description:**
- Similar to og-image.png but slightly smaller dimensions
- Same layout and proportions
- Optimized for Twitter's aspect ratio

---

## 4. Splash Screens (PWA)

### splash-2048.png (2048x2732 pixels)
**Purpose:** iPad Pro 12.9" splash screen

**Design Description:**
- Vertical layout
- Centered gold star (600x600px)
- Below star: "Gold Star Man" in Inter, 96px, bold
- Below text: Subtle tagline, 48px, regular
- Background: Soft vertical gradient `#fffbeb` to `#fef3c7`
- Minimal, elegant, breathing space

### splash-1668.png (1668x2388 pixels)
**Purpose:** iPad Pro 11" splash screen

**Design Description:**
- Same layout as 2048px, proportionally scaled
- Star: 500x500px
- Text: 80px bold
- Tagline: 40px regular

### splash-1536.png (1536x2048 pixels)
**Purpose:** iPad Air/Mini splash screen

**Design Description:**
- Same layout, scaled for iPad dimensions
- Star: 450x450px
- Text: 72px bold
- Tagline: 36px regular

### splash-1242.png (1242x2688 pixels)
**Purpose:** iPhone Pro Max splash screen

**Design Description:**
- Vertical layout for phone
- Star: 400x400px
- Text: 64px bold
- Tagline: 32px regular

### splash-1125.png (1125x2436 pixels)
**Purpose:** iPhone X/XS/11 Pro splash screen

**Design Description:**
- Same as 1242px, slightly smaller proportions

### splash-828.png (828x1792 pixels)
**Purpose:** iPhone XR/11 splash screen

**Design Description:**
- Smaller phone dimensions
- Star: 350x350px
- Text: 56px bold
- Tagline: 28px regular

### splash-750.png (750x1334 pixels)
**Purpose:** iPhone 8/7/6s splash screen

**Design Description:**
- Star: 300x300px
- Text: 48px bold
- Tagline: 24px regular

### splash-640.png (640x1136 pixels)
**Purpose:** iPhone SE (1st gen) splash screen

**Design Description:**
- Star: 280x280px
- Text: 44px bold
- Tagline: 22px regular

---

## 5. Additional Assets

### badge-achievement.svg (200x200 pixels)
**Purpose:** Achievement badges in future features

**Design Description:**
- Circular badge with gold rim
- Star in center with ribbon/banner below
- Gradient gold with shine effect
- Can be colored/styled for different achievement levels

### star-half.svg (Vector)
**Purpose:** Half-star rating display (for partial completions)

**Design Description:**
- Left half: filled gold gradient
- Right half: outline only in `#d4d4d8`
- Maintains same rounded point style

### star-outline.svg (Vector)
**Purpose:** Empty state, pending cards

**Design Description:**
- Outline-only star
- Stroke: 2px, `#d4d4d8`
- Same proportions as filled star
- Subtle, minimal

### celebration-stars.svg (Set of 3-5 stars)
**Purpose:** Celebration animations, confetti effect

**Design Description:**
- Various sizes (small, medium, large)
- Rotated at different angles
- All use gold gradient
- For animating when goals completed

### empty-state-illustration.svg (400x300 pixels)
**Purpose:** No goals/cards empty state

**Design Description:**
- Large subtle star in background (outline, very light)
- Gentle, encouraging visual
- Minimalist line art style
- Colors: light grays `#f5f5f4` with hint of gold

---

## 6. Loading States

### spinner-star.svg (64x64 pixels)
**Purpose:** Loading spinner animation

**Design Description:**
- Simple star shape
- Designed to rotate smoothly
- Gold gradient
- Optimized for CSS animation
- Clean, minimal

---

## Implementation Checklist

### Priority 1 (Essential)
- [ ] icon-512.png
- [ ] icon-192.png
- [ ] icon-180.png
- [ ] favicon.ico
- [ ] favicon.svg
- [ ] og-image.png

### Priority 2 (Recommended)
- [ ] icon-96.png
- [ ] icon-32.png
- [ ] icon-16.png
- [ ] og-image-square.png
- [ ] twitter-card.png

### Priority 3 (PWA Enhancement)
- [ ] All splash screens (8 sizes)
- [ ] badge-achievement.svg
- [ ] star-half.svg
- [ ] star-outline.svg

### Priority 4 (Polish)
- [ ] celebration-stars.svg
- [ ] empty-state-illustration.svg
- [ ] spinner-star.svg

---

## Color Reference

```css
/* Gold Palette */
--gold-primary: #fb9700;
--gold-light: #fcd34d;
--gold-dark: #d97706;
--gold-darker: #b45309;

/* Backgrounds */
--bg-warm-white: #fafaf9;
--bg-light-gray: #f5f5f4;
--bg-gold-tint: #fffbeb;
--bg-gold-light: #fef3c7;

/* Text */
--text-dark: #1c1917;
--text-medium: #78716c;
--text-light: #d4d4d8;
```

---

## Export Settings

**All PNG files:**
- Format: PNG-24 with transparency
- Color profile: sRGB
- Compression: Optimized for web

**All SVG files:**
- Optimized and minified
- No unnecessary metadata
- Viewbox properly set
- Clean, readable code

**ICO file:**
- Multi-resolution
- 32-bit color depth
- Includes 16x16, 32x32, 48x48

---

## Notes for Designer

1. **Consistency is key** - All icons should feel like part of the same family
2. **Test at actual size** - Ensure readability at smallest sizes
3. **Dark mode consideration** - While we use light backgrounds, ensure star is visible on both light and dark
4. **Simplify progressively** - Smaller sizes should be simpler, not just scaled down
5. **Maintain brand** - Gold `#fb9700` should be instantly recognizable
6. **Premium feel** - Soft shadows, subtle gradients, breathing space
7. **Avoid clutter** - When in doubt, remove details rather than add

---

## File Structure
```
public/
├── icons/
│   ├── icon-512.png
│   ├── icon-192.png
│   ├── icon-180.png
│   ├── icon-96.png
│   ├── icon-32.png
│   └── icon-16.png
├── favicon.ico
├── favicon.svg
├── og-image.png
├── og-image-square.png
├── twitter-card.png
├── splash/
│   ├── splash-2048.png
│   ├── splash-1668.png
│   ├── splash-1536.png
│   ├── splash-1242.png
│   ├── splash-1125.png
│   ├── splash-828.png
│   ├── splash-750.png
│   └── splash-640.png
└── assets/
    ├── badge-achievement.svg
    ├── star-half.svg
    ├── star-outline.svg
    ├── celebration-stars.svg
    ├── empty-state-illustration.svg
    └── spinner-star.svg
```
