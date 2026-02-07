# QUY TẮC PHÁT TRIỂN – Howlsticket CRM

## 1. Tuân thủ tài liệu

- **UI/UX & Tech Stack:** Bắt buộc theo [`documents/UXUI_DOCUMENTATION.md`](./UXUI_DOCUMENTATION.md).
  - Layout: Sidebar trái (collapsible), Header trên, Content Bento Grid.
  - Styling: `bg-zinc-50`, card `bg-white rounded-xl border-zinc-200 shadow-sm`, Primary (Zinc/Black), Success (Emerald), Warning (Amber), Error (Rose).
  - Chỉ dùng **Lucide React** cho icon. Không dùng spinner, dùng Skeleton; feedback dùng Toaster (Sonner).
- **Lộ trình:** Làm theo [`documents/Roadmap.md`](./Roadmap.md). Sau khi hoàn thành từng hạng mục, **cập nhật Roadmap** (đánh dấu [x]) trong cùng PR/commit.
- **Ngôn ngữ:** Luôn hỗ trợ định dạng/ngôn ngữ **VI (Tiếng Việt)** và **EN (English)**; **VI là mặc định**. Dùng `LocaleProvider` và `useLocale()`; format ngày/tháng theo `dateFnsLocale`; chuẩn bị chuỗi hiển thị cho cả hai ngôn ngữ khi cần.
- **Dropdown / Popover:** Không dùng dropdown hoặc popover có nền trong suốt. Luôn dùng nền đặc (vd: `bg-white dark:bg-zinc-900`) cho nội dung dropdown/select/popover để chữ không chồng lên layout.

## 2. Quy tắc code

- **Cấu trúc:** Feature-based (vd: `app/(dashboard)/orders/components/...`).
- **API:** Mọi request qua `lib/axios.ts`; token gắn bằng interceptor; custom hooks cho từng API (vd: `useEventStats`, `useOrders`).
- **Đặt tên:** PascalCase cho component, camelCase cho function/biến.
- **Form:** React Hook Form + Zod. Validation schema đặt trong file riêng hoặc cùng feature.

## 3. Auth & bảo mật

- Login/Logout/Me theo [`Auth_documentation.md`](../Auth_documentation.md).
- Middleware bảo vệ `/dashboard/*`; không token/cookie session → redirect `/login?callbackUrl=...`.
- Không commit secret (API key, JWT secret, Supabase service role, v.v.) vào repo. Dùng `.env.local` và `.env.local.example` (chỉ biến, không giá trị thật).

## 4. Cập nhật Roadmap

- Mỗi khi hoàn thành một task trong Roadmap:
  1. Đánh dấu `[x]` cho task đó trong `documents/Roadmap.md`.
  2. Có thể bổ sung dòng ghi chú ngắn (vd: "Login: form + POST /auth/login") nếu cần.
- Giữ Phase 2, 3, 4, 5 nguyên cho đến khi bắt đầu làm phase tương ứng.
