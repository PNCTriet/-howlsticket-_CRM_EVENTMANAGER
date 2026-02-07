import { useQuery } from "@tanstack/react-query";
import { eventsService } from "@/services/events.service";

export function useEvent(eventId: string | null) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventsService.getById(eventId!),
    enabled: !!eventId,
  });
}
