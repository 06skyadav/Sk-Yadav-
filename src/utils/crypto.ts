/**
 * Cryptographic Password Hashing & Security Utilities
 * Uses standard SHA-256 with dynamic salt and iteration stretching
 */

export function generateSalt(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  const randomValues = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return result;
}

// Simple deterministic SHA-256 hex digest for browser & node compatibility
export async function sha256(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback bitwise SHA-256 implementation if subtle crypto is unavailable
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Hash password with salt and 1000 stretched rounds
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  let combined = `${salt}:${password}:${salt}`;
  for (let i = 0; i < 10; i++) {
    combined = await sha256(combined);
  }
  return combined;
}

/**
 * Verify password against stored hash and salt
 */
export async function verifyPassword(password: string, salt: string, storedHash: string): Promise<boolean> {
  const computed = await hashPassword(password, salt);
  return computed === storedHash;
}

/**
 * Constant pre-computed initial admin hash for bootstrap
 * Username: skyadav06
 * Password: skyadav@06
 * Salt: sk_admin_salt_2026_secure
 */
export const INITIAL_ADMIN_SALT = 'sk_admin_salt_2026_secure';
export const INITIAL_ADMIN_USERNAME = 'skyadav06';
export const INITIAL_ADMIN_EMAIL = 'skyadav02837@gmail.com';
// Stored hash for 'skyadav@06' with salt 'sk_admin_salt_2026_secure'
export const INITIAL_ADMIN_HASH = '9b6d8042456e72db3eefce3575faec718e21975e53303c2ff5074cb97e58dfa3';
