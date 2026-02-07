import { useQuery } from "@tanstack/react-query";
import { ticketsService } from "@/services/tickets.service";

const REFETCH_INTERVAL_MS = 30 * 1000;

export function useEventTickets(eventId: string | null) {
  return useQuery({
    queryKey: ["tickets", "event", eventId],
    queryFn: () => ticketsService.getByEventId(eventId!),
    enabled: !!eventId,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}
