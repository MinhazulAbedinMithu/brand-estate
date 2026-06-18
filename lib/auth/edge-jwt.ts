import type { JwtPayload } from './tokens';

/**
 * Decodes a base64url string.
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

/**
 * Converts a base64url string into a Uint8Array.
 */
function base64UrlDecodeToBytes(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Verifies a JWT token using standard Web Crypto APIs (compatible with Next.js Edge Runtime).
 * Returns the decoded payload if valid, or null if invalid or expired.
 */
export async function verifyEdgeJwt(
  token: string,
  secret: string
): Promise<JwtPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    // 1. Decode header and payload
    const header = JSON.parse(base64UrlDecode(headerB64));
    const payload = JSON.parse(base64UrlDecode(payloadB64)) as JwtPayload & { exp?: number };

    // Enforce HS256 algorithm
    if (header.alg !== 'HS256') {
      return null;
    }

    // 2. Validate expiration (exp is in seconds)
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    // 3. Verify signature using HMAC-SHA256 via SubtleCrypto
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(`${headerB64}.${payloadB64}`);
    const signatureBytes = base64UrlDecodeToBytes(signatureB64);

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as unknown as ArrayBuffer,
      dataBytes as unknown as ArrayBuffer
    );

    return isValid ? payload : null;
  } catch (err) {
    console.error('[verifyEdgeJwt] Verification failed:', err);
    return null;
  }
}
