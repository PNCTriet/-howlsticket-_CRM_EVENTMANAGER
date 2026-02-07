# Hiện trạng & Next Steps – Howlsticket CRM

## Trang hiện có (chỉ layout/placeholder, chưa logic)

| Route | Mô tả |
|-------|--------|
| **`/`** | Trang chủ: tiêu đề + 2 link (Go to Login, Dashboard). |
| **`/login`** | Trang login: placeholder text, chưa form, chưa gọi `POST /auth/login`. |
| **`/dashboard`** | Trang dashboard: layout + placeholder text, chưa Sidebar/Header, chưa data. |

**Lưu ý:** `/dashboard` chưa được bảo vệ (chưa có middleware), ai cũng vào được.

---

## Chức năng đã có (Foundation)

- **Cấu hình:** Next.js 15+, App Router, TypeScript, Tailwind, Shadcn (components.json), Recharts.
- **API client:** `lib/axios.ts` – gắn Bearer token, xử lý 401 (refresh token rồi retry hoặc redirect `/login`).
- **Token:** `lib/auth-token.ts` – lưu accessToken (memory), refreshToken (sessionStorage), clear.
- **UI helper:** `lib/utils.ts` – `cn()`.
- **Layout:** Root layout có QueryProvider, font Inter, `bg-zinc-50`.
- **Component:** `components/ui/sonner.tsx` (Toaster) – chưa gắn vào layout.
- **Thư mục:** `hooks/`, `services/`, `types/` – trống, sẵn sàng cho Phase sau.

## Chức năng chưa có (theo Roadmap Phase 1)

- [ ] **Login thật:** Form email/password + `POST /auth/login` + lưu token + redirect `/dashboard`.
- [ ] **Middleware:** Bảo vệ `/dashboard/*`, nếu chưa đăng nhập → redirect `/login?callbackUrl=...`.
- [ ] **User context:** Gọi `GET /auth/me` khi vào app, lưu user (role ADMIN_ORGANIZER/OWNER_ORGANIZER), chặn role USER.
- [ ] **Logout:** Gọi `POST /auth/logout` + clear token + redirect `/login`.
- [ ] **Layout dashboard:** Sidebar (trái, thu gọn) + Header (user, search) + content.
- [ ] **NavUser:** Dropdown profile + logout trong Header.

---

## Next steps (thứ tự gợi ý)

### Bước 1: Hoàn thiện Auth (Phase 1)

1. **Middleware**  
   Tạo `middleware.ts` ở root: với request tới `/dashboard` (và con), kiểm tra cookie/token; không có thì redirect `/login?callbackUrl=...`.

2. **Login page**  
   - Form (email, password) với React Hook Form + Zod.  
   - Submit → `POST /auth/login` (dùng `api` từ `lib/axios.ts`).  
   - Success: `setAccessToken`, `setRefreshToken` (từ `lib/auth-token.ts`), `router.push(callbackUrl || '/dashboard')`.  
   - Fail: toast lỗi (Sonner).

3. **Auth / User context**  
   - Context (hoặc provider) lưu user từ `GET /auth/me` (hoặc `/auth/me/detailed`).  
   - Gọi khi app/layout mount (client).  
   - Nếu role `USER` → redirect hoặc trang “Access Restricted”.  
   - Export `useAuth()` để component dùng user + logout.

4. **Logout**  
   - Hàm logout: gọi `POST /auth/logout`, `clearTokens()`, redirect `/login`.  
   - Gắn vào NavUser (dropdown) và bất kỳ nút logout nào.

5. **Gắn Toaster**  
   Trong `app/layout.tsx` thêm `<Toaster />` (từ `components/ui/sonner.tsx`) để login/error toast hoạt động.

### Bước 2: Layout Dashboard (Phase 1)

6. **Sidebar + Header**  
   - Sidebar trái (collapsible), menu: Dashboard, Orders, Marketing, Check-in (route placeholder).  
   - Header: logo/breadcrumb, ô search (placeholder), NavUser (avatar + dropdown logout/profile).  
   - Layout trong `app/(dashboard)/layout.tsx` dùng Sidebar + Header + `<main>{children}</main>`.

7. **NavUser**  
   - Hiển thị tên/avatar từ user context, dropdown: Profile (placeholder), Logout (gọi logout).

### Bước 3: Chuẩn bị Phase 2 (Dashboard core)

8. **Event selector context**  
   Global state (context hoặc store) “event hiện tại” để các trang dashboard/orders filter theo event.

9. **Dashboard page**  
   - Stats cards (Revenue, Tickets sold) – API `GET /dashboard/event/:id`.  
   - Chart revenue theo thời gian – API `GET /dashboard/event/:id/time`.  
   - Realtime check-in – API `GET /checkin/realtime/:eventId` (refetch 30s).  
   - Recent activity: bảng 5 order gần nhất.

---

## Tóm tắt

- **Đã có:** 3 route (/, /login, /dashboard) dạng placeholder + foundation (axios, token, query, shadcn, sonner).  
- **Next step ngay:** Middleware bảo vệ `/dashboard` → Login form + API → Auth/Me context + Logout → Sidebar + Header + NavUser → Toaster trong layout.  
- **Sau đó:** Event selector + Dashboard page với stats, chart, realtime, recent orders (Phase 2).
