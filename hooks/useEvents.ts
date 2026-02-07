import { useQuery } from "@tanstack/react-query";
import { eventsService } from "@/services/events.service";

export function useEvents(organizationId?: string) {
  return useQuery({
    queryKey: ["events", organizationId],
    queryFn: () => eventsService.list({ organization_id: organizationId }),
  });
}
