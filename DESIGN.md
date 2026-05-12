---
name: Sacred Minimalism
colors:
  cream: '#FAF8F5'
  teal-dust: '#4A7C6F'
  charcoal: '#2D2D2D'
  border-warm: '#E8E3DC'
  white: '#FFFFFF'
typography:
  display-lg:
    fontFamily: Lora
    fontSize: 40px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Lora
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  headline-sm:
    fontFamily: Lora
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: DM Sans
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  label-sm:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  margin-page: 32px
  gutter-grid: 16px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
  section-gap: 64px
---

# IBADIFY — Design System

> **Status:** Extracted from Stitch MCP (Phase 2)
> **Aesthetic:** "Sacred Minimalism" — serene, contemplative, like a clean journal in morning light.

## Brand & Style

This design system is anchored in the concept of "Sacred Minimalism"—a visual philosophy that treats digital space as a sanctuary. The aesthetic is inspired by the tactile quality of a high-end morning journal and the stillness of a courtyard at dawn. 

The primary goal is to lower the user's cognitive load and heart rate. It achieves this through **generous whitespace**, a **restricted color palette**, and a **precise typographic hierarchy**. The style avoids the "gamification" clutter typical of habit trackers, opting instead for a contemplative environment that encourages reflection over-stimulation. Every element is intentional, utilizing hairline strokes and subtle depth to define boundaries without creating visual noise.

## Colors

The palette is rooted in organic, earthy tones that evoke a sense of permanence and calm. 

- **Primary Surface (Cream):** `#FAF8F5` - A warm cream that reduces screen glare and mimics the texture of unbleached paper.
- **Accent (Dusty Teal):** `#4A7C6F` - A muted, dusty teal used sparingly for primary actions, active states, and progress indicators.
- **Typography (Charcoal):** `#2D2D2D` - A soft charcoal rather than pure black, maintaining high legibility while softening the contrast against the cream background.
- **Borders/Dividers (Warm Border):** `#E8E3DC` - A hairline-thin warm grey that provides structure without breaking the visual flow of the page.

## Typography

The typography strategy pairs the intellectual, literary feel of a serif with the modern clarity of a geometric sans-serif.

- **Headings (Lora):** Used for titles and key reflections. The variable-stroke serif brings a human, editorial quality to the interface.
- **Body (DM Sans):** Chosen for its low contrast and high readability. It handles the functional aspects of habit tracking and data entry with quiet efficiency.
- **Hierarchy:** Importance is signaled through size and the switch between serif and sans-serif rather than aggressive weight changes. Small caps are used for metadata and labels to provide a distinct visual anchor without increasing font size.

## Layout & Spacing

The layout philosophy emphasizes "the breath between elements." 

- **Grid:** A fluid 4-column grid for mobile and a 12-column centered fixed grid for larger screens. 
- **Margins:** Unusually wide page margins (32px) are used to "squeeze" the content toward the center, creating a focused, vertical reading experience similar to a book.
- **Rhythm:** A strict 4px/8px baseline rhythm ensures vertical consistency. Section gaps are intentionally large (64px) to separate different spiritual practices or daily habits into distinct mental "rooms."

## Elevation & Depth

This design system avoids heavy shadows and traditional material stacking.

- **Low-Contrast Outlines:** Depth is primarily established through 1px hairline borders in `border-warm`. 
- **Subtle Shadows:** When elevation is required (e.g., for a floating action or a focused card), use a very soft, diffused shadow: `0px 4px 20px rgba(45, 45, 45, 0.04)`.
- **Flat Surface Tiering:** Use a secondary surface color (a slightly darker version of the cream) to distinguish between the background and a container, rather than raising the element with a shadow.

## Shapes

The shape language is "Soft," utilizing a 4px (0.25rem) base radius. 

This subtle rounding provides a gentle touch to the interface while maintaining the architectural integrity and precision of the minimalist aesthetic. It avoids the playfulness of "pill" shapes, opting instead for a refined, stationery-like appearance. Larger containers like cards may use `rounded-lg` (8px) for a slightly more cushioned feel.

## Components

### Buttons
- **Primary:** Solid `teal-dust` with white text. No gradients.
- **Secondary:** Transparent background with a `border-warm` hairline and `charcoal` text.
- **Shape:** Soft edges (4px) with generous horizontal padding (24px).

### Input Fields
- Underlined style or subtle hairline box. Focus states are indicated by a change in border color to `teal-dust` or a slightly thicker 1.5px line. Placeholder text uses a light version of `charcoal`.

### Habit Progress
- **Circular Rings:** Thin strokes (2px) using `teal-dust`. The "empty" track should be `border-warm`.
- **Checkboxes:** Simple 1px squares that fill with a teal checkmark upon completion.

### Cards & Lists
- Cards should not have shadows by default. Use a 1px border or a very subtle background tint.
- List items are separated by a full-bleed 1px hairline.

### Icons
- Use **Lucide-style icons** with a 1px or 1.5px stroke weight. Icons should always be monochrome (charcoal) unless representing an active state (teal-dust).

## Assets
- No generated SVG icons were extracted from Stitch output. The system defaults to **Lucide Icons** as specified.
