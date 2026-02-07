/**
 * In-memory token store for axios interceptors.
 * Set from Auth context / login response; used by lib/axios to attach Bearer and refresh on 401.
 * Session cookie (ocx_has_session) used by middleware to protect /dashboard routes.
 */

const SESSION_COOKIE_NAME = "ocx_has_session";
const SESSION_COOKIE_MAX_AGE_DAYS = 1;

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("refreshToken");
}

export function setRefreshToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem("refreshToken", token);
  else sessionStorage.removeItem("refreshToken");
}

/** Set cookie for middleware (dashboard protection). Call after login. */
export function setSessionCookie(): void {
  if (typeof document === "undefined") return;
  const maxAge = SESSION_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/** Clear session cookie. Call on logout. */
export function clearSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
}

export const sessionCookieName = SESSION_COOKIE_NAME;

export function clearTokens(): void {
  accessToken = null;
  setRefreshToken(null);
  clearSessionCookie();
}
