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
    // Agent + admin + super admin
    pattern: /^\/agent(\/|$)/,
    allowedRoles: ['agent', 'admin', 'super_admin'],
  },
  {
    // Any authenticated user (auth_user, agent, admin, super_admin)
    pattern: /^\/dashboard(\/|$)/,
    allowedRoles: ['auth_user', 'agent', 'admin', 'super_admin'],
  },
];

const COOKIE_NAME = 'be_auth_token';
const JWT_SECRET = process.env.JWT_SECRET || '';

export async function middleware(request: NextRequest) {
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
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
    '/agent/:path*',
    '/admin/:path*',
    '/super-admin/:path*',
  ],
};
