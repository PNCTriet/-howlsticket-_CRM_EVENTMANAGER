import { api } from "@/lib/axios";
import type {
  DashboardEventStats,
  DashboardTimePoint,
} from "@/types/dashboard";

export const dashboardService = {
  getEventStats: async (eventId: string) => {
    const { data } = await api.get<DashboardEventStats>(
      `/dashboard/event/${eventId}`
    );
    return data;
  },

  getEventTime: async (
    eventId: string,
    params: { from: string; to: string; groupBy?: "day" | "week" | "month" }
  ) => {
    const { data } = await api.get<DashboardTimePoint[]>(
      `/dashboard/event/${eventId}/time`,
      { params }
    );
    return Array.isArray(data) ? data : [];
  },
};
