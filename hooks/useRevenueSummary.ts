import { useQuery } from "@tanstack/react-query";
import { paymentsService } from "@/services/payments.service";

const REFETCH_INTERVAL_MS = 30 * 1000;

export function useRevenueSummary(eventId: string | null) {
  return useQuery({
    queryKey: ["payments", "revenue-summary", eventId],
    queryFn: () => paymentsService.getEventRevenueSummary(eventId!),
    enabled: !!eventId,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}
