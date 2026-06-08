# 02 — Root Layout & Navigation

Read `AGENTS.md` and all context files before implementing.

## What This Builds

The global root layout structure containing the primary responsive Header/Navbar and creative, professional Footer components. These elements wrapper all public-facing pages, facilitating seamless navigation and responsive layout consistency.

---

## Component Specifications

### 1. Header & Navbar (`components/layout/navbar.tsx`)

A sticky navigation bar wrapping the top of all public pages with an elegant glassmorphism background.

#### Structure & Semantic Layout Order:
1. `<header>`: The primary container with `sticky top-0 z-50 border-b border-border-default/50 bg-bg-base/80 backdrop-blur-md transition-all duration-300`.
2. `<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">`: Centered main width constraint wrapper.
3. Left Section — Logo:
   - `<a href="/" className="font-heading text-2xl font-bold tracking-tight text-text-primary hover:opacity-90 transition-opacity">`: Text-based brand representation using Playfair Display.
   - Text Content: `Brand Estate`.
4. Middle Section — Desktop Navigation Menu:
   - `<nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-1">`.
   - `<ul>` containing `<li>` tags matching `PUBLIC_NAV_LINKS` from `lib/constants.ts` (Properties, Agents, About, Contact).
   - Links should utilize Montserrat with active states highlighted with a subtle underline or brand color text weight change.
5. Right Section — Tools & Authentication Buttons:
   - `<div className="flex items-center space-x-2 sm:space-x-4">`.
   - **Search Icon Button**: Triggering a modal or search overlay (for public search). Uses `Search` icon from `lucide-react`. It's basically icon button, when user click, it will open the search modal.
   - **Theme Toggle Dropdown**: Using shadcn `DropdownMenu` to switch between `Light`, `Dark`, and `System` settings. Icons represent current state.
   - **Location selector**: initially need to show a location(that will take from ip api response. then user can change the location. it will work like search but it will filter the properties based on the location. it will show properties of that location. user can also set location by clicking on the location selector. it will open a modal with the list of countries. and user can select the country. also it should support search. means user can search for a country. and it will show the properties of that country. and it will use the same search modal. )
   - **Authentication Actions Group**:
     - **"Join" Link Button**: Clean, outline button style (`rounded-full hover:bg-bg-elevated`). Directs to `/register`.
     - **"Sign In" Link Button**: Primary filled button style (`bg-accent-primary text-white hover:bg-accent-primary-hov rounded-full px-5 shadow-sm transition-all duration-200`). Directs to `/login`.
6. Mobile Menu Trigger:
   - Integrated into the right section (hidden on desktop, visible on mobile).
   - Uses shadcn `Sheet` with a custom hamburger menu trigger (`Menu` icon) that slides in a full vertical sidebar menu on click.

---

### 2. Creative & Premium Footer (`components/layout/footer.tsx`)

A professional, content-rich footer reflecting the site's authority and providing structured paths for users. Built with high-end, responsive layout grid structures.

#### Structure & Semantic Layout Order:
1. `<footer>`: Outer tag with `bg-bg-alt dark:bg-bg-subtle border-t border-border-default/30 transition-colors duration-300`.
2. Upper Newsletter/CTA Strip:
   - `<section className="border-b border-border-default/20 py-8 lg:py-12">`: Premium background styling with email subscribe form.
   - Contains headline, subtitle, and an inline subscription input + button (`rounded-full`) for professional engagement.
3. Main Directory Grid:
   - `<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">`.
   - **Col 1 (Logo & Brand Identity)**:
     - Logo text `Brand Estate` (Playfair Display) + high-quality descriptive paragraph about the SaaS real estate solution.
     - Social Icons Group: Row of subtle, hover-interactive social links (Facebook, Twitter/X, Instagram, LinkedIn, YouTube) using outline buttons (`rounded-full`).
   - **Col 2 (Discover)**:
     - Header `<h3>` using Montserrat bold.
     - List (`<ul>/<li>`) of links: Buy Properties, Rent Properties, New Developments, Commercial Space.
   - **Col 3 (Agents & Partners)**:
     - Header `<h3>` using Montserrat bold.
     - List: Find an Agent, Agent Workspace, Partner Portal, Careers.
   - **Col 4 (Company)**:
     - Header `<h3>` using Montserrat bold.
     - List: About Us, Press Room, Blog, Contact.
   - **Col 5 (Support & Office)**:
     - Header `<h3>` using Montserrat bold.
     - Physical HQ office address + general support email/phone details for credibility.
4. Bottom Meta & Legal Bar:
   - `<div className="border-t border-border-default/10 py-6 md:flex md:items-center md:justify-between text-xs text-text-muted">`.
   - Left side: Copyright statement (`© 2026 Brand Estate. All rights reserved.`).
   - Right side: Legal links flex group (Privacy Policy, Terms of Service, Cookies, Sitemap).

---

## Inputs / Props

- **User State (Mock)**: The header needs to inspect client-side mock authentication parameters (e.g., active role: `guest` vs `auth_user` / `agent` / `admin`).
  - If role is not `guest`, hide the "Join" & "Sign In" buttons and replace with:
    - User Avatar dropdown menu showing dashboard paths (`/dashboard` or role-specific panels) and a "Sign Out" option.

---

## Acceptance Criteria

### Semantic & Accessibility Compliance
- [ ] Uses strict HTML5 semantic hierarchy: `<header>` -> `<nav>` -> `<ul>` / `<li>` -> `<a>` (or Link) inside navigation.
- [ ] Uses `<footer>` for page footers with proper `<section>` and layout tags.
- [ ] Appropriate `aria-label` tags applied to `<nav>`, mobile menu, and icon-only buttons.
- [ ] Responsive navigation menu toggles between visible desktop list and mobile `Sheet` trigger smoothly.

### Nav menu items: Buy, Sell, Rent, Find Agent, About us, Blogs, Contact.
- Need to create mega menu dropdown for Buy, Sell, Rent. 
- In header nav, keep items centered. apply your creativity and professionalism for styling. 
- make a dropdown others and show them: about us, Blogs, Contact



### Visual & Polish Standards
- [ ] Font pairings applied correctly: Header Brand Logo uses Playfair Display (`font-heading`), all list links and buttons use Montserrat (`font-body`).
- [ ] Buttons use exact border-radius: Action buttons are pill-shaped (`rounded-full`).
- [ ] Colors use defined custom tokens (`bg-bg-base`, `text-text-primary`, `bg-accent-primary`, etc.) — no raw hex values.
- [ ] Premium Hover states: Sublte scale/translate, underline transitions, and backdrop blur applied.

### Responsive Verification
- [ ] Mobile Layout (375px): Sticky header with Logo (left), Search (right), Theme (right), Hamburger Menu (right). Footer wraps into single column cards seamlessly.
- [ ] Desktop Layout (1280px+): Navigation items render inline, full Auth/Join buttons visible, footer layout spreads into 5 premium columns.

### Code & Compilation
- [ ] Zero TypeScript warnings/errors.
- [ ] Next.js production builds verify successfully.

---

## Out Of Scope

- Functional login/register redirect pages (mocked links only).
- Actual database search queries for the Search button (triggers UI layout placeholder/modal only).
- Newsletter submission backend processing (form console logs submission only).
