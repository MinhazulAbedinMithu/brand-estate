# Architecture Context

## Stack

| Layer        | Technology                     | Role                                                               |
| ------------ | ------------------------------ | ------------------------------------------------------------------ |
| Framework    | Next.js 16 + TypeScript        | Full-stack app with App Router, RSC by default                     |
| UI           | Tailwind CSS v4 + shadcn/ui    | Component composition, styling via CSS custom properties           |
| Icons        | Lucide React                   | Stroke-based icon system throughout                                |
| Database     | MongoDB (later phase)          | Primary data store: users, listings, inquiries, roles              |
| API          | Next.js API routes (`app/api`) | Backend endpoints — added in the backend phase                     |
| Auth         | NextAuth.js or custom JWT      | Session management — added in the backend phase                    |

## System Boundaries

- `app/` — Next.js App Router pages and layouts, organized by role and feature area.
- `app/api/` — API route handlers (backend phase only). Not created during frontend phase.
- `components/` — All UI components. Organized by domain: `ui/`, `layout/`, `property/`, `dashboard/`, `shared/`.
- `lib/` — Shared utilities: `cn()` helper, type guards, constants. No business logic.
- `context/` — Spec and documentation files only. Not imported by application code.

## Directory Structure (Frontend Phase)

```
app/
  (public)/           # Guest-accessible pages
    page.tsx          # Homepage
    properties/       # Property search & listing
    property/[id]/    # Property detail
    agents/           # Agent directory
    about/
    contact/
  (auth)/             # Auth flows
    login/
    register/
    forgot-password/
  dashboard/          # Authenticated user dashboard
  agent/              # Agent workspace
    dashboard/
    listings/
    leads/
  admin/              # Admin panel
    dashboard/
    users/
    listings/
  super-admin/        # Super admin panel
    dashboard/
    settings/
    roles/
  layout.tsx          # Root layout with font + theme providers
  globals.css         # Design system tokens + base styles

components/
  ui/                 # shadcn/ui primitives (do not modify)
  layout/             # Navbar, Footer, Sidebar, MobileMenu
  property/           # PropertyCard, PropertyGrid, PropertyMap, PropertyForm
  dashboard/          # DashboardNav, StatCard, InquiryTable, LeadCard
  shared/             # SearchBar, FilterPanel, Pagination, EmptyState, Badge

lib/
  utils.ts            # cn() helper and shared type utilities
  constants.ts        # App-wide constants (roles, property types, etc.)
  types.ts            # Shared TypeScript interfaces and enums
```

## Role-Based Route Access

| Route Prefix    | Allowed Roles                         |
| --------------- | ------------------------------------- |
| `/`             | Guest, Auth User, Agent, Admin, SA    |
| `/properties`   | Guest, Auth User, Agent, Admin, SA    |
| `/dashboard`    | Auth User, Agent, Admin, SA           |
| `/agent/*`      | Agent, Admin, SA                      |
| `/admin/*`      | Admin, SA                             |
| `/super-admin/*`| Super Admin only                      |

During the frontend phase, role-based guards are mocked via a local state context. Real enforcement is added in the backend phase.

## Data Model (Frontend Phase — Mock Only)

All data is mocked via TypeScript interfaces. No database queries exist yet.

### Key Interfaces

```typescript
// User roles
type UserRole = 'guest' | 'auth_user' | 'agent' | 'admin' | 'super_admin';

// Property listing
interface Property {
  id: string;
  title: string;
  description: string;
  type: 'sale' | 'rent';
  propertyType: 'apartment' | 'house' | 'villa' | 'commercial' | 'land';
  price: number;
  location: { city: string; area: string; address: string; lat?: number; lng?: number };
  bedrooms: number;
  bathrooms: number;
  area: number; // sq ft
  images: string[];
  agentId: string;
  status: 'active' | 'pending' | 'archived' | 'rejected';
  featured: boolean;
  createdAt: string;
}

// User
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  savedProperties?: string[];
}

// Inquiry
interface Inquiry {
  id: string;
  propertyId: string;
  userId: string;
  agentId: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}
```

These interfaces live in `lib/types.ts` and are used across components.

## Storage Model (Backend Phase — Planned)

- **MongoDB**: all user records, property listings, inquiries, roles, session tokens.
- **File Storage**: property images stored in a CDN or object store (TBD).
- MongoDB document references are by `_id` (string).
- All API routes validate ownership before mutations.

## Auth and Access Control (Backend Phase — Planned)

- Session-based or JWT authentication via NextAuth.js.
- Every protected route checks session role server-side.
- API routes enforce role checks before any data mutation.

## Invariants

1. During the frontend phase, no API routes, database queries, or auth systems are implemented.
2. All page and component data is typed against interfaces in `lib/types.ts`.
3. Components do not contain business logic — they render props and call passed-in handlers.
4. `components/ui/*` shadcn primitives are never modified after installation.
5. Design system tokens (CSS variables) are always used — no hardcoded hex values in component files.
6. Every page is server-rendered by default; `"use client"` only where browser interaction is required.
