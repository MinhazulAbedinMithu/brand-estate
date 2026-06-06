# UI Context

## Theme

Light and Dark mode. Default to **light mode with a dark sidebar option** for dashboards. The public-facing pages are professional white/light-navy, inspired by the affsflow.com color palette — clean, trust-building, and premium. Admin and agent dashboards use a deep dark theme.

All colors are defined as CSS custom properties in `app/globals.css` and mapped to Tailwind tokens via `@theme inline`. Components must use these tokens — no hardcoded hex values or raw Tailwind color classes.

## Color Palette

Inspired by affsflow.com: deep navy blues, pure white, and a vivid primary blue accent.

### Base (Light / Public Pages)

| Role                 | CSS Variable           | Value                      |
| -------------------- | ---------------------- | -------------------------- |
| Page background      | `--bg-base`            | `#FFFFFF`                  |
| Section alt bg       | `--bg-alt`             | `#F6F8FC`                  |
| Card surface         | `--bg-surface`         | `#FFFFFF`                  |
| Elevated surface     | `--bg-elevated`        | `#F0F4FA`                  |
| Default border       | `--border-default`     | `#E2E8F0`                  |
| Subtle border        | `--border-subtle`      | `#CBD5E1`                  |
| Primary text         | `--text-primary`       | `#0F172A`                  |
| Secondary text       | `--text-secondary`     | `#334155`                  |
| Muted text           | `--text-muted`         | `#64748B`                  |
| Faint text           | `--text-faint`         | `#94A3B8`                  |
| Brand primary        | `--accent-primary`     | `#0067D2`                  |
| Brand primary hover  | `--accent-primary-hov` | `#005BBA`                  |
| Brand primary dim    | `--accent-primary-dim` | `rgba(0, 103, 210, 0.10)`  |
| Brand navy           | `--accent-navy`        | `#010611`                  |
| Success              | `--state-success`      | `#16A34A`                  |
| Warning              | `--state-warning`      | `#D97706`                  |
| Error                | `--state-error`        | `#DC2626`                  |
| Info                 | `--state-info`         | `#0EA5E9`                  |

### Dark (Dashboard / Admin Pages)

| Role                 | CSS Variable              | Value                      |
| -------------------- | ------------------------- | -------------------------- |
| Page background      | `--dark-bg-base`          | `#080D16`                  |
| Surface              | `--dark-bg-surface`       | `#010611`                  |
| Elevated surface     | `--dark-bg-elevated`      | `#131E33`                  |
| Subtle surface       | `--dark-bg-subtle`        | `#0D1829`                  |
| Default border       | `--dark-border-default`   | `#2A395B`                  |
| Subtle border        | `--dark-border-subtle`    | `#293763`                  |
| Primary text         | `--dark-text-primary`     | `#F5F5F5`                  |
| Secondary text       | `--dark-text-secondary`   | `#C7CEDE`                  |
| Muted text           | `--dark-text-muted`       | `#8D93A5`                  |
| Brand primary        | `--dark-accent-primary`   | `#1D8CFF`                  |

## Typography

Loaded via `next/font/google` and applied as CSS variables on the `<html>` element.

| Role                        | Font              | CSS Variable         | Usage                                     |
| --------------------------- | ----------------- | -------------------- | ----------------------------------------- |
| Headings (H1–H3)            | Playfair Display  | `--font-heading`     | Hero titles, section headings, page titles|
| Body / UI text / labels     | Montserrat        | `--font-body`        | All paragraphs, nav, buttons, forms       |

```css
/* In globals.css */
html {
  --font-heading: var(--font-playfair-display);
  --font-body: var(--font-montserrat);
}

body {
  font-family: var(--font-body), sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-heading), serif;
}
```

### Type Scale

| Element           | Size / Weight                    |
| ----------------- | -------------------------------- |
| Hero H1           | `text-5xl` / `font-bold`         |
| Section H2        | `text-4xl` / `font-semibold`     |
| Card H3           | `text-xl` / `font-semibold`      |
| Body / paragraph  | `text-base` / `font-normal`      |
| Caption / label   | `text-sm` / `font-medium`        |
| Micro text        | `text-xs` / `font-normal`        |

## Border Radius

| Context              | Class          |
| -------------------- | -------------- |
| Badges / tags        | `rounded-full` |
| Buttons / inputs     | `rounded-full` |
| Cards                | `rounded-2xl`  |
| Modals / dialogs     | `rounded-3xl`  |
| Feature sections     | `rounded-3xl`  |

## Page Inventory

### Public Pages

| Page                    | Route                    | Notes                                                 |
| ----------------------- | ------------------------ | ----------------------------------------------------- |
| Homepage                | `/`                      | Hero, search bar, featured listings, categories, CTA  |
| Property Search         | `/properties`            | Grid/list toggle, filters sidebar, map toggle         |
| Property Detail         | `/property/[id]`         | Gallery, specs, agent card, inquiry form, map         |
| Agent Directory         | `/agents`                | Agent cards with ratings and listing count            |
| Agent Public Profile    | `/agents/[id]`           | Agent bio, active listings, contact form              |
| About                   | `/about`                 | Company story, team, stats                            |
| Contact                 | `/contact`               | Contact form, office info, map                        |

### Auth Pages

| Page              | Route               | Notes                                |
| ----------------- | ------------------- | ------------------------------------ |
| Login             | `/login`            | Email + password, Google OAuth link  |
| Register          | `/register`         | Name, email, password, role select   |
| Forgot Password   | `/forgot-password`  | Email input, send reset link         |
| Reset Password    | `/reset-password`   | Token-gated new password form        |

### User Dashboard

| Page                    | Route                     | Notes                                     |
| ----------------------- | ------------------------- | ----------------------------------------- |
| User Dashboard Home     | `/dashboard`              | Stats, recent activity                    |
| Saved Properties        | `/dashboard/saved`        | Grid of saved properties                  |
| My Inquiries            | `/dashboard/inquiries`    | Table of submitted inquiries              |
| Profile Settings        | `/dashboard/profile`      | Edit name, email, avatar, password        |

### Agent Workspace

| Page                  | Route                      | Notes                                         |
| --------------------- | -------------------------- | --------------------------------------------- |
| Agent Dashboard       | `/agent/dashboard`         | Stats: views, inquiries, active listings      |
| My Listings           | `/agent/listings`          | Table with status, edit, archive, delete      |
| Create Listing        | `/agent/listings/new`      | Full listing form with media upload UI        |
| Edit Listing          | `/agent/listings/[id]/edit`| Same form pre-filled                          |
| Leads / Inquiries     | `/agent/leads`             | Inquiry inbox table with message preview      |

### Admin Panel

| Page                  | Route                    | Notes                                         |
| --------------------- | ------------------------ | --------------------------------------------- |
| Admin Dashboard       | `/admin/dashboard`       | Platform-wide stats, recent activity          |
| User Management       | `/admin/users`           | Table: filter by role, suspend, activate      |
| Listing Management    | `/admin/listings`        | Table: approve/reject pending, view all       |
| Reports               | `/admin/reports`         | Flagged content, abuse reports                |

### Super Admin Panel

| Page                  | Route                        | Notes                                     |
| --------------------- | ---------------------------- | ----------------------------------------- |
| Super Admin Dashboard | `/super-admin/dashboard`     | System-wide metrics, health               |
| Role Management       | `/super-admin/roles`         | Assign/revoke admin and agent roles       |
| Platform Settings     | `/super-admin/settings`      | Feature flags, regions, categories        |

## Component Library

shadcn/ui on top of Tailwind CSS v4. No custom design system beyond token definitions. Components live in `components/ui/`. Use the `shadcn` CLI to add new components — never write them from scratch.

### Installed shadcn Components

- Button
- Card
- Dialog
- Input
- Textarea
- Tabs
- ScrollArea
- Badge
- Select
- Separator
- Avatar
- DropdownMenu
- Table
- Sheet (for mobile sidebar / slide-over)
- Skeleton (loading states)

### Custom Component Families

| Family           | Location               | Includes                                               |
| ---------------- | ---------------------- | ------------------------------------------------------ |
| Layout           | `components/layout/`   | Navbar, Footer, Sidebar, MobileMenu, PageWrapper        |
| Property         | `components/property/` | PropertyCard, PropertyGrid, PropertyFilter, Gallery    |
| Dashboard        | `components/dashboard/`| StatCard, DashboardNav, InquiryRow, ListingRow         |
| Shared           | `components/shared/`   | SearchBar, FilterPanel, Pagination, EmptyState, Badge  |

## Layout Patterns

### Public Pages
- Full-width layout with centered `max-w-7xl` content container.
- Sticky navbar with blur backdrop.
- Footer with site links, social links, legal links.

### Dashboards (User / Agent)
- Left sidebar (fixed width `w-64`) + main content area.
- Sidebar collapses to icon-only on tablet, full sheet on mobile.
- Top header bar with user avatar, notifications, breadcrumbs.

### Admin / Super Admin
- Same sidebar + content layout as dashboards.
- Sidebar has deeper dark background (`--dark-bg-surface`).
- Table-heavy layouts with action dropdowns.

### Modals and Dialogs
- Centered overlay, `rounded-3xl`, max-width `max-w-xl`.
- Blur backdrop using `backdrop-blur-sm`.

## Animations and Micro-interactions

- Button hover: scale + shadow transition (`transition-all duration-200`).
- Card hover: subtle lift (`hover:-translate-y-1 hover:shadow-lg`).
- Page transitions: fade-in on route change (`animate-fade-in`).
- Skeleton loaders for all async data placeholders.
- Smooth sidebar open/close via CSS transitions.

## Icons

Lucide React exclusively. Stroke-based, no filled variants.

| Context             | Size         |
| ------------------- | ------------ |
| Inline / nav        | `h-4 w-4`   |
| Buttons             | `h-5 w-5`   |
| Feature icons       | `h-6 w-6`   |
| Empty state icons   | `h-12 w-12` |

## Responsive Breakpoints

| Breakpoint | Width  | Notes                       |
| ---------- | ------ | --------------------------- |
| `sm`       | 640px  | Mobile-wide layouts          |
| `md`       | 768px  | Tablet, 2-column grids       |
| `lg`       | 1024px | Desktop, sidebar appears     |
| `xl`       | 1280px | Wide layouts, max containers |
| `2xl`      | 1536px | Ultra-wide padding extends   |
