import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { dashboardService } from "@/services/dashboard.service";

const REFETCH_INTERVAL_MS = 30 * 1000;

export function useDashboardEventTimeRange(
  eventId: string | null,
  from: string,
  to: string
) {
  return useQuery({
    queryKey: ["dashboard", "event", eventId, "time", from, to],
    queryFn: () =>
      dashboardService.getEventTime(eventId!, {
        from,
        to,
        groupBy: "day",
      }),
    enabled: !!eventId && !!from && !!to,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}
