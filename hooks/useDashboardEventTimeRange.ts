import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { vietnamToUtcDateRange } from "@/lib/date-utils";
import type { DashboardTimePoint } from "@/types/dashboard";

const REFETCH_INTERVAL_MS = 15 * 1000;

/**
 * from/to: ngày theo Vietnam (UTC+7). Tự chuyển sang UTC trước khi gọi API.
 * API trả về có thể bao gồm ngày thừa (nếu backend dùng inclusive to),
 * nên filter theo to gốc để chỉ hiển thị đúng khoảng user chọn.
 */
export function useDashboardEventTimeRange(
  eventId: string | null,
  from: string,
  to: string
) {
  const { fromUtc, toUtc } = vietnamToUtcDateRange(from, to);

  return useQuery({
    queryKey: ["dashboard", "event", eventId, "time", fromUtc, toUtc],
    queryFn: async (): Promise<DashboardTimePoint[]> => {
      const data = await dashboardService.getEventTime(eventId!, {
        from: fromUtc,
        to: toUtc,
        groupBy: "day",
      });
      return data.filter((d) => {
        const dateKey = d.time.slice(0, 10);
        return dateKey >= from && dateKey <= to;
      });
    },
    enabled: !!eventId && !!from && !!to,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}
