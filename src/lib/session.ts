const COOKIE_NAME = 'session'
const SESSION_MAX_AGE = 60 * 60 * 8 // 8 hours

export async function createSessionCookie(secret: string, isHttps: boolean): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
  const signature = await sign(String(expires), secret)
  const secureFlag = isHttps ? '; Secure' : ''
  return `${COOKIE_NAME}=${expires}.${signature}; Path=/; HttpOnly${secureFlag}; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}`
}

export function logoutCookie(isHttps: boolean): string {
  const secureFlag = isHttps ? '; Secure' : ''
  return `${COOKIE_NAME}=; Path=/; HttpOnly${secureFlag}; SameSite=Strict; Max-Age=0`
}

export async function isAuthenticated(request: Request, secret: string): Promise<boolean> {
  const cookieHeader = request.headers.get('Cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => c.trim()).filter(Boolean).map(c => {
      const i = c.indexOf('=')
      return i === -1 ? [c, ''] : [c.slice(0, i), c.slice(i + 1)]
    })
  )
  const value = cookies[COOKIE_NAME]
  if (!value) return false

  const [payload, signature] = value.split('.')
  if (!payload || !signature) return false

  const expected = await sign(payload, secret)
  if (signature !== expected) return false

  return Date.now() / 1000 <= parseInt(payload, 10)
}

async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
