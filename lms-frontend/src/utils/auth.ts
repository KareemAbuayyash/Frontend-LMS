// src/utils/auth.ts

/**
 * Very simple JWT payload parser – just Base64URL-decodes the middle segment
 */
function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * Save both tokens to localStorage
 */
export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
}

/**
 * Remove all tokens from localStorage
 */
export function clearTokens() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

/**
 * Get the current access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken')
}

/**
 * Get the current refresh token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken')
}

/**
 * Extract the first role from the JWT payload (e.g. ["ROLE_ADMIN"])
 */
export function getUserRole(): string | null {
  const token = getAccessToken()
  if (!token) return null
  const payload = parseJwt(token)
  if (!payload || !Array.isArray(payload.roles) || payload.roles.length === 0) {
    return null
  }
  return payload.roles[0]
}
