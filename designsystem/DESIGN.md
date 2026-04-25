# Mont Design System

Design system for Mont — an all-in-one digital product auto-delivery SaaS platform.
Manages orders, inventory, and instant delivery across Naver Store, G2G, G2A, and personal websites.

---

## Brand Identity

- **Product**: Mont — digital product auto-delivery platform
- **Tone**: Professional, fast, efficient. Trustworthy SaaS with a tech edge. Not playful, not corporate.
- **Logo**: Crescent moon mark (purple circle with dark cutout) + "Mont" wordmark
- **Personality**: Automation-first, multi-platform, reliable. "Set it and forget it" for digital sellers.
- **Positioning**: "Sell digital products on autopilot"

---

## Typography

### Font Family

- **Primary**: `Plus Jakarta Sans Variable` (modern geometric sans-serif with subtle warmth)
  - Fallback: `system-ui`, `sans-serif`
  - Contemporary feel, reads well at small sizes for metrics/data
- **Monospace** (for data/metrics): `Geist Mono`, `ui-monospace`, `Consolas`, `monospace`

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `display` | 60px / 3.75rem | 600 | 1.13 | -3px | Hero headlines only |
| `h1` | 48px / 3rem | 500 | 1.0 | -0.32px | Page titles |
| `h2` | 36px / 2.25rem | 500 | 1.22 | -1.8px | Section headings |
| `h3` | 24px / 1.5rem | 500 | 1.17 | -0.32px | Card titles, feature names |
| `h4` | 20px / 1.25rem | 500 | 1.4 | -0.32px | Subsection headings |
| `body` | 16px / 1rem | 400 | 1.5 | -0.32px | Body text, descriptions |
| `body-medium` | 16px / 1rem | 500 | 1.5 | -0.32px | Emphasized body, nav links |
| `small` | 14px / 0.875rem | 400 | 1.43 | -0.32px | Captions, secondary text |
| `small-medium` | 14px / 0.875rem | 500 | 1.43 | -0.32px | Button text, labels |
| `caption` | 13px / 0.8125rem | 500 | 1.5 | -0.32px | Badges, tags |
| `micro` | 12px / 0.75rem | 500 | 1.33 | -0.32px | Metric labels, timestamps |

### Typography Rules

- Headlines use tight negative letter-spacing (-0.32px to -3px) — this is a signature trait
- Body text uses subtle negative tracking (-0.32px) for a polished feel
- NEVER use `tracking-wide` or `uppercase` on metric labels — that's an AI slop tell
- Metric values use `tabular-nums` for alignment
- Max line width for body text: 45-75 characters (roughly `max-w-lg`)

---

## Colors

### Core Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#918DF6` | Primary CTA, active states, brand accent |
| `--color-primary-hover` | `#9580FF` | Primary button hover |
| `--color-surface` | `#FFFFFF` | Page background, card backgrounds |
| `--color-on-surface` | `#181925` | Primary text, headings |
| `--color-muted` | `#666666` | Secondary text, inactive nav |
| `--color-subtle` | `#767676` | Tertiary text, captions (WCAG AA minimum on white) |
| `--color-placeholder` | `#999999` | Placeholders, decorative text only (not for info-carrying text) |
| `--color-border` | `rgba(0,0,0,0.08)` | Card borders, dividers |
| `--color-border-strong` | `#E6E6E8` | Active borders, tab underlines |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#34A853` | Positive metrics, growth indicators — paired with ↑ icon or "+" prefix |
| `--color-danger` | `#D93025` | Negative metrics, decline indicators — paired with ↓ icon or "−" prefix |
| `--color-warning` | `#E37400` | Warnings, amber alerts — paired with ⚠ icon |
| `--color-info` | `#1A73E8` | Links, informational elements |

### Inclusive Color Rules (Apple HIG)

- NEVER rely on color alone to convey meaning — always pair with icons, text labels, or shapes
- Avoid red/green as the only differentiator — use ↑/↓ arrows, +/− prefixes alongside color
- All text must meet WCAG AA contrast (4.5:1 on white): `#181925` (15.8:1 ✓), `#666666` (5.74:1 ✓), `#767676` (4.54:1 ✓ — minimum for subtle text)
- `#999999` (2.85:1) is ONLY for decorative/non-essential text (placeholders, disabled states) — never for information-carrying text
- Semantic colors are supplementary — the information must be understandable without them
- Test designs with color blindness simulators (protanopia, deuteranopia, tritanopia)

### Indicator Dots (Metrics)

| Metric | Color | Shape | Purpose |
|--------|-------|-------|---------|
| Orders | `#1A73E8` (blue) | ● dot | Order count indicator |
| Revenue | `#34A853` (green) | ▲ triangle or ↑ arrow | Revenue indicator |
| Delivered | `#34A853` (green) | ✓ checkmark | Delivery success indicator |

### Color Rules

- **NO purple gradients on white backgrounds.** This is the #1 AI slop signal.
- Purple (`#918DF6`) is used ONLY for: primary CTA buttons, active tab indicators, and the logo mark.
- Background gradients, if used, must be localized (inside a card/container), not page-wide washes.
- Prefer `rgba(0,0,0,0.08)` borders over solid gray borders — they adapt to any background.
- Text hierarchy: `#181925` → `#666666` → `#767676`. Use `#999999` only for placeholders/decorative.
- Never use color as the sole indicator of state — always pair with shape, icon, or text label.

---

## Spacing

### Base Unit: 8px

| Token | Value | Usage |
|-------|-------|-------|
| `space-0.5` | 4px | Inline gaps, icon padding |
| `space-1` | 8px | Tight element gaps |
| `space-1.5` | 12px | Button padding, small gaps |
| `space-2` | 16px | Standard element spacing |
| `space-3` | 24px | Section inner padding |
| `space-4` | 32px | Card padding, medium sections |
| `space-8` | 64px | Section gaps |
| `space-10` | 80px | Large section separators |
| `space-14` | 112px | Hero top padding |
| `space-20` | 160px | Major section breaks |

### Spacing Rules

- Section spacing must VARY — uniform spacing is an AI slop tell
- Hero → Logo cloud: tighter (48-64px)
- Logo cloud → Product preview: wider (80-96px)
- Inside cards: 16-24px padding
- Between metric items: use `divide-x` borders, not individual card gaps

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Badges, small tags |
| `radius-md` | 8px | Images, small cards |
| `radius-lg` | 12px | Cards, containers |
| `radius-xl` | 16px | Large cards, modals |
| `radius-2xl` | 24px | Window chrome, hero cards |
| `radius-full` | 9999px | Buttons, pills, nav bar |

### Radius Rules

- Buttons are ALWAYS `rounded-full` (pill shape)
- The floating navbar is `rounded-full`
- Dashboard window chrome uses `rounded-2xl` (24px)
- NOT everything should be rounded-full — that's an AI slop tell. Cards use `rounded-xl` or `rounded-2xl`.

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-subtle` | `0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)` | Cards, elevated surfaces |
| `shadow-medium` | `0 1px 1px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)` | Buttons, interactive cards |
| `shadow-large` | `0 1px 3px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)` | Floating nav, modals, product preview |

### Shadow Rules

- Shadows are subtle and layered — never a single heavy `shadow-2xl`
- The floating navbar uses `shadow-large`, not `shadow-2xl shadow-black/20`
- Cards use `shadow-subtle` — barely visible, just enough to lift
- NO colored shadows (e.g., `shadow-purple-500/25`) — that's AI slop

---

## Components

### Buttons

| Variant | Background | Text | Border | Padding |
|---------|-----------|------|--------|---------|
| Primary | `#918DF6` | `#FFFFFF` | none | `0 20px`, height 40px |
| Secondary/Ghost | `rgba(0,0,0,0.03)` | `#666666` | none | `0 20px`, height 40px |
| Outline | transparent | `#666666` | `2px solid #FFFFFF` | `0 20px`, height 40px |

- All buttons: `rounded-full`, `font-weight: 500`, `font-size: 14-16px`
- Primary CTA: flat fill, NO glow shadow, NO gradient
- Hover: darken slightly, no dramatic color shift

### Navbar

- Floating, centered, `position: fixed`, `top: 16px`
- Dark background: `#14141F` (near-black with slight blue)
- `rounded-full` pill shape
- Subtle border: `border border-white/10`
- Shadow: `shadow-large` (layered, not heavy)
- Nav links: `#999999`, hover → `#FFFFFF`
- Register button: primary purple, smaller than hero CTA

### Dashboard Window Chrome

- Container: `rounded-2xl`, `border border-neutral-200`, `bg-white`, `shadow-large`, `overflow-hidden`
- Title bar: `bg-neutral-50`, `border-b border-neutral-200`, `px-5 py-3`
- Traffic light dots: 3 circles (red `#FF5F57`, yellow `#FFBD2E`, green `#27C93F`), `size-3`, `gap-2`
- Tabs live INSIDE the window, not floating above
- Metrics use `divide-x` layout, not individual bordered cards

### Announcement Badge

- Small pill: `rounded-full`, `border border-neutral-200`, `bg-white/80`, `backdrop-blur`
- "NEW" tag: `bg-emerald-500`, `text-white`, `text-[11px]`, `font-bold`, `uppercase`, `rounded-full`
- Keep it subtle — it should NOT steal attention from the headline

### Logo Cloud

- Text-only — NO icons, NO Lucide shapes
- Shows REAL platform integrations: Naver, G2G, G2A, Steam, PlayStation, Xbox
- Vary font weights and sizes to simulate real brand typography
- Color: `#999999` or `opacity-40`
- Label above: "Supported platforms"

---

## Layout Principles

1. **Max content width**: 1200px (`max-w-6xl` or `max-w-7xl`)
2. **Hero section**: centered, `text-align: center`, generous top padding (112-160px)
3. **Product preview**: the trust anchor — must look like a real app, not floating components
4. **Gradient usage**: localized only. If purple gradient is used, contain it within the product preview area or a specific card. Never as a page-wide atmospheric wash.
5. **Responsive**: mobile-first, but prioritize desktop for landing page

---

## Anti-Patterns (NEVER DO)

1. ❌ Purple gradient washing the entire page background
2. ❌ Lucide/generic icons as fake company logos
3. ❌ `tracking-wide uppercase` on metric labels
4. ❌ Uniform spacing between all sections
5. ❌ Heavy colored shadows on buttons (`shadow-purple-500/25`)
6. ❌ Dashboard metrics floating without a container/window chrome
7. ❌ Six identical metric cards in a flat grid
8. ❌ `shadow-2xl` on the navbar
9. ❌ Using `Inter`, `Roboto`, `Arial`, or `Space Grotesk`
10. ❌ Everything centered with perfect symmetry — add visual tension

---

## Do's

1. ✅ Use `Plus Jakarta Sans Variable` with tight letter-spacing
2. ✅ Keep purple accent minimal — CTA + logo + active states only
3. ✅ Wrap product previews in window chrome (title bar + dots)
4. ✅ Use layered subtle shadows instead of single heavy ones
5. ✅ Vary section spacing for rhythm
6. ✅ Use `rgba(0,0,0,0.08)` borders that adapt to backgrounds
7. ✅ Make metric data look believable — real delivery/order numbers, mixed positive/negative
8. ✅ Use `divide-x` for metric rows instead of individual card borders
9. ✅ Keep the floating dark navbar with subtle border and layered shadow
10. ✅ Maintain WCAG AA contrast (4.5:1) for all body text
