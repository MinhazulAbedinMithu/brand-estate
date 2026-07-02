import { NextRequest } from 'next/server';
import { verifyEdgeJwt } from '@/lib/auth/edge-jwt';

const COOKIE_NAME = 'be_auth_token';
const JWT_SECRET = process.env.JWT_SECRET || '';

export async function getSessionUser(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return await verifyEdgeJwt(token, JWT_SECRET);
  } catch (err) {
    console.error('Session authentication error:', err);
    return null;
  }
}
