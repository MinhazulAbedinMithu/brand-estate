# 01 — Design System & Tokens

Read `AGENTS.md` and all context files before implementing.

## What This Builds

The global design system foundation for RealHoms. This includes:

1. All CSS custom property tokens in `app/globals.css`.
2. Font injection (Playfair Display + Montserrat) in `app/layout.tsx`.
3. Tailwind `@theme inline` token mappings.
4. Base body and heading styles.
5. All shadcn/ui component installations needed for Phase 1.
6. `lib/utils.ts` with `cn()` helper.
7. `lib/types.ts` with core TypeScript interfaces.
8. `lib/constants.ts` with static option lists.

---

## Token Definitions

### Light Mode Tokens (Public Pages)

Add these to `app/globals.css` under `:root`:

```css
:root {
  --bg-base: #FFFFFF;
  --bg-alt: #F6F8FC;
  --bg-surface: #FFFFFF;
  --bg-elevated: #F0F4FA;
  --border-default: #E2E8F0;
  --border-subtle: #CBD5E1;
  --text-primary: #0F172A;
  --text-secondary: #334155;
  --text-muted: #64748B;
  --text-faint: #94A3B8;
  --accent-primary: #0067D2;
  --accent-primary-hov: #005BBA;
  --accent-primary-dim: rgba(0, 103, 210, 0.10);
  --accent-navy: #010611;
  --state-success: #16A34A;
  --state-warning: #D97706;
  --state-error: #DC2626;
  --state-info: #0EA5E9;
}
```

### Dark Mode Tokens (Dashboard / Admin)

```css
.dark {
  --bg-base: #080D16;
  --bg-surface: #010611;
  --bg-elevated: #131E33;
  --bg-subtle: #0D1829;
  --border-default: #2A395B;
  --border-subtle: #293763;
  --text-primary: #F5F5F5;
  --text-secondary: #C7CEDE;
  --text-muted: #8D93A5;
  --accent-primary: #1D8CFF;
}
```

### Tailwind `@theme inline` Mapping

In `globals.css`, map tokens to Tailwind utility names:

```css
@theme inline {
  --color-bg-base: var(--bg-base);
  --color-bg-alt: var(--bg-alt);
  --color-bg-surface: var(--bg-surface);
  --color-bg-elevated: var(--bg-elevated);
  --color-border-default: var(--border-default);
  --color-border-subtle: var(--border-subtle);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-text-faint: var(--text-faint);
  --color-accent-primary: var(--accent-primary);
  --color-accent-primary-dim: var(--accent-primary-dim);
  --color-accent-navy: var(--accent-navy);
  --color-state-success: var(--state-success);
  --color-state-warning: var(--state-warning);
  --color-state-error: var(--state-error);

  --font-heading: var(--font-playfair-display);
  --font-body: var(--font-montserrat);
}
```

---

## Font Setup

In `app/layout.tsx`, load both fonts from `next/font/google`:

```typescript
import { Playfair_Display, Montserrat } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});
```

Apply both font variables on the `<html>` element:

```tsx
<html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
```

In `globals.css`:

```css
body {
  font-family: var(--font-body), sans-serif;
  -webkit-font-smoothing: antialiased;
  color: var(--text-primary);
  background-color: var(--bg-base);
}

h1, h2, h3 {
  font-family: var(--font-heading), serif;
}
```

---

## shadcn/ui Components to Install

Run the following to install (if not already done):

```bash
npx shadcn@latest add button card dialog input textarea tabs scroll-area badge select separator avatar dropdown-menu table sheet skeleton
```

Do **not** modify generated files in `components/ui/`.

---

## lib/utils.ts

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## lib/types.ts (Core Interfaces)

Create with the full interfaces from `architecture-context.md`:
- `UserRole`
- `Property`
- `User`
- `Inquiry`
- `Agent`

---

## lib/constants.ts

```typescript
export const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'commercial', 'land'] as const;
export const LISTING_TYPES = ['sale', 'rent'] as const;
export const LISTING_STATUSES = ['active', 'pending', 'archived', 'rejected'] as const;
export const USER_ROLES = ['guest', 'auth_user', 'agent', 'admin', 'super_admin'] as const;
```

---

## Acceptance Criteria

- [ ] All CSS tokens are defined in `globals.css` under `:root` and `.dark`.
- [ ] `@theme inline` maps tokens to Tailwind utility names.
- [ ] Playfair Display and Montserrat load via `next/font/google`.
- [ ] Font variables are applied on the `<html>` element in the root layout.
- [ ] `body` uses Montserrat. `h1`, `h2`, `h3` use Playfair Display.
- [ ] `cn()` is defined and exported from `lib/utils.ts`.
- [ ] `lib/types.ts` has all core interfaces.
- [ ] `lib/constants.ts` has PROPERTY_TYPES, LISTING_TYPES, USER_ROLES.
- [ ] All shadcn components import without errors.
- [ ] No hardcoded hex values or raw Tailwind color classes appear in any component file.
- [ ] `npm run build` passes with no type errors.

---

## Out Of Scope

- Actual page content (handled in specs 02+).
- Mock data (handled alongside feature specs as needed).
- Any backend code.