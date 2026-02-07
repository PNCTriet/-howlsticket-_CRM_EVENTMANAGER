/** Response thực tế GET /dashboard/event/:id */
export interface DashboardEventStats {
  total_revenue?: string | number;
  total_tickets_sold?: number;
  total_orders?: { PAID?: number; CANCELLED?: number; EXPIRED?: number };
  total_checkins?: number;
  /** Fallback camelCase (nếu backend đổi) */
  totalRevenue?: number;
  revenue?: number;
  ticketsSold?: number;
  totalTicketsSold?: number;
  tickets_sold?: number;
  orderCount?: number;
  [key: string]: unknown;
}

export interface DashboardTimePoint {
  time: string;
  revenue: number;
  tickets_sold?: number;
  [key: string]: unknown;
}
