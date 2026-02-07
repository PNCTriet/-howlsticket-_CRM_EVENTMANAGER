import { useQuery } from "@tanstack/react-query";
import { subDays, format } from "date-fns";
import { dashboardService } from "@/services/dashboard.service";

const REFETCH_INTERVAL_MS = 30 * 1000;

export function useDashboardEventTime(eventId: string | null) {
  const to = new Date();
  const from = subDays(to, 30);
  const fromStr = format(from, "yyyy-MM-dd");
  const toStr = format(to, "yyyy-MM-dd");

  return useQuery({
    queryKey: ["dashboard", "event", eventId, "time", fromStr, toStr],
    queryFn: () =>
      dashboardService.getEventTime(eventId!, {
        from: fromStr,
        to: toStr,
        groupBy: "day",
      }),
    enabled: !!eventId,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}
