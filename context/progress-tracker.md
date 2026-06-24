# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

---

## Current Phase

**Phase 2 — Backend API Development & Integration**

## Current Goal

Implement, test, and integrate backend API routes (Next.js API Routes / Mongoose schemas) and wire the frontend screens to live data.

---

## Completed

- [x] API Spec Sheets created and defined for all 4 backend modules:
  - [module-1-auth.md](file:///Users/minhaz/Documents/projects/brand/brand-estate/context/api-specs/module-1-auth.md) (Auth & User Management)
  - [module-2-properties.md](file:///Users/minhaz/Documents/projects/brand/brand-estate/context/api-specs/module-2-properties.md) (Properties & Search Engine)
  - [module-3-blogs.md](file:///Users/minhaz/Documents/projects/brand/brand-estate/context/api-specs/module-3-blogs.md) (Blogs CMS)
  - [module-4-platform.md](file:///Users/minhaz/Documents/projects/brand/brand-estate/context/api-specs/module-4-platform.md) (Platform services, Settings, Analytics, Inquiries)

- [x] Context files fully rewritten for Brand Estate real estate SaaS platform.
- [x] Stack confirmed: Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide React.
- [x] `project-overview.md` — product goals, user roles, feature list, phase 1 scope defined.
- [x] `architecture-context.md` — directory structure, route/role matrix, data interfaces, invariants.
- [x] `ui-context.md` — color palette (affsflow-inspired), Playfair Display + Montserrat fonts, page inventory.
- [x] `code-standards.md` — TypeScript, styling, font, component, cn() usage rules.
- [x] `ai-workflow-rules.md` — spec-driven cycle, spec format, spec numbering, phase separation.
- [x] `progress-tracker.md` — this file, reset and updated.
- [x] **Spec 01 — Design System COMPLETE** ✅
  - [x] `app/globals.css` rewritten: Brand Estate light + dark tokens, shadcn semantic overrides, `@theme inline` mappings, base layer, utility animations.
  - [x] `app/layout.tsx` updated: Playfair Display + Montserrat via `next/font/google`, SEO metadata.
  - [x] `lib/types.ts` created: UserRole, Property, Agent, Inquiry, all core interfaces.
  - [x] `lib/constants.ts` created: role labels, property types, price ranges, amenities, nav links.
  - [x] `lib/utils.ts` with `cn()` — already present, verified.
  - [x] All 15 shadcn/ui components installed: Button, Card, Dialog, Input, Textarea, Tabs, ScrollArea, Badge, Select, Separator, Avatar, DropdownMenu, Table, Sheet, Skeleton.
  - [x] `npm run build` ✅ — zero TypeScript errors, zero lint errors, clean production build.
- [x] **Spec 02 — Root Layout & Navigation COMPLETE** ✅
  - [x] Created `ThemeProvider` for zero-dependency theme management.
  - [x] Created `ThemeToggle` dropdown using shadcn primitives.
  - [x] Created unified `SearchModal` supporting tabbed search & country filtering.
  - [x] Created geolocating `LocationSelector` using client-side lookup.
  - [x] Created responsive Navbar and mobile navigation drawer, and polished responsiveness for all devices perfectly.
  - [x] Refined Navbar and LocationSelector responsiveness to prevent layout overflow on tablets (shifting desktop nav to hamburger drawer under 1024px) and mobile screens (hiding location label on mobile, adjusting button padding, and dynamic drawer widths).
  - [x] Upgraded Navbar with interactive hover-triggered glassmorphic mega menus (Buy, Rent, Sell) and collapsible mobile drawer accordions.
  - [x] Created content-rich semantic Footer with social icon SVGs.
  - [x] Integrated header, footer, and FOUC prevention in `app/layout.tsx`.
  - [x] **Spec 10 — Homepage COMPLETE** ✅
  - [x] Swapped data usage to the high-fidelity `src/mocks/propertiesMock.ts` database.
  - [x] Refined `HeroSection` with a floating glassmorphic container overlay on the left background image.
  - [x] Developed the `CategorySlider` component featuring a scroll-snap horizontal list with manual chevron navigation and responsive touch swipe.
  - [x] Developed the `FeaturedProperties` grid rendering 4 dynamic cards aligned with base and discriminator properties.
  - [x] Redesigned the `WhyChooseUs` component using a 4-column, 2-row asymmetrical grid matching the layout image screenshot, styled with a deep dark navy background (`bg-accent-navy`) matching the CTA section, with 5 consolidated benefit cards and dynamic HSL glassmorphic color themes (Rose, Sky, Amber, Slate).
  - [x] Developed the `CtaSection` component containing a marketing banner and buttons utilizing animated conic rotating-gradient border outlines.
  - [x] Maintained 100% build stability with Next.js Turbopack compilation.
- [x] **Spec 00 — Mock Data Schema Upgraded (2026-06-08)** ✅
  - [x] Completely redesigned the mock data schema to the full production-ready specification.
  - [x] `src/mocks/propertyTypes.ts` — new master type file: `BaseProperty`, 4 discriminator interfaces, `GeoPoint` (_geo for Meilisearch), `TaxHistoryEntry`, `PriceHistoryEntry`, `PropertySEO`, `ListerProfile`, `ApartmentAttributes`, `HouseAttributes`, `RoomShareAttributes`, `CommercialAttributes`, and all enums.
  - [x] `src/mocks/apartmentsMock.ts` — 6 entries (NYC buy, Tokyo rent, Dubai buy, London rent, Singapore rent, Paris buy).
  - [x] `src/mocks/housesMock.ts` — 5 entries (Malibu buy, Toronto buy, Hamptons rent, Melbourne buy, Austin buy). All roofType/foundationType/heatingCoolingSystem/backyardArea attributes populated.
  - [x] `src/mocks/roomSharesMock.ts` — 5 entries (London, Sydney, NYC, Berlin, Singapore). All roomType/bathroomType/preferredGender/utilitiesIncluded/minimumLeasePeriod attributes populated.
  - [x] `src/mocks/commercialMock.ts` — 5 entries covering all 4 zoning codes (retail×2, office, industrial, warehouse). All ceilingHeight/loadingDocks/electricalCapacity attributes populated.
  - [x] `src/mocks/propertiesMock.ts` — Barrel re-export with aggregated `mockProperties` (21 total) + `mockFeaturedProperties`, `mockPropertiesForSale`, `mockPropertiesForRent`, `mockActiveProperties` convenience filters.
- [x] **Spec 11 — Property Search Page COMPLETE** ✅
  - [x] Integrated client-side filters sidebar with immediate router-driven URL param updates.
  - [x] Enhanced filters sidebar: added independent scrolling container with `overscroll-contain`, smooth custom scrollbars, animated accordion collapse transitions, and polished premium styles.
  - [x] Created `PropertySortBar` providing sort options, list/grid toggle, and results count.
  - [x] Designed `PropertyGrid` supporting grid/list card templates, with `EmptyState` fallback.
  - [x] Wired pagination and parsed RawSearchParams using dynamic Next.js 16 routing conventions.
- [x] **Spec 12 — Property Detail Page COMPLETE** ✅
  - [x] Created `PropertyGallery` displaying full viewport hero images, navigation, and dialogs for YouTube and Matterport 3D Tours.
  - [x] Created `PropertySpecs` rendering general features and category-specific (discriminator) tables.
  - [x] Created `PropertyPriceHistory` showing Realtor.com vertical event timelines and Redfin tax histories.
  - [x] Created `AgentContactCard` offering quick call/email triggers and validation-hardened inquiry forms.
  - [x] Integrated `RelatedListings` to show up to 4 active similar listings.
- [x] **Spec 04 — Property Investment Calculator COMPLETE** ✅
  - [x] Created `components/property/investment-calculator.tsx` with dynamic price/rent/appreciation sliders.
  - [x] Implemented 10-year asset projections and cumulative yield outputs.
  - [x] Connected closing cost estimators (taxes, title, legal) that scale dynamically with the selected purchase price.
  - [x] Added clickable zoning reference tabs supporting MU-R, O-C, I-L, and W-D zoning codes.
  - [x] Integrated component on the homepage `app/page.tsx` directly above `CtaSection`.
  - [x] Verified full light and dark mode responsive compatibility.
- [x] **Spec 05 — Blog Post Schema, Mock Data & UI Components COMPLETE** ✅
  - [x] Created [blogTypes.ts](file:///Users/minhaz/Documents/projects/brand/brand-estate/src/mocks/blogTypes.ts) defining core interfaces for `BlogPost`, `BlogAuthor`, and `BlogSEO`.
  - [x] Updated [types.ts](file:///Users/minhaz/Documents/projects/brand/brand-estate/lib/types.ts) to export blog structures for application-wide accessibility.
  - [x] Created [blogPostsMock.ts](file:///Users/minhaz/Documents/projects/brand/brand-estate/src/mocks/blogPostsMock.ts) exporting 5 highly detailed and realistic real estate mock articles.
  - [x] Implemented Schema.org compliant structured data generator `generateBlogPostJsonLd` for search engine compatibility.
  - [x] Developed [blog-card.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/components/shared/blog-card.tsx) with responsive structures and HSL category themes.
  - [x] Integrated [blogs-section.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/components/shared/blogs-section.tsx) on the homepage.
  - [x] Built [page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/blogs/page.tsx) listings page with tab filtering and [blog-search-input.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/blogs/blog-search-input.tsx).
  - [x] Built [page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/blogs/%5Bslug%5D/page.tsx) reader page with a custom Markdown & formula parser, related recommendations, and sidebar widgets ([share-buttons.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/components/blog/share-buttons.tsx), [newsletter-form.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/components/blog/newsletter-form.tsx)).
  - [x] Hardened light and dark mode colors across the entire blog reader page.
- [x] **Spec 20 — Auth Pages (Login, Register, Forgot/Reset Password) COMPLETE** ✅
  - [x] Created `lib/auth-context.tsx` with mock AuthProvider + useAuth hook (localStorage session, 4 demo roles)
  - [x] Created `components/layout/conditional-layout.tsx` — conditionally hides Navbar/Footer on auth routes
  - [x] Updated `app/layout.tsx` — wrapped with AuthProvider + Sonner Toaster
  - [x] Created `components/layout/auth-layout-shell.tsx` — premium split-panel shell with testimonial carousel, trust stats, animated glow orbs
  - [x] Created `app/(auth)/login/page.tsx` — demo account tiles, form validation, password toggle, Google OAuth mock, sonner toasts
  - [x] Created `app/(auth)/register/page.tsx` — interactive role selector cards (Buyer/Agent), password strength meter, confirm match indicator, sonner toasts
  - [x] Created `app/(auth)/forgot-password/page.tsx` — 60s resend countdown, animated MailCheck success card, sonner toasts
  - [x] Created `app/(auth)/reset-password/page.tsx` — token validation, invalid/success states, auto-redirect, sonner toasts
  - [x] Updated `components/layout/navbar.tsx` — authenticated user avatar dropdown with role badge, dashboard link, logout; mobile drawer parity
  - [x] Installed and fixed `components/ui/sonner.tsx` — patched to use custom useTheme instead of next-themes
  - [x] `npm run build` ✅ — zero TypeScript errors, zero lint errors, all 10 routes generated
- [x] **Spec 13 — Agent Directory Page (`/agents`) COMPLETE** ✅
  - [x] Created `src/mocks/agentsMock.ts` — 8 rich mock agents (NYC, London, Dubai, Berlin, LA, Singapore, Sydney, Toronto) with bios, reviews, certifications, specializations, cover images, Unsplash avatars
  - [x] Created `app/agents/page.tsx` — server component with SEO metadata
  - [x] Created `app/agents/agents-client.tsx` — dark hero with animated search, specialty filter pills, sort dropdown, 4-column responsive agent card grid, trust stats bar, empty state, CTA banner
  - [x] `npm run build` ✅ — 19 routes, zero TypeScript errors
- [x] **Spec 14 — Agent Public Profile Page (`/agents/[slug]`) COMPLETE** ✅
  - [x] Created `app/agents/[slug]/page.tsx` — server component with `generateStaticParams` (8 static paths) and per-agent OpenGraph metadata
  - [x] Created `app/agents/[slug]/agent-profile-client.tsx` — hero cover with back/share/save actions, bridging avatar + verified badge, 4 stat cards, full bio section, specializations + languages chips, certifications + license, reviews with rating breakdown bars, sticky sidebar contact form (validation + sonner toasts), quick contact info, social links, related agents row
  - [x] All 8 agent profiles statically pre-rendered at build time
- [x] **Specs 30-33 — User Dashboard COMPLETE** ✅
  - [x] Home `/dashboard` — Stats grid, saved trends chart, list of active inquiries
  - [x] Saved Listings `/dashboard/saved` — Active properties grid, unsave buttons with toast indicators
  - [x] Inquiries `/dashboard/inquiries` — Split filter table, slide-over details drawer showing conversation threads, Mark as Resolved action
  - [x] Profile `/dashboard/profile` — Multi-section form validation, password update dialog, notifications settings toggle list
- [x] **Specs 40-43 — Agent Workspace COMPLETE** ✅
  - [x] Home `/agent/dashboard` — Leads mailbox preview, active listings stats, Recharts visual analytics
  - [x] Listings `/agent/listings` — Interactive status tabular list, edit links, archive/delete triggers mapped to sold/rented status
  - [x] New Listing `/agent/listings/new` — 5-step interactive wizard form (Basic details, Location, Amenities, Upload assets mockup, Publish)
  - [x] Leads Registry `/agent/leads` — Master-detail mailbox panels, inline quick-response textareas with success notifications
- [x] **Specs 50-53 — Moderator Admin Workspace COMPLETE** ✅
  - [x] Home `/admin/dashboard` — Registration trend charts, pending approvals queue, operational counters
  - [x] Users `/admin/users` — Role-based directory, account ban/unban toggles, detail inspector modals
  - [x] Queue `/admin/listings` — Review submissions, Approve / Reject inline action controls
  - [x] Disputes `/admin/reports` — Violations list, detailed slide-over report drawer with dismissal action
- [x] **Specs 60-62 — Super Admin Platform Console COMPLETE** ✅
  - [x] Home `/super-admin/dashboard` — Security audit logs, terminal events registry, configuration summaries
  - [x] Roles Registry `/super-admin/roles` — Role upgrade selectors, mandatory audit justification textareas
  - [x] Configs `/super-admin/settings` — Feature flag toggle switchboard, country regions directories manager, danger operations console
- [x] **Public Pages (About & Contact) COMPLETE** ✅
  - [x] About `/about` — Modern light-themed timeline, core company vision, interactive team profiles
  - [x] Contact `/contact` — Leaflet style mapping dashboard card, support inquiry forms validation
- [x] **Property Listing Schema, Creation Wizard & Details Page Modernization COMPLETE** ✅
  - [x] Reviewed property listing schema and added optional keywords list attribute to `PropertySEO` across models and mocks.
  - [x] Expanded the new listing creation wizard form from 5 to 6 steps to introduce a dedicated **SEO Settings** panel.
  - [x] Replaced Beds and Baths raw text typing inputs in Step 3 with horizontal **Chip Button Toggles** (Studio to 5+ beds, 1 to 4+ baths).
  - [x] Integrated premium `<ImageUploader>` media component for the Cover Image, and built a dynamic gallery builder grid in Step 4 with delete overlays and file input loaders.
  - [x] Added Title and Meta Description inputs with character counter limits, TagInput search keyword tags, and an automated Cover-to-OG Image sync switch in Step 5.
  - [x] Created a realistic **Google Search snippet SERP visual preview widget** and extended the final review details card in Step 6.
  - [x] Modernized the public **Property Details Page** (`app/property/[slug]/page.tsx`):
    - Synchronized the area/size icon to use the `<Ruler className="rotate-90" />` component matching the listing `<PropertyCard>`.
    - Displayed dynamic search tag badges (keywords) directly under the title category row.
    - Integrated a dynamic "Amenities & Facilities" section rendering checkboxes with the `<Check>` icon.
    - Polished the pricing details card with glassmorphism gradients, shadows, and clean sans-serif Montserrat typography for the price elements.
  - [x] Completed TypeScript compilation checks (`npx tsc --noEmit`), lint checks (`npm run lint`), and Next.js production builds (`npm run build`) successfully with zero compile errors.
- [x] **Specs 80–83 — Module 1: Auth & User Management API COMPLETE** ✅
  - [x] Installed backend dependencies: `mongoose`, `bcryptjs`, `resend`, `jsonwebtoken` + their types.
  - [x] Created `lib/db/mongoose.ts` — singleton cached MongoDB connection (hot-reload safe).
  - [x] Created `lib/db/models/user.model.ts` — full Mongoose `UserSchema` per spec: name, email, hashed password, role enum, avatar, isVerified, verificationToken/Expires, resetPasswordToken/Expires, savedProperties refs, timestamps.
  - [x] Created `lib/auth/validation.ts` — `validateEmail()` and `validatePassword()` (8+ chars, digit required).
  - [x] Created `lib/auth/tokens.ts` — `generateVerificationToken()`, `generateResetToken()`, `hoursFromNow()` using Node crypto.
  - [x] Created `lib/auth/mailer.ts` — branded HTML email templates via Resend for verification and reset flows.
  - [x] Created `app/api/auth/register/route.ts` — POST: validates input, checks duplicate email, bcrypt(12) hashes password, generates 24hr verification token, persists to MongoDB, fires verification email.
  - [x] Created `app/api/auth/verify-email/route.ts` — GET: finds user by token where expiry > now, activates account, clears token fields.
  - [x] Created `app/api/auth/forgot-password/route.ts` — POST: anti-enumeration (always 200), generates 1hr reset token, sends reset email; 500 on mailer failure.
  - [x] Created `app/api/auth/reset-password/route.ts` — POST: validates token + password strength + match, bcrypt(12) hashes new password, clears token fields.
  - [x] Created `.env.local` with MONGODB_URI, RESEND_API_KEY, JWT_SECRET, NEXT_PUBLIC_APP_URL placeholders.
- **Specs 84 & 85 — Module 2: Properties Schema & APIs COMPLETE** ✅
- [x] **Specs 84 & 85 — Module 2: Properties Schema & APIs COMPLETE** ✅
  - [x] Created `lib/db/models/property.model.ts` — defined Mongoose `PropertySchema` containing common base fields and category-specific (discriminator) blocks (`apartment`, `house`, `roomShare`, `commercial`).
  - [x] Created `app/api/properties/seed/route.ts` — developer endpoint seeding agents and 21 listings to MongoDB.
  - [x] Created properties list & create route `app/api/properties/route.ts` supporting paginated query filtering and POST creation.
  - [x] Created mutation routes `app/api/properties/[idOrSlug]/route.ts` supporting details retrieval, permissioned updates (owner/admin), and deletion.
  - [x] Created status control route `app/api/properties/[idOrSlug]/archive/route.ts` for toggling listing archives (sold/rented).
  - [x] Created geo search route `app/api/properties/map/route.ts` checking neLat/neLng/swLat/swLng bounding boxes.
  - [x] Updated agent creation and edit forms (`new-listing-client.tsx` and `edit-listing-client.tsx`) to dynamically display and gather category-specific spec metadata.
  - [x] Wired agent directory, detail pages, and dashboards to real MongoDB endpoints.
  - [x] Completed compilation checks (`npx tsc --noEmit`) and resolved all TypeScript-eslint explicit `any` and type mismatches.
- [x] **Specs 89 & 91 — Saved Listings & Dashboards Analytics COMPLETE** ✅
  - [x] Created Mongoose `Inquiry` schema in `lib/db/models/inquiry.model.ts` to allow database-backed inquiry queries.
  - [x] Created saved listings API routes (`GET /api/users/me/saved`, `POST /api/users/me/saved`, and `DELETE /api/users/me/saved/[id]`) updating user's favorite listings references.
  - [x] Created listing view tracker route `POST /api/properties/[idOrSlug]/view` incrementing traffic views.
  - [x] Created agent analytics aggregator `GET /api/analytics/agent` for active/draft counts, total saves, views, and inquiries.
  - [x] Created admin analytics aggregator `GET /api/analytics/admin` for platform totals and monthly signups trends.
  - [x] Integrated buyer dashboard saved listings page (`saved-page-client.tsx`) to load/remove listings and support undo restorations.
  - [x] Integrated agent dashboard overview (`agent-dashboard-client.tsx`) stats, timeline Recharts, and popular listings.
  - [x] Integrated admin listings moderation queue (`listings-management.tsx`) and admin dashboard overview (`admin-dashboard-client.tsx`) pending review list.
- [x] **Spec 86 & 87 — Module 3: Blogs CMS API & Client Integration COMPLETE** ✅
  - [x] Created Mongoose model `BlogPost` in `lib/db/models/blog-post.model.ts` with sub-schemas for author and SEO metadata and atomic reactions map.
  - [x] Created seed endpoint `/api/blogs/seed` to populate DB with mock articles and mock users.
  - [x] Developed list/create endpoint `/api/blogs` with visibility filter rules based on session role.
  - [x] Developed individual routes `/api/blogs/[idOrSlug]`, review endpoint `/api/blogs/[idOrSlug]/review`, and reaction atomic increment route `/api/blogs/[idOrSlug]/react`.
  - [x] Connected React `BlogProvider` state hooks context to real MongoDB API endpoints.

---

## In Progress

- None

---

## Next Up (Ordered)

Phase 2 specs to be defined and implemented in order:

| Spec  | Name                              | Status  |
| ----- | --------------------------------- | ------- |
| 80    | Database Connection & User Schema | ✅ Done |
| 81    | Authentication JWT & Register Route| ✅ Done |
| 82    | Email Verification (Resend)       | ✅ Done |
| 83    | Password Recovery (Forgot/Reset)  | ✅ Done |
| 84    | Property Schema & Filter API      | ✅ Done |
| 85    | Property Mutations & Geo Search   | ✅ Done |
| 86    | Blogs Schema & Public Read APIs   | ✅ Done |
| 87    | Blog Mutations & Reactions API    | ✅ Done |
| 88    | Inquiries Inbox & Messaging API   | ⏳ Pending |
| 89    | Saved Listings & Pricing Packages | ✅ Done |
| 90    | Platform Settings & Verification   | ⏳ Pending |
| 91    | Admin & Agent Analytics API       | ✅ Done |
| 92    | Super Admin Security Audit Logs   | ⏳ Pending |

### Completed Phase 1 Specs

| Spec  | Name                              | Status  |
| ----- | --------------------------------- | ------- |
| 00    | Mock Listing Data                 | ✅ Done |
| 01    | Design System & Tokens            | ✅ Done |
| 02    | Root Layout & Navigation (Navbar, Footer) | ✅ Done |
| 05    | Blog Post Schema & Mock Data      | ✅ Done |
| 10    | Homepage                          | ✅ Done |
| 11    | Property Search Page              | ✅ Done |
| 12    | Property Detail Page              | ✅ Done |
| 13    | Agent Directory Page              | ✅ Done |
| 14    | Agent Public Profile Page         | ✅ Done |
| 20    | Login Page                        | ✅ Done |
| 21    | Register Page                     | ✅ Done |
| 22    | Forgot / Reset Password Pages     | ✅ Done |
| 30    | User Dashboard Home               | ✅ Done |
| 31    | Saved Properties Page             | ✅ Done |
| 32    | My Inquiries Page                 | ✅ Done |
| 33    | Profile Settings Page             | ✅ Done |
| 40    | Agent Dashboard Home              | ✅ Done |
| 41    | My Listings Page                  | ✅ Done |
| 42    | Create / Edit Listing Form        | ✅ Done |
| 43    | Agent Leads / Inquiry Inbox       | ✅ Done |
| 50    | Admin Dashboard Home              | ✅ Done |
| 51    | Admin User Management             | ✅ Done |
| 52    | Admin Listing Management          | ✅ Done |
| 53    | Admin Reports                     | ✅ Done |
| 60    | Super Admin Dashboard             | ✅ Done |
| 61    | Role Management                   | ✅ Done |
| 62    | Platform Settings                 | ✅ Done |

---

## Open Questions

1. **Map integration**: Should the property map use a free tile provider (Leaflet + OpenStreetMap) or Google Maps? (Affects dependencies.)
2. **Property image placeholder**: Should we use a generated placeholder image or a real estate stock image for mock listings?
3. **Agent role self-registration**: Can users self-register as agents, or does an admin assign the agent role?
4. **About / Contact pages**: Are these in scope for Phase 1 or deferred?

---

## Architecture Decisions

- Stack is Next.js 16 App Router + TypeScript + Tailwind CSS v4 + shadcn/ui + Lucide React.
- Backend (MongoDB + API routes) is deferred to Phase 2.
- All data during Phase 1 is mocked via typed interfaces in `lib/types.ts` and `lib/mock-data.ts`.
- Color tokens: affsflow.com-inspired — navy `#080D16`, primary blue `#0067D2`, white `#FFFFFF`.
- Fonts: Playfair Display (headings) + Montserrat (body/UI).
- Admin/dashboard pages use the dark theme variant; public pages use the light theme.

---

## Session Notes

- Context files completely rewritten on 2026-06-06 to reflect Brand Estate real estate SaaS.
- Previous context was for "Alien AI" (system design canvas app) — fully replaced.
- Design system spec (`01`) needs to be updated to match the new color palette and fonts.
- Fixed hydration mismatch error on `InvestmentCalculator` component by rounding style width percentages to 4 decimal places.
- Replaced the plain `Square` icon with a `rotate-90` rotated `Ruler` icon in `PropertyCard` for high-fidelity size representation.
- Resolved workspace TypeScript compiler issues: fixed the `DropdownMenuItem` `asChild` -> `render` prop mapping in `DashboardShell`, fixed the missing `Link`, `cn`, `toast`, and `Zap` imports, resolved the `UserRole` mismatch in `RolesClient` state, and mapped `"archived"` listings filter to `"sold"` / `"rented"` statuses to match `PropertyStatus`.
- Fixed a Base UI runtime error by updating `DropdownMenuLabel` in `components/ui/dropdown-menu.tsx` to render as a native HTML `div` instead of `MenuPrimitive.GroupLabel`, avoiding the strict `MenuGroupContext` constraints.
- Verified production build compile stability (`npm run build`) with zero TypeScript/lint compile errors across all 39 routes.
- Refactored the remaining admin panel dashboards (`app/admin/reports/reports-client.tsx` and `app/admin/packages/packages-client.tsx`) to support dynamic light/dark mode using theme-aware HSL custom variables.
- Resolved structural syntax errors in the slide-over drawer in `app/admin/listings/listings-management.tsx` to restore complete project compilation.
- Upgraded the Admin Dashboard (`app/admin/dashboard/admin-dashboard-client.tsx`) to replace the static signups list with a live **Agent Credentials Verification** queue displaying submitted credentials, active/pending/suspended statuses, and status dropdown action buttons (including custom suspension reasons dialogue integration).
- Redesigned the User Inspector drawer buttons in `app/admin/users/users-client.tsx` to stack actions cleanly, filtered users to restrict admins from managing/viewing other admins or super admins, and hid admin role options in the roles dropdown selection for admin views.
- Developed the custom `DocumentViewer` component (`components/shared/document-viewer.tsx`) to allow inline document reviews (with zoom, rotate, download, and print features) without initiating file downloads, and integrated it on both the User Inspector drawer and Admin Dashboard agent credentials table.
- Upgraded the `DocumentViewer` component (`components/shared/document-viewer.tsx`) to resolve overlapping double close buttons by implementing native `DialogClose` triggers, increase modal width layout limits (`max-w-5xl` / `lg:max-w-6xl`), fix fullscreen layout and transform override issues, and ensure the entire viewer canvas, toolbar controls (`shrink-0` wrapper), and certificate text scaling render responsively on all screens from mobile up to desktop.
- Resolved 20 ESLint, React Hook order violations, and TypeScript errors across 11 files (including conditional hook declarations, unescaped entity bugs, unexpected `any` casts, and synchronous state setting in effects). Also resolved CSS display conflicts (`hidden xs:flex` to `hidden sm:flex` and removing redundant `block` from `block flex`) and fixed a class name typography syntax error (`text-accent-primaryshrink-0` to `text-accent-primary shrink-0`). Verified that `npx tsc --noEmit` and `npm run lint` compile successfully with zero errors, and successfully generated all 39 static and dynamic routes during a production build.
- Resolved two React 19 / Next.js layout errors: replaced the raw `<script>` tag inside `<head>` with the Next.js `Script` component with `strategy="beforeInteractive"` in `app/layout.tsx` to fix the client rendering script warning, and introduced an `isMounted` client-side guard in `components/layout/navbar.tsx` to prevent server-client hydration mismatch for authenticated/guest views.
- Implemented complete blog creation, moderation review, and reaction system (Spec 05 upgrade) across the public pages, member dashboard, agent workspace, and admin panel, supported by a localStorage-persisted blog store and verified type-safe and lint-safe.
- Extracted the visual tag editor into a reusable `TagInput` component ([tag-input.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/components/blog/tag-input.tsx)) and integrated it for both the Core Tags input and the SEO Target Keywords input inside `BlogForm`. Unifies the pro-UX tag editing (visual chip badges, inline typing, blur-save, paste-parsing, and search suggested checklist dropdowns) across both forms, reducing duplicate helper code and passing validation tests.
- Created reusable `ImageUploader` component ([image-uploader.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/components/blog/image-uploader.tsx)) that supports drag-and-drop file selections (producing instant client previews with simulated loading states) as well as text URL link inputs. Integrated it for both Cover Image and OpenGraph (OG) Image fields inside `BlogForm`.
- Added an automated toggle: "Use Cover Photo as Social Preview". By default, this is active and hides the OG Image selector, automatically syncing the Cover Image to the social metadata upon form submission. Toggling this off displays a custom `ImageUploader` for uploading/entering a unique OG preview thumbnail.
- Added agent profile linking to blog reader views ([blog-detail-client.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/blogs/[slug]/blog-detail-client.tsx)). If the author is an agent, matches them in the agent database. Logged-in users can click their name or card button to view their public profile `/agents/[slug]`. Guest users are blocked from viewing the profile, warned via a toast, and redirected to log in/register.
- **Module 1 Frontend Integration**: Wired all public auth pages to the real backend APIs. `app/(auth)/register/page.tsx` — calls `POST /api/auth/register`; on success renders an `EmailSentCard` (check inbox to verify) instead of redirecting to the dashboard. `app/(auth)/forgot-password/page.tsx` — calls `POST /api/auth/forgot-password` (real Resend email); removed `simulateSend`. `app/(auth)/reset-password/page.tsx` — calls `POST /api/auth/reset-password`; maps `InvalidOrExpiredToken` → `<InvalidTokenCard />`, `PasswordMismatch` → field error. Created `app/(auth)/verify-email/page.tsx` — calls `GET /api/auth/verify-email?token=…` on mount; 4 states: loading, success (auto-redirect 4s), error, missing token. Updated `lib/auth/mailer.ts` to point verification emails to `/verify-email?token=…` UI page. All changes pass `npx tsc --noEmit` and `npm run lint` with zero errors.
- **Module 1b Auth Session Integration**: Integrated full JWT-based cookie session management. Added signature & verification JWT helpers using the `be_auth_token` HttpOnly cookie. Implemented `POST /api/auth/login`, `GET /api/auth/me`, and `POST /api/auth/logout` handlers. Created root-level `proxy.ts` for server-side role-based route protection with instant decoding. Updated `lib/auth-context.tsx` to restore session via `/api/auth/me` on mount and support dual mock/API login paths. Fully integrated `AccountNotVerified` state in `app/(auth)/login/page.tsx` showing a premium inline alert reminder to check the verification inbox. Both linting (`npm run lint`) and type-checking (`npx tsc --noEmit`) pass clean with no errors.
- **Auth Security & Edge Runtime Audit**:
  - Resolved user verification state enumeration in [login/route.ts](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/api/auth/login/route.ts) by verifying passwords *before* revealing whether an email is verified or not.
  - Avoided Node.js-native library requirements inside Next.js Edge Middleware by implementing a zero-dependency Edge-compatible JWT verification utility in [edge-jwt.ts](file:///Users/minhaz/Documents/projects/brand/brand-estate/lib/auth/edge-jwt.ts) using the Web Crypto API (`crypto.subtle`), ensuring 100% Edge compliance and resolving compile/runtime errors.
- **Agent Legal Document Submission**:
  - Created new backend API route `POST /api/agent/submit-docs` (in [submit-docs/route.ts](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/api/agent/submit-docs/route.ts)) validating the JWT session, checking agent role, saving license number and agency information, and setting status to `pending`.
  - Updated `IUser` interface and Mongoose schema in [user.model.ts](file:///Users/minhaz/Documents/projects/brand/brand-estate/lib/db/models/user.model.ts) to define user statuses and legal documentation fields.
  - Wired client context `submitLegalDocs` helper in [auth-context.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/lib/auth-context.tsx) to call the real backend endpoint while maintaining local fallback functionality for demo seed accounts.
- **Document Viewer R2 Loading Fix**:
  - Enhanced the reusable [DocumentViewer](file:///Users/minhaz/Documents/projects/brand/brand-estate/components/shared/document-viewer.tsx) component to dynamically detect if `documentUrl` is a real remote URL (e.g. from the Cloudflare R2 bucket).
  - Wired the viewer to render PDFs inside an `iframe` element and images inside an `img` tag for live credential inspection by admins, while retaining the premium HTML/CSS certificate frame fallback for mock seed accounts.
  - Linked the download control helper to handle live R2 object downloads.
  - Obfuscated raw S3/R2 document URLs by removing them from print/download toast descriptions and appending `#toolbar=0` to the PDF iframe source to hide the browser's native PDF reader top toolbar.
- **Property Listing Fields Extension**:
  - Integrated `videoTourUrl`, `virtualTourUrl`, and `neighborhoodNotes` fields into the agent's "Create New Listing" and "Edit Listing" forms.
  - Updated Step 3 (Details & Specs) of the listing forms to include a "Neighborhood Notes" textarea input.
  - Updated Step 4 (Media Assets) of the listing forms to include input fields for "Video Tour URL" and "3D Virtual Tour URL".
  - Updated Step 5/6 (Review Summary Layout) of the listing forms to display preview values for the new fields.
  - Modified the properties creation API endpoint `POST /api/properties` to destructure and persist `neighborhoodNotes` inside MongoDB.
  - Linked all inputs into the creation and edit API request payloads.
- **Mock Data Layer & Mongoose Integration (2026-06-22)**:
  - Refactored the homepage to query properties directly from MongoDB and pass them as props to both `HeroSection` and `FeaturedProperties`.
  - Refactored `FeaturedProperties` and `HeroSection` to accept the dynamic `properties` prop.
  - Refactored the Agents Directory (`/agents`) to fetch active agent profiles directly from MongoDB and pass them to `AgentsClientPage`.
  - Refactored the Agent Detail Page (`/agents/[slug]`) to query the agent's profile by slug and fetch related agents from MongoDB dynamically, supporting fully dynamic parameters and metadata generation.
  - Refactored the Buyer Dashboard (`/dashboard`) to load the user's saved listings dynamically via the `/api/users/me/saved` endpoint, featuring custom loading skeletons and empty states.
  - Cleaned up unused mock imports across dashboards and client views.
- **Dynamic Amenities Icons**:
  - Replaced the static `<Check>` icon in the "Amenities & Facilities" section of the Property Details Page (`app/property/[slug]/page.tsx`) with dynamic icons resolved from amenity names (e.g. `Waves` for swimming pools, `Dumbbell` for gyms, `Car` for parking, `Trees` for gardens, etc.).
- **Removed Total Rooms Display**:
  - Removed "Total Rooms" row from the specs table in `components/property/property-specs.tsx` on the Property Details page.
- **Specifications Table Icons**:
  - Added Lucide icons (e.g. `Bed`, `Bath`, `Ruler`, `Calendar`) inline next to labels in the Key Information specifications list in `components/property/property-specs.tsx`.
- **Property Details Layout Updates**:
  - Rearranged the page header layout in `app/property/[slug]/page.tsx` to render the Title first, followed by the Location row (displaying the rich `formattedAddress`), and then the 4 specs columns (Bedrooms, Bathrooms, Area, Year Built) inside a structured grid.
  - Relocated the SEO Keywords Tag list from the header row to a card at the bottom of the right sticky sidebar column.
- **Blog Compose & Edit Pages Migration**:
  - Migrated the blog creation and edit forms from right-side popup Sheet drawers to dedicated full-page routes across all three workspace modules (Agent, Admin, and User):
    - **Agent**: Created `/agent/blogs/new` and `/agent/blogs/[id]/edit` pages.
    - **Admin**: Created `/admin/blogs/new` and `/admin/blogs/[id]/edit` pages.
    - **User**: Created `/dashboard/blogs/new` and `/dashboard/blogs/[id]/edit` pages.
  - Refactored `AgentBlogsClient`, `AdminBlogsClient`, and `UserBlogsClient` dashboards to navigate to the new page routes instead of managing open Sheet states and local inline form submissions.












