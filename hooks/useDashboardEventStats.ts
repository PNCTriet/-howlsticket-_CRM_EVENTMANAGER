import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

const REFETCH_INTERVAL_MS = 30 * 1000;

export function useDashboardEventStats(eventId: string | null) {
  return useQuery({
    queryKey: ["dashboard", "event", eventId],
    queryFn: () => dashboardService.getEventStats(eventId!),
    enabled: !!eventId,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}
