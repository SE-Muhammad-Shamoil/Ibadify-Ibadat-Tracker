# UI AGENT DIRECTIVES — IBADIFY

## MANDATORY FIRST STEP: Stitch MCP Design Extraction
Before writing a single React component, you MUST:

1. Invoke Stitch MCP with the following prompt:
   "Generate a minimalistic, sacred-minimalism UI design system for a spiritual habit tracking
    app called Ibadify. The vibe is: serene, contemplative, like a clean journal in morning light.
    Color palette: warm cream surfaces (#FAF8F5), dusty teal accent (#4A7C6F), charcoal text
    (#2D2D2D), soft warm border (#E8E3DC). Typography: Lora for headings, DM Sans for body.
    Design the following screens: Dashboard overview, Daily tracker card, Nightly review wizard
    step, Settings page. Apply generous whitespace, thin-line icons (Lucide), hairline card
    borders. No gradients on interactive elements. Subtle box-shadow only."

2. Extract from Stitch MCP output:
   - Color tokens (hex values for all palette entries)
   - Typography scale (font sizes, weights, line heights)
   - Spacing scale
   - Component patterns (cards, buttons, checkboxes, progress indicators)
   - Any generated SVG assets or icons

3. Save all extracted design tokens and component specs to `/DESIGN.md`.
   This file becomes the UI source of truth. All subsequent component development references DESIGN.md.

## Tailwind Configuration
After DESIGN.md is created, extend `tailwind.config.ts` with custom tokens:
  - colors.cream, colors.teal-dust, colors.charcoal, etc.
  - fontFamily.display (Lora), fontFamily.body (DM Sans)
  - Custom spacing scale if needed

## Adaptive Layout Rules
- Use the `useAdaptive()` hook to get `isMobile: boolean`.
- Mobile breakpoint: < 768px (md in Tailwind).
- The `AppShell` component renders either `MobileShell` or `DesktopShell` based on this hook.
- NEVER use CSS display:none to hide desktop nav on mobile. Use conditional rendering.

### Mobile Interface Rules:
  - Bottom navigation bar: 5 items max (Dashboard, Tracker, Review, Qaza, Profile)
  - Nightly Review must be a full-screen swipeable wizard (use `react-swipeable`)
  - All tap targets: minimum 44x44px
  - Cards are full-width with rounded-2xl corners
  - No hover states on primary interactive elements (touch-first)

### Desktop Interface Rules:
  - Persistent left sidebar: 240px wide, collapsible to 64px (icon-only mode)
  - Main content: max-width 1200px, centered
  - Multi-column dashboard: 3-column grid (tracker | insights | qaza planner)
  - Nightly Review: modal dialog (not full-screen takeover)
  - All data tables sortable
  - Keyboard navigation support (tab, enter, escape)

## Animation Standards
- Page transitions: `opacity 0→1` + `translateY 8px→0`, duration 200ms, ease-out
- Prayer checkbox completion: soft pulse glow (scale 1→1.05→1, 300ms)
- Streak milestone: confetti is FORBIDDEN. Use a single warm golden shimmer on the streak badge.
- Skeleton loaders for all async data (not spinners)
- Respect `prefers-reduced-motion` media query — disable all animations if set

## Accessibility
- All interactive elements must have `aria-label`
- Color contrast ratio minimum 4.5:1 (WCAG AA)
- Focus rings: visible, using the teal accent color
- Screen reader announcements for prayer completion actions
