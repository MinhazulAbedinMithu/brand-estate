# Code Standards

## General

- Keep modules small and single-purpose.
- Fix root causes — do not layer workarounds.
- Do not mix unrelated concerns in one component or route.
- Respect the system boundaries defined in `architecture-context.md`.
- Name files after the responsibility they contain, not the technology.

## TypeScript

- Strict mode is required throughout the project.
- Avoid `any`; use explicit interfaces or narrowly scoped types.
- All shared types and interfaces belong in `lib/types.ts`.
- Validate unknown external input at system boundaries before trusting it.
- Use `interface` for object contracts; `type` for unions and aliases.
- Export named types — avoid default exports for types.

## Next.js

- Default to React Server Components (RSC). Add `"use client"` only when the component needs:
  - Browser APIs (window, document, localStorage)
  - Event listeners (onClick, onChange, etc.)
  - React hooks (useState, useEffect, useContext)
  - Third-party client-only libraries
- Keep route handlers focused on a single responsibility (backend phase only).
- Long-running work belongs in background tasks, not in request handlers.
- Use the App Router only — no Pages Router patterns.
- Layouts are server components unless they contain interactive state.

## Styling

- All colors must use CSS custom property tokens defined in `globals.css`.
- Never use raw Tailwind color classes like `blue-500`, `gray-200`, or hardcoded hex values in component files.
- Reference tokens via their Tailwind utility names (defined via `@theme inline`):
  - Backgrounds: `bg-base`, `bg-surface`, `bg-elevated`, `bg-alt`
  - Text: `text-primary`, `text-secondary`, `text-muted`, `text-faint`
  - Borders: `border-default`, `border-subtle`
  - Accents: `bg-accent-primary`, `text-accent-primary`, `bg-accent-dim`
- Maintain the border radius scale:
  - Buttons, inputs: `rounded-full`
  - Cards: `rounded-2xl`
  - Modals, feature sections: `rounded-3xl`
- Use Tailwind v4 syntax — avoid deprecated v3 class names:
  - Use `bg-linear-*` not `bg-gradient-*`
  - Use `@theme inline` not `theme()` function in arbitrary values
- Apply `transition-all duration-200` for all interactive element hover states.

## Fonts

- Headings (`h1`, `h2`, `h3`): Playfair Display — use `font-heading` utility class.
- Body, UI labels, buttons: Montserrat — use `font-body` utility class (default `body`).
- Never import or reference system fonts directly in component files.

## Component Rules

- `components/ui/*` — shadcn/ui primitives: **never modify these files** after installation.
- `components/layout/*` — global layout components (Navbar, Footer, Sidebar). Only one instance per layout boundary.
- `components/property/*` — property-domain components. No business logic — render props only.
- `components/dashboard/*` — dashboard UI shells. Use `StatCard`, `InquiryRow`, etc. from this family.
- `components/shared/*` — generic reusable UI: `SearchBar`, `EmptyState`, `Pagination`, `Badge`.
- Components must not import from `app/` or `app/api/`.
- Props must be typed with explicit TypeScript interfaces.
- Use `cn()` from `lib/utils.ts` for all conditional class merging — never string concatenation.

## cn() Usage

```typescript
// ✅ Correct
import { cn } from '@/lib/utils';
<div className={cn('base-class', isActive && 'active-class', className)} />

// ❌ Wrong
<div className={`base-class ${isActive ? 'active-class' : ''}`} />
```

## API Routes (Backend Phase)

- Validate and parse request input before any logic runs.
- Enforce auth and role checks before any mutation.
- Return consistent, predictable response shapes: `{ data, error, status }`.
- Keep route handlers thin — push complexity into `lib/` modules.
- Never return MongoDB `_id` directly — transform to `id` string in responses.

## Data and Storage (Backend Phase)

- All persistent data lives in MongoDB.
- File uploads (property images) go to an object storage service — not MongoDB.
- Store only the file URL/reference in MongoDB.
- Use typed Mongoose schemas that match the interfaces in `lib/types.ts`.

## File Organization

```
lib/
  utils.ts       — cn(), type guards, formatters
  types.ts       — All shared TypeScript interfaces
  constants.ts   — Enums, static option lists, role definitions

components/
  ui/            — shadcn primitives (hands-off)
  layout/        — Navbar, Footer, Sidebar
  property/      — PropertyCard, PropertyForm, Gallery, etc.
  dashboard/     — StatCard, InquiryTable, DashboardNav
  shared/        — SearchBar, Pagination, EmptyState, Badge

app/
  (public)/      — Guest-accessible routes
  (auth)/        — Login, register, password reset
  dashboard/     — Auth user workspace
  agent/         — Agent workspace
  admin/         — Admin panel
  super-admin/   — Super admin panel
  globals.css    — Token definitions and base styles
  layout.tsx     — Root layout with font injection
```

## Linting

- ESLint with `eslint-config-next`.
- Ignore deprecated Tailwind v3 class names that have been renamed in v4 (e.g., `bg-gradient-*`).
- Do not suppress lint errors with inline comments — fix the root cause.
- Unused imports are errors, not warnings.
