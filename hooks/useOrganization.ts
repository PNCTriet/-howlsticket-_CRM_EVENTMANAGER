import { useQuery } from "@tanstack/react-query";
import { organizationsService } from "@/services/organizations.service";

export function useOrganization(organizationId: string | null) {
  return useQuery({
    queryKey: ["organization", organizationId],
    queryFn: () => organizationsService.getById(organizationId!),
    enabled: !!organizationId,
  });
}
