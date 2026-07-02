import { type NextRequest, NextResponse } from 'next/server';
import { verifyEdgeJwt } from '@/lib/auth/edge-jwt';

// ─────────────────────────────────────────────────────────────
// Route protection matrix
// ─────────────────────────────────────────────────────────────
const PROTECTED_ROUTES: Array<{
  pattern: RegExp;
  allowedRoles: string[];
}> = [
  {
    // Super admin only
    pattern: /^\/super-admin(\/|$)/,
    allowedRoles: ['super_admin'],
  },
  {
    // Admin + super admin
    pattern: /^\/admin(\/|$)/,
    allowedRoles: ['admin', 'super_admin'],
  },
  {
    // Owner + admin + super admin
    pattern: /^\/owner(\/|$)/,
    allowedRoles: ['owner', 'admin', 'super_admin'],
  },
  {
    // Agent + admin + super admin
    pattern: /^\/agent(\/|$)/,
    allowedRoles: ['agent', 'admin', 'super_admin'],
  },
  {
    // Any authenticated user (auth_user, agent, owner, admin, super_admin)
    pattern: /^\/dashboard(\/|$)/,
    allowedRoles: ['auth_user', 'agent', 'owner', 'admin', 'super_admin'],
  },
];

const COOKIE_NAME = 'be_auth_token';
const JWT_SECRET = process.env.JWT_SECRET || '';

function getDashboardRoute(role: string): string {
  switch (role) {
    case 'agent':
      return '/agent/dashboard';
    case 'owner':
      return '/owner/dashboard';
    case 'admin':
      return '/admin/dashboard';
    case 'super_admin':
      return '/super-admin/dashboard';
    default:
      return '/dashboard';
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Find the first matching protection rule
  const rule = PROTECTED_ROUTES.find((r) => r.pattern.test(pathname));

  // No rule → public route, pass through
  if (!rule) return NextResponse.next();

  // Read the auth cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return redirectToLogin(request, pathname);
  }

  // Lightweight JWT decode — no DB call in middleware
  const payload = await verifyEdgeJwt(token, JWT_SECRET);

  if (!payload) {
    return redirectToLogin(request, pathname);
  }

  // Check role authorization
  if (!rule.allowedRoles.includes(payload.role)) {
    // Authenticated but wrong role → redirect to their own dashboard
    const dest = getDashboardRoute(payload.role);
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // If accessing the general user dashboard home directly, redirect non-regular-users to their dashboard
  if ((pathname === '/dashboard' || pathname === '/dashboard/') && payload.role !== 'auth_user') {
    const dest = getDashboardRoute(payload.role);
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // All checks passed — forward the request
  return NextResponse.next();
}

function redirectToLogin(request: NextRequest, from: string): NextResponse {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('from', from);
  return NextResponse.redirect(loginUrl);
}

// ─────────────────────────────────────────────────────────────
// Matcher — only run middleware on relevant paths
// ─────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/owner/:path*',
    '/agent/:path*',
    '/admin/:path*',
    '/super-admin/:path*',
  ],
};

