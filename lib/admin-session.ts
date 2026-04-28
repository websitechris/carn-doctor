const COOKIE_NAME = 'admin_session'
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is required')
  return secret
}

function bytesToBase64Url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.byteLength; i++) s += String.fromCharCode(bytes[i])
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function stringToBase64Url(str: string): string {
  return bytesToBase64Url(new TextEncoder().encode(str))
}

function base64UrlToString(b64url: string): string {
  const pad = (4 - (b64url.length % 4)) % 4
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad)
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
}

async function signPayload(payload: string): Promise<string> {
  const key = await getKey()
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return bytesToBase64Url(sig)
}

export async function signSession(ttlSeconds: number = DEFAULT_TTL_SECONDS): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds
  const payload = stringToBase64Url(JSON.stringify({ exp }))
  const sig = await signPayload(payload)
  return `${payload}.${sig}`
}

export async function verifySession(value: string | undefined | null): Promise<boolean> {
  if (!value) return false
  const [payload, sig] = value.split('.')
  if (!payload || !sig) return false

  const expected = await signPayload(payload)
  if (expected.length !== sig.length) return false
  let mismatch = 0
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ sig.charCodeAt(i)
  }
  if (mismatch !== 0) return false

  try {
    const decoded = JSON.parse(base64UrlToString(payload)) as { exp?: number }
    if (typeof decoded.exp !== 'number') return false
    return decoded.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME
export const ADMIN_SESSION_TTL_SECONDS = DEFAULT_TTL_SECONDS
