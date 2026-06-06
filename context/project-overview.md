# Brand Estate — Project Overview

## Product

Brand Estate is a full-featured real estate SaaS platform that connects property buyers, renters, sellers, and real estate agents. It allows guests to browse listings, authenticated users to save and inquire, agents to manage their properties and leads, and administrators to oversee the entire platform.

## Goals

1. Provide a public-facing property discovery experience for guests and authenticated users.
2. Give agents a dedicated workspace to manage listings, leads, and client communication.
3. Give platform administrators visibility and control over all users, listings, and system settings.
4. Give a super admin full multi-tenant and system-level access.
5. Deliver a premium, conversion-optimized UI that builds trust with buyers and sellers.

## User Roles

| Role       | Access Level                                                                     |
| ---------- | -------------------------------------------------------------------------------- |
| Guest      | Browse public listings, view property details, contact agent via public form     |
| Auth User  | Save favorites, submit inquiries, access personal dashboard                      |
| Agent      | Create and manage listings, manage leads and inquiries, view agent dashboard     |
| Admin      | Manage all users, listings, agents, reports; access full admin dashboard         |
| Super Admin| Full platform access: tenant management, system settings, role assignment        |

## Core User Flows

### Guest
1. Lands on the homepage.
2. Searches and filters properties.
3. Views property detail page.
4. Contacts the agent via a public contact form.

### Authenticated User
1. Signs in or registers.
2. Browses and saves favorite properties.
3. Submits inquiries to agents.
4. Views their dashboard: saved properties, submitted inquiries, profile settings.

### Agent
1. Signs in as an agent.
2. Creates and publishes property listings.
3. Manages existing listings (edit, archive, delete).
4. Reviews and responds to buyer/renter inquiries.
5. Views leads and analytics on their agent dashboard.

### Admin
1. Signs in to the admin panel.
2. Reviews and approves or rejects agent listings.
3. Manages users: view, suspend, or delete accounts.
4. Monitors platform activity and reports.
5. Views aggregate analytics.

### Super Admin
1. All Admin capabilities.
2. Manages platform-level settings and configuration.
3. Assigns and revokes admin roles.
4. Accesses multi-tenant management (if applicable).

## Key Features

### Public / Discovery
- Homepage with hero search, featured listings, and category browsing.
- Property search with filters: location, type, price range, bedrooms, bathrooms, size.
- Property listing grid and map view.
- Property detail page: photos gallery, description, specs, agent contact form.
- Neighborhood and area guides (future).

### Authentication & Accounts
- Email/password registration and login.
- OAuth (Google) login.
- Role-based access control on all routes.
- Email verification flow.
- Password reset flow.

### User Dashboard
- Saved / favorited properties.
- Submitted inquiry history.
- Profile settings and notification preferences.

### Agent Dashboard
- My listings: active, draft, archived.
- Create / edit listing form with media upload.
- Leads and inquiry inbox.
- Basic listing analytics: views, inquiries, saves.
- Agent public profile page.

### Admin Dashboard
- User management table: filter by role, search, suspend/activate.
- Listing management: review pending, approve/reject, filter all.
- Platform analytics: active users, listing count, inquiry count, revenue (future).
- Reports and flagged content review.

### Super Admin Panel
- All admin capabilities.
- Platform configuration: categories, regions, feature flags.
- Role management: assign admin / agent roles.
- System health and audit logs.

## Technology Context

- **Frontend**: Next.js 16 + TypeScript, Tailwind CSS v4, shadcn/ui, Lucide React.
- **Backend** (later): Next.js API routes (`app/api`), MongoDB.
- **Auth** (later): NextAuth.js or custom JWT.
- **Storage** (later): MongoDB for all data; file storage TBD.

## Scope — Phase 1 (Frontend UI)

### In Scope
- All pages listed in `ui-context.md` built as static / mockable UI.
- Complete design system: tokens, fonts, color palette.
- All role-specific dashboards as UI shells (no live data yet).
- Responsive layouts for desktop and mobile.
- Accessible, semantic HTML throughout.

### Out Of Scope (Phase 1)
- Real authentication (mocked only).
- Database queries and API routes (backend phase).
- Payment or subscription systems.
- AI-powered features.
- Email sending.
- File uploads (form UI only, no actual upload).

## Success Criteria

1. Every page described in `ui-context.md` is implemented and visually polished.
2. All five role dashboards render without errors.
3. The design system tokens are applied consistently — no hardcoded hex values in components.
4. The site is responsive from 375px to 1440px+.
5. `progress-tracker.md` accurately reflects what has been built.
