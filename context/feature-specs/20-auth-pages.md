# 20 — Authentication Pages (Login, Register, Forgot/Reset Password)

## What This Builds
A collection of high-fidelity, premium, and fully responsive authentication pages using the Next.js App Router. This includes:
1. **Shared Auth Layout / Shell**: A responsive visual structure that uses a split desktop design: a media-rich brand panel on the left with custom testimonials and glassmorphic stats, and a clean, accessible form panel on the right.
2. **Login Page (`/login`)**: Email/password authentication form with input validation, password visibility toggle, a stylized Google OAuth button, and simulated login state transitions.
3. **Register Page (`/register`)**: Account creation form featuring name, email, password fields, and an interactive Role Selection toggle (User vs. Agent) to simulate different onboarding flows.
4. **Forgot Password Page (`/forgot-password`)**: Simple email-submission form that transitions into a visual check-your-email success card upon submission.
5. **Reset Password Page (`/reset-password`)**: Token-simulated page where users enter their new password and receive visual confirmation before redirection.
6. **Mock Authentication Hook/State**: A client-side mock auth provider (`lib/auth-context.tsx`) that stores the current mock user session in `localStorage`, enabling local user state across the header/navbar, including dynamic profile dropdowns and simulated logouts.

## Route Paths
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

## Data Structures & Interfaces

The mock session utilizes the following `User` model (matching `lib/types.ts`):
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole; // 'guest' | 'auth_user' | 'agent' | 'admin' | 'super_admin'
  avatar?: string;
  phone?: string;
  savedProperties?: string[];
  createdAt: string;
}
```

## Mock Accounts for Testing
To allow easy navigation and demonstration, we will support standard credentials that immediately sign the user in with appropriate roles:
- **Buyer/Renter (User)**: `user@brandestate.com` / password: `Password123` (logs in as `auth_user`)
- **Agent**: `agent@brandestate.com` / password: `Password123` (logs in as `agent`)
- **Admin**: `admin@brandestate.com` / password: `Password123` (logs in as `admin`)
- **Super Admin**: `superadmin@brandestate.com` / password: `Password123` (logs in as `super_admin`)

## Acceptance Criteria

### 1. Visual & Desktop Split Layout
- [ ] Render a split layout for screens larger than `1024px` (`lg`):
  - **Left Side (50% width)**: Full-height visual panel featuring a premium architectural or real estate background image. Includes a dark glassmorphic card containing a slider or fade-in testimonials, user trust stats (e.g., "10k+ Homes Found"), and dynamic motivational text.
  - **Right Side (50% width)**: Centered, clean auth container containing the form.
- [ ] On mobile/tablet (under `1024px`), hide the left visual panel and display the form card centered with full-width container padding.
- [ ] Follow light/dark mode color tokens strictly (`bg-base` / `dark-bg-base`, text, and borders).

### 2. Client-Side Mock Auth Context
- [ ] Create `lib/auth-context.tsx` export containing `AuthProvider` and `useAuth` hook.
- [ ] Keep track of `currentUser: User | null` and `isAuthenticated: boolean`.
- [ ] Persist current user state in `localStorage` so that sessions persist across hard reloads.
- [ ] Provide functions:
  - `login(email, password, role)`: Simulates login and stores session.
  - `register(name, email, password, role)`: Simulates registration.
  - `logout()`: Clears the session and redirects to `/`.
- [ ] Integrate `AuthProvider` in the root layout (`app/layout.tsx`).

### 3. Navbar Integration
- [ ] Update `components/layout/navbar.tsx` to read user status from `useAuth`.
- [ ] If authenticated:
  - Hide "Join" and "Sign In" buttons.
  - Render a premium user avatar button with an interactive dropdown menu.
  - Dropdown should show: User's Name, Email, Role-specific dashboard link (e.g. `/agent/dashboard` for agent, `/dashboard` for user, etc.), "Saved Properties", "Settings", and a "Logout" action.
  - Responsive: Support the same dropdown menu in the mobile drawer layout.

### 4. Login Page (`/login`)
- [ ] Form with email input and password input.
- [ ] Password input features a show/hide toggle button (Lucide `Eye` and `EyeOff` icons).
- [ ] Button for "Sign in with Google" featuring the Google logo icon.
- [ ] Form validates that email is valid and password is at least 6 characters. Shows interactive error messages if validation fails.
- [ ] Supports typing any email/password, but pre-filling or using the mock credentials instantly sets the corresponding role.
- [ ] Renders a "Don't have an account? Sign up" link routing to `/register`.
- [ ] Renders a "Forgot password?" link routing to `/forgot-password`.

### 5. Register Page (`/register`)
- [ ] Form with fields: Full Name, Email Address, Password, Confirm Password.
- [ ] A custom interactive Role Selector styled as premium tabs/cards for "Buyer / Renter" (`auth_user`) vs "Real Estate Agent" (`agent`). Clicking updates the target signup role with visual highlights.
- [ ] Form validates that passwords match, email is valid, and name is not empty.
- [ ] Renders "Already have an account? Sign in" routing to `/login`.
- [ ] Successful registration logs the user in automatically with their chosen role and redirects them.

### 6. Forgot Password Page (`/forgot-password`)
- [ ] Form with single email input.
- [ ] Submitting transitions the page state (no full reload) into a success state card:
  - Renders a confirmation icon (e.g., Lucide `MailCheck` or `CheckCircle`).
  - Text instructing the user to check their inbox.
  - "Resend email" button with a countdown timer (e.g., "Resend in 60s") to prevent rapid submission spam.
  - Link to return to `/login`.

### 7. Reset Password Page (`/reset-password`)
- [ ] Read URL query token (e.g. `?token=...`). If token is missing, show a warning card redirecting to login.
- [ ] Form with fields: New Password, Confirm New Password.
- [ ] Validates passwords match.
- [ ] Submitting shows a success toast/state and redirects the user to `/login` after a brief delay.

### 8. Quality & Standards
- [ ] Renders correctly in Light & Dark modes.
- [ ] Built with Next.js 16 Client/Server Component boundaries.
- [ ] Zero TypeScript errors and zero ESLint warnings.
- [ ] Clean keyboard navigation and form labeling.

## Out Of Scope
- Backend database synchronization (mocked via localStorage/React state).
- Real Google OAuth redirect loops (simulated by immediately signing in a mock user upon click).
- Real email dispatching.
