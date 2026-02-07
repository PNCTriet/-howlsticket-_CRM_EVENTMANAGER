## API tổng quan OCX Ticketing Backend

### Ghi chú chung

- **Base URL**: `https://api.yourdomain.com` (thay bằng URL thực tế)
- **Auth**:
  - Nơi có `JwtAuthGuard` → cần header: `Authorization: Bearer <access_token>`
  - Nơi có `RoleGuard` + `@Roles(...)` → chỉ các role được khai báo mới truy cập được.
- **Roles chính**:
  - `USER`
  - `ADMIN_ORGANIZER`
  - `OWNER_ORGANIZER`
  - `SUPERADMIN`

---

## 1. Auth (`/auth`)

| Method | Path              | Mô tả                                           | Auth                          |
|--------|-------------------|-------------------------------------------------|-------------------------------|
| POST   | `/auth/login`     | Đăng nhập, trả về access/refresh token         | Public                        |
| POST   | `/auth/register`  | Đăng ký user mới                               | Public                        |
| GET    | `/auth/me`        | Lấy thông tin user hiện tại (ẩn bớt cho USER)  | JWT                           |
| GET    | `/auth/me/detailed` | Thông tin chi tiết user hiện tại             | JWT + role ≠ `USER`          |
| POST   | `/auth/sync-profile` | Đồng bộ profile từ Supabase về local DB     | JWT                           |
| POST   | `/auth/logout`    | Logout (logic đơn giản, xoá client token)     | Public                        |
| POST   | `/auth/refresh`   | Đổi refresh token lấy access token mới         | Public                        |

---

## 2. Users (`/users`)

Tất cả đều yêu cầu JWT.

| Method | Path                               | Mô tả                                                                 | Auth                                      |
|--------|------------------------------------|-----------------------------------------------------------------------|-------------------------------------------|
| POST   | `/users`                           | Tạo user mới                                                          | JWT + `SUPERADMIN`                        |
| GET    | `/users`                           | Lấy danh sách tất cả user                                             | JWT + `SUPERADMIN`                        |
| GET    | `/users/:id`                       | Lấy chi tiết user theo ID                                             | JWT + `SUPERADMIN`                        |
| GET    | `/users/by-supabase/:uuid`         | Lấy user theo Supabase ID                                             | JWT + `SUPERADMIN`                        |
| PATCH  | `/users/:id`                       | Cập nhật user: SUPERADMIN cập nhật bất kỳ; user thường update chính mình (phone/fb) | JWT                   |
| DELETE | `/users/:id`                       | Xoá user                                                              | JWT + `SUPERADMIN`                        |
| POST   | `/users/admin/migrate-users`       | Migrate user từ Supabase Auth sang local DB                           | JWT + `SUPERADMIN`                        |

---

## 3. Organizations (`/organizations`)

Hiện **không có guard** → public (nếu muốn siết quyền có thể thêm sau).

| Method | Path                       | Mô tả                      | Auth   |
|--------|----------------------------|----------------------------|--------|
| POST   | `/organizations`           | Tạo organization           | Public |
| GET    | `/organizations`           | Danh sách organizations    | Public |
| GET    | `/organizations/:id`       | Chi tiết organization      | Public |
| PATCH  | `/organizations/:id`       | Cập nhật organization      | Public |
| DELETE | `/organizations/:id`       | Xoá organization           | Public |

---

## 4. Events (`/events`) & Event Settings & Templates

### 4.1 Events cơ bản (`EventsController`)

| Method | Path              | Mô tả                                           | Auth   |
|--------|-------------------|-------------------------------------------------|--------|
| POST   | `/events`         | Tạo event mới                                   | Public |
| GET    | `/events`         | Danh sách events (có filter theo `organization_id`) | Public |
| GET    | `/events/:id`     | Chi tiết event                                  | Public |
| PATCH  | `/events/:id`     | Cập nhật event                                  | Public |
| DELETE | `/events/:id`     | Xoá event                                       | Public |

### 4.2 Event settings (`EventSettingsController`)

Base path: `/events/:eventId/settings`

| Method | Path                         | Mô tả                                                    | Auth                                            |
|--------|------------------------------|----------------------------------------------------------|-------------------------------------------------|
| GET    | `/events/:eventId/settings`  | Lấy cài đặt auto send email confirm/ticket cho event     | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| PUT    | `/events/:eventId/settings`  | Cập nhật cài đặt auto send email confirm/ticket cho event| JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |

### 4.3 Event templates (`EventTemplateController`, `EventTemplatesController`)

Base path 1: `/events/:eventId/template`

| Method | Path                           | Mô tả                                             | Auth                                            |
|--------|--------------------------------|---------------------------------------------------|-------------------------------------------------|
| POST   | `/events/:eventId/template`    | Tạo/cập nhật template cấu hình cho event          | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/events/:eventId/template`    | Lấy template settings cho event                   | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| PATCH  | `/events/:eventId/template`    | Update template settings                          | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| DELETE | `/events/:eventId/template`    | Xoá template settings của event                   | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |

Base path 2: `/event-templates`

| Method | Path                         | Mô tả                                      | Auth                                            |
|--------|------------------------------|--------------------------------------------|-------------------------------------------------|
| GET    | `/event-templates/custom`    | Danh sách các event có custom template     | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |

---

## 5. Tickets (`/tickets`)

Hiện không có guard.

| Method | Path                         | Mô tả                                               | Auth   |
|--------|------------------------------|-----------------------------------------------------|--------|
| POST   | `/tickets`                   | Tạo ticket                                          | Public |
| GET    | `/tickets`                   | Danh sách tickets (filter theo `organization_id`)   | Public |
| GET    | `/tickets/:id`               | Chi tiết ticket                                     | Public |
| PATCH  | `/tickets/:id`               | Cập nhật ticket                                     | Public |
| DELETE | `/tickets/:id`               | Xoá ticket                                          | Public |
| GET    | `/tickets/event/:event_id`   | Danh sách tickets theo event                        | Public |

---

## 6. Orders (`/orders`) & Order Item Codes

### 6.1 Orders chính (`OrdersController`)

| Method | Path                                   | Mô tả                                                          | Auth                                                 |
|--------|----------------------------------------|----------------------------------------------------------------|------------------------------------------------------|
| POST   | `/orders/admin`                       | Admin/Owner/Superadmin tạo order cho user khác                 | JWT + `OWNER_ORGANIZER`/`SUPERADMIN`                 |
| POST   | `/orders`                              | User tạo order cho chính mình                                  | JWT                                                  |
| GET    | `/orders/:id`                          | Lấy chi tiết order (check quyền trong service: user hoặc admin)| JWT                                                  |
| POST   | `/orders/:id/cancel`                   | Huỷ order                                                      | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/orders`                              | Danh sách orders (theo user/role)                             | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| POST   | `/orders/expire-expired`              | Expire các orders hết hạn                                     | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/orders/:id/check-expiration`         | Kiểm tra order hết hạn chưa                                   | JWT                                                  |
| GET    | `/orders/:orderId/items`              | Danh sách order items                                         | JWT                                                  |
| GET    | `/orders/event/:eventId/items`        | Order items theo event                                        | JWT                                                  |
| POST   | `/orders/:orderId/items`              | Thêm order item                                               | JWT                                                  |
| PATCH  | `/orders/:orderId/items/:itemId`      | Cập nhật order item                                           | JWT                                                  |
| DELETE | `/orders/:orderId/items/:itemId`      | Xoá order item                                                | JWT                                                  |
| GET    | `/orders/:orderId/payments`           | Danh sách payments của order                                  | JWT                                                  |
| POST   | `/orders/:orderId/payments`           | Tạo payment cho order                                         | JWT                                                  |
| PATCH  | `/orders/:orderId/payments/:paymentId`| Cập nhật payment                                              | JWT                                                  |
| DELETE | `/orders/:orderId/payments/:paymentId`| Xoá payment                                                   | JWT                                                  |
| PATCH  | `/orders/:id/sending-status`          | Cập nhật `sending_status` email vé (user hoặc admin)          | JWT + `RoleGuard` (tất cả roles)                    |
| POST   | `/orders/:id/generate-tickets`        | Gen vé thủ công cho order đã thanh toán                       | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| POST   | `/orders/:id/send-tickets`            | Gửi email vé thủ công cho order đã thanh toán                 | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |

### 6.2 Order Item Codes (`OrderItemCodeController`)

Base path: `/order-item-codes`

| Method | Path                          | Mô tả                                              | Auth              |
|--------|-------------------------------|----------------------------------------------------|-------------------|
| GET    | `/order-item-codes`          | Danh sách order item codes (filter `orderItemId`)  | JWT + `SUPERADMIN`|
| GET    | `/order-item-codes/:id`      | Chi tiết 1 order item code                         | JWT + `SUPERADMIN`|
| PATCH  | `/order-item-codes/:id`      | Cập nhật code (trạng thái used, used_at, ...)      | JWT + `SUPERADMIN`|
| DELETE | `/order-item-codes/:id`      | Xoá code                                           | JWT + `SUPERADMIN`|

---

## 7. Payments (`/payments`)

| Method | Path                                   | Mô tả                                                                 | Auth                                            |
|--------|----------------------------------------|-----------------------------------------------------------------------|-------------------------------------------------|
| POST   | `/payments/webhook/sepay`             | Webhook từ Sepay, tự động match payment với order                    | Public (dùng secret riêng ở backend)            |
| GET    | `/payments/order/:orderId`            | Thông tin payment của 1 order                                         | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/payments/match/:orderId`            | Match manual payment với order                                        | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/payments/unmatched`                 | Danh sách payments chưa match                                         | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/payments/pending-orders`            | Danh sách orders đang PENDING có thể match                            | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/payments/event/:eventId`            | Danh sách payments thành công của 1 event (kèm thống kê)             | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/payments/event/:eventId/revenue-summary` | Tổng quan doanh thu event (không phân trang)                     | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |

---

## 8. Coupons (`/coupons`) & Coupons Analytics

### 8.1 Coupons chính (`CouponsController`)

Class dùng `@UseGuards(JwtAuthGuard)` ở mức controller, một số method có thêm `RoleGuard`.

| Method | Path                              | Mô tả                                                       | Auth                                            |
|--------|-----------------------------------|-------------------------------------------------------------|-------------------------------------------------|
| POST   | `/coupons`                       | Tạo coupon mới                                              | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons`                       | Danh sách coupons (pagination + filter)                     | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| POST   | `/coupons/search`                | Tìm kiếm coupons bằng body (như GET /coupons)              | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/:id`                   | Chi tiết coupon (kèm lịch sử sử dụng)                      | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| PUT    | `/coupons/:id`                   | Cập nhật coupon                                             | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| DELETE | `/coupons/:id`                   | Soft delete (set INACTIVE)                                  | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| PATCH  | `/coupons/:id/status`            | Đổi trạng thái coupon                                       | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| POST   | `/coupons/validate`              | Validate coupon cho user (tính discount, còn dùng được không)| JWT (user thường)                                |
| GET    | `/coupons/public`                | Danh sách public coupons (type MASS) theo `event_id`       | Public                                          |
| POST   | `/coupons/bulk-export`           | Tạo job export coupon ra CSV/Excel                          | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| POST   | `/coupons/bulk-import`           | Import coupons từ file CSV/Excel                            | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| POST   | `/coupons/bulk/generate`         | Gen nhiều coupon với rule custom                            | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/bulk-jobs/:queue/:jobId/status` | Trạng thái job bulk (export/import/generate)       | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/bulk-jobs/my-jobs`     | Danh sách job bulk của user hiện tại                        | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/downloads/:fileName`   | Tải file export hoặc error report                           | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |

### 8.2 Coupons analytics (`AnalyticsController`)

Base path: `/coupons/analytics`, controller gắn `JwtAuthGuard` + nhiều method có `RoleGuard`.

| Method | Path                                      | Mô tả                                             | Auth                                            |
|--------|-------------------------------------------|---------------------------------------------------|-------------------------------------------------|
| GET    | `/coupons/analytics/overview`            | Tổng quan analytics cho tất cả coupons            | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/analytics/:id/analytics`       | Analytics chi tiết cho 1 coupon                   | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/analytics/:id/usage-history`   | Lịch sử sử dụng coupon (phân trang)              | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/analytics/time-based`          | Analytics theo thời gian (daily/weekly/monthly)  | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/analytics/daily`               | Daily analytics 30 ngày gần nhất                  | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/analytics/weekly`              | Weekly analytics 12 tuần gần nhất                 | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/analytics/monthly`             | Monthly analytics                                  | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/analytics/top-used`            | Top coupons được dùng nhiều                        | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/analytics/conversion`          | Conversion analytics theo loại/organization       | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/analytics/revenue-impact`      | Ảnh hưởng doanh thu (giảm giá, so sánh order)    | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/analytics/users`               | User analytics (hành vi dùng coupon)             | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| GET    | `/coupons/analytics/dashboard`           | Dữ liệu dashboard tổng hợp                        | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |

---

## 9. Check-in (`/checkin`)

Tất cả endpoints dùng `JwtAuthGuard` (không `RoleGuard`) → yêu cầu JWT, thường là token nhân viên/organizer.

| Method | Path                              | Mô tả                                                        | Auth |
|--------|-----------------------------------|--------------------------------------------------------------|------|
| POST   | `/checkin/verify-qr`             | Verify QR & thực hiện check-in vé                            | JWT  |
| GET    | `/checkin/logs`                  | Lịch sử check-in (có thể filter theo `eventId`/`orderId`)    | JWT  |
| GET    | `/checkin/stats/:eventId`        | Thống kê check-in của 1 event                                | JWT  |
| GET    | `/checkin/user-activities/:eventId` | Hoạt động check-in theo user (cho dashboard phân tích)    | JWT  |
| GET    | `/checkin/realtime/:eventId`     | Dữ liệu realtime check-in cho dashboard                      | JWT  |

---

## 10. Dashboard (`/dashboard`)

Hiện chỉ dùng `JwtAuthGuard` (không RoleGuard).

| Method | Path                                    | Mô tả                                       | Auth |
|--------|-----------------------------------------|---------------------------------------------|------|
| GET    | `/dashboard/system`                    | Thống kê hệ thống tổng quan                 | JWT  |
| GET    | `/dashboard/system/time`               | Thống kê hệ thống theo thời gian            | JWT  |
| GET    | `/dashboard/organization/:id`          | Thống kê cho 1 organization                 | JWT  |
| GET    | `/dashboard/organization/:id/time`     | Thống kê organization theo thời gian        | JWT  |
| GET    | `/dashboard/organization/:id/export/pdf` | Xuất PDF thống kê organization            | JWT  |
| GET    | `/dashboard/organization/:id/export/csv` | Xuất CSV thống kê organization            | JWT  |
| POST   | `/dashboard/organization/:id/send-report` | Gửi báo cáo dashboard qua email          | JWT  |
| GET    | `/dashboard/event/:id`                 | Thống kê 1 event                            | JWT  |
| GET    | `/dashboard/event/:id/time`            | Thống kê event theo thời gian               | JWT  |

---

## 11. Email (`/email`) & Custom Email

### 11.1 Email chuẩn (`EmailController`)

Base path: `/email`

| Method | Path                               | Mô tả                                           | Auth                                            |
|--------|------------------------------------|-------------------------------------------------|-------------------------------------------------|
| POST   | `/email/send-tickets/:orderId`    | Gửi email vé điện tử (PDF đính kèm)            | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| POST   | `/email/send-confirmation/:orderId` | Gửi email xác nhận đặt vé (không PDF)        | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |

### 11.2 Custom email (`CustomEmailController`)

Base path cũng là `/email`.

| Method | Path                                        | Mô tả                                                           | Auth                                            |
|--------|---------------------------------------------|-----------------------------------------------------------------|-------------------------------------------------|
| POST   | `/email/send-tickets-custom/:orderId`      | Gửi email vé điện tử với custom template + PDF                 | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |
| POST   | `/email/send-confirmation-custom/:orderId` | Gửi email xác nhận với custom template (không PDF)             | JWT + `ADMIN_ORGANIZER`/`OWNER_ORGANIZER`/`SUPERADMIN` |

---

## 12. Coupons check-in / analytics khác

Đã được gộp trong phần **8.2 Coupons analytics**.

---

## 13. Health check

| Method | Path | Mô tả                      | Auth |
|--------|------|----------------------------|------|
| GET    | `/`  | Trả về chuỗi hello (test) | Public |

