/**
 * Cryptographic utilities for encryption and decryption
 * Note: These functions use the Web Crypto API and work in browsers and modern Node.js environments
 */

/**
 * Interface for encrypted data
 */
export interface EncryptedData {
  iv: Uint8Array;
  encryptedData: ArrayBuffer;
}

/**
 * Encrypts data using AES-GCM encryption
 */
export async function encryptData(
  data: string,
  key: CryptoKey,
): Promise<EncryptedData> {
  const encodedData = new TextEncoder().encode(data);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedData,
  );
  return { iv, encryptedData };
}

/**
 * Decrypts data using AES-GCM decryption
 */
export async function decryptData(
  encryptedData: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array,
): Promise<string> {
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedData,
  );
  return new TextDecoder().decode(decryptedData);
}

/**
 * Generates a new AES-GCM encryption key
 */
export async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Exports a CryptoKey to a raw ArrayBuffer
 */
export async function exportKey(key: CryptoKey): Promise<ArrayBuffer> {
  return await crypto.subtle.exportKey('raw', key);
}

/**
 * Imports a raw key buffer as a CryptoKey
 */
export async function importKey(keyBuffer: ArrayBuffer): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Generates a cryptographically secure random string
 */
export function secureRandomString(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

/**
 * Hashes data using SHA-256
 */
export async function hash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray, (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}
