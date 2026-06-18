import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in .env.local');
}

// ─────────────────────────────────────────────
// JWT Payload shape
// ─────────────────────────────────────────────
export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

/**
 * Signs a JWT token with a 7-day expiry.
 */
export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: '7d' });
}

/**
 * Verifies a JWT token and returns the decoded payload, or null if invalid/expired.
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  } catch {
    return null;
  }
}



/**
 * Generates a cryptographically secure random 32-byte hex token.
 * Used for both email verification and password reset flows.
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generates a cryptographically secure random 32-byte hex token.
 * Alias for verification token — kept separate for semantic clarity.
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Returns a Date object N hours from now.
 */
export function hoursFromNow(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
