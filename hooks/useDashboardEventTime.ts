import { useQuery } from "@tanstack/react-query";
import { subDays, format } from "date-fns";
import { dashboardService } from "@/services/dashboard.service";
import { vietnamToUtcDateRange } from "@/lib/date-utils";

const REFETCH_INTERVAL_MS = 30 * 1000;

export function useDashboardEventTime(eventId: string | null) {
  const to = new Date();
  const from = subDays(to, 30);
  const fromStr = format(from, "yyyy-MM-dd");
  const toStr = format(to, "yyyy-MM-dd");
  const { fromUtc, toUtc } = vietnamToUtcDateRange(fromStr, toStr);

  return useQuery({
    queryKey: ["dashboard", "event", eventId, "time", fromUtc, toUtc],
    queryFn: () =>
      dashboardService.getEventTime(eventId!, {
        from: fromUtc,
        to: toUtc,
        groupBy: "day",
      }),
    enabled: !!eventId,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}
