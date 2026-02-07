# AUTHENTICATION & SESSION FLOW

## 1. Login Logic
1. User enters Email/Password at `/login`.
2. Frontend calls `POST /auth/login`.
3. **Success:**
   - Backend returns `{ accessToken, refreshToken, user }`.
   - Frontend stores `accessToken` (Memory/Context) and `refreshToken` (HttpOnly Cookie or Secure Storage).
   - Redirect user to `/dashboard`.
4. **Failure:** Show error toast (Invalid credentials).

## 2. Session Protection (Middleware)
- **File:** `middleware.ts` (Next.js Root).
- **Logic:**
  - Check for specific Cookie/Token presence on all routes starting with `/dashboard`.
  - If Token is missing: Redirect to `/login?callbackUrl=...`.
  - If Token exists: Allow request to pass.

## 3. Token Attach & Refresh (Axios Interceptor)
- **Request Interceptor:**
  - Before every request, attach header: `Authorization: Bearer <accessToken>`.
- **Response Interceptor:**
  - Monitor for `401 Unauthorized` error.
  - If 401 detected:
    1. Attempt to call `POST /auth/refresh` using the stored Refresh Token.
    2. If Refresh Success: Update `accessToken` -> Retry original request.
    3. If Refresh Fails: Clear all tokens -> Redirect to `/login`.

## 4. User Context (Client Side)
- On app load (Layout mount), call `GET /auth/me`.
- If Role is `USER` (End-user) -> Deny access (Show "Access Restricted" or Redirect).
- If Role is `ADMIN_ORGANIZER` / `OWNER_ORGANIZER` -> Allow access & Store user info in React Context/Zustand.