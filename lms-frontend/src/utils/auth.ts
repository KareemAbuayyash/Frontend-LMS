// Helper functions for handling JWTs

type StorageArea = Storage;

/**
 * Decode a JWT payload into a JS object, or null on error.
 */
function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('');
    return JSON.parse(decodeURIComponent(json));
  } catch {
    return null;
  }
}

/**
 * Save both access + refresh tokens.
 * Always clears out old tokens first, then persists in localStorage
 * so they survive across browser tabs & restarts.
 */
export function saveTokens(
  accessToken: string,
  refreshToken: string,
) {
  // wipe out anything from earlier sessions
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');

  // persist in localStorage so they stick around
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

/**
 * Pull the user’s primary role out of the JWT.
 */
export function getUserRole(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  const payload = parseJwt(token);
  if (Array.isArray(payload?.roles) && payload.roles.length) {
    return payload.roles[0];
  }
  return null;
}

export function isAccessTokenExpired(): boolean {
  const token = getAccessToken();
  if (!token) return true;
  const payload = parseJwt(token);
  return !payload || payload.exp * 1000 < Date.now();
}
