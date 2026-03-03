import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { getNextDayDateStr } from "@/lib/date-utils";
import type { DashboardTimePoint } from "@/types/dashboard";

const REFETCH_INTERVAL_MS = 15 * 1000;
const DASHBOARD_TIMEZONE = "Asia/Ho_Chi_Minh";

/**
 * from/to: chuỗi ngày (yyyy-MM-dd) theo timezone Vietnam, inclusive.
 * Backend có thể dùng `to` exclusive (date < to), nên gửi toApi = to + 1 ngày
 * rồi lọc response để chỉ giữ ngày trong [from, to].
 */
export function useDashboardEventTimeRange(
  eventId: string | null,
  from: string,
  to: string
) {
  const toApi = getNextDayDateStr(to);

  return useQuery({
    queryKey: ["dashboard", "event", eventId, "time", from, to, DASHBOARD_TIMEZONE],
    queryFn: async (): Promise<DashboardTimePoint[]> => {
      const data = await dashboardService.getEventTime(eventId!, {
        from,
        to: toApi,
        groupBy: "day",
        timezone: DASHBOARD_TIMEZONE,
      });
      const dateKey = (d: DashboardTimePoint) => d.time.slice(0, 10);
      return data.filter((d) => dateKey(d) >= from && dateKey(d) <= to);
    },
    enabled: !!eventId && !!from && !!to,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}
