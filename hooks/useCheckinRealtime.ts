import { useQuery } from "@tanstack/react-query";
import { checkinService } from "@/services/checkin.service";

const REFETCH_INTERVAL_MS = 30 * 1000;

export function useCheckinRealtime(eventId: string | null) {
  return useQuery({
    queryKey: ["checkin", "realtime", eventId],
    queryFn: () => checkinService.getRealtime(eventId!),
    enabled: !!eventId,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}
