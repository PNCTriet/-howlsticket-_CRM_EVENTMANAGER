# DEVELOPMENT ROADMAP

## Phase 1: Foundation & Authentication (Week 1)
- [ ] Initialize Next.js project with Tailwind & Shadcn.
- [ ] Setup Axios Instance with Interceptors (Req/Res).
- [ ] **Auth Flow:**
    - [ ] Build Login Page (`/login`) - API: `POST /auth/login`.
    - [ ] Implement Middleware to protect `/dashboard/*` routes.
    - [ ] Store Token in HttpOnly Cookie or Secure LocalStorage (Client-side).
    - [ ] Build "Me" Context (Fetch User Profile) - API: `GET /auth/me`.
    - [ ] Handle Logout - API: `POST /auth/logout`.
- [ ] **Layout:**
    - [ ] Build Sidebar & Header Shell.
    - [ ] Create `NavUser` component (Dropdown logout/profile).

## Phase 2: The Dashboard Core (MVP) (Week 2)
- [ ] **Dashboard Overview Page:**
    - [ ] "Event Selector" context (Global state to pick current event).
    - [ ] **Stats Cards:** Total Revenue, Tickets Sold (API: `/dashboard/event/:id`).
    - [ ] **Chart:** Revenue over time (API: `/dashboard/event/:id/time`).
    - [ ] **Real-time Pulse:** Live Check-in counter (API: `/checkin/realtime/:eventId`).
- [ ] **Recent Activity:**
    - [ ] Mini-table showing last 5 orders.

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