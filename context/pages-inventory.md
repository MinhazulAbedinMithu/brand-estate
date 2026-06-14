# Brand Estate — Pages Inventory & Next Phase Tracking

This inventory serves as a master reference sheet for **Phase 2 (Backend Integration)**. It maps all existing Next.js App Router frontend routes, defines their entry points, lists their UI components, and logs the database models, API endpoints, and security rules needed to connect each page to live data.

---

## Index of Roles & Route Layouts

We have structured the application layout patterns around role-based secure boundaries:
1. **Public/Guest Shell**: Uses the default light theme (`bg-[#FFFFFF]`). Contains the sticky blur Navbar and Footer.
2. **Secure Workspaces (User, Agent, Admin, Super Admin)**: Enforces a unified premium dark theme layout (`bg-[#080D16]`). Integrates a left navigation sidebar, notifications panel, user avatar menu, and workspace role simulator.

---

## 1. Public & Discovery Pages (Guest & All Roles)
Guest-accessible discovery catalog routes. Theme: **Light**.

### 1.1 Homepage
* **Route**: `/`
* **File Entry**: [app/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/page.tsx)
* **Key UI Components**: `HeroSection`, `CategorySlider`, `FeaturedProperties`, `WhyChooseUs`, `InvestmentCalculator`, `CtaSection`
* **Phase 2 Backend Goals**:
  - **Database Queries**: Retrieve top 4 `featured` listings from `listings` collection. Retrieve statistics counters.
  - **API Endpoints**: `GET /api/properties?featured=true`
  - **Auth Guards**: Public (None).

### 1.2 Property Search & Filters
* **Route**: `/properties`
* **File Entry**: [app/properties/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/properties/page.tsx)
* **Key UI Components**: `SearchFilterSidebar` (Immediate query binding), `PropertySortBar`, `PropertyGrid`, `EmptyState`
* **Phase 2 Backend Goals**:
  - **Database Queries**: Filter list properties matching URL query parameters (`city`, `minPrice`, `maxPrice`, `bedrooms`, `bathrooms`, `category`, `listingType`). Paginate results.
  - **API Endpoints**: `GET /api/properties` (integrating indexing like Meilisearch or MongoDB Atlas Search).
  - **Auth Guards**: Public (None).

### 1.3 Property Detail Page
* **Route**: `/property/[slug]`
* **File Entry**: [app/property/[slug]/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/property/[slug]/page.tsx)
* **Key UI Components**: `PropertyGallery` (YouTube/Matterport 3D), `PropertySpecs`, `PropertyPriceHistory` (TIMELINE events), `AgentContactCard` (Inquiry Form submission), `RelatedListings`
* **Phase 2 Backend Goals**:
  - **Database Queries**: Retrieve detailed listing document by unique `slug` string, including linked agent metadata.
  - **API Endpoints**: 
    - `GET /api/properties/[slug]`
    - `POST /api/inquiries` (Inserts client message, generates alert notification for the listing agent).
  - **Auth Guards**: Public (None). Anonymous email validation for guest inquiries; session binding for logged-in inquiries.

### 1.4 Agent Directory
* **Route**: `/agents`
* **File Entry**: [app/agents/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/agents/page.tsx)
* **Key UI Components**: `AgentsClientHero`, `AgentCardGrid`, `TrustStatsBar`
* **Phase 2 Backend Goals**:
  - **Database Queries**: Retrieve list of active agents, their dynamic rating averages, and listing counters.
  - **API Endpoints**: `GET /api/agents`
  - **Auth Guards**: Public (None).

### 1.5 Agent Public Profile
* **Route**: `/agents/[slug]`
* **File Entry**: [app/agents/[slug]/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/agents/[slug]/page.tsx)
* **Key UI Components**: `AgentProfileCover`, `BioSection`, `LanguagesChips`, `CertificationsTable`, `ReviewsBreakdown`, `AgentContactForm`, `RelatedAgents`
* **Phase 2 Backend Goals**:
  - **Database Queries**: Retrieve specific agent profile, list of related properties, and list of client review sub-documents.
  - **API Endpoints**: 
    - `GET /api/agents/[slug]`
    - `POST /api/agents/[slug]/reviews` (Submit rating review).
  - **Auth Guards**: Profile view is public. Submitting reviews requires authenticated session (`auth_user`).

### 1.6 About Us
* **Route**: `/about`
* **File Entry**: [app/about/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/about/page.tsx)
* **Key UI Components**: `CompanyTimeline`, `MetricsCounter`, `TeamGrid`
* **Phase 2 Backend Goals**: Static UI. Prerendered page.

### 1.7 Contact Us
* **Route**: `/contact`
* **File Entry**: [app/contact/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/contact/page.tsx)
* **Key UI Components**: `FeedbackForm`, `AddressGrid`, `MapCard`
* **Phase 2 Backend Goals**:
  - **API Endpoints**: `POST /api/support` (Forwards user feedback messages to site support team logs or email dispatcher).
  - **Auth Guards**: Public (None).

### 1.8 Blog Registry & Articles Reader
* **Routes**: `/blogs` & `/blogs/[slug]`
* **File Entry**: 
  - [app/blogs/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/blogs/page.tsx)
  - [app/blogs/[slug]/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/blogs/%5Bslug%5D/page.tsx)
* **Key UI Components**: `BlogSearchInput`, `CategoryTabs`, `BlogCard`, `MarkdownParser`, `NewsletterForm`
* **Phase 2 Backend Goals**:
  - **Database Queries**: Fetch all posts with filtering tags. Fetch specific markdown entry matching dynamic `slug` along with Schema.org JSON-LD generation.
  - **API Endpoints**: 
    - `GET /api/blogs`
    - `GET /api/blogs/[slug]`
    - `POST /api/newsletter/subscribe`
  - **Auth Guards**: Public (None).

---

## 2. Authentication Flow Pages
Client validation forms. Theme: **Light (Split-Panel Shell)**.

### 2.1 Secure Login
* **Route**: `/login`
* **File Entry**: [app/(auth)/login/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/(auth)/login/page.tsx)
* **Key UI Components**: `AuthLayoutShell`, `LoginForm` (Google OAuth triggers, demo credentials helper widgets)
* **Phase 2 Backend Goals**:
  - **API Endpoints**: `POST /api/auth/callback` (NextAuth callback handler validating credentials, initializing JWT sessions, and returning cookie signatures).
  - **Auth Guards**: Anonymous-only (Redirect to appropriate role dashboard if session is already active).

### 2.2 Account Registration
* **Route**: `/register`
* **File Entry**: [app/(auth)/register/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/(auth)/register/page.tsx)
* **Key UI Components**: `RegisterForm` (Dynamic Role Selector Card: Buyer/Agent, Password Strength Meter)
* **Phase 2 Backend Goals**:
  - **Database Mutations**: Create `user` profile document. Enforce unique index on `email`. Hash password using bcrypt.
  - **API Endpoints**: `POST /api/auth/register`
  - **Auth Guards**: Anonymous-only.

### 2.3 Forgot Password
* **Route**: `/forgot-password`
* **File Entry**: [app/(auth)/forgot-password/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/(auth)/forgot-password/page.tsx)
* **Key UI Components**: `ForgotPasswordForm` (60s resend timer, MailCheck Success layout)
* **Phase 2 Backend Goals**:
  - **Database Mutations**: Generate token and update expiry timestamp on `user`.
  - **API Endpoints**: `POST /api/auth/forgot-password` (Triggers email dispatch with reset token token link).
  - **Auth Guards**: Anonymous-only.

### 2.4 Reset Password
* **Route**: `/reset-password`
* **File Entry**: [app/(auth)/reset-password/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/(auth)/reset-password/page.tsx)
* **Key UI Components**: `ResetPasswordForm` (Token validity tracker, redirect callback)
* **Phase 2 Backend Goals**:
  - **Database Mutations**: Look up token validity. Save new hashed password and clear token references.
  - **API Endpoints**: `POST /api/auth/reset-password`
  - **Auth Guards**: Token-validation.

---

## 3. User Dashboard (Authenticated Buyer / Renter)
Dark themed console layout. Theme: **Dark**. Allowed Roles: `auth_user`, `agent`, `admin`, `super_admin`.

### 3.1 Overview (Home)
* **Route**: `/dashboard`
* **File Entry**: [app/dashboard/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/dashboard/page.tsx)
* **Key UI Components**: Welcome message banner, User Stats (Saved items count, Active inquiries count), Recharts saved trends projections.
* **Phase 2 Backend Goals**:
  - **Database Queries**: Read stats corresponding to logged-in `userId`.
  - **API Endpoints**: `GET /api/users/me/dashboard`
  - **Auth Guards**: Authenticated session required.

### 3.2 Saved Properties
* **Route**: `/dashboard/saved`
* **File Entry**: [app/dashboard/saved/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/dashboard/saved/page.tsx)
* **Key UI Components**: Saved properties grid list, instant toggle heart deletion button.
* **Phase 2 Backend Goals**:
  - **Database Queries**: Read `savedProperties` array on the user profile document, retrieve matched listings.
  - **API Endpoints**: 
    - `GET /api/users/me/saved`
    - `DELETE /api/users/me/saved/[id]` (Unsave property).
  - **Auth Guards**: Authenticated session required.

### 3.3 My Inquiries
* **Route**: `/dashboard/inquiries`
* **File Entry**: [app/dashboard/inquiries/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/dashboard/inquiries/page.tsx)
* **Key UI Components**: Inquiry rows table, Status Badges, Conversation Slide-over Drawer (Displays message dialogue thread + Mark as Resolved).
* **Phase 2 Backend Goals**:
  - **Database Queries**: Retrieve inquiries matching `userId`.
  - **API Endpoints**:
    - `GET /api/users/me/inquiries`
    - `PATCH /api/inquiries/[id]` (Update status to `closed`).
  - **Auth Guards**: Authenticated session required (Ownership validation).

### 3.4 Profile Settings
* **Route**: `/dashboard/profile`
* **File Entry**: [app/dashboard/profile/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/dashboard/profile/page.tsx)
* **Key UI Components**: Details Edit Form, Password Change Dialog, Notification Toggles, Account Deletion Confirmation.
* **Phase 2 Backend Goals**:
  - **Database Mutations**: Update personal details or toggle notification flags.
  - **API Endpoints**: 
    - `PATCH /api/users/me`
    - `POST /api/users/me/change-password`
    - `DELETE /api/users/me`
  - **Auth Guards**: Authenticated session required.

---

## 4. Agent Workspace (Real Estate Broker / Agent)
Dashboard layouts for agents. Theme: **Dark**. Allowed Roles: `agent`, `admin`, `super_admin`.

### 4.1 Dashboard Home
* **Route**: `/agent/dashboard`
* **File Entry**: [app/agent/dashboard/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/agent/dashboard/page.tsx)
* **Key UI Components**: Agent Stat strip, Performance charts (Recharts listing views & saves trends), Inbox leads preview panel.
* **Phase 2 Backend Goals**:
  - **Database Queries**: Count properties owned by agent, count active inquiries, fetch aggregate performance logs.
  - **API Endpoints**: `GET /api/agent/dashboard`
  - **Auth Guards**: Session role must be `agent` or higher.

### 4.2 My Listings
* **Route**: `/agent/listings`
* **File Entry**: [app/agent/listings/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/agent/listings/page.tsx)
* **Key UI Components**: Active / Drafts / Archived tabs table, Listing rows (Preview, price, status badges, Archive, Delete).
* **Phase 2 Backend Goals**:
  - **Database Queries**: Retrieve listings matching `ownerId: agentId`.
  - **API Endpoints**: 
    - `GET /api/agent/properties`
    - `PATCH /api/properties/[id]/archive` (Updates status to `sold`/`rented`).
    - `DELETE /api/properties/[id]`
  - **Auth Guards**: Session role must be `agent` or higher.

### 4.3 Create Listing Form
* **Route**: `/agent/listings/new`
* **File Entry**: [app/agent/listings/new/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/agent/listings/new/page.tsx)
* **Key UI Components**: 5-step stepper form panel, basic specs selectors, location details, mock media upload card, review summary.
* **Phase 2 Backend Goals**:
  - **Database Mutations**: Create listing entry linked to agent ID.
  - **API Endpoints**: 
    - `POST /api/properties`
    - `POST /api/media/upload` (Actual file integration to cloud bucket).
  - **Auth Guards**: Session role must be `agent` or higher.

### 4.4 Edit Listing Form
* **Route**: `/agent/listings/[id]/edit`
* **File Entry**: [app/agent/listings/[id]/edit/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/agent/listings/[id]/edit/page.tsx)
* **Key UI Components**: 5-step stepper form pre-filled with listing metadata, details selectors, mock upload, save updates.
* **Phase 2 Backend Goals**:
  - **Database Mutations**: Update listing schema parameters.
  - **API Endpoints**: `PUT /api/properties/[id]`
  - **Auth Guards**: Session role must be `agent` or higher (Verify agent ownership).

### 4.5 Leads & Inbox
* **Route**: `/agent/leads`
* **File Entry**: [app/agent/leads/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/agent/leads/page.tsx)
* **Key UI Components**: Split Mailbox Pane (Unread / Read / Replied tabs), Leads detail block, inline response textbox, status modifier buttons.
* **Phase 2 Backend Goals**:
  - **Database Queries**: Retrieve inquiries matching agent's listings.
  - **API Endpoints**: 
    - `GET /api/agent/inquiries`
    - `POST /api/agent/inquiries/[id]/reply` (Sends notification alert to buyer/renter).
  - **Auth Guards**: Session role must be `agent` or higher.

---

## 5. Moderator Admin Workspace
Moderation metrics and queues. Theme: **Dark**. Allowed Roles: `admin`, `super_admin`.

### 5.1 Dashboard Home
* **Route**: `/admin/dashboard`
* **File Entry**: [app/admin/dashboard/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/admin/dashboard/page.tsx)
* **Key UI Components**: Overall Stats (Registered users, agents, listings, reports), New User registration chart, Pending listing approvals panel.
* **Phase 2 Backend Goals**:
  - **Database Queries**: Platform aggregates counters, system logs.
  - **API Endpoints**: `GET /api/admin/dashboard`
  - **Auth Guards**: Session role must be `admin` or higher.

### 5.2 User Management
* **Route**: `/admin/users`
* **File Entry**: [app/admin/users/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/admin/users/page.tsx)
* **Key UI Components**: Directory accounts grid table, Search, user profile details dialog, Account Suspension trigger actions.
* **Phase 2 Backend Goals**:
  - **Database Mutations**: Modify user profile statuses (`Active` / `Suspended`).
  - **API Endpoints**: 
    - `GET /api/admin/users`
    - `PATCH /api/admin/users/[id]/status`
  - **Auth Guards**: Session role must be `admin` or higher.

### 5.3 Listing Approvals Queue
* **Route**: `/admin/listings`
* **File Entry**: [app/admin/listings/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/admin/listings/page.tsx)
* **Key UI Components**: Listing queue table (Preview, financial price, lister detail), inline review actions (Approve / Reject).
* **Phase 2 Backend Goals**:
  - **Database Mutations**: Change property status from `pending_approval` to `active` or `rejected`.
  - **API Endpoints**: `PATCH /api/admin/properties/[id]/approve`
  - **Auth Guards**: Session role must be `admin` or higher.

### 5.4 Disputes & Reports
* **Route**: `/admin/reports`
* **File Entry**: [app/admin/reports/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/admin/reports/page.tsx)
* **Key UI Components**: Abuse violation entries table, slide-over report drawer, dismiss disputes actions.
* **Phase 2 Backend Goals**:
  - **Database Mutations**: Update flag counts on profiles, dismiss or remove reported listings.
  - **API Endpoints**: 
    - `GET /api/admin/reports`
    - `PATCH /api/admin/reports/[id]` (Resolve dispute).
  - **Auth Guards**: Session role must be `admin` or higher.

---

## 6. Super Admin Platform Console
Platform variables and roles. Theme: **Dark**. Allowed Roles: `super_admin`.

### 6.1 Super Admin Dashboard
* **Route**: `/super-admin/dashboard`
* **File Entry**: [app/super-admin/dashboard/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/super-admin/dashboard/page.tsx)
* **Key UI Components**: Security audit events trail (IP, actions, status indicators), active platform modules counters.
* **Phase 2 Backend Goals**:
  - **Database Queries**: Read platform audit logs collection.
  - **API Endpoints**: `GET /api/super-admin/audit-logs`
  - **Auth Guards**: Session role must be `super_admin`.

### 6.2 Role Upgrades & Management
* **Route**: `/super-admin/roles`
* **File Entry**: [app/super-admin/roles/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/super-admin/roles/page.tsx)
* **Key UI Components**: Operator privilege table, role modification trigger modal, mandatory audit justification textarea.
* **Phase 2 Backend Goals**:
  - **Database Mutations**: Change account role on user documents, write audit history document.
  - **API Endpoints**: `PATCH /api/super-admin/users/[id]/role`
  - **Auth Guards**: Session role must be `super_admin`.

### 6.3 Settings & Regions Switchboard
* **Route**: `/super-admin/settings`
* **File Entry**: [app/super-admin/settings/page.tsx](file:///Users/minhaz/Documents/projects/brand/brand-estate/app/super-admin/settings/page.tsx)
* **Key UI Components**: Feature Flag Switchboard toggles, active directories list, Add Region code inputs, developer operations triggers.
* **Phase 2 Backend Goals**:
  - **Database Mutations**: Save global application configuration document.
  - **API Endpoints**: 
    - `GET /api/settings`
    - `PATCH /api/settings`
    - `POST /api/settings/regions`
  - **Auth Guards**: Session role must be `super_admin`.
