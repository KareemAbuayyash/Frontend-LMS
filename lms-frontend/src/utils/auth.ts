/**
 * Token helpers — now with “Remember me” support.
 * If remember === true we store tokens in localStorage (persists across
 * restarts). Otherwise we fall back to sessionStorage, which is cleared
 * when the tab/browser closes.
 */

type StorageArea = Storage;

/* ------------------------------ helpers ------------------------------ */
function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    const base64    = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json      = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/* --------------------------- public API ------------------------------ */
export function saveTokens(
  accessToken:  string,
  refreshToken: string,
  remember:     boolean = false        // ← NEW PARAM
) {
  const store: StorageArea = remember ? localStorage : sessionStorage;
  store.setItem('accessToken',  accessToken);
  store.setItem('refreshToken', refreshToken);
}

export function clearTokens() {
  localStorage .removeItem('accessToken');
  localStorage .removeItem('refreshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken') ??
         sessionStorage.getItem('accessToken');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken') ??
         sessionStorage.getItem('refreshToken');
}

export function getUserRole(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  const payload = parseJwt(token);
  return Array.isArray(payload?.roles) && payload.roles.length
    ? payload.roles[0]
    : null;
}
