// ─────────────────────────────────────────────
// Auth Input Validation Helpers
// ─────────────────────────────────────────────

/**
 * Validates that a string is a well-formed email address.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

interface PasswordValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates password strength per spec:
 * - At least 8 characters long
 * - Contains at least one digit
 */
export function validatePassword(password: string): PasswordValidationResult {
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long and contain a number.',
    };
  }
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long and contain a number.',
    };
  }
  return { valid: true };
}
