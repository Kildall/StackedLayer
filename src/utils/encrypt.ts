import { KEY_SALT } from "astro:env/server";

/**
 * Encrypt a secret using AES-GCM
 * @param secret - The secret to encrypt
 * @param key - The key to use for encryption
 * @returns The encrypted secret as a hex string
 */
export async function encrypt(
  secret: Uint8Array,
  key: CryptoKey
): Promise<string> {
  // Generate a random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the secret
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    secret
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);

  // Convert to hex string
  return Array.from(combined)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Decrypt a secret using AES-GCM with improved error handling
 * @param encrypted - The encrypted data as Uint8Array
 * @param key - The CryptoKey to use for decryption
 * @returns The decrypted string
 * @throws Error if decryption fails or input is invalid
 */
export async function decrypt(
  encrypted: Uint8Array,
  key: CryptoKey
): Promise<string> {
  // Input validation
  if (!encrypted || encrypted.length < 13) {
    throw new Error('Invalid encrypted data: must be at least 13 bytes (12 for IV + 1 for data)');
  }

  if (!key) {
    throw new Error('Missing decryption key');
  }

  try {
    // Extract IV (first 12 bytes) and ciphertext
    const iv = encrypted.slice(0, 12);
    const data = encrypted.slice(12);

    // Validate key algorithm
    if (key.algorithm.name !== 'AES-GCM') {
      throw new Error('Invalid key algorithm: must be AES-GCM');
    }

    // Attempt decryption
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128 // Specify the authentication tag length explicitly
      },
      key,
      data
    );

    // Decode the decrypted data
    try {
      return new TextDecoder().decode(decrypted);
    } catch (e) {
      if (e instanceof DOMException) {
        throw new Error(`Failed to decode decrypted data: ${e.message}`);
      }
      throw new Error(`Failed to decode decrypted data: ${e}`);
    }

  } catch (error) {
    // Provide more specific error messages based on the error type
    if (error instanceof DOMException && error.name === 'OperationError') {
      throw new Error(
        'Decryption failed: This could be due to data corruption, ' +
        'wrong key, or tampered authentication tag'
      );
    }
    throw new Error(`Decryption failed: ${error}`);
  }
}


/**
 * Generate a URL-safe signature from a CryptoKey
 * @param key - The CryptoKey to generate signature from
 * @returns A URL-safe string that can be used in URIs
 */
export async function generateKeySignature(key: CryptoKey): Promise<string> {
  // Export the key to raw format (this only works with extractable keys)
  const exportedKey = await crypto.subtle.exportKey('raw', key);
  
  // Create a hash of the exported key
  const hash = await crypto.subtle.digest('SHA-512', exportedKey);
  
  // Convert to base64 and make URL-safe
  const hashArray = Array.from(new Uint8Array(hash));
  const base64 = btoa(String.fromCharCode.apply(null, hashArray));
  
  // Make it URL-safe by replacing non-URL-safe characters
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Test function for key signature generation
 */
/**
 * Convert a CryptoKey to a string format for storage
 * @param key - The CryptoKey to convert
 * @returns A string representation of the key
 */
export async function keyToString(key: CryptoKey): Promise<string> {
  // Export the key to raw format
  const exportedKey = await crypto.subtle.exportKey('raw', key);
  
  // Convert to base64
  const keyArray = Array.from(new Uint8Array(exportedKey));
  return btoa(String.fromCharCode.apply(null, keyArray));
}

/**
 * Convert a string back to a CryptoKey
 * @param keyString - The string representation of the key
 * @returns A CryptoKey object
 */
export async function stringToKey(keyString: string): Promise<CryptoKey> {
  // Convert base64 back to array buffer
  const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
  
  // Import as AES-GCM key
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Derive a CryptoKey from an environment secret using PBKDF2
 * @param envSecret - The secret from environment variables
 * @returns A CryptoKey that can be used for encryption/decryption
 */
export async function deriveKey(envSecret: string): Promise<CryptoKey> {
  // Use a constant salt - while normally you'd want a random salt,
  // we need consistency across server restarts
  const salt = new TextEncoder().encode(KEY_SALT);
  
  // Convert the environment secret to key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(envSecret),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive an AES-GCM key using PBKDF2
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000, // High iteration count for security
      hash: 'SHA-256'
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256
    },
    true, // Extractable should be true if you need to export it
    ['encrypt', 'decrypt']
  );
}