# DEVELOPMENT ROADMAP

## Phase 1: Foundation & Authentication (Week 1)
- [x] Initialize Next.js project with Tailwind & Shadcn.
- [x] Setup Axios Instance with Interceptors (Req/Res).
- [x] **Auth Flow:**
    - [x] Build Login Page (`/login`) - API: `POST /auth/login`.
    - [x] Implement Middleware to protect `/dashboard/*` routes.
    - [x] Store Token in HttpOnly Cookie or Secure LocalStorage (Client-side).
    - [x] Build "Me" Context (Fetch User Profile) - API: `GET /auth/me`.
    - [x] Handle Logout - API: `POST /auth/logout`.
- [x] **Layout:**
    - [x] Build Sidebar & Header Shell.
    - [x] Create `NavUser` component (Dropdown logout/profile).

## Phase 2: The Dashboard Core (MVP) (Week 2)
- [x] **Dashboard Overview Page:**
    - [x] "Event Selector" context (Global state to pick current event).
    - [x] **Stats Cards:** Total Revenue, Tickets Sold (API: `/dashboard/event/:id`).
    - [x] **Chart:** Revenue over time (API: `/dashboard/event/:id/time`).
    - [x] **Real-time Pulse:** Live Check-in counter (API: `/checkin/realtime/:eventId`).
- [x] **Recent Activity:**
    - [x] Mini-table showing last 5 orders.
- [x] **Dashboard bổ sung (theo RULES):**
    - [x] Dark mode (toggle trong Header).
    - [x] Bảng phân tích doanh thu theo ngày (từ API `/dashboard/event/:id/time`).
    - [x] Chart doanh thu filter theo mốc thời gian (7d/30d/90d) + chọn khoảng ngày (calendar).
    - [x] Bảng doanh thu theo kênh social (giả lập, API bổ sung sau).

## Phase 3: Order Management (Week 3)
- [ ] **Orders List (`/orders`):**
    - [ ] Data Table with Pagination, Sorting, Filters (Status, Search).
    - [ ] API: `/orders` (Filter by Event ID).
- [ ] **Order Detail (`/orders/:id`):**
    - [ ] View Customer Info & Items.
    - [ ] Action: Cancel Order (API: `/orders/:id/cancel`).
    - [ ] Action: Resend Email (API: `/orders/:id/send-tickets`).

## Phase 4: Marketing & Check-in (Week 4)
- [ ] **Coupon Management (`/marketing`):**
    - [ ] List Coupons (API: `/coupons`).
    - [ ] Create/Edit Coupon Modal.
    - [ ] Coupon Analytics Chart (API: `/coupons/analytics/top-used`).
- [ ] **Check-in Reports (`/checkin`):**
    - [ ] Logs Table (Who entered at what time).
    - [ ] Sync status visualization.

## Phase 5: Polish & Optimization
- [ ] Add Skeleton Loaders for all pages.
- [ ] Error Boundary handling (404, 500 pages).
- [ ] Mobile Responsiveness check.
