import type { AppLocale } from "@/providers/locale-provider";

/** Bản dịch dashboard và dùng chung – VI (mặc định) và EN */
export const dashboardTranslations = {
  // Page
  overview: { vi: "Tổng quan", en: "Overview" },
  overviewDesc: {
    vi: "Doanh thu, vé đã bán, check-in và đơn hàng gần đây",
    en: "Revenue, tickets sold, check-in and recent orders",
  },

  // StatsCards
  revenue: { vi: "Doanh thu", en: "Revenue" },
  revenueToday: { vi: "Trong ngày", en: "Today" },
  vsYesterday: { vi: "so với hôm trước", en: "vs yesterday" },
  ticketsSold: { vi: "Vé đã bán", en: "Tickets sold" },
  ticketsTotal: { vi: "tổng", en: "total" },
  checkinRealtime: { vi: "Check-in realtime", en: "Check-in realtime" },

  // EventSelector & EventInfoCard
  selectEvent: { vi: "Chọn sự kiện", en: "Select event" },
  noEvents: { vi: "Chưa có sự kiện", en: "No events" },
  eventDate: { vi: "Ngày diễn ra", en: "Event date" },
  countdown: { vi: "Đếm ngược", en: "Countdown" },
  revenueTarget: { vi: "Doanh thu / Mục tiêu", en: "Revenue / Target" },
  daysLeft: { vi: "{n} ngày", en: "{n} days" },
  hoursLeft: { vi: "{n} giờ", en: "{n} hours" },
  past: { vi: "Đã diễn ra", en: "Past" },
  noEventSelected: { vi: "Chọn sự kiện", en: "Select an event" },

  // RevenueChart
  revenueOverTime: { vi: "Doanh thu theo thời gian", en: "Revenue over time" },
  filterByTimeOrRange: {
    vi: "Lọc theo mốc thời gian hoặc chọn khoảng ngày",
    en: "Filter by time range or select date range",
  },
  noDataInRange: {
    vi: "Chưa có dữ liệu trong khoảng đã chọn",
    en: "No data in selected range",
  },
  revenueHeatmap: {
    vi: "Lịch doanh thu tháng",
    en: "Monthly revenue calendar",
  },
  revenueHeatmapDesc: {
    vi: "Độ đậm theo tỉ lệ doanh thu trong tháng (phát triển thêm sau)",
    en: "Intensity by revenue share in month (more features later)",
  },

  // RevenueByDayTable
  revenueByDay: { vi: "Bảng doanh thu theo ngày", en: "Revenue by day" },
  revenueByDayDesc: {
    vi: "Dữ liệu từ Howlsticket",
    en: "Data from dashboard/event/:id/time API",
  },
  day: { vi: "Ngày", en: "Date" },
  revenueCol: { vi: "Doanh thu", en: "Revenue" },
  ticketsSoldCol: { vi: "Vé bán", en: "Tickets sold" },
  total: { vi: "Tổng", en: "Total" },

  // RevenueByChannelTable
  revenueByChannel: { vi: "Doanh thu theo kênh", en: "Revenue by channel" },
  revenueByChannelDesc: { vi: "Giả lập – API bổ sung sau", en: "Mock – API to be added" },
  channel: { vi: "Kênh", en: "Channel" },
  share: { vi: "Tỷ trọng", en: "Share" },
  direct: { vi: "Trực tiếp", en: "Direct" },
  otherChannel: { vi: "Kênh khác", en: "Other" },
  mockDataNote: {
    vi: "Dữ liệu mẫu. Sẽ kết nối API khi backend hỗ trợ.",
    en: "Sample data. Will connect to API when backend supports.",
  },

  // RecentOrdersTable
  recentActivity: { vi: "Hoạt động gần đây", en: "Recent activity" },
  searchAndViewOrders: {
    vi: "Tìm kiếm và xem chi tiết đơn hàng",
    en: "Search and view order details",
  },
  searchPlaceholder: {
    vi: "Tìm đơn, email, trạng thái...",
    en: "Search order, email, status...",
  },
  showRows: { vi: "Hiển thị {n} dòng", en: "Show {n} rows" },
  viewAll: { vi: "Xem tất cả", en: "View all" },
  noOrdersMatch: { vi: "Không có đơn nào khớp tìm kiếm.", en: "No orders match search." },
  noOrdersYet: { vi: "Chưa có đơn hàng nào.", en: "No orders yet." },
  goToOrdersPage: { vi: "Đến trang đơn hàng", en: "Go to orders page" },
  codeOrTime: { vi: "Mã / Thời gian", en: "ID / Time" },
  customer: { vi: "Khách", en: "Customer" },
  status: { vi: "Trạng thái", en: "Status" },

  // OrderDetailDialog
  orderDetail: { vi: "Chi tiết đơn hàng", en: "Order details" },
  orderLoadError: { vi: "Không tải được đơn hàng.", en: "Could not load order." },
  orderInfo: { vi: "Thông tin đơn", en: "Order info" },
  customerInfo: { vi: "Thông tin khách", en: "Customer info" },
  orderCode: { vi: "Mã đơn", en: "Order ID" },
  time: { vi: "Thời gian", en: "Time" },
  totalAmount: { vi: "Tổng tiền", en: "Total" },
  ticketDetails: { vi: "Chi tiết vé / sản phẩm", en: "Ticket / item details" },
  ticket: { vi: "Vé", en: "Ticket" },
  fullName: { vi: "Họ tên", en: "Full name" },
  email: { vi: "Email", en: "Email" },
  phone: { vi: "Số điện thoại", en: "Phone" },
  facebook: { vi: "Facebook", en: "Facebook" },
  noCustomerInfo: { vi: "Không có thông tin khách hàng.", en: "No customer information." },
} as const;

export type DashboardTranslationKey = keyof typeof dashboardTranslations;

export function getDashboardTranslation(
  key: DashboardTranslationKey,
  locale: AppLocale
): string {
  const s = dashboardTranslations[key][locale];
  return s ?? dashboardTranslations[key].vi;
}

/** Thay thế placeholder {n} trong chuỗi (vd. "Hiển thị {n} dòng" -> "Hiển thị 5 dòng") */
export function interpolate(
  str: string,
  params: Record<string, string | number>
): string {
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    str
  );
}
