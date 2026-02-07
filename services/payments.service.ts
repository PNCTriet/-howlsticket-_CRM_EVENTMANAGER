import { api } from "@/lib/axios";

export interface TicketStat {
  ticket_name: string;
  total_quantity: number;
  total_revenue: number;
  order_count?: number;
}

export interface RevenueSummaryResponse {
  event?: { id: string; title: string };
  summary?: {
    totalRevenue?: number;
    totalPayments?: number;
    totalOrders?: number;
    averageOrderValue?: number;
  };
  ticketStats?: TicketStat[];
  dailyStats?: unknown[];
}

export const paymentsService = {
  getEventRevenueSummary: async (eventId: string) => {
    const { data } = await api.get<RevenueSummaryResponse>(
      `/payments/event/${eventId}/revenue-summary`
    );
    return data;
  },
};
