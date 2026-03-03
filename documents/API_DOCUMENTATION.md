# 📚 API Documentation

> **Lưu ý về xác thực:**
> - Hệ thống sử dụng xác thực JWT chuẩn HS256 (Legacy JWT Secret của Supabase).
> - Tất cả các API bảo vệ đều yêu cầu header: `Authorization: Bearer <ACCESS_TOKEN>`
> - **Swagger UI:** Truy cập `http://localhost:3000/api/docs` để test API với giao diện web

---

## 1. Auth API
- **GET** `/auth/me` — Lấy thông tin user hiện tại (minimal data theo role)
- **GET** `/auth/me/detailed` — Lấy thông tin chi tiết user (Admin/Organizer only)
- **POST** `/auth/login` — Đăng nhập
- **POST** `/auth/register` — Đăng ký
- **POST** `/auth/logout` — Đăng xuất
- **POST** `/auth/refresh` — Refresh token
- **POST** `/auth/sync-profile` — Đồng bộ profile từ Supabase

## 2. Users API
- CRUD /users
- **Fields:** id, supabase_id, email, first_name, last_name, phone, avatar_url, fb, is_verified, role, created_at, updated_at

## 3. Organizations API
- CRUD /organizations

## 4. Events API
- CRUD /events

## 5. Tickets API
- CRUD /tickets

## 6. Orders API
- CRUD /orders, /orders/:id/items, /orders/:id/payments
- **POST /orders/admin** — Tạo order cho user cụ thể (OWNER_ORGANIZER, SUPERADMIN only)
- **POST /orders/:id/generate-tickets** — Generate tickets thủ công cho order đã thanh toán
- **POST /orders/:id/send-tickets** — Gửi email vé thủ công cho order đã thanh toán
- **GET /orders/event/:eventId/items** — Lấy order items theo event ID
- Order Expiration: /orders/expire-expired, /orders/:id/check-expiration
- **PATCH /orders/:id/sending-status** — Cập nhật trạng thái gửi mail ticket cho order (NOT_SENT, SENDING, SENT, FAILED)

**Referral Fields (Mới):**
- `referral_code`: Mã giới thiệu từ saler/partner (mặc định: "DIRECT")
- `referral_type`: Loại nguồn bán hàng - "saler", "affiliate", "direct", "partner" (mặc định: "direct")

## 7. Order Item Codes API (SUPERADMIN only)
- GET /order-item-codes
- GET /order-item-codes/:id
- PATCH /order-item-codes/:id
- DELETE /order-item-codes/:id

## 8. Check-in API
- POST /checkin/verify-qr
- GET /checkin/logs
- GET /checkin/stats/:eventId

## 9. Payment API
- POST /payments/webhook/sepay
- GET /payments/order/:orderId
- GET /payments/match/:orderId
- GET /payments/unmatched
- GET /payments/pending-orders
- GET /payments/event/:eventId
- GET /payments/event/:eventId/revenue-summary

## 10. Dashboard API
- GET /dashboard/system
- GET /dashboard/system/time
- GET /dashboard/organization/:id
- GET /dashboard/organization/:id/time
- GET /dashboard/organization/:id/export/pdf
- GET /dashboard/organization/:id/export/csv
- POST /dashboard/organization/:id/send-report
- GET /dashboard/event/:id
- GET /dashboard/event/:id/time

## 11. Email API
- POST /email/send-tickets/:orderId
- POST /email/send-confirmation/:orderId

## 12. Event Settings API
- GET /events/:eventId/settings
- PUT /events/:eventId/settings

---

## **Chi tiết các API mới/cập nhật:**

### 7. Order Item Codes API (SUPERADMIN only)
- **GET** `/order-item-codes` — Lấy danh sách mã code (query: orderItemId)
- **GET** `/order-item-codes/:id` — Xem chi tiết mã code
- **PATCH** `/order-item-codes/:id` — Cập nhật trạng thái mã code (used, used_at)
- **DELETE** `/order-item-codes/:id` — Xoá mã code
- **Required Role:** SUPERADMIN

### 8. Check-in API
- **POST** `/checkin/verify-qr` — Xác thực QR, check-in
- **GET** `/checkin/logs` — Lấy logs check-in (query: eventId, orderId)
- **GET** `/checkin/stats/:eventId` — Thống kê check-in theo event

### 9. Payment API
- **POST** `/payments/webhook/sepay` — Nhận webhook từ Sepay
- **GET** `/payments/order/:orderId` — Lấy payment theo order
- **GET** `/payments/match/:orderId` — Match thủ công payment với order
- **GET** `/payments/unmatched` — Danh sách payment chưa match
- **GET** `/payments/pending-orders` — Danh sách order chờ thanh toán
- **GET** `/payments/event/:eventId` — Lấy tất cả payment của event (với pagination)
- **GET** `/payments/event/:eventId/revenue-summary` — Lấy tổng doanh thu và thống kê event
- **Required Role:** ADMIN_ORGANIZER, OWNER_ORGANIZER, SUPERADMIN (trừ webhook)
- **Logic matching:**
  1. Ưu tiên orderId trong content
  2. Amount + thời gian gần
  3. Email user (nếu có)
  4. Nếu không match, lưu payment PENDING để admin match thủ công

**Payment Event APIs:**
- **GET** `/payments/event/:eventId` — Lấy danh sách payment của event
  - **Query Parameters:**
    - `limit` (optional): Số lượng records trả về (default: 3000)
    - `offset` (optional): Số lượng records bỏ qua (default: 0)
  - **Response:**
    ```json
    {
      "event": { "id": "event_cuid", "title": "Event Title" },
      "payments": [
        {
          "id": "payment_cuid",
          "amount": 199000,
          "status": "SUCCESS",
          "order": {
            "id": "order_cuid",
            "user": { "email": "user@example.com" },
            "order_items": [
              {
                "ticket": { "name": "Vé Đứng", "price": 199000 }
              }
            ]
          }
        }
      ],
      "pagination": { "total": 150, "limit": 3000, "offset": 0, "hasMore": false },
      "summary": { "totalRevenue": 29850000, "totalPayments": 150 }
    }
    ```

- **GET** `/payments/event/:eventId/revenue-summary` — Lấy tổng doanh thu và thống kê
  - **Description:** Tính tổng doanh thu, thống kê theo ngày, breakdown theo ticket type
  - **Response:**
    ```json
    {
      "event": { "id": "event_cuid", "title": "Event Title" },
      "summary": {
        "totalRevenue": 29850000,
        "totalPayments": 150,
        "totalOrders": 150,
        "averageOrderValue": 199000
      },
      "dailyStats": [
        {
          "date": "2025-07-27T00:00:00Z",
          "revenue": 1990000,
          "paymentCount": 10
        }
      ],
      "ticketStats": [
        {
          "ticket_name": "Vé Đứng",
          "total_quantity": 100,
          "total_revenue": 19900000,
          "order_count": 100
        }
      ]
    }
    ```

### 10. Dashboard API
- **GET** `/dashboard/system` — Thống kê tổng quan hệ thống
- **GET** `/dashboard/system/time` — Thống kê hệ thống theo thời gian
  - **Query Parameters:**
    - `from` (required): Ngày bắt đầu (YYYY-MM-DD)
    - `to` (required): Ngày kết thúc (YYYY-MM-DD)
    - `groupBy` (optional): 'day' | 'week' | 'month' (default: 'day')
  - **Response:**
    ```json
    [
      {
        "time": "2025-01-16",
        "revenue": 500000,
        "tickets_sold": 10,
        "events_created": 2,
        "organizations_created": 1
      }
    ]
    ```
- **GET** `/dashboard/organization/:id` — Thống kê tổ chức
- **GET** `/dashboard/organization/:id/time` — Thống kê tổ chức theo thời gian
- **GET** `/dashboard/organization/:id/export/pdf|csv` — Xuất báo cáo tổ chức PDF/CSV
- **POST** `/dashboard/organization/:id/send-report` — Gửi báo cáo tổ chức qua email
- **GET** `/dashboard/event/:id` — Thống kê sự kiện
- **GET** `/dashboard/event/:id/time` — Thống kê sự kiện theo thời gian
  - **Timezone:** Dashboard frontend tính "today"/"yesterday" theo **Vietnam (Asia/Ho_Chi_Minh)**. Để doanh thu "trong ngày" khớp với ngày VN, backend nên **group by day theo timezone Vietnam** (ví dụ: `DATE(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh')`). Nếu group theo UTC, order từ 1h–7h sáng VN sẽ bị tính vào ngày UTC trước đó.

### 11. Email API
- **POST** `/email/send-tickets/:orderId` — Gửi email vé điện tử với PDF đính kèm
  - **Required Role:** ADMIN_ORGANIZER, OWNER_ORGANIZER, SUPERADMIN
  - **Description:** Gửi email chứa vé điện tử PDF cho đơn hàng đã thanh toán thành công
  - **Response:**
    ```json
    {
      "success": true,
      "message": "Email sent successfully with PDF tickets attached",
      "ticketsSent": 3,
      "orderNumber": "order_cuid",
      "sentAt": "2024-01-15T14:30:25.000Z",
      "emailId": "resend_email_id",
      "attachments": ["file1.pdf", "file2.pdf", "file3.pdf"]
    }
    ```
  - **Error Responses:**
    - `400`: Đơn hàng chưa thanh toán hoặc không tìm thấy
    - `403`: Không có quyền truy cập

- **POST** `/email/send-confirmation/:orderId` — Gửi email xác nhận đặt vé thành công
  - **Required Role:** ADMIN_ORGANIZER, OWNER_ORGANIZER, SUPERADMIN
  - **Description:** Gửi email xác nhận đặt vé (không kèm PDF) để thông báo cho user biết đơn hàng đã được ghi nhận
  - **Response:**
    ```json
    {
      "success": true,
      "message": "Order confirmation email sent successfully",
      "orderNumber": "order_cuid",
      "sentAt": "2024-01-15T14:30:25.000Z",
      "emailId": "resend_email_id"
    }
    ```
  - **Error Responses:**
    - `400`: Không tìm thấy đơn hàng hoặc email user
    - `403`: Không có quyền truy cập

### 12. Event Settings API
- **GET** `/events/:eventId/settings` — Lấy cài đặt email tự động cho event
  - **Required Role:** ADMIN_ORGANIZER, OWNER_ORGANIZER, SUPERADMIN
  - **Description:** Lấy cài đặt auto send confirm email và ticket email cho event
  - **Response:**
    ```json
    {
      "auto_send_confirm_email": true,
      "auto_send_ticket_email": false
    }
    ```
  - **Error Responses:**
    - `404`: Event not found
    - `403`: Access denied

- **PUT** `/events/:eventId/settings` — Cập nhật cài đặt email tự động cho event
  - **Required Role:** ADMIN_ORGANIZER, OWNER_ORGANIZER, SUPERADMIN
  - **Description:** Cập nhật cài đặt auto send confirm email và ticket email cho event
  - **Body:**
    ```json
    {
      "auto_send_confirm_email": true,
      "auto_send_ticket_email": false
    }
    ```
  - **Response:** Tương tự GET
  - **Error Responses:**
    - `404`: Event not found
    - `403`: Access denied

**Logic Auto Send Email:**
1. **Auto send confirm email = true, Auto send ticket email = false:**
   - ✅ Gửi confirm email tự động khi order PAID
   - ❌ Không gửi ticket email tự động
   - 📧 Ticket email phải gửi thủ công qua API

2. **Auto send ticket email = true (bất kể confirm email):**
   - ✅ Gửi ticket email tự động khi order PAID
   - ❌ Không gửi confirm email (dù có bật hay không)
   - 📧 Confirm email không được gửi

3. **Cả hai đều false:**
   - ❌ Không gửi email tự động
   - 📧 Phải gửi thủ công qua API

**Luồng Email:**
1. **Email xác nhận:** Gửi ngay sau khi đặt vé thành công để thông báo cho user
2. **Email vé điện tử:** Gửi sau khi thanh toán thành công với PDF vé đính kèm
3. **Auto Email:** Tự động gửi email dựa trên cài đặt của event khi thanh toán thành công

### 6. Orders API (bổ sung)
- **GET** `/orders/event/:eventId/items` — Lấy order items theo event ID
  - **Required Role:** USER (cần JWT token)
  - **Response:**
    ```json
    {
      "event_id": "event_cuid",
      "event_name": "Event Title",
      "total_items": 5,
      "items": [
        {
          "id": "item_cuid",
          "quantity": 2,
          "price": 100000,
          "order": {
            "id": "order_cuid",
            "status": "PAID",
            "created_at": "2025-01-16T10:30:00Z",
            "user": {
              "id": "user_cuid",
              "email": "user@example.com",
              "first_name": "John",
              "last_name": "Doe"
            }
          },
          "ticket": {
            "id": "ticket_cuid",
            "name": "VIP Ticket",
            "price": 100000,
            "description": "VIP access"
          },
          "codes": [
            {
              "id": "code_cuid",
              "code": "qr_hash",
              "used": false,
              "used_at": null,
              "created_at": "2025-01-16T10:30:00Z"
            }
          ]
        }
      ]
    }
    ```
  - **Description:**
    Lấy tất cả order items của một event cụ thể, bao gồm thông tin order, user, ticket và QR codes.

- **PATCH** `/orders/:id/sending-status` — Cập nhật trạng thái gửi mail ticket cho order
  - **Body:**
    ```json
    { "sending_status": "SENT" }
    ```
  - **Required Role:** USER (chủ order) hoặc ADMIN_ORGANIZER, OWNER_ORGANIZER, SUPERADMIN
  - **Response:**
    ```json
    { "message": "Order sending_status updated", "order": { ...order } }
    ```
  - **Description:**
    Cho phép FE cập nhật trạng thái gửi mail ticket cho order (NOT_SENT, SENDING, SENT, FAILED) sau khi gửi mail thành công/thất bại.

---

## **Phân quyền (Role):**
- USER: Tạo order, xem order của mình
- ADMIN_ORGANIZER, OWNER_ORGANIZER, SUPERADMIN: Quản lý tất cả order, payment, dashboard
- SUPERADMIN: Quản lý order_item_code

---

## **Ví dụ cURL và response mẫu:**
(Đã có chi tiết ở từng section phía trên, giữ nguyên các ví dụ cũ, bổ sung ví dụ cho các API mới nếu cần)

---

## **Trạng thái hệ thống:**
- Đã hoàn thiện các flow chính: đặt vé, giữ vé, expire, QR code, check-in, payment (Sepay), matching thông minh, API documentation đầy đủ, và có thể mở rộng cho các cổng thanh toán khác.

---

**Next Steps:**
- [ ] Webhook system (gửi webhook cho tổ chức, retry)
- [ ] Unit test, e2e test, checklist production 

---

## **🔒 Security Optimized Auth API (Mới cập nhật)**

### **GET** `/auth/me` — Lấy thông tin user hiện tại (Tối ưu bảo mật)

**Response theo Role:**

#### **USER Role Response:**
```json
{
  "authenticated": true,
  "message": "User authenticated successfully"
}
```

#### **ADMIN_ORGANIZER/OWNER_ORGANIZER/SUPERADMIN Role Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "cmd6f655r0000jks4336pctij",
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "role": "OWNER_ORGANIZER",
    "is_verified": true,
    "phone": "0123456789",
    "avatar_url": "https://example.com/avatar.jpg"
  }
}
```

### **GET** `/auth/me/detailed` — Lấy thông tin chi tiết (Admin/Organizer only)

**USER Role Response (Access Denied):**
```json
{
  "error": "Access denied. This endpoint is only available for administrators and organizers.",
  "authenticated": true
}
```

**Admin/Organizer Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "cmd6f655r0000jks4336pctij",
    "supabase_id": "7251b842-b849-4ba1-a658-8c0ec531e28d",
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "phone": "0123456789",
    "avatar_url": "https://example.com/avatar.jpg",
    "fb": "https://www.facebook.com/admin",
    "is_verified": true,
    "created_at": "2025-07-16T20:34:18.399Z",
    "updated_at": "2025-08-30T03:35:11.181Z",
    "role": "OWNER_ORGANIZER"
  }
}
```

### **🔐 Security Benefits:**
1. **Zero Data Exposure:** Regular users không nhận bất kỳ thông tin user nào
2. **Role-Based Access:** Admin/Organizer có quyền truy cập thông tin cần thiết
3. **Separate Endpoints:** Tách biệt endpoint cơ bản và chi tiết
4. **No Sensitive Data:** Không trả về bất kỳ thông tin nhạy cảm cho regular users
5. **Authentication Confirmation:** Luôn trả về `authenticated: true` để confirm

---

## **🎯 Referral System (Hệ thống mã giới thiệu):**

### **Mục đích:**
- Phân loại order theo nguồn bán hàng (Direct sale, Saler, Affiliate, Partner)
- Tracking hiệu quả bán hàng của từng saler/partner
- Phân tích marketing và nguồn khách hàng

### **Referral Fields trong Order:**

#### **1. referral_code (String, Optional):**
- **Mô tả**: Mã giới thiệu từ saler/partner
- **Giá trị mặc định**: "DIRECT" (khi không có thông tin)
- **Ví dụ**: 
  - `"SALER001"` - Mã của saler A
  - `"AFF001"` - Mã của affiliate B
  - `"DIRECT"` - Mua trực tiếp

#### **2. referral_type (String, Optional):**
- **Mô tả**: Loại nguồn bán hàng
- **Giá trị mặc định**: "direct" (khi không có thông tin)
- **Enum values**:
  - `"saler"` - Bán qua saler
  - `"affiliate"` - Bán qua affiliate
  - `"direct"` - Bán trực tiếp
  - `"partner"` - Bán qua đối tác

### **Cách sử dụng:**

#### **Order bán qua saler:**
```json
{
  "referral_code": "SALER001",
  "referral_type": "saler"
}
```

#### **Order bán trực tiếp (mặc định):**
```json
{
  "referral_code": "DIRECT",
  "referral_type": "direct"
}
```

#### **Order bán qua affiliate:**
```json
{
  "referral_code": "AFF001",
  "referral_type": "affiliate"
}
```

### **API Endpoints hỗ trợ:**
- **POST** `/orders` - Tạo order thông thường
- **POST** `/orders/admin` - Tạo order cho user cụ thể

### **Business Logic:**
- Nếu không có `referral_code` → tự động set `"DIRECT"`
- Nếu không có `referral_type` → tự động set `"direct"`
- Các trường này được lưu vào database và trả về trong response
- Có thể dùng để query và thống kê order theo nguồn bán hàng 