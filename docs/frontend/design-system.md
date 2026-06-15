# Design System — PapoAuto

Base visual reference for the PapoAuto frontend.

---

## Color Palette (Design Kit)

Raw palette values from the design kit. These are defined as `--palette-*` CSS variables in `app/globals.css` and are the source of truth for all color decisions. **Do not use them directly in components** — use the semantic tokens below instead.

### Primary

| Name | Variable | Hex |
|---|---|---|
| Racing Red | `--palette-primary` | `#C8481B` |
| Carbon Black | `--palette-carbon` | `#0A0A0A` |

### Neutral

| Name | Variable | Hex |
|---|---|---|
| White | `--palette-white` | `#FFFFFF` |
| Neutral 100 | `--palette-neutral-100` | `#F5F5F5` |
| Neutral 300 | `--palette-neutral-300` | `#D4D4D4` |
| Neutral 500 | `--palette-neutral-500` | `#737373` |
| Neutral 700 | `--palette-neutral-700` | `#404040` |
| Neutral 900 | `--palette-neutral-900` | `#171717` |

### Accent

| Name | Variable | Hex |
|---|---|---|
| Red Dark | `--palette-red-dark` | `#A03815` |
| Red Light | `--palette-red-light` | `#E55B2F` |
| Steel Gray | `--palette-steel-gray` | `#666666` |
| Night Black | `--palette-night-black` | `#1A1A1A` |

---

## Semantic Tokens

All semantic tokens are CSS custom properties in `app/globals.css`. They map to palette values and are what components should use. They are also available as Tailwind utilities via the `@theme inline` block.

### Backgrounds & Surfaces

| Token | CSS var | Palette source | Hex | Usage |
|---|---|---|---|---|
| `bg` | `--bg` | `--palette-white` | `#FFFFFF` | Page background |
| `surface` | `--surface` | `--palette-neutral-100` | `#F5F5F5` | Card / panel background |
| `surface-2` | `--surface-2` | `--palette-neutral-100` | `#F5F5F5` | Secondary surface, filter chips, button backgrounds |

> Note: `--surface-2` maps to the same palette step as `--surface` because the design kit has no intermediate neutral between white and neutral-100. If a distinct secondary surface is needed in future, add a new palette step.

### Text

| Token | CSS var | Palette source | Hex | Usage |
|---|---|---|---|---|
| `text` | `--text` | `--palette-neutral-900` | `#171717` | Primary body text |
| `text-muted` | `--text-muted` | `--palette-neutral-500` | `#737373` | Secondary / supporting text |
| `text-light` | `--text-light` | `--palette-neutral-300` | `#D4D4D4` | Tertiary labels, metadata |

> ⚠️ `--text-light` (`#D4D4D4`) has a contrast ratio of ~1.6:1 against white — insufficient for body copy. Use it only for decorative labels and always pair with a larger font size. Prefer `--text-muted` for readable secondary text.

### Border

| Token | CSS var | Palette source | Hex | Usage |
|---|---|---|---|---|
| `border` | `--border` | `--palette-neutral-300` | `#D4D4D4` | Card borders, dividers, input outlines |

### Brand / Accent

`--accent*` tokens are kept for backward compatibility with existing components. `--primary*` tokens are the canonical new names — use these in new code.

| Token | CSS var | Palette source | Hex | Usage |
|---|---|---|---|---|
| `primary` / `accent` | `--primary` / `--accent` | `--palette-primary` | `#C8481B` | CTAs, active states, links, badges |
| `primary-foreground` | `--primary-foreground` | `--palette-white` | `#FFFFFF` | Text on primary-colored backgrounds |
| `primary-hover` / `accent-hover` | `--primary-hover` / `--accent-hover` | `--palette-red-dark` | `#A03815` | Hover state for primary elements |
| `primary-light` | `--primary-light` | `--palette-red-light` | `#E55B2F` | Lighter accent variant |
| `accent-light` | `--accent-light` | — | `oklch(0.95 0.04 38)` | Active chip / filter tint |

> TODO: `--accent-light` has no direct palette equivalent. It is a very light tint used for filter chip active state. Define it in the design kit or replace with a palette-derived value.

### Layout

| Token | CSS var | Palette source | Hex | Usage |
|---|---|---|---|---|
| `carbon` | `--carbon` | `--palette-carbon` | `#0A0A0A` | Deep black surfaces |
| `header-background` | `--header-background` | `--palette-carbon` | `#0A0A0A` | Reserved for a dark header variant |

> Note: the current `Nav` component uses `--bg` (white) as its background. `--header-background` is available for a dark header if the design evolves.

### Feedback States

> TODO: success, warning, and danger colors are not defined in the design kit. Placeholders are used below — replace when the design kit is updated.

| Token | CSS var | Hex (placeholder) | Usage |
|---|---|---|---|
| `success` | `--success` | `#22c55e` | Success messages, valid states |
| `warning` | `--warning` | `#f59e0b` | Warnings, caution states |
| `danger` | `--danger` | `#ef4444` | Errors, destructive actions |

---

## Tailwind Utilities

All tokens are registered in `@theme inline` in `globals.css` and available as Tailwind color utilities.

### Semantic utilities

```
bg-bg               text-bg
bg-surface          text-surface
bg-surface-2        text-surface-2
bg-border           text-border
bg-text             text-text
bg-text-muted       text-text-muted
bg-text-light       text-text-light
bg-accent           text-accent
bg-accent-hover     text-accent-hover
bg-accent-light     text-accent-light
bg-primary          text-primary
bg-primary-foreground  text-primary-foreground
bg-primary-hover    text-primary-hover
bg-primary-light    text-primary-light
bg-carbon           text-carbon
bg-header-background   text-header-background
bg-success          text-success
bg-warning          text-warning
bg-danger           text-danger
```

### Raw palette utilities

```
bg-palette-primary       text-palette-primary
bg-palette-carbon        text-palette-carbon
bg-palette-white         text-palette-white
bg-palette-neutral-100   text-palette-neutral-100
bg-palette-neutral-300   text-palette-neutral-300
bg-palette-neutral-500   text-palette-neutral-500
bg-palette-neutral-700   text-palette-neutral-700
bg-palette-neutral-900   text-palette-neutral-900
bg-palette-red-dark      text-palette-red-dark
bg-palette-red-light     text-palette-red-light
bg-palette-steel-gray    text-palette-steel-gray
bg-palette-night-black   text-palette-night-black
```

---

## Typography

### Font Family

- **Primary font:** DM Sans
- **Fallbacks:** "Segoe UI", system-ui, -apple-system, sans-serif
- **CSS var:** `--font-dm-sans`
- **Tailwind:** `font-sans` and `font-display` both resolve to DM Sans

### Size Scale (in use across the project)

| Role | Size | Weight | Usage |
|---|---|---|---|
| `display` | 28–32px | 800 (extrabold) | Hero/logo text |
| `heading-1` | 28px (`text-3xl`) | 800 | Page titles |
| `heading-2` | 22px | 800 | Section headers (`SectionHeader`) |
| `heading-3` | 20px (`text-xl`) | 800 | Featured card title |
| `body` | 14px | 400–500 | Standard body text |
| `body-sm` | 13px | 400–500 | Nav links, filter chips, captions |
| `caption` | 12–13px | 400 | Card metadata (author, date, comments) |
| `label` | 11px | 600, uppercase, tracking-wide | Year tags, category badges |

### Letter Spacing

- Labels/badges: `tracking-[0.06em]` (uppercase, small caps feel)
- Display headings: `tracking-tight` (`-0.02em`)

> TODO: line-height scale uses Tailwind defaults (`leading-none`, `leading-snug`, `leading-relaxed`). Explicit CSS vars not yet defined.

---

## Images & Assets

### Logo

- **Full lockup:** `/logos/papo-auto-logo-color.svg` (PAPO in `--palette-carbon` / `#0A0A0A`, AUTO in `--palette-primary` / `#C8481B`)
- **Symbol only:** `/logos/papo-auto-symbol-color.svg`
- **Source in repo:** `papo-auto-design-kit/logos/` and `papo-auto-design-kit/symbols/`
- Use plain `<img>` tag (not `next/image`) — SVGs are already optimized vectors.
- Always maintain aspect ratio: set `height` in px, `width: auto`.
- The logo in the header links to `/` (homepage).

### Vehicle Thumbnails

> TODO: No vehicle images are currently used. When added, use `aspect-[16/9]` with `object-cover` and a fallback placeholder.

### Avatars

> TODO: No avatar images are currently used. When added, use circular crop (`rounded-full`) with a fallback to user initials.

### Empty States

Established pattern in the project:

```tsx
<div
  className="rounded-xl border px-5 py-6"
  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
>
  <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
    Mensagem de estado vazio.
  </p>
</div>
```

### Icons

- **Library:** Lucide React (`lucide-react`)
- Standard `strokeWidth`: `1.8`
- Standard size in nav/UI: `14–18px`

---

## Conventions

- Components apply colors via `style={{ color: "var(--text)" }}` (inline) or the Tailwind utilities listed above.
- **Never hardcode palette hex values in components.** Always use a CSS var or Tailwind utility.
- Box shadows (`rgba(0,0,0,0.10)`) on hover states are acceptable — not brand colors.
- Responsive breakpoints follow Tailwind defaults (`sm: 640px`, `md: 768px`, `lg: 1024px`).
- The app is light-theme only — no dark mode toggle currently exists.
- Prefer `--primary` / `--primary-hover` over `--accent` / `--accent-hover` in new code. Both resolve to the same palette values.
