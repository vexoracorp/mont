# AGENTS.md — Mont Project Conventions

## Package Manager

**Use `bun` for everything. Never use `npm`, `npx`, or `yarn`.**

| Instead of | Use |
|------------|-----|
| `npm install` | `bun install` |
| `npm run dev` | `bun dev` |
| `npm run build` | `bun run build` |
| `npx <package>` | `bunx --bun <package>` |
| `npx shadcn@latest` | `bunx --bun shadcn@latest` |
| `npx dembrandt` | `bunx --bun dembrandt` |
| `npx playwright` | `bunx --bun playwright` |

## Stack

- Runtime: Bun
- Framework: Vite + React 19
- Language: TypeScript 6
- Styling: Tailwind CSS v4
- Components: shadcn/ui (base-nova style)
- Icons: Lucide React
- Path alias: `@/*` → `./src/*`

## Design System

Design system lives at `/designsystem/DESIGN.md`. All UI work must follow it.

## Build

```bash
bun run build   # tsc -b && vite build — must pass with zero errors
bun dev         # development server
```

## Code Rules

- No `as any`, `@ts-ignore`, `@ts-expect-error`
- No empty catch blocks
- No external image URLs — use local assets or SVG inline
- Prefer CSS/Tailwind classes over inline styles
- Keep components in `src/` — minimal file count
