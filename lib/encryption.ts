import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV for GCM
const AUTH_TAG_LENGTH = 16;
const ENCRYPTED_PREFIX = "enc:";

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex) throw new Error("ENCRYPTION_KEY environment variable is not set");
  const buf = Buffer.from(hex, "hex");
  if (buf.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters)");
  }
  return buf;
}

/**
 * Encrypts a UTF-8 string with AES-256-GCM.
 * Output format: "enc:" + base64(IV[12] + AuthTag[16] + Ciphertext)
 */
export function encrypt(text: string): string {
  if (!text) return text;
  if (isEncrypted(text)) return text; // never double-encrypt
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, authTag, encrypted]);
  return ENCRYPTED_PREFIX + combined.toString("base64");
}

/**
 * Decrypts a value produced by encrypt().
 * Transparently passes through unencrypted strings so legacy plain-text data
 * in the DB is still readable after the migration.
 */
export function decrypt(ciphertext: string): string {
  if (!ciphertext) return ciphertext;
  if (!isEncrypted(ciphertext)) return ciphertext; // handle legacy plain-text rows
  const key = getKey();
  const combined = Buffer.from(ciphertext.slice(ENCRYPTED_PREFIX.length), "base64");
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encryptedData = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encryptedData).toString("utf8") + decipher.final("utf8");
}

/**
 * Returns true if the value was produced by encrypt() — i.e. starts with "enc:".
 * Use this to avoid double-encrypting already-encrypted values.
 */
export function isEncrypted(value: string): boolean {
  return typeof value === "string" && value.startsWith(ENCRYPTED_PREFIX);
}
