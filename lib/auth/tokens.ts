import crypto from 'crypto';

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
